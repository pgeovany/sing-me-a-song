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
