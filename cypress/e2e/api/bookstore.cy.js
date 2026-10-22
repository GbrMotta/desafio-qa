describe("Desafio API - BookStore", () => {
  const baseUrl = "https://demoqa.com";

  // Nome único a cada execução (o site não aceita nome repetido)
  const user = {
    userName: `qa_user_${Date.now()}`,
    password: "Senha@12345",
  };

  it("cria usuário, autoriza, lista e reserva livros", () => {
    let userId;
    let token;
    let isbns;

    // 1. Criar usuário
    cy.request("POST", `${baseUrl}/Account/v1/User`, user)
      .then((res) => {
        expect(res.status).to.eq(201);
        userId = res.body.userID;

        // 2. Gerar token de acesso
        return cy.request("POST", `${baseUrl}/Account/v1/GenerateToken`, user);
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.status).to.eq("Success");
        token = res.body.token;

        // 3. Confirmar se o usuário está autorizado
        return cy.request("POST", `${baseUrl}/Account/v1/Authorized`, user);
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.eq(true);

        // 4. Listar os livros disponíveis
        return cy.request("GET", `${baseUrl}/BookStore/v1/Books`);
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.books.length).to.be.greaterThan(1);

        // Escolhe dois livros (o 1º e o 2º da lista)
        isbns = [res.body.books[0].isbn, res.body.books[1].isbn];

        // 5. Reservar os dois livros
        return cy.request({
          method: "POST",
          url: `${baseUrl}/BookStore/v1/Books`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            userId: userId,
            collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
          },
        });
      })
      .then((res) => {
        expect(res.status).to.eq(201);

        // 6. Listar os detalhes do usuário com os livros reservados
        return cy.request({
          method: "GET",
          url: `${baseUrl}/Account/v1/User/${userId}`,
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.userId).to.eq(userId);
        expect(res.body.books).to.have.length(2);

        const isbnsReservados = res.body.books.map((livro) => livro.isbn);
        expect(isbnsReservados).to.include.members(isbns);
      });
  });
});