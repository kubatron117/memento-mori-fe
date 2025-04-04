describe('Registration and verification', () => {
  function generateRandomEmail() {
    const randomStr = Math.random().toString(36).substring(2, 11);
    return `${randomStr}@random.cypress`;
  }

  it('registration and account verification', function() {
    const email = generateRandomEmail();

    cy.visit('localhost:3111');
    cy.get('.underline').click();
    cy.get('#firstName').clear();
    cy.get('#firstName').type('Johm');
    cy.get('#lastName').clear();
    cy.get('#lastName').type('Doe');
    cy.get('#email').clear();
    cy.get('#email').type(email);
    cy.get('#password').clear();
    cy.get('#password').type('Cypress123!!');
    cy.get('#passwordConfirm').clear();
    cy.get('#passwordConfirm').type('Cypress123!!');
    cy.get('.flex > span').click();
    cy.get('.p-checkbox-input').check();
    cy.get('.p-button').click();

    cy.wait(1500);

    // Načteme emaily z MailHog
    cy.request('GET', 'http://localhost:8025/api/v2/messages')
      .its('body')
      .then((body) => {
        const foundEmail = body.items.find(item => {
          const headers = item.Content.Headers;
          return headers.To && headers.To.includes(email) &&
            headers.Subject && headers.Subject.includes("Verify Account");
        });
        expect(foundEmail, 'Email s verifikačním odkazem byl nalezen').to.exist;

        const decodedBody = foundEmail.Content.Body
          .replace(/=\r\n/g, "")
          .replace(/=3D/g, "=");

        const linkRegex = /http:\/\/localhost:3111\/verify-account\?key=\S+/;
        const match = decodedBody.match(linkRegex);
        expect(match, 'Verifikační odkaz je v emailu přítomen').to.exist;
        const verificationLink = match[0];

        cy.log('Nalezený verifikační odkaz: ' + verificationLink);

        cy.visit(verificationLink);
      });
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#birthDate').clear('1');
    cy.get('#birthDate').type('11.11.2000{enter}');
    cy.get('#undefined_steppanel_1 > .flex > .p-button > .p-button-label').click();
    cy.get('#undefined_steppanel_2 > .min-h-\\[70vh\\] > .bg-white > .space-y-4 > :nth-child(1) > .ml-2').click();
    cy.get('#gender_male').check();
    cy.get('#undefined_steppanel_2 > .justify-between > [aria-label="Next"]').click();
    cy.get('.p-select-label').click();
    cy.get('.p-iconfield > .p-inputtext').clear('c');
    cy.get('.p-iconfield > .p-inputtext').type('czechi');
    cy.get('#pv_id_30_0').click();
    cy.get('#undefined_steppanel_3 > .justify-between > [aria-label="Next"]').click();
    cy.get('#smoke-yes').check();
    cy.get('#pv_id_95').clear('1');
    cy.get('#pv_id_95').type('16');
    cy.get('#pv_id_99').clear('1');
    cy.get('#pv_id_99').type('11');
    cy.get('.space-y-6 > :nth-child(3)').click();
    cy.get('#undefined_steppanel_4 > .justify-between > [aria-label="Next"] > .p-button-icon').click();
    cy.get('#undefined_steppanel_5 > .min-h-\\[70vh\\] > .bg-white > div.mb-6 > .space-x-6 > :nth-child(1)').click();
    cy.get('#alkohol-ano').check();
    cy.get('#pv_id_125').click();
    cy.get('#pv_id_125').clear('12');
    cy.get('#pv_id_125').type('12');
    cy.get('#pv_id_113').click();
    cy.get('#pv_id_113').clear('1');
    cy.get('#pv_id_113').type('11');
    cy.get('#undefined_steppanel_5 > .min-h-\\[70vh\\]').click();
    cy.get('#undefined_steppanel_5 > .justify-between > [aria-label="Next"] > .p-button-icon').click();
    cy.get('.flex-col > :nth-child(2) > .ml-2').click();
    cy.get('#moderate').check();
    cy.get('#pv_id_52').click();
    cy.get('#pv_id_52').clear('1');
    cy.get('#pv_id_52').type('136');
    cy.get('#undefined_steppanel_6 > .min-h-\\[70vh\\] > .bg-white').click();
    cy.get('#undefined_steppanel_6 > .justify-between > [aria-label="Next"] > .p-button-icon').click();
    cy.get('#undefined_steppanel_7 > .min-h-\\[70vh\\] > .bg-white > .space-y-4 > :nth-child(2) > .ml-2').click();
    cy.get('#feasible').check();
    cy.get('.mt-6 > .border').clear('1');
    cy.get('.mt-6 > .border').type('19');
    cy.get('#undefined_steppanel_7 > .min-h-\\[70vh\\] > .bg-white').click();
    cy.get('#undefined_steppanel_7 > .justify-between > [aria-label="Next"] > .p-button-label').click();
    cy.wait(4500);
    cy.get('[aria-label="Save"] > .p-button-icon').click();
    cy.get('.p-confirmdialog-accept-button > .p-button-label').click();
    /* ==== End Cypress Studio ==== */
  });
});
