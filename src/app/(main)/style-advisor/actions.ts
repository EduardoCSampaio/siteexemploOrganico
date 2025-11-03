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
    return { data: null, error: "Falha ao gerar inspiração de look. Por favor, tente novamente." };
  }
}

export async function getRecommendationsAction(
  input: Omit<PersonalizedStyleRecommendationsInput, 'currentTrends' | 'itemAvailability'>
): Promise<{ data: PersonalizedStyleRecommendationsOutput | null, error: string | null }> {
  try {
    const fullInput: PersonalizedStyleRecommendationsInput = {
        ...input,
        currentTrends: "As tendências atuais incluem designs minimalistas, tecidos sustentáveis e paletas de cores ousadas e monocromáticas. Silhuetas oversized e peças de inspiração vintage também são populares.",
        itemAvailability: products.map(p => `${p.name} (Categoria: ${p.category}, Preço: R$${p.price})`).join(', '),
    }
    const output = await getPersonalizedStyleRecommendations(fullInput);
    return { data: output, error: null };
  } catch (error) {
    console.error("Error in getPersonalizedStyleRecommendations flow:", error);
    return { data: null, error: "Falha ao obter recomendações de estilo. Por favor, tente novamente." };
  }
}
