export type Service = (req: string) => string;
export class Broker {
  private services = new Map<string, Service>();
  register(name: string, s: Service): void {
    this.services.set(name, s);
  }
  call(
    name: string,
    req: string,
    hooks: { onCall?: (n: string, resp: string) => void } = {},
  ): string {
    const s = this.services.get(name);
    const resp = s ? s(req) : 'unknown';
    hooks.onCall?.(name, resp);
    return resp;
  }
}
