

describe('Admin page testing', () => {

    beforeEach(() => {
        cy.visit('/auth')
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept the login request
        cy.get('#login').click();
    });

    it('admin search patient working', () => {


        cy.get('#burger', { timeout: 1000000 }).should('be.visible').click();

        cy.contains('.sidebar-menu li', 'Manage Patients').click(); // Replace 'Button Text' with the actual button text

        cy.contains('.sidebar-menu li', 'Search Patients').click();
        

        cy.get('#submit').click();
        
    });
    it('admin can navigate to the next and previous pages of search results', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Search Patients').click();
    
        cy.get('#submit').click();
    
        // Navigate to the next page
        cy.get('button#nextPage').should('be.visible').click();
 
    
        // Navigate back to the previous page
        cy.get('button#previousPage').should('be.visible');
     
    });
    
    it('admin can search for a patient by name', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Search Patients').click();

        cy.get('input#name').clear().type('gabriel');
        cy.get('#submit').click();

        // Assuming the search results would show "John Doe"
        cy.contains('Search Results:').should('be.visible');
    });

    it('admin can search for a patient by email', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Search Patients').click();

        cy.get('input#email').clear().type('gabrielpedromonteiro@gmail.com');
        cy.get('#submit').click();

        cy.contains('Search Results:').should('be.visible');
    });

    it('admin can search for a patient by date of birth', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Search Patients').click();

        cy.get('input#dateOfBirth').clear().type('2004-12-09');
        cy.get('#submit').click();

        // Check if results are displayed for the provided date of birth
        cy.contains('Search Results:').should('be.visible');
    });

    it('admin can search for a patient by medical number', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Search Patients').click();

        cy.get('input#medicalNumber').clear().type('1');
        cy.get('#submit').click();

        cy.contains('Search Results:').should('be.visible');
    });
    it('admin can search using multiple criteria', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Search Patients').click();
    
        cy.get('input#name').clear().type('gabriel');
        cy.get('input#email').clear().type('gabrielpedromonteiro@gmail.com');
        cy.get('#submit').click();
    
        cy.contains('Search Results:').should('be.visible');
        cy.contains('gabriel').should('be.visible');
        cy.contains('gabrielpedromonteiro@gmail.com').should('be.visible');
    });
   
        
})
