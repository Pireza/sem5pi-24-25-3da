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
    public async Task<ActionResult<IEnumerable<SpecializedStaff>>> GetSpecializedStaff()
    {
        return await _context.SpecializedStaff.ToListAsync();
    }

    // GET: api/Specialization/{id}
    [HttpGet("staff/{id}")]
    public async Task<ActionResult<SpecializedStaff>> GetSpecializedStaff(long id)
    {
        var specialization = await _context.SpecializedStaff.FindAsync(id);

        if (specialization == null)
        {
            return NotFound();
        }

        return specialization;
    }


    //POST: api/Specialization

    [HttpPost("staff")]
    public async Task<ActionResult<SpecializedStaff>> PostSpecializedStaff(SpecializedStaff staff)
    {
        var specialization = await _context.Specializations.FindAsync(staff.Specialization);

        if(specialization == null){
            return BadRequest("The specified Specialization doesn't exist");
        }


        _context.SpecializedStaff.Add(staff);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetSpecializedStaff", new { id = staff.Id }, staff);
    }



}