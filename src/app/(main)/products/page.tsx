'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore } from '@/firebase';
import { Product } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b-2 border-primary/30">
        <Skeleton className="h-5 w-3/4" />
      </div>
      <CardContent className="p-4 space-y-4">
        <Skeleton className="w-full aspect-[2/3]" />
        <div className="flex justify-between items-center text-xs">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-9" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image?.imageUrl ?? 'https://placehold.co/100x150',
        quantity: 1,
    });
    toast({
        title: "Item adicionado!",
        description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  }

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/80 group flex flex-col">
      <div className="p-4 border-b-2 border-primary/30">
        <h3 className="font-semibold text-sm text-primary truncate">
          {product.name}
        </h3>
      </div>
      <CardContent className="p-4 space-y-4 flex-grow flex flex-col">
        <div className="bg-black border-2 border-primary/30 p-2 flex-grow">
          <Image
            src={product.image?.imageUrl ?? 'https://placehold.co/600x900'}
            alt={product.name}
            width={600}
            height={900}
            className="w-full h-full object-cover aspect-[2/3] transition-transform group-hover:scale-105"
            data-ai-hint={product.image?.imageHint ?? 'clothing item'}
          />
        </div>
        <div className="flex justify-between items-center text-xs">
          <p className="text-muted-foreground">PREÇO:</p>
          <p className="text-primary">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="flex gap-2 mt-auto">
            <Button asChild className="w-full font-game text-xs" variant="outline">
              <Link href={`/products/${product.id}`}>Ver Item</Link>
            </Button>
            <Button onClick={handleAddToCart} size="icon" variant="outline" className="shrink-0">
                <ShoppingCart className="h-4 w-4"/>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clothing_items') : null),
    [firestore]
  );
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <AnimatedHeader text="Inventário" />
        <p className="mt-3 max-w-2xl mx-auto text-xs text-muted-foreground">
          Descubra peças atemporais, elegantes e com a sua cara.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        {!isLoading &&
          products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}
