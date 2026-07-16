// =============================================================================
// 自动密钥密码 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { autokeyEncrypt, type AutokeyHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'ATTACKATDAWN', primer: 'QUE' };

export function buildTrace(input: { text: string; primer: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, primer } = input;
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
    zh: `明文「${text}」，引子「${primer}」`,
    en: `Plaintext "${text}", primer "${primer}"`,
  });

  const hooks: AutokeyHooks = {
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

  const { text: out } = autokeyEncrypt(text, primer, hooks);

  rec
    .begin({ zh: `完成：密文「${out}」`, en: `Done: ciphertext "${out}"` })
    .setMap([
      { key: '明文', value: text, role: 'default' as BarRole },
      { key: '密文', value: out, role: 'final' as BarRole },
      { key: '引子', value: primer, role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
