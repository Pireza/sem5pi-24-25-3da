using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

/// <summary>
/// Controller for managing specializations and specialized staff.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class SpecializationController : ControllerBase
{
    private readonly SpecializationService _service;
    private readonly UserContext _context;

    /// <summary>
    /// Initializes a new instance of the <see cref="SpecializationController"/> class.
    /// </summary>
    /// <param name="service">The specialization service.</param>
    /// <param name="context">The user context.</param>
    public SpecializationController(SpecializationService service, UserContext context)
    {
        _service = service;
        _context = context;
    }

    /// <summary>
    /// Gets all specializations.
    /// </summary>
    /// <returns>A list of specializations.</returns>
    [Authorize(Policy = "AdminOnly")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Specialization>>> GetSpecialization()
    {
        var list = await _service.GetAllSpecializationAsync();
        return Ok(list);
    }

    /// <summary>
    /// Gets filtered specializations based on search criteria.
    /// </summary>
    /// <param name="search">The search criteria.</param>
    /// <returns>A list of filtered specializations.</returns>
    [HttpGet("filter")]
    public async Task<ActionResult<IEnumerable<Specialization>>> GetFilteredSpecializations([FromQuery] SpecializationSearchDTO search)
    {
        var filteredList = await _service.GetFilteredSpecializationAsync(search);
        return Ok(filteredList);
    }

    /// <summary>
    /// Gets a specialization by ID.
    /// </summary>
    /// <param name="id">The specialization ID.</param>
    /// <returns>The specialization.</returns>
    [Authorize(Policy = "AdminOnly")]
    [HttpGet("{id}")]
    public async Task<ActionResult<Specialization>> GetById(long id)
    {
        var spec = await _service.GetByIdAsync(id);
        if (spec == null)
            return NotFound();
        return spec;
    }

    /// <summary>
    /// Creates a new specialization.
    /// </summary>
    /// <param name="specialization">The specialization to create.</param>
    /// <returns>The created specialization.</returns>
    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<ActionResult<Specialization>> PostSpecialization(Specialization specialization)
    {
        var spec = await _service.AddSpecializationAsync(specialization);
        return CreatedAtAction("GetSpecialization", new { id = specialization.SpecId }, specialization);
    }

    /// <summary>
    /// Deletes a specialization by ID.
    /// </summary>
    /// <param name="id">The specialization ID.</param>
    /// <returns>The deleted specialization.</returns>
    [Authorize(Policy = "AdminOnly")]
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

    /// <summary>
    /// Updates a specialization.
    /// </summary>
    /// <param name="id">The specialization ID.</param>
    /// <param name="specialization">The specialization to update.</param>
    /// <returns>The updated specialization.</returns>
    [Authorize(Policy = "AdminOnly")]
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

    /// <summary>
    /// Gets all specialized staff.
    /// </summary>
    /// <returns>A list of specialized staff.</returns>
    [HttpGet("staff")]
    public async Task<ActionResult<IEnumerable<SpecializedStaff>>> GetSpecializedStaff()
    {
        return await _context.SpecializedStaff.ToListAsync();
    }

    /// <summary>
    /// Gets all specialized staff with their full specialization details.
    /// </summary>
    /// <returns>A list of specialized staff with specialization details.</returns>
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

    /// <summary>
    /// Gets a specialized staff member by ID.
    /// </summary>
    /// <param name="id">The staff ID.</param>
    /// <returns>The specialized staff member.</returns>
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

    /// <summary>
    /// Creates a new specialized staff member.
    /// </summary>
    /// <param name="staff">The specialized staff member to create.</param>
    /// <returns>The created specialized staff member.</returns>
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

    /// <summary>
    /// Gets the names of all specializations.
    /// </summary>
    /// <returns>A list of specialization names.</returns>
    [HttpGet("names")]
    public async Task<ActionResult<IEnumerable<string>>> GetSpecializationsNames()
    {
        return await _context.Specializations.Select(s => s.SpecDescription).ToListAsync();
    }
}