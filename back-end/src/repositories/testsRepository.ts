import prisma from '../database';

async function reset() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
}

async function updateScore(id: number, value: number) {
  return prisma.recommendation.update({
    where: { id },
    data: {
      score: value,
    },
  });
}

export { reset, updateScore };
