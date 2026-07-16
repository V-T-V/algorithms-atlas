// =============================================================================
// 读者-写者（Readers-Writers）· 纯算法实现（确定性事件序列模拟）
// 零 DOM 依赖，可独立单测。用「读优先」策略，按预定事件序列推进状态机，
// 不真起多线程，便于录制与测试。
// =============================================================================

export type RwRole = 'reader' | 'writer';

/** 一个事件：某读者请求读 / 某写者请求写 / 释放。 */
export interface RwEvent {
  /** 'read' 读者请求进入临界区；'write' 写者请求进入；'release' 释放（按 actor 退场）。 */
  type: 'read' | 'write' | 'release';
  /** 角色 id。 */
  actor: number;
  /** 仅 release 用：指明释放的是哪种角色（同 actor 可能先后读写）。 */
  role?: RwRole;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ReadersWritersHooks {
  /** 读者 actor 请求读。 */
  onReadTry?: (actor: number) => void;
  /** 写者 actor 请求写。 */
  onWriteTry?: (actor: number) => void;
  /** 读者因有写者持有/等待而阻塞。 */
  onReaderBlock?: (actor: number) => void;
  /** 写者因有读者/写者持有而阻塞。 */
  onWriterBlock?: (actor: number) => void;
  /** 读者进入临界区（activeReaders++）。 */
  onReadEnter?: (actor: number) => void;
  /** 写者进入临界区（获得独占锁）。 */
  onWriteEnter?: (actor: number) => void;
  /** 读者退出临界区。 */
  onReadLeave?: (actor: number) => void;
  /** 写者退出临界区。 */
  onWriteLeave?: (actor: number) => void;
}

export interface ReadersWritersResult {
  /** 累计进入的读者次数。 */
  readCount: number;
  /** 累计进入的写者次数。 */
  writeCount: number;
  /** 读者阻塞次数。 */
  readerBlocks: number;
  /** 写者阻塞次数。 */
  writerBlocks: number;
}

/** 资源状态：空闲 / 被读者共享持有 / 被写者独占持有。 */
export type ResourceState = 'free' | 'reading' | 'writing';

export interface RwState {
  /** 当前活跃读者数。 */
  activeReaders: number;
  /** 是否有写者持有（0/1）。 */
  writerActive: number;
  /** 等待的读者队列。 */
  waitingReaders: number[];
  /** 等待的写者队列。 */
  waitingWriters: number[];
}

/**
 * 读者-写者（读优先策略）确定性模拟。
 *
 * 模型：\n
 * - 资源可被**多个读者同时**共享读，但**写者独占**\n
 * - 读优先：只要有读者在读，新读者可直接进入（不因写者在等而阻塞），\n
 *   仅当写者**正在写**时读者才阻塞\n
 * - 写者必须等所有读者退出且无其他写者，才能写\n
 *
 * 按给定 `events` 顺序逐个推进状态机：\n
 * - `read`：若 writerActive=0 则进入；否则进等待队列\n
 * - `write`：若 activeReaders=0 且 writerActive=0 则进入；否则等待\n
 * - `release`：对应角色退出；退出后按读优先策略唤醒：\n
 *   - 写者退出 → 唤醒所有等待读者（若有），否则唤醒一个等待写者\n
 *   - 最后一个读者退出 → 唤醒一个等待写者\n
 *
 * @param events 预定事件序列
 * @param hooks 可选事件钩子
 * @returns 状态与统计
 */
export function readersWriters(
  events: RwEvent[],
  hooks: ReadersWritersHooks = {},
): { state: RwState; result: ReadersWritersResult } {
  const state: RwState = {
    activeReaders: 0,
    writerActive: 0,
    waitingReaders: [],
    waitingWriters: [],
  };
  const result: ReadersWritersResult = {
    readCount: 0,
    writeCount: 0,
    readerBlocks: 0,
    writerBlocks: 0,
  };

  // 唤醒逻辑：读优先
  const wakeReaders = (): void => {
    while (state.waitingReaders.length > 0 && state.writerActive === 0) {
      const actor = state.waitingReaders.shift()!;
      state.activeReaders++;
      result.readCount++;
      hooks.onReadEnter?.(actor);
    }
  };
  const wakeWriter = (): void => {
    if (state.activeReaders === 0 && state.writerActive === 0 && state.waitingWriters.length > 0) {
      const actor = state.waitingWriters.shift()!;
      state.writerActive = 1;
      result.writeCount++;
      hooks.onWriteEnter?.(actor);
    }
  };

  for (const ev of events) {
    if (ev.type === 'read') {
      hooks.onReadTry?.(ev.actor);
      if (state.writerActive === 0) {
        state.activeReaders++;
        result.readCount++;
        hooks.onReadEnter?.(ev.actor);
      } else {
        state.waitingReaders.push(ev.actor);
        result.readerBlocks++;
        hooks.onReaderBlock?.(ev.actor);
      }
    } else if (ev.type === 'write') {
      hooks.onWriteTry?.(ev.actor);
      if (state.activeReaders === 0 && state.writerActive === 0) {
        state.writerActive = 1;
        result.writeCount++;
        hooks.onWriteEnter?.(ev.actor);
      } else {
        state.waitingWriters.push(ev.actor);
        result.writerBlocks++;
        hooks.onWriterBlock?.(ev.actor);
      }
    } else {
      // release
      if (ev.role === 'writer') {
        state.writerActive = 0;
        hooks.onWriteLeave?.(ev.actor);
        // 写者退出：先唤醒读者（读优先），无读者再唤醒写者
        wakeReaders();
        wakeWriter();
      } else {
        state.activeReaders--;
        hooks.onReadLeave?.(ev.actor);
        // 最后一个读者退出：唤醒一个写者
        if (state.activeReaders === 0) {
          wakeWriter();
        }
      }
    }
  }

  return { state, result };
}

/** 便捷：构造一个「读-读-写-读-释放-释放-...」的演示事件序列。 */
export function defaultEvents(): RwEvent[] {
  return [
    { type: 'read', actor: 0 },
    { type: 'read', actor: 1 },
    { type: 'write', actor: 0 }, // 等待（有读者）
    { type: 'read', actor: 2 }, // 读优先：直接进入
    { type: 'release', actor: 0, role: 'reader' },
    { type: 'release', actor: 1, role: 'reader' },
    { type: 'release', actor: 2, role: 'reader' }, // 读者全退 → 唤醒写者
    { type: 'release', actor: 0, role: 'writer' },
  ];
}
