<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { settingsState } from '$lib/stores';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';

  let username = $state('');
  let password = $state('');
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
  <!-- Decorative background elements -->
  <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 -right-24 w-72 h-72 bg-violet-100 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 left-1/4 w-80 h-80 bg-emerald-50 rounded-full blur-3xl"></div>
  </div>

  <div class="w-full max-w-[440px] relative z-10" in:fly={{ y: 30, duration: 800, delay: 200 }}>
    <Card padding="lg" variant="white" class="shadow-2xl shadow-indigo-100/50 border-none ring-1 ring-gray-100">
      <div class="text-center space-y-5 mb-10">
        <div class="w-20 h-20 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform duration-500">
          <span class="drop-shadow-lg">{settingsState.appLogo}</span>
        </div>
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            Plateforme <span class="text-indigo-600 font-black">{settingsState.appName.split(' ')[0]}</span>
          </h1>
          <p class="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Accès Sécurisé</p>
        </div>
      </div>

      <form class="space-y-6" onsubmit={(e) => { e.preventDefault(); goto('/pos'); }}>
        <div class="space-y-5">
          <Input 
            label="Identifiant" 
            placeholder="Votre nom d'utilisateur" 
            bind:value={username}
            required 
            class="rounded-2xl border-gray-100 focus:ring-indigo-100"
          />
          <Input 
            label="Mot de passe" 
            type="password" 
            placeholder="••••••••" 
            bind:value={password}
            required 
            class="rounded-2xl border-gray-100 focus:ring-indigo-100"
          />
        </div>
        
        <div class="flex items-center justify-between text-[11px] px-1">
          <label class="flex items-center gap-2.5 text-gray-500 font-bold cursor-pointer group">
            <input type="checkbox" class="w-4 h-4 rounded-lg border-gray-200 text-indigo-600 focus:ring-indigo-100 transition-all cursor-pointer" />
            <span class="group-hover:text-gray-900 transition-colors">Rester connecté</span>
          </label>
          <button type="button" class="text-indigo-600 font-black hover:text-indigo-700 transition-colors uppercase tracking-wider">Oublié ?</button>
        </div>

        <Button variant="primary" class="w-full py-4.5 rounded-2xl shadow-xl shadow-indigo-100 text-sm font-black uppercase tracking-widest" type="submit">
          Ouvrir la Session
        </Button>
      </form>

      <div class="mt-10 pt-8 border-t border-gray-50 text-center">
        <p class="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Powered by G-POS Advanced Engine</p>
      </div>
    </Card>
    
    <div class="mt-8 text-center flex items-center justify-center gap-6" in:fade={{ delay: 1000 }}>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-900 transition-colors">Support</p>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-900 transition-colors">Confidentialité</p>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-900 transition-colors">v2.4.0</p>
    </div>
  </div>
</div>
