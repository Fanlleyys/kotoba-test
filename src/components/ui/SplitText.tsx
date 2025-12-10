import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  rootMargin?: string;
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  tag?: keyof JSX.IntrinsicElements;
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  rootMargin = '-100px',
  textAlign = 'center',
  tag: Tag = 'p',
  onLetterAnimationComplete
}: SplitTextProps) => {
  
  const words = text.split(' ');
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(() => {
    const el = refs.current.filter(Boolean);
    if (el.length === 0) return;

    gsap.fromTo(el, 
      { opacity: 0, y: 40 },
      {
        opacity: 1, 
        y: 0,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: el[0]?.parentElement,
          start: `top bottom${rootMargin}`,
          toggleActions: 'play none none reverse'
        },
        onComplete: onLetterAnimationComplete
      }
    );
  }, [text, delay, duration, ease, rootMargin]);

  // Reset refs
  refs.current = [];

  const addRef = (el: HTMLSpanElement | null) => {
    if (el) refs.current.push(el);
  };

  return (
    <Tag className={className} style={{ textAlign, display: 'inline-block' }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {word.split('').map((char, j) => (
            <span
              key={`${i}-${j}`}
              ref={addRef}
              style={{ display: 'inline-block', willChange: 'transform, opacity' }}
            >
              {char}
            </span>
          ))}
          {/* Add space after word unless last */}
          {i < words.length - 1 ? <span style={{ display: 'inline-block' }}>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
