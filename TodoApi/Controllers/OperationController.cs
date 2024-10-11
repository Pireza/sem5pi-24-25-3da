using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;

[Route("api/[controller]")]
[ApiController]

public class OperationController : ControllerBase
{
    private readonly OperationService _service;
    private const string DurationPattern = @"^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
    private const string DatePattern = @"^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(\\d{4})$";
    private const string PENDING_STATUS = "pending";
    private const string APPROVED_STATUS = "approved";
    private const string ACTIVE_STATUS = "active";
    private const string INACTIVE_STATUS = "inactive";

    public OperationController(OperationService service)
    {
        _service = service;
    }

    // GET: api/operation/priority
    [HttpGet("priority")]
    public async Task<ActionResult<IEnumerable<OperationPriority>>> GetPriorities()
    {
        return await _service.GetAllPrioAsync();
    }

    // GET: api/operation/priority/{id}
    [HttpGet("priority/{id}")]
    public async Task<ActionResult<OperationPriority>> GetPriority(long id)
    {
        var priority = await _service.GetPrioByIdAsync(id);

        if (priority == null)
        {
            return NotFound();
        }

        return priority;
    }


    //POST: api/operation/priority

    [HttpPost("priority")]
    public async Task<ActionResult<OperationPriority>> PostPriority(OperationPriority priority)
    {
        var prio = await _service.AddPrioAsync(priority);
        return CreatedAtAction("GetPriority", new { id = priority.Id }, priority);
    }

    // |=============================================|
    // | Following methods regarding Operation Types |
    // |=============================================|

    // GET: api/operation/type
    [HttpGet("type")]

    public async Task<ActionResult<IEnumerable<OperationType>>> GetTypes()
    {
        return await _service.GetAllTypeAsync();
    }

/*
    // GET: api/operation/type/{id}
    [HttpGet("type/{id}")]
    public async Task<ActionResult<OperationType>> GetType(long id)
    {
        var type = await _context.Types.FindAsync(id);

        if (type == null)
        {
            return NotFound();
        }

        return type;
    }

*/
    //POST: api/operation/type
    /*
        [HttpPost("type")]
        public async Task<ActionResult<OperationTypeDTO>> PostType(OperationTypeDTO typeDTO)
        {

            if (!string.IsNullOrEmpty(typeDTO.Duration))
            {
                Regex regex = new Regex(DurationPattern);
                if (!regex.IsMatch(typeDTO.Duration))
                {
                    return BadRequest("Operation type duration should be in the HH:mm:ss format");
                }
            }

            var operationType = new OperationType
            {
                Id = typeDTO.Id,
                Name = typeDTO.Name,
                Duration = typeDTO.Duration,
                Status = "active",
                Specializations = new List<Specialization>(typeDTO.Specializations)
            };


            // The following try/catch clause catches the cases where there is already a type with the same name
            try
            {
                _context.Types.Add(operationType);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Operation type with that name already exists.");
            }

            return CreatedAtAction("GetType", new { id = operationType.Id }, operationType);
        }
    */
    // |=============================================|
    // | Following methods regard Operation Requests |
    // |=============================================|



}
