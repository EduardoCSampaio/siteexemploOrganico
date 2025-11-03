'use server';

/**
 * @fileOverview Provides personalized style recommendations based on user preferences, current trends, and item availability.
 *
 * - getPersonalizedStyleRecommendations - A function that retrieves personalized style recommendations for a user.
 * - PersonalizedStyleRecommendationsInput - The input type for the getPersonalizedStyleRecommendations function.
 * - PersonalizedStyleRecommendationsOutput - The return type for the getPersonalizedStyleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedStyleRecommendationsInputSchema = z.object({
  userPreferences: z
    .string()
    .describe(
      'A description of the users style preferences, including preferred colors, styles, and brands.'
    ),
  currentTrends: z
    .string()
    .describe('A description of the current fashion trends.'),
  itemAvailability: z
    .string()
    .describe('A list of available clothing items and their details.'),
});
export type PersonalizedStyleRecommendationsInput = z.infer<
  typeof PersonalizedStyleRecommendationsInputSchema
>;

const PersonalizedStyleRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of personalized style recommendations.'),
});
export type PersonalizedStyleRecommendationsOutput = z.infer<
  typeof PersonalizedStyleRecommendationsOutputSchema
>;

export async function getPersonalizedStyleRecommendations(
  input: PersonalizedStyleRecommendationsInput
): Promise<PersonalizedStyleRecommendationsOutput> {
  return personalizedStyleRecommendationsFlow(input);
}

const personalizedStyleRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedStyleRecommendationsPrompt',
  input: {
    schema: PersonalizedStyleRecommendationsInputSchema,
  },
  output: {
    schema: PersonalizedStyleRecommendationsOutputSchema,
  },
  prompt: `You are a personal stylist who provides personalized style recommendations based on user preferences, current trends, and item availability.

  User Preferences: {{{userPreferences}}}
  Current Trends: {{{currentTrends}}}
  Item Availability: {{{itemAvailability}}}

  Based on the above information, provide a list of personalized style recommendations.
  Format your output as a JSON object with a "recommendations" field that contains an array of strings.
  Each string should be a single style recommendation, formatted as a complete sentence.
  The total number of recommendations should be between 3 and 5.
  Do not repeat recommendations.
  Be specific and provide actionable recommendations.
  Include specific clothing items from the available items when possible.
  Use markdown formatting for each recommendation.
  Consider the user's preferences, current trends, and item availability when making recommendations.
  Be creative and provide unique and stylish recommendations.
`,
});

const personalizedStyleRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedStyleRecommendationsFlow',
    inputSchema: PersonalizedStyleRecommendationsInputSchema,
    outputSchema: PersonalizedStyleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedStyleRecommendationsPrompt(input);
    return output!;
  }
);
