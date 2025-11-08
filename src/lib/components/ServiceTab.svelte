<script lang="ts">
  import { onMount } from 'svelte';
  

  let listServices = $state<ServiceProps[]>([]);
  let loading = true;

  onMount(async () => {
    const res = await fetch('/services');
    listServices = await res.json();
    loading = false;
  });
  function getStatusColor(status: Status): string {
  switch (status) {
    case "ok":
      return "bg-success-500"; 
    case "down":
      return "bg-error-500";  
    case "ping":
      return "bg-warning-500"; 
    default:
      return "bg-surface-500";  
  }
}

</script>

<div class="overflow-x-auto rounded-xl border border-surface-250">
  <table class="min-w-full text-left text-xs sm:text-sm lg:text-base text-surface-700">
    <thead class="bg-primary-500 text-surface-900 uppercase text-xs sm:text-sm">
      <tr>
        <th class="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">Service</th>
        <th class="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 hidden sm:table-cell">Description</th>
        <th class="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">State</th>
        <th class="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">Last Check</th>
        <th class="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">Ping</th>
      </tr>
    </thead>
    <tbody class="border-t border-surface-200 text-surface-100">
      {#each listServices as service}
        <tr class="border-t border-surface-200 ">
          <td class="px-2 sm:px-4 lg:px-6 py-2 font-medium">{service.name}</td>
          <td class="px-2 sm:px-4 lg:px-6 py-2 hidden sm:table-cell">
            {service.description}
          </td>
          <td class="px-2 sm:px-4 lg:px-6 py-2">
            <span class="flex items-center gap-1 sm:gap-2">
              <span
                class={`inline-block w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full ${getStatusColor(service.status ?? "unknown")}`}
              ></span>
              <span class="hidden sm:inline capitalize">{service.status}</span>
            </span>
          </td>
   <td class="px-2 sm:px-4 lg:px-6 py-2  border-l border-surface-200">
  {#if service.lastChecked}
    <span class="sm:hidden">{service.lastChecked.split('T')[0]}</span>
    <span class="hidden sm:inline">{service.lastChecked}</span>
  {:else}
    <span class="text-surface-400">N/A</span>
  {/if}
</td>
<td class="px-2 sm:px-4 lg:px-6 py-2">
  <span class="font-mono text-xs sm:text-sm">{service.responseTime}</span>
</td>

        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
</style>
