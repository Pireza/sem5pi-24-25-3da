using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Services; 
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly UserContext _context;
        private readonly AuthServicePatient _authServicePatient;
        private readonly PasswordGeneratorService _passService;
        private UserRepository _repository;
   



        public PatientsController(UserContext context, AuthServicePatient authServicePatient, PasswordGeneratorService passService, UserRepository repository)
        {
            _context = context;
            _authServicePatient = authServicePatient; // Inject AuthServicePatient
                    _passService = passService;
                    _repository=repository;

        }

        // GET: api/Patients
        [HttpGet("searchPatientProfiles")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatientsByAttributes(
            [FromQuery] string? name = null,
            [FromQuery] string? email = null,
            [FromQuery] string? dateOfBirth = null, // ISO format yyyy-MM-dd
            [FromQuery] int? medicalNumber = null,
            [FromQuery] int page = 1, // Default to page 1
            [FromQuery] int pageSize = 10) // Default page size of 10
        {
            var query = _repository.GetPatientsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(p => (p.FirstName + " " + p.LastName).Contains(name));
            }

            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(p => p.Email == email);
            }

            if (!string.IsNullOrEmpty(dateOfBirth))
            {
                if (DateTime.TryParseExact(dateOfBirth, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var dob))
                {
                    query = query.Where(p => p.Birthday.Date == dob);
                }
                else
                {
                    return BadRequest("Invalid date format. Use DD/MM/YYYY.");
                }
            }


            if (medicalNumber.HasValue)
            {
                query = query.Where(p => p.MedicalNumber == medicalNumber.Value);
            }

            // Pagination logic
            var totalRecords = await query.CountAsync();

            // If you want to paginate the results, use Skip and Take
            var patients = await query
                .Skip((page - 1) * pageSize) // Skip records for previous pages
                .Take(pageSize) // Get the records for the current page
                .ToListAsync();

            // Build response with pagination information
            var response = new
            {
                TotalRecords = totalRecords,
                Page = page,
                PageSize = pageSize,
                Patients = patients.Select(p => new
                {
                    p.Id,
                    p.FirstName,
                    p.LastName,
                    p.Email,
                    Birthday = p.Birthday.ToString("dd/MM/yyyy")
                })
            };

            return Ok(response);
        }

        // GET: api/Patients
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            return await _context.Patients.ToListAsync();
        }


