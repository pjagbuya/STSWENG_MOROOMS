describe('Reservation / Manage Room tests', () => {
  const emailValid = 'test@gmail.com';
  const passwordValid = 'testuser';
  const searchTerm = 'Function';
  const searchRoom = 'Function Room A';
  const reservationName = 'This is a test event name';
  const purpose = 'This is a test purpose for which we will be using the room.';
  const count = 6;

  beforeEach(() => {
    //establish a session so you don't need to keep logging in
    cy.session('userSession', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type(emailValid);
      cy.get('input[name="password"]').type(passwordValid);
      cy.wait(1000);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/private');
      cy.get('input[type="file"]').should('have.value', '').and('be.visible');
    });

    cy.visit('/');
    cy.contains('MoRooms').should('be.visible');
  });

  // it('Should display a grid with room cards', () => {
  //   cy.contains('a', 'Reservations / Manage Rooms').click();
  //   cy.contains('Reserve a Room').should('be.visible');
  //   //checks for grid
  //   cy.get('.grid').should('be.visible').and('have.css', 'display', 'grid');

  //   //checks for cards (rooms)
  //   cy.get('.grid div')
  //     .should('have.length.greaterThan', 0)
  //     .and('have.class', 'relative');
  // });

  // it('Can search a room', () => {
  //   cy.contains('a', 'Reservations / Manage Rooms').click();
  //   cy.contains('Reserve a Room').should('be.visible');
  //   cy.get('input').type(searchTerm).should('have.value', searchTerm);
  //   cy.get('button[type="submit"]').click();
  //   cy.wait(1000);

  //   cy.get('.grid > div:visible')
  //     .should('have.length', 1)
  //     .and('have.class', 'relative')
  //     .and('contain.text', searchRoom);
  //   cy.wait(500);
  // });

  it('Can reserve a room', () => {
    cy.contains('a', 'Reservations / Manage Rooms').click();
    cy.contains('Reserve a Room').should('be.visible');

    cy.wait(1000);
    cy.get('a.block').find('article').find('div').contains(searchRoom).click();
    cy.wait(1000);
    cy.get('td').find('button').contains('6').parent('td').click();
    cy.wait(1000);
    cy.get('td').find('button').contains('6').parent('td').click();
    cy.wait(2000);
    cy.get('td').find('button').contains('6').parent('td').click();

    cy.contains('9 AM').siblings('span').click();
    cy.wait(500);
    cy.contains('10 AM').siblings('span').click();

    cy.get('input[name="reservation_name"]').type(reservationName);
    cy.get('textarea[name="purpose"]').type(purpose);
    cy.get('input[name="count"]').type(count);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/rooms');
  });

  // it('The reserved room is visible', () => {
  //   cy.contains('a', 'Home').click();
  //   cy.wait(3000);
  //   cy.contains(searchRoom).should('be.visible');
  // });

  //   it('The reservation can be deleted', () => {
  //     cy.contains('a', 'Manage Reservations').click();
  //     cy.contains(searchRoom).should('be.visible');
  //     cy.contains(searchRoom).should('be.visible');
  //   });
});
