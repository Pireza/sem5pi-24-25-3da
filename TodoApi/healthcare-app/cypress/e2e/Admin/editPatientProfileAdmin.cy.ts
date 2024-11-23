describe('Edit Patient Profile Page Tests', () => {
    beforeEach(() => {
        cy.visit('/auth');
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept login request
        cy.get('#login').click();
    });


    it('should allow adding a medical condition', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Edit Patient Profile').click();

        // Add a medical condition and validate it appears in the list
        cy.get('.medical-conditions input').type('Diabetes');
        cy.get('button').contains('Add').click();
        cy.get('.medical-conditions ul li').should('contain', 'Diabetes');
    });

    it('should allow removing a medical condition', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Edit Patient Profile').click();

        // Add a condition and validate
        cy.get('.medical-conditions input').type('Hypertension');
        cy.get('button').contains('Add').click();
        cy.get('.medical-conditions ul li').should('contain', 'Hypertension');

        // Remove the condition and ensure it's gone
        cy.get('.medical-conditions ul li button').contains('Remove').click();
        cy.get('.medical-conditions ul li').should('not.exist');
    });

    it('should validate email selection before submission', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Edit Patient Profile').click();

        // Attempt to submit without selecting an email
        cy.get('#email').select('');
        cy.get('.submit-btn').click();

        // Verify alert for missing email
        cy.on('window:alert', (text) => {
            expect(text).to.contains('Email is required!');
        });
    });
});
