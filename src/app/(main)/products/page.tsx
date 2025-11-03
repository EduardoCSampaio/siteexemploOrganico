import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/80 group">
        <div className="p-4 border-b-2 border-primary/30">
          <h3 className="font-semibold text-sm text-primary truncate">{product.name}</h3>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="bg-black border-2 border-primary/30 p-2">
            <Image
              src={product.image.imageUrl}
              alt={product.name}
              width={600}
              height={900}
              className="w-full object-cover aspect-[2/3] transition-transform group-hover:scale-105"
              data-ai-hint={product.image.imageHint}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <p className="text-muted-foreground">PREÇO:</p>
            <p className="text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </div>
           <Button asChild className="w-full font-game text-xs" variant="outline">
                <Link href={`/products/${product.id}`}>
                    Ver Item
                </Link>
            </Button>
        </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl text-primary mb-4">
          Inventário
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xs text-muted-foreground">
          Descubra peças atemporais, elegantes e com a sua cara.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
