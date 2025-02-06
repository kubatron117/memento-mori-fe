import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { definePreset } from '@primevue/themes';
import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import cs from './locales/cs.json'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Button from "primevue/button"
import Tooltip from 'primevue/tooltip';

import App from './App.vue'
import router from './router'

const app = createApp(App)


const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{neutral.50}',
      100: '{neutral.100}',
      200: '{neutral.200}',
      300: '{neutral.300}',
      400: '{neutral.400}',
      500: '{neutral.500}',
      600: '{neutral.600}',
      700: '{neutral.700}',
      800: '{neutral.800}',
      900: '{neutral.900}',
      950: '{neutral.950}'
    }
  }
});


app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      prefix: 'p',
      darkModeSelector: false || 'none',
      cssLayer: false
    }
  }
});

app.directive('tooltip', Tooltip);

const i18n = createI18n({
  locale: 'cs',
  fallbackLocale: 'en',
  messages: {
    en,
    cs
  }
})

app.use(i18n)

app.component('Button', Button);

app.mount('#app')
