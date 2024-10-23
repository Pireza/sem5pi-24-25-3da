using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Formats.Asn1;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Auth0.ManagementApi.Models;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Newtonsoft.Json;
using TodoApi.Models;

public class Auth0UserService
{
    private readonly UserRepository _repo;

    private const string Auth0Domain = AuthenticationConstants.DOMAIN;
    private const string ClientId = AuthenticationConstants.CLIENT_ID;
    private const string ClientSecret = AuthenticationConstants.CLIENT_SECRET;
    private const string Audience = $"https://{Auth0Domain}/api/v2/";
    private const string ConnectionType = "Username-Password-Authentication";


    public Auth0UserService(UserRepository repo)
    {
        _repo = repo;
    }
    public async Task<string> GetManagementApiTokenAsync()
    {
        using var client = new HttpClient();

        var tokenRequest = new
        {
            client_id = ClientId,
            client_secret = ClientSecret,
            audience = Audience,
            grant_type = "client_credentials"
        };

        var requestContent = new StringContent(JsonConvert.SerializeObject(tokenRequest), Encoding.UTF8, "application/json");

        var response = await client.PostAsync($"https://{Auth0Domain}/oauth/token", requestContent);
        var responseString = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Error retrieving token: {responseString}");
        }

        var tokenResponse = JsonConvert.DeserializeObject<dynamic>(responseString);
        return tokenResponse.access_token;
    }
    public async Task ResetPasswordAsync(string email)
    {
        using var client = new HttpClient();
        var resetPasswordRequest = new
        {
            email = email,
            connection = ConnectionType
        };



        var requestJSON = new StringContent(JsonConvert.SerializeObject(resetPasswordRequest), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"https://{Auth0Domain}/dbconnections/change_password", requestJSON);
        var responseString = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Password reset email sent successfuly");
        }
        else
        {
            Console.WriteLine($"Error sending email: {responseString}");
            throw new Exception();
        }

    }
    public async Task CreateUserAsync(RegisterUserDto model, string password)
    {
        var accessToken = await GetManagementApiTokenAsync();

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var user = new
        {
            email = model.Email,
            username = model.Username,
            user_id = model.Email,
            password = password,
            connection = "Username-Password-Authentication"
        };

        var requestContent = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");

        var response = await client.PostAsync($"https://{Auth0Domain}/api/v2/users", requestContent);
        var responseString = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("User created successfully.");
        }
        else
        {
            Console.WriteLine($"Error creating user: {responseString}");
            throw new Exception();
        }


        // ============================================
        // Bellow is role assignment after registration
        // ============================================

        var assignees = new
        {
            users = new string[1]
        };
        assignees.users[0] = "auth0|" + model.Email;
        var role_id = AuthenticationConstants.map[model.Role];

        Console.WriteLine(role_id);
        Console.WriteLine(model.Role);

        requestContent = new StringContent(JsonConvert.SerializeObject(assignees), Encoding.UTF8, "application/json");
        response = await client.PostAsync($"https://{Auth0Domain}/api/v2/roles/{role_id}/users", requestContent);
        responseString = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Role assigned successfuly");
        }
        else
        {
            Console.WriteLine($"Error creating user: {responseString}");
            throw new InvalidDataException("Role does not exist in the system");
        }


        // ===========================================
        // Bellow is password reset after registration
        // ===========================================

        var passwordChangeRequest = new
        {
            clientId = ClientId,
            email = model.Email,
            connection = "Username-Password-Authentication",
        };

        requestContent = new StringContent(JsonConvert.SerializeObject(passwordChangeRequest), Encoding.UTF8, "application/json");
        response = await client.PostAsync($"https://{Auth0Domain}/dbconnections/change_password", requestContent);
        responseString = await response.Content.ReadAsStringAsync();


        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Password rest email sent successfully.");
        }
        else
        {
            Console.WriteLine($"Error creating user: {responseString}");
        }


    }

    public async Task RegisterNewStaff(RegisterUserDto model, string password)
    {

        await CreateUserAsync(model, password);


        await _repo.AddStaff(model);
        Console.WriteLine("User has been successfully registered.");

    }


}
