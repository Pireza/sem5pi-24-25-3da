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
        var query = from ot in _context.Types
                    join ots in _context.Type_Staff on ot.Id equals ots.OperationTypeId
                    join ss in _context.SpecializedStaff on ots.SpecializedStaffId equals ss.Id
                    join sp in _context.Specializations on ss.SpecializationId equals sp.SpecId
                    where
                    (string.IsNullOrEmpty(search.Name) || ot.Name.Equals(search.Name)) &&
                    ot.IsActive == search.IsActive &&
                    // Only filter by specialization on the operation type level
                    (string.IsNullOrEmpty(search.Specialization) || sp.SpecDescription.Equals(search.Specialization))
                    select ot;

        var operationTypes = await query.Distinct().ToListAsync();

        // Step 2: For each matching OperationType, retrieve ALL associated SpecializedStaff
        var result = new List<OperationTypeGetDTO>();

        foreach (var operationType in operationTypes)
        {
            // Retrieve all specialized staff for the current OperationType
            var specializedStaffList = await (from ots in _context.Type_Staff
                                              join ss in _context.SpecializedStaff on ots.SpecializedStaffId equals ss.Id
                                              join sp in _context.Specializations on ss.SpecializationId equals sp.SpecId
                                              where ots.OperationTypeId == operationType.Id
                                              select new
                                              {
                                                  ss.Role,
                                                  sp.SpecDescription
                                              }).ToListAsync();

            // Step 3: Construct the DTO
            var dto = new OperationTypeGetDTO
            {
                Name = operationType.Name,
                Duration = operationType.Duration,
                SpecializedStaff = specializedStaffList
                    .Select(s => $"{s.Role}:{s.SpecDescription}")
                    .ToList()
            };

            result.Add(dto);
        }
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
        if (!await OperationTypeExistsAsync(id))
        {
            return false;
        }
        else
        {
            throw;
        }
    }

    return true;
}

private async Task<bool> OperationTypeExistsAsync(long id)
{
    return await _context.Types.AnyAsync(e => e.Id == id);
}

}
