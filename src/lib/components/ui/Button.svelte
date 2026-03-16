<script lang="ts">
  import { type HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children?: import('svelte').Snippet;
    class?: string;
  }

  let { 
    variant = 'primary', 
    size = 'md', 
    children, 
    class: className = '', 
    ...rest 
  }: Props = $props();

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200 focus:ring-indigo-500',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:scale-95 focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-lg shadow-red-100 focus:ring-red-500',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-lg shadow-emerald-100 focus:ring-emerald-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-95 focus:ring-gray-200'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
    md: 'px-4 py-2.5 text-sm font-semibold rounded-xl',
    lg: 'px-6 py-4 text-base font-bold rounded-2xl',
    icon: 'p-2 rounded-xl'
  };

  const base = 'inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
</script>

<button 
  class="{base} {variants[variant]} {sizes[size]} {className}" 
  {...rest}
>
  {@render children?.()}
</button>
