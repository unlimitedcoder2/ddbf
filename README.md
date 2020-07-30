# Epic beautiful framework for the great discord platform which is amazing

```ts
import { DiscordClient, Command, CommandExecutor } from "https://raw.githubusercontent.com/unlimitedcoder2/ddbf/master/mod.ts";

@Command("test", {description: "Test command"})
class TestCommand implements CommandExecutor {
	async execute(bot: DiscordClient, message: Message, parsed: SuccessfulParsedMessage) {
		bot.client.createMessage(message.channel.id, "Tested!");
	}
}

const bot = new DiscordClient("100000% a real token", {
	commands : [TestCommand]
});

bot.start();
```