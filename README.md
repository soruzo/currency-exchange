# Currency Exchange API

API para conversão de moedas desenvolvida com NestJS.

## Requisitos

- Node.js 18
- PostgreSQL

## Instalação

Clone este repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/currency-exchange.git
cd currency-exchange
npm install

Configuração
Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:

makefile
Copy code
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DATABASE=mydatabase
Ajuste os valores de acordo com a configuração do seu banco de dados PostgreSQL.

Executando localmente
Para executar a aplicação localmente, use o comando:

bash
Copy code
npm run start:dev