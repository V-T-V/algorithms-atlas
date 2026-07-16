// =============================================================================
// 游程编码 · 录制帧序列
// 用 setArray（输入字符码 + 游程游标）展示扫描过程，setAux 展示已产出的 token。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rle, encodeRuns, type RleHooks } from './impl.ts';

export const DEFAULT_INPUT = 'AAAABBBCCDAA';

/** 字符串 → 字符码数组。 */
function toCodes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0));
}

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes = toCodes(input);
  const emitted: Array<{ value: string; count: number }> = [];
  // 当前游程的字符高亮范围 [runStart, runEnd)
  let runStart = -1;
  let runEnd = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = codes.map((_, i) =>
      runStart >= 0 && i >= runStart && i < runEnd ? 'compare' : 'default',
    );
    const pointers = runEnd >= 0 && runEnd < codes.length ? [{ index: runEnd, label: 'i' }] : [];
    rec
      .begin(note)
      .setArray([...codes], roles, pointers)
      .setAux(
        emitted.map((e) => ({
          label: e.value,
          value: String(e.count),
          role: 'final' as BarRole,
        })),
      )
      .commit();
  };

  snapshot({ zh: `输入串「${input}」`, en: `Input "${input}"` });

  const hooks: RleHooks = {
    onRun: (start, value) => {
      runStart = start;
      runEnd = start + 1;
      snapshot({
        zh: `从下标 ${start} 起发现字符 '${value}'`,
        en: `Found '${value}' starting at index ${start}`,
      });
    },
    onEmit: (_start, value, count) => {
      runStart = -1;
      runEnd = -1;
      emitted.push({ value, count });
      snapshot({
        zh: `输出 token：${value}${count}（连续 ${count} 个）`,
        en: `Emit ${value}${count} (run of ${count})`,
      });
    },
  };

  const runs = rle(input, hooks);
  const encoded = encodeRuns(runs);

  // 终态
  rec
    .begin({
      zh: `完成：${encoded}（原始 ${input.length} 字符 → 编码 ${encoded.length} 字符）`,
      en: `Done: ${encoded} (${input.length} chars -> ${encoded.length} encoded)`,
    })
    .setMap([
      { key: '原始 / input', value: input, role: 'default' as BarRole },
      { key: '编码 / encoded', value: encoded, role: 'final' as BarRole },
      { key: '原始长度', value: String(input.length), role: 'pivot' as BarRole },
      { key: '编码长度', value: String(encoded.length), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
