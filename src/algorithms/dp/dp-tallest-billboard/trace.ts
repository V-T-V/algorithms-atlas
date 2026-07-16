// =============================================================================
// 最高广告牌 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tallestBillboard, type TallestBillboardHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 6];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let dp = new Map<number, number>();
  dp.set(0, 0);
  let ans = 0;

  const snap = (note: { zh: string; en: string }, idx: number): void => {
    const entries = [...dp.entries()].sort((a, b) => a[0] - b[0]);
    const mapEntries = entries.map(([d, t]) => {
      const role: BarRole = d === 0 ? 'final' : 'frontier';
      return { key: `Δ${d}`, value: `taller=${t}`, role };
    });
    const roles = input.map((_, i) => (i === idx ? 'compare' : i < idx ? 'sorted' : 'default'));
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, Object.fromEntries(roles.map((r, i) => [i, r]))))
      .setMap(mapEntries)
      .setAux([
        { label: 'rods 已处理', value: `${idx + 1}/${input.length}`, role: 'pivot' },
        { label: 'dp 大小', value: String(dp.size), role: 'frontier' },
      ])
      .commit();
  };

  snap({ zh: `rods=[${input.join(', ')}]`, en: `rods=[${input.join(', ')}]` }, -1);

  for (let i = 0; i < input.length; i++) {
    const r = input[i]!;
    const next = new Map<number, number>(dp);
    for (const [diff, taller] of dp) {
      const a = next.get(diff + r) ?? -1;
      next.set(diff + r, Math.max(a, taller + r));
      const nd = Math.abs(diff - r);
      const newTaller = Math.max(taller, taller - diff + r);
      const b = next.get(nd) ?? -1;
      next.set(nd, Math.max(b, newTaller));
    }
    dp = next;
    snap({ zh: `处理 rod=${r}：高差映射更新`, en: `Process rod=${r}: diff map updated` }, i);
  }

  const hooks: TallestBillboardHooks = { onResult: (h) => (ans = h) };
  tallestBillboard(input, hooks);

  rec
    .begin({ zh: `最高广告牌 = ${ans}`, en: `Tallest billboard = ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '高度 / height', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
