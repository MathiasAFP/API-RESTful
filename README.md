
# API-RESTful – Gerenciamento de Projetos e Tarefas 

Um sistema back-end + front-end para gerenciar projetos e tarefas, usando arquitetura RESTful. Permite criar, listar, atualizar e deletar projetos e tarefas.  

## Funcionalidades

- CRUD de projetos (criar, ler, atualizar, deletar)  
- CRUD de tarefasassociadas aos projetos  
- Front-end consome API
- Banco de dados noSQL para armazenamento de dados (MongoDB) 

##  Tecnologias utilizadas

- Back-end: Node.js + Express  
- Banco de dados: MongoDB  
- Front-end: React + TailwindCSS  
- Outras: dotenv, cors, mongoose

##  Executando em ambiente de desenvolvimento

### Pré-requisitos

- Node.js instalado
- MongoDB rodando(.env fornecido)

### Passos para rodar

1. Clone o repositório  
   - git clone https://github.com/MathiasAFP/API-RESTful.git
   - cd API-RESTful

2. Rode o Backend
    - Cd Backend
    - cole o arquivo .env fornecido
    - node server.js

3. Rodar Frontend
    - Cd Frontend
    - npm run dev

