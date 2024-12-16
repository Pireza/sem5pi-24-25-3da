TESTS:


if (pm.response.code === 200) {
    // Test for 200 OK response
    pm.test("Status code is 200", function () {
        pm.response.to.have.status(200);
    });

    // In case of a 200 response, the 400 tests should fail
    pm.test("Status code is NOT 400", function () {
        pm.expect(pm.response.code).to.not.equal(400);
    });

    // Add additional tests related to successful responses if needed

} else if (pm.response.code === 400) {
    // Test for 400 Bad Request response
    pm.test("Status code is 400", function () {
        pm.response.to.have.status(400);
    });

    // In case of a 400 response, the 200 test should fail
    pm.test("Status code is NOT 200", function () {
        pm.expect(pm.response.code).to.not.equal(200);
    });

    // Check for specific error messages based on the response body
    var responseText = pm.response.text();

    pm.test("Response message is 'User already exists in the system'", function () {
        if (responseText.includes("User already exists in the system")) {
            pm.expect(responseText).to.eql("User already exists in the system");
        }
    });

} else {
    pm.test("Unexpected status code", function () {
        pm.expect(pm.response.code).to.be.oneOf([200, 400]);
    });
}
