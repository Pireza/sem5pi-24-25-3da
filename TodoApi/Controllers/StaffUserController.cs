using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;
using TodoApi.Models;

[Route("api/[controller]")]
[ApiController]
public class StaffUserController : ControllerBase
{
    private readonly Auth0UserService _auth0Service;
    private readonly PasswordGeneratorService _passService;
    private readonly UserContext _context;
    private UserRepository _repository;

    public StaffUserController(Auth0UserService auth0Service, PasswordGeneratorService passService, UserContext context)
    {
        _auth0Service = auth0Service;
        _passService = passService;
        _context = context;
    }

    // GET: api/Staff/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Staff>> GetStaff(long id)
    {
       var staff = await _repository.getStaff(id);

        if (staff == null)
        {
            return NotFound();
        }

        return staff;
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] string email)
    {
        if (string.IsNullOrEmpty(email))
            return BadRequest("Email must not be empty");

        try
        {
            MailAddress mail = new MailAddress(email);
        }
        catch (FormatException)
        {
            return BadRequest("Email format not supported");
        }

        try
        {
            await _auth0Service.ResetPasswordAsync(email);
            return Ok("Password reset email sent successfuly");
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto model)
    {
        if (model == null)
        {
            return BadRequest("User information is required.");
        }

        try
        {

            await _auth0Service.RegisterNewStaff(model, _passService.GeneratePassword());
            return Ok();
        }
        catch (InvalidDataException)
        {
            return BadRequest("Role does not exist in the system");
        }
        catch (UserAlreadyExistsException)
        {
            return BadRequest("User already exists in the system");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Authorize(Policy = "AdminOnly")]
    [HttpPost("CreateStaffAsAdmin")]
    // POST: api/Staffs
    public async Task<ActionResult<Staff>> CreateStaffAsAdmin([FromBody] CreateStaffRequest request)
    {
        // Basic validation for required fields
        if (string.IsNullOrEmpty(request.FirstName) || string.IsNullOrEmpty(request.LastName))
        {
            return BadRequest("First name and last name are required.");
        }

        if (string.IsNullOrEmpty(request.LicenseNumber))
        {
            return BadRequest("License number is required.");
        }

        if (string.IsNullOrEmpty(request.Phone))
        {
            return BadRequest("Phone number is required.");
        }

        if (string.IsNullOrEmpty(request.Email))
        {
            return BadRequest("Email is required.");
        }

        // Check if a staff member with the same license number or phone already exists
        var existingStaff = await _repository.checkStaff(request);

        if (existingStaff != null)
        {
            return Conflict("A staff member with the same license number, phone number, or email already exists.");
        }

        // Create a new instance of Staff with the provided data
        var newStaff = new Staff
        {
            UserName = request.Username,
            FirstName = request.FirstName,
            LastName = request.LastName,
            FullName = $"{request.FirstName} {request.LastName}",
            LicenseNumber = request.LicenseNumber,
            Phone = request.Phone,
            Specialization = request.Specialization,
            Email = request.Email,
            Role = request.Role,  // Optional field for role
            AvailabilitySlots = request.AvailabilitySlots
        };

        // Add the new staff to the context and save changes to the database
        _context.Staff.Add(newStaff);
        await _context.SaveChangesAsync();

        // Return a response with status 201 Created
        return CreatedAtAction(nameof(GetStaff), new { id = newStaff.Id }, newStaff);
    }



    // PUT: api/Staffs/email/Admin{email}
    [HttpPut("email/UpdateStaffProfileAsAdmin{email}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> PutStaffUpdateAsAdmin(
        string email,
        [FromQuery] string? firstName = null,
        [FromQuery] string? lastName = null,
        [FromQuery] string? phone = null,
        [FromQuery] long? specializationId = null, // Assuming you're passing the specialization ID
        [FromQuery] string? role = null,
        [FromQuery] List<AvailabilitySlot>? availabilitySlots = null)
    {
        var staff = await _context.Staff
            .FirstOrDefaultAsync(s => s.Email == email);

        if (staff == null)
        {
            return NotFound();
        }

        var changes = new List<string>();

        // Update the staff's properties based on the provided parameters
        if (!string.IsNullOrEmpty(firstName))
        {
            changes.Add($"FirstName changed from {staff.FirstName} to {firstName}");
            staff.FirstName = firstName;
        }

        if (!string.IsNullOrEmpty(lastName))
        {
            changes.Add($"LastName changed from {staff.LastName} to {lastName}");
            staff.LastName = lastName;
        }

        if (!string.IsNullOrEmpty(phone))
        {
            changes.Add($"Phone changed from {staff.Phone} to {phone}");
            staff.Phone = phone;
        }

        // Handling Specialization change (assuming specialization is passed by ID)
        if (specializationId != null)
        {
            var newSpecialization = await _context.Specializations
                .FirstOrDefaultAsync(s => s.SpecId == specializationId);

            if (newSpecialization != null && (staff.Specialization == null || staff.Specialization.SpecId != newSpecialization.SpecId))
            {
                changes.Add($"Specialization changed from {staff.Specialization?.SpecDescription ?? "None"} to {newSpecialization.SpecDescription}");
                staff.Specialization = newSpecialization;
            }
        }

        if (!string.IsNullOrEmpty(role))
        {
            changes.Add($"Role changed from {staff.Role} to {role}");
            staff.Role = role;
        }

        if (availabilitySlots != null && availabilitySlots.Any())
        {
            var oldSlots = string.Join(", ", staff.AvailabilitySlots.Select(s => s.ToString())); // Modify this according to AvailabilitySlot's string representation
            var newSlots = string.Join(", ", availabilitySlots.Select(s => s.ToString()));
            changes.Add($"AvailabilitySlots changed from [{oldSlots}] to [{newSlots}]");
            staff.AvailabilitySlots = availabilitySlots;
        }

        _context.Entry(staff).State = EntityState.Modified;

        try
        {
            // Logging changes to the audit log
            var auditLog = new AuditLogStaff
            {
                StaffId = staff.Id,
                ChangeDate = DateTime.UtcNow,
                ChangeDescription = string.Join(", ", changes)
            };

            _context.AuditLogStaff.Add(auditLog);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StaffExists(staff.Id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    private bool StaffExists(long id)
    {
        return _context.Staff.Any(e => e.Id == id);
    }
}




