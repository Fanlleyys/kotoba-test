import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { GameEngine } from '../core/engine';
import { TargetEntity } from '../core/types';

interface GameCanvasProps {
  onEngineReady: (engine: GameEngine) => void;
  onTargetHit: (target: TargetEntity) => void;
  onWrongTarget: (target: TargetEntity) => void;
}

export const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(({ 
  onEngineReady, onTargetHit, onWrongTarget 
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useImperativeHandle(ref, () => canvasRef.current!);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const engine = new GameEngine(
      canvasRef.current,
      onTargetHit,
      onWrongTarget
    );
    
    engineRef.current = engine;
    onEngineReady(engine);

    const handleResize = () => {
       engine.resize();
    };

    window.addEventListener('resize', handleResize);

    // Mouse/Touch Input
    const handleInput = (e: MouseEvent | TouchEvent) => {
      e.preventDefault(); // Prevent scrolling on touch
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;

      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      engine.handleInput(x, y);
    };

    canvasRef.current.addEventListener('mousedown', handleInput);
    canvasRef.current.addEventListener('touchstart', handleInput);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block touch-none select-none cursor-crosshair"
    />
  );
});