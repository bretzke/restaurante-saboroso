# Projeto Restaurante Saboroso

Projeto consiste em simular um site de um restaurante onde é possível o cliente efetuar reservas, deixar um contato, cadastrar e-mail para newsletter além de interagir com seções que podem ser incrementadas na área admin como o cardápio do restaurante. Na área admin podemos fazer todo o gerenciamento dessas informações, além disso o projeto utiliza de conceitos como rotas, CRUD, respostas em tempo real, eventos, orientação a objeto, entre outros.

As seguintes tecnologias foram utilizadas:

- HTML
- CSS
- JavaScript
- MySql
- Socket.io
- Express
- Entre outras

# Iniciando

Para iniciar o projeto basta dar o seguinte comando na pasta raíz:

```
npm install
```

Após o comando é necessário instalar o bower para rodar corretamente o CSS da área admin por isso é necessário acessar o seguinte caminho /public/admin e rodar o comando:

```
bower install
```

Após o comando basta configurar o banco de dados local indo no arquivo /inc/db.js e passar as respectivas configurações. Feito essas etapas basta rodar o comando "npm start" e acessar a porta 3000.

# Dica

Para iniciar e popular o banco de dados basta executar o arquivo /start.sql