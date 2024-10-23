using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;

public class PatientRepository
{
    private readonly UserContext _context;

    public PatientRepository(UserContext context)
    {
        _context = context;
    }

    public async Task AddPatientAsync(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
    }

     public async Task<Patient?> GetPatientByEmailAsync(string email)
    {
        return await _context.Patients.FirstOrDefaultAsync(p => p.Email == email);
    }

    public async Task LogAuditChangeAsync(long patientId, List<string> changes)
    {
        var auditLog = new AuditLog
        {
            PatientId = patientId,
            ChangeDate = DateTime.UtcNow,
            ChangeDescription = string.Join(", ", changes)
        };
        if(!changes.IsNullOrEmpty()){
            _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();
        }
        
    }
    public async Task UpdatePatientAsync(Patient patient)
{
    MarkPatientAsModified(patient); 
    await _context.SaveChangesAsync(); 
}
private void MarkPatientAsModified(Patient patient)
{
    _context.Entry(patient).State = EntityState.Modified;
}
public async Task AddAuditLogForDeletionAsync(string email)
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
public IQueryable<Patient> GetPatientsQueryable()
{
    var query = _context.Patients.AsQueryable();
    return query;
}


    public async Task<Patient?> checkEmail(CreatePatientRequest request)
    {
        return await _context.Patients
                .FirstOrDefaultAsync(p => p.MedicalNumber == request.MedicalNumber || p.Email == request.Email);
    }
}

