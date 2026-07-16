// =============================================================================
// 读者-写者 · 录制帧序列
// 用 setAux 展示活跃读者数、写者状态、资源锁状态、等待队列。
// 用 setArray 展示各角色（读者/写者）的当前状态条。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { readersWriters, defaultEvents, type RwEvent, type ReadersWritersHooks } from './impl.ts';

export { defaultEvents as DEFAULT_INPUT_EVENTS };

/** 角色条：每行一个 actor，显示其角色与状态。 */
interface ActorBar {
  label: string;
  value: string;
  role: BarRole;
}

/** 录制演示帧序列。 */
export function buildTrace(events: RwEvent[] = defaultEvents()): Frame[] {
  const rec = new TraceRecorder();
  // 统计出现的角色
  const actorSet = new Set<number>();
  for (const ev of events) actorSet.add(ev.actor);
  const actors = [...actorSet].sort((a, b) => a - b);
  // 每个角色的状态：'idle' | 'reading' | 'writing' | 'wait-r' | 'wait-w'
  type AState = 'idle' | 'reading' | 'writing' | 'wait-r' | 'wait-w';
  const actorState = new Map<number, AState>();
  for (const a of actors) actorState.set(a, 'idle');

  let activeReaders = 0;
  let writerActive = 0;
  const waitingReaders: number[] = [];
  const waitingWriters: number[] = [];

  const stateLabel = (s: AState): string =>
    s === 'reading'
      ? '读中'
      : s === 'writing'
        ? '写中'
        : s === 'wait-r'
          ? '等读'
          : s === 'wait-w'
            ? '等写'
            : '空闲';
  const stateRole = (s: AState): BarRole =>
    s === 'reading'
      ? 'final'
      : s === 'writing'
        ? 'swap'
        : s === 'wait-r' || s === 'wait-w'
          ? 'warn'
          : 'default';

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars: ActorBar[] = actors.map((a) => {
      const s = actorState.get(a) ?? 'idle';
      return { label: `#${a}`, value: stateLabel(s), role: stateRole(s) };
    });
    // setArray 需要数值：用角色状态码 0=idle,1=reading,2=writing,3=wait
    const values = actors.map((a) => {
      const s = actorState.get(a) ?? 'idle';
      return s === 'reading' ? 1 : s === 'writing' ? 2 : s.startsWith('wait') ? 3 : 0;
    });
    const roles = actors.map((a) => stateRole(actorState.get(a) ?? 'idle'));
    const pointers: Array<{ index: number; label: string }> = [];

    const aux = [
      { label: '活跃读者数', value: String(activeReaders), role: 'final' as BarRole },
      {
        label: '写者持有',
        value: writerActive ? '是' : '否',
        role: (writerActive ? 'swap' : 'default') as BarRole,
      },
      {
        label: '资源状态',
        value: writerActive ? '写独占' : activeReaders > 0 ? '读共享' : '空闲',
        role: (writerActive ? 'swap' : activeReaders > 0 ? 'final' : 'default') as BarRole,
      },
      {
        label: '等待读者',
        value: waitingReaders.length ? waitingReaders.map((r) => `R${r}`).join(', ') : '无',
        role: (waitingReaders.length ? 'warn' : 'default') as BarRole,
      },
      {
        label: '等待写者',
        value: waitingWriters.length ? waitingWriters.map((w) => `W${w}`).join(', ') : '无',
        role: (waitingWriters.length ? 'warn' : 'default') as BarRole,
      },
    ];
    rec
      .begin(note)
      .setArray(values, roles, pointers)
      .setAux([...aux, ...bars.map((b) => ({ label: b.label, value: b.value, role: b.role }))])
      .commit();
  };

  snapshot({
    zh: `读者-写者（读优先）。事件数 ${events.length}，角色 ${actors.length}`,
    en: `Readers-Writers (reader priority). ${events.length} events, ${actors.length} actors`,
  });

  const hooks: ReadersWritersHooks = {
    onReadTry: (actor) => {
      snapshot({ zh: `R${actor} 请求读`, en: `R${actor} requests read` });
    },
    onWriteTry: (actor) => {
      snapshot({ zh: `W${actor} 请求写`, en: `W${actor} requests write` });
    },
    onReaderBlock: (actor) => {
      actorState.set(actor, 'wait-r');
      snapshot({ zh: `R${actor} 被阻塞（写者持有）`, en: `R${actor} blocked (writer holds)` });
    },
    onWriterBlock: (actor) => {
      actorState.set(actor, 'wait-w');
      snapshot({
        zh: `W${actor} 被阻塞（有活跃读者/写者）`,
        en: `W${actor} blocked (readers/writer active)`,
      });
    },
    onReadEnter: (actor) => {
      actorState.set(actor, 'reading');
      activeReaders++;
      snapshot({ zh: `R${actor} 进入读（共享）`, en: `R${actor} enters read (shared)` });
    },
    onWriteEnter: (actor) => {
      actorState.set(actor, 'writing');
      writerActive = 1;
      // 同步等待队列（唤醒后已 shift）
      snapshot({ zh: `W${actor} 进入写（独占）`, en: `W${actor} enters write (exclusive)` });
    },
    onReadLeave: (actor) => {
      actorState.set(actor, 'idle');
      activeReaders = Math.max(0, activeReaders - 1);
      snapshot({ zh: `R${actor} 退出读`, en: `R${actor} leaves read` });
    },
    onWriteLeave: (actor) => {
      actorState.set(actor, 'idle');
      writerActive = 0;
      snapshot({ zh: `W${actor} 退出写`, en: `W${actor} leaves write` });
    },
  };

  // 用包装器同步等待队列状态（impl 内部维护，这里镜像）
  const wrappedHooks: ReadersWritersHooks = {
    ...hooks,
    onReaderBlock: (actor) => {
      waitingReaders.push(actor);
      hooks.onReaderBlock?.(actor);
    },
    onWriterBlock: (actor) => {
      waitingWriters.push(actor);
      hooks.onWriterBlock?.(actor);
    },
    onReadEnter: (actor) => {
      // 若是从等待队列唤醒，则移除
      const idx = waitingReaders.indexOf(actor);
      if (idx >= 0) waitingReaders.splice(idx, 1);
      hooks.onReadEnter?.(actor);
    },
    onWriteEnter: (actor) => {
      const idx = waitingWriters.indexOf(actor);
      if (idx >= 0) waitingWriters.splice(idx, 1);
      hooks.onWriteEnter?.(actor);
    },
  };

  readersWriters(events, wrappedHooks);

  // 终态
  rec
    .begin({ zh: '模拟结束：资源空闲', en: 'Simulation done: resource free' })
    .setAux([
      { label: '活跃读者数', value: '0', role: 'final' as BarRole },
      { label: '写者持有', value: '否', role: 'final' as BarRole },
      { label: '资源状态', value: '空闲', role: 'final' as BarRole },
      { label: '等待读者', value: '无', role: 'final' as BarRole },
      { label: '等待写者', value: '无', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
