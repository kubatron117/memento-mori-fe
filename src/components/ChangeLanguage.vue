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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const localStorageKey = 'locale';

const browserLanguage = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
const defaultLocale = browserLanguage.toLowerCase().startsWith('cs') ? 'cs' : 'en';

const savedLocale = localStorage.getItem(localStorageKey) || defaultLocale;

const { locale } = useI18n();
locale.value = savedLocale;

const currentLocale = ref(locale.value);

function setLanguage(lang: string) {
  currentLocale.value = lang;
  locale.value = lang;
  localStorage.setItem(localStorageKey, lang);
}
</script>
