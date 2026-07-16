// =============================================================================
// 约瑟夫环 · 录制帧序列
// 用 bars 展示当前存活者（出列者标 warn 后移除），aux 展示出列顺序。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { josephusSequence, type JosephusHooks } from './impl.ts';

export const DEFAULT_INPUT_N = 10;
export const DEFAULT_INPUT_K = 3;

interface BuildTraceInput {
  n?: number;
  k?: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const n = input.n ?? DEFAULT_INPUT_N;
  const k = input.k ?? DEFAULT_INPUT_K;

  const rec = new TraceRecorder();
  const alive: number[] = [];
  for (let i = 0; i < n; i++) alive.push(i);
  const eliminated: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    // bars：存活者每人一根柱（值为原始编号），刚出列者在最后被标记后移除
    const roles: BarRole[] = alive.map(() => 'sorted');
    // 已出列顺序作为 aux
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [];
    aux.push({ label: '总人数 n', value: String(n), role: 'frontier' });
    aux.push({ label: '步长 k', value: String(k), role: 'pivot' });
    aux.push({ label: '剩余', value: String(alive.length), role: 'default' });
    aux.push({
      label: '出列顺序',
      value: eliminated.length ? eliminated.join(' → ') : '—',
      role: 'swap',
    });
    rec
      .begin(note)
      .setBars(alive.map((v, i) => ({ value: v, role: roles[i] ?? 'sorted' })))
      .setAux(aux)
      .commit();
  };

  render({
    zh: `${n} 人围圈，每数到第 ${k} 个出列`,
    en: `${n} people in a circle, every ${k}-th eliminated`,
  });

  const hooks: JosephusHooks = {
    onEliminate: (idx, round) => {
      eliminated.push(idx);
      const pos = alive.indexOf(idx);
      if (pos >= 0) alive.splice(pos, 1);
      render({
        zh: `第 ${round} 轮：编号 ${idx} 出列`,
        en: `Round ${round}: person ${idx} eliminated`,
      });
    },
  };

  josephusSequence(n, k, hooks);

  // 终态：唯一幸存者
  rec
    .begin({
      zh: `幸存者：编号 ${eliminated[eliminated.length - 1]}`,
      en: `Survivor: person ${eliminated[eliminated.length - 1]}`,
    })
    .setBars([{ value: eliminated[eliminated.length - 1]!, role: 'final' }])
    .setAux([
      { label: '幸存者', value: String(eliminated[eliminated.length - 1]), role: 'final' },
      { label: '出列顺序', value: eliminated.join(' → '), role: 'swap' },
      { label: '步长 k', value: String(k), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
