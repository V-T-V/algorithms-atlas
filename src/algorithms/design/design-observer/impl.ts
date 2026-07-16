// 观察者模式 · 实现
export interface ObserverHooks {
  onAttach?: (observerId: string, count: number) => void;
  onDetach?: (observerId: string, count: number) => void;
  onNotify?: (observerId: string, temperature: number) => void;
  onStateChange?: (temperature: number) => void;
}

export interface Observer {
  id: string;
  update(temperature: number): void;
}

export class WeatherStation {
  private observers: Observer[] = [];
  private temperature = 0;
  private readonly hooks: ObserverHooks;

  constructor(hooks: ObserverHooks = {}) {
    this.hooks = hooks;
  }

  getTemperature(): number {
    return this.temperature;
  }
  getObserverCount(): number {
    return this.observers.length;
  }

  attach(o: Observer): void {
    this.observers.push(o);
    this.hooks.onAttach?.(o.id, this.observers.length);
  }

  detach(o: Observer): void {
    const i = this.observers.indexOf(o);
    if (i >= 0) {
      this.observers.splice(i, 1);
      this.hooks.onDetach?.(o.id, this.observers.length);
    }
  }

  setTemperature(t: number): void {
    this.temperature = t;
    this.hooks.onStateChange?.(t);
    this.notify();
  }

  notify(): void {
    for (const o of this.observers) {
      o.update(this.temperature);
      this.hooks.onNotify?.(o.id, this.temperature);
    }
  }
}

export class DisplayObserver implements Observer {
  public lastReading: number | null = null;
  constructor(public readonly id: string) {}
  update(temperature: number): void {
    this.lastReading = temperature;
  }
}
