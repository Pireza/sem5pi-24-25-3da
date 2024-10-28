using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;

public class OperationRequestRepository
{
    private readonly UserContext _context;

    public OperationRequestRepository(UserContext context)
    {
        _context = context;
    }
    public OperationRequestRepository() { }


    public virtual async Task<OperationRequest> GetOperationRequestByIdAsync(long id)
    {
        return await _context.Requests.Include(r => r.Priority).Include(d => d.Doctor).FirstOrDefaultAsync(r => r.Id == id);
    }
    public virtual async Task UpdateOperationRequestAsync(OperationRequest operationRequest)
    {
        _context.Entry(operationRequest).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
    public virtual async Task LogRequestChangeAsync(long requestId, List<string> changes)
    {
        var requestLog = new RequestsLog
        {
            RequestId = requestId,
            ChangeDate = DateTime.UtcNow,
            ChangeDescription = string.Join(", ", changes)
        };
        if (!changes.IsNullOrEmpty())
        {

            await _context.RequestsLogs.AddAsync(requestLog);
            await _context.SaveChangesAsync();
        }



    }

    public virtual async Task<OperationPriority> GetOperationPriorityByIdAsync(long operationPriorityId)
    {
        return await _context.Priorities.FindAsync(operationPriorityId);
    }



    public async Task<bool> DeleteOperationRequestByIdAsync(long id)
    {
        // Retrieve the operation request by its ID, include related data
        var operationRequest = await _context.Requests
            .Include(r => r.Doctor)
            .Include(r => r.Patient)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (operationRequest == null)
        {
            return false; // Request not found
        }

        // Check if the operation has already been scheduled (based on the deadline)
        if (!string.IsNullOrEmpty(operationRequest.Deadline) &&
            DateTime.TryParse(operationRequest.Deadline, out var deadline) &&
            deadline < DateTime.UtcNow)
        {
            throw new InvalidOperationException("Operation has already been scheduled and cannot be deleted.");
        }

        // Remove the operation request from the database
        _context.Requests.Remove(operationRequest);

        // Log the deletion event
        var requestLog = new RequestsLog
        {
            RequestId = id,
            ChangeDate = DateTime.UtcNow,
            ChangeDescription = $"Operation request for patient {operationRequest.Patient.Id} deleted."
        };

        _context.RequestsLogs.Add(requestLog);

        // Save changes to the database
        await _context.SaveChangesAsync();

        return true; // Deletion successful
    }

    // =========================================================================
    // Operation priorities
    // =========================================================================

    public async Task<List<OperationPriority>> GetAllPrioAsync()
    {
        return await _context.Priorities.ToListAsync();
    }
    public async Task<OperationPriority> GetPrioById(long id)
    {
        return await this._context.Priorities.FindAsync(id);
    }
    public async Task AddPrio(OperationPriority prio)
    {
        await _context.Priorities.AddAsync(prio);
        await _context.SaveChangesAsync();
    }
    // =========================================================================
    // Operation types
    // =========================================================================

    public async Task<List<OperationType>> GetTypes()
    {
        return await _context.Types.ToListAsync();
    }

    public async Task<List<OperationTypeGetDTO>> FilterTypes(OperationTypeSearch search)
    {
        IQueryable<OperationType> query = _context.Types;

        // Filter by Name
        if (!string.IsNullOrEmpty(search.Name))
        {
            query = query.Where(ot => ot.Name.Contains(search.Name));
        }

        // Filter by Status (-1 means no filter)
        if (search.Status != -1)
        {
            query = query.Where(ot => ot.IsActive == (search.Status == 1));
        }

        // Filter by Specialization
        if (!string.IsNullOrEmpty(search.Specialization))
        {
            query = query.Where(ot => _context.Type_Staff
                .Any(ots => ots.OperationTypeId == ot.Id &&
                            _context.SpecializedStaff
                            .Where(ss => ss.Id == ots.SpecializedStaffId)
                            .Any(ss => _context.Specializations
                                .Any(s => s.SpecId == ss.SpecializationId &&
                                          s.SpecDescription.Contains(search.Specialization))
                            )
                ));
        }

        // Fetch the results
        var operationTypes = await query.ToListAsync();

        // Map to DTO
        var result = operationTypes.Select(ot => new OperationTypeGetDTO
        {
            Name = ot.Name,
            Duration = ot.Duration,
            IsActive = ot.IsActive,
            SpecializedStaff = _context.Type_Staff
                .Where(ots => ots.OperationTypeId == ot.Id)
                .Select(ots => new
                {
                    Role = _context.SpecializedStaff
                                .Where(ss => ss.Id == ots.SpecializedStaffId)
                                .Select(ss => ss.Role)
                                .FirstOrDefault(),
                    Specialization = _context.Specializations
                                .Where(s => s.SpecId == _context.SpecializedStaff
                                                 .Where(ss => ss.Id == ots.SpecializedStaffId)
                                                 .Select(ss => ss.SpecializationId)
                                                 .FirstOrDefault())
                                .Select(s => s.SpecDescription)
                                .FirstOrDefault()
                })
                .Select(ss => $"{ss.Role} -> {ss.Specialization}")
                .ToList()
        }).ToList();

        return result;
    }



    public async Task<OperationType> GetTypeById(long id)
    {
        return await this._context.Types.FindAsync(id);
    }

    public async Task<OperationType> AddType(OperationTypeDTO dto)
    {

        var type = new OperationType
        {
            Name = dto.Name,
            Duration = dto.Duration,
            Status = "",
            IsActive = true
        };

        await this._context.Types.AddAsync(type);
        await this._context.SaveChangesAsync();

        foreach (long l in dto.Staff)
        {
            var asso = new OperationType_Staff
            {
                SpecializedStaffId = l,
                OperationTypeId = type.Id
            };
            this._context.Type_Staff.Add(asso);

        }

        await this._context.SaveChangesAsync();
        return type;
    }
    public async Task checkStaffIdAsync(long id)
    {
        var specStaffId = await _context.SpecializedStaff.FindAsync(id);
        if (specStaffId == null)
            throw new NotFoundResource("Invalid specialized staff id");

    }

    public async Task<List<OperationRequestDTO>> FilterRequests(OperationRequestSearch search)
    {
        // Get the base query from your DbContext. 
        // Assuming you have a DbSet<OperationRequest> named 'OperationRequests'.
        IQueryable<OperationRequest> query = _context.Requests.Include(or => or.Patient)
                                                                          .Include(or => or.Doctor)
                                                                          .Include(or => or.OperationType)
                                                                          .Include(or => or.Priority);

        // Apply filters dynamically based on the properties of the search object.
        if (!string.IsNullOrEmpty(search.PatientName))
        {
            query = query.Where(or => or.Patient.FirstName.Contains(search.PatientName));
        }

        if (!string.IsNullOrEmpty(search.OperationType))
        {
            query = query.Where(or => or.OperationType.Name.Contains(search.OperationType));
        }

        if (!string.IsNullOrEmpty(search.Priority))
        {
            query = query.Where(or => or.Priority.Description.Contains(search.Priority));
        }

        if (!string.IsNullOrEmpty(search.Status))
        {
            query = query.Where(or => or.Status == search.Status);
        }


        var result = await query.Select(or => new OperationRequestDTO
        {
            PatientName = or.Patient.FirstName,
            DoctorName = or.Doctor.FirstName,
            OperationType = or.OperationType.Name,
            Deadline = or.Deadline,
            Status = or.Status,
            PriorityName = or.Priority.Description
        }).ToListAsync();

        return result;
    }

        public async Task<OperationType> UpdateOperationTypeAsync(long id, OperationTypeDTO dto)
    {
        var operationType = await _context.Types.FindAsync(id);
        
        if (operationType == null)
        {
            throw new NotFoundResource("Operation type not found.");
        }

        // Update the properties
        operationType.Name = dto.Name;
        operationType.Duration = dto.Duration;
        
        // Clear current associations and re-add them
        var existingStaff = _context.Type_Staff.Where(ots => ots.OperationTypeId == id);
        _context.Type_Staff.RemoveRange(existingStaff);

        foreach (var staffId in dto.Staff)
        {
            var association = new OperationType_Staff
            {
                SpecializedStaffId = staffId,
                OperationTypeId = operationType.Id
            };
            _context.Type_Staff.Add(association);
        }

        // Save the changes
        await _context.SaveChangesAsync();

        // Log the update action
        var logEntry = new AuditLogOperationType
        {
            EntityId = operationType.Id,
            EntityName = nameof(OperationType),
            Action = "Updated",
            ChangeDate = DateTime.UtcNow,
            Description = $"Operation type '{operationType.Name}' updated by admin."
        };

        _context.AuditLogOperationTypes.Add(logEntry);
        await _context.SaveChangesAsync();

        return operationType;
    }

public async Task<bool> DeactivateOperationTypeAsync(long id)
{
    // Check if the operation type exists
    var operationType = await _context.Types.FirstOrDefaultAsync(ot => ot.Id == id);

    if (operationType == null)
    {
        return false; // Operation type not found
    }

    if (!operationType.IsActive)
    {
        throw new InvalidOperationException("Operation type is already inactive."); // Already inactive
    }

    // Mark the operation type as inactive
    operationType.IsActive = false;

    // Track the operation type's state for modification
    _context.Entry(operationType).State = EntityState.Modified;

    try
    {
        // Save the changes to the database
        await _context.SaveChangesAsync();

        // Log the deactivation for audit purposes
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

        return true; // Successfully deactivated
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!await OperationTypeExistsAsync(id))
        {
            return false; // The operation type does not exist anymore
        }
        else
        {
            throw; // Rethrow the exception for other handling
        }
    }
    catch (Exception)
    {
        // Handle other exceptions if necessary
        throw; // Propagate the exception for further handling
    }
}

    private async Task<bool> OperationTypeExistsAsync(long id)
    {
        return await _context.Types.AnyAsync(e => e.Id == id);
    }

        public async Task<Staff> GetDoctorByEmailAsync(string email)
    {
        return await _context.Staff.FirstOrDefaultAsync(d => d.Email == email);
    }

    public async Task<Patient> GetPatientByIdAsync(long patientId)
    {
        return await _context.Patients.FindAsync(patientId);
    }

    public async Task<OperationType> GetOperationTypeByIdAsync(long operationTypeId)
    {
        return await _context.Types.FindAsync(operationTypeId);
    }

    public async Task AddOperationRequestAsync(OperationRequest operationRequest)
    {
        await _context.Requests.AddAsync(operationRequest);
        await _context.SaveChangesAsync();
    }

}
