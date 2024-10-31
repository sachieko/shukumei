import { BaseInteraction } from "discord.js";

/**
 * Interface for creating interaction handlers by interaction type.
 * @template T The type of interaction for this handler to support.
 */
export default interface InteractionHandler<T extends BaseInteraction> {
  /**
   * Handles the given interaction. Called by `src/events/interactionCreate.ts`.
   * @param interaction the interaction to handle
   */
  handle(interaction: T): Promise<unknown>;
}
