describe('Create Operation Request Page Tests', () => {
    beforeEach(() => {
        cy.visit('/auth');
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept login request
        cy.get('#login').click();
    });

    it('should display the form elements correctly', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patient').click();
        cy.contains('.sidebar-menu li', 'Search Allergies').click();

        // Verify table headers
        cy.get('table thead tr').within(() => {
            cy.contains('th', 'Name').should('exist');
            cy.contains('th', 'Code').should('exist');
            cy.contains('th', 'Code System').should('exist');
            cy.contains('th', 'Description').should('exist');
        });
    });

});
