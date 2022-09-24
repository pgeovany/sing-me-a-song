import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import recommendationFactory from '../factories/recomendationFactory';
import { notFoundError } from '../../src/utils/errorUtils';

describe('Unit tests for recomendations service insert function', () => {
  it('Should create a recomendation', async () => {
    const recomendation = recommendationFactory();

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, 'create')
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(recomendation);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it('Should not create a duplicate recomendation', async () => {
    const recomendation = recommendationFactory();

    jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce({
      id: 1,
      name: '',
      youtubeLink: '',
      score: 0,
    });

    const promise = recommendationService.insert(recomendation);

    expect(promise).rejects.toEqual({
      type: 'conflict',
      message: 'Recommendations names must be unique',
    });
  });
});

describe('Unit tests for recommendation service upvote function', () => {
  it('Should upvote a recommendation', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce({
      id: 1,
      name: '',
      youtubeLink: '',
      score: 0,
    });

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(1);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it('Should not upvote a recommendation that does not exists', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    const promise = recommendationService.upvote(1);

    expect(promise).rejects.toEqual({ type: 'not_found', message: '' });
  });
});

describe('Unit tests for recommendation service downvote function', () => {
  it('Should downvote a recommendation', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce({
      id: 1,
      name: '',
      youtubeLink: '',
      score: 0,
    });

    jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce({
      id: 1,
      name: '',
      youtubeLink: '',
      score: -1,
    });

    jest.spyOn(recommendationRepository, 'remove');

    await recommendationService.downvote(1);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).not.toBeCalled();
  });

  it('Should not downvote a recommendation that does not exists', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    const promise = recommendationService.downvote(1);

    expect(promise).rejects.toEqual({ type: 'not_found', message: '' });
  });

  it('Should delete a recommendation that has a score lower than -5 after being downvoted', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce({
      id: 1,
      name: '',
      youtubeLink: '',
      score: -5,
    });

    jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce({
      id: 1,
      name: '',
      youtubeLink: '',
      score: -6,
    });

    jest
      .spyOn(recommendationRepository, 'remove')
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(1);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe('Unit tests for recommendation service get function', () => {
  it('Should get all recomendations', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {});

    await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
  });
});

describe('Unit tests for recommendation service getTop function', () => {
  it('Should get top recomendations', async () => {
    jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockImplementationOnce((): any => {});

    await recommendationService.getTop(10);

    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });
});

describe('Unit tests for recommendation service getRandom function', () => {
  it('Should get random recomendations', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([
      {
        id: 1,
        name: '',
        youtubeLink: '',
        score: 0,
      },
    ]);

    await recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
  });

  it('Should return not found if no recommendations are found', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);

    const promise = recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
    await expect(promise).rejects.toEqual(notFoundError());
  });

  it('Should return a recommendation with a score greater than 10', async () => {
    jest.spyOn(Math, 'random').mockImplementationOnce((): number => {
      return 0.5;
    });

    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([
      {
        id: 1,
        name: '',
        youtubeLink: '',
        score: 12,
      },
    ]);

    await recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
  });

  it('Should return a recommendation with a score between -5 and 10', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([
      {
        id: 1,
        name: '',
        youtubeLink: '',
        score: 7,
      },
    ]);

    jest.spyOn(Math, 'random').mockImplementationOnce((): number => {
      return 0.8;
    });

    await recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
  });
});
