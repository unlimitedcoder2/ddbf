import { CommandExecutor, Command, DiscordClient, Message, SuccessfulParsedMessage } from "../../mod.ts";

@Command("test", {description: "A simple test command"})
export class TestCommand implements CommandExecutor {
	async execute(bot: DiscordClient, message: Message, parsed: SuccessfulParsedMessage) {
		message.channel.createMessage("Tested!");
	}
}