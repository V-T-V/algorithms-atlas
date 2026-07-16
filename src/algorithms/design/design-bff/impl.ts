// BFF · 实现
export interface BffHooks {
  onFetch?: (service: string) => void;
  onAggregate?: (shape: string) => void;
}
export type ServiceFetcher = (service: string, params: Record<string, unknown>) => Promise<unknown>;
export class Bff {
  constructor(
    private fetcher: ServiceFetcher,
    private hooks: BffHooks = {},
  ) {}
  // Web 前端视图：聚合 user + orders + recommendations
  async webView(userId: string): Promise<Record<string, unknown>> {
    this.hooks.onFetch?.('user');
    const user = await this.fetcher('user', { id: userId });
    this.hooks.onFetch?.('orders');
    const orders = await this.fetcher('orders', { userId });
    this.hooks.onFetch?.('recs');
    const recs = await this.fetcher('recommendations', { userId });
    const shape = {
      user,
      orderCount: Array.isArray(orders) ? orders.length : 0,
      topRecs: Array.isArray(recs) ? recs.slice(0, 3) : [],
    };
    this.hooks.onAggregate?.('web');
    return shape;
  }
  // Mobile 前端视图：更精简
  async mobileView(userId: string): Promise<Record<string, unknown>> {
    this.hooks.onFetch?.('user');
    const user = await this.fetcher('user', { id: userId });
    const shape = { name: (user as { name?: string })?.name, hasData: !!user };
    this.hooks.onAggregate?.('mobile');
    return shape;
  }
}
