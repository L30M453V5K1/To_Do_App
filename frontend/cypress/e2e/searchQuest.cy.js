describe('Search Quest Functionality', () => {
  beforeEach(() => {
    // Visit your app before each test
    cy.visit('http://localhost:3000');
  });

  it('should find a quest with the description "opis"', () => {
    // Ensure the search input is visible
    cy.get('#search-input').should('be.visible');

    // Type "opis" into the search input
    cy.get('#search-input')
      .clear()
      .type('opis');

    // Click the search button
    cy.get('#search-quest-btn').click();

    // Wait a little for the fetch and DOM update (you can adjust time if needed)
    cy.wait(500);

    // Assert that at least one quest with "opis" in the description is visible
    cy.get('.quest-desc')
      .should('contain.text', 'opis');
  });
});