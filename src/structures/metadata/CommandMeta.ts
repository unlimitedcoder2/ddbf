import { PermissionResolvable } from "../../../mod.ts";

export interface CommandMeta {
	name: string;
	description?: string;
	aliases?: string[];
	permissions?: PermissionResolvable[];
	category?: string;
}