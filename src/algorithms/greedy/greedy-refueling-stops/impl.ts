// =============================================================================
// 加油站停靠（最少次数）· 纯算法实现 (LeetCode 871)
// target 终点距离，startFuel 初始油量，stations[i]=[位置, 油量]。
// =============================================================================
export interface GreedyRefuelingStopsHooks {
  onPassStation?: (stationIndex: number, position: number, fuel: number) => void;
  onRefuel?: (stationIndex: number, fuelAdded: number, tank: number) => void;
  onConclude?: (stops: number) => void;
}

export function greedyRefuelingStops(
  target: number,
  startFuel: number,
  stations: ReadonlyArray<readonly [number, number]>,
  hooks: GreedyRefuelingStopsHooks = {},
): number {
  let tank = startFuel;
  let stops = 0;
  const prev = 0;
  // 最大堆（用数组模拟，每次取最大）
  const heap: Array<[number, number]> = []; // [fuel, stationIndex]
  const pushFuel = (fuel: number, idx: number): void => {
    heap.push([fuel, idx]);
    heap.sort((a, b) => b[0] - a[0]);
  };
  const popMax = (): [number, number] => heap.shift()!;

  let i = 0;
  const n = stations.length;
  while (tank < target) {
    // 把所有能到达的加油站加入堆
    while (i < n && stations[i]![0]! <= tank) {
      hooks.onPassStation?.(i, stations[i]![0]!, stations[i]![1]!);
      pushFuel(stations[i]![1]!, i);
      i++;
    }
    if (heap.length === 0) {
      hooks.onConclude?.(-1);
      return -1; // 无法到达
    }
    const [added, idx] = popMax();
    tank += added;
    stops++;
    hooks.onRefuel?.(idx, added, tank);
    void prev;
  }
  hooks.onConclude?.(stops);
  return stops;
}
