
import { 
  CannonState, GameConfig, TargetEntity, Projectile, 
  Particle, GameStats, GameState 
} from './types';

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  
  // State
  targets: TargetEntity[] = [];
  projectiles: Projectile[] = [];
  particles: Particle[] = [];
  
  cannon: CannonState = { x: 0, y: 0, angle: -Math.PI / 2, targetAngle: -Math.PI / 2, recoil: 0 };
  
  config: GameConfig = {
    baseTargetSpeed: 1.5,
    maxTargetsPerRound: 5,
    roundDurationMs: 10000,
    projectileSpeed: 15,
    canvasWidth: 800,
    canvasHeight: 600,
    spawnPadding: 50
  };

  // Callbacks
  onTargetHit: (target: TargetEntity) => void;
  onWrongTarget: (target: TargetEntity) => void;

  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor(
    canvas: HTMLCanvasElement, 
    onTargetHit: (t: TargetEntity) => void,
    onWrongTarget: (t: TargetEntity) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onTargetHit = onTargetHit;
    this.onWrongTarget = onWrongTarget;
    
    this.resize();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
      this.config.canvasWidth = this.canvas.width;
      this.config.canvasHeight = this.canvas.height;
      
      // Reset cannon position
      this.cannon.x = this.canvas.width / 2;
      this.cannon.y = this.canvas.height - 40;
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  setTargets(newTargets: TargetEntity[]) {
    this.targets = newTargets;
    this.projectiles = [];
    this.particles = [];
  }

  handleInput(x: number, y: number) {
    // Raycast or simple distance check to see if we clicked a bubble
    // Note: In this arcade style, we auto-aim if the user clicks a target
    
    let clickedTarget: TargetEntity | null = null;

    // Check collision with click
    for (const t of this.targets) {
      if (!t.isAlive) continue;
      const dx = x - t.x;
      const dy = y - t.y;
      if (dx * dx + dy * dy < t.radius * t.radius) {
        clickedTarget = t;
        break;
      }
    }

    if (clickedTarget) {
      this.shootAt(clickedTarget);
    }
  }

  shootAt(target: TargetEntity) {
    // 1. Calculate angle
    const dx = target.x - this.cannon.x;
    const dy = target.y - this.cannon.y;
    this.cannon.targetAngle = Math.atan2(dy, dx);

    // 2. Check logic immediately (arcade style)
    if (target.isCorrect) {
      // Fire projectile
      this.cannon.recoil = 15;
      this.spawnProjectile(this.cannon.targetAngle, true);
      // We trigger the "Hit" callback when projectile actually hits, 
      // OR we can guarantee hit for juiciness. Let's guarantee hit for correct ones.
    } else {
      // Shake the wrong target
      target.state = 'wrong';
      this.onWrongTarget(target);
    }
  }

  spawnProjectile(angle: number, isHoming: boolean) {
    this.projectiles.push({
      id: `p-${Date.now()}`,
      x: this.cannon.x + Math.cos(angle) * 40,
      y: this.cannon.y + Math.sin(angle) * 40,
      vx: Math.cos(angle) * this.config.projectileSpeed,
      vy: Math.sin(angle) * this.config.projectileSpeed,
      radius: 8,
      isActive: true,
      color: '#fff'
    });
  }

  createExplosion(x: number, y: number, color: string) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        id: `pt-${Date.now()}-${i}`,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
  }

  private loop = () => {
    if (!this.isRunning) return;
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000; // Delta time in seconds
    this.lastTime = now;

    this.update(dt);
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    const width = this.config.canvasWidth;
    const height = this.config.canvasHeight;

    // 1. Update Cannon
    // Smooth rotation
    const diff = this.cannon.targetAngle - this.cannon.angle;
    this.cannon.angle += diff * 10 * dt;
    // Recoil recovery
    this.cannon.recoil = Math.max(0, this.cannon.recoil - 30 * dt);

    // 2. Update Targets
    this.targets.forEach(t => {
      if (!t.isAlive) return;
      
      // Pop-in
      if (t.scale < 1) t.scale = Math.min(1, t.scale + 2 * dt);

      // Movement
      t.x += t.vx;
      t.y += t.vy;

      // Bounce walls
      if (t.x < t.radius) { t.x = t.radius; t.vx *= -1; }
      if (t.x > width - t.radius) { t.x = width - t.radius; t.vx *= -1; }
      if (t.y < t.radius) { t.y = t.radius; t.vy *= -1; }
      if (t.y > height - t.radius * 2) { t.y = height - t.radius * 2; t.vy *= -1; }

      // Wrong wiggle
      if (t.state === 'wrong') {
         t.x += Math.sin(performance.now() / 50) * 2;
         // Reset state after a bit? handled by UI mostly
      }
    });

    // 3. Update Projectiles
    this.projectiles.forEach(p => {
      if (!p.isActive) return;
      p.x += p.vx;
      p.y += p.vy;

      // Out of bounds
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        p.isActive = false;
      }

      // Collision
      this.targets.forEach(t => {
        if (!t.isAlive) return;
        // Simple circle collision
        const dx = p.x - t.x;
        const dy = p.y - t.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < t.radius + p.radius) {
          if (t.isCorrect) {
             p.isActive = false;
             t.isAlive = false;
             this.createExplosion(t.x, t.y, '#a855f7'); // Purple explosion
             this.onTargetHit(t);
          } else {
             // Hit wrong target? usually we don't shoot at wrong ones in this auto-aim setup
             // but if we did manual aiming:
             p.isActive = false;
          }
        }
      });
    });

    // 4. Update Particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt * 2; // Fade out
    });
    this.particles = this.particles.filter(p => p.life > 0);
  }

  private draw() {
    const ctx = this.ctx;
    const width = this.config.canvasWidth;
    const height = this.config.canvasHeight;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Projectiles
    this.projectiles.forEach(p => {
      if (!p.isActive) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 2. Draw Targets
    this.targets.forEach(t => {
      if (!t.isAlive) return;
      
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.scale(t.scale, t.scale);
      
      // Bubble Body
      ctx.beginPath();
      ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
      
      if (t.state === 'wrong') {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'; // Red
        ctx.strokeStyle = '#fca5a5';
      } else {
        ctx.fillStyle = 'rgba(124, 58, 237, 0.3)'; // Primary Purple transparent
        ctx.strokeStyle = '#a855f7';
      }
      
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();

      // Highlight shine
      ctx.beginPath();
      ctx.arc(-t.radius * 0.3, -t.radius * 0.3, t.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();

      // Text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px "Noto Sans JP", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.card.word, 0, 0);

      ctx.restore();
    });

    // 3. Draw Particles
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // 4. Draw Cannon
    ctx.save();
    ctx.translate(this.cannon.x, this.cannon.y);
    
    // Base
    ctx.fillStyle = '#4b5563';
    ctx.beginPath();
    ctx.arc(0, 0, 30, Math.PI, 0);
    ctx.fill();

    // Barrel
    ctx.rotate(this.cannon.angle);
    // Apply Recoil
    ctx.translate(-this.cannon.recoil, 0);
    
    ctx.fillStyle = '#a855f7'; // Primary
    ctx.beginPath();
    ctx.roundRect(0, -12, 60, 24, 4);
    ctx.fill();
    
    ctx.restore();
  }
}
