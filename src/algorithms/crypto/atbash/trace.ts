// =============================================================================
// Atbash · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { atbash, type AtbashHooks } from './impl.ts';

export const DEFAULT_INPUT = 'Hello, ATBASH!';

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

  const hooks: AtbashHooks = {
    onMap: (i, original, mapped) => {
      cursor = i;
      display[i] = mapped.charCodeAt(0);
      snapshot({ zh: `'${original}' → '${mapped}'`, en: `'${original}' -> '${mapped}'` });
      done.add(i);
    },
    onSkip: (i, ch) => {
      cursor = i;
      snapshot({ zh: `'${ch}' 非字母`, en: `'${ch}' non-alpha` });
      done.add(i);
    },
  };

  const { text: out } = atbash(text, hooks);

  rec
    .begin({ zh: `完成：「${out}」`, en: `Done: "${out}"` })
    .setMap([
      { key: '原文', value: text, role: 'default' as BarRole },
      { key: 'Atbash', value: out, role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
