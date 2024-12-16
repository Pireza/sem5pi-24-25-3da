TESTS:


// Parse the response JSON
const response = pm.response.json();

// Test the status code
pm.test("Status Code Validation", function () {
    if (pm.response.code === 201) {
        pm.response.to.have.status(201);
    } else if (pm.response.code === 400) {
        pm.response.to.have.status(400);
    } else if (pm.response.code === 500) {
        pm.response.to.have.status(500);
    } else {
        pm.fail("Unexpected status code: " + pm.response.code);
    }
});

// Test for successful allergy creation
if (pm.response.code === 201) {
    pm.test("Allergy Created Successfully", function () {
        pm.expect(response).to.have.property("message", "Allergy added successfully");
        pm.expect(response.data).to.have.property("name");
        pm.expect(response.data).to.have.property("code");
        pm.expect(response.data).to.have.property("codeSystem");
    });
}

// Test for duplicate code error
else if (pm.response.code === 400) {
    pm.test("Duplicate Code Error", function () {
        pm.expect(response).to.have.property("error", "An allergy with this code already exists");
    });
}

// Test for internal server error (e.g., invalid input)
else if (pm.response.code === 500) {
    pm.test("Internal Server Error", function () {
        pm.expect(response).to.have.property("error", "Internal Server Error");
    });
}
