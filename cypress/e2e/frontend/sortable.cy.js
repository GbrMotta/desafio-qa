describe("Desafio Frontend - Sortable", () => {
  const itens = "#demo-tabpane-list .list-group-item";
  const ordemCerta = ["One", "Two", "Three", "Four", "Five", "Six"];

  // Lê o texto de cada item, na ordem em que aparecem na tela
  const lerOrdem = ($itens) =>
    [...$itens].map((el) => el.textContent.trim());

  // Simula o mouse: aperta no item de origem, move até o destino e solta
  const arrastar = (origem, destino) => {
    const o = origem.getBoundingClientRect();
    const d = destino.getBoundingClientRect();
    const x = o.left + o.width / 2;
    const yOrigem = o.top + o.height / 2;
    const yDestino = d.top + d.height / 2;

    cy.wrap(origem)
      .trigger("mousedown", { button: 0, clientX: x, clientY: yOrigem, force: true })
      .trigger("mousemove", { clientX: x, clientY: yOrigem - 5, force: true })
      .trigger("mousemove", { clientX: x, clientY: yDestino, force: true })
      .trigger("mouseup", { clientX: x, clientY: yDestino, force: true });
  };

  // Acha o primeiro item fora do lugar, arrasta e repete até ficar em ordem
  const organizar = (tentativas = 0) => {
    cy.get(itens).then(($itens) => {
      const atual = lerOrdem($itens);
      const posicaoErrada = ordemCerta.findIndex((texto, i) => atual[i] !== texto);

      if (posicaoErrada === -1) return; // já está em ordem

      if (tentativas >= 20) {
        throw new Error(`Não consegui ordenar. Ordem atual: ${atual.join(", ")}`);
      }

      const origem = $itens[atual.indexOf(ordemCerta[posicaoErrada])];
      const destino = $itens[posicaoErrada];
      arrastar(origem, destino);

      cy.wait(500); // espera a animação da lista terminar
      organizar(tentativas + 1);
    });
  };

  it("ordena a lista em ordem crescente", () => {
    // Acessa o site e navega pelo menu
    cy.visit("https://demoqa.com/");
    cy.contains("h5", "Interactions").scrollIntoView().click();
    cy.contains("span", "Sortable").click();

    // Ordena arrastando os itens
    organizar();

    // Confirma que a ordem final está correta
    cy.get(itens).then(($itens) => {
      expect(lerOrdem($itens)).to.deep.equal(ordemCerta);
    });
  });
});