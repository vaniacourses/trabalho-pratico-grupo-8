# Aplicação de SOLID e GRASP — Gerenciamento de Usuários

**Disciplina:** Projeto de Software
**Desenvolvedor:** João Ramos
**Módulo:** Gerenciamento de Usuários

---

## SOLID

### S — Single Responsibility Principle (Princípio da Responsabilidade Única)
Cada arquivo possui uma única responsabilidade bem definida:

| Arquivo | Responsabilidade |
|---|---|
| `UsuarioFactory.js` | Apenas decide e cria a instância correta de usuário (Hóspede, Anfitrião ou Administrador) |
| `usuarioService.js` | Apenas comunica com a API |
| `UsuarioCard.jsx` | Apenas exibe os dados de um usuário |
| `CadastrarUsuario.jsx` | Apenas coleta os dados e aciona a criação do usuário |
| `EditarUsuarios.jsx` | Apenas coleta e atualiza os dados de um usuário existente |
| `ListaUsuario.jsx` | Apenas lista os usuários e coordena exclusão |

---

### O — Open/Closed Principle (Princípio Aberto/Fechado)
- **`UsuarioFactory.js`**: aberto para extensão — um novo tipo de usuário pode ser adicionado criando uma nova classe que estende `Usuario` e incluindo um novo `case` no `switch`, sem alterar a lógica existente
- **`Usuario`** (classe base): novos atributos podem ser adicionados ao construtor sem impactar as subclasses já existentes

---

### L — Liskov Substitution Principle (Princípio da Substituição de Liskov)
- As classes `Hospede`, `Anfitriao` e `Administrador` estendem `Usuario` e podem ser tratadas como tal em qualquer parte do sistema que espere um objeto `Usuario`
- O retorno de `UsuarioFactory.criar()` pode ser qualquer uma das três subclasses, sem que o código que a chama precise saber qual delas foi instanciada

---

### I — Interface Segregation Principle (Princípio da Segregação de Interfaces)
Cada componente recebe exatamente as props que precisa, nada além:

| Componente | Props recebidas |
|---|---|
| `UsuarioCard` | `{ usuario, onExcluir }` |

---

### D — Dependency Inversion Principle (Princípio da Inversão de Dependência)
- `CadastrarUsuario.jsx` e `EditarUsuarios.jsx` dependem de abstrações (`usuarioService`, `UsuarioFactory`) e não de implementações concretas
- `ListaUsuario.jsx` depende do `usuarioService` via importação, sem instanciar dependências diretamente
- Se a API mudar de JSON Server para um backend real, basta alterar o `usuarioService` — as páginas não precisam ser modificadas

---

## GRASP

### Creator (Criador)
- **`UsuarioFactory.js`** é o responsável por criar os objetos de usuário — concentra o conhecimento de qual subclasse (Hóspede, Anfitrião ou Administrador) deve ser instanciada conforme o tipo informado, faz sentido pois é o componente que possui essa responsabilidade de criação centralizada

---

### Information Expert (Especialista na Informação)
- **`UsuarioFactory.js`**: especialista em decidir e construir o objeto de usuário correto, centralizando essa lógica
- **`usuarioService.js`**: especialista nas operações de comunicação com a API relacionadas a usuários (listar, criar, atualizar, excluir)

---

### High Cohesion (Alta Coesão)
- **`UsuarioCard.jsx`**: coeso, trata exclusivamente da exibição dos dados de um usuário
- **`usuarioService.js`**: todas as operações dizem respeito exclusivamente a usuários
- **`UsuarioFactory.js`**: todas as classes e a lógica de criação dizem respeito exclusivamente à criação de usuários

---

### Low Coupling (Baixo Acoplamento)
- `UsuarioCard` não conhece a API — recebe os dados via props e delega a exclusão através de callback
- O `usuarioService` é o único que conhece a URL da API — as páginas não sabem de onde vêm os dados
- `UsuarioFactory` não conhece o service — apenas constrói o objeto, sem dependência de infraestrutura

---

### Controller (Controlador)
- **`CadastrarUsuario.jsx`**: age como controller do fluxo de criação — coleta os dados do formulário, aciona a `UsuarioFactory` e chama o `usuarioService` para persistir
- **`ListaUsuario.jsx`**: controla as ações de editar e excluir, delegando a execução para o service correspondente


## Padrão GoF: Factory Method

### Contexto de uso

O sistema possui três perfis de usuário — Hóspede, Anfitrião e Administrador — que compartilham os mesmos atributos básicos (nome, email, senha, telefone, status, dataCadastro), mas representam papéis distintos dentro do domínio. No formulário de cadastro, o usuário escolhe o tipo desejado através de um campo select, e o sistema precisa instanciar a classe correspondente a essa escolha.

### Problema que resolve

Sem o Factory Method, o componente de cadastro (CadastrarUsuario.jsx) precisaria conhecer diretamente as classes Hospede, Anfitriao e Administrador, e conter uma lógica condicional (if/switch) para decidir qual delas instanciar. Isso violaria o princípio da responsabilidade única, pois a página passaria a concentrar tanto a lógica de interface quanto a lógica de decisão de criação de objetos. Além disso, qualquer novo tipo de usuário exigiria alterar o componente de cadastro diretamente.

### Como foi implementado

A classe UsuarioFactory expõe um único método estático, criar(tipo, dados), que recebe o tipo escolhido no formulário e os dados básicos do usuário, e internamente decide qual subclasse de Usuario deve ser instanciada:

```javascript
class UsuarioFactory {
  static criar(tipo, dados) {
    switch (tipo) {
      case "hospede":
        return new Hospede(dados);
      case "anfitriao":
        return new Anfitriao(dados);
      case "administrador":
        return new Administrador(dados);
      default:
        throw new Error(`Tipo de usuário inválido: ${tipo}`);
    }
  }
}
```

As classes Hospede, Anfitriao e Administrador estendem a classe base Usuario, que centraliza os atributos comuns (incluindo a geração automática de dataCadastro). Cada subclasse adiciona apenas o atributo tipo, que identifica o papel do usuário.

No componente CadastrarUsuario.jsx, a criação do objeto é feita com uma única chamada:

```javascript 
const usuario = UsuarioFactory.criar(form.tipo, {
  nome: form.nome,
  email: form.email,
  senha: form.senha,
  telefone: form.telefone,
  status: form.status,
});
```

### Justificativa da escolha

O Factory Method foi escolhido porque o sistema precisa criar objetos de tipos diferentes (Hospede, Anfitriao, Administrador) a partir de uma mesma origem de dados (o formulário), variando apenas o tipo solicitado. Centralizar essa decisão em uma classe dedicada:
- Mantém o componente de cadastro livre de lógica de criação, focado apenas em UI e validação
- Permite adicionar novos tipos de usuário no futuro apenas estendendo a UsuarioFactory e criando a nova subclasse, sem alterar o código já existente (Open/Closed Principle)
- Garante que toda a criação de usuários passe por um único ponto centralizado, facilitando manutenção e consistência
