using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class Auth0TokenService
{
    private static readonly HttpClient _httpClient = new HttpClient();
    private const string Auth0Domain = AuthenticationConstants.DOMAIN;
    private const string ClientId = AuthenticationConstants.CLIENT_ID;
    private const string ClientSecret = AuthenticationConstants.CLIENT_SECRET;
    private const string Audience = "https://" + Auth0Domain + "/api/v2/";

    public async Task<string> GetAccessTokenAsync()
    {
        var requestBody = new
        {
            client_id = ClientId,
            client_secret = ClientSecret,
            audience = Audience,
            grant_type = "client_credentials"
        };

        var response = await _httpClient.PostAsync(
            $"{Auth0Domain}/oauth/token",
            new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json")
        );

        var responseContent = await response.Content.ReadAsStringAsync();
        dynamic tokenResponse = JsonConvert.DeserializeObject(responseContent);
        return tokenResponse.access_token;
    }
}
