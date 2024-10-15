using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Newtonsoft.Json;
using TodoApi.Models;

namespace TodoApi.Services
{
    public class AuthServicePatient
    {
        private readonly HttpClient _httpClient;
            private readonly UserContext _context;

         private const string Auth0Domain = AuthenticationConstants.DOMAIN;
        private const string ClientId = AuthenticationConstants.CLIENT_ID;
        private const string ClientSecret = AuthenticationConstants.CLIENT_SECRET;
        private const string Audience = $"https://{Auth0Domain}/api/v2/";


        public AuthServicePatient(HttpClient httpClient,UserContext context)
        {
            _httpClient = httpClient;
                    _context = context;

        }

    public async Task<string?> AuthenticateUser()
{
    var clientId = AuthenticationConstants.CLIENT_ID; // Auth0 Client ID
    var domain = AuthenticationConstants.DOMAIN; // Auth0 Domain
    var redirectUri = AuthenticationConstants.REDIRECTURI; // Redirect URI

    // Adding 'prompt=login' to force new login
    var authorizationUrl = $"https://{domain}/authorize?response_type=code&client_id={clientId}&redirect_uri={redirectUri}&scope=openid profile email&prompt=login";
    Console.WriteLine($"Redirecting to Auth0 for authentication: {authorizationUrl}");

    // Automatically open the Auth0 login page
    System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
    {
        FileName = authorizationUrl,
        UseShellExecute = true
    });

    // Wait for the callback and get the authorization code
    string? code = await WaitForCodeAsync();
    Console.WriteLine(code);
    if (!string.IsNullOrEmpty(code))
    {
        // Exchange the authorization code for an access token and ID token
        var tokenUrl = $"https://{domain}/oauth/token";
        var tokenPayload = new
        {
            client_id = clientId,
            client_secret = AuthenticationConstants.CLIENT_SECRET, // Replace with correct Client Secret
            code = code,
            redirect_uri = redirectUri,
            grant_type = "authorization_code"
        };

        var json = System.Text.Json.JsonSerializer.Serialize(tokenPayload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Send request to Auth0 using the injected HttpClient
        var response = await _httpClient.PostAsync(tokenUrl, content);
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Token Response: " + result); // Log the entire response

    var tokenResponse = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(result);
    var accessToken = tokenResponse.GetProperty("access_token").GetString();
    var idToken = tokenResponse.GetProperty("id_token").GetString(); // Extract ID token

   

    return idToken;
        }
        else
        {
            Console.WriteLine($"Error obtaining token: {response.StatusCode}");
        }
    }

    return null;
}

public async Task CreatePatientUser(CreatePatientRequest model, string password)
{
    var accessToken = await GetManagementApiTokenAsync(); // Obtain Auth0 Management API token

    using var client = new HttpClient();

    // Set authorization header with the Management API access token
    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

    // User registration payload
    var user = new
    {
        email = model.Email,
        username = model.Username,
        user_id = model.Email,  // Using email as user_id
        password = password,
        connection = "Username-Password-Authentication"  // Default Auth0 connection
    };

    // Send POST request to create the user
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
        throw new UserAlreadyExistsException("User already registered in the system");
    }

    // ============================
    // Role assignment for "Patient"
    // ============================
    var assignees = new
    {
        users = new string[1] { "auth0|" + model.Email } // User identifier with 'auth0|' prefix
    };
    var roleId = AuthenticationConstants.map["Patient"];  // Get the role ID for "Patient"

    // Send POST request to assign the "Patient" role
    requestContent = new StringContent(JsonConvert.SerializeObject(assignees), Encoding.UTF8, "application/json");
    response = await client.PostAsync($"https://{Auth0Domain}/api/v2/roles/{roleId}/users", requestContent);
    responseString = await response.Content.ReadAsStringAsync();

