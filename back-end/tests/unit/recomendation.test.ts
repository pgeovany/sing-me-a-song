import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import recommendationFactory from '../factories/recomendationFactory';

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