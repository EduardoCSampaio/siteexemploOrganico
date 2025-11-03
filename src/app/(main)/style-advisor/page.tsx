import { StyleAdvisorClient } from './client';

export default function StyleAdvisorPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Consultor de Estilo com IA</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Seu assistente de moda pessoal. Obtenha ideias de looks instantâneas e recomendações de estilo sob medida para você.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <StyleAdvisorClient />
      </div>
    </div>
  );
}
