import { AnimatedHeader } from "@/components/AnimatedHeader";

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedHeader text="Sobre Nós" />
        <div className="mt-8 space-y-6 text-xs leading-relaxed text-neutral-300 text-justify p-4 border-2 border-primary/30 bg-black/50">
          <p>
            Bem-vindo à Organico, onde a moda encontra a sustentabilidade. Nascemos da paixão por estilo e da crença de que é possível se vestir bem e cuidar do planeta.
          </p>
          <p>
            Nossa missão é oferecer uma curadoria de peças feitas com materiais orgânicos e processos que respeitam o meio ambiente. Cada item em nossa coleção é escolhido a dedo, pensando em qualidade, conforto, durabilidade e, claro, muito estilo.
          </p>
          <p>
            Acreditamos em um consumo mais consciente e transparente. Por isso, trabalhamos com parceiros que compartilham dos nossos valores e buscamos sempre inovar em nossas práticas.
          </p>
          <p>
            Junte-se a nós nesta jornada por uma moda mais verde e descubra a beleza de se vestir com propósito.
          </p>
        </div>
      </div>
    </div>
  );
}
