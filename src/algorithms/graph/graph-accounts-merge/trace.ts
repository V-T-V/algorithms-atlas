// =============================================================================
// 账户合并 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { accountsMerge, type AccountsMergeHooks } from './impl.ts';

export const DEFAULT_ACCOUNTS: string[][] = [
  ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
  ['John', 'johnsmith@mail.com', 'john00@mail.com'],
  ['Mary', 'mary@mail.com'],
  ['John', 'johnnybravo@mail.com'],
];

export function buildTrace(accounts: string[][] = DEFAULT_ACCOUNTS): Frame[] {
  const rec = new TraceRecorder();

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = accounts.map((_, _i) => 'default');
    rec
      .begin(note)
      .setBars(
        accounts.map((a, i) => ({
          value: a.length,
          role: roles[i]!,
          label: `${a[0]}:${a.length - 1}`,
        })),
      )
      .setAux([{ label: '账户数', value: String(accounts.length), role: 'pivot' }])
      .commit();
  };

  snap({ zh: `${accounts.length} 个账户`, en: `${accounts.length} accounts` });

  const hooks: AccountsMergeHooks = {
    onUnion: (a, b) => snap({ zh: `合并邮箱 ${a} ~ ${b}`, en: `Merge ${a} ~ ${b}` }),
    onResult: (count) => {
      snap({ zh: `合并后 ${count} 个账户`, en: `${count} accounts after merge` });
    },
  };

  const result = accountsMerge(accounts, hooks);

  rec
    .begin({ zh: `完成：${result.length} 个账户`, en: `Done: ${result.length} accounts` })
    .setBars(
      result.map((r) => ({
        value: r.length,
        role: 'final' as BarRole,
        label: `${r[0]}:${r.length - 1}`,
      })),
    )
    .setMap(
      result.map((r, i) => ({
        key: `账户${i + 1}`,
        value: `${r[0]}(${r.length - 1})`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
