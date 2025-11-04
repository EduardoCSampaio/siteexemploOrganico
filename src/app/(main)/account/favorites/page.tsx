'use client';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { collection, doc, query, where, documentId } from 'firebase/firestore';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { useMemoFirebase } from '@/firebase/provider';
import { Loader2, HeartCrack } from 'lucide-react';
import { Product } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
    favoriteItemIds?: string[];
}

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
     <Link href={`/products/${product.id}`} className="block">
        <Card className="overflow-hidden transition-all hover:border-primary/80 group flex flex-col h-full">
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
                    <div tabIndex={-1}>Ver Item</div>
                </Button>
                <Button onClick={handleAddToCart} size="icon" variant="outline" className="shrink-0">
                    <ShoppingCart className="h-4 w-4"/>
                </Button>
            </div>
        </CardContent>
        </Card>
    </Link>
  );
}

function FavoritesList() {
    const { user } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
    
    const favoriteIds = userProfile?.favoriteItemIds;

    const favoritesQuery = useMemoFirebase(() => {
        if (!firestore || !favoriteIds || favoriteIds.length === 0) return null;
        const clothingItemsRef = collection(firestore, 'clothing_items');
        return query(clothingItemsRef, where(documentId(), 'in', favoriteIds));
    }, [firestore, favoriteIds]);

    const { data: favoriteProducts, isLoading: areProductsLoading } = useCollection<Product>(favoritesQuery);

    const isLoading = isProfileLoading || areProductsLoading;

    if (isLoading) {
        return (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (!favoriteProducts || favoriteProducts.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed border-primary/30 rounded-lg">
                <HeartCrack className="h-12 w-12 mx-auto text-muted-foreground"/>
                <p className="mt-4 text-sm text-muted-foreground">Sua lista de favoritos está vazia.</p>
                <Button asChild className="mt-6 font-game text-xs">
                    <Link href="/products">Encontrar novos looks</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {favoriteProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}

export default function FavoritesPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login?from=/account/favorites');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex items-center justify-center h-full container py-12">
            <div className="text-center p-8 bg-black/50 border-2 border-primary/30">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Carregando seus favoritos...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="container py-12">
        <div className="text-center mb-12">
            <AnimatedHeader text="Meus Favoritos" />
             <p className="mt-3 max-w-2xl mx-auto text-xs text-muted-foreground">
                Seus itens mais amados, salvos em um só lugar.
            </p>
        </div>
        <FavoritesList />
    </div>
  );
}
