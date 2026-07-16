// =============================================================================
// ROT13 · 录制帧序列
// setArray 展示字符码数组 + 指针。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rot13, type Rot13Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'Hello, ROT13!';

export function buildTrace(text: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes = Array.from(text).map((c) => c.charCodeAt(0));
  const display = [...codes];
  const done = new Set<number>();
  let cursor = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = codes.map((_, i) =>
      done.has(i) ? 'final' : i === cursor ? 'compare' : 'default',
    );
    const pointers = cursor >= 0 ? [{ index: cursor, label: 'i' }] : [];
    rec
      .begin(note)
      .setArray([...display], roles, pointers)
      .commit();
  };

  snapshot({ zh: `原文「${text}」`, en: `Plaintext "${text}"` });

  const hooks: Rot13Hooks = {
    onShift: (i, original, shifted) => {
      cursor = i;
      display[i] = shifted.charCodeAt(0);
      snapshot({ zh: `'${original}' → '${shifted}'`, en: `'${original}' -> '${shifted}'` });
      done.add(i);
    },
    onSkip: (i, ch) => {
      cursor = i;
      snapshot({ zh: `'${ch}' 非字母`, en: `'${ch}' non-alpha` });
      done.add(i);
    },
  };

  const { text: out } = rot13(text, hooks);

  rec
    .begin({ zh: `完成：「${out}」`, en: `Done: "${out}"` })
    .setMap([
      { key: '原文', value: text, role: 'default' as BarRole },
      { key: 'ROT13', value: out, role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
