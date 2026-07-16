export interface ShHooks {
  onConnect?: (role: string, peer: string) => void;
}
export class ServiceHandler {
  constructor(public peer: string) {}
  open(role: string, hooks: ShHooks = {}): void {
    hooks.onConnect?.(role, this.peer);
  }
}
export class Acceptor {
  private conns: ServiceHandler[] = [];
  accept(peer: string, hooks: ShHooks = {}): ServiceHandler {
    const sh = new ServiceHandler(peer);
    sh.open('server', hooks);
    this.conns.push(sh);
    return sh;
  }
}
export class Connector {
  connect(peer: string, hooks: ShHooks = {}): ServiceHandler {
    const sh = new ServiceHandler(peer);
    sh.open('client', hooks);
    return sh;
  }
}
