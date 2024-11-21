describe('Patient page testing', () => {

    beforeEach(() => {
        cy.visit('/auth')
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept the login request
        cy.get('#login').click();
    });


    it('update function test success', () => {


        cy.get('#burger', { timeout: 1000000 }).should('be.visible').click();

        cy.contains('.sidebar-menu li', 'Manage Profile').click(); // Replace 'Button Text' with the actual button text

        cy.contains('.sidebar-menu li', 'Update Profile').click();
        
            // Mock API call
            cy.intercept('POST', 'http://localhost:5174/api/Patients/email/UpdateProfile', { statusCode: 200 }).as('updateRequest');
        
            // Fill in the form fields
            cy.get('input#firstName').clear().type('Gabriel');
            cy.get('input#lastName').clear().type('Monteiro');
            cy.get('input#phone').clear().type('911456789');
        
            // Submit the form
            cy.get('.button.submit-button').click();

            cy.on('window:alert', (text) => {
                // Validate the alert text
                expect(text).to.equal('Your profile has been updated!'); // Replace with the actual alert message
            });
        
        
    });

    it('update function test phone number not correct', () => {


        cy.get('#burger', { timeout: 1000000 }).should('be.visible').click();

        cy.contains('.sidebar-menu li', 'Manage Profile').click(); // Replace 'Button Text' with the actual button text

        cy.contains('.sidebar-menu li', 'Update Profile').click();
        
            // Mock API call
            cy.intercept('POST', 'http://localhost:5174/api/Patients/email/UpdateProfile', { statusCode: 200 }).as('updateRequest');
        
            // Fill in the form fields
            cy.get('input#firstName').clear().type('Gabriel');
            cy.get('input#lastName').clear().type('Monteiro');
            cy.get('input#phone').clear().type('9114567891');
        
            // Submit the form
            cy.get('.button.submit-button').click();

            cy.on('window:alert', (text) => {
                // Validate the alert text
                expect(text).to.equal('Error while trying to update your profile.'); // Replace with the actual alert message
            });
        
        
    });
});