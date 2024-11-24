describe('Create Operation Request Page Tests', () => {
    beforeEach(() => {
        cy.visit('/auth');
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept login request
        cy.get('#login').click();
    });

    it('should display the form elements correctly', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Create Operation Request').click();

        // Verify all form elements are present
        cy.get('form').should('exist');
        cy.get('#patientId').should('exist');
        cy.get('#operationTypeId').should('exist');
        cy.get('#priorityId').should('exist');
        cy.get('#deadline').should('exist');
        cy.get('button[type="submit"]').should('exist');
    });

    it('should validate required fields before submission', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Create Operation Request').click();

        // Attempt to submit the form without filling it out
        cy.get('button[type="submit"]').click();

        // Verify alert for missing fields
        cy.on('window:alert', (text) => {
            expect(text).to.contain('Please fill in all required fields!');
        });
    });

    it('should successfully submit the form with valid data', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Create Operation Request').click();

        // Fill in the form
        cy.get('#patientId').type('1');
        cy.get('#operationTypeId').type('101');
        cy.get('#priorityId').type('2');
        cy.get('#deadline').type('2024-12-31');

        // Mock server response for successful creation
        cy.intercept('POST', 'http://localhost:5174/api/Operations/create', {
            statusCode: 200,
            body: 'Operation request created successfully!',
        }).as('createRequest');

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for the response and verify success alert
        cy.wait('@createRequest');
        cy.on('window:alert', (text) => {
            expect(text).to.contain('Operation request created successfully!');
        });

        // Verify redirection to the dashboard
        cy.url().should('include', '/doctor-dashboard');
    });

    it('should handle server-side errors gracefully', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Create Operation Request').click();

        // Fill in the form
        cy.get('#patientId').type('1');
        cy.get('#operationTypeId').type('102');
        cy.get('#priorityId').type('3');
        cy.get('#deadline').type('2024-12-31');

        // Mock server response for an error
        cy.intercept('POST', 'http://localhost:5174/api/Operations/create', {
            statusCode: 400,
            body: { error: 'Bad request' },
        }).as('createRequestError');

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for the response and verify error alert
        cy.wait('@createRequestError');
        cy.on('window:alert', (text) => {
            expect(text).to.contain('Error: Bad request');
        });
    });

    it('should reset the form after navigating away and back', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Create Operation Request').click();

        // Fill in the form
        cy.get('#patientId').type('1');
        cy.get('#operationTypeId').type('101');
        cy.get('#priorityId').type('2');
        cy.get('#deadline').type('2024-12-31');

        // Navigate away and back
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Create Operation Request').click();

        // Verify the form is reset
        cy.get('#patientId').should('have.value', '');
        cy.get('#operationTypeId').should('have.value', '');
        cy.get('#priorityId').should('have.value', '');
        cy.get('#deadline').should('have.value', '');
    });
});
