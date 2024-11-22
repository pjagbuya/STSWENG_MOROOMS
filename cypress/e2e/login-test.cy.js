describe('Load login page', () => {
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
    cy.get('button[type="submit"]').click();
    //assert
    cy.url().should('include', '/private');
    cy.contains('Hello').should('be.visible');
  });

  it('Is redirected to the error page when using invalid credentials', () => {
    cy.get('input[name="email"]').type(emailValid);
    cy.get('input[name="password"]').type(passwordInvalid);
    cy.get('button[type="submit"]').click();
    //assert
    cy.url().should('include', '/error');
  });
});