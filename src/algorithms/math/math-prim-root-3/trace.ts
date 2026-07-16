// =============================================================================
// 原根 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primitiveRoot, type PrimRootHooks } from './impl.ts';

export const DEFAULT_INPUT = 7;

export function buildTrace(m: number | bigint = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const candidates: Array<{ g: string; ok: boolean }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(candidates.map((c) => ({ value: Number(c.g), role: c.ok ? 'final' : 'default' })))
      .setAux(
        candidates.map((c) => ({
          label: `g=${c.g}`,
          value: c.ok ? '✓' : '✗',
          role: c.ok ? 'final' : 'warn',
        })),
      )
      .commit();
  };

  snap({ zh: `求 mod ${m} 的最小原根`, en: `Smallest primitive root mod ${m}` });

  const hooks: PrimRootHooks = {
    onCandidate: (g, ok) => {
      candidates.push({ g: g.toString(), ok });
      snap({ zh: `候选 g=${g}: ${ok ? '是原根' : '不是'}`, en: `g=${g}: ${ok ? 'yes' : 'no'}` });
    },
  };

  const r = primitiveRoot(m, hooks);

  rec
    .begin({
      zh: r === null ? '无原根' : `最小原根 g=${r}`,
      en: r === null ? 'no primitive root' : `g=${r}`,
    })
    .setAux([{ label: '答案', value: r === null ? '无' : r.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
