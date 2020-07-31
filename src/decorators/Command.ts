import { Reflection } from "../../deps.ts";
import { Constants } from "../Constants.ts";
import { CommandMeta } from "../structures/metadata/CommandMeta.ts";

const Ref = Reflection as any;

export const Command = (name: string, meta?: Partial<CommandMeta>) : ClassDecorator => {
	return (target: Function) => {
		Ref.defineMetadata(Constants.REFLECT_KEY, {
			name,
			...meta
		} as CommandMeta, target);
	};
}