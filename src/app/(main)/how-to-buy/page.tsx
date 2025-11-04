import { AnimatedHeader } from "@/components/AnimatedHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, CreditCard, Package, Truck } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "1. Navegue e Escolha",
    description: "Explore nossa coleção e adicione seus itens favoritos ao carrinho.",
  },
  {
    icon: CreditCard,
    title: "2. Finalize a Compra",
    description: "Vá para o checkout, preencha seus dados e escolha o pagamento.",
  },
  {
    icon: Package,
    title: "3. Confirmação",
    description: "Após a confirmação, seu pedido será preparado para envio.",
  },
  {
    icon: Truck,
    title: "4. Receba em Casa",
    description: "Enviaremos seu pedido. Agora é só aguardar para arrasar!",
  },
];

export default function HowToBuyPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <AnimatedHeader text="Como Comprar" />
        <p className="mt-3 max-w-2xl mx-auto text-xs text-muted-foreground">
          Seguir estes passos simples tornará sua experiência de compra rápida e fácil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="text-center">
            <CardHeader className="border-b-0">
              <div className="mx-auto bg-primary/20 text-primary border-2 border-primary/50 rounded-full h-16 w-16 flex items-center justify-center">
                <step.icon className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="mb-2 text-sm">{step.title}</CardTitle>
              <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
