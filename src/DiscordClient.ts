import {
	Client,
	Logger,
	parse,
	SuccessfulParsedMessage,
	Message,
	Container,
	Newable
} from "../deps.ts";

import {
	CommandUtils,
	CommandExecutor,
	CommandMeta,
	Constants,
	Reflection,
	DMChannel
} from "../mod.ts";

import { PermissionUtils } from "./utils/PermissionUtils.ts";

const Ref = Reflection as any;

/**
 * Options for the discord client
 */
export interface DiscordClientOptions {
	commands: Newable<CommandExecutor>[];
	events?: Newable<CommandExecutor>;
	container?: Container;
	logger?: Logger;
	prefix: string;
}

/**
 * Discord Client
 */
export class DiscordClient {
	public client: Client
	public options: DiscordClientOptions;
	public container: Container;
	private readonly logger: Logger;
	private commands: Map<CommandMeta, CommandExecutor>;
	
	/**
	 * Discord Client
	 * ```ts
	 * \@Command("test")
	 * class TestCommand implements CommandExecutor {
	 *   async execute(bot, message, parsedMessage) {
	 *     message.channel.createMessage("Tested!");
	 *   }
	 * }
	 * 
	 * const bot = new DiscordClient("token", {
	 *   commands: [TestCommand],
	 *   prefix: "d!"
	 * });
	 *  
	 * bot.start();
	 * ```
	 */

	constructor(
		token: string,
		options: DiscordClientOptions
	) {

		this.client = new Client(token);
		this.options = options;
		this.container = options.container || new Container();
		this.logger = options.logger || new Logger();
		this.commands = new Map<CommandMeta, CommandExecutor>();

		this.setupCommands();
		this.setupEvents();
	}

	private setupEvents() {
		this.client.events.messageCreate.on(async ({ message }) => {
			if(message.author.bot || !message.content.startsWith(this.options.prefix)) return;

			let parsed = parse(message, this.options.prefix, {"allowSelf": true});

			if(parsed.success) {
				parsed = parsed as SuccessfulParsedMessage;
				const command = CommandUtils.findCommand(this.commands, parsed);
				if(!command) return;

				if(
					command.permissions && // Check if the command has permissions set
					message.member && // Make sure that the member object exists
					!(message.channel instanceof DMChannel) && // Make sure it is not dms
					!PermissionUtils.hasPerms(message, command.permissions) // check that the user has the permissions
				) return;

				const executor = this.commands.get(command)!;
				executor.execute(this, message, parsed);
			}
		});
	}

	private setupCommands() {
		for(let command of this.options.commands) {			
			const meta = Ref.getMetadata(Constants.REFLECT_KEY, command) as CommandMeta;
			if(!meta || !meta.name) {
				this.logger.warn("Class without @Command decorator was passed");
				continue;
			}
			
			const executor = this.container.resolve(command) as CommandExecutor;
			this.commands.set(meta, executor);
		}
	}

	/**
	 * Starts the bot
	 * ```ts
	 * await bot.start();
	 * ```
	 */
	public async start() {
		return this.client.gateway.connect();
	}
}