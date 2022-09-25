import prisma from '../../src/database';
import supertest from 'supertest';
import app from '../../src/app';
import recommendationFactory from '../factories/recommendationFactory';

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
    const recommendation = recommendationFactory();

    await prisma.recommendation.create({
      data: recommendation,
    });

    const createdRecommendation = await prisma.recommendation.findUnique({
      where: { name: recommendation.name },
    });

    const result = await agent.post(
      `/recommendations/${createdRecommendation.id}/upvote`
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
    const recommendation = recommendationFactory();

    await prisma.recommendation.create({
      data: recommendation,
    });

    const createdRecommendation = await prisma.recommendation.findUnique({
      where: { name: recommendation.name },
    });

    const result = await agent.post(
      `/recommendations/${createdRecommendation.id}/downvote`
    );

    expect(result.status).toEqual(200);
  });

  it('Should return status 404 given a recommendation id that does not exist', async () => {
    const result = await agent.post(`/recommendations/${0}/downvote`);

    expect(result.status).toEqual(404);
  });

  it('Should delete a recommendation that has a score lower than -5', async () => {
    const recommendation = recommendationFactory();

    await prisma.recommendation.create({
      data: recommendation,
    });

    const createdRecommendation = await prisma.recommendation.findUnique({
      where: { name: recommendation.name },
    });

    await prisma.recommendation.update({
      where: { id: createdRecommendation.id },
      data: { score: -5 },
    });

    await agent.post(`/recommendations/${createdRecommendation.id}/downvote`);

    const result = await prisma.recommendation.findUnique({
      where: { id: createdRecommendation.id },
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
