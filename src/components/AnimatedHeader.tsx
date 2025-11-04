'use client';

import { Typewriter } from './Typewriter';

export function AnimatedHeader({ text }: { text: string }) {
  return (
    <h1 className="text-2xl md:text-3xl text-primary mb-4 font-game tracking-wider">
      <Typewriter text={text} />
    </h1>
  );
}
