using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Auth0.ManagementApi.Models;
using Newtonsoft.Json;

public class Auth0UserService
{
    private const string Auth0Domain = AuthenticationConstants.DOMAIN;
    private const string ClientId = AuthenticationConstants.CLIENT_ID;
    private const string ClientSecret = AuthenticationConstants.CLIENT_SECRET;
    private const string Audience = $"https://{Auth0Domain}/api/v2/";

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
    public async Task CreateUserAsync(RegisterUserDto model, string password)
    {
        var accessToken = await GetManagementApiTokenAsync();

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);



        var user = new
        {
            email = model.Email,
            username = model.Username,
            password = password,
            connection = "Username-Password-Authentication"  // The default database connection
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
            throw new InvalidDataException();
        }

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

    public async Task RegisterNewUser(RegisterUserDto model, string password)
    {

            await CreateUserAsync(model, password);
            Console.WriteLine("User has been successfully registered.");
        
    }


}
