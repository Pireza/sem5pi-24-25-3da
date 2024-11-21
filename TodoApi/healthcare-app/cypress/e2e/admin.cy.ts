

describe('Admin page testing', () => {

    beforeEach(() => {
        cy.visit('/auth')
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept the login request
        cy.get('#login').click();
    });

    // This will test password reset function
    it('admin functions', () => {


        cy.get('#burger', { timeout: 1000000 }).should('be.visible').click();

        cy.contains('.sidebar-menu li', 'Manage Operation Types').click(); // Replace 'Button Text' with the actual button text

        cy.contains('.sidebar-menu li', 'Add New Operation Type');
        cy.contains('.sidebar-menu li', 'Delete Operation Type');
        cy.contains('.sidebar-menu li', 'Search Operation Types').click();

        cy.get('#submit').click();
        
    });

})
