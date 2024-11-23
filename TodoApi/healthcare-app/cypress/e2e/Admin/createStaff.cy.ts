describe('Create Staff Profile Page Tests', () => {
    beforeEach(() => {
      cy.visit('/auth');
      cy.intercept('POST', 'http://localhost:5174/api/Staff/authenticate').as('loginRequest'); // Intercept login request
      cy.get('#login').click();
    });
  

    it('should not submit if required fields are missing', () => {
      cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
      cy.contains('.sidebar-menu li', 'Manage Staff').click();
      cy.contains('.sidebar-menu li', 'Create a New Staff User').click();
  
      // Try to submit the form with empty required fields
      cy.get('button[type="submit"]').click();
  
      // Ensure alert message is shown
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Please fill in all required fields!');
      });
    });
  
    
  
    it('should validate all required fields before submission', () => {
      cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
      cy.contains('.sidebar-menu li', 'Manage Staff').click();
      cy.contains('.sidebar-menu li', 'Create a New Staff User').click();
  
      // Leave the form empty and check validation
      cy.get('button[type="submit"]').click();
  
      // Check alert for missing fields
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Please fill in all required fields!');
      });
    });
  });
  