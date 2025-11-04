'use client';

import { doc } from 'firebase/firestore';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDoc, useFirestore } from '@/firebase';
import { Product } from '@/lib/data';
import { useMemoFirebase } from '@/firebase/provider';
import { Skeleton } from '@/components/ui/skeleton';

function ProductDetailsSkeleton() {
  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-black border-2 border-primary/30 p-2">
                <Skeleton className="w-full aspect-[2/3]" />
              </div>
            </div>
            <div className="space-y-6 text-sm">
              <div className="space-y-2">
                <h4 className="text-primary text-xs">DESCRIÇÃO</h4>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <div className="space-y-2">
                <h4 className="text-primary text-xs">CORES</h4>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-primary text-xs">TAMANHOS</h4>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>

              <div className="border-t-2 border-primary/30 pt-6 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-muted-foreground text-xs">PREÇO:</span>
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const firestore = useFirestore();
  const productRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'clothing_items', id) : null),
    [firestore, id]
  );
  const { data: product, isLoading } = useDoc<Product>(productRef);

  // When loading (data is undefined), show the skeleton.
  if (isLoading || product === undefined) {
    return <ProductDetailsSkeleton />;
  }

  // After loading, if the product is null, it was not found.
  if (product === null) {
    notFound();
  }

  // If loading is finished and product exists, render the details.
  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <CardDescription>{product.category}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-black border-2 border-primary/30 p-2">
                <Image
                  src={product.image?.imageUrl ?? 'https://placehold.co/600x900'}
                  alt={product.name}
                  width={600}
                  height={900}
                  className="w-full object-cover aspect-[2/3]"
                  data-ai-hint={product.image?.imageHint ?? 'clothing item'}
                />
              </div>
            </div>
            <div className="space-y-6 text-sm">
              <div className="space-y-2">
                <h4 className="text-primary text-xs">DESCRIÇÃO</h4>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  {product.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-primary text-xs">CORES</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors?.map((color) => (
                    <Badge variant="secondary" key={color} className="text-xs">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-primary text-xs">TAMANHOS</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <Badge variant="secondary" key={size} className="text-xs">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-primary/30 pt-6 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-muted-foreground text-xs">PREÇO:</span>
                  <span className="text-primary font-bold">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <Button className="w-full font-game text-sm">
                  Adicionar ao Carrinho
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
