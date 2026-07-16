// =============================================================================
// 环上领导者选举（LCR）· 纯算法实现
// 单向环：进程 i 的右邻居是 (i+1) mod n。
// 每轮：每个进程把「当前持有的最大候选 id」发给右邻居；
//       收到来自左邻居的 id 时按 LCR 规则处理（更大转发、更小吞并、相等当选）。
// =============================================================================

/** 事件钩子。 */
export interface LeaderElectionHooks {
  /** 进程 i 转发候选 c 给右邻居。 */
  onSend?: (from: number, to: number, candidate: number) => void;
  /** 进程 i 吞并来自左邻居的候选 c（c < 自己最大候选）。 */
  onSwallow?: (proc: number, candidate: number) => void;
  /** 进程 i 当选领导者。 */
  onElect?: (proc: number, id: number) => void;
  /** 进程 i 得知领导者是 leader（通过 elected 消息）。 */
  onLearnLeader?: (proc: number, leader: number) => void;
}

/** 选举结果。 */
export interface ElectionResult {
  leader: number; // 领导者在 ids 中的索引
  leaderId: number;
  /** 每个进程最终知晓的领导者索引。 */
  knownLeader: number[];
  /** 总消息数（含 elected 广播）。 */
  messageCount: number;
}

/**
 * 在 id 数组表示的环上运行 LCR。
 * @param ids 各进程的唯一 id
 * @returns 选举结果
 */
export function electLeader(ids: number[], hooks: LeaderElectionHooks = {}): ElectionResult {
  const n = ids.length;
  if (n === 0) throw new RangeError('empty ring');
  const knownLeader = new Array<number>(n).fill(-1);
  let leader = -1;
  let leaderId = -1;
  let messageCount = 0;

  // 每个进程「最近收到/持有的待转发候选」，初始为自己的 id
  const pending = [...ids];
  const active = new Array<boolean>(n).fill(true);

  // 最多 n 轮（最大 id 绕一圈回到自己）
  for (let round = 0; round < n && leader === -1; round++) {
    const sends: Array<{ from: number; to: number; c: number }> = [];
    for (let i = 0; i < n; i++) {
      if (active[i] && pending[i] !== -1) {
        const to = (i + 1) % n;
        sends.push({ from: i, to, c: pending[i]! });
        pending[i] = -1; // 清空待发送
      }
    }
    // 处理收到的候选
    const newPending = new Array<number>(n).fill(-1);
    for (const { from, to, c } of sends) {
      messageCount++;
      hooks.onSend?.(from, to, c);
      if (!active[to]) continue;
      if (c > ids[to]!) {
        // 转发（更大者）
        if (newPending[to]! < c) newPending[to] = c;
      } else if (c < ids[to]!) {
        // 吞并
        hooks.onSwallow?.(to, c);
      } else {
        // c === ids[to]：最大者绕回，当选
        leader = to;
        leaderId = c;
        active[to] = true;
        hooks.onElect?.(to, c);
      }
    }
    for (let i = 0; i < n; i++) {
      if (newPending[i]! > pending[i]!) pending[i] = newPending[i]!;
    }
  }

  // 若只有一个进程或某种退化，确保 leader 已定
  if (leader === -1) {
    // 最大 id 即 leader
    let maxIdx = 0;
    for (let i = 1; i < n; i++) if (ids[i]! > ids[maxIdx]!) maxIdx = i;
    leader = maxIdx;
    leaderId = ids[maxIdx]!;
    hooks.onElect?.(leader, leaderId);
  }

  // 广播 elected：绕一圈
  knownLeader[leader] = leader;
  hooks.onLearnLeader?.(leader, leader);
  let cur = leader;
  for (let step = 0; step < n - 1; step++) {
    const next = (cur + 1) % n;
    messageCount++;
    knownLeader[next] = leader;
    hooks.onLearnLeader?.(next, leader);
    cur = next;
  }

  return { leader, leaderId, knownLeader, messageCount };
}
