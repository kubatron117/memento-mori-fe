<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Kalkulačka konzumace alkoholu</h2>
    <div class="mb-4">
      <label class="block mb-1 font-medium">Pijete alkohol?</label>
      <div class="flex items-center space-x-4">
        <RadioButton v-model="alcoholStore.drinksAlcohol" :value="true" inputId="alkohol-ano" />
        <label for="alkohol-ano" class="cursor-pointer">Ano</label>
        <RadioButton v-model="alcoholStore.drinksAlcohol" :value="false" inputId="alkohol-ne" />
        <label for="alkohol-ne" class="cursor-pointer">Ne</label>
      </div>
    </div>
    <div v-if="alcoholStore.drinksAlcohol === true">
      <p class="mb-4">
        Zadejte počet jednotlivých nápojů, které za týden vypijete. Výpočet vychází ze studie, podle které je nejnižší riziko při ≤100 g čistého alkoholu týdně.
      </p>
      <div class="mb-4">
        <label class="block mb-1 font-medium">MALÉ pivo 10° (1 nápoj = 10 g)</label>
        <InputNumber v-model="alcoholStore.smallBeer10" :min="0" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">VELKÉ pivo 10° (1 nápoj = 10 g)</label>
        <InputNumber v-model="alcoholStore.largeBeer10" :min="0" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">MALÉ pivo 12° (1 nápoj = 13,2 g)</label>
        <InputNumber v-model="alcoholStore.smallBeer12" :min="0" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">VELKÉ pivo 12° (1 nápoj = 20 g)</label>
        <InputNumber v-model="alcoholStore.largeBeer12" :min="0" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Panák (1 nápoj = 12,8 g)</label>
        <InputNumber v-model="alcoholStore.shot" :min="0" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Víno (1 nápoj = 19,2 g)</label>
        <InputNumber v-model="alcoholStore.wine" :min="0" showButtons class="w-full" />
      </div>
      <div class="mt-6 p-4 bg-gray-50 rounded shadow">
        <p class="text-lg">
          <span class="font-semibold">Celkové množství alkoholu:</span>
          {{ alcoholStore.totalAlcoholGrams.toFixed(1) }} g/týden
        </p>
        <p class="text-lg mt-2">
          <span class="font-semibold">Zkrácení života od 40 let:</span>
          <template v-if="alcoholStore.lifeLostYears === 0">
            nejsou evidovány žádné ztráty
          </template>
          <template v-else>
            {{ alcoholStore.lifeLostYears }} {{ alcoholStore.lifeLostYears === 1 ? 'rok' : 'roky' }}
          </template>
        </p>
        <p class="text-sm text-gray-600 mt-1">
          (Podle studie: baseline je ≤100 g/týden; při >100–≤200 g se zkracuje o 6 měsíců, při >200–≤350 g o 1–2 roky, a při >350 g o 4–5 let.)
        </p>
      </div>
    </div>
    <div v-else-if="alcoholStore.drinksAlcohol === false" class="mt-6">
      <p>Uživatel neuvádí konzumaci alkoholu.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlcoholStore } from '@/stores/lifeLossAlcoholStore';
import InputNumber from 'primevue/inputnumber';
import RadioButton from 'primevue/radiobutton';
const alcoholStore = useAlcoholStore();
</script>

<style scoped>
</style>
