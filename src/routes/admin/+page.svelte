<script lang="ts">
  import { salesHistoryState, productsState, categoriesState } from '$lib/stores';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
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

<div class="space-y-10 pb-12">
  <!-- Header with Context -->
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h2 class="text-3xl font-black text-gray-900 tracking-tight">Tableau de Bord</h2>
      <p class="text-sm text-gray-400 font-medium">Vue d'ensemble des performances de votre point de vente.</p>
    </div>
    <div class="flex gap-3">
      <Button variant="secondary" class="shadow-sm">📅 Aujourd'hui</Button>
      <Button variant="primary" class="shadow-lg shadow-indigo-100">📥 Rapport</Button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
    {#each stats as stat, i}
      <div in:fly={{ y: 20, delay: i * 100 }}>
        <Card class="relative overflow-hidden group border-none shadow-2xl shadow-gray-200/40 {stat.bg} !bg-opacity-40">
          <div class="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-all text-8xl rotate-12 group-hover:rotate-0">
            {stat.icon}
          </div>
          <div class="space-y-3">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
            <p class="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
          </div>
          <div class="mt-6 flex items-center gap-2">
            <div class="px-2 py-1 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 flex items-center gap-1">
              <span class="text-[10px] font-black text-emerald-600">↑ 12.5%</span>
            </div>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">vs hier</span>
          </div>
        </Card>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <!-- Main Chart / Sales Flow -->
    <Card class="lg:col-span-2 min-h-[450px]" variant="white">
      {#snippet header()}
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shadow-inner">📈</div>
          <div>
            <h3 class="font-black text-gray-900 leading-none">Tendances des Ventes</h3>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Données en temps réel</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-md transition-all">Ventes</button>
          <button class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:bg-gray-50 transition-all">Trafic</button>
        </div>
      {/snippet}
      
      <div class="h-full flex flex-col items-center justify-center text-center space-y-6 py-24">
        <div class="relative">
          <div class="absolute inset-0 bg-indigo-500 blur-3xl opacity-10 animate-pulse"></div>
          <div class="text-7xl relative">📉</div>
        </div>
        <div class="space-y-2 max-w-sm">
          <p class="text-lg font-black text-gray-900 tracking-tight">Générant de nouvelles perspectives...</p>
          <p class="text-sm text-gray-400 font-medium">Le graphique se construira automatiquement dès que les premières transactions de la journée seront validées.</p>
        </div>
      </div>
    </Card>

    <!-- Top Products -->
    <Card variant="white">
      {#snippet header()}
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl shadow-inner">🏆</div>
          <div>
            <h3 class="font-black text-gray-900 leading-none">Meilleures Ventes</h3>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ce mois-ci</p>
          </div>
        </div>
      {/snippet}

      <div class="space-y-8">
        {#if topProducts().length === 0}
          <div class="flex flex-col items-center justify-center py-20 text-gray-300">
            <span class="text-4xl mb-4">🧊</span>
            <p class="font-bold text-gray-400">En attente de données</p>
          </div>
        {:else}
          {#each topProducts() as [name, count], i}
            <div class="flex items-center gap-5 group" in:fly={{ x: 20, delay: i * 100 }}>
              <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-100 transition-all duration-300 flex-shrink-0">
                {i + 1}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-end mb-2">
                  <p class="font-bold text-gray-900 truncate tracking-tight">{name}</p>
                  <span class="text-xs font-black text-indigo-600">{count} vds</span>
                </div>
                <div class="w-full bg-gray-50 h-2 rounded-full overflow-hidden shadow-inner">
                  <div 
                    class="bg-linear-to-r from-indigo-500 to-indigo-400 h-full rounded-full transition-all duration-1000 shadow-sm" 
                    style="width: {Math.min(100, (count / totalProductsSold) * 100)}%"
                  ></div>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </Card>
  </div>

  <!-- Traffic Logs -->
  <Card variant="white" padding="none">
    {#snippet header()}
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-xl shadow-inner">🛡️</div>
        <div>
          <h3 class="font-black text-gray-900 leading-none">Journal des Transactions</h3>
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Flux de surveillance</p>
        </div>
      </div>
      <button class="text-[10px] font-black text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors">Tout Voir</button>
    {/snippet}

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
            <th class="py-5 px-8">Horodatage</th>
            <th class="py-5 px-8">Transaction</th>
            <th class="py-5 px-8">Responsable</th>
            <th class="py-5 px-8">Montant</th>
            <th class="py-5 px-8 text-right">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50/50">
          {#if salesHistoryState.length === 0}
            <tr>
              <td colspan="5" class="py-24 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-2xl animate-pulse">📡</div>
                  <p class="text-gray-400 font-black uppercase tracking-widest text-xs">En attente de transactions entrantes...</p>
                </div>
              </td>
            </tr>
          {:else}
            {#each salesHistoryState.slice().reverse().slice(0, 5) as sale}
              <tr class="group hover:bg-gray-50/40 transition-all">
                <td class="py-6 px-8">
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-gray-900 tracking-tight">{sale.timestamp.toLocaleDateString()}</span>
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest">{sale.timestamp.toLocaleTimeString()}</span>
                  </div>
                </td>
                <td class="py-6 px-8">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl border border-gray-100 group-hover:rotate-6 transition-transform">
                      {sale.paymentMethod === 'CASH' ? '💵' : '💳'}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-gray-900">Vente #{sale.id.slice(-6).toUpperCase()}</span>
                      <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{sale.paymentMethod}</span>
                    </div>
                  </div>
                </td>
                <td class="py-6 px-8">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                      {sale.sellerId[0].toUpperCase()}
                    </div>
                    <span class="text-sm font-bold text-gray-700 tracking-tight">{sale.sellerId}</span>
                  </div>
                </td>
                <td class="py-6 px-8">
                  <span class="text-lg font-black text-emerald-600 tracking-tighter">
                    + {sale.total.toLocaleString()} $
                  </span>
                </td>
                <td class="py-6 px-8 text-right">
                  <Badge variant="success" class="px-3 py-1 font-black shadow-sm ring-4 ring-emerald-50">SÉCURISÉ</Badge>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </Card>
</div>
