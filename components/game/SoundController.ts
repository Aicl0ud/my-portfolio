export class SoundController {
  private context: AudioContext | null = null;
  private muted = true;

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  play(type: "step" | "open") {
    if (this.muted || typeof window === "undefined") return;
    this.context ??= new AudioContext();
    const context = this.context;
    void context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = type === "step" ? 120 : 420;
    gain.gain.setValueAtTime(type === "step" ? 0.018 : 0.028, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.07);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.075);
  }

  destroy() {
    void this.context?.close();
    this.context = null;
  }
}
