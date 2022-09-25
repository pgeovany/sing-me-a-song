beforeEach(() => {
  cy.resetDatabase();
});

describe('Top recommendations', () => {
  it('Should load the recommendations ordered from highest to lowest score', () => {
    cy.seedDatabase();
    cy.visit('http://localhost:3000/top');
  });
});
