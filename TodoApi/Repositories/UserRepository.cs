using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;

public class UserRepository
{
    private readonly UserContext _context;

    public UserRepository(UserContext context)
    {
        _context = context;
    }
    public UserRepository() { }
    public virtual async Task AddPatientAsync(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
    }

    public virtual async Task<Patient?> GetPatientByEmailAsync(string email)
    {
        return await _context.Patients.FirstOrDefaultAsync(p => p.Email == email);
    }

    public virtual async Task LogAuditChangeAsync(long patientId, List<string> changes)
    {
        var auditLog = new AuditLog
        {
            PatientId = patientId,
            ChangeDate = DateTime.UtcNow,
            ChangeDescription = string.Join(", ", changes)
        };
        if (!changes.IsNullOrEmpty())
        {
            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
        }

    }
    public virtual async Task UpdatePatientAsync(Patient patient)
    {
        MarkPatientAsModified(patient);
        await _context.SaveChangesAsync();
    }
    public virtual void MarkPatientAsModified(Patient patient)
    {
        _context.Entry(patient).State = EntityState.Modified;
    }
    public virtual async Task AddAuditLogForDeletionAsync(string email)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Email == email);

        if (patient != null)
        {
            var auditLog = new AuditLog
            {
                PatientId = patient.Id,
                ChangeDate = DateTime.UtcNow,
                ChangeDescription = $"Patient with Email {email} will be deleted in 30 days."
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
        }
    }

    public virtual IQueryable<Patient> GetPatientsQueryable()
    {
        var query = _context.Patients.AsQueryable();
        return query;
    }
    public virtual async Task<Patient?> checkEmail(CreatePatientRequest request)
    {
        return await _context.Patients
                .FirstOrDefaultAsync(p => p.MedicalNumber == request.MedicalNumber || p.Email == request.Email);
    }

    // Staff Users ============================================

    public async Task AddStaff(RegisterUserDto model)
    {

        var staff = new Staff
        {
            Email = model.Email,
            Role = model.Role,
            UserName = model.Username
        };

        _context.Staff.Add(staff);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Staff>> getStaff()
    {
        return await _context.Staff.ToListAsync();
    }
    public async Task<Staff?> getStaff(long id)
    {
        return await _context.Staff.FindAsync(id);
    }

    public async Task<Staff?> checkStaff(CreateStaffRequest request)
    {
        return await _context.Staff
            .FirstOrDefaultAsync(s => s.LicenseNumber == request.LicenseNumber || s.Phone == request.Phone || s.Email == request.Email);
    }


    public async Task<Specialization?> specChange(long? specializationId)
    {
        return await _context.Specializations
            .FirstOrDefaultAsync(s => s.SpecId == specializationId);
    }

    public bool StaffExists(long id)
    {
        return _context.Staff.Any(e => e.Id == id);
    }

    public async void LogAuditChangeAsyncStaff(long id, List<string> changes)
    {
        var auditLog = new AuditLogStaff
        {
            StaffId = id,
            ChangeDate = DateTime.UtcNow,
            ChangeDescription = string.Join(", ", changes)
        };
        if (!changes.IsNullOrEmpty())
        {
            _context.AuditLogStaff.Add(auditLog);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Staff> checkStaffEmail(string email)
    {
        return await _context.Staff
       .FirstOrDefaultAsync(s => s.Email == email);

    }

    public virtual IQueryable<Staff> GetStaffQueryable()
    {
        return _context.Staff.Include(s => s.Specialization).AsQueryable();
    }

}
