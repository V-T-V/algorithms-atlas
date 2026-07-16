import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Acceptor, Connector } from './impl.ts';
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '接受器-连接器', en: 'Acceptor-Connector' }).commit();
  const acc = new Acceptor();
  const con = new Connector();
  acc.accept('peer1', {
    onConnect: (role, peer) =>
      rec
        .begin({ zh: role + ' <- ' + peer, en: 'connect' })
        .setAux([{ label: 'role', value: role, role: 'compare' as BarRole }])
        .commit(),
  });
  con.connect('peer2', {
    onConnect: (role, peer) =>
      rec
        .begin({ zh: role + ' -> ' + peer, en: 'connect' })
        .setAux([{ label: 'role', value: role, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
