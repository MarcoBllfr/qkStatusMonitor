<script lang="ts">
	export let name: string;
	export let role: string;
	export let avatar: string;
	export let bio: string;
</script>


<div
	class="card flex flex-col items-center text-center gap-4 p-4 sm:flex-row sm:text-left sm:gap-6 sm:p-6"
>
	
	<img
		src={avatar}
		alt={name}
		class="w-24 h-24 rounded-full object-cover sm:w-32 sm:h-32"
	/>


	<div class="flex flex-col justify-center">
		<h2 class="text-xl font-bold text-surface-200 sm:text-2xl">{name}</h2>
		<p class="text-sm text-surface-400 sm:text-base">{role}</p>
		<p class="mt-2 text-surface-400">{bio}</p>

	
		<div class="mt-4 flex gap-2 justify-center sm:justify-start">
			<button class="btn btn-sm variant-filled-primary">Contatta</button>
			<button class="btn btn-sm variant-outline">Profilo</button>
		</div>
     
	</div>
</div>
