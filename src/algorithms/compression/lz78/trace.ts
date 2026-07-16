// =============================================================================
// LZ78 字典压缩 · 录制帧序列
// 用 setArray 展示输入码点流 + 当前指针；setAux 展示字典内容与已输出 token。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz78, toCodePoints, type Lz78Hooks, type Lz78Token } from './impl.ts';

export const DEFAULT_INPUT = 'ABABABA';

function vis(c: number): string {
  if (c < 0) return 'EOF';
  if (c < 32 || c > 126) return `·${c}`;
  return String.fromCodePoint(c);
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const data = toCodePoints(input);
  let dictionary: string[] = [''];
  const emitted: Lz78Token[] = [];
  let pos = 0;
  let matchLen = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = data.map((_, i) => {
      if (i < pos) return 'final';
      if (i >= pos && i < pos + matchLen) return 'compare';
      if (i === pos + matchLen) return 'pivot';
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos < data.length) pointers.push({ index: pos, label: 'pos' });
    rec
      .begin(note)
      .setArray([...data], roles, pointers)
      .setAux([
        {
          label: '字典',
          value: dictionary.map((e, i) => `${i}:"${e}"`).join('  ') || '0:""',
          role: 'sorted' as BarRole,
        },
        {
          label: '已输出 token',
          value: emitted.length
            ? emitted.map((t) => `(${t.index},'${vis(t.char)}')`).join(' ')
            : '∅',
          role: 'final' as BarRole,
        },
      ])
      .commit();
    matchLen = 0;
  };

  snapshot({
    zh: `输入「${input}」（${data.length} 码点）`,
    en: `Input "${input}" (${data.length} pts)`,
  });

  const hooks: Lz78Hooks = {
    onAdvance: (p) => {
      pos = p;
      snapshot({ zh: `指针到 ${p}，查字典最长前缀`, en: `pos=${p}, find longest prefix` });
    },
    onMatch: (_p, index, prefix, newChar) => {
      matchLen = toCodePoints(prefix).length;
      snapshot({
        zh: `最长前缀 = dict[${index}]="${prefix}"，新字符 = '${vis(newChar)}'`,
        en: `Longest prefix = dict[${index}]="${prefix}", new char = '${vis(newChar)}'`,
      });
    },
    onAddEntry: (_entryIndex, entry) => {
      snapshot({ zh: `加入字典条目 "${entry}"`, en: `Added dictionary entry "${entry}"` });
    },
    onEmit: (token) => {
      emitted.push(token);
    },
  };

  const result = lz78(input, hooks);
  dictionary = result.dictionary;

  rec
    .begin({
      zh: `完成：${result.tokens.length} 个二元组`,
      en: `Done: ${result.tokens.length} tokens`,
    })
    .setMap([
      { key: '输入 / input', value: input, role: 'default' as BarRole },
      {
        key: 'tokens',
        value: result.tokens.map((t) => `(${t.index},'${vis(t.char)}')`).join(' '),
        role: 'final' as BarRole,
      },
      {
        key: '字典大小',
        value: String(result.dictionary.length),
        role: 'pivot' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
