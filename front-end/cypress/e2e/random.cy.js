beforeEach(() => {
  cy.resetDatabase();
});

describe('Random recommendations', () => {
  it('Should load a random recommendations', () => {
    cy.seedDatabase();
    cy.visit('http://localhost:3000/random');
  });
});
