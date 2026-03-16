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

<div class="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
  <div class="w-full max-w-md" in:fly={{ y: 20, duration: 600 }}>
    <Card padding="lg" variant="glass" class="shadow-2xl border-none">
      <div class="text-center space-y-4 mb-8">
        <div class="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-xl border border-gray-50">
          {settingsState.appLogo}
        </div>
        <div>
          <h1 class="text-2xl font-black text-gray-900 leading-tight">Bienvenue sur <span class="text-indigo-600">{settingsState.appName}</span></h1>
          <p class="text-sm font-medium text-gray-400">Connectez-vous pour commencer à vendre</p>
        </div>
      </div>

      <form class="space-y-6" onsubmit={(e) => { e.preventDefault(); goto('/pos'); }}>
        <Input 
          label="Utilisateur" 
          placeholder="Votre nom d'utilisateur" 
          bind:value={username}
          required 
        />
        <Input 
          label="Mot de passe" 
          type="password" 
          placeholder="••••••••" 
          bind:value={password}
          required 
        />
        
        <div class="flex items-center justify-between text-xs px-1">
          <label class="flex items-center gap-2 text-gray-500 font-medium cursor-pointer">
            <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            Se souvenir de moi
          </label>
          <button type="button" class="text-indigo-600 font-bold hover:underline">Oublié ?</button>
        </div>

        <Button variant="primary" class="w-full py-4 shadow-xl shadow-indigo-100" type="submit">
          Se Connecter au Système
        </Button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Sécurité Intégrée G-POS PRO</p>
      </div>
    </Card>
  </div>
</div>
