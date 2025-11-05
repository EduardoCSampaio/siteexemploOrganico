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
  itemAvailability: z.string().describe('Uma lista de itens de vestuário disponíveis e seus detalhes.'),
});
export type GenerateOutfitInspirationInput = z.infer<typeof GenerateOutfitInspirationInputSchema>;

const ClothingItemSchema = z.object({
  id: z.string().describe('O ID do item de vestuário da loja.'),
  name: z.string().describe('O nome do item de vestuário.'),
  description: z.string().describe('Uma breve descrição do item.'),
  imageUrl: z.string().describe('URL da imagem do item de vestuário.'),
  price: z.number().describe('O preço do item de vestuário.'),
  availableSizes: z.array(z.string()).describe('Tamanhos disponíveis para o item.'),
  availableColors: z.array(z.string()).describe('Cores disponíveis para o item.'),
});

const GenerateOutfitInspirationOutputSchema = z.object({
  outfitDescription: z.string().describe('Uma descrição do look recomendado.'),
  items: z.array(ClothingItemSchema).describe('Um array de itens de vestuário no look, retirados EXCLUSIVAMENTE da lista de itens disponíveis.'),
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

  Sua tarefa é montar um look completo e estiloso usando APENAS os itens do estoque disponível.

  Estoque Disponível (Use SOMENTE estes itens):
  ---
  {{{itemAvailability}}}
  ---

  Pedido do Usuário:
  Ocasião: {{{occasion}}}
  Preferências do Usuário: {{{userPreferences}}}

  Instruções:
  1. Analise o pedido do usuário e o estoque disponível.
  2. Crie uma descrição geral para o look recomendado que seja apropriada para a ocasião e incorpore as preferências do usuário, se possível.
  3. Selecione de 2 a 4 itens do estoque para compor o look.
  4. Para CADA item selecionado, você DEVE retornar o ID, nome, descrição, preço, tamanhos e cores EXATAMENTE como aparecem na lista de estoque. Não invente informações.
  5. Formate sua resposta como um objeto JSON que esteja em conformidade com o esquema GenerateOutfitInspirationOutputSchema. O campo "items" deve conter um array com os objetos de cada item do look.
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
