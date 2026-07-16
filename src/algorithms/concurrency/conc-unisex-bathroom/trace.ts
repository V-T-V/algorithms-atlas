import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateUnisexBathroom, type UbEvent } from './impl.ts';

export function defaultEvents(): UbEvent[] {
  return [
    { person: 1, gender: 'M', action: 'enter' },
    { person: 2, gender: 'M', action: 'enter' },
    { person: 3, gender: 'F', action: 'enter' }, // 等待
    { person: 1, gender: 'M', action: 'leave' },
    { person: 2, gender: 'M', action: 'leave' },
    { person: 3, gender: 'F', action: 'enter' }, // 现在可入
    { person: 3, gender: 'F', action: 'leave' },
  ];
}

export function buildTrace(opts: { events?: UbEvent[]; capacity?: number } = {}): Frame[] {
  const events = opts.events ?? defaultEvents();
  const capacity = opts.capacity ?? 3;
  const rec = new TraceRecorder();
  let currentGender: string | null = null;
  let inside: number[] = [];
  let waiting: Array<{ person: number; gender: string }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        {
          value: inside.length,
          role: (inside.length > 0 ? 'final' : 'default') as BarRole,
          label: `室内:${inside.length}/${capacity}`,
        },
        {
          value: waiting.length,
          role: (waiting.length > 0 ? 'warn' : 'default') as BarRole,
          label: `等待:${waiting.length}`,
        },
      ])
      .setAux([
        {
          label: '当前性别',
          value: currentGender === 'M' ? '男' : currentGender === 'F' ? '女' : '空',
          role: (currentGender ? 'final' : 'default') as BarRole,
        },
        { label: '室内', value: inside.length ? inside.join(',') : '∅', role: 'final' as BarRole },
        {
          label: '等待',
          value: waiting.length ? waiting.map((w) => `#${w.person}(${w.gender})`).join(',') : '∅',
          role: 'warn' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: '初始化洗手间', en: 'Init bathroom' });

  for (const ev of events) {
    const steps = simulateUnisexBathroom([ev], capacity);
    const last = steps[steps.length - 1]!;
    currentGender = last.currentGender;
    inside = [...last.inside];
    waiting = [...last.waiting];
    snap({
      zh: `#${ev.person}(${ev.gender}) ${ev.action === 'enter' ? '进入' : '离开'}`,
      en: `#${ev.person}(${ev.gender}) ${ev.action}`,
    });
  }

  rec
    .begin({ zh: '完成：性别互斥', en: 'Done: gender-exclusive' })
    .setAux([{ label: '结果', value: '单一性别同时', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
