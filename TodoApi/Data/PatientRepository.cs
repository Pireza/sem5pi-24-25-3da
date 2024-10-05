using System.Threading.Tasks;
using TodoApi.Models;
using TodoApi.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace TodoApi.Data
{
    public class PatientRepository
    {
        private  PatientsController _controller;

        // Constructor for dependency injection
        public PatientRepository(PatientsController controller)
        {
            _controller = controller;
        }

        // Method to add a patient by calling the PatientsController POST method
        public async Task AddPatient(Patient newPatient)
        {
            var result = await _controller.PostPatient(newPatient);

            // Check if the result is a CreatedAtActionResult (successful creation)
            if (result.Result is CreatedAtActionResult)
            {
                // Patient was successfully added
                return;
            }
            else
            {
                throw new Exception("Failed to add the patient.");
            }
        }

        // Method to check if a patient exists by email via a GET request
        public async Task<Patient> CheckPatientExists(string email)
        {
            var result = await _controller.GetPatientByEmail(email);

            // Check if the result is a NotFoundResult
            if (result.Result is NotFoundResult)
            {
                return null; // Patient not found
            }
            // Check if the result is OkObjectResult and extract the patient
            else if (result.Result is OkObjectResult okResult)
            {
                return (Patient)okResult.Value; // Return the found patient
            }
            else
            {
                throw new Exception("An unexpected error occurred while checking if the patient exists.");
            }
        }
    }
}
