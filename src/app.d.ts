// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
	// namespace App {
	// 	// interface Error {}
	// 	// interface Locals {}
	// 	// interface PageData {}
	// 	// interface PageState {}
	// 	// interface Platform {}
	// }
declare global {
type ServiceType = {
  id: string;
  name: string;
  url: string;
  status?: Status;
  description?:string;
  responseTime?: number;
  lastChecked?: string;
};
type Status = "ok" | "down" | "ping";

type ServiceProps = {
  name: string;
  description?:string;
  status?: Status;
  responseTime?: number;
  lastChecked?: string;
}
}

export {};
