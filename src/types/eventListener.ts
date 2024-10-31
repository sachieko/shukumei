import { ClientEvents } from "discord.js";

export default interface EventListener<T extends keyof ClientEvents> {
  name: T;
  once?: boolean;
  execute: (...args: ClientEvents[T]) => Promise<unknown>
}

export const createEventListener = <T extends keyof ClientEvents>(event: EventListener<T>) => event
