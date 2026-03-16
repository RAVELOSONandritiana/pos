<script lang="ts">
  interface Props {
    variant?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
    children?: import('svelte').Snippet;
    class?: string;
  }

  let { 
    variant = 'neutral', 
    children, 
    class: className = '' 
  }: Props = $props();

  const variants = {
    primary: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    danger: 'bg-red-50 text-red-600 border-red-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200'
  };

  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border leading-none tracking-tight';
</script>

<span class="{base} {variants[variant]} {className}">
  {@render children?.()}
</span>