[HttpGet("emails")]
public async Task<ActionResult<IEnumerable<string>>> GetPatientEmails()
{
    try
    {
        // Fetch users with the Patient role and select their emails
        var emails = await _context.Users
            .Where(u => u.Role == "Patient") // Filter users by role
            .Select(u => u.Email)            // Select the Email field
            .ToListAsync();

        // Return the list of patient emails
        return Ok(emails);
    }
    catch (Exception ex)
    {
        // Log the exception (you can replace this with your logging system)
        Console.Error.WriteLine($"Error fetching patient emails: {ex.Message}");

        // Return a 500 Internal Server Error
        return StatusCode(500, "An error occurred while retrieving patient emails.");
    }
}



        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(long id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }

        // GET: api/Patients/email/{email}
        [HttpGet("email/{email}")]
        public async Task<ActionResult<Patient>> GetPatientByEmail(string email)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Email == email);

            if (patient == null)
            {
                return NotFound();
            }

            return Ok(patient);
        }

        // POST: api/Patients/authenticate
        [HttpPost("authenticate")]
        public async Task<ActionResult<string>> AuthenticateUser()
        {
            // Call the method from AuthServicePatient
            var token = await _authServicePatient.AuthenticateUser();

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(); // Return Unauthorized if authentication fails
            }

            // Set the access token in a cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // Prevent client-side access to the cookie
                Secure = false, // Use Secure cookies in production
                SameSite = SameSiteMode.Strict, // Prevent CSRF attacks
                Expires = DateTimeOffset.UtcNow.AddMinutes(10) // Set expiration
            };

            Response.Cookies.Append("access_token", token, cookieOptions);


            return Ok(new { AccessToken = token }); // Return a success response
        }

       [HttpPost("registerPatientViaAuth0")]
    public async Task<IActionResult> RegisterPatient([FromBody] CreatePatientRequest model)
    {
        if (model == null)
        {
            return BadRequest("User information is required.");
        }

        try
        {

            await _authServicePatient.RegisterNewPatient(model, _passService.GeneratePassword());
            return Ok();
        }
        catch (InvalidDataException)
        {
            return BadRequest("Role does not exist in the system");
        }
        catch (UserAlreadyExistsException)
        {
            return BadRequest("User already exists in the system");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }




        // POST: api/Patients
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatient", new { id = patient.Id }, patient);
        }

        // POST: api/Patients
        [HttpPost("createPatientAsAdmin")]
        [Authorize(Policy = "AdminOnly")]
        // POST: api/Patients
        public async Task<ActionResult<Patient>> CreatePatientAsAdmin([FromBody] CreatePatientRequest request)
        {
            // Validação básica dos campos obrigatórios
            if (string.IsNullOrEmpty(request.FirstName) || string.IsNullOrEmpty(request.LastName))
            {
                return BadRequest("First name and last name are required.");
            }

            // Validação do formato da data de nascimento
            if (!DateTime.TryParseExact(request.Birthday, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var dob))
            {
                return BadRequest("Invalid date format. Use DD/MM/YYYY.");
            }

            if(string.IsNullOrEmpty(request.Phone) || string.IsNullOrEmpty(request.EmergencyContact)){
                return BadRequest("The phone number and emergency contact should be provided.");

            }
            if(string.IsNullOrEmpty(request.Gender) ){
                return BadRequest("The gender should be provided.");

            }

            // Verifica se já existe um paciente com o mesmo número médico ou e-mail
            var existingPatient = await _repository.checkEmail(request);
            if (existingPatient != null)
            {
                return Conflict("A patient with the same medical number or email already exists.");
            }

            // Cria uma nova instância do paciente com os dados fornecidos
            var newPatient = new Patient
            {
                UserName= request.Username,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Birthday = dob,
                MedicalNumber = request.MedicalNumber,
                Phone = request.Phone,
                EmergencyContact = request.EmergencyContact,
                Gender = request.Gender,
                Role= "Patient",
                MedicalConditions = request.MedicalConditions
            };

            // Adiciona ao contexto e salva no banco de dados
            _context.Patients.Add(newPatient);
            await _context.SaveChangesAsync();

            // Retorna a resposta com o status 201 Created
            return CreatedAtAction(nameof(GetPatient), new { id = newPatient.Id }, newPatient);
        }




        // PUT: api/Patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(long id, Patient patient)
        {
            if (id != patient.Id)
            {
                return BadRequest();
            }

            // Retrieve the existing patient from the database
            var existingPatient = await _context.Patients.FindAsync(id);
            if (existingPatient == null)
            {
                return NotFound();
            }

            // List to hold changes made to the patient
            var changes = new List<string>();

            // Check and log changes
            if (existingPatient.FirstName != patient.FirstName)
            {
                changes.Add($"FirstName changed from {existingPatient.FirstName} to {patient.FirstName}");
                existingPatient.FirstName = patient.FirstName;
            }

            if (existingPatient.LastName != patient.LastName)
            {
                changes.Add($"LastName changed from {existingPatient.LastName} to {patient.LastName}");
                existingPatient.LastName = patient.LastName;
            }

            if (existingPatient.Birthday != patient.Birthday)
            {
                changes.Add($"Birthday changed from {existingPatient.Birthday.ToString("dd/MM/yyyy")} to {patient.Birthday.ToString("dd/MM/yyyy")}");
                existingPatient.Birthday = patient.Birthday;
            }

            if (existingPatient.Phone != patient.Phone)
            {
                changes.Add($"Phone changed from {existingPatient.Phone} to {patient.Phone}");
                existingPatient.Phone = patient.Phone;
            }

            if (existingPatient.MedicalNumber != patient.MedicalNumber)
            {
                changes.Add($"MedicalNumber changed from {existingPatient.MedicalNumber} to {patient.MedicalNumber}");
                existingPatient.MedicalNumber = patient.MedicalNumber;
            }

            if (existingPatient.EmergencyContact != patient.EmergencyContact)
            {
                changes.Add($"EmergencyContact changed from {existingPatient.EmergencyContact} to {patient.EmergencyContact}");
                existingPatient.EmergencyContact = patient.EmergencyContact;
            }

            // Mark the entity as modified
            _context.Entry(existingPatient).State = EntityState.Modified;

            try
            {


                // Log the changes
                var auditLog = new AuditLog
                {
                    PatientId = existingPatient.Id,
                    ChangeDate = DateTime.UtcNow,
                    ChangeDescription = string.Join(", ", changes)
                };

                _context.AuditLogs.Add(auditLog);
                await _context.SaveChangesAsync(); // Save the audit log
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
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


        // DELETE: api/Patients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(long id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            patient.PendingDeletionDate = DateTime.UtcNow;

            // Create an audit log entry before deletion
            var auditLog = new AuditLog
            {
                PatientId = patient.Id,
                ChangeDate = DateTime.UtcNow,
                ChangeDescription = $"Patient with Id {id} will be deleted in 30 days."
            };

            // Add the audit log entry to the context
            _context.AuditLogs.Add(auditLog);

            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();

            try
            {
                await _context.SaveChangesAsync(); // Save changes to both the audit log and the patient deletion
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
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

        // PUT: api/Patients/email/{email}
        [HttpPut("email/{email}")]
        public async Task<IActionResult> PutPatientByEmailAsAnAdmin(
            string email,
            [FromQuery] string? firstName = null,
            [FromQuery] string? lastName = null,
            [FromQuery] string? birthday = null,
            [FromQuery] string? phone = null,
            [FromQuery] int? medicalNumber = null,
            [FromQuery] string? emergencyContact = null)
        {
            var patient = await _repository.GetPatientByEmailAsync(email);

            if (patient == null)
            {
                return NotFound();
            }
            var changes = new List<string>();


            // Update the patient's properties based on the provided parameters
            if (!string.IsNullOrEmpty(firstName))
            {
                changes.Add($"FirstName changed from {patient.FirstName} to {firstName}");

                patient.FirstName = firstName;
            }

            if (!string.IsNullOrEmpty(lastName))
            {
                changes.Add($"LastName changed from {patient.LastName} to {lastName}");

                patient.LastName = lastName;
            }

            if (!string.IsNullOrEmpty(birthday))
            {
                if (DateTime.TryParseExact(birthday, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var dob))
                {
                    changes.Add($"Birthday changed from {patient.Birthday.ToString("dd/MM/yyyy")} to {dob.ToString("dd/MM/yyyy")}");

                    patient.Birthday = dob;
                }
            }

            if (!string.IsNullOrEmpty(phone))
            {
                changes.Add($"Phone changed from {patient.Phone} to {phone}");

                patient.Phone = phone;
            }

            if (medicalNumber.HasValue)
            {
                changes.Add($"MedicalNumber changed from {patient.MedicalNumber} to {medicalNumber}");

                patient.MedicalNumber = medicalNumber.Value;
            }

            if (!string.IsNullOrEmpty(emergencyContact))
            {
                changes.Add($"EmergencyContact changed from {patient.EmergencyContact} to {emergencyContact}");

                patient.EmergencyContact = emergencyContact;
            }

            _context.Entry(patient).State = EntityState.Modified;

            try
            {
                await _repository.LogAuditChangeAsync(patient.Id, changes);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(patient.Id))
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

       [HttpPut("email/UpdateProfile/{email}")]
       [Authorize(Policy = "PatientOnly")]
    public async Task<IActionResult> PutPatientByEmail(
    string email,
    [FromQuery] string? newEmail = null,  // Add newEmail as a parameter
    [FromQuery] string? firstName = null,
    [FromQuery] string? lastName = null,
    [FromQuery] string? phone = null,
    [FromQuery] string? emergencyContact = null)
{
    var patient = await _repository.GetPatientByEmailAsync(email);

    if (patient == null)
    {
        return NotFound();
    }

    var changes = new List<string>();

    // Update email if a new one is provided
    if (!string.IsNullOrEmpty(newEmail) && newEmail != patient.Email)
    {
        // Trigger Auth0 email verification
        await _authServicePatient.UpdateEmailInAuth0(patient.Email, newEmail);

        changes.Add($"Email changed from {patient.Email} to {newEmail}");

        patient.Email = newEmail;
            }

    // Update other fields
    if (!string.IsNullOrEmpty(firstName))
    {
        changes.Add($"FirstName changed from {patient.FirstName} to {firstName}");
        patient.FirstName = firstName;
    }

    if (!string.IsNullOrEmpty(lastName))
    {
        changes.Add($"LastName changed from {patient.LastName} to {lastName}");
        patient.LastName = lastName;
    }

    if (!string.IsNullOrEmpty(phone))
    {
        changes.Add($"Phone changed from {patient.Phone} to {phone}");
        patient.Phone = phone;
    }

    if (!string.IsNullOrEmpty(emergencyContact))
    {
        changes.Add($"EmergencyContact changed from {patient.EmergencyContact} to {emergencyContact}");
        patient.EmergencyContact = emergencyContact;
    }

    await _repository.UpdatePatientAsync(patient);

    try
    {
       await _repository.LogAuditChangeAsync(patient.Id,changes);
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!PatientExists(patient.Id))
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



// PUT: api/Patients/email/Admin{email}
[HttpPut("email/UpdatePatientProfileAsAdmin/{email}")]
[Authorize(Policy = "AdminOnly")]
public async Task<IActionResult> PutPatientUpdateAsAdmin(
    string email,
    [FromQuery] string? firstName = null,
    [FromQuery] string? lastName = null,
    [FromQuery] string? phone = null,
    [FromQuery] string? emergencyContact = null,
    [FromQuery] List<string>? medicalConditions = null)
{
    var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Email == email);

    if (patient == null)
    {
        return NotFound();
    }

    var changes = new List<string>();

    // Update the patient's properties based on the provided parameters
    if (!string.IsNullOrEmpty(firstName))
    {
        changes.Add($"FirstName changed from {patient.FirstName} to {firstName}");
        patient.FirstName = firstName;
    }

    if (!string.IsNullOrEmpty(lastName))
    {
        changes.Add($"LastName changed from {patient.LastName} to {lastName}");
        patient.LastName = lastName;
    }

    if (medicalConditions != null && medicalConditions.Any())
    {
        var oldConditions = patient.MedicalConditions != null ? string.Join(", ", patient.MedicalConditions) : "None";
        var newConditions = string.Join(", ", medicalConditions);
        changes.Add($"MedicalConditions changed from [{oldConditions}] to [{newConditions}]");
        patient.MedicalConditions = medicalConditions;
    }

    if (!string.IsNullOrEmpty(phone))
    {
        changes.Add($"Phone changed from {patient.Phone} to {phone}");
        patient.Phone = phone;
    }

    if (!string.IsNullOrEmpty(emergencyContact))
    {
        changes.Add($"EmergencyContact changed from {patient.EmergencyContact} to {emergencyContact}");
        patient.EmergencyContact = emergencyContact;
    }

    _context.Entry(patient).State = EntityState.Modified;

    try
    {
        var auditLog = new AuditLog
        {
            PatientId = patient.Id,
            ChangeDate = DateTime.UtcNow,
            ChangeDescription = string.Join(", ", changes)
        };

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!PatientExists(patient.Id))
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

        // DELETE: api/Patients/email/{email}
        [HttpDelete("deleteUserByEmail/{email}")]
        [Authorize(Policy = "PatientOnly")]
        public async Task<IActionResult> DeletePatientByEmail(string email)
        {
            var patient = await _repository.GetPatientByEmailAsync(email);
            if (patient == null)
            {
                return NotFound();
            }
            patient.PendingDeletionDate = DateTime.UtcNow;

            await _repository.AddAuditLogForDeletionAsync(email);
           await _repository.UpdatePatientAsync(patient);
         

            return NoContent();
        }



        private bool PatientExists(long id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }
    

    [HttpDelete("deletePatientByEmailAsAdmin/{email}/delete")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> DeletePatientByEmailAsAdmin(string email)
    {
        // Find the patient by email
        var patient = await _repository.GetPatientByEmailAsync(email);
        if (patient == null)
        {
            return NotFound("Patient not found.");
        }

        // Check if the patient is already marked for deletion
        if (patient.PendingDeletionDate.HasValue)
        {
            return BadRequest("Patient is already marked for deletion.");
        }

        // Mark the patient for deletion
        patient.PendingDeletionDate = DateTime.UtcNow;

        // Log the deletion request
        await _repository.AddAuditLogForDeletionAsync(email);

        // Update the patient record
        await _repository.UpdatePatientAsync(patient);

        return NoContent(); // Respond with 204 No Content
    }

 }

}

