using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Services; // Ensure to include this namespace
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly UserContext _context;
        private readonly AuthServicePatient _authServicePatient;
   

        public PatientsController(UserContext context, AuthServicePatient authServicePatient)
        {
            _context = context;
            _authServicePatient = authServicePatient; // Inject AuthServicePatient
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            return await _context.Patients.ToListAsync();
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



        // POST: api/Patients
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatient", new { id = patient.Id }, patient);
        }

        // PUT: api/Patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(long id, Patient patient)
        {
            if (id != patient.Id)
            {
                return BadRequest();
            }

            _context.Entry(patient).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PatientExists(long id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }
    }
}
