using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TodoApi.Services;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private static AuthServicePatient _authService;

        // Static method to initialize the service
        public static void Initialize(AuthServicePatient authService)
        {
            _authService = authService;
        }

        public static async Task<string?> LoginPatient()
        {
            // Ensure the service is initialized
            if (_authService == null)
            {
                throw new InvalidOperationException("AuthService is not initialized.");
            }

            return await _authService.AuthenticateUser();
        }
    }
}
