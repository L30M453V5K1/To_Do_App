describe('Quest Sorting - Descending Order', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Adjust URL if needed
  });

  it('Sorts quests by descending order when "Sort Descending" is clicked', () => {
    // Click the "Sort Descending" button forcibly
    cy.get('#sort-descending').click({ force: true });

    // Grab all quest IDs from the rendered list
    cy.get('.quest-container').then(($quests) => {
      const ids = $quests.map((index, el) => parseInt(el.getAttribute('data-id'))).get();

      // Check that the array is sorted in descending order
      const sorted = [...ids].sort((a, b) => b - a);
      expect(ids).to.deep.equal(sorted);
    });
  });

  it('Preserves quest IDs after sorting (no reset to 1, 2, ...)', () => {
    cy.get('#sort-descending').click({ force: true });

    cy.get('.quest-container').each(($el) => {
      const dataId = parseInt($el.attr('data-id'));
      const displayText = $el.find('.quest-desc').text().trim();
      expect(displayText).to.include(dataId.toString());
    });
  });
});