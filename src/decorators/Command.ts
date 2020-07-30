import { Reflection, Message, SuccessfulParsedMessage } from "../../deps.ts";
import { Constants } from "../Constants.ts";
import { CommandMeta } from "../metadata/CommandMeta.ts";
import { DiscordClient } from "../../mod.ts";

const Ref = Reflection as any;

export const Command = (name: string, meta?: Partial<CommandMeta>) : ClassDecorator => {
	return (target: Function) => {
		Ref.defineMetadata(Constants.REFLECT_KEY, {
			name,
			...meta
		} as CommandMeta, target);
	};
}

export interface CommandExecutor {
	execute(bot: DiscordClient, message: Message, parsed: SuccessfulParsedMessage): void | Promise<void>;
}