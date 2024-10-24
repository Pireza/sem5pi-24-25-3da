TESTS:

// Define the expected status codes for different scenarios
const expectedStatus = pm.response.code;

// Test for successful deletion
if (expectedStatus === 204) {
    pm.test("Patient deleted successfully returns no content", function () {
        pm.response.to.have.status(204);
    });
} 
// Test for patient not found
else if (expectedStatus === 404) {
    pm.test("Patient not found returns 404", function () {
        pm.response.to.have.status(404);
    });
} 
// Fallback for unexpected status codes
else {
    pm.test("Unexpected status code", function () {
        pm.response.to.have.status(expectedStatus);
    });
}
