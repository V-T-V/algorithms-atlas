// 活动选择 · 实现（带名称）
export interface Activity {
  name: string;
  start: number;
  finish: number;
}
export interface ActivityHooks {
  onPick?: (act: Activity) => void;
  onSkip?: (act: Activity) => void;
  onConclude?: (count: number, chosen: Activity[]) => void;
}
export interface ActivityResult {
  count: number;
  chosen: Activity[];
}
export function greedyActivity3(
  acts: ReadonlyArray<Activity>,
  hooks: ActivityHooks = {},
): ActivityResult {
  const order = [...acts].sort((a, b) => a.finish - b.finish);
  let lastFinish = -Infinity;
  const chosen: Activity[] = [];
  for (const a of order) {
    if (a.start >= lastFinish) {
      chosen.push(a);
      lastFinish = a.finish;
      hooks.onPick?.(a);
    } else hooks.onSkip?.(a);
  }
  hooks.onConclude?.(chosen.length, chosen);
  return { count: chosen.length, chosen };
}
