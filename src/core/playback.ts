// =============================================================================
// 播放控制器（Playback）
// 消费任意 Frame[]，驱动「渲染回调」逐帧绘制。
//   - play / pause / toggle
//   - stepForward / stepBack（单帧）
//   - seek(index)        跳到任意帧
//   - setSpeed(x)        0.25x ~ 4x，默认 1x
//   - reset              回到第 0 帧
// 提供进度回调，供 UI（进度条/计数）订阅。
// =============================================================================

export type RenderFn = (frameIndex: number, total: number) => void;

export interface PlaybackOptions {
  /** 每帧基础停留毫秒（speed=1 时）。默认 420ms。 */
  baseDelayMs?: number;
}

export class Playback {
  private frames: unknown[] = [];
  private index = 0;
  private playing = false;
  private speed = 1;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private renderFn: RenderFn | null = null;

  private readonly onTick = new Set<(i: number, total: number) => void>();
  private readonly onPlayState = new Set<(playing: boolean) => void>();
  private readonly onSpeed = new Set<(s: number) => void>();
  private baseDelayMs: number;

  constructor(opts: PlaybackOptions = {}) {
    this.baseDelayMs = opts.baseDelayMs ?? 420;
  }

  /** 装载帧序列并回到起点。 */
  load(frames: unknown[]): void {
    this.pause();
    this.frames = frames;
    this.index = 0;
    this.render();
    this.emitTick();
  }

  /** 注入渲染回调（每帧由播放器调用）。 */
  onRender(fn: RenderFn): void {
    this.renderFn = fn;
  }

  // —— 播放控制 ——
  play(): void {
    if (this.frames.length === 0) return;
    if (this.playing) return;
    if (this.index >= this.frames.length - 1) this.index = 0; // 末尾续播从头
    this.playing = true;
    this.emitPlay(true);
    this.tick();
  }

  pause(): void {
    this.playing = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.emitPlay(false);
  }

  toggle(): void {
    if (this.playing) this.pause();
    else this.play();
  }

  reset(): void {
    this.pause();
    this.index = 0;
    this.render();
    this.emitTick();
  }

  stepForward(): void {
    this.pause();
    if (this.index < this.frames.length - 1) {
      this.index++;
      this.render();
      this.emitTick();
    }
  }

  stepBack(): void {
    this.pause();
    if (this.index > 0) {
      this.index--;
      this.render();
      this.emitTick();
    }
  }

  seek(i: number): void {
    this.pause();
    this.index = clamp(i, 0, Math.max(0, this.frames.length - 1));
    this.render();
    this.emitTick();
  }

  setSpeed(s: number): void {
    this.speed = clamp(s, 0.25, 4);
    this.onSpeed.forEach((fn) => fn(this.speed));
    if (this.playing) {
      // 以新速率重新排程下一帧
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.tick();
    }
  }

  // —— 订阅 ——
  onTickEvent(fn: (i: number, total: number) => void): () => void {
    this.onTick.add(fn);
    fn(this.index, this.frames.length);
    return () => this.onTick.delete(fn);
  }
  onPlayStateEvent(fn: (playing: boolean) => void): () => void {
    this.onPlayState.add(fn);
    fn(this.playing);
    return () => this.onPlayState.delete(fn);
  }
  onSpeedEvent(fn: (s: number) => void): () => void {
    this.onSpeed.add(fn);
    fn(this.speed);
    return () => this.onSpeed.delete(fn);
  }

  get currentIndex(): number {
    return this.index;
  }
  get total(): number {
    return this.frames.length;
  }
  get isPlaying(): boolean {
    return this.playing;
  }

  /** 销毁，清理定时器。 */
  dispose(): void {
    this.pause();
    this.renderFn = null;
    this.onTick.clear();
    this.onPlayState.clear();
    this.onSpeed.clear();
  }

  // —— 内部 ——
  private tick(): void {
    if (!this.playing) return;
    const delay = this.baseDelayMs / this.speed;
    this.timer = setTimeout(() => {
      this.timer = null;
      if (!this.playing) return;
      if (this.index < this.frames.length - 1) {
        this.index++;
        this.render();
        this.emitTick();
        this.tick();
      } else {
        this.pause();
      }
    }, delay);
  }

  private render(): void {
    this.renderFn?.(this.index, this.frames.length);
  }

  private emitTick(): void {
    this.onTick.forEach((fn) => fn(this.index, this.frames.length));
  }
  private emitPlay(p: boolean): void {
    this.onPlayState.forEach((fn) => fn(p));
  }
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}
