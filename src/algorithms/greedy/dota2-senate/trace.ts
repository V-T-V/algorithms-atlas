// =============================================================================
// Dota2 参议院 · 录制帧序列
// 可视化：setArray 渲染剩余参议员（R=1/D=-1）；setAux 展示队列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dota2Senate, type Dota2SenateHooks } from './impl.ts';

export const DEFAULT_INPUT = 'RDDRD';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  // active[i]：位置 i 的参议员是否仍存活
  const active: boolean[] = new Array<boolean>(n).fill(true);

  const render = (note: { zh: string; en: string }, banned: number | null): void => {
    const values: number[] = [];
    const roles: BarRole[] = [];
    for (let i = 0; i < n; i++) {
      const ch = input[i]!;
      if (active[i]) {
        values.push(ch === 'R' ? 1 : -1);
        roles.push(i === banned ? 'warn' : ch === 'R' ? 'compare' : 'frontier');
      } else {
        values.push(0);
        roles.push('default');
      }
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (banned !== null) pointers.push({ index: banned, label: '禁' });
    rec.begin(note).setArray(values, roles, pointers).commit();
  };

  rec
    .begin({
      zh: `Dota2 参议院："${input}"（R=Radiant, D=Dire），轮流禁止对方`,
      en: `Dota2 Senate: "${input}" (R=Radiant, D=Dire), alternate banning`,
    })
    .setArray(
      [...input].map((c) => (c === 'R' ? 1 : -1)),
      [...input].map((c) => (c === 'R' ? 'compare' : 'frontier') as BarRole),
      [],
    )
    .commit();

  const hooks: Dota2SenateHooks = {
    onBan: (speaker, speakerIdx, bannedIdx) => {
      active[bannedIdx] = false;
      render(
        {
          zh: `${speaker}（位置 ${speakerIdx}）发言，禁掉对方位置 ${bannedIdx}`,
          en: `${speaker} (idx ${speakerIdx}) bans opponent at idx ${bannedIdx}`,
        },
        bannedIdx,
      );
    },
  };

  const winner = dota2Senate(input, hooks);

  rec
    .begin({
      zh: `完成：${winner === 'Radiant' ? 'Radiant 胜' : 'Dire 胜'}`,
      en: `Done: ${winner} wins`,
    })
    .setArray(
      [...input].map((c) => (c === winner[0] ? (c === 'R' ? 1 : -1) : 0)),
      [...input].map((c) => (c === winner[0] ? 'final' : 'default') as BarRole),
      [],
    )
    .setAux([{ label: '获胜方', value: winner, role: 'final' }])
    .commit();

  return rec.build();
}
