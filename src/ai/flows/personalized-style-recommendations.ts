'use server';

/**
 * @fileOverview Fornece recomendações de estilo personalizadas com base nas preferências do usuário, tendências atuais e disponibilidade de itens.
 *
 * - getPersonalizedStyleRecommendations - Uma função que recupera recomendações de estilo personalizadas para um usuário.
 * - PersonalizedStyleRecommendationsInput - O tipo de entrada para a função getPersonalizedStyleRecommendations.
 * - PersonalizedStyleRecommendationsOutput - O tipo de retorno para a função getPersonalizedStyleRecommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedStyleRecommendationsInputSchema = z.object({
  userPreferences: z
    .string()
    .describe(
      'Uma descrição das preferências de estilo do usuário, incluindo cores, estilos e marcas preferidas.'
    ),
  currentTrends: z
    .string()
    .describe('Uma descrição das tendências da moda atuais.'),
  itemAvailability: z
    .string()
    .describe('Uma lista de itens de vestuário disponíveis e seus detalhes.'),
});
export type PersonalizedStyleRecommendationsInput = z.infer<
  typeof PersonalizedStyleRecommendationsInputSchema
>;

const PersonalizedStyleRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('Uma lista de recomendações de estilo personalizadas.'),
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
  prompt: `Você é um estilista pessoal que fornece recomendações de estilo personalizadas com base nas preferências do usuário, tendências atuais e disponibilidade de itens.

  Preferências do Usuário: {{{userPreferences}}}
  Tendências Atuais: {{{currentTrends}}}
  Disponibilidade de Itens: {{{itemAvailability}}}

  Com base nas informações acima, forneça uma lista de recomendações de estilo personalizadas.
  Formate sua saída como um objeto JSON com um campo "recommendations" que contém um array de strings.
  Cada string deve ser uma única recomendação de estilo, formatada como uma frase completa.
  O número total de recomendações deve ser entre 3 e 5.
  Não repita recomendações.
  Seja específico e forneça recomendações acionáveis.
  Inclua itens de vestuário específicos dos itens disponíveis, quando possível.
  Use a formatação markdown para cada recomendação.
  Considere as preferências do usuário, as tendências atuais e a disponibilidade de itens ao fazer recomendações.
  Seja criativo e forneça recomendações únicas e estilosas.
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
