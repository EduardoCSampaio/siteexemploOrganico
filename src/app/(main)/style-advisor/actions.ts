"use server";

import {
  generateOutfitInspiration,
  GenerateOutfitInspirationInput,
  GenerateOutfitInspirationOutput,
} from '@/ai/flows/generate-outfit-inspiration';
import {
  getPersonalizedStyleRecommendations,
  PersonalizedStyleRecommendationsInput,
  PersonalizedStyleRecommendationsOutput,
} from '@/ai/flows/personalized-style-recommendations';
import { products } from '@/lib/data';

export async function getOutfitAction(
  input: GenerateOutfitInspirationInput
): Promise<{ data: GenerateOutfitInspirationOutput | null, error: string | null }> {
  try {
    const output = await generateOutfitInspiration(input);
    return { data: output, error: null };
  } catch (error) {
    console.error("Error in generateOutfitInspiration flow:", error);
    return { data: null, error: "Failed to generate outfit inspiration. Please try again." };
  }
}

export async function getRecommendationsAction(
  input: Omit<PersonalizedStyleRecommendationsInput, 'currentTrends' | 'itemAvailability'>
): Promise<{ data: PersonalizedStyleRecommendationsOutput | null, error: string | null }> {
  try {
    const fullInput: PersonalizedStyleRecommendationsInput = {
        ...input,
        currentTrends: "Current trends include minimalist designs, sustainable fabrics, and bold, monochromatic color palettes. Oversized silhouettes and vintage-inspired pieces are also popular.",
        itemAvailability: products.map(p => `${p.name} (Category: ${p.category}, Price: $${p.price})`).join(', '),
    }
    const output = await getPersonalizedStyleRecommendations(fullInput);
    return { data: output, error: null };
  } catch (error) {
    console.error("Error in getPersonalizedStyleRecommendations flow:", error);
    return { data: null, error: "Failed to get style recommendations. Please try again." };
  }
}
