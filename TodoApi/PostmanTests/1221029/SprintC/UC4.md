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

// Handle different response scenarios
if (pm.response.code === 201) {
    pm.test("Medical Condition Created Successfully", function () {
        pm.expect(response).to.have.property("message", "Medical condition added successfully");
        pm.expect(response).to.have.property("data");

        const data = response.data;
        pm.expect(data).to.have.property("code");
        pm.expect(data).to.have.property("codeSystem");
        pm.expect(data).to.have.property("designation");
    });
} else if (pm.response.code === 400) {
    pm.test("Validation Error or Duplicate Entry", function () {
        pm.expect(response).to.have.property("error");
        pm.expect(response.error).to.satisfy(err => err === 'A medical condition with this code already exists' || err.includes('required'));
    });
} else if (pm.response.code === 500) {
    pm.test("Internal Server Error", function () {
        pm.expect(response).to.have.property("error", "Internal Server Error");
    });
}
