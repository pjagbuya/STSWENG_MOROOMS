describe('Profile page tests', () => {
  const emailValid = 'pjagbuya2@gmail.com';
  const passwordValid = 'testuser';
  const fname = 'Test';
  const lname = 'User';

  beforeEach(() => {
    // Test
    //establish a session so you don't need to keep logging in
    cy.session('userSession', () => {
      cy.get('body').then($body => {
        if ($body.find('button:contains("Log Out")').length) {
          cy.contains('button', 'Log Out').click();
        }
      });
      cy.visit('/login');
      cy.document().then(doc => {
        console.log('ON LOGIN: \n\n');
        console.log(doc.documentElement.outerHTML); // dumps HTML into console
      });
      cy.get('input[name="email"]').type(emailValid);
      cy.get('input[name="password"]').type(passwordValid);
      cy.wait(1000);
      cy.get('button[type="submit"]').click();
      cy.wait(2000);
    });

    cy.document().then(doc => {
      console.log('AFTER LOGIN: \n\n');
      console.log(doc.documentElement.outerHTML); // dumps HTML into console
    });
  });
  it('Profile has the correct name', () => {
    cy.document().then(doc => {
      console.log('Before profile Click');
      console.log(doc.documentElement.outerHTML); // dumps HTML into console
    });
    cy.contains('a', 'Profile').click();
    cy.document().then(doc => {
      console.log(doc.documentElement.outerHTML); // dumps HTML into console
    });
    cy.contains(`${fname} ${lname}`)
      .should('be.visible')
      .and('have.class', 'text-3xl')
      .and('have.class', 'font-semibold');
  });

  it('Profile has the correct email', () => {
    cy.contains(`${emailValid}`)
      .should('be.visible')
      .and('have.class', 'text-lg');
  });

  it('Profile has the correct contact email', () => {
    cy.contains(`Email: ${emailValid}`)
      .should('be.visible')
      .and('have.class', 'text-sm');
  });
});
