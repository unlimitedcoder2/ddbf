import { Client, Logger, parse, SuccessfulParsedMessage, Message, Container, Newable } from "../deps.ts";
import { Reflection } from "../deps.ts";
import { Constants } from "./Constants.ts";
import { CommandMeta } from "./metadata/CommandMeta.ts";
import { CommandExecutor } from "./decorators/Command.ts";

const Ref = Reflection as any;

export interface DiscordClientOptions {
	commands: Newable<CommandExecutor>[];
	events?: Newable<CommandExecutor>;
	container?: Container;
	logger?: Logger;
	prefix: string;
}

export class DiscordClient {
	public client: Client
	public options: DiscordClientOptions;
	public container: Container;
	private readonly logger: Logger;
	private commands: Map<CommandMeta, CommandExecutor>;

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
				const command = findCommand(this.commands, parsed);
				
				if(command) {
					if(command.permissions) {
						checkPerms(this.client, message);
					}
					const executor = this.commands.get(command)!;
					executor.execute(this, message, parsed);
				}
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


	public start() {
		this.client.connect();
	}
}

const findCommand = (commands: Map<CommandMeta, CommandExecutor>, parsed: SuccessfulParsedMessage) : CommandMeta | undefined => {
	for(let commandMeta of commands.keys()) {
		if(commandMeta.name == parsed.command || (
			commandMeta.aliases && 
			commandMeta.aliases.length > 0 &&
			commandMeta.aliases.includes(parsed.command)
			)) return commandMeta;
	}
};

const checkPerms = (bot: Client, message: Message): boolean => {
	const guildId = bot.channelGuildIDs.get(message.channel.id)!;
	const guild = bot.guilds.get(guildId)!;

	const roles = guild.roles;
	const member = guild.members.get(message.author.id);
	
	


	return true;
};