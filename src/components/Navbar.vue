<template>
  <nav class="bg-white border-gray-200">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/" class="flex items-center space-x-3">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap">Flowbite</span>
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
            <img
              class="w-8 h-8 rounded-full"
              src="/pexels-shtefutsa-20265009.jpg"
              alt="User photo"
            />
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
                  to="/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeUserDropdown"
                >
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeUserDropdown"
                >
                  Settings
                </router-link>
              </li>
              <li>
                <router-link
                  to="/earnings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeUserDropdown"
                >
                  Earnings
                </router-link>
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click.prevent="logout"
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>

        <button
          @click="toggleMobileMenu"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-user"
          :aria-expanded="mobileMenuOpen"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
      </div>

      <div
        :class="[ mobileMenuOpen ? 'block' : 'hidden', 'w-full md:flex md:w-auto md:order-1' ]"
        id="navbar-user"
      >
        <ul class="flex flex-col font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 gap-4 md:flex-row md:mt-0 md:border-0 md:bg-white">
          <li>
            <router-link
              to="/"
              class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0"
              aria-current="page"
              @click="closeMobileMenu"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/about"
              class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              @click="closeMobileMenu"
            >
              About
            </router-link>
          </li>
          <li>
            <router-link
              to="/services"
              class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              @click="closeMobileMenu"
            >
              Services
            </router-link>
          </li>
          <li>
            <router-link
              to="/pricing"
              class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              @click="closeMobileMenu"
            >
              Pricing
            </router-link>
          </li>
          <li>
            <router-link
              to="/contact"
              class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              @click="closeMobileMenu"
            >
              Contact
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/loginStore';

const mobileMenuOpen = ref(false);
const userDropdownOpen = ref(false);
const router = useRouter();
const loginStore = useLoginStore();

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
