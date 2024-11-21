using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;

[Route("api/[controller]")]
[ApiController]
public class OperationRequestsController : ControllerBase
{
    private readonly UserContext _context;
    private OperationRequestRepository _repository;

    public OperationRequestsController(UserContext context, OperationRequestRepository repository)
    {
        _context = context;
        _repository = repository;
    }


        [HttpGet("{id}")]
        public async Task<ActionResult<OperationRequest>> GetOperationRequestByIdAsync(long id)
        {
            var operationRequest = await _repository.GetOperationRequestByIdAsync(id);
            if (operationRequest == null)
            {
                return NotFound();
            }

            return operationRequest;
        }
        [HttpGet("Priorities")]
    public async Task<ActionResult<List<OperationPriority>>> GetAllPriorities()
    {
        var priorities = await _repository.GetAllOperationPrioritiesAsync();
        return Ok(priorities);
    }

    // GET: api/OperationRequests/All
    [HttpGet("All")]
    public async Task<ActionResult<List<OperationRequest>>> GetAllOperationRequests()
    {
        var operationRequests = await _repository.GetAllOperationRequestsAsync();
        return Ok(operationRequests);
    }

    

[HttpPost("CreateOperationRequest")]
[Authorize(Policy = "DoctorOnly")]
public async Task<ActionResult> CreateOperationRequest(OperationRequestCreateDTO requestDto)
{
    try
    {
        Console.WriteLine("Starting CreateOperationRequest method.");

        // Get logged-in doctor's email
        var loggedInDoctorEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value?.Split('|').LastOrDefault();
        if (string.IsNullOrEmpty(loggedInDoctorEmail))
        {
            Console.WriteLine("Doctor's identity could not be confirmed.");
            return Unauthorized("Doctor's identity could not be confirmed.");
        }
        Console.WriteLine($"Logged-in doctor email: {loggedInDoctorEmail}");

        // Fetch doctor by email
        var doctor = await _repository.GetDoctorByEmailAsync(loggedInDoctorEmail);
        if (doctor == null)
        {
            Console.WriteLine("Doctor not found.");
            return Unauthorized("Doctor not found.");
        }
        Console.WriteLine($"Doctor found: {doctor.FirstName} {doctor.LastName}, Specialization ID: {doctor.Specialization?.SpecId}");

        // Fetch operation type
        var operationType = await _repository.GetOperationTypeByIdAsync(requestDto.OperationTypeId);
        if (operationType == null)
        {
            Console.WriteLine("Operation Type does not exist.");
            return BadRequest("Operation Type does not exist");
        }
        Console.WriteLine($"Operation Type found: {operationType.Name}, Specialization ID: {operationType.Specialization?.SpecId}");

        // Check if specialization matches
        if (operationType.Specialization?.SpecId != doctor.Specialization?.SpecId)
        {
            Console.WriteLine("Selected operation type does not match the doctor's specialization.");
            return BadRequest("Selected operation type does not match the doctor's specialization.");
        }

        // Fetch patient
        var patient = await _repository.GetPatientByIdAsync(requestDto.PatientId);
        if (patient == null)
        {
            Console.WriteLine("Patient not found.");
            return BadRequest("Patient not found.");
        }
        Console.WriteLine($"Patient found: {patient.FirstName} {patient.LastName}");

        // Fetch operation priority
        var operationPriority = await _repository.GetOperationPriorityByIdAsync(requestDto.PriorityId);
        if (operationPriority == null)
        {
            Console.WriteLine("Invalid operation priority.");
            return BadRequest("Invalid operation priority.");
        }
        Console.WriteLine($"Operation Priority found: {operationPriority.Id}");

        // Create operation request
        var operationRequest = new OperationRequest
        {
            Patient = patient,
            Doctor = doctor,
            OperationType = operationType,
            Deadline = requestDto.Deadline,
            Priority = operationPriority,
            Status = "Pending"
        };
        await _repository.AddOperationRequestAsync(operationRequest);
        Console.WriteLine("Operation request created successfully.");

        // Log changes
        var logEntry = new RequestsLog
        {
            RequestId = operationRequest.Id,
            ChangeDate = DateTime.UtcNow,
            ChangeDescription = $"Operation request created by Doctor {doctor.FirstName} for Patient {patient.FirstName}."
        };
        await _repository.LogRequestChangeAsync(operationRequest.Id, new List<string> { logEntry.ChangeDescription });
        Console.WriteLine("Request log entry created.");

        return Ok("Operation request created successfully.");
    }
    catch (DbUpdateException dbEx)
    {
        Console.WriteLine($"Database error: {dbEx.Message}");
        return StatusCode(500, $"Database error: {dbEx.Message}");
    }
    catch (InvalidOperationException invalidOpEx)
    {
        Console.WriteLine($"Operation error: {invalidOpEx.Message}");
        return BadRequest($"Operation error: {invalidOpEx.Message}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred: {ex.Message}");
        return StatusCode(500, $"An error occurred: {ex.Message}");
    }
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

            if (operationRequest.Priority.Id != operationPriorityId.Value)
            {
                changes.Add($"Operation Priority changed from ID {operationRequest.Priority?.Id ?? 0} to ID {operationPriorityId.Value}");
                operationRequest.Priority = operationPriority;
            }
        }



        if (!string.IsNullOrEmpty(deadline) && operationRequest.Deadline != deadline)
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
