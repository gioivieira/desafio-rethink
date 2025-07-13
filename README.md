# Testes de API (Rethink Bank Test)

Neste projeto foi feita a criação de testes para a API "Rethink Bank Test" usando Jest. Os resultados dos testes são evidenciados em `test-report.html`. Abaixo farei o apontamento de alguns bugs e possíveis melhorias na API.

# Perguntas

a- Há bugs? Se sim, quais são e quais são os cenários esperados? Sim, os bugs encontrados foram:

1. No endpoint `/caixinha/deposit` o depósito não está sendo realizado de fato, verificando o código do endpoint conclui que o problema pode estar relacionado a linha `701` que apenas seleciona "normal_balance" e não seleciona "piggy_bank_balance" que é usado na linha `707`. No caso de teste abaixo, ao tentar fazer o resgate, o bug foi acusado.

- Dado que o usuário está autenticado, Quando enviar valor válido, Então deve sinalizar que o resgate foi realizado e status 200

2. No endpoint `/caixinha/deposit` é possível enviar saldos inválidos para depósito, como "Cem" ou "-100". Nos caso de teste abaixo, ao tentar enviar valor inválido e não receber nenhum erro, o bug foi acusado.

- Dado que o usuário está autenticado, Quando enviar valor inválido, Então deve sinalizar que o valor do depósito é inválido e status 400

3. No endpoint `/caixinha/withdraw` é possível enviar saldos inválidos para resgatar, como "Cem" ou "-100". Nos caso de teste abaixo, ao tentar enviar valor inválido e não receber nenhum erro, o bug foi acusado.

- Dado que o usuário está autenticado, Quando enviar valor inválido, Então deve sinalizar que o valor do resgate é inválido e status 400

b- Se houver bugs, classifique-os em nível de criticidade.

Bug 1 - Alta criticidade

- Descrição: O depósito na caixinha (/caixinha/deposit) não está sendo realizado.

- Motivo da criticidade: Esse bug compromete uma funcionalidade importante do sistema que é o depósito de valores, o que impede os resgates e as consultas corretas de saldo, afetando a confiabilidade e usabilidade da API.

Bugs 2 e 3 - Média criticidade

- Descrição: Aceita valores inválidos como "Cem" ou -100 no depósito e resgate (/caixinha/deposit e /caixinha/withdraw).

- Motivo da criticidade: Embora não impeçam diretamente o funcionamento, representam falhas na validação de entrada. Isso pode gerar inconsistência de dados e comportamento inesperado na API.

c- Diante do cenário, o sistema está pronto para subir em produção?

Não, diante dos bugs encontrados é melhor que correções sejam realizadas antes do lançamento. Enquanto as correções são feitas, deixo como sugestão algumas melhorias. :)

1. É importante que haja uma validação de CPF, para que não possam ser enviados CPFs que fogem ao algoritmo oficial da Receita Federal.

2. Mensagens de erro `duplicate key value violates unique constraint \"users_cpf_key\"` e `duplicate key value violates unique constraint \"users_email_key\"` estão vindo do banco, é melhor que o endpoint trate os erros e traga mensagens mais descritivas.  

## Desenvolvedora

- <a href="https://github.com/gioivieira" target="_blank"><p>Giovana Inez Vieira</p></a>

## Como Executar o Projeto

### Configuração do .env

Antes de rodar os testes, é necessário criar um arquivo `.env` com base no `.env.example` fornecido no projeto. Altere os valores conforme a necessidade e descrição das variáveis no arquivo.

1. Copie o arquivo `.env.example` para `.env`:
```bash
   cp .env.example .env
```

### Pré-requisitos

- Node.js instalado.
- npm ou yarn instalado.

### Instalação

1. Clone o repositório:
```bash
   git clone https://github.com/gioivieira/desafio-rethink.git
```

2. Navegue até a pasta do projeto:
```bash
   cd desafio-rethink
```

### Rodando os Testes

- Para executar os testes automatizados, use o seguinte comando:
```bash
   npm start
```

Isso fará o npm install e rodará todos os testes da pasta src/tests/.
