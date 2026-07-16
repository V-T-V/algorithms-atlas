// DFA 词法分析器 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tokenize, type LexerHooks, type Token } from './impl.ts';

export const DEFAULT_INPUT = 'x = 42 + (y - 3)';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const emitted: Token[] = [];
  let scanIdx = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const chars = [...input];
    const roles: BarRole[] = chars.map((_, i) => (i < scanIdx ? 'final' : 'default'));
    if (scanIdx < chars.length) roles[scanIdx] = 'compare';
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '扫描位置', value: String(scanIdx), role: 'pivot' as BarRole },
      {
        label: '已发射 token',
        value: emitted.map((t) => `${t.type}:${t.value}`).join(' | ') || '∅',
        role: 'frontier' as BarRole,
      },
    ];
    rec
      .begin(note)
      .setArray(
        chars.map((c) => (c === ' ' ? 0 : c.charCodeAt(0))),
        roles,
        scanIdx < chars.length ? [{ index: scanIdx, label: 'i' }] : [],
      )
      .setAux(aux)
      .commit();
  };

  snapshot({ zh: `词法分析：${input.length} 字符`, en: `Lex: ${input.length} chars` });

  const hooks: LexerHooks = {
    onEmit: (t) => {
      emitted.push(t);
      scanIdx = t.position + t.value.length;
      snapshot({ zh: `发射 ${t.type}:"${t.value}"`, en: `Emit ${t.type}:"${t.value}"` });
    },
  };

  tokenize(input, hooks);

  rec
    .begin({ zh: `词法完成`, en: `Lex complete` })
    .setMap(
      emitted.map((t, i) => ({
        key: `${i}`,
        value: `${t.type}:${t.value}`,
        role: (t.type === 'whitespace' ? 'default' : 'final') as BarRole,
      })),
    )
    .setAux([
      { label: 'token 数', value: String(emitted.length), role: 'final' as BarRole },
      {
        label: '非空白',
        value: String(emitted.filter((t) => t.type !== 'whitespace').length),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
