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

    console.log(createdRecommendation);

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
