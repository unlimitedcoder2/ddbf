import { Reflection } from "../deps.ts";
const Ref = Reflection as any;

export interface IContainer {
	add(type: Function, value?: any): void;
	get<T>(type: Function): T;
	resolve<T>(type: Function): T;
}

export interface Newable<T> {
	new(...args: any[]): T;
}

export type InjectMeta = Map<number, Function>;

export const metaKey = "DDBF:Container";

export const Inject = (type: Function): ParameterDecorator => {
	return (target, propertyKey, parameterIndex) => {
		const meta = Ref.getMetadata(metaKey, target) || new Map<number, Function>();
		meta.set(parameterIndex, type);
		Ref.defineMetadata(metaKey, meta, target);
	};
}

export class Container implements IContainer {
	private container: Map<Function, any>;

	constructor() {
		this.container = new Map<Function, any>();
	}

	add<T>(type: Function, value?: T) {
		this.container.set(type, value);
		return value;
	}

	get<T>(type: Function) : T{
		const value = this.container.get(type);
		return value;
	}

	resolve<T>(type: Newable<T>): T {
		const meta = Ref.getMetadata(metaKey, type) as InjectMeta;
		const args = [];
		
		if(!meta) return new type();

		for(let [key, val] of meta) {
			args[key] = this.get(val);
		}
		
		return new type(...args);
	}
}