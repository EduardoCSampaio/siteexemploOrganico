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
    name: 'Scarlet Evening Gown',
    description: 'A breathtaking evening gown in our signature deep scarlet. Perfect for making a statement at any formal event.',
    price: 299.99,
    category: 'Dresses',
    image: imageMap['dress-1'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Deep Scarlet', 'Midnight Blue'],
    rating: 4.8,
    reviewCount: 72,
  },
  {
    id: 'prod-2',
    name: 'Beige Silk Blouse',
    description: 'An effortlessly chic blouse made from 100% pure silk. Its soft beige hue makes it a versatile wardrobe staple.',
    price: 149.99,
    category: 'Tops',
    image: imageMap['blouse-1'],
    sizes: ['S', 'M', 'L'],
    colors: ['Soft Beige', 'Ivory White'],
    rating: 4.9,
    reviewCount: 102,
  },
  {
    id: 'prod-3',
    name: 'Classic High-Waisted Trousers',
    description: 'Tailored to perfection, these black high-waisted trousers offer a flattering silhouette for both office and evening wear.',
    price: 189.99,
    category: 'Trousers',
    image: imageMap['trousers-1'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Classic Black', 'Navy'],
    rating: 4.7,
    reviewCount: 98,
  },
  {
    id: 'prod-4',
    name: 'Modern Moto Jacket',
    description: 'Crafted from supple vegan leather, this moto jacket adds an edge to any outfit. A timeless piece with modern details.',
    price: 249.99,
    category: 'Jackets',
    image: imageMap['jacket-1'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Burgundy'],
    rating: 4.8,
    reviewCount: 85,
  },
  {
    id: 'prod-5',
    name: 'Floral Midi Skirt',
    description: 'A light and flowy midi skirt with a delicate floral pattern. Ideal for brunches, garden parties, or a sunny day out.',
    price: 129.99,
    category: 'Skirts',
    image: imageMap['skirt-1'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Multi-color Floral'],
    rating: 4.6,
    reviewCount: 65,
  },
  {
    id: 'prod-6',
    name: 'Gold Statement Necklace',
    description: 'Elevate your look with this stunning gold-plated statement necklace. A true conversation starter.',
    price: 89.99,
    category: 'Accessories',
    image: imageMap['accessory-1'],
    sizes: ['One Size'],
    colors: ['Gold'],
    rating: 4.9,
    reviewCount: 120,
  },
   {
    id: 'prod-7',
    name: 'Linen Summer Dress',
    description: 'Stay cool and stylish in this breathable linen dress. Its relaxed fit is perfect for warm summer days and vacation getaways.',
    price: 159.99,
    category: 'Dresses',
    image: imageMap['dress-2'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Natural Linen', 'White', 'Sky Blue'],
    rating: 4.7,
    reviewCount: 88,
  },
  {
    id: 'prod-8',
    name: 'Slim-Fit Denim Jeans',
    description: 'A perfect pair of jeans that combines comfort and style. The slim-fit cut is flattering for all body types.',
    price: 179.99,
    category: 'Trousers',
    image: imageMap['jeans-1'],
    sizes: ['26', '27', '28', '29', '30', '31', '32'],
    colors: ['Vintage Wash', 'Dark Indigo'],
    rating: 4.8,
    reviewCount: 150,
  },
];

export const styleGuides: StyleGuide[] = [
  {
    id: 'sg-1',
    title: 'The Ultimate Weekend Getaway Wardrobe',
    description: 'Pack smart, look chic. Discover versatile pieces that will take you from city exploring to countryside relaxing in style.',
    image: imageMap['style-guide-1'],
  },
  {
    id: 'sg-2',
    title: 'Power Dressing: Command the Boardroom',
    description: 'Redefine office attire with our collection of powerful silhouettes, elegant fabrics, and modern classics for the professional woman.',
    image: imageMap['style-guide-2'],
  },
  {
    id: 'sg-3',
    title: 'An Evening of Elegance: Special Occasions',
    description: 'Find the perfect ensemble for your next gala, wedding, or formal event. Unforgettable outfits for unforgettable nights.',
    image: imageMap['style-guide-3'],
  },
];
