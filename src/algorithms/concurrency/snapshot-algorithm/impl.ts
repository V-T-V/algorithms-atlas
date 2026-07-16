// =============================================================================
// 分布式快照（Chandy-Lamport）· 纯算法实现
// 拓扑：n 个进程，有向通道用 edges: Array<[from,to]>。
// 模拟步骤序列：发 marker 或发普通消息。
//   processState[i] = 进程 i 是否已记录自身状态
//   channelState[(from,to)] = 自首个 marker 之后该通道上收到的消息列表（即通道快照）
//   markerReceived[(from,to)][to] = 进程 to 是否已在通道 (from,to) 上收到过 marker
// =============================================================================

/** 步骤事件。 */
export interface SnapshotStep {
  /** 'marker' 发 marker；'message' 发普通消息。 */
  type: 'marker' | 'message';
  from: number;
  to: number;
  /** message 的内容（marker 不用）。 */
  payload?: number;
}

/** 事件钩子。 */
export interface SnapshotHooks {
  /** 进程 p 记录自身状态。 */
  onRecordState?: (p: number) => void;
  /** marker 从 from 流向 to。 */
  onMarker?: (from: number, to: number) => void;
  /** 普通消息从 from 流向 to；recordedIntoChannel 表示它被记入通道快照。 */
  onMessage?: (from: number, to: number, payload: number, recordedIntoChannel: boolean) => void;
  /** 进程 p 完成快照（所有入向通道都收到 marker）。 */
  onComplete?: (p: number) => void;
}

/** 快照状态。 */
export interface SnapshotState {
  /** 进程是否已记录自身状态。 */
  recordedProcess: boolean[];
  /** 通道是否已收到 marker。键 "from->to"。 */
  markerSeen: Map<string, boolean>;
  /** 通道快照（收到的消息）。键 "from->to"。 */
  channelState: Map<string, number[]>;
  /** 进程是否已完成。 */
  completed: boolean[];
}

/**
 * 运行 Chandy-Lamport 快照。
 * @param nProc 进程数
 * @param edges 有向通道列表
 * @param initiator 发起快照的进程
 * @param steps 模拟步骤（在快照发起后，marker 与普通消息交错）
 */
export function runSnapshot(
  nProc: number,
  edges: Array<[number, number]>,
  initiator: number,
  steps: SnapshotStep[],
  hooks: SnapshotHooks = {},
): SnapshotState {
  const recordedProcess = new Array<boolean>(nProc).fill(false);
  const completed = new Array<boolean>(nProc).fill(false);
  const markerSeen = new Map<string, boolean>();
  const channelState = new Map<string, number[]>();
  const incoming = new Map<number, Array<[number, number]>>(); // p 的入向通道列表
  for (const [f, t] of edges) {
    const key = `${f}->${t}`;
    markerSeen.set(key, false);
    channelState.set(key, []);
    if (!incoming.has(t)) incoming.set(t, []);
    incoming.get(t)!.push([f, t]);
  }

  const key = (f: number, t: number): string => `${f}->${t}`;

  // initiator 先记录自身状态并向出向通道发 marker
  const record = (p: number): void => {
    if (recordedProcess[p]) return;
    recordedProcess[p] = true;
    hooks.onRecordState?.(p);
    // 向所有出向通道发 marker
    for (const [f, t] of edges) {
      if (f === p) {
        markerSeen.set(key(f, t), markerSeen.get(key(f, t))!);
        hooks.onMarker?.(f, t);
        // 收件方处理：在 runSnapshot 中 marker 由步骤显式传入，这里只标记「已发出」
      }
    }
    checkComplete(p);
  };

  const checkComplete = (p: number): void => {
    if (completed[p]) return;
    if (!recordedProcess[p]) return;
    const ins = incoming.get(p) ?? [];
    if (ins.length === 0) {
      completed[p] = true;
      hooks.onComplete?.(p);
      return;
    }
    if (ins.every(([f, t]) => markerSeen.get(key(f, t)) === true)) {
      completed[p] = true;
      hooks.onComplete?.(p);
    }
  };

  record(initiator);

  for (const step of steps) {
    const k = key(step.from, step.to);
    if (step.type === 'marker') {
      hooks.onMarker?.(step.from, step.to);
      if (!markerSeen.get(k)) {
        // 首个 marker
        markerSeen.set(k, true);
        if (!recordedProcess[step.to]) {
          record(step.to); // 记录自身状态并广播 marker
        }
      } else {
        // 非首个 marker：通道快照已完成（消息已收集）
        markerSeen.set(k, true);
      }
      checkComplete(step.to);
    } else {
      // 普通消息
      const recorded = recordedProcess[step.to] && markerSeen.get(k);
      if (recorded) {
        channelState.get(k)!.push(step.payload!);
      }
      hooks.onMessage?.(step.from, step.to, step.payload!, !!recorded);
    }
  }

  // 若某些进程入向通道为空，在 record 后即完成
  for (let p = 0; p < nProc; p++) checkComplete(p);

  return { recordedProcess, markerSeen, channelState, completed };
}
