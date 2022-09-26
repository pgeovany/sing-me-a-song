beforeEach(() => {
  cy.resetDatabase();
});

describe('Home screen', () => {
  it('Should load the recommendations', () => {
    cy.seedDatabase(15);
    cy.visit('http://localhost:3000/');
  });

  it('Should create a recommendation', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-cy="name"]').type('Bob Dylan - Masters of War');
    cy.get('[data-cy="url"]').type(
      'https://www.youtube.com/watch?v=JEmI_FT4YHU'
    );

    cy.intercept('POST', '/recommendations').as('createRecommendation');

    cy.get('[data-cy="submit"]').click();

    cy.wait('@createRecommendation').should(({ response }) => {
      const { statusCode } = response;

      expect(statusCode).to.eq(201);
    });
  });

  it('Should upvote a recommendation', () => {
    cy.seedDatabase(1);

    cy.intercept('GET', '/recommendations').as('getRecommendations');

    cy.visit('http://localhost:3000/');

    cy.wait('@getRecommendations');

    cy.get('[data-cy="upArrow"]').click();
  });
});
