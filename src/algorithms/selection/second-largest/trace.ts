// 找第二大元素 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { secondLargest, type SecondLargestHooks, type Tagged } from './impl.ts';

export const DEFAULT_INPUT = [7, 2, 9, 4, 11, 8, 5, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let curField: Tagged[] = a.map((value, i) => ({ value, tag: i }));
  let matchIdx: number[] = [];
  let champLosers: number[] = [];
  let foundSecond = -Infinity;
  let cmp = 0;

  const fieldTags = new Set<number>();
  const snapshot = (
    note: { zh: string; en: string },
    forceRoles?: Record<number, BarRole>,
  ): void => {
    fieldTags.clear();
    for (const t of curField) fieldTags.add(t.tag);
    const roles: BarRole[] = new Array(a.length).fill('default');
    if (forceRoles) {
      for (let i = 0; i < a.length; i++) {
        const r = forceRoles[i];
        if (r) roles[i] = r;
      }
    } else {
      for (let i = 0; i < a.length; i++) {
        if (fieldTags.has(i)) roles[i] = 'frontier';
        if (matchIdx.includes(i)) roles[i] = 'compare';
      }
    }
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '存活者', value: curField.map((t) => t.value).join(','), role: 'pivot' as BarRole },
      { label: '比较次数', value: String(cmp), role: 'compare' as BarRole },
    ];
    if (champLosers.length) {
      aux.push({
        label: '冠军败者名单',
        value: `[${champLosers.join(',')}]`,
        role: 'swap' as BarRole,
      });
    }
    if (foundSecond !== -Infinity) {
      aux.push({ label: '次大', value: String(foundSecond), role: 'final' as BarRole });
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(a, Object.fromEntries(roles.map((r, i) => [i, r]))))
      .setAux(aux)
      .commit();
    matchIdx = [];
  };

  snapshot({ zh: `找第二大，共 ${a.length} 个元素`, en: `Find 2nd largest of ${a.length}` });

  const hooks: SecondLargestHooks = {
    onMatch: (_r, x, y, winner) => {
      cmp++;
      matchIdx = [x.tag, y.tag];
      void winner;
      snapshot({ zh: `${x.value} vs ${y.value}`, en: `${x.value} vs ${y.value}` });
    },
    onChampion: (champ, _c) => {
      curField = [champ];
      snapshot({ zh: `冠军(最大) = ${champ.value}`, en: `Champion (max) = ${champ.value}` });
    },
    onChampionLosers: (losers) => {
      champLosers = [...losers];
      foundSecond = losers.reduce((acc, v) => (v > acc ? v : acc), -Infinity);
      snapshot({
        zh: `败者名单 [${losers.join(',')}]，次大 = ${foundSecond}`,
        en: `Losers [${losers.join(',')}], 2nd = ${foundSecond}`,
      });
    },
  };

  secondLargest(input, hooks);

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(rec.barsFrom(a, {}))
    .setAux([
      { label: '次大', value: String(foundSecond), role: 'final' as BarRole },
      { label: '总比较', value: String(cmp), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
