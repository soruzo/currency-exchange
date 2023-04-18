### Currency Exchange API
API para conversão de moedas desenvolvida com NestJS.

#### Requisitos
- Node.js 18
- PostgreSQL

#### Instalação
Clone este repositório e instale as dependências:
```
git clone https://github.com/seu-usuario/currency-exchange.git
cd currency-exchange
npm install
```
#### Configuração
Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=mypassword
POSTGRES_DATABASE=exchangeTemp
EXCHANGE_API_URL=https://api.apilayer.com/currency_data
EXCHANGE_API_KEY=your_api_key
```

Ajuste os valores de acordo com a configuração do seu banco de dados PostgreSQL e as credenciais da API de conversão de moedas.

##### Executando localmente
Para executar a aplicação localmente, use o comando:

npm run start:dev
A API estará disponível em `http://currencyexchange01-env.eba-pamddhb2.us-east-1.elasticbeanstalk.com/`

##### Documentação da API
A documentação da API está disponível através do Swagger em http://localhost:3000/api

##### Exemplos de teste com cURL

Criar uma nova conversão de moedas ('BRL', 'USD', 'EUR', 'JPY')
```
curl --location 'http://currencyexchange01-env.eba-pamddhb2.us-east-1.elasticbeanstalk.com/exchanges' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer jaya-test' \
--data '{
    "user_id": "user_id",
    "source_value": 1,
    "source_currency": "EUR",
    "target_currency": "BRL"
}'
```

Obter todas as conversões realizadas por um usuário
```
curl -X GET 'http://currencyexchange01-env.eba-pamddhb2.us-east-1.elasticbeanstalk.com/exchanges/{user_id}'
```

##### Estrutura de diretórios
```
src/
  controllers/         # Controladores da API
  dto/                 # Data Transfer Objects
  entities/            # Entidades do banco de dados
  gateways/            # Gateways para comunicação com serviços externos
  repositories/        # Repositórios para interação com o banco de dados
  services/            # Serviços que contêm a lógica de negócio
  app.module.ts        # Módulo principal da aplicação
  main.ts              # Ponto de entrada da aplicação
```
Se você tiver dúvidas ou encontrar problemas, sinta-se à vontade para abrir uma issue ou entrar em contato.
