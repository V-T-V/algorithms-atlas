// =============================================================================
// 俄罗斯套娃信封 · 录制帧序列
// 用 setBars 展示排序后的高度序列（当前 'compare'），用 setAux 展示 tails 表与对应的信封。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { russianDoll, type Envelope, type RussianDollHooks } from './impl.ts';

export const DEFAULT_INPUT: Envelope[] = [
  { w: 5, h: 4 },
  { w: 6, h: 4 },
  { w: 6, h: 7 },
  { w: 2, h: 3 },
];

/** 录制演示帧序列。 */
export function buildTrace(input: Envelope[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const _n = input.length;

  // 复刻 impl 内部的排序（用于展示）
  const sorted = [...input].sort((a, b) => (a.w !== b.w ? a.w - b.w : b.h - a.h));
  const heights = sorted.map((e) => e.h);

  const tails: number[] = [];
  let curI = -1;
  let curPos = -1;

  const auxTails = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const arr: Array<{ label: string; value: string; role?: BarRole }> = [];
    for (let k = 0; k < tails.length; k++) {
      arr.push({
        label: `tails[${k}]`,
        value: String(tails[k]!),
        role: k === curPos ? 'swap' : 'default',
      });
    }
    if (arr.length === 0) arr.push({ label: 'tails', value: '空', role: 'default' });
    return arr;
  };

  const auxEnvs = (): Array<{ label: string; value: string; role?: BarRole }> =>
    sorted.map((e, idx) => ({
      label: `#${idx}`,
      value: `(${e.w},${e.h})`,
      role: idx === curI ? 'compare' : 'default',
    }));

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (curI >= 0) roles[curI] = 'compare';
    rec
      .begin(note)
      .setBars(rec.barsFrom(heights, roles))
      .setAux([...auxTails(), ...auxEnvs()])
      .commit();
  };

  snapshot({
    zh: `按 w 升序、h 降序排序后高度：[${heights.join(', ')}]`,
    en: `Heights after sort (w↑, h↓): [${heights.join(', ')}]`,
  });

  const hooks: RussianDollHooks = {
    onVisit: (i, env, pos) => {
      curI = i;
      curPos = pos;
      snapshot({
        zh: `处理 (${env.w},${env.h})，高度 ${env.h} 定位 pos=${pos}`,
        en: `Process (${env.w},${env.h}), height ${env.h} → pos=${pos}`,
      });
    },
    onPlace: (pos, h) => {
      if (pos === tails.length) tails.push(h);
      else tails[pos] = h;
      curPos = pos;
      snapshot({
        zh: `tails[${pos}] = ${h}`,
        en: `tails[${pos}] = ${h}`,
      });
    },
  };

  const result = russianDoll(input, hooks);

  curI = -1;
  curPos = -1;
  rec
    .begin({ zh: `最大嵌套层数 = ${result}`, en: `Max nesting depth = ${result}` })
    .setBars(rec.barsFrom(heights))
    .setAux([{ label: '嵌套层数 / depth', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
