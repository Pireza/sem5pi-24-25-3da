

describe('Doctor page testing', () => {

    beforeEach(() => {
        cy.visit('/auth')
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept the login request
        cy.get('#login').click();
    });

    // This will test password reset function
    it('doctor functions', () => {


        cy.get('#burger', { timeout: 1000000 }).should('be.visible').click();

        cy.contains('.sidebar-menu li', 'Manage Operation Requests').click(); // Replace 'Button Text' with the actual button text

        cy.contains('.sidebar-menu li', 'Remove Operation Request');
        cy.contains('.sidebar-menu li', 'Update Operation Request');
        cy.contains('.sidebar-menu li', 'Search Operation Requests').click();

        cy.get('#submit').click();
        
    });

})
