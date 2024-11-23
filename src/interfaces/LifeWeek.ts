export interface LifeWeek {
  year: number; // Rok, ve kterém se týden nachází
  weekNumber: number; // Číslo týdne v roce (1-53)
  startDate: Date; // Počáteční datum týdne
  endDate: Date; // Konečné datum týdne
  isCurrentWeek: boolean; // Indikátor, zda je tento týden aktuální
  // Přidejte další pole podle potřeby
  additionalInfo?: string; // Například důležité události v tomto týdnu
}
