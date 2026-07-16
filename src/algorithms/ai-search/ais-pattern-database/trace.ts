import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildPatternDatabase, queryPdb } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  // 2x2 拼图，目标 [1,2,0,3]（0=空白），关键子 [1]
  const n = 2;
  const goal = [1, 2, 3, 0];
  const keyTiles = [1, 2];

  rec
    .begin({
      zh: `初始化 ${n}x${n} PDB 关键子[${keyTiles.join(',')}]`,
      en: `Init ${n}x${n} PDB keys=[${keyTiles.join(',')}]`,
    })
    .setGrid(
      [goal.slice(0, 2), goal.slice(2, 4)].map((row) =>
        row.map((v) => ({ v: v === 0 ? '.' : v, role: 'default' as BarRole })),
      ),
    )
    .setAux([{ label: '目标', value: `[${goal.join(',')}]`, role: 'compare' as BarRole }])
    .commit();

  const db = buildPatternDatabase(n, keyTiles, goal, {
    onEntry: (pattern, distance) => {
      rec
        .begin({
          zh: `模式 ${pattern} 距离=${distance}`,
          en: `pattern ${pattern} dist=${distance}`,
        })
        .setAux([
          { label: '模式', value: pattern, role: 'compare' as BarRole },
          { label: '距离', value: String(distance), role: 'final' as BarRole },
        ])
        .commit();
    },
  });

  // 查询一个打乱状态
  const shuffled = [2, 1, 3, 0];
  const d = queryPdb(db, shuffled, keyTiles);
  rec
    .begin({
      zh: `查询 [${shuffled.join(',')}] 距离=${d}`,
      en: `query [${shuffled.join(',')}] dist=${d}`,
    })
    .setGrid(
      [shuffled.slice(0, 2), shuffled.slice(2, 4)].map((row) =>
        row.map((v) => ({ v: v === 0 ? '.' : v, role: 'final' as BarRole })),
      ),
    )
    .setAux([{ label: '查询距离', value: String(d), role: 'final' as BarRole }])
    .commit();

  rec
    .begin({ zh: `完成：数据库 ${db.size} 项`, en: `Done: db ${db.size} entries` })
    .setAux([{ label: '条目数', value: String(db.size), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
