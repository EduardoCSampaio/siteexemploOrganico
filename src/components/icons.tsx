import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative h-14 w-64", className)}
      suppressHydrationWarning={true}
    >
      {/* 
        INSTRUÇÃO: Para usar sua própria logo:
        1. Crie uma pasta chamada 'public' na raiz do seu projeto (no mesmo nível de 'src').
        2. Coloque seu arquivo de logo (ex: logo.png) dentro dessa pasta 'public'.
        3. O código abaixo já está configurado para encontrar a imagem '/logo.png'.
           Se o nome do seu arquivo for diferente, ajuste o 'src' abaixo.
      */}
      <Image
        src="/logo.png"
        alt="Organico Logo"
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  );
}
