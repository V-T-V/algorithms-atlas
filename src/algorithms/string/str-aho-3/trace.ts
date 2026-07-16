// =============================================================================
// Aho-Corasick DFA · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Aho3 } from './impl.ts';

export const DEFAULT_INPUT = { patterns: ['he', 'she', 'his', 'hers'], text: 'shers' };

export function buildTrace(input: { patterns: string[]; text: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const aho = new Aho3();
  for (const p of input.patterns) aho.insert(p);
  aho.build();

  rec
    .begin({ zh: `DFA 构建完成，节点数=${aho.nodeCount}`, en: `DFA built, nodes=${aho.nodeCount}` })
    .setBars(input.text.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'default' })))
    .setAux([{ label: 'nodes', value: String(aho.nodeCount), role: 'pivot' }])
    .commit();

  const matches = aho.match(input.text);
  for (const m of matches) {
    const pat = aho.getPattern(m.patternId);
    rec
      .begin({ zh: `位置 ${m.pos} 命中 '${pat}'`, en: `Pos ${m.pos} matched '${pat}'` })
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
    .begin({ zh: `共 ${matches.length} 次匹配`, en: `${matches.length} matches` })
    .setBars(input.text.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'final' })))
    .commit();

  return rec.build();
}
