<script lang="ts">
  interface Props {
    value: string;
    class?: string;
  }
  let { value, class: className = '' }: Props = $props();

  // Simple deterministic "bars" based on the string value
  const bars = $derived(
    value.split('').map((char, i) => ({
      width: (char.charCodeAt(0) % 3) + 1,
      gap: (char.charCodeAt(0) % 2) + 1
    }))
  );
</script>

<div class="flex flex-col items-center gap-1 {className}">
  <div class="flex items-end h-10 bg-white p-1">
    {#each bars as bar}
      <div class="bg-black" style="width: {bar.width}px; margin-right: {bar.gap}px; height: 100%"></div>
    {/each}
    <!-- Add some extra fixed bars for "realistic" look -->
    <div class="w-[2px] h-full bg-black mr-1"></div>
    <div class="w-[1px] h-full bg-black mr-1"></div>
  </div>
  <span class="text-[9px] font-mono font-bold tracking-[0.2em] text-gray-900">{value}</span>
</div>
