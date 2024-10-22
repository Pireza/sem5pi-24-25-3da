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
    private readonly UserContext _context; // Replace with your actual DbContext

    public OperationRequestsController(UserContext context)
    {
        _context = context;
    }

    // PUT: api/OperationRequests/{id}
    [HttpPut("{id}")]
    [Authorize(Policy = "DoctorOnly")]
    public async Task<IActionResult> UpdateOperationRequest(
        long id,
        [FromQuery] long? operationPriorityId = null, 
        [FromQuery] string? deadline = null)
    {
    var operationRequest = await _context.Requests.Include(r => r.Priority).Include(d => d.Doctor).FirstOrDefaultAsync(r => r.Id == id);
    var loggedInDoctorEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
     loggedInDoctorEmail = loggedInDoctorEmail?.Split('|').LastOrDefault();

    
        if (operationRequest == null)
        {
            return NotFound();
        }
         if (operationRequest.Doctor == null || operationRequest.Doctor.Email != loggedInDoctorEmail)
    {
        return BadRequest("You are not authorized to update this operation request.");
    }
                var changes = new List<string>();

      if (operationPriorityId.HasValue)
    {
        var operationPriority = await _context.Priorities.FindAsync(operationPriorityId.Value);
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



        if (!string.IsNullOrEmpty(deadline))
        {
            changes.Add($"Deadline changed from {operationRequest.Deadline} to {deadline}.");
            operationRequest.Deadline = deadline;
        }

        
        _context.Entry(operationRequest).State = EntityState.Modified;

        try
        {
            var requestLog = new RequestsLog
            {
                RequestId = id,
                ChangeDate = DateTime.UtcNow,
                ChangeDescription = string.Join(", ", changes)
            };
            _context.RequestsLogs.Add(requestLog);
            await _context.SaveChangesAsync();
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
public async Task<IActionResult> DeleteOperationRequest(
    long id)  
{
    // Retrieve the operation request by its ID, include Patient and Doctor to check their relationship
    var operationRequest = await _context.Requests
        .Include(r => r.Doctor)  // Include the Doctor who created the request
        .Include(r => r.Patient) // Include the Patient who has the request
        .FirstOrDefaultAsync(r => r.Id == id);

    if (operationRequest == null)
    {
        return NotFound();  // Request not found
    }

    // Check if the operation has already been scheduled (based on the deadline)
    if (!string.IsNullOrEmpty(operationRequest.Deadline) && DateTime.TryParse(operationRequest.Deadline, out var deadline) && deadline < DateTime.UtcNow)
    {
        return BadRequest("Operation has already been scheduled and cannot be deleted.");
    }

    // Delete the operation request from the database
    _context.Requests.Remove(operationRequest);

    try
    {
        // Save the changes to the database
        await _context.SaveChangesAsync();

        // Log the deletion event
        var requestLog = new RequestsLog
        {
            RequestId = id,
            ChangeDate = DateTime.UtcNow,
            ChangeDescription = $"Operation request for patient {operationRequest.Patient.Id} deleted."
        };

        _context.RequestsLogs.Add(requestLog);
        await _context.SaveChangesAsync();
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

    // Notify the Planning Module (this can be an external service call)
    NotifyPlanningModule(operationRequest);

    return NoContent();
}

private void NotifyPlanningModule(OperationRequest operationRequest)
{
    Console.WriteLine($"Notifying Planning Module: Operation request for patient {operationRequest.Patient.Id} has been deleted.");
}

}
