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
      className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-neutral-100 p-4 font-game focus:outline-none relative overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      <div className="absolute inset-0 scanlines" />
      {!gameStarted ? (
        <div className="text-center animate-fade-in z-10">
          <Logo className="text-6xl md:text-7xl text-primary drop-shadow-lg !font-game" />
          <p className="mt-6 text-lg text-neutral-400 animate-blink">Aperte play para começar</p>
          <Button
            size="lg"
            className="mt-8 text-2xl px-12 py-8 animate-fade-in-up animation-delay-500 bg-primary/80 hover:bg-primary text-primary-foreground font-game tracking-widest"
            onClick={() => setGameStarted(true)}
          >
            <Gamepad2 className="mr-4 h-8 w-8" />
            Play
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md animate-fade-in z-10">
          <div className="border-4 border-primary/50 p-6 sm:p-8 rounded-lg bg-black/50 shadow-2xl shadow-primary/20">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-8 font-game tracking-wider">
              MENU
            </h2>
            <ul className="space-y-3">
              {menuOptions.map((option, index) => (
                <li key={option.href}>
                  <Button
                    id={`menu-option-${index}`}
                    asChild
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-lg sm:text-xl py-4 sm:py-5 transition-all duration-200 hover:bg-primary/20",
                      selectedOption === index ? 'bg-primary/20 text-white' : 'text-neutral-300'
                    )}
                    onMouseEnter={() => setSelectedOption(index)}
                  >
                    <Link href={option.href} className="flex items-center">
                      <ArrowRight
                        className={cn(
                          'mr-4 h-5 w-5 text-primary transition-all duration-300',
                          selectedOption === index ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
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
