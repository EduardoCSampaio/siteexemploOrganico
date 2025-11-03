import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group">
        <CardContent className="p-0">
          <Image
            src={product.image.imageUrl}
            alt={product.name}
            width={600}
            height={900}
            className="w-full object-cover aspect-[2/3] transition-transform group-hover:scale-105"
            data-ai-hint={product.image.imageHint}
          />
        </CardContent>
        <div className="p-4 border-t">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-muted-foreground mt-1">R$ {product.price.toFixed(2).replace('.', ',')}</p>
        </div>
      </Card>
    </Link>
  );
}

export default function ProductsPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Nossa Coleção</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
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
