<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/pos');
  });
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="animate-pulse flex flex-col items-center gap-4">
    <div class="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
    <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Chargement du Système...</p>
  </div>
</div>
