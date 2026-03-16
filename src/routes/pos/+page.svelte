<script lang="ts">
  import ProductGrid from '$lib/components/pos/ProductGrid.svelte';
  import Cart from '$lib/components/pos/Cart.svelte';
  import { fade } from 'svelte/transition';
</script>

<div class="h-full flex flex-col lg:flex-row gap-8 overflow-hidden">
  <!-- Left Side: Product Selection -->
  <div class="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
    <div in:fade={{ duration: 400, delay: 200 }} class="h-full">
      <ProductGrid />
    </div>
  </div>

  <!-- Right Side: Cart Summary -->
  <aside 
    class="w-full lg:w-96 xl:w-[400px] h-[600px] lg:h-full shrink-0"
    in:fade={{ duration: 400, delay: 400 }}
  >
    <Cart />
  </aside>
</div>
