'use server';

/**
 * @fileOverview Gera inspirações de looks com base nas descrições de ocasião fornecidas pelo usuário.
 *
 * - generateOutfitInspiration - Uma função que gera recomendações de looks.
 * - GenerateOutfitInspirationInput - O tipo de entrada para a função generateOutfitInspiration.
 * - GenerateOutfitInspirationOutput - O tipo de retorno para a função generateOutfitInspiration.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutfitInspirationInputSchema = z.object({
  occasion: z.string().describe('A ocasião para a qual um look é necessário.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Preferências opcionais do usuário para o look, como estilos, cores ou marcas preferidas.'),
});
export type GenerateOutfitInspirationInput = z.infer<typeof GenerateOutfitInspirationInputSchema>;

const ClothingItemSchema = z.object({
  name: z.string().describe('O nome do item de vestuário.'),
  description: z.string().describe('Uma breve descrição do item.'),
  imageUrl: z.string().describe('URL da imagem do item de vestuário.'),
  price: z.number().describe('O preço do item de vestuário.'),
  availableSizes: z.array(z.string()).describe('Tamanhos disponíveis para o item.'),
  availableColors: z.array(z.string()).describe('Cores disponíveis para o item.'),
});

const GenerateOutfitInspirationOutputSchema = z.object({
  outfitDescription: z.string().describe('Uma descrição do look recomendado.'),
  items: z.array(ClothingItemSchema).describe('Um array de itens de vestuário no look.'),
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
  prompt: `Você é um estilista pessoal da Organico. Um usuário está procurando um look para uma ocasião específica.

  Ocasião: {{{occasion}}}
  Preferências do Usuário: {{{userPreferences}}}

  Recomende um look que seja apropriado para a ocasião e incorpore as preferências do usuário, se fornecidas. O look deve incluir itens específicos da Organico.
  Descreva o look e liste os itens de vestuário individuais com seus nomes, descrições, URLs de imagem, preços, tamanhos e cores disponíveis.
  Formate sua resposta como um objeto JSON que esteja em conformidade com o esquema para GenerateOutfitInspirationOutputSchema.

  Considere as tendências da moda atuais e o estoque da boutique ao fazer suas recomendações.
  Garanta que as URLs das imagens fornecidas sejam válidas e apontem para imagens reais dos itens de vestuário.
  Exemplo de URL de imagem: https://example.com/images/dress123.jpg
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
