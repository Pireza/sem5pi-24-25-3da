using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TodoApi.Data;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private static AuthServicePatient _authService;

    
        private static PatientRepository _repository ;
        private UserContext dbContext;
        private PatientsController patientsController;

        public PatientController(UserContext dbContext)
        {
            this.dbContext = dbContext;
            patientsController = new PatientsController(dbContext);
            _repository= new PatientRepository(patientsController);
        }

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

        public static async Task AddPatient(Models.Patient newPatient){
            await _repository.AddPatient(newPatient);
            return;
        }

        public static async Task<Patient> CheckPatientExists(string email)
        {
            return await _repository.CheckPatientExists( email);
            
            }
    }
}
