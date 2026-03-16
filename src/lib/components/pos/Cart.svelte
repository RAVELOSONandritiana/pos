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

<div class="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden ring-1 ring-gray-50">
  <div class="p-8 border-b border-gray-50 flex items-center justify-between bg-white">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shadow-inner">🛍️</div>
      <div>
        <h2 class="text-xl font-black text-gray-900 tracking-tight">Panier</h2>
        <p class="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-0.5">{cart.items.length} Article{cart.items.length > 1 ? 's' : ''}</p>
      </div>
    </div>
    <Button variant="ghost" size="icon" class="text-gray-300 hover:text-red-500 hover:bg-red-50" onclick={() => cart.clear()} disabled={cart.items.length === 0}>
      🗑️
    </Button>
  </div>

  <!-- Cart Items -->
  <div class="flex-1 overflow-y-auto p-6 space-y-6">
    {#if cart.items.length === 0}
      <div class="h-full flex flex-col items-center justify-center text-center p-8 space-y-6" in:fade>
        <div class="relative">
          <div class="absolute inset-0 bg-indigo-500 blur-3xl opacity-10 animate-pulse"></div>
          <div class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-5xl relative">
            🛒
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-gray-900 font-black tracking-tight uppercase text-xs">Panier Vide</p>
          <p class="text-xs text-gray-400 font-medium max-w-[180px] leading-relaxed italic">Veuillez sélectionner des articles dans la liste pour commencer.</p>
        </div>
      </div>
    {:else}
      {#each cart.items as item (item.id)}
        <div 
          class="flex items-center gap-5 group"
          in:fly={{ x: 20, duration: 300 }}
          out:slide
        >
          <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center relative overflow-hidden shrink-0 border border-gray-100 group-hover:shadow-lg transition-all">
            {#if item.image}
              <img src={item.image} alt={item.name} class="w-full h-full object-contain p-2" />
            {:else}
              <span class="text-2xl">📦</span>
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-gray-900 truncate leading-tight tracking-tight">{item.name}</h4>
            <p class="text-xs font-black text-indigo-600 mt-0.5">{item.price.toLocaleString()} $</p>
          </div>
          <div class="flex items-center gap-3 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button 
              class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold"
              onclick={() => cart.updateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span class="w-4 text-center text-xs font-black text-gray-900">{item.quantity}</span>
            <button 
              class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-bold"
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
  <div class="p-8 bg-gray-900 text-white space-y-6">
    <div class="space-y-3 pb-6 border-b border-white/10">
      <div class="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">
        <span>Sous-total</span>
        <span class="text-white tracking-widest">{cart.total.toLocaleString()} $</span>
      </div>
      <div class="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">
        <span>Taxe ({settingsState.taxRate}%)</span>
        <span class="text-white tracking-widest">{taxAmount.toLocaleString()} $</span>
      </div>
    </div>
    
    <div class="flex justify-between items-end">
      <div class="flex flex-col gap-1">
        <span class="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Net à Payer</span>
        <span class="text-5xl font-black tracking-tighter">{grandTotal.toLocaleString()} <span class="text-2xl text-indigo-400">$</span></span>
      </div>
    </div>

    <Button 
      variant="primary" 
      class="w-full py-6 text-base font-black uppercase tracking-widest shadow-2xl shadow-indigo-900/40 rounded-2xl hover:translate-y-px active:scale-95 transition-all"
      disabled={cart.items.length === 0}
      onclick={() => checkoutOpen = true}
    >
      Finaliser l'Encaissement
    </Button>
  </div>
</div>

<PaymentModal 
  open={checkoutOpen} 
  onClose={() => checkoutOpen = false} 
/>
