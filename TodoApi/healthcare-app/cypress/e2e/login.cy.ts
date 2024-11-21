

describe('Login page testing', () => {

  beforeEach(() => {
    cy.visit('/auth')
  });

  // This will test password reset function
  it('password reset', () => {


    cy.get('#forgot-password').click();

    // Ensures components are loaded
    cy.get('#reset-container').should('exist');
    cy.get('#email').should('be.empty');
    cy.get('#reset-password-button').should('exist');

    // sends request expecting failure
    cy.get('#email').type('failure');
    cy.get('#reset-password-button').click();
    cy.get('#popup p').invoke('text').then((message) => expect(message).to.equal('Failed to send password reset email'));


    cy.get('.close-btn').click();

    // sends request expecting success
    cy.get('#email').clear().type('success@gmail.com');
    cy.get('#reset-password-button').click();
    cy.get('#popup p').invoke('text').then((message1) => expect(message1).to.equal('Password reset email sent successfully'));

  });
  // This will test password reset function
  it('login', () => {


    cy.get('#login').click();


  // Check if the sidebar is displayed
  cy.get('.sidebar', { timeout: 10000 }).should('exist');

  // Ensure that the navigation bar adjusts for authenticated state
  cy.get('.navbar').should('have.class', 'navbar-wide');

  // Check that the sidebar menu items are rendered
  cy.get('.sidebar-menu li').should('exist').and('have.length.greaterThan', 0);

  // Verify the sidebar header displays the user role
  cy.get('.sidebar-header').should('contain.text', 'Dashboard');

  });

})
