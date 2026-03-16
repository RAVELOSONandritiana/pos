<script lang="ts">
  import { cart, settingsState, salesHistoryState, currentUserState } from '$lib/stores';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import { fade, scale } from 'svelte/transition';

  interface Props {
    open: boolean;
    onClose: () => void;
  }

  let { open, onClose }: Props = $props();

  let selectedMethod = $state<'CASH' | 'CARD' | 'MOBILE' | 'BANK'>('CASH');
  let receivedAmount = $state(0);
  
  const taxAmount = $derived((cart.total * settingsState.taxRate) / 100);
  const grandTotal = $derived(cart.total + taxAmount);
  const change = $derived(Math.max(0, receivedAmount - grandTotal));

  function handleComplete() {
    const sale = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      items: [...cart.items],
      total: grandTotal,
      taxAmount: taxAmount,
      paymentMethod: selectedMethod,
      sellerId: currentUserState?.id || 'unknown'
    };
    
    salesHistoryState.push(sale);
    cart.clear();
    onClose();
    alert('Vente terminée avec succès !');
  }

  const methods = [
    { id: 'CASH', name: 'Espèces', icon: '💵' },
    { id: 'MOBILE', name: 'Mobile Money', icon: '📱' },
    { id: 'CARD', name: 'Carte Bancaire', icon: '💳' },
    { id: 'BANK', name: 'Virement', icon: '🏦' },
  ];
</script>

{#if open}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8" in:fade>
    <!-- Backdrop -->
    <button 
      class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm cursor-default" 
      onclick={onClose}
      aria-label="Fermer"
    ></button>

    <!-- Modal Content -->
    <div class="relative w-full max-w-2xl" in:scale={{ duration: 300, start: 0.9 }}>
      <Card padding="none" variant="white" class="shadow-2xl overflow-hidden border-none">
        <div class="flex flex-col md:flex-row h-full min-h-[500px]">
          <!-- Left: Summary -->
          <div class="w-full md:w-72 bg-gray-900 text-white p-8 flex flex-col justify-between">
            <div class="space-y-6">
              <h2 class="text-2xl font-black">Paiement</h2>
              <div class="space-y-4">
                <div class="pb-4 border-b border-white/10">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Sous-total</p>
                  <p class="text-lg font-bold">{cart.total.toLocaleString()} $</p>
                </div>
                <div class="pb-4 border-b border-white/10">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">TVA ({settingsState.taxRate}%)</p>
                  <p class="text-lg font-bold">{taxAmount.toLocaleString()} $</p>
                </div>
              </div>
            </div>
            <div>
              <p class="text-xs font-bold text-indigo-400 uppercase tracking-widest">Total à payer</p>
              <p class="text-5xl font-black">{grandTotal.toLocaleString()} $</p>
            </div>
          </div>

          <!-- Right: Selection -->
          <div class="flex-1 p-8 p-10 bg-white space-y-8">
            <div class="space-y-4">
              <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Mode de paiement</p>
              <div class="grid grid-cols-2 gap-3">
                {#each methods as method}
                  <button 
                    onclick={() => selectedMethod = method.id as any}
                    class="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold {selectedMethod === method.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md translate-y-px' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100 hover:bg-white'}"
                  >
                    <span class="text-2xl">{method.icon}</span>
                    <span class="text-sm">{method.name}</span>
                  </button>
                {/each}
              </div>
            </div>

            {#if selectedMethod === 'CASH'}
              <div class="space-y-4" in:fade>
                <div class="space-y-2">
                  <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Montant reçu</p>
                  <input 
                    type="number" 
                    bind:value={receivedAmount}
                    class="w-full text-4xl font-black p-6 bg-gray-50 rounded-3xl border-2 border-gray-100 focus:border-indigo-600 outline-none transition-all text-indigo-600"
                    placeholder="0.00"
                  />
                </div>
                
                <div class="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
                  <span class="text-sm font-bold uppercase tracking-wider">Monnaie à rendre</span>
                  <span class="text-2xl font-black">{change.toLocaleString()} $</span>
                </div>
              </div>
            {:else}
              <div class="p-8 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center space-y-4" in:fade>
                <div class="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-3xl animate-pulse">
                  {methods.find(m => m.id === selectedMethod)?.icon}
                </div>
                <div>
                  <p class="text-gray-900 font-bold">Prêt pour le paiement {methods.find(m => m.id === selectedMethod)?.name}</p>
                  <p class="text-xs text-gray-400 font-medium">Veuillez utiliser le terminal approprié</p>
                </div>
              </div>
            {/if}

            <div class="pt-4 flex gap-3">
              <Button variant="secondary" class="flex-1" onclick={onClose}>Annuler</Button>
              <Button 
                variant="primary" 
                class="flex-[2] py-4" 
                disabled={selectedMethod === 'CASH' && receivedAmount < grandTotal}
                onclick={handleComplete}
              >
                Confirmer l'Encaissement
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
{/if}
