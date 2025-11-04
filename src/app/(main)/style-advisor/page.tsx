import { AnimatedHeader } from '@/components/AnimatedHeader';
import { StyleAdvisorClient } from './client';

export default function StyleAdvisorPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <AnimatedHeader text="Consultor IA" />
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
