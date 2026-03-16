<script lang="ts">
  import { cart, settingsState } from '$lib/stores';
  import { fade, fly, slide } from 'svelte/transition';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import Badge from '../ui/Badge.svelte';
  import PaymentModal from './PaymentModal.svelte';

  let checkoutOpen = $state(false);

  const taxAmount = $derived((cart.total * settingsState.taxRate) / 100);
  const grandTotal = $derived(cart.total + taxAmount);
</script>

<div class="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
  <div class="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
    <div>
      <h2 class="text-lg font-black text-gray-900">Panier Actuel</h2>
      <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">{cart.items.length} Articles</p>
    </div>
    <Button variant="ghost" size="icon" onclick={() => cart.clear()} disabled={cart.items.length === 0}>
      🗑️
    </Button>
  </div>

  <!-- Cart Items -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    {#if cart.items.length === 0}
      <div class="h-full flex flex-col items-center justify-center text-center p-8 space-y-4" in:fade>
        <div class="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-4xl animate-bounce">
          🛒
        </div>
        <div>
          <p class="text-gray-900 font-bold">Votre panier est vide</p>
          <p class="text-sm text-gray-400 font-medium">Sélectionnez des produits pour commencer une vente</p>
        </div>
      </div>
    {:else}
      {#each cart.items as item (item.id)}
        <div 
          class="flex items-center gap-4 group p-1"
          in:fly={{ x: 20, duration: 300 }}
          out:slide
        >
          <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            📦
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-gray-900 truncate leading-tight">{item.name}</h4>
            <p class="text-xs font-black text-indigo-600">{item.price.toLocaleString()} $</p>
          </div>
          <div class="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 shadow-inner">
            <button 
              class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-indigo-600 font-bold transition-colors"
              onclick={() => cart.updateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span class="w-6 text-center text-sm font-black text-gray-900">{item.quantity}</span>
            <button 
              class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-indigo-600 font-bold transition-colors"
              onclick={() => cart.updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Summary -->
  <div class="p-6 bg-gray-900 text-white space-y-4">
    <div class="space-y-2 pb-4 border-b border-white/10">
      <div class="flex justify-between text-sm font-medium text-gray-400">
        <span>Sous-total</span>
        <span class="text-white font-bold">{cart.total.toLocaleString()} $</span>
      </div>
      <div class="flex justify-between text-sm font-medium text-gray-400">
        <span>Taxe ({settingsState.taxRate}%)</span>
        <span class="text-white font-bold">{taxAmount.toLocaleString()} $</span>
      </div>
    </div>
    
    <div class="flex justify-between items-end">
      <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Total à payer</span>
      <span class="text-3xl font-black">{grandTotal.toLocaleString()} $</span>
    </div>

    <Button 
      variant="primary" 
      class="w-full py-5 text-lg shadow-2xl shadow-indigo-900/50"
      disabled={cart.items.length === 0}
      onclick={() => checkoutOpen = true}
    >
      Encaisser
    </Button>
  </div>
</div>

<PaymentModal 
  open={checkoutOpen} 
  onClose={() => checkoutOpen = false} 
/>
