TESTS:

// Define the expected status codes for different scenarios
const expectedStatus = pm.response.code;

// Get query parameters from the request
const queryParams = pm.request.url.query;

// Convert query parameters into an array of keys
const paramKeys = queryParams.map(param => param.key);

// Check if any relevant parameters are present
const hasChanges = paramKeys.includes('newEmail') || 
                   paramKeys.includes('firstName') || 
                   paramKeys.includes('lastName') || 
                   paramKeys.includes('phone') || 
                   paramKeys.includes('emergencyContact');

// Test for successful update
if (expectedStatus === 204 && hasChanges) {
    pm.test("Update patient profile returns no content", function () {
        pm.response.to.have.status(204);
    });
} 
// Test for patient not found
else if (expectedStatus === 404) {
    pm.test("Patient not found returns 404", function () {
        pm.response.to.have.status(404);
    });
} 

// Test for no changes made
else if (expectedStatus === 204 && !hasChanges) {
    pm.test("No changes returns no content", function () {
        pm.response.to.have.status(204);
    });
} 
// Fallback for unexpected status codes
else {
    pm.test("Unexpected status code", function () {
        pm.response.to.have.status(expectedStatus);
    });
}
