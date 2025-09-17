import React, { useState, useEffect } from 'react';

const AICompletion = ({ text, speed = 50, onAnimationEnd }: { text: string; speed?: number; onAnimationEnd?: (isEnded: boolean) => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // reset when text changes
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + text[prev.length];
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    if (displayedText === text && onAnimationEnd) {
      onAnimationEnd(true)
    }
  }, [displayedText])

  return <p>{displayedText}</p>;
};

export default AICompletion;
