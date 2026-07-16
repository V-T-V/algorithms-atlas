// =============================================================================
// 多项式滚动哈希 · 录制帧序列
// 用 setArray 高亮固定宽度窗口逐位滚动；setAux 显示窗口哈希演化。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rollingWindows, DEFAULT_BASE, DEFAULT_PRIME, type PolyHashHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; window: number } = {
  text: 'abcabcabc',
  window: 3,
};

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; window: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, window: w } = input;
  const values = Array.from(text).map((c) => c.charCodeAt(0));
  const n = values.length;

  rec
    .begin({
      zh: `文本 "${text}"（${n} 字符），窗口宽 ${w}。基 base=${DEFAULT_BASE}，素数 P=${DEFAULT_PRIME}`,
      en: `Text "${text}" (${n} chars), window width ${w}. base=${DEFAULT_BASE}, prime P=${DEFAULT_PRIME}`,
    })
    .setArray(
      values,
      values.map(() => 'default' as BarRole),
      [],
    )
    .setAux([
      { label: '基 base', value: String(DEFAULT_BASE), role: 'compare' as BarRole },
      { label: '素数 P', value: String(DEFAULT_PRIME), role: 'frontier' as BarRole },
      { label: '窗口宽 w', value: String(w), role: 'pivot' as BarRole },
    ])
    .commit();

  const render = (
    note: { zh: string; en: string },
    start: number,
    hash: number,
    seen: Map<number, number>,
  ): void => {
    const r: BarRole[] = values.map((_, j) => {
      if (j >= start && j < start + w) {
        const dup = seen.get(hash) !== undefined && seen.get(hash) !== start;
        return dup ? 'warn' : 'frontier';
      }
      return 'default';
    });
    rec
      .begin(note)
      .setArray(values, r, [
        { index: start, label: 'L' },
        { index: start + w - 1, label: 'R' },
      ])
      .setAux([
        { label: '窗口哈希', value: String(hash), role: 'pivot' as BarRole },
        { label: '窗口起始', value: String(start), role: 'frontier' as BarRole },
        {
          label: '窗口内容',
          value: text.slice(start, start + w),
          role: 'compare' as BarRole,
        },
        {
          label: '重复?',
          value: seen.has(hash) ? '是（哈希重复）' : '否',
          role: (seen.has(hash) ? 'warn' : 'final') as BarRole,
        },
      ])
      .commit();
  };

  let firstHash = 0;
  const seen = new Map<number, number>();
  const hooks: PolyHashHooks = {
    onInit: (_p, _pw) => {
      // 首窗口在 results 里；这里仅打点
    },
    onRoll: (i, _oldH, _newH) => {
      void i;
    },
  };

  const hashes = rollingWindows(text, w, DEFAULT_BASE, DEFAULT_PRIME, hooks);
  firstHash = hashes[0]!;

  // 渲染首窗口
  seen.set(firstHash, 0);
  render(
    {
      zh: `首窗口 [0, ${w}) = "${text.slice(0, w)}"，哈希 = ${firstHash}`,
      en: `First window [0, ${w}) = "${text.slice(0, w)}", hash = ${firstHash}`,
    },
    0,
    firstHash,
    seen,
  );

  // 滚动渲染（hashes[1..] 对应窗口起始 1..）
  for (let k = 1; k < hashes.length; k++) {
    const start = k;
    const hash = hashes[k]!;
    const isDup = seen.has(hash);
    render(
      {
        zh: `滚动到 [${start}, ${start + w}) = "${text.slice(start, start + w)}"，哈希 = ${hash}${
          isDup ? '（与之前窗口哈希相同 → 内容可能相同）' : ''
        }`,
        en: `Roll to [${start}, ${start + w}) = "${text.slice(start, start + w)}", hash = ${hash}${
          isDup ? ' (same hash as a prior window → likely same content)' : ''
        }`,
      },
      start,
      hash,
      seen,
    );
    seen.set(hash, start);
  }

  // 终态
  rec
    .begin({
      zh: `完成。共 ${hashes.length} 个窗口，去重后 ${new Set(hashes).size} 个不同哈希。`,
      en: `Done. ${hashes.length} windows total, ${new Set(hashes).size} distinct hashes.`,
    })
    .setArray(
      values,
      values.map(() => 'sorted' as BarRole),
      [],
    )
    .setAux([
      { label: '窗口总数', value: String(hashes.length), role: 'default' as BarRole },
      {
        label: '不同哈希数',
        value: String(new Set(hashes).size),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
