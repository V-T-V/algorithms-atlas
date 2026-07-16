// 野蛮人就餐 · 实现

export interface SavageStep {
  event: string;
  servings: number;
  savage: number;
  cookBusy: boolean;
  totalEaten: number;
  refills: number;
}

export interface SavageHooks {
  onEat?: (savage: number) => void;
  onWakeCook?: () => void;
  onRefill?: () => void;
}

export function simulateSavages(
  nSavages: number,
  capacity: number,
  eatTimes: number,
  hooks: SavageHooks = {},
): SavageStep[] {
  let servings = capacity;
  let totalEaten = 0;
  let refills = 0;
  let cookBusy = false;
  const steps: SavageStep[] = [];
  const eaten = new Array(nSavages).fill(0);

  steps.push({ event: 'init', servings, savage: -1, cookBusy, totalEaten, refills });

  while (totalEaten < eatTimes) {
    for (let s = 0; s < nSavages && totalEaten < eatTimes; s++) {
      if (servings === 0) {
        // 唤醒厨师
        cookBusy = true;
        hooks.onWakeCook?.();
        steps.push({ event: 'wake-cook', servings, savage: s, cookBusy, totalEaten, refills });
        // 厨师填满
        servings = capacity;
        refills++;
        cookBusy = false;
        hooks.onRefill?.();
        steps.push({ event: 'refill', servings, savage: s, cookBusy, totalEaten, refills });
      }
      servings--;
      totalEaten++;
      eaten[s]!++;
      hooks.onEat?.(s);
      steps.push({ event: 'eat', servings, savage: s, cookBusy, totalEaten, refills });
    }
  }
  return steps;
}
