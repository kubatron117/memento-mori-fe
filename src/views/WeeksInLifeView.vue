<template>
  <div class="life-calculator">
    <h1>Kalkulačka životních týdnů</h1>
    <form @submit.prevent="submitDates">
      <div>
        <label for="dob">Datum narození:</label>
        <input type="date" id="dob" v-model="dob" required />
      </div>
      <div>
        <label for="dod">Očekávané datum úmrtí:</label>
        <input type="date" id="dod" v-model="dod" required />
      </div>
      <button type="submit">Vypočítat týdny</button>
    </form>

    <LifeWeeksGrid />

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useLifeStore } from '../stores/lifeStore';
import LifeWeeksGrid from '../components/WeeksInLife.vue';

const dob = ref<string>('');
const dod = ref<string>('');

const lifeStore = useLifeStore();

const submitDates = () => {
  const birthDate = new Date(dob.value);
  const deathDate = new Date(dod.value);

  if (birthDate >= deathDate) {
    alert('Datum úmrtí musí být po datu narození.');
    return;
  }

  lifeStore.setDateOfBirth(birthDate);
  lifeStore.setExpectedDeathDate(deathDate);
};
</script>

<style scoped>
.life-calculator {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.life-calculator form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.life-calculator label {
  margin-right: 10px;
}

.life-calculator input {
  padding: 5px;
  font-size: 16px;
}

.life-calculator button {
  padding: 10px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.life-calculator button:hover {
  background-color: #45a049;
}
</style>
