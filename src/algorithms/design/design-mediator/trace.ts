import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ChatRoom, ChatUser } from './impl.ts';

interface TraceInput {
  users: string[];
  broadcasts: Array<[string, string]>;
  privates: Array<[string, string, string]>;
}
export const DEFAULT_INPUT: TraceInput = {
  users: ['alice', 'bob', 'carol'],
  broadcasts: [['alice', 'hi all']],
  privates: [['bob', 'carol', 'hey carol']],
};

export function buildTrace(input: TraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const room = new ChatRoom({
    onJoin: (user, total) =>
      rec
        .begin({ zh: `${user} 加入（共 ${total} 人）`, en: `${user} joined (${total} total)` })
        .setAux([{ label: '人数', value: String(total), role: 'pivot' as BarRole }])
        .commit(),
    onLeave: (user, total) =>
      rec
        .begin({ zh: `${user} 离开（剩 ${total} 人）`, en: `${user} left (${total} total)` })
        .setAux([{ label: '人数', value: String(total), role: 'compare' as BarRole }])
        .commit(),
    onSend: (from, to, message, delivered) =>
      rec
        .begin({
          zh: `${from} → ${to ?? '所有人'}: "${message}"（送达 ${delivered}）`,
          en: `${from} → ${to ?? 'all'}: "${message}" (delivered ${delivered})`,
        })
        .setAux([
          { label: '送达', value: String(delivered), role: 'frontier' as BarRole },
          { label: '消息', value: message, role: 'final' as BarRole },
        ])
        .commit(),
  });
  const userMap = new Map<string, ChatUser>();
  for (const name of input.users) userMap.set(name, new ChatUser(name, room));
  for (const [from, msg] of input.broadcasts) userMap.get(from)!.send(msg);
  for (const [from, to, msg] of input.privates) userMap.get(from)!.sendTo(to, msg);
  rec
    .begin({
      zh: `收件箱：alice=${userMap.get('alice')!.inbox.length}, bob=${userMap.get('bob')!.inbox.length}, carol=${userMap.get('carol')!.inbox.length}`,
      en: `Inbox: alice=${userMap.get('alice')!.inbox.length}, bob=${userMap.get('bob')!.inbox.length}, carol=${userMap.get('carol')!.inbox.length}`,
    })
    .setAux([
      {
        label: 'alice',
        value: String(userMap.get('alice')!.inbox.length),
        role: 'final' as BarRole,
      },
      { label: 'bob', value: String(userMap.get('bob')!.inbox.length), role: 'sorted' as BarRole },
      {
        label: 'carol',
        value: String(userMap.get('carol')!.inbox.length),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
