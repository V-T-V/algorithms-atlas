// 计数选择 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countingSelect, type CountingSelectHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5], k: 4 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  let counts: number[] = [];
  let scanV = -1;
  let resultVal: number | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const countBars = counts.map((c, v) => ({
      value: c,
      role: (v === scanV ? 'compare' : v === resultVal ? 'final' : 'default') as BarRole,
      label: `${v}: ${c}`,
    }));
    const acc = counts.slice(0, scanV + 1).reduce((s, x) => s + x, 0);
    rec
      .begin(note)
      .setBars(countBars)
      .setAux([
        { label: '原始数组', value: `[${arr.join(', ')}]`, role: 'pivot' as BarRole },
        { label: '目标 k', value: `0-based ${k} → 累计需达 ${k + 1}`, role: 'frontier' as BarRole },
        {
          label: '当前扫描值',
          value: scanV >= 0 ? String(scanV) : '-',
          role: 'compare' as BarRole,
        },
        { label: '累计频数', value: String(acc), role: 'swap' as BarRole },
      ])
      .commit();
  };

  render({
    zh: `数组 [${arr.join(',')}]，找第 ${k + 1} 小`,
    en: `Find rank-${k + 1} in [${arr.join(',')}]`,
  });

  const hooks: CountingSelectHooks = {
    onCounted: (c) => {
      counts = [...c];
      render({
        zh: `频数统计完成，值域 0..${c.length - 1}`,
        en: `Counts ready, range 0..${c.length - 1}`,
      });
    },
    onScan: (v, acc, target) => {
      scanV = v;
      render({
        zh: `值 ${v}：累计频数 = ${acc}（目标 ${target}）`,
        en: `Value ${v}: cumcount = ${acc} (target ${target})`,
      });
    },
    onResult: (v) => {
      resultVal = v;
    },
  };

  countingSelect(arr, k, hooks);

  const countBars = counts.map((c, v) => ({
    value: c,
    role: (v === resultVal ? 'final' : 'default') as BarRole,
    label: `${v}: ${c}`,
  }));
  rec
    .begin({ zh: `第 ${k + 1} 小 = ${resultVal}`, en: `Rank-${k + 1} smallest = ${resultVal}` })
    .setBars(countBars)
    .setAux([{ label: '结果', value: String(resultVal), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
