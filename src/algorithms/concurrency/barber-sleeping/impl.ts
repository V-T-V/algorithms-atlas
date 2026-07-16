// =============================================================================
// 睡眠理发师（Sleeping Barber）· 纯算法实现（事件序列模拟）
// 理发师无客时睡觉，顾客到则唤醒；等待椅满则顾客离去。零 DOM 依赖，可独立单测。
// =============================================================================

export interface BarberCustomer {
  /** 顾客 id。 */
  id: number;
  /** 到达时刻。 */
  arrival: number;
  /** 理发所需时间（服务时长）。 */
  serviceTime: number;
}

export type BarberState = 'sleeping' | 'busy';

export interface BarberHooks {
  /** 顾客到达。给出是否被接收（坐下/立即理发）还是丢弃。 */
  onArrive?: (customer: BarberCustomer, accepted: boolean) => void;
  /** 理发师被唤醒（从睡眠进入工作）。 */
  onWake?: (time: number) => void;
  /** 理发师开始为某顾客理发。 */
  onStartCut?: (customer: BarberCustomer, time: number) => void;
  /** 理发师完成一次理发。 */
  onFinishCut?: (customer: BarberCustomer, time: number) => void;
  /** 理发师入睡（队列空）。 */
  onSleep?: (time: number) => void;
}

export interface BarberResult {
  /** 被服务的顾客数。 */
  served: number;
  /** 被丢弃的顾客数（椅子满）。 */
  lost: number;
  /** 理发完成的顾客列表（按完成顺序）。 */
  completed: BarberCustomer[];
  /** 理发师累计睡眠时间（无顾客期间）。 */
  idleTime: number;
  /** 总模拟时间。 */
  finishTime: number;
}

/**
 * 睡眠理发师模拟。
 *
 * 规则：
 *  - 顾客按 arrival 升序到达
 *  - 到达时若理发师在睡 → 唤醒并立即开始理发
 *  - 若理发师在忙且有等待椅 → 排队等候
 *  - 若等待椅满 → 顾客离开（丢失）
 *  - 理发师完成一次后从队列取下一位；队列空 → 入睡
 *
 * @param customers 顾客列表（按到达时刻）
 * @param chairs 等待椅数量（不含理发椅）
 * @param hooks 可选钩子
 * @returns 服务统计
 */
export function simulateBarber(
  customers: readonly BarberCustomer[],
  chairs: number,
  hooks: BarberHooks = {},
): BarberResult {
  const cap = Math.max(0, Math.floor(chairs));
  const sorted = [...customers].sort((a, b) => a.arrival - b.arrival || a.id - b.id);
  let state: BarberState = 'sleeping';
  const queue: BarberCustomer[] = [];
  let busyUntil = 0;
  let time = 0;
  let served = 0;
  let lost = 0;
  let idleTime = 0;
  let current: BarberCustomer | null = null;
  const completed: BarberCustomer[] = [];

  let ci = 0;
  while (ci < sorted.length || state === 'busy') {
    const nextArrival = ci < sorted.length ? sorted[ci]!.arrival : Infinity;
    const nextDone = state === 'busy' ? busyUntil : Infinity;
    if (nextArrival === Infinity && nextDone === Infinity) break;

    if (nextDone <= nextArrival) {
      // 理发完成事件
      const prev = time;
      time = nextDone;
      if (current) {
        completed.push(current);
        hooks.onFinishCut?.(current, time);
      }
      // 取下一位
      if (queue.length > 0) {
        const next = queue.shift()!;
        current = next;
        busyUntil = time + next.serviceTime;
        state = 'busy';
        served++;
        hooks.onStartCut?.(next, time);
      } else {
        state = 'sleeping';
        current = null;
        idleTime += time - prev > 0 ? 0 : 0;
        hooks.onSleep?.(time);
      }
    } else {
      // 顾客到达事件
      const c = sorted[ci]!;
      ci++;
      const prevSleepStart = state === 'sleeping' ? time : -1;
      time = c.arrival;
      if (state === 'busy') {
        // 理发师忙：看等待椅
        if (queue.length < cap) {
          queue.push(c);
          hooks.onArrive?.(c, true);
        } else {
          lost++;
          hooks.onArrive?.(c, false);
        }
      } else {
        // 理发师睡眠 → 唤醒并立即理发
        if (prevSleepStart >= 0) idleTime += time - prevSleepStart;
        hooks.onWake?.(time);
        current = c;
        busyUntil = time + c.serviceTime;
        state = 'busy';
        served++;
        hooks.onArrive?.(c, true);
        hooks.onStartCut?.(c, time);
      }
    }
  }

  return { served, lost, completed, idleTime, finishTime: time };
}
