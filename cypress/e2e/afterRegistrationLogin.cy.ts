/* ==== Test Created with Cypress Studio ==== */
it('questionaireAfterRegistration', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('localhost:3111');
  cy.get('#email1').clear('john@doe.cypress');
  cy.get('#email1').type('john@doe.cypress');
  cy.get('#password1').clear('P');
  cy.get('#password1').type('Cypress123!!');
  cy.get('.p-button').click();
  cy.get('#birthDate').clear('2');
  cy.get('#birthDate').type('20.11.2000{enter}');
  cy.get('#undefined_steppanel_1 > .flex > .p-button').click();
  cy.get('#undefined_steppanel_2 > .min-h-\\[70vh\\] > .bg-white > .space-y-4 > :nth-child(1) > .ml-2').click();
  cy.get('#gender_male').check();
  cy.get('#undefined_steppanel_2 > .justify-between > [aria-label="Next"] > .p-button-icon').click();
  cy.get('.p-select-label').click();
  cy.get('.p-iconfield > .p-inputtext').clear('c');
  cy.get('.p-iconfield > .p-inputtext').type('cze');
  cy.get('#pv_id_31_0').click();
  cy.get('#undefined_steppanel_3 > .justify-between > [aria-label="Next"] > .p-button-label').click();
  cy.get('#smoke-yes').check();
  cy.get('#pv_id_96').clear('1');
  cy.get('#pv_id_96').type('18');
  cy.get('#pv_id_100').clear('2');
  cy.get('#pv_id_100').type('22');
  cy.get(':nth-child(3) > .space-x-6').click();
  cy.get('#undefined_steppanel_4 > .justify-between > [aria-label="Next"] > .p-button-label').click();
  cy.get('#alkohol-ne').check();
  cy.get('#undefined_steppanel_5 > .justify-between > [aria-label="Next"] > .p-button-label').click();
  cy.get('#moderate').check();
  cy.get('#pv_id_53').click();
  cy.get('#pv_id_53').clear('1');
  cy.get('#pv_id_53').type('129');
  cy.get('#undefined_steppanel_6 > .justify-between > [aria-label="Next"] > .p-button-icon').click();
  cy.get('#undefined_steppanel_7 > .min-h-\\[70vh\\] > .bg-white > .space-y-4 > :nth-child(2) > .ml-2').click();
  cy.get('#feasible').check();
  cy.get('.mt-6 > .border').clear('1');
  cy.get('.mt-6 > .border').type('19');
  cy.get('#undefined_steppanel_7 > .min-h-\\[70vh\\] > .bg-white').click();
  cy.get('#undefined_steppanel_7 > .justify-between > [aria-label="Next"]').click();
  /* ==== End Cypress Studio ==== */
});
