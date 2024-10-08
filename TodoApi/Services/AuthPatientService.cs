using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace TodoApi.Services
{
    public class AuthServicePatient
    {
        private readonly HttpClient _httpClient;

        public AuthServicePatient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

      public async Task<string?> AuthenticateUser()
{
    var clientId = "8gzuRxcChBjycTwEIqcUedN0Mjwy2p2P"; // Auth0 Client ID
    var domain = "dev-utkrfny6obmuy77m.eu.auth0.com"; // Auth0 Domain
    var redirectUri = "http://localhost:5000/callback"; // Redirect URI

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

    if (!string.IsNullOrEmpty(code))
    {
        // Exchange the authorization code for an access token and ID token
        var tokenUrl = $"https://{domain}/oauth/token";
        var tokenPayload = new
        {
            client_id = clientId,
            client_secret = "shwt2O56GiaaE511R2YHPEU43SNDlYq1wo307uuKCo50SE9Yay7QOB_onmVUWeU6", // Replace with correct Client Secret
            code = code,
            redirect_uri = redirectUri,
            grant_type = "authorization_code"
        };

        var json = JsonSerializer.Serialize(tokenPayload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Send request to Auth0 using the injected HttpClient
        var response = await _httpClient.PostAsync(tokenUrl, content);
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Token Response: " + result); // Log the entire response

    var tokenResponse = JsonSerializer.Deserialize<JsonElement>(result);
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


        // WaitForCodeAsync method
        private async Task<string> WaitForCodeAsync()
        {
            using (var listener = new HttpListener()) // Create a new listener instance here
            {
                listener.Prefixes.Add("http://localhost:5000/callback/");
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
                    var jsonElement = JsonSerializer.Deserialize<JsonElement>(json);
                    return jsonElement.GetProperty("email").GetString();
                }
            }
            catch (FormatException ex)
            {
                Console.WriteLine($"Error decoding ID token: {ex.Message}");
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Error processing JSON: {ex.Message}");
            }
            return null;
        }
    }
}
