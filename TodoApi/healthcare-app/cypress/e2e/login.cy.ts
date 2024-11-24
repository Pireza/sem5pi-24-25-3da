

describe('Login page testing', () => {

  beforeEach(() => {
    cy.visit('/auth')
  });
  it('create account (mocked)', () => {
    // Intercept the registration request and mock a success response
    cy.intercept('POST', 'http://localhost:5174/api/Patients/registerPatientViaAuth0', {
      statusCode: 200,
      body: {},
    }).as('registerPatient');
  
    // Navigate to the create account page
    cy.get('#createAccount').click();
  
    // Fill out the registration form
    cy.get('#username').type('testuser');
    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe');
    cy.get('#email').type('johndoe@example.com');
    cy.get('#birthday').type('1990-01-01');
    cy.get('#gender').select('M');
    cy.get('#medicalNumber').type('123456789');
    cy.get('#phone').type('911456789');
    cy.get('#emergencyContact').type('917654321');
  
    // Add a medical condition
    cy.get('.medical-conditions input[placeholder="Add condition"]').type('Diabetes');
    cy.contains('.medical-conditions button', 'Add').click();
  
    cy.get('#listConditions', { timeout: 10000 }).should('exist'); // Wait for `ul` to render
    cy.get('#listConditions').contains('li', 'Diabetes').should('exist');
  
    // Submit the form
    cy.get('.submit-btn').click();
  
    // Wait for the mocked API request to complete
    cy.wait('@registerPatient');
  
    // Verify success alert
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Patient registered successfully');
    });
  
    // Redirect to the login menu
    cy.url().should('include', '/auth');
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
  cy.get('.sidebar', { timeout: 50000 }).should('exist');

  // Ensure that the navigation bar adjusts for authenticated state
  cy.get('.navbar').should('have.class', 'navbar-wide');

  // Check that the sidebar menu items are rendered
  cy.get('.sidebar-menu li').should('exist').and('have.length.greaterThan', 0);

  // Verify the sidebar header displays the user role
  cy.get('.sidebar-header').should('contain.text', 'Dashboard');

  });
 
})
