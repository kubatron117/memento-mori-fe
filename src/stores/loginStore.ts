// src/stores/loginStore.ts
import { defineStore } from 'pinia';
import { AccountLoginApiService } from '@/api/accountLoginApiService';
import type { AccountInfo } from '@/interfaces/login';
import { useLifeStore } from '@/stores/lifeStore'

export const useLoginStore = defineStore('loginStore', {
  state: () => ({
    isAuthenticated: false as boolean,
    accountInfo: null as AccountInfo | null,
  }),

  getters: {
    fullName(state): string {
      return state.accountInfo
        ? `${state.accountInfo.first_name} ${state.accountInfo.last_name}`
        : '';
    },
    email(state): string {
      return state.accountInfo?.email || '';
    },
    dateOfBirth(state): Date | null {
      return state.accountInfo?.date_of_birth || null;
    },
    estimatedLifespan(state): Date | null {
      return state.accountInfo?.estimated_lifespan || null;
    },
  },

  actions: {
    async setUser(): Promise<void> {
      try {
        const accountData = await AccountLoginApiService.getAccountInfo();
        this.accountInfo = accountData;

        this.isAuthenticated = true;
      } catch (error) {
        console.error('Chyba při načítání uživatele:', error);
        await this.logoutUser();
      }
    },

    async logoutUser(): Promise<boolean> {
      try {
        const status = await AccountLoginApiService.logout();

        if (status === 200 || status === 201) {
          this.accountInfo = null;
          this.isAuthenticated = false;
          const lifeStore = await useLifeStore();
          lifeStore.reset();
        }

        return status === 200 || status === 201;
      } catch (error) {
        console.error('Chyba při odhlašování:', error);
        return false;
      }
    },

    async checkAuthentication(): Promise<boolean> {
      if (!this.isAuthenticated) {
        await this.setUser();
      }
      return this.isAuthenticated;
    },
  },
});
