using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

[Route("api/[controller]")]
[ApiController]

public class OperationController : ControllerBase
{
    private readonly UserContext _context;

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
}
