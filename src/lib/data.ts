import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const imageMap = PlaceHolderImages.reduce((acc, img) => {
  acc[img.id] = img;
  return acc;
}, {} as Record<string, ImagePlaceholder>);

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: ImagePlaceholder;
  gallery?: ImagePlaceholder[];
  sizes: string[];
  colors: string[];
  rating?: number;
  reviewCount?: number;
}

export interface StyleGuide {
  id: string;
  title: string;
  description: string;
  image: ImagePlaceholder;
}

export const products: Product[] = [
  // This data is now fetched from Firestore, but we keep it here for reference
  // and potential fallback. The AI-related flows still use this static data.
  {
    id: 'prod-1',
    name: 'Vestido de Noite Escarlate',
    description: 'Um deslumbrante vestido de noite em nosso tom de escarlate. Perfeito para se destacar em qualquer evento formal.',
    price: 299.99,
    category: 'Vestidos',
    image: imageMap['dress-1'],
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: ['Escarlate Intenso', 'Azul Meia-Noite'],
    rating: 4.8,
    reviewCount: 72,
  },
  {
    id: 'prod-2',
    name: 'Blusa de Seda Bege',
    description: 'Uma blusa chique e sem esforço, feita de 100% pura seda. Seu tom suave de bege a torna um item versátil no guarda-roupa.',
    price: 149.99,
    category: 'Blusas',
    image: imageMap['blouse-1'],
    sizes: ['P', 'M', 'G'],
    colors: ['Bege Suave', 'Branco Marfim'],
    rating: 4.9,
    reviewCount: 102,
  },
];

export const styleGuides: StyleGuide[] = [
  {
    id: 'sg-1',
    title: 'O Guarda-Roupa Ideal para uma Escapada de Fim de Semana',
    description: 'Faça as malas com inteligência, pareça chique. Descubra peças versáteis que te levarão da exploração da cidade ao relaxamento no campo com estilo.',
    image: imageMap['style-guide-1'],
  },
  {
    id: 'sg-2',
    title: 'Power Dressing: Domine a Sala de Reuniões',
    description: 'Redefina o traje de escritório com nossa coleção de silhuetas poderosas, tecidos elegantes e clássicos modernos para a mulher profissional.',
    image: imageMap['style-guide-2'],
  },
  {
    id: 'sg-3',
    title: 'Uma Noite de Elegância: Ocasiões Especiais',
    description: 'Encontre o conjunto perfeito para sua próxima gala, casamento ou evento formal. Looks inesquecíveis para noites inesquecíveis.',
    image: imageMap['style-guide-3'],
  },
];
