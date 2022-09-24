import { CreateRecommendationData } from '../../src/services/recommendationsService';

function recommendationFactory() {
  const recommendations: CreateRecommendationData[] = [
    {
      name: 'Bob Dylan - Tangled up in Blue',
      youtubeLink: 'https://www.youtube.com/watch?v=QKcNyMBw818',
    },
    {
      name: 'Bob Dylan - Simple Twist of Fate',
      youtubeLink: 'https://www.youtube.com/watch?v=sGnhyoP_DSc',
    },
    {
      name: `Bob Dylan - You're A Big Girl Now`,
      youtubeLink: 'https://www.youtube.com/watch?v=7PGfm6KE_pg',
    },
    {
      name: 'Bob Dylan - Idiot Wind',
      youtubeLink: 'https://www.youtube.com/watch?v=Ex05XUddWMk',
    },
    {
      name: `Bob Dylan - You're Gonna Make Me Lonesome When You Go`,
      youtubeLink: 'https://www.youtube.com/watch?v=Claf8E18eLs',
    },
    {
      name: 'Bob Dylan - Meet Me in the Morning',
      youtubeLink: 'https://www.youtube.com/watch?v=VE6-uc1zr3s',
    },
    {
      name: 'Bob Dylan - Lily, Rosemary and the Jack of Hearts',
      youtubeLink: 'https://www.youtube.com/watch?v=agdoeRpTfHg',
    },
    {
      name: 'Bob Dylan - If You See Her, Say Hello',
      youtubeLink: 'https://www.youtube.com/watch?v=BWzMVNy0YwE',
    },
    {
      name: 'Bob Dylan - Shelter from the Storm',
      youtubeLink: 'https://www.youtube.com/watch?v=-gsDBuHwqbM',
    },
    {
      name: 'Bob Dylan - Buckets of Rain',
      youtubeLink: 'https://www.youtube.com/watch?v=jGsOmKZXDvo',
    },
  ];

  const randomIndex = Math.floor(Math.random() * recommendations.length);

  return recommendations[randomIndex];
}

export default recommendationFactory;
