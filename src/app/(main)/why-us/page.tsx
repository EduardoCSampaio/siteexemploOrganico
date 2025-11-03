import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Gem, ShieldCheck, Bot } from "lucide-react";

const reasons = [
    {
        icon: Sparkles,
        title: "Curadoria Exclusiva",
        description: "Selecionamos peças únicas que combinam as últimas tendências com qualidade e conforto.",
    },
    {
        icon: Gem,
        title: "Qualidade Premium",
        description: "Comprometemo-nos com materiais de alta qualidade e acabamento impecável.",
    },
    {
        icon: Bot,
        title: "Estilista com IA",
        description: "Receba recomendações personalizadas e crie looks com nossa inteligência artificial.",
    },
    {
        icon: ShieldCheck,
        title: "Compra Segura",
        description: "Oferecemos um ambiente de compra seguro, com um checkout simples e rápido.",
    },
]

export default function WhyUsPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl text-primary">
          Por Que Nos Escolher?
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xs text-muted-foreground">
          Descubra os diferenciais que tornam nossa boutique o seu destino preferido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reasons.map((reason, index) => (
          <Card key={index} className="flex items-start p-4">
            <div className="mr-4 shrink-0">
                <div className="bg-primary/20 text-primary border-2 border-primary/50 rounded-full h-12 w-12 flex items-center justify-center">
                    <reason.icon className="h-6 w-6" />
                </div>
            </div>
            <div className="flex-1">
              <CardTitle className="mb-2 text-sm">{reason.title}</CardTitle>
              <p className="text-muted-foreground text-xs leading-relaxed">{reason.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
