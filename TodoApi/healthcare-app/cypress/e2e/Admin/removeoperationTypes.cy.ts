describe('Admin Panel - Manage Operation Types', () => {

    beforeEach(() => {
        cy.visit('/auth')
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept the login request
        cy.get('#login').click();
    });
  
    // Load Operation Types Test
    it('should display only activated operation types in the dropdown', () => {
      // Intercept the GET request to load activated operation types from the correct URL
      cy.intercept('GET', 'http://localhost:5174/api/OperationType', {
        statusCode: 200,
        body: [
          { id: 4, name: 'Test1', isActive: 1 },
          { id: 5, name: 'Please Work', isActive: 1 },
          { id: 7, name: 'Operation1', isActive: 1 },
          { id: 8, name: 'Update', isActive: 1 },
          { id: 100, name: 'string', isActive: 1 },
          { id: 101, name: 'Yey', isActive: 1 },
          { id: 102, name: 'Shalala', isActive: 1 },
          { id: 104, name: 'asdasdsadsa', isActive: 1 },
          { id: 107, name: 'Test1d', isActive: 1 },
          { id: 108, name: 'Teste Final', isActive: 1 },
          { id: 110, name: 'Procedure', isActive: 1 },
          { id: 111, name: 'Testingasdsadsad', isActive: 1 },
          { id: 112, name: 'asddddddddddddddddddddddddddddddddd', isActive: 1 },
          { id: 113, name: 'llllllllllllllllllllllllllllllllllllllll', isActive: 1 },
          { id: 114, name: 'kjhgfcd', isActive: 1 }
        ]
      }).as('loadActivatedOperationTypes');
  
      // Wait for the intercept to be triggered
      cy.wait('@loadActivatedOperationTypes');
  
      // Ensure the dropdown has only activated operation types
      cy.get('#operationTypeId').find('option').should('have.length', 14);  // Including the default option
      cy.get('#operationTypeId').find('option').contains('Test1');
      cy.get('#operationTypeId').find('option').contains('Please Work');
      cy.get('#operationTypeId').find('option').contains('Operation1');
      cy.get('#operationTypeId').find('option').contains('Update');
      cy.get('#operationTypeId').find('option').contains('string');
      cy.get('#operationTypeId').find('option').contains('Yey');
      cy.get('#operationTypeId').find('option').contains('Shalala');
      cy.get('#operationTypeId').find('option').contains('asdasdsadsa');
      cy.get('#operationTypeId').find('option').contains('Test1d');
      cy.get('#operationTypeId').find('option').contains('Teste Final');
      cy.get('#operationTypeId').find('option').contains('Procedure');
      cy.get('#operationTypeId').find('option').contains('Testingasdsadsad');
      cy.get('#operationTypeId').find('option').contains('asddddddddddddddddddddddddddddddddd');
      cy.get('#operationTypeId').find('option').contains('llllllllllllllllllllllllllllllllllllllll');
      cy.get('#operationTypeId').find('option').contains('kjhgfcd');
    });
  
    // Deactivate Operation Type Test
    it('should deactivate the selected activated operation type', () => {
      // Intercept the GET request to load activated operation types
      cy.intercept('GET', 'http://localhost:5174/api/OperationType', {
        statusCode: 200,
        body: [
          { id: 4, name: 'Test1', isActive: 1 },
          { id: 5, name: 'Please Work', isActive: 1 },
          { id: 7, name: 'Operation1', isActive: 1 }
        ]
      }).as('loadActivatedOperationTypes');
  
      // Wait for the activated operation types to load
      cy.wait('@loadActivatedOperationTypes');
  
      // Select an activated operation type and deactivate it
      cy.get('#operationTypeId').select('Update');
      cy.intercept('POST', 'http://localhost:5174/api/OperationType/deactivate', {
        statusCode: 200,
        body: { message: 'Operation type deactivated successfully.' }
      }).as('deactivateOperationType');
  
      cy.get('button.btn-danger').click(); // Click deactivate button
  
      // Ensure the success message is displayed
      cy.contains('Operation type deactivated successfully.').should('be.visible');
      
      // Ensure the list is reloaded (e.g., the deactivated type isn't there anymore)
      cy.wait('@loadActivatedOperationTypes');
      cy.get('#operationTypeId').find('option').should('not.contain', 'Update');
    });
  
    // Check error message when no operation type is selected for deactivation
    it('should show error when no activated operation type is selected', () => {
      // Intercept the GET request to load activated operation types
      cy.intercept('GET', 'http://localhost:5174/api/OperationType', {
        statusCode: 200,
        body: [
          { id: 4, name: 'Test1', isActive: 1 },
          { id: 5, name: 'Please Work', isActive: 1 }
        ]
      }).as('loadActivatedOperationTypes');
  
      // Wait for the activated operation types to load
      cy.wait('@loadActivatedOperationTypes');
  
      // Do not select an operation type and click deactivate
      cy.get('button.btn-danger').click();
  
      // Ensure error message is shown
      cy.contains('Please select an operation type to deactivate.').should('be.visible');
    });
  
  });
  