import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSavages } from './impl.ts';

export const DEFAULT_N = 3;
export const DEFAULT_CAPACITY = 2;
export const DEFAULT_EAT = 5;

export function buildTrace(
  opts: { nSavages?: number; capacity?: number; eatTimes?: number } = {},
): Frame[] {
  const nSavages = opts.nSavages ?? DEFAULT_N;
  const capacity = opts.capacity ?? DEFAULT_CAPACITY;
  const eatTimes = opts.eatTimes ?? DEFAULT_EAT;
  const rec = new TraceRecorder();
  let servings = capacity;
  let cookBusy = false;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        {
          value: servings,
          role: (servings > 0 ? 'final' : 'warn') as BarRole,
          label: `锅:${servings}/${capacity}`,
        },
        {
          value: cookBusy ? 2 : 1,
          role: (cookBusy ? 'swap' : 'default') as BarRole,
          label: cookBusy ? '厨师忙' : '厨师闲',
        },
      ])
      .setAux([
        {
          label: '剩余份数',
          value: `${servings}/${capacity}`,
          role: (servings > 0 ? 'final' : 'warn') as BarRole,
        },
        {
          label: '厨师状态',
          value: cookBusy ? '烹饪中' : '空闲',
          role: (cookBusy ? 'swap' : 'default') as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: '初始化：锅已满', en: 'Init: pot full' });

  const steps = simulateSavages(nSavages, capacity, eatTimes);
  for (const s of steps) {
    servings = s.servings;
    cookBusy = s.cookBusy;
    if (s.event === 'eat')
      snap({
        zh: `野蛮人 ${s.savage} 取食（剩 ${s.servings}）`,
        en: `Savage ${s.savage} eats (${s.servings} left)`,
      });
    else if (s.event === 'wake-cook') snap({ zh: '锅空，唤醒厨师', en: 'Pot empty, wake cook' });
    else if (s.event === 'refill')
      snap({ zh: `厨师填满（${s.servings}）`, en: `Cook refills (${s.servings})` });
  }

  rec
    .begin({
      zh: `完成：共进餐 ${steps[steps.length - 1]!.totalEaten} 次`,
      en: `Done: ${steps[steps.length - 1]!.totalEaten} servings eaten`,
    })
    .setAux([
      {
        label: '结果',
        value: `补充 ${steps[steps.length - 1]!.refills} 次`,
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
