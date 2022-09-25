import prisma from '../../src/database';
import supertest from 'supertest';
import app from '../../src/app';
import recommendationFactory from '../factories/recommendationFactory';
import generateValidRecommendation from './generateValidRecommendation';

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /recommendations', () => {
  it('Should return status 201 given valid params', async () => {
    const recommendation = recommendationFactory();

    const result = await agent.post('/recommendations').send(recommendation);

    const createdRecommendation = await prisma.recommendation.findUnique({
      where: { name: recommendation.name },
    });

    expect(result.status).toEqual(201);
    expect(createdRecommendation).not.toBeNull();
  });

  it('Should return status 422 given invalid params', async () => {
    const result = await agent.post('/recommendations').send({});

    expect(result.status).toEqual(422);
  });

  it('Should return status 409 given a duplicate recommendation', async () => {
    const recommendation = recommendationFactory();

    await agent.post('/recommendations').send(recommendation);
    const result = await agent.post('/recommendations').send(recommendation);

    expect(result.status).toEqual(409);
  });
});

describe('POST /recommendations/:id/upvote', () => {
  it('Should return status 200 given a recommendation id that exists in the database', async () => {
    const recommendation = await generateValidRecommendation();

    const result = await agent.post(
      `/recommendations/${recommendation.id}/upvote`
    );

    expect(result.status).toEqual(200);
  });

  it('Should return status 404 given a recommendation id that does not exist', async () => {
    const result = await agent.post(`/recommendations/${0}/upvote`);

    expect(result.status).toEqual(404);
  });
});

describe('POST /recommendations/:id/downvote', () => {
  it('Should return status 200 given a recommendation id that exists in the database', async () => {
    const recommendation = await generateValidRecommendation();

    const result = await agent.post(
      `/recommendations/${recommendation.id}/downvote`
    );

    expect(result.status).toEqual(200);
  });

  it('Should return status 404 given a recommendation id that does not exist', async () => {
    const result = await agent.post(`/recommendations/${0}/downvote`);

    expect(result.status).toEqual(404);
  });

  it('Should delete a recommendation that has a score lower than -5', async () => {
    const recommendation = await generateValidRecommendation();

    await prisma.recommendation.update({
      where: { id: recommendation.id },
      data: { score: -5 },
    });

    await agent.post(`/recommendations/${recommendation.id}/downvote`);

    const result = await prisma.recommendation.findUnique({
      where: { id: recommendation.id },
    });

    expect(result).toBeFalsy();
  });
});

describe('GET /recommendations', () => {
  it('Should return status 200 and an array of recommendations', async () => {
    const result = await agent.get('/recommendations');

    expect(result.status).toEqual(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe('GET /recommendations/:id', () => {
  it('Should return status 200 and the recommendation for the provided id', async () => {
    const recommendation = await generateValidRecommendation();

    const result = await agent.get(`/recommendations/${recommendation.id}`);

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(recommendation);
  });

  it('Should return status 404 given an invalid recommendation id', async () => {
    const result = await agent.get(`/recommendations/${0}`);

    expect(result.status).toEqual(404);
  });
});

describe('GET /recommendations/random', () => {
  it('Should return status 404 if the recommendations table is empty', async () => {
    const result = await agent.get('/recommendations/random');

    expect(result.status).toEqual(404);
  });

  it('Should return status 200 and a recommendation if there is at least one in the database', async () => {
    const recommendation = await generateValidRecommendation();

    const result = await agent.get('/recommendations/random');

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(recommendation);
  });
});

describe('GET /recommendations/top/:amount', () => {
  it('Should return status 200 and an array of recommendations', async () => {
    const result = await agent.get(`/recommendations/top/${10}`);

    expect(result.status).toEqual(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});
