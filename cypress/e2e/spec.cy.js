describe("Meu primeiro teste", () => {
  it("abre o site demoqa", () => {
    cy.visit("https://demoqa.com/");
    cy.contains("Elements").should("be.visible");
  });
});