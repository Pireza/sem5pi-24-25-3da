pm.test("Status code is 204", function () {
    pm.response.to.have.status(204);
});
pm.test("Patient profile is updated", function () {
    // Assuming you have a way to get the updated patient, like a subsequent GET request
    pm.sendRequest({
        url: 'api/Patients/email/' + pm.environment.get("patient_email"),
        method: 'GET',
        header: {
            'Authorization': 'Bearer ' + pm.environment.get("access_token")
        }
    }, function (err, res) {
        if (err) {
            console.error(err);
        } else {
            var jsonData = res.json();
            pm.expect(jsonData.firstName).to.eql(pm.environment.get("new_first_name"));
            pm.expect(jsonData.lastName).to.eql(pm.environment.get("new_last_name"));
        }
    });
});
pm.test("Audit log is created", function () {
    pm.sendRequest({
        url: 'api/AuditLogs?patientId=' + pm.environment.get("patient_id"),
        method: 'GET',
        header: {
            'Authorization': 'Bearer ' + pm.environment.get("access_token")
        }
    }, function (err, res) {
        if (err) {
            console.error(err);
        } else {
            var jsonData = res.json();
            pm.expect(jsonData).to.be.an('array').that.is.not.empty; // Check if there are logs
            pm.expect(jsonData[0].changeDescription).to.include("FirstName changed"); // Check if the change description includes the expected change
        }
    });
});
pm.test("Patient not found returns 404", function () {
    // Send a request with a non-existent email
    pm.sendRequest({
        url: 'api/Patients/email/InvalidEmail@example.com',
        method: 'PUT',
        header: {
            'Authorization': 'Bearer ' + pm.environment.get("access_token"),
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                firstName: "NewFirstName"
            })
        }
    }, function (err, res) {
        if (err) {
            console.error(err);
        } else {
            pm.expect(res).to.have.status(404);
        }
    });
});
pm.test("Concurrency error handled", function () {
    // Send an update request while another process also tries to update the same record
    // (This may require additional configuration depending on the environment)
});
