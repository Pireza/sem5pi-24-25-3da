describe('Admin Panel - Deactivate Staff Profile', () => {
    beforeEach(() => {
      cy.visit('/admin/deactivate-staff-profile');
      cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest');
      cy.get('#login').click();
    });
  
    // Test successful deactivation of a staff profile
    it('should successfully deactivate a staff profile when valid input is provided', () => {
      // Fill in the staff ID
      cy.get('#staffId').type('12345');
  
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Intercept the API request and mock a successful response
      cy.intercept('DELETE', 'http://localhost:5174/api/Staff/12345', {
        statusCode: 200,
      }).as('deactivateStaff');
  
      // Click the deactivate button
      cy.get('button.delete-button').click();
  
      // Wait for the request and verify the success message
      cy.wait('@deactivateStaff');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Staff profile has been successfully deactivated.');
      });
  
      // Ensure the user is redirected to the admin dashboard
      cy.url().should('include', '/admin-dashboard');
    });
  
    // Test deactivation with missing staff ID
    it('should show an alert when no staff ID is provided', () => {
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Try clicking the deactivate button
      cy.get('button.delete-button').click();
  
      // Verify the alert message
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Please provide a valid staff ID.');
      });
    });
  
    // Test deactivation with missing confirmation
    it('should disable the deactivate button until confirmation is checked', () => {
      // Fill in the staff ID
      cy.get('#staffId').type('12345');
  
      // Ensure the deactivate button is disabled
      cy.get('button.delete-button').should('be.disabled');
  
      // Check the confirmation checkbox
      cy.get('#confirmation').check();
  
      // Ensure the deactivate button is now enabled
      cy.get('button.delete-button').should('not.be.disabled');
    });
  
    // Test when the staff member is not found
    it('should show an error alert if the staff member is not found', () => {
      // Fill in the staff ID
      cy.get('#staffId').type('67890');
  
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Intercept the DELETE request and mock a 404 response
      cy.intercept('DELETE', 'http://localhost:5174/api/Staff/67890', {
        statusCode: 404,
      }).as('deactivateStaff');
  
      // Click the deactivate button
      cy.get('button.delete-button').click();
  
      // Wait for the request and verify the error alert
      cy.wait('@deactivateStaff');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Staff member not found.');
      });
    });
  
    // Test when the staff member is already deactivated
    it('should show an error alert if the staff member is already deactivated', () => {
      // Fill in the staff ID
      cy.get('#staffId').type('54321');
  
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Intercept the DELETE request and mock a 400 response
      cy.intercept('DELETE', 'http://localhost:5174/api/Staff/54321', {
        statusCode: 400,
        body: {
          message: 'Staff member is already deactivated.',
        },
      }).as('deactivateStaff');
  
      // Click the deactivate button
      cy.get('button.delete-button').click();
  
      // Wait for the request and verify the error alert
      cy.wait('@deactivateStaff');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Staff member is already deactivated.');
      });
    });
  
    // Test handling of unexpected errors
    it('should show a generic error alert if an unexpected error occurs', () => {
      // Fill in the staff ID
      cy.get('#staffId').type('99999');
  
      // Confirm the deactivation
      cy.get('#confirmation').check();
  
      // Intercept the DELETE request and mock a 500 response
      cy.intercept('DELETE', 'http://localhost:5174/api/Staff/99999', {
        statusCode: 500,
      }).as('deactivateStaff');
  
      // Click the deactivate button
      cy.get('button.delete-button').click();
  
      // Wait for the request and verify the error alert
      cy.wait('@deactivateStaff');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('An error occurred while deactivating the staff profile.');
      });
    });
  });
  