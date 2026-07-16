// =============================================================================
// AC 自动机 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ACAutomaton3 } from './impl.ts';

export const DEFAULT_INPUT = { patterns: ['he', 'she', 'his', 'hers'], text: 'ushers' };

export function buildTrace(input: { patterns: string[]; text: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const ac = new ACAutomaton3();
  for (const p of input.patterns) ac.insert(p);
  ac.build();

  rec
    .begin({ zh: `构建完成，节点数=${ac.nodeCount}`, en: `Built, nodes=${ac.nodeCount}` })
    .setBars(input.text.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'default' })))
    .setAux([
      { label: 'patterns', value: `[${input.patterns.join(',')}]`, role: 'frontier' },
      { label: 'nodes', value: String(ac.nodeCount), role: 'pivot' },
    ])
    .commit();

  const matches = ac.match(input.text);
  for (const m of matches) {
    const pat = ac.getPattern(m.patternId);
    rec
      .begin({ zh: `位置 ${m.pos} 命中模式 '${pat}'`, en: `Pos ${m.pos} matched '${pat}'` })
      .setBars(
        input.text.split('').map((ch, i) => ({
          value: ch.charCodeAt(0),
          role: i >= m.pos - pat.length + 1 && i <= m.pos ? 'final' : 'default',
        })),
      )
      .setAux([{ label: 'pattern', value: pat, role: 'final' }])
      .commit();
  }

  rec
    .begin({ zh: `共 ${matches.length} 次匹配`, en: `${matches.length} matches total` })
    .setBars(input.text.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'final' })))
    .setAux([{ label: 'matches', value: String(matches.length), role: 'final' }])
    .commit();

  return rec.build();
}
