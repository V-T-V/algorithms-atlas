import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildChain } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 4, 6];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const chain = buildChain({
    onTry: (handlerName, level, handled) =>
      rec
        .begin({
          zh: `[${handlerName}] 处理 level=${level} → ${handled ? '处理' : '升级'}`,
          en: `[${handlerName}] level=${level} → ${handled ? 'handled' : 'escalate'}`,
        })
        .setAux([
          { label: '处理器', value: handlerName, role: 'pivot' as BarRole },
          {
            label: '处理',
            value: String(handled),
            role: (handled ? 'final' : 'compare') as BarRole,
          },
        ])
        .commit(),
    onEscalate: (from, to) =>
      rec
        .begin({ zh: `升级 ${from} → ${to}`, en: `Escalate ${from} → ${to}` })
        .setAux([
          { label: '从', value: from, role: 'compare' as BarRole },
          { label: '到', value: to, role: 'frontier' as BarRole },
        ])
        .commit(),
    onResult: (finalHandler) =>
      rec
        .begin({
          zh: finalHandler ? `由 ${finalHandler} 处理` : '无人可处理',
          en: finalHandler ? `Handled by ${finalHandler}` : 'Unresolved',
        })
        .setAux([
          {
            label: '结果',
            value: finalHandler ?? 'null',
            role: (finalHandler ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '构建责任链 L1→L2→L3', en: 'Build chain L1→L2→L3' })
    .setAux([{ label: '链', value: 'L1→L2→L3', role: 'default' as BarRole }])
    .commit();
  const results: (string | null)[] = [];
  for (const lvl of input) {
    const r = chain.handle(lvl);
    results.push(r);
    rec
      .begin({ zh: `level=${lvl} 最终 → ${r ?? '无人'}`, en: `level=${lvl} → ${r ?? 'none'}` })
      .setAux([
        { label: 'level', value: String(lvl), role: 'pivot' as BarRole },
        { label: '处理者', value: r ?? 'null', role: 'sorted' as BarRole },
      ])
      .commit();
  }
  return rec.build();
}
