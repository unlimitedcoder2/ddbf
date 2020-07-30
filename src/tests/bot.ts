import { DiscordClient, Inject, Command, CommandExecutor, Container, Logger, ColourConsoleTransport, Message, SuccessfulParsedMessage } from "../../mod.ts";

//TODO: Remove this or regenerate it //DONE. I removed it (thanks to DebitCardz)
const token = "";

class Test {
	constructor(public msg: string) {}
}

const container = new Container();
container.add(Test, new Test("Hello, World!"));

const logger = new Logger();

logger.addTransport(new ColourConsoleTransport());

@Command("test", {description: "Test command"})
class TestCommand implements CommandExecutor {
	constructor(@Inject(Test) private test: Test) {}

	async execute(bot: DiscordClient, message: Message, parsed: SuccessfulParsedMessage) {
		bot.client.createMessage(message.channel.id, this.test.msg);
	}
}

@Command("print", {description: "Print command", permissions: ["ADMINISTRATOR"]})
class PrintCommand implements CommandExecutor {
	async execute(bot: DiscordClient, message: Message, parsed: SuccessfulParsedMessage) {
		bot.client.createMessage(message.channel.id, parsed.arguments.join(" "));
	}
}

const bot = new DiscordClient(token,{
	commands: [TestCommand, PrintCommand],
	logger,
	container,
	prefix: "d!"
});

logger.info("Starting!");
bot.start();