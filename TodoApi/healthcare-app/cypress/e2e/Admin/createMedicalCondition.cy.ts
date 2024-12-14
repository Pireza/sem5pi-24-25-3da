describe('Create Patient Page Tests', () => {
    beforeEach(() => {
        cy.visit('/auth');
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept login request
        cy.get('#login').click();
    });

    it('should display the form elements correctly', () => {
        cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Add Medical Condition').click();

        // Ensure the Create Medical Condition page is loaded
        cy.contains('h2', 'Create Medical Condition').should('be.visible');
        cy.get('form').should('exist');

        // Check if all form fields are visible
        cy.get('input#code').should('be.visible');
        cy.get('input#codeSystem').should('be.visible');
        cy.get('input#designation').should('be.visible');
        cy.get('textarea#description').should('be.visible');
        cy.get('input#symptoms').should('be.visible');
        cy.get('button.add-symptom-btn').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('should allow adding and removing symptoms', () => {
        cy.get('#burger').should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Add Medical Condition').click();
    
        // Add a symptom
        cy.get('input#symptoms').type('Fever');
        cy.get('button.add-symptom-btn').click();
        cy.get('.symptoms-list li').should('contain', 'Fever');
    
        // Add another symptom
        cy.get('input#symptoms').type('Cough');
        cy.get('button.add-symptom-btn').click();
        cy.get('.symptoms-list li').should('contain', 'Cough');
    
        // Remove a symptom
        cy.get('.symptoms-list li')
            .filter(':contains("Fever")') // Filtra o item que contém 'Fever'
            .first()                     // Garante que apenas o primeiro elemento será selecionado
            .find('button.remove-symptom-btn')
            .click();
    
        cy.get('.symptoms-list li').should('not.contain', 'Fever');
    });
    

    it('should successfully create a new medical condition', () => {
        cy.get('#burger').should('be.visible').click();
        cy.contains('.sidebar-menu li', 'Manage Patients').click();
        cy.contains('.sidebar-menu li', 'Add Medical Condition').click();

        // Fill out the form
        cy.get('input#code').type('MC001');
        cy.get('input#codeSystem').type('ICD-10');
        cy.get('input#designation').type('Pneumonia');
        cy.get('textarea#description').type('A lung infection causing inflammation.');
        cy.get('input#symptoms').type('Shortness of breath');
        cy.get('button.add-symptom-btn').click();

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Verify success alert
        cy.on('window:alert', (str) => {
            expect(str).to.equal('There was an error while trying to add the medical condition! The code of that condition may already have been added.');
        });
    });
});
