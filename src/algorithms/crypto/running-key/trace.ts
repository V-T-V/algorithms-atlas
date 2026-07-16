// =============================================================================
// 运行密钥密码 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runningKey, type RunningKeyHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'ATTACKATDAWN', key: 'THE QUICK BROWN FOX' };

export function buildTrace(input: { text: string; key: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, key } = input;
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

  snapshot({
    zh: `明文「${text}」，运行密钥「${key}」`,
    en: `Plaintext "${text}", running key "${key}"`,
  });

  const hooks: RunningKeyHooks = {
    onMap: (i, plain, keyChar, cipher) => {
      cursor = i;
      display[i] = cipher.charCodeAt(0);
      snapshot({
        zh: `'${plain}' → '${cipher}'（密钥 '${keyChar}'）`,
        en: `'${plain}' -> '${cipher}' (key '${keyChar}')`,
      });
      done.add(i);
    },
    onSkip: (i, ch) => {
      cursor = i;
      snapshot({ zh: `'${ch}' 非字母`, en: `'${ch}' non-alpha` });
      done.add(i);
    },
  };

  const { text: out } = runningKey(text, key, false, hooks);

  rec
    .begin({ zh: `完成：密文「${out}」`, en: `Done: ciphertext "${out}"` })
    .setMap([
      { key: '明文', value: text, role: 'default' as BarRole },
      { key: '密文', value: out, role: 'final' as BarRole },
      { key: '运行密钥', value: key, role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
