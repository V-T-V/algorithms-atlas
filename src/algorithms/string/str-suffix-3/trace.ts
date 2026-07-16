// =============================================================================
// 后缀树 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SuffixTree3 } from './impl.ts';

export const DEFAULT_INPUT = 'banana';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = new SuffixTree3(input);

  rec
    .begin({
      zh: `后缀树构建完成，节点数=${tree.nodeCount}`,
      en: `Suffix tree built, nodes=${tree.nodeCount}`,
    })
    .setBars(input.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'default' })))
    .setAux([{ label: 'nodes', value: String(tree.nodeCount), role: 'pivot' }])
    .commit();

  for (const sub of ['ban', 'ana', 'na', 'xyz']) {
    const ok = tree.contains(sub);
    rec
      .begin({
        zh: `子串 '${sub}' ${ok ? '存在' : '不存在'}`,
        en: `Substring '${sub}' ${ok ? 'exists' : 'missing'}`,
      })
      .setBars(
        input
          .split('')
          .map((ch) => ({ value: ch.charCodeAt(0), role: ok ? 'compare' : 'default' })),
      )
      .setAux([{ label: `contains('${sub}')`, value: String(ok), role: ok ? 'final' : 'warn' }])
      .commit();
  }

  return rec.build();
}
