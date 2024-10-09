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

    // |==========================================|
    // | Following methods regard Operation Types |
    // |==========================================|

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

    [HttpPost("type")]
    public async Task<ActionResult<OperationType>> PostType(OperationType type)
    {

        if(!string.IsNullOrEmpty(type.Duration))
        {
            Regex regex = new Regex(DurationPattern);
            if(!regex.IsMatch(type.Duration))
            {
                return BadRequest("Operation type duration should be in the HH:mm:ss format");
            }
        }
        _context.Types.Add(type);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetType", new { id = type.Id }, type);
    }

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
        _context.Requests.Add(request);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetRequest", new { id = request.Id }, request);
    }


}
