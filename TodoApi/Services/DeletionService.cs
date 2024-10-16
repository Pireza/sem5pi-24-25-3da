using System.Text;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TodoApi.Models;
using TodoApi.Services;

public class DeletionService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
     private const string Auth0Domain = AuthenticationConstants.DOMAIN;
        private const string ClientId = AuthenticationConstants.CLIENT_ID;
        private const string ClientSecret = AuthenticationConstants.CLIENT_SECRET;
        private const string Audience = $"https://{Auth0Domain}/api/v2/";


    public DeletionService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
       
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<UserContext>();

                // Fetch patients who are due for deletion
                var patientsToDelete = await context.Patients
                    .Where(p => p.PendingDeletionDate.HasValue 
                                 && p.PendingDeletionDate.Value.AddDays(30) <= DateTime.UtcNow)
                    .ToListAsync();

                // Iterate through each patient
                foreach (var patient in patientsToDelete)
                {
                    try
                    {
                        // Attempt to delete the user from Auth0
                        await DeleteUserFromAuth0(patient.Email);

                        // If successful, remove the patient from the local database
                        context.Patients.Remove(patient);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to delete user {patient.Email} from Auth0: {ex.Message}");
                        // Handle logging or other error actions as needed
                    }
                }

                // Save changes after processing all patients
                await context.SaveChangesAsync();
            }

            // Delay before checking again
            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }
        private async Task DeleteUserFromAuth0(string email)
{
    var accessToken = await GetManagementApiTokenAsync(); // Obtain Auth0 Management API token
    var userId = await GetUserIdByEmailAsync(email); // Get user ID by email
    Console.WriteLine(userId);

    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

    var response = await client.DeleteAsync($"https://{Auth0Domain}/api/v2/users/{userId}");

    if (!response.IsSuccessStatusCode)
    {
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Error deleting user in Auth0: {responseString}");
        throw new InvalidOperationException("Failed to delete user in Auth0.");
    }

    Console.WriteLine("User deleted successfully in Auth0.");
}
 public async Task<string> GetManagementApiTokenAsync()
    {
        using var client = new HttpClient();

        var tokenRequest = new
        {
            client_id = ClientId,
            client_secret = ClientSecret,
            audience = Audience,
            grant_type = "client_credentials",
            scope = "create:users"


        };

        var requestContent = new StringContent(JsonConvert.SerializeObject(tokenRequest), Encoding.UTF8, "application/json");

        var response = await client.PostAsync($"https://{Auth0Domain}/oauth/token", requestContent);
        var responseString = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Error retrieving token: {responseString}");
        }

        var tokenResponse = JsonConvert.DeserializeObject<dynamic>(responseString);
         var accessToken = tokenResponse.access_token;

    // Optionally decode the token to check its scopes
    Console.WriteLine($"Management API Token: {accessToken}");
        return tokenResponse.access_token;
    }
 private async Task<string> GetUserIdByEmailAsync(string email)
{
    var accessToken = await GetManagementApiTokenAsync(); // Obtain Auth0 Management API token

    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

    var response = await client.GetAsync($"https://{Auth0Domain}/api/v2/users-by-email?email={email}");
    
    if (response.IsSuccessStatusCode)
    {
        var userResponse = await response.Content.ReadAsStringAsync();
        var users = JsonConvert.DeserializeObject<List<dynamic>>(userResponse);

        if (users != null && users.Count > 0)
        {
            return users[0].user_id; // Return the user_id of the first user found
        }
    }

    throw new InvalidOperationException("User not found with the provided email.");
}
}
