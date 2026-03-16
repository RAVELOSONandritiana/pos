<script lang="ts">
  import { productsState, categoriesState } from '$lib/stores';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Barcode from '$lib/components/ui/Barcode.svelte';
  import { fade, fly, slide } from 'svelte/transition';

  let showAddModal = $state(false);
  let searchQuery = $state('');

  const filteredProducts = $derived(
    productsState.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.barcode.includes(searchQuery)
    )
  );

  function deleteProduct(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const index = productsState.findIndex((p) => p.id === id);
      if (index !== -1) productsState.splice(index, 1);
    }
  }
</script>

<div class="space-y-8">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h2 class="text-2xl font-black text-gray-900">Gestion des Produits</h2>
      <p class="text-sm text-gray-400 font-medium">Ajouter, modifier ou supprimer des articles de l'inventaire.</p>
    </div>
    <Button variant="primary" onclick={() => showAddModal = true}>
      <span>➕</span> Ajouter un Produit
    </Button>
  </div>

  <Card padding="none" variant="white">
    <div class="p-6 border-b border-gray-50 flex items-center justify-between gap-4">
      <div class="relative w-full max-w-md">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          bind:value={searchQuery}
          type="text"
          placeholder="Rechercher par nom ou code-barres..."
          class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium"
        />
      </div>
      <div class="flex gap-2">
        <Button variant="secondary" size="icon">📥</Button>
        <Button variant="secondary" size="icon">📤</Button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50/50">
          <tr class="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
            <th class="py-4 px-6">Produit</th>
            <th class="py-4 px-6">Catégorie</th>
            <th class="py-4 px-6">Prix</th>
            <th class="py-4 px-6">Stock</th>
            <th class="py-4 px-6">Code-barres</th>
            <th class="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredProducts as product (product.id)}
            <tr class="border-b border-gray-50 group hover:bg-gray-50/30 transition-colors" in:fade>
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    📦
                  </div>
                  <span class="text-sm font-bold text-gray-900">{product.name}</span>
                </div>
              </td>
              <td class="py-4 px-6 text-sm font-semibold text-gray-500">
                {categoriesState.find((c) => c.id === product.categoryId)?.name || 'N/A'}
              </td>
              <td class="py-4 px-6 text-sm font-black text-indigo-600">
                {product.price.toLocaleString()} $
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <div class="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all {product.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'}" 
                      style="width: {Math.min(100, product.stock)}%"
                    ></div>
                  </div>
                  <span class="text-xs font-bold text-gray-600">{product.stock}</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <Barcode value={product.barcode} />
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <Button variant="ghost" size="icon" class="text-gray-400 hover:text-indigo-600">✏️</Button>
                <button 
                  onclick={() => deleteProduct(product.id)}
                  class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  🗑️
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>

{#if showAddModal}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4" in:fade>
    <button class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onclick={() => showAddModal = false} aria-label="Fermer"></button>
    <div class="relative w-full max-w-lg" in:fly={{ y: 20 }}>
      <Card variant="white" class="shadow-2xl">
        {#snippet header()}
          <h3 class="text-xl font-black">Nouveau Produit</h3>
          <Button variant="ghost" size="icon" onclick={() => showAddModal = false}>✖️</Button>
        {/snippet}
        
        <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); showAddModal = false; }}>
          <Input label="Nom du Produit" placeholder="ex: Coca Cola 1.5L" required />
          <div class="grid grid-cols-2 gap-4">
            <Input label="Prix ($)" type="number" step="0.01" placeholder="0.00" required />
            <Input label="Stock Initial" type="number" placeholder="0" required />
          </div>
          <Input label="Code-barres" placeholder="Scanner ou taper..." />
          
          <div class="pt-4 flex gap-3">
            <Button variant="secondary" class="flex-1" onclick={() => showAddModal = false}>Annuler</Button>
            <Button variant="primary" class="flex-1" type="submit">Enregistrer</Button>
          </div>
        </form>
      </Card>
    </div>
  </div>
{/if}
