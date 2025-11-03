import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, CreditCard, Package, Truck } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "1. Navegue e Escolha",
    description: "Explore nossa coleção e adicione seus itens favoritos ao carrinho de compras.",
  },
  {
    icon: CreditCard,
    title: "2. Finalize a Compra",
    description: "Vá para o checkout, preencha seus dados de entrega e escolha a forma de pagamento.",
  },
  {
    icon: Package,
    title: "3. Confirmação do Pedido",
    description: "Após a confirmação do pagamento, seu pedido será preparado para envio com todo o cuidado.",
  },
  {
    icon: Truck,
    title: "4. Receba em Casa",
    description: "Enviaremos seu pedido para o endereço informado. Agora é só aguardar para arrasar com seus novos looks!",
  },
];

export default function HowToBuyPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Como Comprar
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Seguir estes passos simples tornará sua experiência de compra rápida e fácil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                <step.icon className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2 text-xl font-headline">{step.title}</CardTitle>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
