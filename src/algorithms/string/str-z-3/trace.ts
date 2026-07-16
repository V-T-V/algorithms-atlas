// =============================================================================
// Z 算法 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zFunction, zMatch } from './impl.ts';

export const DEFAULT_INPUT = { text: 'ABABABAB', pat: 'ABA' };

export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const z = zFunction(text);

  rec
    .begin({ zh: `Z 函数 = [${z.join(',')}]`, en: `Z function = [${z.join(',')}]` })
    .setBars(z.map((v) => ({ value: v, role: 'default' })))
    .setAux([{ label: 'z', value: `[${z.join(',')}]`, role: 'pivot' }])
    .commit();

  const found = zMatch(text, pat);
  rec
    .begin({
      zh: `'${pat}' 在 '${text}' 中的匹配 = [${found.join(',')}]`,
      en: `Matches of '${pat}' in '${text}' = [${found.join(',')}]`,
    })
    .setBars(
      text.split('').map((ch, i) => {
        const inMatch = found.some((s) => i >= s && i < s + pat.length);
        return { value: ch.charCodeAt(0), role: inMatch ? 'final' : 'default' };
      }),
    )
    .setAux([{ label: 'found', value: `[${found.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
