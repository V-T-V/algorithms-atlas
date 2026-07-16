// 环上领导者选举（Chang-Roberts）· 实现

export interface LeStep {
  initiator: number;
  current: number; // 当前持有消息的进程
  message: number; // 消息中的 id
  action: string;
  messagesSent: number;
}

export interface LeHooks {
  onForward?: (from: number, to: number, id: number) => void;
  onSwallow?: (at: number, id: number) => void;
  onElected?: (leader: number) => void;
}

/** Chang-Roberts：单向环 n 进程，发起者 initiator。 */
export function ringLeaderElection(
  ids: number[],
  initiatorIndex: number,
  hooks: LeHooks = {},
): number {
  const n = ids.length;
  let messagesSent = 0;
  const steps: LeStep[] = [];
  // 从 initiator 发送自身 id
  let currentMsg = ids[initiatorIndex]!;
  let pos = initiatorIndex;
  const startId = currentMsg;

  // 最多绕一圈回到 initiator
  for (let hop = 0; hop < n; hop++) {
    const nextPos = (pos + 1) % n;
    const nextId = ids[nextPos]!;
    messagesSent++;
    if (nextId === startId) {
      // 回到起点 -> 当选
      hooks.onElected?.(startId);
      steps.push({
        initiator: initiatorIndex,
        current: nextPos,
        message: currentMsg,
        action: 'elected',
        messagesSent,
      });
      void steps;
      return startId;
    } else if (currentMsg > nextId) {
      // 吞掉（nextId 小，不参与）
      hooks.onSwallow?.(nextPos, nextId);
      steps.push({
        initiator: initiatorIndex,
        current: nextPos,
        message: currentMsg,
        action: 'swallow',
        messagesSent,
      });
    } else {
      // nextId 更大，接管
      hooks.onForward?.(pos, nextPos, nextId);
      currentMsg = nextId;
      steps.push({
        initiator: initiatorIndex,
        current: nextPos,
        message: currentMsg,
        action: 'forward',
        messagesSent,
      });
    }
    pos = nextPos;
  }
  // 若发起者已是最大，应在此当选
  hooks.onElected?.(currentMsg);
  return currentMsg;
}
