TESTS:


// Parse the response
let response;
try {
    response = pm.response.json();
} catch (error) {
    response = null;
}

// Test the status code
pm.test("Status Code Validation", function () {
    if (pm.response.code === 200) {
        pm.response.to.have.status(200);
    } else if (pm.response.code === 404) {
        pm.response.to.have.status(404);
    } else if (pm.response.code === 500) {
        pm.response.to.have.status(500);
    } else {
        pm.fail("Unexpected status code: " + pm.response.code);
    }
});

// Handle different response scenarios
if (pm.response.code === 200) {
    pm.test("Medical Conditions Retrieved Successfully", function () {
        pm.expect(response).to.have.property("data");
        pm.expect(response.data).to.be.an("array").that.is.not.empty;

        // Validate fields in the first object of the array
        const condition = response.data[0];
        pm.expect(condition).to.have.property("code").that.is.a("string");
        pm.expect(condition).to.have.property("codeSystem").that.is.a("string");
        pm.expect(condition).to.have.property("designation").that.is.a("string");
        pm.expect(condition).to.have.property("description").that.is.a("string");
        pm.expect(condition).to.have.property("commonSymptoms").that.is.an("array");
    });
} else if (pm.response.code === 404) {
    pm.test("No Medical Conditions Found", function () {
        pm.expect(response).to.have.property("message", "No medical conditions found.");
    });
} else if (pm.response.code === 500) {
    pm.test("Internal Server Error", function () {
        pm.expect(response).to.have.property("message", "Failed to list medical conditions.");
        pm.expect(response).to.have.property("error");
    });
}
