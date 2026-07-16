// 圣诞老人问题 · 实现

export interface SantaEvent {
  type: 'reindeer-return' | 'elf-problem';
}

export interface SantaStep {
  event: string;
  reindeerBack: number;
  elvesWithProblem: number[];
  santaAction: string;
}

export interface SantaHooks {
  onWakeReindeer?: () => void;
  onDeliver?: () => void;
  onHelpElves?: (elves: number[]) => void;
  onSleep?: () => void;
}

export class SantaClaus {
  public reindeerBack = 0;
  public elvesWithProblem: number[] = [];
  private readonly hooks: SantaHooks;
  constructor(
    public readonly reindeerNeeded = 9,
    public readonly elvesNeeded = 3,
    hooks: SantaHooks = {},
  ) {
    this.hooks = hooks;
  }

  reindeerReturn(): void {
    this.reindeerBack++;
  }

  elfProblem(id: number): void {
    if (!this.elvesWithProblem.includes(id)) this.elvesWithProblem.push(id);
  }

  /** Santa 醒来决定动作：驯鹿优先。 */
  wake(): string {
    if (this.reindeerBack >= this.reindeerNeeded) {
      this.hooks.onWakeReindeer?.();
      this.hooks.onDeliver?.();
      this.reindeerBack = 0;
      return 'deliver-toys';
    }
    if (this.elvesWithProblem.length >= this.elvesNeeded) {
      const elves = this.elvesWithProblem.splice(0, this.elvesNeeded);
      this.hooks.onHelpElves?.(elves);
      return 'help-elves';
    }
    this.hooks.onSleep?.();
    return 'sleep';
  }
}

export function simulateSanta(
  events: SantaEvent[],
  opts: { reindeerNeeded?: number; elvesNeeded?: number } = {},
  hooks: SantaHooks = {},
): SantaStep[] {
  const santa = new SantaClaus(opts.reindeerNeeded ?? 9, opts.elvesNeeded ?? 3, hooks);
  const steps: SantaStep[] = [];
  let elfId = 0;
  for (const ev of events) {
    if (ev.type === 'reindeer-return') {
      santa.reindeerReturn();
      steps.push({
        event: 'reindeer-return',
        reindeerBack: santa.reindeerBack,
        elvesWithProblem: [...santa.elvesWithProblem],
        santaAction: 'pending',
      });
    } else {
      santa.elfProblem(elfId++);
      steps.push({
        event: 'elf-problem',
        reindeerBack: santa.reindeerBack,
        elvesWithProblem: [...santa.elvesWithProblem],
        santaAction: 'pending',
      });
    }
    // 尝试唤醒（满足任一阈值）
    if (
      santa.reindeerBack >= santa.reindeerNeeded ||
      santa.elvesWithProblem.length >= santa.elvesNeeded
    ) {
      const action = santa.wake();
      steps.push({
        event: 'santa-wake',
        reindeerBack: santa.reindeerBack,
        elvesWithProblem: [...santa.elvesWithProblem],
        santaAction: action,
      });
    }
  }
  return steps;
}
