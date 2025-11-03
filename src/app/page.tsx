'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons';

const menuOptions = [
  { label: 'Roupas', href: '/products' },
  { label: 'Sobre nós', href: '/about' },
  { label: 'Como comprar', href: '/how-to-buy' },
  { label: 'Por que nos escolher?', href: '/why-us' },
];

export default function GameHomePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedOption(prev => (prev + 1) % menuOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedOption(prev => (prev - 1 + menuOptions.length) % menuOptions.length);
    } else if (e.key === 'Enter') {
      document.getElementById(`menu-option-${selectedOption}`)?.click();
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 font-mono focus:outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      {!gameStarted ? (
        <div className="text-center animate-fade-in">
          <Logo className="text-8xl md:text-9xl text-primary drop-shadow-lg" />
          <p className="mt-4 text-xl text-muted-foreground animate-fade-in animation-delay-300">Aperte play para começar</p>
          <Button
            size="lg"
            className="mt-8 text-2xl px-12 py-8 animate-fade-in-up animation-delay-500"
            onClick={() => setGameStarted(true)}
          >
            <Gamepad2 className="mr-4 h-8 w-8" />
            Play
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md animate-fade-in">
          <div className="border-4 border-primary p-8 rounded-lg bg-card/80 shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-primary mb-8 font-headline">
              Menu Principal
            </h2>
            <ul className="space-y-4">
              {menuOptions.map((option, index) => (
                <li key={option.href}>
                  <Button
                    id={`menu-option-${index}`}
                    asChild
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-xl py-6 transition-all duration-200",
                      selectedOption === index ? 'bg-accent text-accent-foreground' : ''
                    )}
                    onMouseEnter={() => setSelectedOption(index)}
                  >
                    <Link href={option.href} className="flex items-center">
                      <ArrowRight
                        className={cn(
                          'mr-4 h-5 w-5 transition-opacity',
                          selectedOption === index ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
