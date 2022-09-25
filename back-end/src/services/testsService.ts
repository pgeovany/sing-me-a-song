import * as testsRepository from '../repositories/testsRepository';
import { recommendationRepository } from '../repositories/recommendationRepository';
import { faker } from '@faker-js/faker';

async function reset() {
  await testsRepository.reset();
}

async function seed() {
  for (let i = 1; i <= 10; i++) {
    const recommendation = {
      name: faker.lorem.words(10),
      youtubeLink: 'https://www.youtube.com/watch?v=FY5CAz6S9kE',
    };

    await recommendationRepository.create(recommendation);

    // random number between -5 and 12
    const randomScore = Math.floor(Math.random() * (12 + 5 + 1) - 5);

    await testsRepository.updateScore(i, randomScore);
  }
}

export { reset, seed };
