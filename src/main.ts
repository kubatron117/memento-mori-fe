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
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import Step from 'primevue/step';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import RadioButton from 'primevue/radiobutton';
import Select from 'primevue/select';
import Slider from 'primevue/slider';
import Message from 'primevue/message';
import 'primeicons/primeicons.css'
import csLocale from 'primelocale/cs.json'
import ConfirmationService from 'primevue/confirmationservice';


import App from './App.vue'
import router from './router'

const app = createApp(App)


const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{neutral.700}',
      100: '{neutral.700}',
      200: '{neutral.700}',
      300: '{neutral.700}',
      400: '{neutral.700}',
      500: '{neutral.700}',
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
  },
  locale: {
    firstDayOfWeek: 1,
    dayNames: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
    dayNamesShort: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
    dayNamesMin: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
    monthNames: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
    monthNamesShort: ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"],
    today: "Dnes",
    clear: "Vymazat"
  }
});

app.directive('tooltip', Tooltip);

const i18n = createI18n({
  legacy: false,
  locale: 'cs',
  fallbackLocale: 'en',
  messages: {
    en,
    cs
  }
})

app.use(i18n)

app.use(ConfirmationService);

app.component('Button', Button);
app.component('Stepper', Stepper);
app.component('StepList', StepList);
app.component('Step', Step);
app.component('StepPanels', StepPanels);
app.component('StepPanel', StepPanel);
app.component('RadioButton', RadioButton);
app.component('Select', Select);
app.component('Slider', Slider);
app.component('Message', Message);

app.mount('#app')
