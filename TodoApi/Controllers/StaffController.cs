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
    [Route("api/staff")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly UserContext _context;
        private readonly AuthServicePatient _authServicePatient;
   

        public StaffController(UserContext context, AuthServicePatient authServicePatient)
        {
            _context = context;
            _authServicePatient = authServicePatient; // Inject AuthServicePatient
        }

        // GET: api/staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Staff>>> GetStaff()
        {
            return await _context.Staff.ToListAsync();
        }

    

        // GET: api/staff/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Staff>> GetStaff(long id)
        {
            var staff = await _context.Staff.FindAsync(id);

            if (staff == null)
            {
                return NotFound();
            }

            return staff;
        }

        // GET: api/staff/email/{email}
        [HttpGet("email/{email}")]
        public async Task<ActionResult<Staff>> GetStaffByEmail(string email)
        {
            var staff = await _context.Staff.FirstOrDefaultAsync(p => p.Email == email);

            if (staff == null)
            {
                return NotFound();
            }

            return Ok(staff);
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



        // POST: api/staff
        [HttpPost]
        public async Task<ActionResult<Patient>> PostStaff(Staff staff)
        {
            _context.Staff.Add(staff);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStaff", new { id = staff.Id }, staff);
        }

        // PUT: api/staff({id})
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaff(long id, Staff staff)
        {
            if (id != staff.Id)
            {
                return BadRequest();
            }

            _context.Entry(staff).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffExists(id))
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

        // DELETE: api/staff/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(long id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }

            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StaffExists(long id)
        {
            return _context.Staff.Any(e => e.Id == id);
        }
    }
}
