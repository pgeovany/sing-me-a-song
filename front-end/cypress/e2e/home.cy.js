beforeEach(() => {
  cy.resetDatabase();
});

describe('Home screen', () => {
  it('Should load the recommendations', () => {
    cy.seedDatabase();
    cy.visit('http://localhost:3000/');
  });

  it('Should create a recommendation', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy="name"]').type('Bob Dylan - Masters of War');
    cy.get('[data-cy="url"]').type(
      'https://www.youtube.com/watch?v=JEmI_FT4YHU'
    );
    cy.get('[data-cy="submit"]').click();
  });
});
