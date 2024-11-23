describe('Edit Staff Profile Page Tests', () => {
    beforeEach(() => {
      cy.visit('/auth');
      cy.intercept('POST', 'http://localhost:5174/api/Staff/authenticate').as('loginRequest'); // Intercept login request
      cy.get('#login').click();
    });
  
    it('should load the edit staff form with staff emails', () => {
      cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
      cy.contains('.sidebar-menu li', 'Manage Staff').click();
      cy.contains('.sidebar-menu li', 'Edit Staff Profile').click();
  
      // Ensure the email dropdown is visible and populated with emails
      cy.get('#staffEmail').should('be.visible');
      cy.get('#staffEmail option').should('have.length.greaterThan', 0); // Check that the list has emails
    });
  

  });
  