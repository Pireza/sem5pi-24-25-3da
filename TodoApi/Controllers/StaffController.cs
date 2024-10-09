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
}