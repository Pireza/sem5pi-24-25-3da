describe('Update Operation Type Page Tests', () => {
    beforeEach(() => {
        cy.visit('/auth');
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept login request
        cy.get('#login').click();
    });

    it('should display validation error for missing required fields', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Update Operation Type').click();

        // Attempt to submit with empty fields
        cy.get('button[type="submit"]').click();

        // Verify validation messages
        cy.contains('ID is required.').should('be.visible');
        cy.contains('Name is required and must be under 100 characters.').should('be.visible');
        cy.contains('Invalid duration format. Please use HH:mm:ss.').should('not.exist'); // Not shown unless duration is incorrect
    });

    it('should update operation type successfully', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Update Operation Type').click();

        // Fill in the form
        cy.get('#id').type('123');
        cy.get('#name').type('New Operation Type');
        cy.get('#duration').type('02:30:00');
        cy.get('#staff').type('1,2,3');

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Verify success message
        cy.contains('Operation type updated successfully!').should('be.visible');
    });

    it('should show error for invalid duration format', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Update Operation Type').click();

        // Enter invalid duration
        cy.get('#id').type('123');
        cy.get('#name').type('Test Operation');
        cy.get('#duration').type('2:300'); // Invalid format

        // Attempt to submit
        cy.get('button[type="submit"]').click();

        // Verify validation message for duration
        cy.contains('Invalid duration format. Please use HH:mm:ss.').should('be.visible');
    });

    it('should reset the form after successful submission', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Update Operation Type').click();

        // Fill in the form
        cy.get('#id').type('456');
        cy.get('#name').type('Temporary Operation');
        cy.get('#duration').type('01:15:00');
        cy.get('#staff').type('4,5');

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Verify form fields are cleared
        cy.get('#id').should('have.value', '');
        cy.get('#name').should('have.value', '');
        cy.get('#duration').should('have.value', '');
        cy.get('#staff').should('have.value', '');
    });

    it('should handle server-side errors gracefully', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Operations').click();
        cy.contains('.sidebar-menu li', 'Update Operation Type').click();

        // Mock server response for error
        cy.intercept('POST', 'http://localhost:5174/api/OperationTypes/update', {
            statusCode: 400,
            body: { error: 'Bad request' },
        }).as('updateRequest');

        // Fill in the form
        cy.get('#id').type('789');
        cy.get('#name').type('Faulty Operation');
        cy.get('#duration').type('03:00:00');
        cy.get('#staff').type('7,8');

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for server response and verify error message
        cy.wait('@updateRequest');
        cy.contains('Bad request').should('be.visible');
    });
});
