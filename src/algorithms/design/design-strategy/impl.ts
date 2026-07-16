// 策略模式 · 实现
export interface StrategyHooks {
  onSwap?: (i: number, j: number, arr: number[]) => void;
  onCompare?: (i: number, j: number) => void;
  onStrategyChange?: (name: string) => void;
  onResult?: (sorted: number[], comparisons: number, swaps: number) => void;
}

export interface SortStrategy {
  name: string;
  sort(arr: number[], hooks: StrategyHooks): number[];
}

export class BubbleSort implements SortStrategy {
  name = 'bubble';
  sort(arr: number[], hooks: StrategyHooks = {}): number[] {
    const a = [...arr];
    let comparisons = 0,
      swaps = 0;
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        hooks.onCompare?.(j, j + 1);
        comparisons++;
        if (a[j]! > a[j + 1]!) {
          [a[j], a[j + 1]] = [a[j + 1]!, a[j]!];
          hooks.onSwap?.(j, j + 1, a);
          swaps++;
        }
      }
    }
    hooks.onResult?.(a, comparisons, swaps);
    return a;
  }
}

export class SelectionSort implements SortStrategy {
  name = 'selection';
  sort(arr: number[], hooks: StrategyHooks = {}): number[] {
    const a = [...arr];
    let comparisons = 0,
      swaps = 0;
    for (let i = 0; i < a.length; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) {
        hooks.onCompare?.(min, j);
        comparisons++;
        if (a[j]! < a[min]!) min = j;
      }
      if (min !== i) {
        [a[i], a[min]] = [a[min]!, a[i]!];
        hooks.onSwap?.(i, min, a);
        swaps++;
      }
    }
    hooks.onResult?.(a, comparisons, swaps);
    return a;
  }
}

export class InsertionSort implements SortStrategy {
  name = 'insertion';
  sort(arr: number[], hooks: StrategyHooks = {}): number[] {
    const a = [...arr];
    let comparisons = 0,
      swaps = 0;
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0) {
        hooks.onCompare?.(j - 1, j);
        comparisons++;
        if (a[j - 1]! > a[j]!) {
          [a[j - 1], a[j]] = [a[j]!, a[j - 1]!];
          hooks.onSwap?.(j - 1, j, a);
          swaps++;
          j--;
        } else break;
      }
    }
    hooks.onResult?.(a, comparisons, swaps);
    return a;
  }
}

export class SortContext {
  private strategy: SortStrategy;
  constructor(
    strategy: SortStrategy,
    private readonly hooks: StrategyHooks = {},
  ) {
    this.strategy = strategy;
    hooks.onStrategyChange?.(strategy.name);
  }
  setStrategy(s: SortStrategy): void {
    this.strategy = s;
    this.hooks.onStrategyChange?.(s.name);
  }
  sort(arr: number[]): number[] {
    return this.strategy.sort(arr, this.hooks);
  }
  getStrategyName(): string {
    return this.strategy.name;
  }
}
