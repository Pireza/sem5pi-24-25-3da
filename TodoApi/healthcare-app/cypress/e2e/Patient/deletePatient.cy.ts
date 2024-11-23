describe('Patient page testing', () => {

    beforeEach(() => {
        cy.visit('/auth')
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept the login request
        cy.get('#login').click();
    });

it('delete function test', () => {


    cy.get('#burger', { timeout: 1000000 }).should('be.visible').click();

    cy.contains('.sidebar-menu li', 'Manage Profile').click(); 

    cy.contains('.sidebar-menu li', 'Update Profile');
    cy.contains('.sidebar-menu li', 'Delete Account').click();
    cy.on('window:alert', (text) => {
        // Validate the alert text
        expect(text).to.equal('Are you sure you want to delete your account?'); 
    });
    cy.on('window:confirm', () => false);

    

});
});