'use server';

/**
 * @fileOverview Generates outfit inspirations based on user-provided occasion descriptions.
 *
 * - generateOutfitInspiration - A function that generates outfit recommendations.
 * - GenerateOutfitInspirationInput - The input type for the generateOutfitInspiration function.
 * - GenerateOutfitInspirationOutput - The return type for the generateOutfitInspiration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutfitInspirationInputSchema = z.object({
  occasion: z.string().describe('The occasion for which an outfit is needed.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional user preferences for the outfit, such as preferred styles, colors, or brands.'),
});
export type GenerateOutfitInspirationInput = z.infer<typeof GenerateOutfitInspirationInputSchema>;

const ClothingItemSchema = z.object({
  name: z.string().describe('The name of the clothing item.'),
  description: z.string().describe('A brief description of the item.'),
  imageUrl: z.string().describe('URL of the clothing item image.'),
  price: z.number().describe('The price of the clothing item.'),
  availableSizes: z.array(z.string()).describe('Available sizes for the item.'),
  availableColors: z.array(z.string()).describe('Available colors for the item.'),
});

const GenerateOutfitInspirationOutputSchema = z.object({
  outfitDescription: z.string().describe('A description of the recommended outfit.'),
  items: z.array(ClothingItemSchema).describe('An array of clothing items in the outfit.'),
});
export type GenerateOutfitInspirationOutput = z.infer<typeof GenerateOutfitInspirationOutputSchema>;

export async function generateOutfitInspiration(
  input: GenerateOutfitInspirationInput
): Promise<GenerateOutfitInspirationOutput> {
  return generateOutfitInspirationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutfitInspirationPrompt',
  input: {schema: GenerateOutfitInspirationInputSchema},
  output: {schema: GenerateOutfitInspirationOutputSchema},
  prompt: `You are a personal stylist for TrendSight Boutique. A user is looking for an outfit for a specific occasion.

  Occasion: {{{occasion}}}
  User Preferences: {{{userPreferences}}}

  Recommend an outfit that is appropriate for the occasion and incorporates the user's preferences, if provided. The outfit should include specific items from TrendSight Boutique.
  Describe the outfit and list the individual clothing items with their names, descriptions, image URLs, prices, available sizes and colors.
  Format your response as a JSON object that conforms to the schema for GenerateOutfitInspirationOutputSchema.

  Consider current fashion trends and the boutique's inventory when making your recommendations.
  Ensure that the image URLs provided are valid and point to actual images of the clothing items.
  Example image URL: https://example.com/images/dress123.jpg
  `,
});

const generateOutfitInspirationFlow = ai.defineFlow(
  {
    name: 'generateOutfitInspirationFlow',
    inputSchema: GenerateOutfitInspirationInputSchema,
    outputSchema: GenerateOutfitInspirationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
