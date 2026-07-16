import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSanta, type SantaEvent } from './impl.ts';

export function defaultEvents(): SantaEvent[] {
  const evs: SantaEvent[] = [];
  // 3 只精灵
  evs.push({ type: 'elf-problem' }, { type: 'elf-problem' }, { type: 'elf-problem' });
  return evs;
}

export function buildTrace(
  opts: { events?: SantaEvent[]; reindeerNeeded?: number; elvesNeeded?: number } = {},
): Frame[] {
  const events = opts.events ?? defaultEvents();
  const reindeerNeeded = opts.reindeerNeeded ?? 9;
  const elvesNeeded = opts.elvesNeeded ?? 3;
  const rec = new TraceRecorder();
  let reindeerBack = 0;
  let elvesCount = 0;
  let santaAction = 'sleep';

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        {
          value: reindeerBack,
          role: (reindeerBack >= reindeerNeeded ? 'final' : 'compare') as BarRole,
          label: `驯鹿:${reindeerBack}/${reindeerNeeded}`,
        },
        {
          value: elvesCount,
          role: (elvesCount >= elvesNeeded ? 'final' : 'compare') as BarRole,
          label: `精灵:${elvesCount}/${elvesNeeded}`,
        },
      ])
      .setAux([
        { label: '驯鹿', value: `${reindeerBack}/${reindeerNeeded}`, role: 'compare' as BarRole },
        { label: '精灵', value: `${elvesCount}/${elvesNeeded}`, role: 'compare' as BarRole },
        {
          label: 'Santa',
          value: santaAction,
          role: (santaAction !== 'pending' && santaAction !== 'sleep'
            ? 'final'
            : 'default') as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: 'Santa 睡觉中', en: 'Santa sleeping' });

  const steps = simulateSanta(events, { reindeerNeeded, elvesNeeded });
  for (const s of steps) {
    reindeerBack = s.reindeerBack;
    elvesCount = s.elvesWithProblem.length;
    santaAction = s.santaAction;
    const noteText =
      s.event === 'reindeer-return'
        ? '驯鹿归来'
        : s.event === 'elf-problem'
          ? '精灵求助'
          : `Santa: ${s.santaAction}`;
    snap({ zh: noteText, en: noteText });
  }

  rec
    .begin({ zh: `完成：Santa 最终 ${santaAction}`, en: `Done: Santa ${santaAction}` })
    .setAux([{ label: '结果', value: santaAction, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
