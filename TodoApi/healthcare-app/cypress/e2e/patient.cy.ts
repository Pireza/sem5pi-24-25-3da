describe('Patient page testing', () => {

    beforeEach(() => {
        cy.visit('/auth')
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept the login request
        cy.get('#login').click();
    });


    it('patient functions', ()=> {

        cy.get('#burger', { timeout: 1000000 }).should('be.visible').click();

        cy.contains('.sidebar-menu li', 'Manage Profile').click(); // Replace 'Button Text' with the actual button text

        cy.contains('.sidebar-menu li', 'Update Profile');
        cy.contains('.sidebar-menu li', 'Delete Account');



    });
    

})
