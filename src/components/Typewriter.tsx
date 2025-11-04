'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Typewriter({
  text,
  speed = 100,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(speed);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let ticker: NodeJS.Timeout;

    const handleTyping = () => {
      setDisplayedText(text.substring(0, displayedText.length + 1));
      setTypingSpeed(speed);
    };

    if (displayedText === text) {
      // Finished typing, just show cursor
      setShowCursor(true);
    } else {
      ticker = setTimeout(handleTyping, typingSpeed);
    }

    return () => clearTimeout(ticker);
  }, [displayedText, text, speed, typingSpeed]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
  }, [text]);

  return (
    <span className={cn('relative', className)}>
      {displayedText}
      <span
        className={cn(
          'text-primary transition-opacity duration-300',
          showCursor ? 'animate-blink-cursor' : 'opacity-0'
        )}
      >
        _
      </span>
    </span>
  );
}
