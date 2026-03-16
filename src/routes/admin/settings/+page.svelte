<script lang="ts">
  import { settingsState } from '$lib/stores';
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { fade } from 'svelte/transition';

  let appName = $state(settingsState.appName);
  let appLogo = $state(settingsState.appLogo);
  let taxRate = $state(settingsState.taxRate);
  let currency = $state(settingsState.currency);

  function saveSettings() {
    settingsState.appName = appName;
    settingsState.appLogo = appLogo;
    settingsState.taxRate = taxRate;
    settingsState.currency = currency;
    alert('Configuration enregistrée avec succès !');
  }
</script>

<div class="max-w-4xl mx-auto space-y-8">
  <div>
    <h2 class="text-2xl font-black text-gray-900">Configuration de l'Application</h2>
    <p class="text-sm text-gray-400 font-medium">Personnalisez votre interface et vos règles fiscales.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="md:col-span-2 space-y-6">
      <Card variant="white">
        {#snippet header()}
          <h3 class="font-bold text-gray-900">Général</h3>
        {/snippet}
        
        <div class="space-y-4">
          <Input label="Nom de l'Etablissement" bind:value={appName} placeholder="ex: Mon Commerce POS" />
          <div class="grid grid-cols-2 gap-4">
            <Input label="Logo (Emoji ou URL)" bind:value={appLogo} placeholder="ex: 🛍️" />
            <Input label="Devise" bind:value={currency} placeholder="ex: $" />
          </div>
        </div>
      </Card>

      <Card variant="white">
        {#snippet header()}
          <h3 class="font-bold text-gray-900">Fiscalité & Taxes</h3>
        {/snippet}
        
        <div class="space-y-4">
          <Input label="Taux de Taxe (%)" type="number" bind:value={taxRate} placeholder="20" />
          <p class="text-xs text-gray-400 leading-relaxed">
            Ce taux sera appliqué à toutes les ventes générées dans le module de vente (POS).
          </p>
        </div>
      </Card>

      <div class="flex justify-end pt-4">
        <Button variant="primary" size="lg" class="shadow-2xl shadow-indigo-200" onclick={saveSettings}>
          💾 Enregistrer les Modifications
        </Button>
      </div>
    </div>

    <div class="space-y-6">
      <Card variant="white" class="text-center">
        <div class="py-8 space-y-4">
          <div class="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-inner border border-white">
            {appLogo}
          </div>
          <div>
            <h4 class="text-xl font-bold text-gray-900">{appName}</h4>
            <p class="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Aperçu du Branding</p>
          </div>
        </div>
      </Card>

      <Card class="bg-indigo-600 text-white border-none shadow-2xl shadow-indigo-200 overflow-hidden relative">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div class="relative space-y-4">
          <h4 class="font-bold text-indigo-100">Besoin d'aide ?</h4>
          <p class="text-xs text-white/80 leading-relaxed font-medium">
            Contactez notre support technique pour toute demande de personnalisation avancée de votre système POS.
          </p>
          <button class="text-xs font-black uppercase tracking-widest text-white hover:underline">Support Technique →</button>
        </div>
      </Card>
    </div>
  </div>
</div>
