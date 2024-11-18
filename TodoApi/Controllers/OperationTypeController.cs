using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypeController : ControllerBase
    {
        private readonly UserContext _context;
        private readonly OperationTypeRepository _typeRep;  // Injection of the OperationTypeRepository

        // Constructor to inject dependencies
        public OperationTypeController(UserContext context, OperationTypeRepository typeRep)
        {
            _context = context;  // Store UserContext in _context
            _typeRep = typeRep;  // Store the injected OperationTypeRepository in _typeRep
        }

        // Example method to get all operation types
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationType>>> GetOperationTypes()
        {
            var operationTypes = await _context.OperationTypes.ToListAsync();
            return Ok(operationTypes);  // Return a list of operation types from the database
        }

        // Example method to deactivate an operation type
        [HttpDelete("removeOperationTypeAsAdmin/{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeactivateOperationType(long id)
        {
            try
            {
                var deactivated = await _typeRep.DeactivateOperationTypeAsync(id);

                if (!deactivated)
                {
                    return NotFound("Operation type not found or does not exist.");
                }

                return NoContent(); // Successfully deactivated
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest($"Invalid operation: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // Method to get all active operation types
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<OperationType>>> GetActiveOperationTypes()
        {
            var activeOperationTypes = await _context.Types
                .Where(ot => ot.IsActive) // Assuming 'IsActive' field indicates active status
                .ToListAsync();

            if (activeOperationTypes == null || !activeOperationTypes.Any())
            {
                return NotFound("No active operation types found.");
            }

            return Ok(activeOperationTypes);  // Return active operation types from the database
        }
    }
}
