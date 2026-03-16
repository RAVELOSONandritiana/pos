<script lang="ts">
  import { salesHistoryState, productsState, categoriesState } from '$lib/stores';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { fade, fly } from 'svelte/transition';

  const totalSalesCount = $derived(salesHistoryState.length);
  const totalRevenue = $derived(salesHistoryState.reduce((sum: number, sale) => sum + sale.total, 0));
  const totalProductsSold = $derived(salesHistoryState.reduce((sum: number, sale) => 
    sum + sale.items.reduce((iSum: number, item) => iSum + item.quantity, 0), 0)
  );

  const topProducts = $derived(() => {
    const productCounts: Record<string, number> = {};
    salesHistoryState.forEach((sale) => {
      sale.items.forEach((item) => {
        productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  });

  const stats = $derived([
    { label: 'Revenu Total', value: `${totalRevenue.toLocaleString()} $`, icon: '💰', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Ventes Totales', value: totalSalesCount, icon: '📈', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Produits Vendus', value: totalProductsSold, icon: '📦', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Panier Moyen', value: `${(totalSalesCount ? totalRevenue / totalSalesCount : 0).toFixed(2)} $`, icon: '🛒', color: 'text-rose-600', bg: 'bg-rose-50' },
  ]);
</script>

<div class="space-y-8">
  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {#each stats as stat, i}
      <div in:fly={{ y: 20, delay: i * 100 }}>
        <Card class="relative overflow-hidden group border-none shadow-xl shadow-gray-200/50">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-5xl">
            {stat.icon}
          </div>
          <div class="space-y-2">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p class="text-3xl font-black text-gray-900">{stat.value}</p>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <Badge variant="success">+12%</Badge>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">vs mois dernier</span>
          </div>
        </Card>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Chart / Sales Flow -->
    <Card class="lg:col-span-2 min-h-[400px]" variant="white">
      {#snippet header()}
        <h3 class="font-black text-gray-900 flex items-center gap-2">
          <span>📊</span> Flux de Ventes Récent
        </h3>
        <Badge variant="primary">Temps Réel</Badge>
      {/snippet}
      
      <div class="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 grayscale opacity-30">
        <div class="text-6xl">📈</div>
        <p class="font-bold text-gray-900">Graphique de Performance</p>
        <p class="text-sm max-w-xs">Les données de trafic s'afficheront ici au fur et à mesure des ventes de la journée.</p>
      </div>
    </Card>

    <!-- Top Products -->
    <Card variant="white">
      {#snippet header()}
        <h3 class="font-black text-gray-900 flex items-center gap-2">
          <span>🏆</span> Top Produits
        </h3>
      {/snippet}

      <div class="space-y-6">
        {#if topProducts().length === 0}
          <p class="text-center py-10 text-gray-400 font-medium">Aucune donnée disponible</p>
        {:else}
          {#each topProducts() as [name, count], i}
            <div class="flex items-center gap-4 group" in:fly={{ x: 20, delay: i * 100 }}>
              <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {i + 1}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 truncate">{name}</p>
                <div class="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    class="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                    style="width: {Math.min(100, (count / totalProductsSold) * 100)}%"
                  ></div>
                </div>
              </div>
              <span class="text-sm font-black text-gray-900">{count}</span>
            </div>
          {/each}
        {/if}
      </div>
    </Card>
  </div>

  <!-- Traffic Logs (Anti-fraud) -->
  <Card variant="white">
    {#snippet header()}
      <h3 class="font-black text-gray-900 flex items-center gap-2">
        <span>🛡️</span> Surveillance du Trafic (Anti-fraude)
      </h3>
      <button class="text-xs font-bold text-indigo-600 hover:underline">Voir tout le journal</button>
    {/snippet}

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
            <th class="py-4 px-4">Heure</th>
            <th class="py-4 px-4">Action</th>
            <th class="py-4 px-4">Responsable</th>
            <th class="py-4 px-4">Montant</th>
            <th class="py-4 px-4 text-right">Statut</th>
          </tr>
        </thead>
        <tbody>
          {#if salesHistoryState.length === 0}
            <tr>
              <td colspan="5" class="py-12 text-center text-gray-400 font-medium">En attente de transactions...</td>
            </tr>
          {:else}
            {#each salesHistoryState.slice().reverse().slice(0, 5) as sale}
              <tr class="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                <td class="py-4 px-4 text-xs font-bold text-gray-500">
                  {sale.timestamp.toLocaleTimeString()}
                </td>
                <td class="py-4 px-4">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-gray-900">Vente Directe #{sale.id}</span>
                    <span class="text-[10px] text-gray-400 font-medium uppercase">{sale.paymentMethod}</span>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                      {sale.sellerId[0].toUpperCase()}
                    </div>
                    <span class="text-sm font-bold text-gray-700">{sale.sellerId}</span>
                  </div>
                </td>
                <td class="py-4 px-4 text-sm font-black text-emerald-600">
                  + {sale.total.toLocaleString()} $
                </td>
                <td class="py-4 px-4 text-right">
                  <Badge variant="success">Sécurisé</Badge>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </Card>
</div>
