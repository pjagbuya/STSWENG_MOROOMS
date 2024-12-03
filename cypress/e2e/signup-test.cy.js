describe('Signup page tests', () => {
  const emailNew = 'thisismyemail@gmail.com';
  const passwordNew = 'thisismypassword';
  const fnameNew = 'Firstname';
  const lnameNew = 'Lastname';

  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Tests login link', () => {
    cy.contains('Login').click();

    //assert
    cy.url().should('include', '/login');
    cy.contains('Login').should('be.visible');
  });

  it('Registers a new user', () => {
    cy.get('input[name="email"]').type(emailNew);
    cy.get('input[name="password"]').type(passwordNew);
    cy.get('input[name="proof"]').attachFile('testimage.png');
    cy.get('input[name="userFirstname"]').type(fnameNew);
    cy.get('input[name="userLastname"]').type(lnameNew);
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    cy.contains('Application pending').should('be.visible');
  });
});
