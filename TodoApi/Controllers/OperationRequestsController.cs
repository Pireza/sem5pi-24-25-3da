using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class OperationRequestsController : ControllerBase
{
    private readonly UserContext _context; 
    private OperationRequestRepository _repository;

    public OperationRequestsController(UserContext context, OperationRequestRepository repository)
    {
        _context = context;
        _repository=repository;
    }

    // PUT: api/OperationRequests/{id}
    [HttpPut("{id}")]
    [Authorize(Policy = "DoctorOnly")]
    public async Task<IActionResult> UpdateOperationRequest(
        long id,
        [FromQuery] long? operationPriorityId = null, 
        [FromQuery] string? deadline = null)
    {
    var operationRequest = await _repository.GetOperationRequestByIdAsync(id);
    var loggedInDoctorEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
     loggedInDoctorEmail = loggedInDoctorEmail?.Split('|').LastOrDefault();

    
        if (operationRequest == null)
        {
            return NotFound();
        }
         if (operationRequest.Doctor == null || operationRequest.Doctor.Email != loggedInDoctorEmail)
    {
        return BadRequest("You are not authorized to update this operation request. Reason: You are not the doctor that created this request!");
    }
                var changes = new List<string>();

      if (operationPriorityId.HasValue)
    {
        var operationPriority = await _repository.GetOperationPriorityByIdAsync(operationPriorityId.Value);
        if (operationPriority == null)
        {
            return BadRequest($"OperationPriority with ID {operationPriorityId.Value} does not exist.");
        }

        if ( operationRequest.Priority.Id != operationPriorityId.Value)
        {
            changes.Add($"Operation Priority changed from ID {operationRequest.Priority?.Id ?? 0} to ID {operationPriorityId.Value}");
            operationRequest.Priority = operationPriority;
        }
    }



        if (!string.IsNullOrEmpty(deadline) && operationRequest.Deadline!= deadline)
        {
            changes.Add($"Deadline changed from {operationRequest.Deadline} to {deadline}.");
            operationRequest.Deadline = deadline;
        }

        
        await _repository.UpdateOperationRequestAsync(operationRequest);
        
        try
        {
           await _repository.LogRequestChangeAsync(id, changes);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!OperationRequestExists(id))
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

    private bool OperationRequestExists(long id)
    {
        return _context.Requests.Any(e => e.Id == id);
    }


// DELETE: api/OperationRequests/{id}
[HttpDelete("id/deleteOperationRequestAsDoctor{id}")]
[Authorize(Policy = "DoctorOnly")]
public async Task<IActionResult> DeleteOperationRequest(long id)
{
    try
    {
        // Call repository to delete the operation request by ID
        var deleted = await _repository.DeleteOperationRequestByIdAsync(id);

        if (!deleted)
        {
            return NotFound(); // Request not found
        }

        // Notify the Planning Module (this can be an external service call)
        NotifyPlanningModule(id);

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

private void NotifyPlanningModule(long operationRequestId)
{
    Console.WriteLine($"Notifying Planning Module: Operation request {operationRequestId} has been deleted.");
}


}
