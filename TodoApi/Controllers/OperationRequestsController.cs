using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

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
    public async Task<IActionResult> UpdateOperationRequest(
        long id,
        [FromQuery] long? patientId = null,
        [FromQuery] long? doctorId = null,
        [FromQuery] long? operationTypeId = null, // Assuming operation type is identified by ID
        [FromQuery] long? operationPriorityId = null, // Assuming operation priority is identified by ID
        [FromQuery] string? deadline = null,
        [FromQuery] string? status = null)
    {
        var operationRequest = await _context.Requests.FirstOrDefaultAsync(r => r.Id == id);

        if (operationRequest == null)
        {
            return NotFound();
        }

                var changes = new List<string>();


        // Check if Patient exists in the database
        if (patientId.HasValue)
        {
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == patientId.Value);
            if (!patientExists)
            {
                return BadRequest($"Patient with ID {patientId.Value} does not exist.");
            }
        changes.Add($"Patient changed from ID {operationRequest.Patient.Id} to ID {patientId.Value}.");

            operationRequest.Patient = await _context.Patients.FindAsync(patientId.Value);
        }

        // Check if Doctor exists in the database
        if (doctorId.HasValue)
        {
            var doctorExists = await _context.Staff.AnyAsync(s => s.Id == doctorId.Value);
            if (!doctorExists)
            {
                return BadRequest($"Doctor with ID {doctorId.Value} does not exist.");
            }
                    changes.Add($"Doctor changed from ID {operationRequest.Doctor.Id} to ID {doctorId.Value}.");

            operationRequest.Doctor = await _context.Staff.FindAsync(doctorId.Value);
        }

        // Check if OperationType exists in the database
        if (operationTypeId.HasValue)
        {
            var operationTypeExists = await _context.Types.AnyAsync(o => o.Id == operationTypeId.Value);
            if (!operationTypeExists)
            {
                return BadRequest($"OperationType with ID {operationTypeId.Value} does not exist.");
            }
                                changes.Add($"Operation Type changed from ID {operationRequest.OperationType.Id} to ID {operationTypeId.Value}.");

            operationRequest.OperationType = await _context.Types.FindAsync(operationTypeId.Value);
        }

        // Check if OperationPriority exists in the database
        if (operationPriorityId.HasValue)
        {
            var operationPriorityExists = await _context.Priorities.AnyAsync(p => p.Id == operationPriorityId.Value);
            if (!operationPriorityExists)
            {
                return BadRequest($"OperationPriority with ID {operationPriorityId.Value} does not exist.");
            }
                                            changes.Add($"Operation Priority changed from ID {operationRequest.Priority.Id} to ID {operationPriorityId.Value}.");

            operationRequest.Priority = await _context.Priorities.FindAsync(operationPriorityId.Value);
        }


        if (!string.IsNullOrEmpty(deadline))
        {
            changes.Add($"Deadline changed from {operationRequest.Deadline} to {deadline}.");
            operationRequest.Deadline = deadline;
        }

        if (!string.IsNullOrEmpty(status))
        {
            changes.Add($"Status changed from {operationRequest.Status} to {status}.");
            operationRequest.Status = status;
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
}
