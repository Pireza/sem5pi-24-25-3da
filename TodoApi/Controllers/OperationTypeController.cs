using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]

public class OperationTypeController : ControllerBase
{
    private readonly UserContext _context;

    public OperationTypeController(UserContext context)
    {
        _context = context;
    }
    private OperationRequestRepository _repository;


[HttpDelete("removeOperationTypeAsAdmin/{id}")] // Correcting route to be DELETE and using path variable
[Authorize(Policy = "AdminOnly")]
public async Task<IActionResult> DeactivateOperationType(long id)
{
    try
    {
        // Call repository to deactivate the operation type
        var deactivated = await _repository.DeactivateOperationTypeAsync(id);

        if (!deactivated)
        {
            return NotFound("Operation type not found or does not exist."); // Provide a message with NotFound
        }

        return NoContent(); // Return No Content status on success
    }
    catch (InvalidOperationException ex)
    {
        return BadRequest($"Invalid operation: {ex.Message}"); // Provide more context in the response
    }
    catch (Exception ex) // Catch all other exceptions
    {
        // Log the exception here (you can use a logging framework)
        // e.g., _logger.LogError(ex, "An error occurred while deactivating operation type");
        return StatusCode(500, "An error occurred while processing your request.");
    }
}


}
