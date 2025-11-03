import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products, styleGuides } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <Image
            src={product.image.imageUrl}
            alt={product.name}
            width={600}
            height={900}
            className="w-full object-cover aspect-[2/3]"
            data-ai-hint={product.image.imageHint}
          />
        </CardContent>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
        </div>
      </Card>
    </Link>
  );
}

function StyleGuideCard({ guide }: { guide: (typeof styleGuides)[0] }) {
  return (
    <Link href="/style-guides">
      <div className="relative overflow-hidden rounded-lg group">
        <Image
          src={guide.image.imageUrl}
          alt={guide.title}
          width={800}
          height={600}
          className="w-full object-cover aspect-video transition-transform group-hover:scale-105"
          data-ai-hint={guide.image.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="font-headline text-2xl text-white font-bold">{guide.title}</h3>
          <p className="text-white/80 mt-2 max-w-sm">{guide.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');
  const ctaImage = PlaceHolderImages.find(img => img.id === 'ai-advisor-cta');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="TrendSight Boutique model"
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl drop-shadow-lg">
            Define Your Style Story
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">
            Discover curated collections and personalized advice to express your unique identity. Your fashion journey begins here.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/products">
              Shop New Arrivals <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="font-headline text-3xl md:text-4xl text-center font-bold mb-10">
            Featured Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Style Advisor CTA */}
      <section className="bg-card">
        <div className="container grid md:grid-cols-2 gap-8 items-center py-16 lg:py-24">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Meet Your Personal AI Stylist
            </h2>
            <p className="text-lg text-muted-foreground">
              Struggling with what to wear? Get instant, personalized style recommendations and outfit ideas tailored just for you.
            </p>
            <Button asChild size="lg">
              <Link href="/style-advisor">
                Try It Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
             {ctaImage && (
                <Image
                    src={ctaImage.imageUrl}
                    alt="AI Style Advisor"
                    fill
                    className="object-cover"
                    data-ai-hint={ctaImage.imageHint}
                />
            )}
          </div>
        </div>
      </section>

      {/* Style Guides */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="font-headline text-3xl md:text-4xl text-center font-bold mb-10">
            Curated Style Guides
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
                {styleGuides.slice(1,3).map((guide) => (
                    <StyleGuideCard key={guide.id} guide={guide} />
                ))}
            </div>
            <div>
                {styleGuides.length > 0 && <StyleGuideCard guide={styleGuides[0]} />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
