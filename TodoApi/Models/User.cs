using System.ComponentModel.DataAnnotations;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;
[Index(nameof(Email), IsUnique = true)]

public class User
{
    public long Id { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public virtual string Role { get; set; }

    public User() { }
    public User(string Email, string UserName, string Role)
    {
        if (ValidateAttributes(Email, UserName, Role))
        {
            this.Email = Email;
            this.UserName = UserName;
            this.Role = Role;
        }
        else
        {
            throw new ArgumentException("Invalid arguments for user creation");
        }
    }

    private bool ValidateAttributes(string Email, string Username, string Role)
    {
        try
        {
            MailAddress mail = new MailAddress(Email);
        }
        catch (FormatException) { return false; }

        if (!AuthenticationConstants.map.ContainsKey(Role))
            return false;

        if (Username.Contains(' '))
            return false;

        return true;
    }
}