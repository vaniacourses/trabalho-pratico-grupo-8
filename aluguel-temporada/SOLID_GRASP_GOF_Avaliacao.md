# Aplicação de SOLID, GRASP e GoF Template Method — Avaliação, Denúncia e Relatório

**Disciplina:** Projeto de Software  
**Módulo:** Interfaces de Avaliação, Denúncia e Relatório + CRUD Avaliação  
**Padrão GoF aplicado:** Template Method  

---

## Descrição da Implementação

Este módulo implementa o fluxo de avaliações do sistema de hospedagem por temporada, além das interfaces de denúncia e relatório.

A avaliação foi modelada como um caso de uso com duas variações: o hóspede avalia o imóvel onde se hospedou, e o anfitrião avalia o comportamento do hóspede. O fluxo de criação segue sempre os mesmos passos, mas cada tipo possui regras e destinos diferentes. O Template Method foi aplicado para definir esse esqueleto fixo e permitir que cada variação implemente seus próprios detalhes.

A denúncia foi implementada como um formulário simples onde qualquer usuário pode registrar uma violação dos termos de uso. O relatório consolida as avaliações de um imóvel, exibindo métricas como nota média, distribuição de notas e médias por categoria.

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

## Arquitetura do Módulo

```text
src/
├── templates/
│   ├── AvaliacaoBase.js
│   ├── AvaliacaoHospede.js
│   └── AvaliacaoAnfitriao.js
├── components/
│   └── avaliacao/
│       └── AvaliacaoCard.jsx
├── pages/
│   ├── avaliacoes/
│   │   ├── ListaAvaliacoes.jsx
│   │   ├── CadastrarAvaliacao.jsx
│   │   └── EditarAvaliacao.jsx
│   ├── denuncias/
│   │   └── CadastrarDenuncia.jsx
│   └── relatorios/
│       └── RelatorioImovel.jsx
├── services/
│   ├── avaliacaoService.js
│   └── denunciaService.js
└── routes/
    └── AppRoutes.jsx
```

### Rotas

| Rota | Tela |
|---|---|
| `/avaliacoes` | Lista todas as avaliações |
| `/avaliacoes/cadastrar` | Cria uma nova avaliação |
| `/avaliacoes/editar/:id` | Edita uma avaliação existente |
| `/denuncias/cadastrar` | Registra uma nova denúncia |
| `/relatorios/:imovelId` | Exibe o relatório de um imóvel |

---

## CRUD Avaliação

| Operação | Implementação |
|---|---|
| Create | `avaliacaoService.criarAvaliacaoImovel()` e `criarAvaliacaoHospede()` criam avaliações após validação pelo Template Method |
| Read | `avaliacaoService.listarPorImovel()` e `listarPorHospede()` listam avaliações por contexto |
| Update | `avaliacaoService.atualizarAvaliacaoImovel()` e `atualizarAvaliacaoHospede()` atualizam avaliações existentes |
| Delete | `avaliacaoService.excluirAvaliacaoImovel()` e `excluirAvaliacaoHospede()` removem avaliações |

As avaliações são separadas em duas coleções no banco: `avaliacoes_imovel` para avaliações de imóveis e `avaliacoes_hospede` para avaliações de hóspedes, pois possuem estruturas e destinos diferentes.

---

## Padrão GoF: Template Method

### Contexto de uso

O sistema precisa criar dois tipos de avaliação com fluxos semelhantes mas comportamentos distintos. O hóspede avalia o imóvel com nota geral, categorias e comentário. O anfitrião avalia o hóspede com nota geral e comentário apenas.

### Problema que resolve

Sem o Template Method, o componente de cadastro teria muitos condicionais para decidir como validar, montar e salvar cada tipo de avaliação. Isso deixaria o código acoplado e dificultaria a adição de novos tipos de avaliação no futuro.

### Como foi implementado

| Participante do padrão | Arquivo |
|---|---|
| Template (classe base) | `AvaliacaoBase.js` |
| Concrete Class | `AvaliacaoHospede.js` |
| Concrete Class | `AvaliacaoAnfitriao.js` |
| Context (quem usa) | `CadastrarAvaliacao.jsx` |

`AvaliacaoBase` define o esqueleto do algoritmo no método `executar()`, que chama os quatro passos em ordem. As subclasses implementam cada passo de acordo com seu tipo.

```javascript
// AvaliacaoBase.js — esqueleto fixo
async executar() {
  this.verificarElegibilidade();
  this.registrarNota();
  this.registrarComentario();
  await this.salvar();
  this.atualizarPerfil();
  this.redirecionar();
}
```

