using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;
using TodoApi.Models;

[Route("api/[controller]")]
[ApiController]
public class StaffUserController : ControllerBase
{
    private readonly Auth0UserService _auth0Service;
    private readonly PasswordGeneratorService _passService;

    public StaffUserController(Auth0UserService auth0Service, PasswordGeneratorService passService)
    {
        _auth0Service = auth0Service;
        _passService = passService;
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] string email)
    {
        if (string.IsNullOrEmpty(email))
            return BadRequest("Email must not be empty");

        try
        {
            MailAddress mail = new MailAddress(email);
        }
        catch (FormatException)
        {
            return BadRequest("Email format not supported");
        }

        try
        {
            await _auth0Service.ResetPasswordAsync(email);
            return Ok("Password reset email sent successfuly");
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto model)
    {
        if (model == null)
        {
            return BadRequest("User information is required.");
        }

        try
        {

            await _auth0Service.RegisterNewStaff(model, _passService.GeneratePassword());
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
}

public class RegisterUserDto
{
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
}

