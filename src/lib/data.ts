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
  rating: number;
  reviewCount: number;
}

export interface StyleGuide {
  id: string;
  title: string;
  description: string;
  image: ImagePlaceholder;
}

export const products: Product[] = [
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
  {
    id: 'prod-3',
    name: 'Calça Clássica de Cintura Alta',
    description: 'Feita sob medida para a perfeição, esta calça preta de cintura alta oferece uma silhueta elegante tanto para o escritório quanto para a noite.',
    price: 189.99,
    category: 'Calças',
    image: imageMap['trousers-1'],
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: ['Preto Clássico', 'Azul Marinho'],
    rating: 4.7,
    reviewCount: 98,
  },
  {
    id: 'prod-4',
    name: 'Jaqueta Motoqueira Moderna',
    description: 'Feita de couro vegano macio, esta jaqueta motoqueira adiciona um toque de atitude a qualquer look. Uma peça atemporal com detalhes modernos.',
    price: 249.99,
    category: 'Jaquetas',
    image: imageMap['jacket-1'],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Borgonha'],
    rating: 4.8,
    reviewCount: 85,
  },
  {
    id: 'prod-5',
    name: 'Saia Midi Floral',
    description: 'Uma saia midi leve e fluida com uma delicada estampa floral. Ideal para brunches, festas no jardim ou um dia ensolarado.',
    price: 129.99,
    category: 'Saias',
    image: imageMap['skirt-1'],
    sizes: ['PP', 'P', 'M', 'G'],
    colors: ['Floral Multicolorido'],
    rating: 4.6,
    reviewCount: 65,
  },
  {
    id: 'prod-6',
    name: 'Colar Statement Dourado',
    description: 'Eleve seu look com este deslumbrante colar statement banhado a ouro. Um verdadeiro ponto de conversa.',
    price: 89.99,
    category: 'Acessórios',
    image: imageMap['accessory-1'],
    sizes: ['Tamanho Único'],
    colors: ['Dourado'],
    rating: 4.9,
    reviewCount: 120,
  },
   {
    id: 'prod-7',
    name: 'Vestido de Linho para o Verão',
    description: 'Fique fresca e estilosa com este vestido de linho respirável. Seu caimento relaxado é perfeito para dias quentes de verão e escapadas de férias.',
    price: 159.99,
    category: 'Vestidos',
    image: imageMap['dress-2'],
    sizes: ['PP', 'P', 'M', 'G'],
    colors: ['Linho Natural', 'Branco', 'Azul Céu'],
    rating: 4.7,
    reviewCount: 88,
  },
  {
    id: 'prod-8',
    name: 'Jeans Slim-Fit',
    description: 'Um par de jeans perfeito que combina conforto e estilo. O corte slim-fit valoriza todos os tipos de corpo.',
    price: 179.99,
    category: 'Calças',
    image: imageMap['jeans-1'],
    sizes: ['36', '38', '40', '42', '44', '46'],
    colors: ['Lavagem Vintage', 'Índigo Escuro'],
    rating: 4.8,
    reviewCount: 150,
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
