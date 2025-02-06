<script lang="ts">
import { defineComponent, ref } from 'vue';
import DatePicker from 'primevue/datepicker';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import { useLoginStore } from '@/stores/loginStore';
import router from '@/router';

export default defineComponent({
  name: 'AccountDates',
  components: {
    DatePicker,
    Slider,
    Button,
  },
  setup() {
    const loginStore = useLoginStore();

    const birthDate = ref<Date | null>(
      loginStore.accountInfo && loginStore.accountInfo.date_of_birth
        ? new Date(loginStore.accountInfo.date_of_birth)
        : null
    );
    const desiredAge = ref<number>(
      loginStore.accountInfo &&
      loginStore.accountInfo.date_of_birth &&
      loginStore.accountInfo.estimated_lifespan
        ? new Date(loginStore.accountInfo.estimated_lifespan).getFullYear() -
        new Date(loginStore.accountInfo.date_of_birth).getFullYear()
        : 80
    );

    const onSubmit = async () => {
      if (!birthDate.value) {
        alert('Prosím, zadejte datum narození.');
        return;
      }
      const birth = birthDate.value;
      const estimatedLifespanDate = new Date(
        birth.getFullYear() + desiredAge.value,
        birth.getMonth(),
        birth.getDate()
      );

      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedBirthDate = formatDate(birth);
      const formattedLifespan = formatDate(estimatedLifespanDate);

      const success = await loginStore.updateDates({
        date_of_birth: formattedBirthDate,
        estimated_lifespan: formattedLifespan,
      });

      if (success) {
        await router.push('/weeks-in-life');
      } else {
        alert('Chyba při aktualizaci dat.');
      }
    };

    return {
      birthDate,
      desiredAge,
      onSubmit,
    };
  },
});
</script>

<template>
  <div class="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
      Nastavení data narození a očekávané délky života
    </h2>
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label for="birthDate" class="block text-gray-700 font-medium mb-2">
          Datum narození:
        </label>
        <DatePicker
          v-model="birthDate"
          inputId="birthDate"
          dateFormat="dd/mm/yy"
          showIcon
          class="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label for="desiredAge" class="block text-gray-700 font-medium mb-2">
          Věk, do kterého se chcete dožít:
        </label>
        <Slider
          v-model="desiredAge"
          :min="1"
          :max="140"
          inputId="desiredAge"
          class="w-full"
        />
        <div class="text-gray-600 mt-1">{{ desiredAge }} let</div>
      </div>
      <div>
        <Button
          label="Uložit"
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
</style>
