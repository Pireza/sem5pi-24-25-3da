using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
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

    public StaffUserController(Auth0UserService auth0Service, PasswordGeneratorService passService, UserContext context, UserRepository repository)
    {
        _auth0Service = auth0Service;
        _passService = passService;
        _context = context;
        _repository = repository;
    }

[HttpGet("all-staff-emails")]
/// <summary>
/// This method retrieves all the emails of staff members with the roles 'Doctor' or 'Nurse' from the system.
/// </summary>
/// <returns>
/// A list of staff emails. If no staff emails are found, returns NotFound.
/// </returns>
public async Task<IActionResult> GetAllStaffEmails()
{
    try
    {
        // Query the user context for all users with the 'Doctor' or 'Nurse' role
        var staffEmails = await _context.Users
            .Where(u => u.Role == "Doctor" || u.Role == "Nurse")  // Check for both 'Doctor' and 'Nurse' roles
            .Select(u => u.Email)  // Select only the emails of staff users
            .ToListAsync();

        if (staffEmails == null || !staffEmails.Any())
        {
            return NotFound("No staff emails found.");
        }

        // Return the list of staff emails
        return Ok(staffEmails);
    }
    catch (Exception ex)
    {
        // Handle any unexpected errors
        return BadRequest($"Error retrieving staff emails: {ex.Message}");
    }
}


[HttpGet("staff-by-email/{email}")]
/// <summary>
/// This method retrieves all the information of a staff member based on the provided email.
/// </summary>
/// <param name="email">The email of the staff member.</param>
/// <returns>
/// Returns the staff details if found, or NotFound if no staff with the provided email exists.
/// </returns>
public async Task<IActionResult> GetStaffByEmail(string email)
{
    try
    {
        // Query the repository to find staff by email
        var staff = await _repository.checkStaffEmail(email);

        if (staff == null)
        {
            return NotFound($"No staff found with the email: {email}");
        }

        // Return the staff details
        return Ok(staff);
    }
    catch (Exception ex)
    {
        // Handle any unexpected errors
        return BadRequest($"Error retrieving staff details: {ex.Message}");
    }
}


    // GET: api/Staff/{id}
    [HttpGet("{id}")]
    /// <summary>
    /// This method returns the staff user that has the Id passed as argument
    /// </summary>
    /// <param name="id"></param>
    /// <returns>
    /// If the User is found in the system -> Staff object
    /// Else -> Not Found
    /// </returns>
    public async Task<ActionResult<Staff>> GetStaff(long id)
    {
        var staff = await _repository.getStaff(id);

        if (staff == null)
        {
            return NotFound();
        }

        return staff;
    }
    /// <summary>
    /// This method allows the user to send a password reset link to their personal email
    /// which is passed as the argument for the method itself
    /// </summary>
    /// <param name="request">User email</param>
    /// <returns> 
    /// If the email is not correctly formatted or empty -> Bad Request
    /// Else if the request is correct -> Ok
    /// In case an unexpected error occurs -> Bad Request
    /// </returns>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] EmailRequest request)
    {
        if (string.IsNullOrEmpty(request.Email))
            return BadRequest("Email must not be empty");

        try
        {
            MailAddress mail = new MailAddress(request.Email);
        }
        catch (FormatException)
        {
            return BadRequest("Email format not supported");
        }

        try
        {
            await _auth0Service.ResetPasswordAsync(request.Email);
            return Ok("Password reset email sent successfuly");
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost("register")]
    /// <summary>
    /// This method is used to register new Backoffice (Staff) Users in the system
    /// </summary>
    /// <param name="model">
    /// This model is a structure with the following fields:
    ///     - Username : string
    ///     - Email : string
    ///     - Role : string
    /// </param>
    /// <returns>
    /// If the argument is NULL, or the role specified doesn't exist or there
    /// is already a User in the system with unique attributes as the one passed
    /// returns -> Bad Request
    /// 
    /// Else -> Ok
    /// </returns>
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
            return BadRequest("ERROR: User could not be added");
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
            AvailabilitySlots = request.AvailabilitySlots,
            IsActive = true
        };

        // Add the new staff to the context and save changes to the database
        _context.Staff.Add(newStaff);
        await _context.SaveChangesAsync();

        // Return a response with status 201 Created
        return CreatedAtAction(nameof(GetStaff), new { id = newStaff.Id }, newStaff);
    }


    // PUT: api/StaffUser/email/UpdateStaffProfileAsAdmin/{email}
[HttpPut("email/UpdateStaffProfileAsAdmin/{email}")]
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
    var staff = await _repository.checkStaffEmail(email);

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
        var newSpecialization = await _repository.specChange(specializationId);

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

        await _repository.LogAuditChangeAsync(staff.Id, changes);
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!_repository.StaffExists(staff.Id))
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


    // PUT: api/Staffs/deactivate/{id}
    [Authorize(Policy = "AdminOnly")]
    [HttpPut("deactivate/{id}")]
    public async Task<IActionResult> DeactivateStaff(long id)
    {
        var staff = await _repository.getStaff(id);
        if (staff == null)
        {
            return NotFound("Staff member not found.");
        }

        if (!staff.IsActive)
        {
            return BadRequest("Staff member is already deactivated.");
        }

        staff.IsActive = false;

        _context.Entry(staff).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();

            var changes = new List<string> { "Staff profile deactivated" };
            await _repository.LogAuditChangeAsync(staff.Id, changes);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_repository.StaffExists(staff.Id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return Ok("Staff member has been successfully deactivated.");
    }


    [Authorize(Policy = "AdminOnly")]
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Staff>>> SearchStaff(
        [FromQuery] string? name = null,
        [FromQuery] string? email = null,
        [FromQuery] string? specialization = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _repository.GetStaffQueryable();

        // Apply search filters
        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(s => s.FirstName.Contains(name) || s.LastName.Contains(name));
        }
        if (!string.IsNullOrEmpty(email))
        {
            query = query.Where(s => s.Email.Contains(email));
        }
        if (!string.IsNullOrEmpty(specialization))
        {
            query = query.Where(s => s.Specialization != null &&
                                    s.Specialization.SpecDescription.Contains(specialization));
        }

        // Pagination logic
        var totalRecords = await query.CountAsync();

        // Paginate results
        var staff = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var response = new
        {
            TotalRecords = totalRecords,
            Page = page,
            PageSize = pageSize,
            Staff = staff.Select(s => new

            {
                s.Id,
                s.FirstName,
                s.LastName,
                s.Email,
                Specialization = s.Specialization != null ? s.Specialization.SpecDescription : null
            })
        };

           
        // Return paginated staff profiles
        return Ok(response);
    }

}




