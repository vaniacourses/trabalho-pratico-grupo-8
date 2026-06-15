# Aplicação de SOLID, GRASP e GoF Strategy — Pagamento e Busca

**Disciplina:** Projeto de Software  
**Módulo:** Interfaces de Pagamento e Busca + CRUD Pagamento  
**Padrão GoF aplicado:** Strategy  

---

## Descrição da Implementação

Este módulo implementa o fluxo de pagamentos do sistema de hospedagem por temporada e uma interface de busca para imóveis.

O pagamento foi modelado como um caso de uso transacional: o usuário informa a reserva, escolhe o método de pagamento e o sistema delega o processamento para uma estratégia específica. A API externa de pagamento foi simulada no frontend para fins acadêmicos, mantendo a mesma estrutura que seria usada com um provedor real.

A busca foi implementada na tela de listagem de imóveis, permitindo localizar imóveis por termo textual e filtrar por tipo, status e preço máximo por noite.

---

## Tecnologias e Frameworks

| Tecnologia | Uso |
|---|---|
| React | Construção das interfaces |
| Vite | Ambiente de desenvolvimento e build |
| React Router DOM | Navegação entre páginas |
| Axios | Comunicação com a API mock |
| JSON Server | Persistência mock em `db.json` |
| Tailwind CSS | Estilização das telas |
| Lucide React | Ícones da interface |

---

## Arquitetura Final do Módulo

```text
src/
├── components/
│   └── pagamentos/
│       └── PagamentoCard.jsx
├── pages/
│   ├── imoveis/
│   │   └── ListaImoveis.jsx
│   └── pagamentos/
│       ├── ListaPagamentos.jsx
│       ├── ProcessarPagamento.jsx
│       └── DetalhesPagamento.jsx
├── services/
│   └── pagamentoService.js
├── strategies/
│   ├── PagamentoStrategy.js
│   └── PagamentoStrategies.js
└── routes/
    └── AppRoutes.jsx
```

### Rotas

| Rota | Tela |
|---|---|
| `/pagamentos` | Lista todos os pagamentos |
| `/pagamentos/processar` | Processa um novo pagamento |
| `/pagamentos/:id` | Exibe detalhes de um pagamento |

---

## CRUD Pagamento

| Operação | Implementação |
|---|---|
| Create | `pagamentoService.processar()` cria um pagamento após validação e execução da estratégia |
| Read | `pagamentoService.listar()`, `buscarPorId()` e `buscarPorReserva()` |
| Update | `reembolsar()` e `consultarStatus()` alteram o status do pagamento |
| Delete | Não há exclusão física por rastreabilidade financeira |

Pagamentos não devem ser removidos fisicamente, pois representam registros financeiros. Em vez de excluir, o sistema altera o estado do pagamento para `recusado`, `pendente`, `aprovado` ou `reembolsado`.

---

## Padrão GoF: Strategy

### Contexto de uso

O sistema precisa processar pagamentos por diferentes métodos, como Pix, cartão de crédito e boleto bancário. Cada método possui regras próprias, campos específicos e comportamento diferente de confirmação.

### Problema que resolve

Sem o Strategy, o serviço de pagamento teria muitos condicionais para decidir como processar cada método. Isso deixaria o código mais acoplado e dificultaria a adição de novos métodos de pagamento.

### Como foi implementado

| Participante do padrão | Arquivo |
|---|---|
| Strategy | `PagamentoStrategy.js` |
| Concrete Strategy | `PixStrategy`, `CartaoCreditoStrategy`, `BoletoStrategy` |
| Context | `pagamentoService.js` |
| Factory auxiliar | `StrategyFactory` |

O `pagamentoService` recebe o método selecionado, solicita a estratégia correta para a `StrategyFactory` e chama o método `processar()` sem conhecer os detalhes da estratégia concreta.

```javascript
const strategy = StrategyFactory.criar(metodo);
const resultadoAPI = await strategy.processar(dadosPagamento);
```

### Estratégias disponíveis

| Estratégia | Responsabilidade |
|---|---|
| `PixStrategy` | Valida chave Pix e simula pagamento instantâneo |
| `CartaoCreditoStrategy` | Valida dados do cartão e simula autorização |
| `BoletoStrategy` | Gera boleto com status pendente e código de barras |

---

## SOLID

