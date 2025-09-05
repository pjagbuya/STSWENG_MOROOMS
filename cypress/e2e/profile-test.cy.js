describe('Profile page tests', () => {
  const emailValid = 'pjagbuya2@gmail.com';
  const passwordValid = 'testuser';
  const fname = 'Test';
  const lname = 'User';

  beforeEach(() => {
    //establish a session so you don't need to keep logging in
    cy.session('userSession', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type(emailValid);
      cy.get('input[name="password"]').type(passwordValid);
      cy.wait(1000);
      cy.get('button[type="submit"]').click();
      cy.wait(2000);
      cy.url().should('include', '/');
    });

    cy.visit('/');
  });
  it('Profile has the correct name', () => {
    cy.contains('a', 'Profile').click();
    cy.contains(`${fname} ${lname}`)
      .should('be.visible')
      .and('have.class', 'text-3xl')
      .and('have.class', 'font-semibold');
  });

  it('Profile has the correct email', () => {
    cy.contains('a', 'Profile').click();

    cy.contains(`${emailValid}`)
      .should('be.visible')
      .and('have.class', 'text-lg');
  });

  it('Profile has the correct contact email', () => {
    cy.contains('a', 'Profile').click();

    cy.contains(`Email: ${emailValid}`)
      .should('be.visible')
      .and('have.class', 'text-sm');
  });
});
