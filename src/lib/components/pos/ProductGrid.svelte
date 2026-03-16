<script lang="ts">
  import { productsState, categoriesState, cart } from '$lib/stores';
  import type { Product } from '$lib/types';
  import { fade, fly, scale } from 'svelte/transition';
  import Card from '../ui/Card.svelte';
  import Badge from '../ui/Badge.svelte';

  let selectedCategoryId = $state('all');
  let searchQuery = $state('');

  const filteredProducts = $derived(
    productsState.filter((p) => {
      const matchesCategory = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
      return matchesCategory && matchesSearch;
    })
  );
</script>

<div class="flex flex-col h-full space-y-6">
  <!-- Categories & Search -->
  <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
      <button
        onclick={() => selectedCategoryId = 'all'}
        class="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shrink-0 {selectedCategoryId === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 font-semibold'}"
      >
        Tous
      </button>
      {#each categoriesState as cat}
        <button
          onclick={() => selectedCategoryId = cat.id}
          class="px-5 py-2.5 rounded-2xl text-sm transition-all shrink-0 {selectedCategoryId === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 font-semibold'}"
        >
          {cat.name}
        </button>
      {/each}
    </div>

    <div class="relative w-full md:w-72">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      <input
        bind:value={searchQuery}
        type="text"
        placeholder="Rechercher ou scanner..."
        class="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm"
      />
    </div>
  </div>

<!-- Products Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 overflow-y-auto pr-2 pb-12">
    {#each filteredProducts as product (product.id)}
      <button 
        onclick={() => cart.addItem(product)}
        class="group text-left h-full"
        in:scale={{ duration: 300, start: 0.95 }}
      >
        <Card padding="none" hoverable variant="white" class="h-full flex flex-col group-active:scale-95 transition-all">
          <div class="aspect-[4/3] bg-gray-50 flex items-center justify-center relative overflow-hidden shrink-0">
            {#if product.image}
              <img src={product.image} alt={product.name} class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out" />
            {:else}
              <div class="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
                <span class="text-6xl group-hover:rotate-12 transition-transform duration-500">📦</span>
              </div>
            {/if}
            
            <div class="absolute top-4 right-4">
              <Badge variant={product.stock > 10 ? 'success' : 'warning'} class="shadow-sm backdrop-blur-md bg-white/90">
                {product.stock} en stock
              </Badge>
            </div>
          </div>
          
          <div class="p-6 flex flex-col flex-1 justify-between gap-4">
            <div class="space-y-2">
              <p class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none">
                {categoriesState.find((c) => c.id === product.categoryId)?.name || 'Produit'}
              </p>
              <h3 class="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </div>
            
            <div class="flex items-center justify-between pt-2 border-t border-gray-50">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prix Unitaire</span>
                <span class="text-2xl font-black text-gray-900">
                  {product.price.toLocaleString()} $
                </span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-indigo-200">
                <span class="text-2xl font-light">＋</span>
              </div>
            </div>
          </div>
        </Card>
      </button>
    {/each}
  </div>
</div>
