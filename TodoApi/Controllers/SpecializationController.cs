using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

[Route("api/[controller]")]
[ApiController]
public class SpecializationController : ControllerBase
{
    private readonly UserContext _context;

    public SpecializationController(UserContext context)
    {
        _context = context;
    }

    // GET: api/Specialization
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Specialization>>> GetSpecialization()
    {
        return await _context.Specializations.ToListAsync();
    }

    // GET: api/Specialization/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Specialization>> GetSpecialization(long id)
    {
        var specialization = await _context.Specializations.FindAsync(id);

        if (specialization == null)
        {
            return NotFound();
        }

        return specialization;
    }


    //POST: api/Specialization

    [HttpPost]
    public async Task<ActionResult<Specialization>> PostSpecialization(Specialization specialization)
    {
        _context.Specializations.Add(specialization);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetSpecialization", new { id = specialization.SpecId }, specialization);
    }

    // |===============================================|
    // | Following methods regarding Specialized Staff |
    // |===============================================|

    // GET: api/Specialization/staff
    [HttpGet("staff")]
    public async Task<ActionResult<IEnumerable<SpecializationStaffDTO>>> GetSpecializedStaff()
    {
        return await _context.SpecializedStaff.Select(x => StaffToDTO(x)).ToListAsync();
    }

    // GET: api/Specialization/{id}
    [HttpGet("staff/{id}")]
    public async Task<ActionResult<SpecializationStaffDTO>> GetSpecializedStaff(long id)
    {
        var specialization = await _context.SpecializedStaff.FindAsync(id);

        if (specialization == null)
        {
            return NotFound();
        }

        return StaffToDTO(specialization);
    }


    //POST: api/Specialization

    [HttpPost("staff")]
    public async Task<ActionResult<SpecializationStaffDTO>> PostSpecializedStaff(SpecializationStaffDTO staff)
    {
        var specialization = await _context.Specializations.FindAsync(staff.Specialization);

        if(specialization == null){
            return BadRequest("The specified Specialization doesn't exist");
        }

        var ret = new SpecializedStaff 
        {
            Role = staff.Role,
            Specialization = specialization
        };

        _context.SpecializedStaff.Add(ret);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetSpecializedStaff", new { id = ret.Id }, ret);
    }

    private static SpecializationStaffDTO StaffToDTO (SpecializedStaff specializedStaff) =>
        new SpecializationStaffDTO
        {
            Id = specializedStaff.Id,
            Role = specializedStaff.Role,
            Specialization = specializedStaff.Id
        };

}