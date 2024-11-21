

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

        cy.contains('.sidebar-menu li', 'Update Operation Request').click();

        cy.get('#submit').click();
        
    });
    it('doctor can access Manage Operation Requests and Update Operation Request', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();

        cy.contains('.sidebar-menu li', 'Manage Operation Requests').click();
        cy.contains('.sidebar-menu li', 'Update Operation Request').click();

        // Verify the "Update Operation Request" form is visible
        cy.contains('h2', 'Update Operation Request').should('be.visible');
        
        cy.get('#operationRequest').select(1);  

        // Select the first option from the 'operationPriority' dropdown
        cy.get('#operationPriority').select(1);

        cy.get('#submit').click();

        cy.on('window:alert', (text) => {
            // Validate the alert text
            expect(text).to.equal('You only have permission to update your own requests!'); // Replace with the actual alert message
        });
    });

  
})
