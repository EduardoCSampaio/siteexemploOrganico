import { StyleAdvisorClient } from './client';

export default function StyleAdvisorPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl text-primary">Consultor IA</h1>
        <p className="mt-3 max-w-2xl mx-auto text-xs text-muted-foreground">
          Seu assistente de moda pessoal. Obtenha ideias de looks e recomendações de estilo.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <StyleAdvisorClient />
      </div>
    </div>
  );
}
