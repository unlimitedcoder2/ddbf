import {
	CommandMeta,
	CommandExecutor,
	SuccessfulParsedMessage
} from "../../mod.ts";

export class CommandUtils {
	static findCommand(commands: Map<CommandMeta, CommandExecutor>, parsed: SuccessfulParsedMessage): CommandMeta | undefined {
		for(let commandMeta of commands.keys()) {
			if(commandMeta.name == parsed.command || (
				commandMeta.aliases && 
				commandMeta.aliases.length > 0 &&
				commandMeta.aliases.includes(parsed.command)
			)) return commandMeta;
		}
	};
	
}