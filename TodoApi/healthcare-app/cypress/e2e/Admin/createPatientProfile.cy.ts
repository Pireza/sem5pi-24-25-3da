describe('Create Patient Page Tests', () => {
    beforeEach(() => {
        cy.visit('/auth');
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept login request
        cy.get('#login').click();
    });

    it('should display the form elements correctly', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Create Patient').click();

        cy.get('form').should('exist');
        cy.get('#username').should('exist');
        cy.get('#firstName').should('exist');
        cy.get('#lastName').should('exist');
        cy.get('#email').should('exist');
        cy.get('#birthday').should('exist');
        cy.get('#gender').should('exist');
        cy.get('#phone').should('exist');
        cy.get('#emergencyContact').should('exist');
        cy.get('.medical-conditions input').should('exist');
        cy.get('#AddButton').should('exist');
        cy.get('.submit-btn').should('exist');
    });


    it('should add and remove medical conditions', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Create Patient').click();

        cy.get('.medical-conditions input').type('Diabetes');
        cy.get('#AddButton').click();
        cy.get('.conditions-list li').should('contain', 'Diabetes');

        cy.get('.conditions-list li button.btn-remove').click();
        cy.get('.conditions-list li').should('not.exist');
    });

    it('should successfully submit the form with valid data', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Create Patient').click();

        cy.get('#username').type('testuser');
        cy.get('#firstName').type('John');
        cy.get('#lastName').type('Doe');
        cy.get('#email').type('john.doe@example.com');
        cy.get('#birthday').type('2000-01-01');
        cy.get('#gender').select('M');
        cy.get('#medicalNumber').type('12345');
        cy.get('#phone').type('1234567890');
        cy.get('#emergencyContact').type('0987654321');
        cy.get('.medical-conditions input').type('Asthma');
        cy.get('#AddButton').click();

        cy.get('.submit-btn').click();

        cy.url().should('not.include', '/create-patient'); // Assuming redirection occurs after submission
    });
});
