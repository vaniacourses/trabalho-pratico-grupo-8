[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23493799&assignment_repo_type=AssignmentRepo)
# Sistema de Hospedagem por Temporada
Trabalho Prático da disciplina de Projeto de Software.
## 👥 Integrantes da Equipe
* Integrante 1 João Gabriel Ramos
* Integrante 2 Pedro Henrique Chagas
* Integrante 3 Gustavo Lira
* Integrante 4 Daniel Molina
* Integrante 5 Sergio Herman 
* Integrante 6 Rafael Portela
## 📄 Documentação Oficial
Toda a documentação arquitetural, requisitos e diagramas estão detalhados no nosso Google Docs. O documento possui o histórico de versões ativo para avaliação da colaboração individual.
👉 [Acessar a Documentação no Google Docs](https://docs.google.com/document/d/181WOAaErlYEC1vKGavw5lD9N4ANWoC7FzX2STPa0Duo/edit?usp=sharing)
👉 [Acessar a Apresentação](https://docs.google.com/presentation/d/1oMWpnEu8gHx7TitTXF6soyuZTsaDj166sMiz69l0ujk/edit?usp=sharing)

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js v18+
- npm

### Instalação
```bash
cd aluguel-temporada
npm install
```

### Rodando o projeto
Abra dois terminais:

**Terminal 1 — API mock (JSON Server):**
```bash
cd aluguel-temporada
npm run server
```

**Terminal 2 — Aplicação React:**
```bash
cd aluguel-temporada
npm run dev
```

Acesse em: **http://localhost:5173**
A API estará em: **http://localhost:3001**

---

## 🗂️ Estrutura do Projeto
aluguel-temporada/
├── src/
│   ├── builders/              # Padrões GOF - Builder
│   │   └── ImovelBuilder.js
│   ├── components/
│   │   ├── common/            # Componentes reutilizáveis
│   │   │   ├── CurrencyInput.jsx
│   │   │   └── EnderecoInput.jsx
│   │   ├── comodidade/
│   │   │   └── GerenciarComodidades.jsx
│   │   ├── disponibilidade/
│   │   │   └── DisponibilidadeCard.jsx
│   │   └── imovel/
│   │       └── ImovelCard.jsx
│   ├── pages/
│   │   ├── disponibilidades/
│   │   │   ├── CadastrarDisponibilidade.jsx
│   │   │   ├── EditarDisponibilidade.jsx
│   │   │   └── ListaDisponibilidades.jsx
│   │   └── imoveis/
│   │       ├── CadastrarImovel.jsx
│   │       ├── EditarImovel.jsx
│   │       └── ListaImoveis.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── services/              # Comunicação com a API
│   │   ├── disponibilidadeService.js
│   │   └── imovelService.js
│   └── utils/
│       ├── comodidades.js     # Comodidades pré-definidas do sistema
│       └── imovelUtils.js     # Utilitários (ex: calcularValorTotal)
└── db.json                    # Banco de dados mock (JSON Server)
---

## 🔗 Integrações Pendentes

### Módulo de Autenticação (a ser implementado)
- O campo `idAnfitriao` no cadastro de imóvel atualmente é preenchido manualmente
- Quando o módulo de autenticação for implementado, o `idAnfitriao` deve vir automaticamente do usuário logado e o campo deve ser removido do formulário de cadastro/edição

### Módulo de Reservas (a ser implementado)
- O método `disponibilidadeService.verificarSobreposicao()` está pronto para ser consumido pelo módulo de Reservas
- A função `calcularValorTotal(precoPorNoite, dataInicio, dataFim)` em `src/utils/imovelUtils.js` está disponível para cálculo do valor da reserva
- Os períodos de disponibilidade já validam sobreposição — reservas devem respeitar apenas períodos com `disponivel: true`

---

## 📦 Dependências Principais

| Dependência | Uso |
|---|---|
| React + Vite | Framework e bundler |
| react-router-dom | Roteamento |
| axios | Requisições HTTP |
| json-server | Mock de API REST |
| react-datepicker | Seletor de datas |
| tailwindcss | Estilização |
| lucide-react | Ícones |

---

*Nota: Os arquivos fontes dos diagramas e as imagens exportadas serão adicionados na pasta `/diagramas` deste repositório.*