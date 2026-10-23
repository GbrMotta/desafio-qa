describe("Desafio Frontend - Progress Bar", () => {
  // Lê o valor da barra (tenta o atributo aria-valuenow; senão, lê o texto)
  const lerValor = (barra) => {
    const doAtributo = parseInt(barra.getAttribute("aria-valuenow"));
    return isNaN(doAtributo) ? parseInt(barra.textContent) : doAtributo;
  };

  it("para a barra antes de 25%, completa até 100% e reseta", () => {
    // Acessa o site e navega pelo menu
    cy.visit("https://demoqa.com/");
    cy.contains("h5", "Widgets").scrollIntoView().click();
    cy.contains("span", "Progress Bar").click();

    // Coloca um "vigia" dentro da página: quando a barra chegar a 20%,
    // ele mesmo clica em Stop, na hora, sem esperar o Cypress
    cy.window().then((win) => {
      const doc = win.document;
      const area = doc.querySelector(".progress-bar").parentElement;

      const vigia = new win.MutationObserver(() => {
        const barra = doc.querySelector(".progress-bar");
        const botao = doc.querySelector("#startStopButton");
        if (barra && botao && lerValor(barra) >= 20) {
          vigia.disconnect();
          botao.click();
        }
      });

      vigia.observe(area, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });
    });

    // Inicia a barra
    cy.get("#startStopButton").scrollIntoView().click({ force: true });
    cy.get("#startStopButton").should("have.text", "Stop");

    // Espera o vigia parar a barra (o botão volta a mostrar "Start")
    cy.get("#startStopButton", { timeout: 15000 }).should("have.text", "Start");

    // Valida que o valor é menor ou igual a 25%
    cy.get(".progress-bar").then(($barra) => {
      const valor = lerValor($barra[0]);
      cy.log(`Valor ao parar: ${valor}%`);
      expect(valor).to.be.at.most(25);
    });

    // Inicia de novo e espera chegar a 100% (até 30 segundos)
    cy.get("#startStopButton").click({ force: true });
    cy.get(".progress-bar", { timeout: 30000 }).should("have.text", "100%");

    // Clica em Reset e confirma que a barra voltou a 0%
    cy.get("#resetButton").click({ force: true });
    cy.get(".progress-bar").should("have.text", "0%");
  });
});