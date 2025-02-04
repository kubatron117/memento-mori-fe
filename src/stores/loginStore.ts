// src/stores/loginStore.ts
import { defineStore } from 'pinia'
import type { AccountInfo } from '@/interfaces/login'

export const useLoginStore = defineStore('loginStore', {
  state: () => ({
    accountInfo: null as AccountInfo | null
  }),
  actions: {
    setAccountInfo(info: AccountInfo) {
      this.accountInfo = info
      console.log(info)
    },
    clearAccountInfo() {
      this.accountInfo = null
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.accountInfo
  }
})
