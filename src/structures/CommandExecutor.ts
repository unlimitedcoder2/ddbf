import { DiscordClient, Message, SuccessfulParsedMessage } from "../../mod.ts";

export interface CommandExecutor {
	execute(bot: DiscordClient, message: Message, parsed: SuccessfulParsedMessage): void | Promise<void>;
}