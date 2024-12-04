describe('Login page tests', () => {
  const emailValid = 'test@gmail.com';
  const passwordValid = 'testuser';
  const passwordInvalid = 'thispasswordiswrong';

  beforeEach(() => {
    cy.visit('/login');
  });

  it('Visits the landing page', () => {
    cy.contains('Login').should('be.visible');
  });

  it('Logs in successfully with valid credentials', () => {
    cy.get('input[name="email"]').type(emailValid);
    cy.get('input[name="password"]').type(passwordValid);
    cy.wait(1000);
    cy.get('button[type="submit"]').click();
    cy.wait(4000);

    //assert
    cy.url().should('include', '/');
    cy.contains('MoRooms').should('be.visible');
  });

  it('Is redirected to the error page when using invalid credentials', () => {
    cy.get('input[name="email"]').type(emailValid);
    cy.get('input[name="password"]').type(passwordInvalid);
    cy.get('button[type="submit"]').click();

    //asserts
    cy.url().should('include', '/error');
  });
});
