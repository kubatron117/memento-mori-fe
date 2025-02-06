<script lang="ts">
import { defineComponent, ref } from 'vue';
import DatePicker from 'primevue/datepicker';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import { useLoginStore } from '@/stores/loginStore';

export default defineComponent({
  name: 'AccountDates',
  components: {
    DatePicker,
    Slider,
    Button
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
        alert('Data byla úspěšně aktualizována.');
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
  <div class="account-dates">
    <h2>Nastavení data narození a očekávané délky života</h2>
    <form @submit.prevent="onSubmit" class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12 p-md-6">
        <label for="birthDate">Datum narození:</label>
        <DatePicker v-model="birthDate" inputId="birthDate" dateFormat="dd/mm/yy" showIcon />
      </div>
      <div class="p-field p-col-12 p-md-6">
        <label for="desiredAge">Věk, do kterého se chcete dožít:</label>
        <Slider v-model="desiredAge" :min="1" :max="140" inputId="desiredAge" />
        <div>{{ desiredAge }} let</div>
      </div>
      <div class="p-field p-col-12">
        <Button label="Uložit" type="submit" />
      </div>
    </form>
  </div>
</template>


<style scoped>
.account-dates {
  max-width: 600px;
  margin: 2rem auto;
}
</style>
