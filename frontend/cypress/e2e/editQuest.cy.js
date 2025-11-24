describe('Edit Quest', () => {
  it('should edit a quest description and apply changes', () => {
    cy.visit('http://localhost:3000');

    // Wait for quests to load
    cy.get('.quest-container').should('exist');

    // Click the first "Edit Quest" button
    cy.get('.edit-btn').first().click();

    // Wait until modal is fully visible
    cy.get('#editQuestModal').should('be.visible');

    // Set the input value directly (reliable)
    cy.get('#editQuestDescription')
      .invoke('val', 'Updated quest from Cypress')
      .trigger('input');

    // Verify input value
    cy.get('#editQuestDescription')
      .invoke('val')
      .should('eq', 'Updated quest from Cypress');

    // Intercept PUT request
    cy.intercept('PUT', '**/api/index/*').as('updateQuest');

    // Click Apply
    cy.get('#applyEditQuest').click({ force: true });

    // Assert the backend request
    cy.wait('@updateQuest').then((interception) => {
      expect(interception.request.body).to.have.property(
        'description',
        'Updated quest from Cypress'
      );
      expect(interception.response.statusCode).to.eq(200);
    });
  });
});
