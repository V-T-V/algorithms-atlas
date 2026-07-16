import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { backupSingle, pathToRoot, type BPNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  // 构造 3 层链：root -> mid -> leaf
  const root: BPNode = { visits: 0, wins: 0, parent: null };
  const mid: BPNode = { visits: 0, wins: 0, parent: root };
  const leaf: BPNode = { visits: 0, wins: 0, parent: mid };

  rec
    .begin({ zh: `初始化回传链（3 层）`, en: `Init backup chain (3 levels)` })
    .setBars([
      { value: 0, role: 'default' as BarRole, label: 'root' },
      { value: 0, role: 'default' as BarRole, label: 'mid' },
      { value: 0, role: 'default' as BarRole, label: 'leaf' },
    ])
    .setAux([{ label: 'reward', value: '1', role: 'compare' as BarRole }])
    .commit();

  backupSingle(leaf, 1, {
    onBackup: (visits, wins, depth) => {
      const names = ['leaf', 'mid', 'root'];
      rec
        .begin({
          zh: `回传到 ${names[depth]} visits=${visits} wins=${wins}`,
          en: `backup to ${names[depth]} visits=${visits} wins=${wins}`,
        })
        .setBars([
          {
            value: root.visits,
            role: 'default' as BarRole,
            label: `root:${root.wins}/${root.visits}`,
          },
          { value: mid.visits, role: 'default' as BarRole, label: `mid:${mid.wins}/${mid.visits}` },
          {
            value: leaf.visits,
            role: 'default' as BarRole,
            label: `leaf:${leaf.wins}/${leaf.visits}`,
          },
        ])
        .setAux([{ label: '当前', value: names[depth] ?? '?', role: 'final' as BarRole }])
        .commit();
    },
  });

  const path = pathToRoot(leaf);
  rec
    .begin({ zh: `完成：路径长度=${path.length}`, en: `Done: path length=${path.length}` })
    .setAux([{ label: '长度', value: String(path.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