### S — Single Responsibility Principle

Cada arquivo possui uma responsabilidade clara:

| Arquivo | Responsabilidade |
|---|---|
| `PagamentoStrategy.js` | Define o contrato das estratégias |
| `PagamentoStrategies.js` | Implementa as estratégias concretas |
| `pagamentoService.js` | Orquestra processamento, persistência e consulta de pagamentos |
| `ListaPagamentos.jsx` | Exibe a lista de pagamentos |
| `ProcessarPagamento.jsx` | Coleta os dados necessários para processar um pagamento |
| `DetalhesPagamento.jsx` | Exibe detalhes e ações de um pagamento |
| `PagamentoCard.jsx` | Renderiza um resumo visual de um pagamento |
| `ListaImoveis.jsx` | Lista imóveis e aplica filtros de busca |

### O — Open/Closed Principle

O módulo está aberto para extensão e fechado para modificação. Para adicionar um novo método de pagamento, basta criar uma nova estratégia que estenda `PagamentoStrategy` e registrá-la na `StrategyFactory`.

### L — Liskov Substitution Principle

As estratégias `PixStrategy`, `CartaoCreditoStrategy` e `BoletoStrategy` podem ser usadas no lugar de `PagamentoStrategy`, pois todas implementam os mesmos métodos esperados: `processar`, `reembolsar`, `consultarStatus` e `getNome`.

### I — Interface Segregation Principle

Os componentes recebem apenas as props necessárias. `PagamentoCard`, por exemplo, recebe somente `pagamento` e `onReembolsar`, sem conhecer detalhes do serviço ou da API.

### D — Dependency Inversion Principle

O `pagamentoService` depende da abstração `PagamentoStrategy`, e não diretamente das classes concretas. A interface de usuário depende do serviço, sem acoplar-se às implementações de Pix, cartão ou boleto.

---

## GRASP

### Controller

`pagamentoService.js` atua como controlador do caso de uso de pagamento. Ele valida a reserva, verifica duplicidade, delega o processamento, persiste o resultado e atualiza o status quando necessário.

### Creator

`StrategyFactory` centraliza a criação das estratégias concretas. Isso evita que a interface ou o serviço precisem instanciar diretamente `PixStrategy`, `CartaoCreditoStrategy` ou `BoletoStrategy`.

### Information Expert

Cada estratégia é especialista no seu método de pagamento. A `PixStrategy` conhece as regras de Pix, a `CartaoCreditoStrategy` conhece os dados exigidos do cartão e a `BoletoStrategy` conhece o comportamento de boleto.

### Low Coupling

As telas de pagamento não conhecem os detalhes das estratégias nem da API externa simulada. Elas chamam o `pagamentoService`, que concentra a lógica de integração.

### High Cohesion

As classes e componentes mantêm responsabilidades coesas: estratégias processam métodos de pagamento, o serviço coordena o caso de uso, e os componentes cuidam da interface.

### Polymorphism

O comportamento variável de pagamento é resolvido por polimorfismo. O serviço chama `strategy.processar()` independentemente do método selecionado, eliminando condicionais de negócio no fluxo principal.

---

## Busca de Imóveis

A interface de busca foi implementada em `ListaImoveis.jsx`.

### Recursos

| Recurso | Descrição |
|---|---|
| Busca textual | Pesquisa em título, descrição, endereço, tipo e regras |
| Filtro por tipo | Filtra por tipos cadastrados no banco |
| Filtro por status | Permite visualizar imóveis ativos ou inativos |
| Filtro por preço | Limita o preço máximo por noite |
| Limpar filtros | Remove todos os critérios aplicados |

### Justificativa

A busca melhora a usabilidade do sistema e representa uma interface essencial para o domínio de hospedagem, pois usuários precisam localizar imóveis por características, localização e faixa de preço.

---

## Observações de Integração

A coleção `pagamentos` foi adicionada ao `db.json` com dados de exemplo. A coleção `reservas` será integrada por outro membro do grupo. Quando ela estiver disponível, o fluxo `pagamentoService.processar()` poderá validar reservas reais e atualizar seus status.

Como a API externa de pagamento é simulada, os métodos `processar`, `reembolsar` e `consultarStatus` usam funções internas assíncronas para representar latência, aprovação, pendência e falha de comunicação.
