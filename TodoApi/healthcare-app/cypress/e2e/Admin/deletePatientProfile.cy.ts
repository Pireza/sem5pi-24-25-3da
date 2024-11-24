describe('Admin Panel - Deactivate Patient Profile', () => {
    beforeEach(() => {
      cy.visit('/admin/delete-patient-profile');
      cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest');
      cy.get('#login').click();
    });
  
    // Test successful deactivation of a patient profile
    it('should successfully deactivate a patient profile when valid input is provided', () => {
      // Fill in the patient email
      cy.get('#patientEmail').type('testpatient@example.com');
  
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Intercept the DELETE request and mock a successful response
      cy.intercept('DELETE', 'http://localhost:5174/api/Patients/testpatient@example.com', {
        statusCode: 204,
      }).as('deactivatePatient');
  
      // Click the deactivate button
      cy.get('button.delete-button').click();
  
      // Wait for the request and verify the success message
      cy.wait('@deactivatePatient');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Patient Profile marked for deletion successfully.');
      });
  
      // Ensure the user is redirected to the admin dashboard
      cy.url().should('include', '/admin-dashboard');
    });
  
    // Test deactivation with missing email
    it('should show an alert when no email is provided', () => {
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Try clicking the deactivate button
      cy.get('button.delete-button').click();
  
      // Verify the alert message
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Please provide a patient email.');
      });
    });
  
    // Test deactivation with missing confirmation
    it('should disable the deactivate button until confirmation is checked', () => {
      // Fill in the patient email
      cy.get('#patientEmail').type('testpatient@example.com');
  
      // Ensure the deactivate button is disabled
      cy.get('button.delete-button').should('be.disabled');
  
      // Check the confirmation checkbox
      cy.get('#confirmation').check();
  
      // Ensure the deactivate button is now enabled
      cy.get('button.delete-button').should('not.be.disabled');
    });
  
    // Test when the patient is not found
    it('should show an error alert if the patient is not found', () => {
      // Fill in the patient email
      cy.get('#patientEmail').type('nonexistentpatient@example.com');
  
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Intercept the DELETE request and mock a 404 response
      cy.intercept('DELETE', 'http://localhost:5174/api/Patients/nonexistentpatient@example.com', {
        statusCode: 404,
      }).as('deactivatePatient');
  
      // Click the deactivate button
      cy.get('button.delete-button').click();
  
      // Wait for the request and verify the error alert
      cy.wait('@deactivatePatient');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Patient not found. Please check the email address and try again.');
      });
    });
  
    // Test when the user does not have permissions
    it('should show an error alert if the user lacks permission to deactivate a profile', () => {
      // Fill in the patient email
      cy.get('#patientEmail').type('testpatient@example.com');
  
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Intercept the DELETE request and mock a 403 response
      cy.intercept('DELETE', 'http://localhost:5174/api/Patients/testpatient@example.com', {
        statusCode: 403,
      }).as('deactivatePatient');
  
      // Click the deactivate button
      cy.get('button.delete-button').click();
  
      // Wait for the request and verify the error alert
      cy.wait('@deactivatePatient');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('You do not have the necessary permissions to deactivate this profile.');
      });
    });
  
    // Test when the patient is already marked for deletion
    it('should show an error alert if the patient is already marked for deletion', () => {
      // Fill in the patient email
      cy.get('#patientEmail').type('testpatient@example.com');
  
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Intercept the DELETE request and mock a 409 response
      cy.intercept('DELETE', 'http://localhost:5174/api/Patients/testpatient@example.com', {
        statusCode: 409,
        body: {
          message: 'Patient is already marked for deletion.',
        },
      }).as('deactivatePatient');
  
      // Click the deactivate button
      cy.get('button.delete-button').click();
  
      // Wait for the request and verify the error alert
      cy.wait('@deactivatePatient');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Patient is already marked for deletion.');
      });
    });
  });
  