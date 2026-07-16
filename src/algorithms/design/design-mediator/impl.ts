// 中介者模式 · 实现
export interface MediatorHooks {
  onSend?: (from: string, to: string | null, message: string, delivered: number) => void;
  onJoin?: (user: string, total: number) => void;
  onLeave?: (user: string, total: number) => void;
}

export interface ChatMediator {
  broadcast(from: string, message: string): void;
  send(from: string, to: string, message: string): void;
  register(u: ChatUser): void;
  unregister(u: ChatUser): void;
}

export class ChatUser {
  public inbox: Array<{ from: string; message: string }> = [];
  constructor(
    public readonly name: string,
    private readonly mediator: ChatMediator,
  ) {
    mediator.register(this);
  }
  send(message: string): void {
    this.mediator.broadcast(this.name, message);
  }
  sendTo(to: string, message: string): void {
    this.mediator.send(this.name, to, message);
  }
  receive(from: string, message: string): void {
    this.inbox.push({ from, message });
  }
  leave(): void {
    this.mediator.unregister(this);
  }
}

export class ChatRoom implements ChatMediator {
  private users = new Map<string, ChatUser>();
  private readonly hooks: MediatorHooks;
  constructor(hooks: MediatorHooks = {}) {
    this.hooks = hooks;
  }

  register(u: ChatUser): void {
    this.users.set(u.name, u);
    this.hooks.onJoin?.(u.name, this.users.size);
  }
  unregister(u: ChatUser): void {
    this.users.delete(u.name);
    this.hooks.onLeave?.(u.name, this.users.size);
  }

  broadcast(from: string, message: string): void {
    let delivered = 0;
    for (const [name, user] of this.users) {
      if (name !== from) {
        user.receive(from, message);
        delivered++;
      }
    }
    this.hooks.onSend?.(from, null, message, delivered);
  }

  send(from: string, to: string, message: string): void {
    const target = this.users.get(to);
    if (target) {
      target.receive(from, message);
      this.hooks.onSend?.(from, to, message, 1);
    } else this.hooks.onSend?.(from, to, message, 0);
  }
}
