import { DiscordClient } from "../mod.ts";
import { TestCommand } from "./commands/test.ts";

const bot = new DiscordClient("TOKEN", {
	commands: [TestCommand],
	prefix: "d!"
});

await bot.start();