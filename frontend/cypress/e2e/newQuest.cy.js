describe('Create New Quest', () => {

  it('should create a new quest via the modal', () => {
    // Visit your app
    cy.visit('http://localhost:3000');

    // Open the modal (adjust selector if your button is different)
    cy.get('#newQuestModal').then(($modal) => {
      $modal.addClass('show');
      $modal.css('display', 'block');
    });

    // Fill in the quest description
    cy.get('#newQuestDescription').type('Test Quest from Cypress');

    // Mark it as important
    cy.get('#newQuestImportant').check();

    // Intercept the POST request
    cy.intercept('POST', 'http://localhost:8080/api/index').as('createQuest');

    // Click apply
    cy.get('#applyNewQuest').click();

    // Wait for the request and verify it
    cy.wait('@createQuest').then((interception) => {
      expect(interception.request.body).to.deep.include({
        description: 'Test Quest from Cypress',
        important: true,
        repeatable: false
      });

      expect(interception.response.statusCode).to.eq(200);
    });
  });

});