    if (response.IsSuccessStatusCode)
    {
        Console.WriteLine("Patient role assigned successfully.");
    }
    else
    {
        Console.WriteLine($"Error assigning role: {responseString}");
        throw new InvalidDataException("Role does not exist in the system");
    }

    // ==================================
    // Password reset email after creation
    // ==================================
    var passwordChangeRequest = new
    {
        client_id = ClientId,  // Replace with your actual Auth0 client ID
        email = model.Email,
        connection = "Username-Password-Authentication",
    };

    requestContent = new StringContent(JsonConvert.SerializeObject(passwordChangeRequest), Encoding.UTF8, "application/json");
    response = await client.PostAsync($"https://{Auth0Domain}/dbconnections/change_password", requestContent);
    responseString = await response.Content.ReadAsStringAsync();

    if (response.IsSuccessStatusCode)
    {
        Console.WriteLine("Password reset email sent successfully.");
    }
    else
    {
        Console.WriteLine($"Error sending password reset email: {responseString}");
    }
}
  public async Task RegisterNewPatient(CreatePatientRequest model, string password)
    {

        await CreatePatientUser(model, password);

    

       DateTime birthday;
    string format = "dd/MM/yyyy";
    bool isValidDate = DateTime.TryParseExact(model.Birthday, format, 
                                          System.Globalization.CultureInfo.InvariantCulture, 
                                          System.Globalization.DateTimeStyles.None, 
                                          out birthday);

    if (!isValidDate)
    {
        // Handle invalid date format here, throw an exception or return an error
        throw new FormatException("The Birthday is not in the correct format (DD/MM/YYYY).");
    }
    var patient = new Patient
    {
        Email = model.Email,
        Role = "Patient",
        UserName = model.Username,
        FirstName = model.FirstName,
        LastName = model.LastName,
        Birthday = birthday,  
        Gender = model.Gender,
        MedicalNumber = model.MedicalNumber,
        Phone = model.Phone,
        MedicalConditions = model.MedicalConditions,
        EmergencyContact = model.EmergencyContact
    };


        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        Console.WriteLine("User has been successfully registered.");

    }



        // WaitForCodeAsync method
        private async Task<string> WaitForCodeAsync()
        {
            using (var listener = new HttpListener()) // Create a new listener instance here
            {
                listener.Prefixes.Add(AuthenticationConstants.REDIRECTURI2);
                listener.Start();
                Console.WriteLine("Waiting for authentication...");

                var context = await listener.GetContextAsync();
                var code = context.Request.QueryString["code"];

                // If the authorization code is null or empty, throw an exception
                if (string.IsNullOrEmpty(code))
                {
                    Console.WriteLine("Verification on your email necessary to continue");
                    return null;
                }

                // Send a response to the browser after the login is completed
                using (var writer = new StreamWriter(context.Response.OutputStream))
                {
                    context.Response.StatusCode = 200;
                    writer.WriteLine("Authentication completed. You can close this window.");
                    writer.Flush(); // Ensure the response is sent to the browser
                }

                return code;
            }
        }

        // ExtractEmailFromIdToken method
        private string? ExtractEmailFromIdToken(string idToken)
        {
            try
            {
                var parts = idToken.Split('.');
                if (parts.Length == 3)
                {
                    var payload = parts[1];
                    // Add padding if necessary
                    switch (payload.Length % 4)
                    {
                        case 2: payload += "=="; break;
                        case 3: payload += "="; break;
                    }
                    var jsonBytes = Convert.FromBase64String(payload);
                    var json = Encoding.UTF8.GetString(jsonBytes);
                    var jsonElement = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(json);
                    return jsonElement.GetProperty("email").GetString();
                }
            }
            catch (FormatException ex)
            {
                Console.WriteLine($"Error decoding ID token: {ex.Message}");
            }
            catch (System.Text.Json.JsonException ex)
            {
                Console.WriteLine($"Error processing JSON: {ex.Message}");
            }
            return null;
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
    }
}

