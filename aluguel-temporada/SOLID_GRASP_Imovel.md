# Aplicação de SOLID e GRASP — Gerenciamento de Imóveis

**Disciplina:** Projeto de Software  
**Desenvolvedor:** Pedro Henrique Chagas  
**Módulo:** Gerenciamento de Imóveis  

---

## SOLID

### S — Single Responsibility Principle (Princípio da Responsabilidade Única)
Cada arquivo possui uma única responsabilidade bem definida:

| Arquivo | Responsabilidade |
|---|---|
| `ImovelBuilder.js` | Apenas constrói o objeto imóvel |
| `imovelService.js` | Apenas comunica com a API |
| `GerenciarFotos.jsx` | Apenas gerencia upload e ordenação de fotos |
| `GerenciarComodidades.jsx` | Apenas gerencia seleção de comodidades |
| `CurrencyInput.jsx` | Apenas formata valores monetários |
| `EnderecoInput.jsx` | Apenas gerencia campos de endereço |
| `DisponibilidadeCard.jsx` | Apenas exibe um período de disponibilidade |

---

### O — Open/Closed Principle (Princípio Aberto/Fechado)
- **`ImovelBuilder.js`**: aberto para extensão — novos atributos podem ser adicionados via novos métodos `set` sem modificar o método `build()`
- **`comodidades.js`**: novas comodidades podem ser adicionadas à lista sem alterar nenhum componente que as consome

---

### L — Liskov Substitution Principle (Princípio da Substituição de Liskov)
- Os componentes `PassosDadosImovel`, `PassosDisponibilidade` e `PassosAtivarImovel` são intercambiáveis dentro do wizard `CadastrarImovelWizard`
- Cada um recebe a prop `onConcluir` e pode ser substituído sem quebrar o fluxo geral da aplicação

---

### I — Interface Segregation Principle (Princípio da Segregação de Interfaces)
Cada componente recebe exatamente as props que precisa, nada além:

| Componente | Props recebidas |
|---|---|
| `GerenciarFotos` | `{ fotos, onChange }` |
| `GerenciarComodidades` | `{ selecionadas, onChange }` |
| `CurrencyInput` | `{ value, onChange, placeholder }` |
| `EnderecoInput` | `{ value, onChange }` |

---

### D — Dependency Inversion Principle (Princípio da Inversão de Dependência)
- `CadastrarImovel.jsx` e `EditarImovel.jsx` dependem de abstrações (`imovelService`, `ImovelBuilder`) e não de implementações concretas
- `CadastrarImovelWizard.jsx` depende dos serviços via importação, não instancia dependências diretamente
- Se a API mudar de JSON Server para um backend real, basta alterar os `services` — as páginas não precisam ser modificadas

---

## GRASP

### Creator (Criador)
- **`CadastrarImovelWizard.jsx`** é o responsável por criar o imóvel — agrega todos os dados dos passos e chama `imovelService.criar()`. Faz sentido pois é o componente que possui todas as informações necessárias para a criação

---

### Information Expert (Especialista na Informação)
- **`ImovelBuilder.js`**: especialista em construir um imóvel — centraliza validações e montagem do objeto
- **`disponibilidadeService.verificarSobreposicao()`**: a lógica de verificação de sobreposição de períodos está no service de disponibilidade, pois é quem detém o conhecimento sobre esse domínio
- **`calcularValorTotal()`** em `imovelUtils.js`: operação relacionada ao domínio do imóvel, centralizada no utilitário correto

---

### High Cohesion (Alta Coesão)
- **`GerenciarFotos.jsx`**: coeso, trata exclusivamente de upload e ordenação de fotos
- **`GerenciarComodidades.jsx`**: coeso, trata exclusivamente de seleção de comodidades
- **`disponibilidadeService.js`**: todas as operações dizem respeito exclusivamente à disponibilidade

---

### Low Coupling (Baixo Acoplamento)
- `GerenciarFotos` e `GerenciarComodidades` não conhecem o imóvel — recebem e devolvem dados via props, sem acoplamento direto com outras entidades
- Os `services` são os únicos que conhecem a URL da API — as páginas não sabem de onde vêm os dados
- `ImovelBuilder` não conhece o service — apenas constrói o objeto, sem dependência de infraestrutura

---

### Controller (Controlador)
- **`CadastrarImovelWizard.jsx`**: age como controller do fluxo transicional — orquestra os passos, chama os services e decide as transições de estado entre UC05, UC06 e UC07
- **`ListaImoveis.jsx`**: controla as ações de editar e excluir, delegando a execução para o service correspondente

---

### Pure Fabrication (Fabricação Pura)
- **`imovelUtils.js`**: não representa uma entidade do domínio — foi criado para abrigar funções utilitárias como `calcularValorTotal()` sem poluir outros componentes
- **`comodidades.js`**: não é uma entidade de negócio — é uma fabricação pura para centralizar os dados de comodidades disponíveis no sistema

---

## Violação Identificada e Corrigida

### Contexto
No início da implementação, o componente `CadastrarImovel.jsx` foi desenvolvido concentrando múltiplas responsabilidades em um único arquivo:
- Gerenciamento dos dados do imóvel
- Upload e ordenação de fotos
- Seleção de comodidades

### Princípios violados
- **SRP (SOLID)**: o componente tinha mais de uma razão para mudar
- **High Cohesion (GRASP)**: baixa coesão pela mistura de responsabilidades distintas

### Correção aplicada
As responsabilidades foram extraídas para componentes dedicados:
- `GerenciarFotos.jsx` — responsável exclusivamente pelas fotos
- `GerenciarComodidades.jsx` — responsável exclusivamente pelas comodidades

`CadastrarImovel.jsx` passou a apenas **orquestrar** esses componentes, delegando cada responsabilidade ao componente correto.

### Resultado
- Componentes reutilizados em `CadastrarImovel.jsx`, `EditarImovel.jsx` e `PassosDadosImovel.jsx`
- Código mais coeso, testável e manutenível
- Alinhamento com SRP e High Cohesion

---

