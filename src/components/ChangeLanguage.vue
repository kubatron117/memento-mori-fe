<template>
  <div class="flex space-x-2">
    <button
      @click="setLanguage('cs')"
      :class="currentLocale === 'cs' ? 'bg-black text-white font-bold py-1 px-2 text-xs rounded' : 'bg-gray-200 text-gray-700 font-medium py-1 px-2 text-xs rounded'">
      CS
    </button>
    <button
      @click="setLanguage('en')"
      :class="currentLocale === 'en' ? 'bg-black text-white font-bold py-1 px-2 text-xs rounded' : 'bg-gray-200 text-gray-700 font-medium py-1 px-2 text-xs rounded'">
      EN
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePrimeVue } from 'primevue/config';

const localStorageKey = 'locale';

const browserLanguage = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
const defaultLocale = browserLanguage.toLowerCase().startsWith('cs') ? 'cs' : 'en';

const savedLocale = localStorage.getItem(localStorageKey) || defaultLocale;

const { locale } = useI18n();
locale.value = savedLocale;

const currentLocale = ref(locale.value);

const primevue = usePrimeVue();

watch(locale, (newLocale) => {
  if (newLocale === 'en') {
    primevue.config.locale.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    primevue.config.locale.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    primevue.config.locale.dayNamesMin = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    primevue.config.locale.monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    primevue.config.locale.monthNamesShort = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    primevue.config.locale.today = "Today";
    primevue.config.locale.clear = "Clear";
  } else {
    primevue.config.locale.dayNames = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    primevue.config.locale.dayNamesShort = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
    primevue.config.locale.dayNamesMin = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
    primevue.config.locale.monthNames = [
      "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
      "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
    ];
    primevue.config.locale.monthNamesShort = ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"];
    primevue.config.locale.today = "Dnes";
    primevue.config.locale.clear = "Vymazat";
  }
}, { immediate: true });

function setLanguage(lang: string) {
  currentLocale.value = lang;
  locale.value = lang;
  localStorage.setItem(localStorageKey, lang);
}
</script>
