// Teste para verificar o status da resposta
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

// Teste para verificar que a resposta é um objeto
pm.test("Response is a JSON object", function () {
    pm.response.to.be.json;
});

