// 健康检查 · 实现
export type HealthStatus = 'UP' | 'DOWN';
export interface ProbeResult {
  name: string;
  status: HealthStatus;
  latencyMs: number;
  detail?: string;
}
export interface AggregateHealth {
  overall: 'UP' | 'DEGRADED' | 'DOWN';
  checks: ProbeResult[];
}
export interface HealthHooks {
  onProbe?: (name: string, status: HealthStatus) => void;
  onAggregate?: (overall: string) => void;
}
export interface Probe {
  name: string;
  check: () => Promise<{ ok: boolean; detail?: string }>;
}
export class HealthChecker {
  constructor(
    private probes: Probe[] = [],
    private hooks: HealthHooks = {},
  ) {}
  add(p: Probe): void {
    this.probes.push(p);
  }
  async check(): Promise<AggregateHealth> {
    const results: ProbeResult[] = [];
    for (const p of this.probes) {
      const t0 = Date.now();
      try {
        const r = await p.check();
        const status: HealthStatus = r.ok ? 'UP' : 'DOWN';
        results.push({ name: p.name, status, latencyMs: Date.now() - t0, detail: r.detail });
        this.hooks.onProbe?.(p.name, status);
      } catch {
        results.push({ name: p.name, status: 'DOWN', latencyMs: Date.now() - t0 });
        this.hooks.onProbe?.(p.name, 'DOWN');
      }
    }
    const down = results.filter((r) => r.status === 'DOWN').length;
    const overall = down === 0 ? 'UP' : down === results.length ? 'DOWN' : 'DEGRADED';
    this.hooks.onAggregate?.(overall);
    return { overall, checks: results };
  }
}
