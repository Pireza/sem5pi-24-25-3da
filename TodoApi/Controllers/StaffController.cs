using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

[Route("api/[controller]")]
[ApiController]
public class StaffController : ControllerBase
{
    private readonly UserContext _context;

    public StaffController(UserContext context)
    {
        _context = context;
    }

    // GET: api/Staff
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Staff>>> GetStaff()
    {
        return await _context.Staff.ToListAsync();
    }

    // GET: api/Staff/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Staff>> GetStaff(long id)
    {
        var staff = await _context.Staff.FindAsync(id);

        if (staff == null)
        {
            return NotFound();
        }

        return staff;
    }


    //POST: api/Staff

    [HttpPost]
    public async Task<ActionResult<Staff>> PostStaff(Staff staff)
    {
        _context.Staff.Add(staff);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetStaff", new { id = staff.Id }, staff);
    }

[HttpPost("CreateStaffAsAdmin")]
// POST: api/Staffs
public async Task<ActionResult<Staff>> CreateStaff([FromBody] CreateStaffRequest request)
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
    var existingStaff = await _context.Staff
        .FirstOrDefaultAsync(s => s.LicenseNumber == request.LicenseNumber || s.Phone == request.Phone || s.Email == request.Email);

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



}