describe('My App - Basic Test', () => {

  it('should load the homepage', () => {
    cy.visit('http://localhost:3000');
    cy.contains('QuestBoard');
  });

});
