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

    cy.wait(3000);

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
  });
});
