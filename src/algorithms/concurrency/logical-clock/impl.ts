// =============================================================================
// 逻辑时钟（通用框架）· 纯算法实现
// 用一个 ClockRules 接口抽象 apply / merge / init，从而可实例化 Lamport、向量时钟等。
// 为避免联合类型 number[] | number[][] 在泛型 S 上的解析歧义，
// 这里不做泛型，统一以 ClockState 联合类型承载，规则函数自行处理形状。
// =============================================================================

export type ClockKind = 'scalar' | 'vector';

/** 标量时钟状态：number[]，每个进程一个标量。 */
export type ScalarClock = number[];
/** 向量时钟状态：number[][]，每个进程一个向量。 */
export type VectorClock = number[][];
/** 统一时钟状态。 */
export type ClockState = ScalarClock | VectorClock;

/** 时钟规则集。所有方法接收/返回当前完整时钟状态（所有进程）。 */
export interface ClockRules {
  kind: ClockKind;
  /** 初始化时钟状态。 */
  init: () => ClockState;
  /** apply 规则（本地/发送前）。返回更新后的时钟状态。 */
  apply: (clocks: ClockState, proc: number) => ClockState;
  /** merge 规则（接收时合并发送方在发送时刻的时钟状态）。
   *  sender = 发送方进程号；other = 发送方发送时刻的完整状态（取 other[sender] 即发送方的进程时钟）。 */
  merge: (clocks: ClockState, other: ClockState, proc: number, sender: number) => ClockState;
  /** 序列化进程 p 的时钟为字符串用于展示。 */
  formatProc: (clocks: ClockState, proc: number) => string;
}

/** Lamport 标量时钟规则：clocks = number[]（每进程一个标量）。 */
export function scalarRules(nProc: number): ClockRules {
  return {
    kind: 'scalar',
    init: () => new Array<number>(nProc).fill(0),
    apply: (clocks, p) => {
      const c = clocks as ScalarClock;
      const next = [...c];
      next[p] = next[p]! + 1;
      return next;
    },
    merge: (clocks, other, p, sender) => {
      const c = clocks as ScalarClock;
      const o = other as ScalarClock;
      const next = [...c];
      // 接收方取 max(自己, 发送方标量)
      next[p] = Math.max(c[p]!, o[sender]!);
      return next;
    },
    formatProc: (clocks, p) => {
      const c = clocks as ScalarClock;
      return String(c[p]);
    },
  };
}

/** 向量时钟规则：clocks = number[][]（每进程一个向量）。 */
export function vectorRules(nProc: number): ClockRules {
  return {
    kind: 'vector',
    init: () => Array.from({ length: nProc }, () => new Array<number>(nProc).fill(0)),
    apply: (clocks, p) => {
      const vecs = clocks as VectorClock;
      const next = vecs.map((v) => [...v]);
      next[p]![p] = next[p]![p]! + 1;
      return next;
    },
    merge: (clocks, other, p, sender) => {
      const vecs = clocks as VectorClock;
      const o = other as VectorClock;
      const next = vecs.map((v) => [...v]);
      // 接收方向量与发送方在发送时刻的向量逐维取 max
      const senderVec = o[sender]!;
      for (let i = 0; i < next[p]!.length; i++) {
        next[p]![i] = Math.max(next[p]![i]!, senderVec[i]!);
      }
      return next;
    },
    formatProc: (clocks, p) => {
      const vecs = clocks as VectorClock;
      return `[${vecs[p]!.join(',')}]`;
    },
  };
}

export type LCEventType = 'local' | 'send' | 'receive';

export interface LCEvent {
  proc: number;
  type: LCEventType;
  msgId?: string;
}

export interface LCHooks {
  onEvent?: (proc: number, type: LCEventType, clocks: ClockState, msgId?: string) => void;
}

export interface LCResult {
  clocks: ClockState;
  log: Array<{ event: LCEvent; clocks: ClockState }>;
}

/** 深拷贝时钟状态。 */
function cloneClock(c: ClockState): ClockState {
  if (Array.isArray(c) && c.length > 0 && Array.isArray(c[0])) {
    return (c as VectorClock).map((v) => [...v]);
  }
  return [...(c as ScalarClock)];
}

/**
 * 用给定规则驱动逻辑时钟。
 */
export function runClock(rules: ClockRules, events: LCEvent[], hooks: LCHooks = {}): LCResult {
  let clocks: ClockState = rules.init();
  const sentClocks = new Map<string, { state: ClockState; sender: number }>();
  const log: Array<{ event: LCEvent; clocks: ClockState }> = [];

  for (const ev of events) {
    const p = ev.proc;
    if (ev.type === 'local') {
      clocks = rules.apply(clocks, p);
      hooks.onEvent?.(p, 'local', clocks);
      log.push({ event: ev, clocks: cloneClock(clocks) });
    } else if (ev.type === 'send') {
      clocks = rules.apply(clocks, p);
      sentClocks.set(ev.msgId!, { state: cloneClock(clocks), sender: p });
      hooks.onEvent?.(p, 'send', clocks, ev.msgId);
      log.push({ event: ev, clocks: cloneClock(clocks) });
    } else {
      const m = sentClocks.get(ev.msgId!) ?? { state: rules.init(), sender: 0 };
      clocks = rules.merge(clocks, m.state, p, m.sender);
      clocks = rules.apply(clocks, p);
      hooks.onEvent?.(p, 'receive', clocks, ev.msgId);
      log.push({ event: ev, clocks: cloneClock(clocks) });
    }
  }

  return { clocks, log };
}

/** 类型守卫：是否为向量时钟。 */
export function isVectorClock(c: ClockState): c is VectorClock {
  return Array.isArray(c) && c.length > 0 && Array.isArray(c[0]);
}

/** 取进程 p 的标量值（仅 scalar）。 */
export function scalarValue(c: ClockState, p: number): number {
  return (c as ScalarClock)[p]!;
}

/** 取进程 p 的向量（仅 vector）。 */
export function vectorValue(c: ClockState, p: number): number[] {
  return (c as VectorClock)[p]!;
}
