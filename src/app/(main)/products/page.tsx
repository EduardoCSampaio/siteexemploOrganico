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
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/80 group">
      <div className="p-4 border-b-2 border-primary/30">
        <h3 className="font-semibold text-sm text-primary truncate">
          {product.name}
        </h3>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="bg-black border-2 border-primary/30 p-2">
          <Image
            src={product.image?.imageUrl ?? 'https://placehold.co/600x900'}
            alt={product.name}
            width={600}
            height={900}
            className="w-full object-cover aspect-[2/3] transition-transform group-hover:scale-105"
            data-ai-hint={product.image?.imageHint ?? 'clothing item'}
          />
        </div>
        <div className="flex justify-between items-center text-xs">
          <p className="text-muted-foreground">PREÇO:</p>
          <p className="text-primary">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <Button asChild className="w-full font-game text-xs" variant="outline">
          <Link href={`/products/${product.id}`}>Ver Item</Link>
        </Button>
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
        <h1 className="text-2xl md:text-3xl text-primary mb-4">Inventário</h1>
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
