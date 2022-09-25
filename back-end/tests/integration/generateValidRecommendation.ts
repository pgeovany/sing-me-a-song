import prisma from '../../src/database';
import recommendationFactory from '../factories/recommendationFactory';

async function generateValidRecommendation() {
  const recommendation = recommendationFactory();

  await prisma.recommendation.create({
    data: recommendation,
  });

  return await prisma.recommendation.findUnique({
    where: { name: recommendation.name },
  });
}

export default generateValidRecommendation;
