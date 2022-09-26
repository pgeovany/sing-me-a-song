beforeEach(() => {
  cy.resetDatabase();
});

describe('Random recommendations', () => {
  it('Should load a random recommendation', () => {
    cy.seedDatabase(10);
    cy.visit('http://localhost:3000/random');
  });
});
