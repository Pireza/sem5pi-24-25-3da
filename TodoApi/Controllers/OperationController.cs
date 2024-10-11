using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;

[Route("api/[controller]")]
[ApiController]

public class OperationController : ControllerBase
{
    private readonly UserContext _context;
    private const string DurationPattern = @"^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
    private const string DatePattern = @"^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(\\d{4})$";
    private const string PENDING_STATUS = "pending";
    private const string APPROVED_STATUS = "approved";
    private const string ACTIVE_STATUS = "active";
    private const string INACTIVE_STATUS = "inactive";

    public OperationController(UserContext context)
    {
        _context = context;
    }

    // GET: api/operation/priority
    [HttpGet("priority")]
    public async Task<ActionResult<IEnumerable<OperationPriority>>> GetPriorities()
    {
        return await _context.Priorities.ToListAsync();
    }

    // GET: api/operation/priority/{id}
    [HttpGet("priority/{id}")]
    public async Task<ActionResult<OperationPriority>> GetPriority(long id)
    {
        var priority = await _context.Priorities.FindAsync(id);

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
        _context.Priorities.Add(priority);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPriority", new { id = priority.Id }, priority);
    }

    // |=============================================|
    // | Following methods regarding Operation Types |
    // |=============================================|

    // GET: api/operation/type
    [HttpGet("type")]
    public async Task<ActionResult<IEnumerable<OperationType>>> GetTypes()
    {
        return await _context.Types.ToListAsync();
    }

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


    // GET: api/operation/request
    [HttpGet("request")]
    public async Task<ActionResult<IEnumerable<OperationRequest>>> GetRequests()
    {
        return await _context.Requests.ToListAsync();
    }

    // GET: api/operation/request/{id}
    [HttpGet("request/{id}")]
    public async Task<ActionResult<OperationRequest>> GetRequest(long id)
    {
        var request = await _context.Requests.FindAsync(id);

        if (request == null)
        {
            return NotFound();
        }

        return request;
    }


    //POST: api/operation/request

    [HttpPost("request")]
    public async Task<ActionResult<OperationRequest>> PostRequest(OperationRequest request)
    {

        if (string.IsNullOrEmpty(request.Status) ||
            !string.Equals(request.Status, PENDING_STATUS) ||
                !string.Equals(request.Status, APPROVED_STATUS))
        {
            return BadRequest("Status must be either \"pending\" or \"approved\"");
        }

        if (!string.IsNullOrEmpty(request.Deadline))
        {
            Regex regex = new Regex(DatePattern);
            if (!regex.IsMatch(request.Deadline))
            {
                return BadRequest("Request deadline should be in the dd/MM/YYYY format");
            }
        }

        _context.Requests.Add(request);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetRequest", new { id = request.Id }, request);
    }


}
