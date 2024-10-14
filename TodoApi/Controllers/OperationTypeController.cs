using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class OperationTypeController : ControllerBase
{
    private readonly UserContext _context;

    public OperationTypeController(UserContext context)
    {
        _context = context;
    }

    // PUT: api/OperationType/deactivate/{id}
    [HttpDelete("deactivate/{id}")]
    public async Task<IActionResult> DeactivateOperationType(long id)
    {
        // Check if the operation type exists
        var operationType = await _context.OperationTypes
            .FirstOrDefaultAsync(ot => ot.Id == id);

        if (operationType == null)
        {
            return NotFound(); // Operation type not found
        }

        if (!operationType.IsActive)
        {
            return BadRequest("Operation type is already inactive."); // Already inactive
        }

        // Mark the operation type as inactive
        operationType.IsActive = false;

        _context.Entry(operationType).State = EntityState.Modified;

        try
        {
            // Save the changes to the database
            await _context.SaveChangesAsync();

            // Log the deactivation (optional, for audit purposes)
            var logEntry = new AuditLogOperationType
            {
                EntityId = operationType.Id,
                EntityName = nameof(OperationType),
                Action = "Deactivated",
                ChangeDate = DateTime.UtcNow,
                Description = $"Operation type '{operationType.Name}' deactivated by admin."
            };

            _context.AuditLogOperationTypes.Add(logEntry);
            await _context.SaveChangesAsync();

        }
        catch (DbUpdateConcurrencyException)
        {
            if (!OperationTypeExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // Helper method to check if an OperationType exists
    private bool OperationTypeExists(long id)
    {
        return _context.OperationTypes.Any(e => e.Id == id);
    }
}
