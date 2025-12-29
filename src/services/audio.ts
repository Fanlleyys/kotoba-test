class AudioService {
    private context: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        try {
            // Init on first user interaction usually, but here we prep structure
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.context = new AudioContextClass();
            }
        } catch (e) {
            console.error('Web Audio API not supported');
        }
    }

    private initCheck() {
        if (!this.context) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) this.context = new AudioContextClass();
        }
        if (this.context?.state === 'suspended') {
            this.context.resume();
        }
    }

    play(type: 'correct' | 'wrong' | 'click' | 'levelUp') {
        if (this.isMuted || !this.context) return;
        this.initCheck();

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.context.destination);

        const now = this.context.currentTime;

        switch (type) {
            case 'correct':
                // High pitched "Ding"
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'wrong':
                // Low pitched "Buzz"
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(150, now + 0.2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'click':
                // Short "Tick"
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case 'levelUp':
                // Arpeggio
                const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
                notes.forEach((freq, i) => {
                    const o = this.context!.createOscillator();
                    const g = this.context!.createGain();
                    o.connect(g);
                    g.connect(this.context!.destination);

                    const t = now + (i * 0.1);
                    o.type = 'sine';
                    o.frequency.setValueAtTime(freq, t);
                    g.gain.setValueAtTime(0.2, t);
                    g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

                    o.start(t);
                    o.stop(t + 0.3);
                });
                break;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
    }
}

export const audio = new AudioService();
