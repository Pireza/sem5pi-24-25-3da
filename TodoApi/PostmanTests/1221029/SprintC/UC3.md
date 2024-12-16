TESTS:


// Parse the response JSON
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

// Test for successful retrieval of allergies
if (pm.response.code === 200) {
    pm.test("Allergies Retrieved Successfully", function () {
        pm.expect(response).to.have.property("data");
        pm.expect(response.data).to.be.an("array");
        pm.expect(response.data.length).to.be.greaterThan(0);

        // Validate the structure of each allergy
        response.data.forEach((allergy) => {
            pm.expect(allergy).to.have.property("name");
            pm.expect(allergy).to.have.property("code");
            pm.expect(allergy).to.have.property("codeSystem");
            pm.expect(allergy).to.have.property("description");
        });
    });
}

// Test for no allergies found
else if (pm.response.code === 404) {
    pm.test("No Allergies Found", function () {
        pm.expect(response).to.have.property("message", "No allergies found.");
    });
}

// Test for internal server error
else if (pm.response.code === 500) {
    pm.test("Internal Server Error", function () {
        pm.expect(response).to.have.property("message", "Failed to list allergies.");
        pm.expect(response).to.have.property("error");
    });
}
