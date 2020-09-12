import { DiscordClient, Inject, Command, CommandExecutor, Container, Logger, ColourConsoleTransport, Message, SuccessfulParsedMessage } from "../../mod.ts";

//TODO: Remove this or regenerate it //DONE. I removed it (thanks to DebitCardz)
//Even if the token was regenerated it'd still be best to remove it completely. - DebitCardz
const token = "TOKEN";

const logger = new Logger();

logger.addTransport(new ColourConsoleTransport());

@Command("test", {description: "Test command"})
class TestCommand implements CommandExecutor {
	async execute(bot: DiscordClient, message: Message, parsed: SuccessfulParsedMessage) {
		message.channel.createMessage("Tested!");
	}
}

const bot = new DiscordClient(token,{
	commands: [TestCommand],
	logger,
	prefix: "d!"
});

logger.info("Starting!");
await bot.start();
