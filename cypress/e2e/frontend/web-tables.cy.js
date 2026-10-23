describe("Desafio Frontend - Web Tables", () => {
  // E-mail único para achar o nosso registro entre os outros da tabela
  const email = `teste${Date.now()}@exemplo.com`;

  // Acha a linha da tabela que contém o nosso e-mail
  const linha = () =>
    cy.contains(email).closest('[role="row"], tr, .rt-tr-group');

  it("cria, edita e deleta um registro", () => {
    // Acessa o site e navega pelo menu
    cy.visit("https://demoqa.com/");
    cy.contains("h5", "Elements").scrollIntoView().click();
    cy.contains("span", "Web Tables").click();

    // 1. Criar o registro
    cy.get("#addNewRecordButton").click();
    cy.get("#firstName").type("Ana");
    cy.get("#lastName").type("Silva");
    cy.get("#userEmail").type(email);
    cy.get("#age").type("30");
    cy.get("#salary").type("5000");
    cy.get("#department").type("QA");
    cy.get("#submit").click();

    // Confirma que o registro apareceu na tabela
    cy.contains(email).should("be.visible");

    // 2. Editar o registro (ícone do lápis: Edit)
    linha().find('[title="Edit"]').click({ force: true });
    cy.get("#firstName").clear().type("Ana Maria");
    cy.get("#salary").clear().type("7000");
    cy.get("#submit").click();

    // Confirma que a linha mostra os novos valores
    linha().should("contain", "Ana Maria").and("contain", "7000");

    // 3. Deletar o registro (ícone da lixeira: Delete)
    linha().find('[title="Delete"]').click({ force: true });

    // Confirma que o registro sumiu da tabela
    cy.contains(email).should("not.exist");
  });
});