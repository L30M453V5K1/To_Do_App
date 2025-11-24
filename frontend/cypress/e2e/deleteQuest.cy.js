describe('Delete Quest', () => {
  it('should delete a quest', () => {
    cy.visit('http://localhost:3000');

    // Wait for quests to load
    cy.get('.quest-container').should('exist');

    // Intercept the DELETE request
    cy.intercept('DELETE', '**/api/index/*').as('deleteQuest');

    // Click the first delete button (red cross)
    cy.get('.delete-btn').first().click();

    // Wait for the backend request
    cy.wait('@deleteQuest').then((interception) => {
      // Extract questId from the URL
      const urlParts = interception.request.url.split('/');
      const deletedQuestId = urlParts[urlParts.length - 1];

      // Assert that the request was sent with a valid questId
      expect(Number(deletedQuestId)).to.be.a('number');

      // Assert backend responded with 200
      expect(interception.response.statusCode).to.eq(200);
    });

    // Verify the quest element is removed from the DOM
    cy.get('.quest-container').should('have.length.lessThan', 1);
  });
});