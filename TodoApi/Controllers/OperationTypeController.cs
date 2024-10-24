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

   // PUT: api/OperationType/deactivate/{id}
[HttpDelete("removeOperationTypeAsAdmin{id}")]
[Authorize(Policy = "AdminOnly")]
public async Task<IActionResult> DeactivateOperationType(long id)
{
    try
    {
        // Call repository to deactivate the operation type
        var deactivated = await _repository.DeactivateOperationTypeAsync(id);

        if (!deactivated)
        {
            return NotFound(); // Operation type not found or doesn't exist
        }

        return NoContent();
    }
    catch (InvalidOperationException ex)
    {
        return BadRequest(ex.Message);
    }
    catch (Exception)
    {
        // Handle any other exceptions that may occur
        return StatusCode(500, "An error occurred while processing your request.");
    }
}
}
