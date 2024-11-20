

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
    cy.get('#email').clear().type('successs@gmail.com');
    cy.get('#reset-password-button').click();
    cy.get('#popup p').invoke('text').then((message1) => expect(message1).to.equal('Password reset email sent successfully'));

  });

})
