// =============================================================================
// 相邻对编码 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bpeTrain, bpeDecode, type BpeHooks } from './impl.ts';

export const DEFAULT_INPUT = [97, 97, 98, 97, 97, 98, 97, 97, 98, 99, 99, 99];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT, rounds: number = 4): Frame[] {
  const rec = new TraceRecorder();
  const mergeLog: Array<{ pair: [number, number]; tok: number; count: number }> = [];

  rec
    .begin({
      zh: `输入 ${input.length} token，${rounds} 轮合并`,
      en: `Input ${input.length} tokens, ${rounds} rounds`,
    })
    .setAux(input.map((t, i) => ({ label: `t${i}`, value: String(t), role: 'default' as BarRole })))
    .commit();

  const hooks: BpeHooks = {
    onMerge: (pair, newToken, count) => mergeLog.push({ pair, tok: newToken, count }),
  };

  const result = bpeTrain(input, rounds, hooks);
  const restored = bpeDecode(result.tokens, result.merges);
  const ok = restored.length === input.length && restored.every((v, i) => v === input[i]);

  for (const m of mergeLog) {
    rec
      .begin({
        zh: `合并 [${m.pair[0]},${m.pair[1]}] ×${m.count} → token ${m.tok}`,
        en: `Merge [${m.pair[0]},${m.pair[1]}] ×${m.count} → token ${m.tok}`,
      })
      .setAux([
        { label: '对', value: `[${m.pair[0]},${m.pair[1]}]`, role: 'compare' as BarRole },
        { label: '频次', value: String(m.count), role: 'pivot' as BarRole },
        { label: '新 token', value: String(m.tok), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：${result.merges.length} 条规则，压缩后 ${result.tokens.length} token，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${result.merges.length} rules, ${result.tokens.length} tokens, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '原始', value: String(input.length), role: 'compare' as BarRole },
      { label: '压缩后', value: String(result.tokens.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
