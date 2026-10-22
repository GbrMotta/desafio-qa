describe("Desafio Frontend - Practice Form", () => {
  // Funções para gerar valores aleatórios
  const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];
  const numeroCelular = () =>
    String(Math.floor(1000000000 + Math.random() * 9000000000));

  it("preenche o formulário e valida o popup", () => {
    const nome = sortear(["Ana", "Bruno", "Carla", "Diego", "Elisa"]);
    const sobrenome = sortear(["Silva", "Souza", "Lima", "Costa", "Rocha"]);
    const email = `teste${Date.now()}@exemplo.com`;

    // Acessa o site e navega pelo menu
    cy.visit("https://demoqa.com/");
    cy.contains("h5", "Forms").scrollIntoView().click();
    cy.contains("span", "Practice Form").click();

    // Preenche os campos de texto
    cy.get("#firstName").type(nome);
    cy.get("#lastName").type(sobrenome);
    cy.get("#userEmail").type(email);
    cy.get("#userNumber").type(numeroCelular());

    // Gênero (clica no texto, pois o botão em si fica escondido)
    cy.get('label[for="gender-radio-1"]').click();

    // Data de nascimento
    cy.get("#dateOfBirthInput").type("{selectall}15 Mar 1995{esc}");

    // Matéria (digita e clica na opção da lista)
    cy.get("#subjectsInput").type("Maths", { force: true });
    cy.contains('[class*="option"]', "Maths").click();

    // Hobbies (marca todos)
    cy.get('label[for^="hobbies-checkbox"]').click({ multiple: true });

    // Upload do arquivo .txt
    cy.get("#uploadPicture").selectFile("cypress/fixtures/upload.txt");

    // Endereço
    cy.get("#currentAddress").type("Rua dos Testes, 123");

    // Estado e cidade (o estado precisa ser escolhido antes da cidade)
    cy.get("#state").click();
    cy.contains('[class*="option"]', "NCR").click();
    cy.get("#city").click();
    cy.contains('[class*="option"]', "Delhi").click();

    // Envia o formulário
    cy.get("#submit").click({ force: true });

    // Garante que o popup abriu
    cy.get(".modal-content").should("be.visible");
    cy.get("#example-modal-sizes-title-lg").should(
      "have.text",
      "Thanks for submitting the form"
    );

    // Fecha o popup
        // Fecha o popup
    cy.get("body").type("{esc}");
    cy.get(".modal-content").should("not.exist");
  });
});