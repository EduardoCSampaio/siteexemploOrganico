import { products } from "@/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

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
                  src={product.image.imageUrl}
                  alt={product.name}
                  width={600}
                  height={900}
                  className="w-full object-cover aspect-[2/3]"
                  data-ai-hint={product.image.imageHint}
                />
              </div>
            </div>
            <div className="space-y-6 text-sm">
                <div className="space-y-2">
                    <h4 className="text-primary text-xs">DESCRIÇÃO</h4>
                    <p className="text-muted-foreground leading-relaxed text-xs">{product.description}</p>
                </div>
              
                <div className="space-y-2">
                    <h4 className="text-primary text-xs">CORES</h4>
                    <div className="flex flex-wrap gap-2">
                        {product.colors.map(color => <Badge variant="secondary" key={color} className="text-xs">{color}</Badge>)}
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-primary text-xs">TAMANHOS</h4>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => <Badge variant="secondary" key={size} className="text-xs">{size}</Badge>)}
                    </div>
                </div>

                <div className="border-t-2 border-primary/30 pt-6 space-y-4">
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-muted-foreground text-xs">PREÇO:</span>
                        <span className="text-primary font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <Button className="w-full font-game text-sm">Adicionar ao Carrinho</Button>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
