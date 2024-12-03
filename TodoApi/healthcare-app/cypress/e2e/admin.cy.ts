

describe('Admin page testing', () => {

    beforeEach(() => {
        cy.visit('/auth')
        cy.intercept('POST', 'http://localhost:5174/api/Patients/authenticate').as('loginRequest'); // Intercept the login request
        cy.get('#login').click();
    });

    // This will test password reset function
    it('admin functions', () => {


        cy.get('#burger', { timeout: 1000000 }).should('be.visible').click();

        cy.contains('.sidebar-menu li', 'Manage Operation Types').click(); // Replace 'Button Text' with the actual button text

        cy.contains('.sidebar-menu li', 'Add New Operation Type');
        cy.contains('.sidebar-menu li', 'Delete Operation Type');
        cy.contains('.sidebar-menu li', 'Search Operation Types').click();

        cy.get('#submit').click();

        cy.contains('.sidebar-menu li', 'Manage Specializations').click();

        cy.get('table.table').should('be.visible');

        // Add a new specialization
        cy.contains('button', 'Add Specialization').click();
        cy.get('.edit-form').should('be.visible');
        cy.get('#specDescription').type('Test Specialization');
        cy.get('#specLongDescription').type('This is a test specialization');
        cy.get('.edit-form button[type="submit"]').click();

        cy.contains('table.table tbody tr', 'Test Specialization')
            .should('contain', 'This is a test specialization');

        cy.contains('table.table tbody tr', 'Test Specialization')
            .within(() => {
                cy.get('.btn-edit').click();
            });

        cy.get('.edit-form').should('be.visible');
        cy.get('#specDescription').clear().type('Updated Specialization');
        cy.get('#specLongDescription').clear().type('Updated test specialization');
        cy.get('.edit-form button[type="submit"]').click();

        cy.contains('table.table tbody tr', 'Updated Specialization')
            .should('contain', 'Updated test specialization');

        cy.contains('table.table tbody tr', 'Updated Specialization')
            .within(() => {
                cy.get('.btn-delete').click();
            });

        cy.on('window:confirm', () => true);

        cy.contains('table.table tbody tr', 'Updated Specialization').should('not.exist');

    });

})
