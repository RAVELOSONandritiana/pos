<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import { settingsState, currentUserState } from '$lib/stores';
  import Button from '$lib/components/ui/Button.svelte';
  import { fade, fly } from 'svelte/transition';

  let { children } = $props();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊', role: 'ADMIN' },
    { name: 'Vente (POS)', path: '/pos', icon: '🛒', role: 'ANY' },
    { name: 'Produits', path: '/admin/products', icon: '📦', role: 'ADMIN' },
    { name: 'Historique', path: '/admin/history', icon: '📜', role: 'ADMIN' },
    { name: 'Paramètres', path: '/admin/settings', icon: '⚙️', role: 'ADMIN' },
  ];

  let isSidebarOpen = $state(true);
  
  const filteredNav = $derived(
    navItems.filter(item => 
      item.role === 'ANY' || (currentUserState?.role === 'ADMIN')
    )
  );
</script>

<svelte:head>
  <title>{settingsState.appName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex bg-gray-50/50">
  <!-- Sidebar -->
  <aside 
    class="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 lg:static lg:translate-x-0 no-print"
    class:-translate-x-full={!isSidebarOpen}
  >
    <div class="h-full flex flex-col">
      <!-- Logo -->
      <div class="p-8 flex items-center gap-3">
        <span class="text-3xl filter drop-shadow-sm">{settingsState.appLogo}</span>
        <div>
          <h1 class="text-xl font-bold tracking-tight text-gray-900 leading-tight">
            {settingsState.appName.split(' ')[0]}<span class="text-indigo-600">{settingsState.appName.split(' ')[1] || ''}</span>
          </h1>
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
            Management System
          </p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-1.5 mt-4">
        {#each filteredNav as item}
          <a
            href={item.path}
            class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group {page.url.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
          >
            <span class="text-xl group-hover:scale-120 transition-transform">{item.icon}</span>
            {item.name}
          </a>
        {/each}
      </nav>

      <!-- User Profile -->
      <div class="p-6 border-t border-gray-50 bg-gray-50/30">
        <div class="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {currentUserState?.username[0].toUpperCase()}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-gray-900 truncate">{currentUserState?.username}</p>
            <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{currentUserState?.role}</p>
          </div>
          <Button variant="ghost" size="icon" class="text-gray-400 hover:text-red-500">
            🚪
          </Button>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
    <!-- Header -->
    <header class="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-30 no-print">
      <div class="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          class="lg:hidden" 
          onclick={() => isSidebarOpen = !isSidebarOpen}
        >
          {isSidebarOpen ? '✖️' : '☰'}
        </Button>
        <div>
          <h2 class="text-lg font-bold text-gray-900">
            {filteredNav.find(n => n.path === page.url.pathname)?.name || 'Point de Vente'}
          </h2>
          <p class="text-xs text-gray-400 font-medium">Bon retour, {currentUserState?.username} !</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-2">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-xs font-bold uppercase tracking-wider">Store Online</span>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <div class="flex-1 overflow-y-auto p-4 lg:p-8">
      {#key page.url.pathname}
        <div in:fade={{ duration: 300, delay: 100 }}>
          {@render children()}
        </div>
      {/key}
    </div>
  </main>
</div>
