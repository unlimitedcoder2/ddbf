import { Message, GuildMember, GuildChannel, PermissionResolvable, Permission } from "../../mod.ts";

export class PermissionUtils {
	static hasPerm(message: Message, permission: PermissionResolvable): boolean {
		const { permission_overwrites } = message.channel as GuildChannel;
		const roles = message.member!.roles;
		
		for(let [_, { permissions }] of roles) 
			if(permissions.has(permission)) return true;

		for(let [id, overwrite] of permission_overwrites) {
			if(id == message.member!.user.id || roles.has(id)) {
				const { allow } = overwrite;
				const perms = new Permission(allow);
				if(perms.has(permission)) return true;
			}
		}

		return false;
	};

	static hasPerms(message: Message, permissions: PermissionResolvable[]): boolean {
		let userPerms = new Map<PermissionResolvable, boolean>();

		for(let perm of permissions) {
			if(!perm) continue;

			const hasPerm = this.hasPerm(message, perm);

			if(hasPerm) userPerms.set(perm, true);
			else userPerms.set(perm, false);
		}

		const values = userPerms.values();
		if(Array.from(values).includes(false)) return false;
		return true;
	}
}