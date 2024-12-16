TESTS:

// Check if the status code is 200
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Check if the access token is in the response
pm.test("Response has access token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.accessToken).to.exist;  // Changed AccessToken to accessToken
});

// Check if the cookie is set
pm.test("Cookie is set", function () {
    var cookie = pm.cookies.get('access_token'); // Retrieve cookie by name
    pm.expect(cookie).to.exist; // Assert that the cookie exists
});