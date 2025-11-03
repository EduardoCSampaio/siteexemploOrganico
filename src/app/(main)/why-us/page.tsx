import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Gem, ShieldCheck, Bot } from "lucide-react";

const reasons = [
    {
        icon: Sparkles,
        title: "Curadoria Exclusiva",
        description: "Selecionamos peças únicas que combinam as últimas tendências com qualidade e conforto, para que você sempre se destaque.",
    },
    {
        icon: Gem,
        title: "Qualidade Premium",
        description: "Comprometemo-nos com materiais de alta qualidade e acabamento impecável em todas as nossas roupas e acessórios.",
    },
    {
        icon: Bot,
        title: "Estilista com IA",
        description: "Receba recomendações de moda personalizadas e crie looks incríveis com a ajuda da nossa tecnologia de inteligência artificial.",
    },
    {
        icon: ShieldCheck,
        title: "Compra Segura e Fácil",
        description: "Oferecemos um ambiente de compra seguro, com um processo de checkout simples e diversas opções de pagamento.",
    },
]

export default function WhyUsPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Por Que Escolher a Organico?
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Descubra os diferenciais que tornam nossa boutique o seu destino de moda preferido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reasons.map((reason, index) => (
          <Card key={index} className="flex items-start p-6">
            <div className="mr-6 shrink-0">
                <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center">
                    <reason.icon className="h-6 w-6" />
                </div>
            </div>
            <div>
              <CardTitle className="mb-2 text-xl font-headline">{reason.title}</CardTitle>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
