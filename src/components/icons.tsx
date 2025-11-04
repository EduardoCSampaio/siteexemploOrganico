import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative h-10 w-32", className)}
      suppressHydrationWarning={true}
    >
      {/* 
        TODO: Substitua o 'src' abaixo pelo link da sua imagem de logo.
        Recomenda-se usar uma imagem com fundo transparente (PNG).
        Ajuste 'width' e 'height' se necessário.
      */}
      <Image
        src="https://placehold.co/128x40/000000/FFFFFF/png?text=Organico."
        alt="Organico Logo"
        fill
        className="object-contain"
        unoptimized // Use esta propriedade se a sua logo for um SVG ou se você estiver usando um serviço que já otimiza a imagem.
      />
    </div>
  );
}