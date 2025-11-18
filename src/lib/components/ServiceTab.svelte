<script lang="ts">
  import { onMount } from 'svelte';
  import { Slider } from '@skeletonlabs/skeleton-svelte';
  
  let listServices = $state<ServiceProps[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let timer = $state(60000) // 60s
  let timerSeconds = $state(60);
  let data = $state()

  async function fetchServices() {
    loading = true;
    error = null;
   data=new Date().toLocaleTimeString('it-IT');
    try {
      const res = await fetch('/services');
      if (!res.ok) throw new Error('Errore nel caricamento dei servizi');
      listServices = await res.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Errore sconosciuto';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchServices();
    
  });

$effect(() => {
  timer = timerSeconds * 1000;
  const interval = setInterval(fetchServices, timer);
    return () => clearInterval(interval);
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

  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatPing(ms: number | undefined): string {
    if (ms === undefined) return 'N/A';
    if (ms < 100) return `${ms}ms`;
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }
</script>

  {#snippet Loading()}
    <td colspan="5" class="text-center">
        <div class="placeholder animate-pulse">
          <span class="text-surface-400">Caricamento servizi...</span>
        </div>
    </td>
{/snippet}

<div class="w-full max-w-6xl mx-auto space-y-4">
  <div class="flex justify-between items-center">
    <h2 class="h2 text-surface-100">Status Servizi</h2>
    <button 
      onclick={fetchServices} 
      disabled={loading}
      class="btn variant-filled-primary btn-sm"
    >
      {loading ? 'Caricamento...' : 'Aggiorna'}
    </button>
  </div>
  <div class="space-y-2 mt-4">
  <p >Aggiornamento automatico: {timer / 1000}s</p>
 
<Slider 
  defaultValue={[60]}
  max={60}
  min={5}
  step={5}
>
	<Slider.Control>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>

		<Slider.Thumb index={0}>
			<Slider.HiddenInput 
				oninput={(e: Event) => {
    const input = e.target as HTMLInputElement;
    timerSeconds = Number(input.value);
}}
			/>
		</Slider.Thumb>
	</Slider.Control>

	<Slider.MarkerGroup>
		<Slider.Marker value={5} />
		<Slider.Marker value={15} />
		<Slider.Marker value={30} />
		<Slider.Marker value={45} />
		<Slider.Marker value={60} />
	</Slider.MarkerGroup>
</Slider>
</div>

  {#if error}
    <aside class="alert variant-filled-error">
      <div class="alert-message">
        <p>{error}</p>
      </div>
    </aside>
  {/if}

  <div class="table-container">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Service</th>
          <th class="hidden sm:table-cell">Description</th>
          <th>State</th>
          <th>Last Check</th>
          <th>Ping</th>
        </tr>
      </thead>
      <tbody>
        {#if loading && listServices.length === 0}
          <tr>
           {@render Loading()}
          </tr>
        {:else if listServices.length === 0}
          <tr>
            <td colspan="5" class="text-center text-surface-400">
              Nessun servizio configurato
            </td>
          </tr>
        {:else}
          {#each listServices as service}
            <tr>
              <td class="font-medium">{service.name}</td>
              <td class="hidden sm:table-cell text-surface-400">
                {service.description || 'N/A'}
              </td>
              <td>
                <span class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 rounded-full {getStatusColor(service.status ?? 'ping')}"
                  ></span>
                  <span class="hidden sm:inline capitalize">{service.status || 'unknown'}</span>
                </span>
              </td>
              <td>
                {#if service.lastChecked}
                  <span class="sm:hidden text-sm">{service.lastChecked.split('T')[0]}</span>
                  <span class="hidden sm:inline text-sm">{formatDate(service.lastChecked)}</span>
                {:else}
                  <span class="text-surface-400">N/A</span>
                {/if}
              </td>
              <td>
                <span 
                  class="font-mono text-sm badge"
                  class:variant-filled-success={service.responseTime && service.responseTime < 200}
                  class:variant-filled-warning={service.responseTime && service.responseTime >= 200 && service.responseTime < 1000}
                  class:variant-filled-error={service.responseTime && service.responseTime >= 1000}
                >
                  {formatPing(service.responseTime)}
                </span>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  <footer class="text-sm text-surface-400 text-center">
    <p>Ultimo aggiornamento: {data}</p>
  </footer>
</div>

<style>
</style>
