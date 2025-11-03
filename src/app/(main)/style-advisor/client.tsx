"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Wand2, Shirt, Loader2, ServerCrash, Star } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getOutfitAction, getRecommendationsAction } from './actions';
import type { GenerateOutfitInspirationOutput, PersonalizedStyleRecommendationsOutput } from '@/ai/flows/generate-outfit-inspiration';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const recommendationsSchema = z.object({
  userPreferences: z.string().min(10, "Please describe your style in a bit more detail."),
});
type RecommendationsFormValues = z.infer<typeof recommendationsSchema>;

const outfitSchema = z.object({
  occasion: z.string().min(3, "Please specify the occasion."),
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
      toast({ variant: 'destructive', title: 'Error', description: result.error });
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
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        // @ts-ignore TODO: Fix type incompatibility
      setOutfit(result.data);
    }
    setIsLoading(false);
  };

  return (
    <Tabs defaultValue="outfit" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="outfit"><Shirt className="mr-2 h-4 w-4" /> Outfit Generator</TabsTrigger>
        <TabsTrigger value="recommendations"><Wand2 className="mr-2 h-4 w-4" /> Personal Shopper</TabsTrigger>
      </TabsList>

      {/* Outfit Generator */}
      <TabsContent value="outfit">
        <Card>
          <CardHeader>
            <CardTitle>AI Outfit Generator</CardTitle>
            <CardDescription>Tell us the occasion, and we'll create the perfect outfit for you.</CardDescription>
          </CardHeader>
          <Form {...outfitForm}>
            <form onSubmit={outfitForm.handleSubmit(onOutfitSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={outfitForm.control}
                  name="occasion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occasion</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Summer wedding, casual brunch, business meeting" {...field} />
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
                      <FormLabel>Preferences (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., I prefer bright colors, comfortable shoes, and modern styles." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shirt className="mr-2 h-4 w-4" />}
                  Generate Outfit
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        {isLoading && !outfit && (
             <div className="text-center p-8 mt-4 bg-card rounded-lg">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Our AI stylist is crafting your look...</p>
            </div>
        )}
        {outfit && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your AI-Curated Outfit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-lg text-muted-foreground">{outfit.outfitDescription}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outfit.items.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image src={item.imageUrl} alt={item.name} width={400} height={500} className="w-full object-cover" data-ai-hint="clothing item"/>
                    </CardContent>
                    <div className="p-4">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <p className="font-bold text-lg text-primary">${item.price.toFixed(2)}</p>
                        <Button variant="outline" size="sm">View Item</Button>
                      </div>
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
            <CardTitle>AI Personal Shopper</CardTitle>
            <CardDescription>Describe your style, and we'll suggest items you'll love from our collection.</CardDescription>
          </CardHeader>
          <Form {...recommendationsForm}>
            <form onSubmit={recommendationsForm.handleSubmit(onRecommendationsSubmit)}>
              <CardContent>
                <FormField
                  control={recommendationsForm.control}
                  name="userPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Style Profile</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="e.g., I love a minimalist look with neutral colors. I mostly wear comfortable, high-quality basics. My favorite brands are..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Get Recommendations
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
         {isLoading && !recommendations && (
             <div className="text-center p-8 mt-4 bg-card rounded-lg">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Analyzing your style...</p>
            </div>
        )}
        {recommendations && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Based On Your Style...</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {recommendations.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                           <Star className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                           <span className="text-muted-foreground">{rec}</span>
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
