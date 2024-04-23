# ProjetoOnfly

O presente projeto foi desenvolvido em typescript e contem :

- cadastro de usuario
- autenticador
- crud para manipular despesas

# Tecnologias

principais tecnologias utilizadas:

- typescript
- mongoDB
- express
- jest
- .env

# Execução do projeto

Para executar o projeto é necessário instalar as dependencias utilizando npm ou yarn e após isto rodar o comando npm/yarn build para criar a dist em javascript. Após criada a dist somente rodar yarn/npm start.

# Observação

Validar se possui o arquivo .env no projeto com os valores. Embora não seja a melhor prática ele está presente no github do projeto para fins de teste.
Todas as rotas de dispesas (/expenses) é necessário estar autenticado, então passar o authorization com o valor do token criado na rota de login para ter acesso.

# Testes

Para rodar os testes de integração é necessário que tenha um usuario ativo no banco

para criar um usuario : http://localhost:3000/user/register e através do payload abaixo crie um usuario com email valido, pois será necessário para o recebimento de confirmação da despesa cadastrada.
{
"email": "emailvalido@gmail.com",
"password": "123456ab"
}

após a criação do usuario adicionar o \_id no documento expenseIntegration.test.ts na atribuição da variavel token conforme abaixo
const token = jwt.sign({ \_id: "6625f08688e2ac2e052e01f7" }, JWT_SECRET, {
expiresIn: "6h",
});

após pode rodar normalmente npm test que irá executar o teste de integração e o teste unitário.

# Modelos

http://localhost:3000/expenses/

Para criar uma despesa
{
"description":"testando o fluxo8",
"date":"25/02/2024",
"value":-99
}

http://localhost:3000/user/register

{
"email": "henriquen1@gmail.com",
"password": "123456ab"
}

http://localhost:3000/login

{
"email": "henrique1@gmail.com",
"password": "123456ab"
}

# Evidencias

![image](https://github.com/henriquebh8/ProjetoOnfly/assets/87495080/53bdd9f5-1d3a-40b5-b154-282eab156386)

![image](https://github.com/henriquebh8/ProjetoOnfly/assets/87495080/738e666e-2702-45fc-97db-47855f3319e3)

![image](https://github.com/henriquebh8/ProjetoOnfly/assets/87495080/7ebd673d-d39d-4ca5-8842-df12e1bcbed6)

![image](https://github.com/henriquebh8/ProjetoOnfly/assets/87495080/7aefd343-73b7-446b-b464-e0f28f52619e)

![image](https://github.com/henriquebh8/ProjetoOnfly/assets/87495080/d115f81d-4f01-432e-9818-1e85b73fa975)





