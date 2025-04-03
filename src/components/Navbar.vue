<template>
  <nav class="bg-white border-gray-200">
    <div class="w-[95%] max-w-[1900px] flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/weeks-in-life" class="flex items-center space-x-3">
        <img src="/memorian_logotyp.svg" class="h-8" alt="Memorian Logo" />
      </router-link>

      <div class="flex items-center md:order-2 space-x-3">
        <div class="relative">
          <button
            @click="toggleUserDropdown"
            type="button"
            class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
            id="user-menu-button"
            :aria-expanded="userDropdownOpen"
          >
            <span class="sr-only">Open user menu</span>
            <div class="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <span class="text-sm font-bold text-white">{{ loginStore.firstName[0] }}</span>
              <span class="text-sm font-bold text-white">{{ loginStore.lastName[0] }}</span>
            </div>
          </button>

          <div
            v-show="userDropdownOpen"
            class="z-50 absolute right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm"
            id="user-dropdown"
          >
            <div class="px-4 py-3">
              <span class="block text-sm text-gray-900">{{ loginStore.fullName }}</span>
              <span class="block text-sm text-gray-500 truncate">{{ loginStore.email }}</span>
            </div>
            <ul class="py-2" aria-labelledby="user-menu-button">
              <li>
                <router-link
                  to="/user-profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeUserDropdown"
                >
                  {{ t('app.nav.userProfile') }}
                </router-link>
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click.prevent="logout"
                >
                  {{ t('app.nav.logout') }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        :class="[ mobileMenuOpen ? 'block' : 'hidden', 'w-full md:flex md:w-auto md:order-1' ]"
        id="navbar-user"
      >
        <ul class="flex flex-col font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 gap-4 md:flex-row md:mt-0 md:border-0 md:bg-white">

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/loginStore';
import { useI18n } from 'vue-i18n'

const mobileMenuOpen = ref(false);
const userDropdownOpen = ref(false);
const router = useRouter();
const loginStore = useLoginStore();

const { t } = useI18n()

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

function toggleUserDropdown() {
  userDropdownOpen.value = !userDropdownOpen.value;
}

function closeUserDropdown() {
  userDropdownOpen.value = false;
}

async function logout() {
  await loginStore.logoutUser();
  closeUserDropdown();
  await router.push('/login');
}
</script>

<style scoped>

</style>
