using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

[Route("api/[controller]")]
[ApiController]
public class SpecializationController : ControllerBase
{
    private readonly SpecializationService _service;
    private readonly UserContext _context;

    public SpecializationController(SpecializationService service, UserContext context)
    {
        _service = service;
        _context = context;
    }

    // GET: api/Specialization
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Specialization>>> GetSpecialization()
    {
        return await _service.GetAllSpecializationAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Specialization>> GetById(long id)
    {
        var spec = await _service.GetByIdAsync(id);
        if (spec == null)
            return NotFound();
        return spec;
    }


    //POST: api/Specialization

    [HttpPost]
    public async Task<ActionResult<Specialization>> PostSpecialization(Specialization specialization)
    {
        var spec = await _service.AddSpecializationAsync(specialization);
        return CreatedAtAction("GetSpecialization", new { id = specialization.SpecId }, specialization);
    }

    [HttpDelete("{id}")]

    public async Task<ActionResult<Specialization>> DeleteSpecialization(long id)
    {
        try
        {
            var spec = await _service.DeleteSpecializationAsync(id);
            if (spec == null)
                return NotFound();

            return Ok(spec);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPut("{id}")]

    public async Task<ActionResult<Specialization>> PutSpecialization(long id, Specialization specialization)
    {
        if (id != specialization.SpecId)
            return BadRequest();

        try
        {
            var spec = await _service.ChangeSpecializationAsync(specialization);
            if (spec == null)
                return NotFound();
            return Ok(spec);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
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

    [HttpGet("staff-complete")]
    public async Task<ActionResult<IEnumerable<SpecializationDTO>>> GetSpecializedStaffFull()
    {
        return await (from staff in _context.SpecializedStaff
                      join specialization in _context.Specializations
                      on staff.SpecializationId equals specialization.SpecId
                      select new SpecializationDTO
                      {
                          Id = staff.Id,
                          Role = staff.Role,
                          Specialization = specialization.SpecDescription
                      }).ToListAsync();

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
        var specialization = await _context.Specializations.FindAsync(staff.SpecializationId);

        if (specialization == null)
        {
            return BadRequest("The specified Specialization doesn't exist");
        }


        _context.SpecializedStaff.Add(staff);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetSpecializedStaff", new { id = staff.Id }, staff);
    }

    [HttpGet("names")]
    public async Task<ActionResult<IEnumerable<string>>> GetSpecializationsNames()
    {
        return await _context.Specializations.Select(s => s.SpecDescription).ToListAsync();
    }


}