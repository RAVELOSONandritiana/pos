<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
    header?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
    class?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    variant?: 'white' | 'glass';
  }

  let { 
    children, 
    header, 
    footer, 
    class: className = '', 
    padding = 'md',
    hoverable = false,
    variant = 'white'
  }: Props = $props();

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8'
  };

  const variants = {
    white: 'bg-white border border-gray-100 shadow-sm',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-gray-200/50'
  };

  const base = 'rounded-3xl transition-all duration-300 overflow-hidden';
  let hoverClass = $derived(hoverable ? 'hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1' : '');
</script>

<div class="{base} {variants[variant]} {hoverClass} {className}">
  {#if header}
    <div class="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
      {@render header()}
    </div>
  {/if}
  
  <div class={paddings[padding]}>
    {@render children?.()}
  </div>

  {#if footer}
    <div class="px-5 py-4 border-t border-gray-50 bg-gray-50/30">
      {@render footer()}
    </div>
  {/if}
</div>
