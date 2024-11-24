describe('Admin Page - Search Staff Profiles', () => {
    beforeEach(() => {
      cy.visit('/admin/search-staff-profiles'); // Adjust the path as necessary
      cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest');
      cy.get('#login').click(); // Log in
    });
  
    // Test that the search functionality works with only a name
    it('should allow admin to search staff by name', () => {
      cy.get('input#name').clear().type('John Doe');
      cy.get('button[type="submit"]').click();
  
      // Mock and intercept the API response for the search
      cy.intercept('POST', 'http://localhost:5174/api/StaffProfiles/search', {
        statusCode: 200,
        body: {
          staff: [
            { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
          ],
          totalRecords: 1,
        },
      }).as('searchRequest');
  
      cy.wait('@searchRequest');
  
      // Verify search results are displayed
      cy.contains('Search Results:').should('be.visible');
      cy.contains('John').should('be.visible');
      cy.contains('Doe').should('be.visible');
      cy.contains('john.doe@example.com').should('be.visible');
    });
  
    // Test searching by email
    it('should allow admin to search staff by email', () => {
      cy.get('input#email').clear().type('jane.doe@example.com');
      cy.get('button[type="submit"]').click();
  
      // Mock and intercept the API response for the search
      cy.intercept('POST', 'http://localhost:5174/api/StaffProfiles/search', {
        statusCode: 200,
        body: {
          staff: [
            { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' },
          ],
          totalRecords: 1,
        },
      }).as('searchRequest');
  
      cy.wait('@searchRequest');
  
      // Verify search results are displayed
      cy.contains('Search Results:').should('be.visible');
      cy.contains('Jane').should('be.visible');
      cy.contains('Doe').should('be.visible');
      cy.contains('jane.doe@example.com').should('be.visible');
    });
  
    // Test searching by specialization
    it('should allow admin to search staff by specialization', () => {
      cy.get('input#specialization').clear().type('Pediatrics');
      cy.get('button[type="submit"]').click();
  
      // Mock and intercept the API response for the search
      cy.intercept('POST', 'http://localhost:5174/api/StaffProfiles/search', {
        statusCode: 200,
        body: {
          staff: [
            { firstName: 'Emily', lastName: 'Smith', email: 'emily.smith@example.com' },
          ],
          totalRecords: 1,
        },
      }).as('searchRequest');
  
      cy.wait('@searchRequest');
  
      // Verify search results are displayed
      cy.contains('Search Results:').should('be.visible');
      cy.contains('Emily').should('be.visible');
      cy.contains('Smith').should('be.visible');
      cy.contains('emily.smith@example.com').should('be.visible');
    });
  
    // Test pagination functionality
    it('should allow admin to navigate through pages of search results', () => {
      cy.get('button[type="submit"]').click();
  
      // Mock and intercept the API response for multiple pages
      cy.intercept('POST', 'http://localhost:5174/api/StaffProfiles/search', {
        statusCode: 200,
        body: {
          staff: [
            { firstName: 'Page', lastName: 'One', email: 'page.one@example.com' },
          ],
          totalRecords: 20,
        },
      }).as('searchRequest');
  
      cy.wait('@searchRequest');
  
      // Click the next page button
      cy.get('button').contains('Next').click();
  
      // Mock and intercept the API response for the second page
      cy.intercept('POST', 'http://localhost:5174/api/StaffProfiles/search', {
        statusCode: 200,
        body: {
          staff: [
            { firstName: 'Page', lastName: 'Two', email: 'page.two@example.com' },
          ],
          totalRecords: 20,
        },
      }).as('nextPageRequest');
  
      cy.wait('@nextPageRequest');
  
      // Verify second page results
      cy.contains('Page Two').should('be.visible');
    });
  
    // Test when no results are found
    it('should display a message when no results are found', () => {
      cy.get('input#name').clear().type('Nonexistent Staff');
      cy.get('button[type="submit"]').click();
  
      // Mock and intercept the API response for no results
      cy.intercept('POST', 'http://localhost:5174/api/StaffProfiles/search', {
        statusCode: 200,
        body: {
          staff: [],
          totalRecords: 0,
        },
      }).as('searchRequest');
  
      cy.wait('@searchRequest');
  
      // Verify no results message is displayed
      cy.contains('No results found.').should('be.visible');
    });
  
    // Test searching with multiple criteria
    it('should allow admin to search using multiple criteria', () => {
      cy.get('input#name').clear().type('Chris');
      cy.get('input#email').clear().type('chris.johnson@example.com');
      cy.get('input#specialization').clear().type('Cardiology');
      cy.get('button[type="submit"]').click();
  
      // Mock and intercept the API response for multiple criteria
      cy.intercept('POST', 'http://localhost:5174/api/StaffProfiles/search', {
        statusCode: 200,
        body: {
          staff: [
            { firstName: 'Chris', lastName: 'Johnson', email: 'chris.johnson@example.com' },
          ],
          totalRecords: 1,
        },
      }).as('searchRequest');
  
      cy.wait('@searchRequest');
  
      // Verify search results match all criteria
      cy.contains('Chris').should('be.visible');
      cy.contains('Johnson').should('be.visible');
      cy.contains('chris.johnson@example.com').should('be.visible');
    });
  });
  