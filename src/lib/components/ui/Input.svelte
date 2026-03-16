<script lang="ts">
  import { type HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    label?: string;
    error?: string;
    icon?: string;
    class?: string;
    value?: string | number;
  }

  let { 
    label, 
    error, 
    icon, 
    class: className = '', 
    value = $bindable(),
    ...rest 
  }: Props = $props();

  const base = 'w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 placeholder:text-gray-400 text-gray-700';
  let errorClass = $derived(error ? 'border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400' : '');
</script>

<div class="space-y-1.5 {className}">
  {#if label}
    <label class="block text-sm font-medium text-gray-600 px-1 ml-1" for={rest.id}>
      {label}
    </label>
  {/if}
  
  <div class="relative group">
    {#if icon}
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
        <span class="text-lg">{@html icon}</span>
      </div>
    {/if}
    
    <input 
      class="{base} {errorClass} {icon ? 'pl-11' : ''}" 
      bind:value
      {...rest}
    />
  </div>

  {#if error}
    <p class="text-xs font-medium text-red-500 mt-1 px-1">{error}</p>
  {/if}
</div>
