// =============================================================================
// 高合成数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { highlyCompositeUpTo, type HighlyCompositeHooks } from './impl.ts';

export const DEFAULT_INPUT = 60;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const counts: number[] = new Array<number>(n + 1).fill(0);
  const records: Array<{ value: number; divisors: number }> = [];
  let cur = -1;

  const render = (note: { zh: string; en: string }): void => {
    const values = Array.from({ length: n }, (_, i) => i + 1);
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    const recordSet = new Set(records.map((r) => r.value));
    for (let i = 0; i < n; i++) {
      labels[i] = `${i + 1}\nd=${counts[i + 1]}`;
      if (recordSet.has(i + 1)) roles[i] = 'final';
      else if (i === cur) roles[i] = 'compare';
      else if (counts[i + 1]! > 0) roles[i] = 'frontier';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(values, roles, labels))
      .setAux([
        { label: '高合成数', value: records.map((r) => r.value).join(', ') || '∅', role: 'final' },
        { label: '个数', value: String(records.length), role: 'final' },
      ])
      .commit();
  };

  render({ zh: `枚举 [1, ${n}] 的因子数`, en: `Divisor counts in [1, ${n}]` });

  const hooks: HighlyCompositeHooks = {
    onDivisorCount: (k, cnt) => {
      counts[k] = cnt;
      cur = k - 1;
    },
    onRecord: (k, cnt) => {
      records.push({ value: k, divisors: cnt });
      cur = k - 1;
      render({ zh: `高合成数 ${k}（${cnt} 个因子）`, en: `HCN ${k} (${cnt} divisors)` });
    },
    onResult: () => {
      cur = -1;
    },
  };

  highlyCompositeUpTo(n, hooks);

  // 终态展示所有因子数
  const values = Array.from({ length: n }, (_, i) => i + 1);
  const roles: Record<number, BarRole> = {};
  const labels: Record<number, string> = {};
  const recordSet = new Set(records.map((r) => r.value));
  for (let i = 0; i < n; i++) {
    labels[i] = `${i + 1}\nd=${counts[i + 1]}`;
    if (recordSet.has(i + 1)) roles[i] = 'final';
    else roles[i] = 'default';
  }
  rec
    .begin({
      zh: `共 ${records.length} 个高合成数`,
      en: `${records.length} highly composite numbers`,
    })
    .setBars(rec.barsFrom(values, roles, labels))
    .setAux([{ label: '高合成数', value: records.map((r) => r.value).join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
