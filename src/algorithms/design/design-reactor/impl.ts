export type EventHandler = (fd: number, data: string) => void;
export class Reactor {
  private handlers = new Map<number, EventHandler>();
  register(fd: number, h: EventHandler): void {
    this.handlers.set(fd, h);
  }
  fire(
    events: Array<{ fd: number; data: string }>,
    hooks: { onEvent?: (fd: number) => void } = {},
  ): void {
    for (const e of events) {
      const h = this.handlers.get(e.fd);
      hooks.onEvent?.(e.fd);
      h?.(e.fd, e.data);
    }
  }
}
