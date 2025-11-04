"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Wand2, Shirt, Loader2 } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getOutfitAction, getRecommendationsAction } from './actions';
import type { GenerateOutfitInspirationOutput } from '@/ai/flows/generate-outfit-inspiration';
import type { PersonalizedStyleRecommendationsOutput } from '@/ai/flows/personalized-style-recommendations';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const recommendationsSchema = z.object({
  userPreferences: z.string().min(10, "Descreva seu estilo com mais detalhes."),
});
type RecommendationsFormValues = z.infer<typeof recommendationsSchema>;

const outfitSchema = z.object({
  occasion: z.string().min(3, "Especifique a ocasião."),
  userPreferences: z.string().optional(),
});
type OutfitFormValues = z.infer<typeof outfitSchema>;

export function StyleAdvisorClient() {
  const [recommendations, setRecommendations] = useState<PersonalizedStyleRecommendationsOutput | null>(null);
  const [outfit, setOutfit] = useState<GenerateOutfitInspirationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const recommendationsForm = useForm<RecommendationsFormValues>({
    resolver: zodResolver(recommendationsSchema),
  });

  const outfitForm = useForm<OutfitFormValues>({
    resolver: zodResolver(outfitSchema),
  });

  const onRecommendationsSubmit: SubmitHandler<RecommendationsFormValues> = async (data) => {
    setIsLoading(true);
    setRecommendations(null);
    const result = await getRecommendationsAction(data);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Erro', description: result.error });
    } else {
      setRecommendations(result.data);
    }
    setIsLoading(false);
  };

  const onOutfitSubmit: SubmitHandler<OutfitFormValues> = async (data) => {
    setIsLoading(true);
    setOutfit(null);
    const result = await getOutfitAction(data);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Erro', description: result.error });
    } else {
      setOutfit(result.data);
    }
    setIsLoading(false);
  };

  return (
    <Tabs defaultValue="outfit" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="outfit" className="text-xs"><Shirt className="mr-2 h-4 w-4" /> Gerador Look</TabsTrigger>
        <TabsTrigger value="recommendations" className="text-xs"><Wand2 className="mr-2 h-4 w-4" /> Personal Shopper</TabsTrigger>
      </TabsList>

      {/* Gerador de Looks */}
      <TabsContent value="outfit">
        <Card>
          <CardHeader>
            <CardTitle>Gerador de Looks</CardTitle>
            <CardDescription>Diga-nos a ocasião e criaremos o look perfeito.</CardDescription>
          </CardHeader>
          <Form {...outfitForm}>
            <form onSubmit={outfitForm.handleSubmit(onOutfitSubmit)}>
              <CardContent className="space-y-4 pt-4">
                <FormField
                  control={outfitForm.control}
                  name="occasion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Ocasião</FormLabel>
                      <FormControl>
                        <Input className="text-xs" placeholder="Ex: Casamento, brunch, etc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={outfitForm.control}
                  name="userPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Preferências (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea className="text-xs" placeholder="Ex: Cores vibrantes, sapatos confortáveis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full font-game text-xs">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shirt className="mr-2 h-4 w-4" />}
                  Gerar Look
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        {isLoading && !outfit && (
             <div className="text-center p-8 mt-4 bg-black/50 border-2 border-primary/30 rounded-lg">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Criando seu look...</p>
            </div>
        )}
        {outfit && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Look por IA</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-6 text-sm text-muted-foreground leading-relaxed">{outfit.outfitDescription}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outfit.items.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                     <div className="p-2 border-b-2 border-primary/30">
                        <h4 className="font-semibold text-xs text-primary truncate">{item.name}</h4>
                     </div>
                    <CardContent className="p-2">
                       <div className="bg-black border-2 border-primary/30 p-1">
                            <Image src={item.imageUrl} alt={item.name} width={400} height={500} className="w-full object-cover" data-ai-hint="clothing item"/>
                       </div>
                    </CardContent>
                    <div className="p-2 space-y-2">
                      <p className="text-xs text-muted-foreground leading-snug">{item.description}</p>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-muted-foreground">PREÇO:</span>
                         <span className="font-bold text-primary">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                       <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                          <Link href={`/products/${(item as any).id}`}>Ver Item</Link>
                       </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Personal Shopper */}
      <TabsContent value="recommendations">
        <Card>
          <CardHeader>
            <CardTitle>Personal Shopper</CardTitle>
            <CardDescription>Descreva seu estilo e receba sugestões.</CardDescription>
          </CardHeader>
          <Form {...recommendationsForm}>
            <form onSubmit={recommendationsForm.handleSubmit(onRecommendationsSubmit)}>
              <CardContent className="pt-4">
                <FormField
                  control={recommendationsForm.control}
                  name="userPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Seu Estilo</FormLabel>
                      <FormControl>
                        <Textarea className="text-xs" rows={4} placeholder="Ex: Amo look minimalista com cores neutras..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full font-game text-xs">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Obter Recomendações
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
         {isLoading && !recommendations && (
             <div className="text-center p-8 mt-4 bg-black/50 border-2 border-primary/30 rounded-lg">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Analisando seu estilo...</p>
            </div>
        )}
        {recommendations && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <ul className="space-y-4">
                    {recommendations.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start text-xs leading-relaxed text-muted-foreground">
                           <span className="text-primary mr-2">»</span>
                           <span>{rec}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