```javascript
// CadastrarAvaliacao.jsx — escolhe e executa o template
const template =
  tipo === "hospede"
    ? new AvaliacaoHospede(form, navigate)
    : new AvaliacaoAnfitriao(form, navigate);

await template.executar();
```

### Variações entre os tipos

| Passo | AvaliacaoHospede | AvaliacaoAnfitriao |
|---|---|---|
| `verificarElegibilidade` | Exige `imovelId` e `hospedeId` | Exige `hospedeId` e `anfitriaoId` |
| `registrarNota` | Nota entre 1 e 5 | Nota entre 1 e 5 |
| `registrarComentario` | Mínimo 20 caracteres | Mínimo 20 caracteres |
| `salvar` | Monta objeto com categorias e salva em `avaliacoes_imovel` | Monta objeto sem categorias e salva em `avaliacoes_hospede` |
| `redirecionar` | Redireciona para `/avaliacoes/imovel` | Redireciona para `/avaliacoes/hospede` |

---

## SOLID

### S — Single Responsibility Principle

Cada arquivo possui uma responsabilidade clara:

| Arquivo | Responsabilidade |
|---|---|
| `AvaliacaoBase.js` | Define o esqueleto do fluxo de avaliação |
| `AvaliacaoHospede.js` | Implementa o fluxo de avaliação do imóvel |
| `AvaliacaoAnfitriao.js` | Implementa o fluxo de avaliação do hóspede |
| `avaliacaoService.js` | Comunicação com a API de avaliações |
| `denunciaService.js` | Comunicação com a API de denúncias |
| `AvaliacaoCard.jsx` | Renderiza visualmente uma avaliação |
| `ListaAvaliacoes.jsx` | Lista e gerencia avaliações |
| `CadastrarAvaliacao.jsx` | Coleta dados para criar uma avaliação |
| `EditarAvaliacao.jsx` | Coleta dados para editar uma avaliação |
| `CadastrarDenuncia.jsx` | Coleta dados para registrar uma denúncia |
| `RelatorioImovel.jsx` | Calcula e exibe métricas de avaliações |

### O — Open/Closed Principle

O módulo está aberto para extensão e fechado para modificação. Para adicionar um novo tipo de avaliação — por exemplo, avaliação de condomínio — basta criar uma nova classe que estenda `AvaliacaoBase` e implemente os quatro métodos, sem modificar nenhum código existente.

### L — Liskov Substitution Principle

`AvaliacaoHospede` e `AvaliacaoAnfitriao` podem substituir `AvaliacaoBase` em qualquer ponto do sistema, pois ambas implementam os mesmos métodos esperados: `verificarElegibilidade`, `registrarNota`, `registrarComentario`, `salvar`, `atualizarPerfil` e `redirecionar`.

### I — Interface Segregation Principle

Os componentes recebem apenas as props necessárias. `AvaliacaoCard`, por exemplo, recebe somente `avaliacao`, `tipo` e `onExcluir`, sem conhecer detalhes do service ou da API.

### D — Dependency Inversion Principle

O componente `CadastrarAvaliacao` depende da abstração `AvaliacaoBase`, não diretamente das classes concretas. Ele instancia `AvaliacaoHospede` ou `AvaliacaoAnfitriao` e chama `executar()` sem conhecer os detalhes de cada implementação.

---

## GRASP

### Controller

`avaliacaoService.js` e `denunciaService.js` atuam como controladores dos casos de uso. Eles centralizam toda a comunicação com a API, isolando as páginas de detalhes de implementação.

### Creator

`CadastrarAvaliacao.jsx` é responsável por criar as instâncias de `AvaliacaoHospede` e `AvaliacaoAnfitriao`, pois é quem possui os dados do formulário necessários para construí-las.

### Information Expert

Cada classe conhece as regras do seu domínio. `AvaliacaoHospede` conhece as regras de avaliação de imóvel — categorias, campos obrigatórios e coleção de destino — e `AvaliacaoAnfitriao` conhece as regras de avaliação de hóspede.

### Low Coupling

As páginas não conhecem os detalhes das classes de template nem da API. `CadastrarAvaliacao` apenas chama `template.executar()` e `ListaAvaliacoes` apenas chama os métodos do service, sem saber como os dados são processados internamente.

### High Cohesion

As classes e componentes mantêm responsabilidades coesas: os templates cuidam das regras de negócio, os services cuidam da comunicação com a API, o card cuida da apresentação visual e as pages orquestram tudo isso.

### Polymorphism

O comportamento variável entre os dois tipos de avaliação é resolvido por polimorfismo. `CadastrarAvaliacao` chama `template.executar()` independentemente do tipo escolhido, eliminando condicionais de negócio no fluxo principal.