// =============================================================================
// Tunstall 编码 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTunstall, tunstallEncode, tunstallDecode, type TunstallHooks } from './impl.ts';

export const DEFAULT_ALPHABET = [
  { sym: 'a', prob: 0.5 },
  { sym: 'b', prob: 0.3 },
  { sym: 'c', prob: 0.2 },
];
export const DEFAULT_TEXT = 'aabacb';
const DEFAULT_L = 3;

export function buildTrace(
  alphabet: Array<{ sym: string; prob: number }> = DEFAULT_ALPHABET,
  text: string = DEFAULT_TEXT,
  L: number = DEFAULT_L,
): Frame[] {
  const rec = new TraceRecorder();
  const expansions: Array<{ seq: string; prob: number }> = [];

  rec
    .begin({
      zh: `字母表 ${alphabet.length} 符号，目标码长 L=${L}（${1 << L} 叶）`,
      en: `Alphabet ${alphabet.length} syms, L=${L} (${1 << L} leaves)`,
    })
    .setAux(
      alphabet.map((a) => ({ label: a.sym, value: a.prob.toFixed(2), role: 'pivot' as BarRole })),
    )
    .commit();

  const hooks: TunstallHooks = {
    onExpand: (seq, prob) => expansions.push({ seq, prob }),
  };

  const result = buildTunstall(alphabet, L, hooks);
  const codes = tunstallEncode(text, result);
  const decoded = tunstallDecode(codes, result);
  const ok = decoded === text;

  rec
    .begin({
      zh: `字典构建完成（${result.dict.size} 项）`,
      en: `Dict built (${result.dict.size} entries)`,
    })
    .setAux(
      [...result.dict.entries()].map(([seq, code]) => ({
        label: seq,
        value: code.toString(2).padStart(L, '0'),
        role: 'final' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `编码 "${text}" → ${codes.length} 个 ${L}-bit 码字；往返${ok ? '一致' : '不一致'}`,
      en: `Encode "${text}" → ${codes.length} ${L}-bit codewords; ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '文本', value: text, role: 'compare' as BarRole },
      {
        label: '码字',
        value: codes.map((c) => c.toString(2).padStart(L, '0')).join(' '),
        role: 'final' as BarRole,
      },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
