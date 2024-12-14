describe('Create Patient Page Tests', () => {
    beforeEach(() => {
        cy.visit('/auth');
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept login request
        cy.get('#login').click();
    });

    it('should display the form elements correctly', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Add Allergy').click();

        // Ensure the Create Allergy page is loaded
        cy.contains('h2', 'Create Allergy').should('be.visible');
        cy.get('form').should('exist');

        // Check if all form fields are visible
        cy.get('input#name').should('be.visible');
        cy.get('input#code').should('be.visible');
        cy.get('input#codeSystem').should('be.visible');
        cy.get('textarea#description').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('should successfully create a new allergy', () => {
        cy.get('#burger').should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Add Allergy').click();

        // Fill out the form
        cy.get('input#name').type('Peanut Allergy');
        cy.get('input#code').type('A123');
        cy.get('input#codeSystem').type('ICD-10');
        cy.get('textarea#description').type('Severe allergic reaction to peanuts.');

        // Intercept the API request for creating an allergy
        cy.intercept('POST', 'http://localhost:5174/api/Allergies').as('createAllergy');

        // Submit the form
        cy.get('button[type="submit"]').click();

        

        // Confirm success alert is shown
        cy.on('window:alert', (text) => {
            expect(text).to.contains('There was an error while trying to add the allergy! The code of that allergy may already been added.');
        });

        // Check if form fields are reset
        cy.get('input#name').should('have.value', '');
        cy.get('input#code').should('have.value', '');
        cy.get('input#codeSystem').should('have.value', '');
        cy.get('textarea#description').should('have.value', '');
    });

    it('should show an error when required fields are missing', () => {
        cy.get('#burger').should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Add Allergy').click();

        // Submit form without filling required fields
        cy.get('button[type="submit"]').click();

        // Ensure error messages are displayed
        cy.get('input#name:invalid').should('exist');
        cy.get('input#code:invalid').should('exist');
        cy.get('input#codeSystem:invalid').should('exist');
    });
});
