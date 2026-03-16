<script lang="ts">
  import { salesHistoryState } from '$lib/stores';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { fade, fly, slide } from 'svelte/transition';

  let selectedSale = $state<any>(null);

  const methods: Record<string, { label: string; color: string; icon: string }> = {
    CASH: { label: 'Espèces', color: 'success', icon: '💵' },
    MOBILE: { label: 'Mobile Money', icon: '📱', color: 'primary' },
    CARD: { label: 'Carte Bancaire', icon: '💳', color: 'neutral' },
    BANK: { label: 'Virement', icon: '🏦', color: 'warning' },
  };
</script>

<div class="space-y-8">
  <div class="flex justify-between items-center">
    <div>
      <h2 class="text-2xl font-black text-gray-900">Historique des Ventes</h2>
      <p class="text-sm text-gray-400 font-medium">Consultez et réimprimez les transactions passées.</p>
    </div>
    <div class="flex gap-3">
      <Button variant="secondary">📅 Filte par Date</Button>
      <Button variant="secondary">📊 Export CSV</Button>
    </div>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
    <!-- Sales List -->
    <Card padding="none" variant="white" class="xl:col-span-2">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th class="py-4 px-6">ID Transaction</th>
              <th class="py-4 px-6">Date & Heure</th>
              <th class="py-4 px-6">Mode</th>
              <th class="py-4 px-6">Vendeur</th>
              <th class="py-4 px-6 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {#if salesHistoryState.length === 0}
              <tr>
                <td colspan="5" class="py-20 text-center text-gray-400 font-bold">Aucune transaction trouvée</td>
              </tr>
            {:else}
              {#each salesHistoryState.slice().reverse() as sale (sale.id)}
                <tr 
                  class="border-b border-gray-50 group hover:bg-indigo-50/30 transition-all cursor-pointer {selectedSale?.id === sale.id ? 'bg-indigo-50/50' : ''}"
                  onclick={() => selectedSale = sale}
                >
                  <td class="py-4 px-6">
                    <span class="text-xs font-bold text-gray-400 font-mono tracking-tighter">#{sale.id}</span>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-gray-900">{sale.timestamp.toLocaleDateString()}</span>
                      <span class="text-[10px] text-gray-400 font-medium">{sale.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <Badge variant={methods[sale.paymentMethod].color as any}>
                      {methods[sale.paymentMethod].label}
                    </Badge>
                  </td>
                  <td class="py-4 px-6 text-sm font-bold text-gray-600">{sale.sellerId}</td>
                  <td class="py-4 px-6 text-right text-sm font-black text-gray-900">
                    {sale.total.toLocaleString()} $
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Detailed View -->
    <div class="space-y-6">
      {#if selectedSale}
        <div in:fly={{ x: 20 }}>
          <Card variant="white" padding="none" class="sticky top-8 shadow-2xl border-none ring-1 ring-gray-100 overflow-hidden">
            <div class="bg-gray-900 p-8 text-white">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Détails du Ticket</h3>
                  <p class="text-lg font-black font-mono">#{selectedSale.id}</p>
                </div>
                <Button variant="ghost" size="icon" class="text-gray-400 -mr-2" onclick={() => selectedSale = null}>✖️</Button>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Payé par</span>
                <Badge variant="success" class="bg-indigo-500/20 border-indigo-400/20 text-indigo-300">
                  {methods[selectedSale.paymentMethod].label}
                </Badge>
              </div>
              <p class="text-4xl font-black">{selectedSale.total.toLocaleString()} $</p>
            </div>
            
            <div class="p-8 space-y-6 bg-white">
              <div class="space-y-4">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Articles ({selectedSale.items.length})</p>
                {#each selectedSale.items as item}
                  <div class="flex justify-between items-center">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-gray-900">{item.name}</span>
                      <span class="text-[10px] text-gray-400 font-medium">x{item.quantity} units</span>
                    </div>
                    <span class="text-sm font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} $</span>
                  </div>
                {/each}
              </div>

              <div class="pt-6 border-t border-gray-50 space-y-2">
                <div class="flex justify-between text-xs font-medium text-gray-400">
                  <span>TVA Complète</span>
                  <span class="font-bold text-gray-700">{selectedSale.taxAmount.toLocaleString()} $</span>
                </div>
              </div>

              <div class="pt-4 flex gap-3">
                <Button variant="primary" class="flex-1">🖨️ Imprimer</Button>
                <Button variant="secondary" size="icon">📧</Button>
              </div>
            </div>
          </Card>
        </div>
      {:else}
        <div class="h-[400px] border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4 text-gray-300" in:fade>
          <div class="text-6xl">📜</div>
          <p class="font-bold text-gray-400">Sélectionnez une transaction<br/>pour voir les détails</p>
        </div>
      {/if}
    </div>
  </div>
</div>
