# RJ Sistema v2.0 - Backend & PDV Web 🚀

O **RJ Sistema v2.0** é um ecossistema comercial completo e integrado (Full Stack) voltado para a gestão de autopeças, controle de estoques e faturamento de vendas (PDV). Esta aplicação representa a evolução tecnológica de uma solução desktop anterior para uma moderna arquitetura Web baseada em **Single Page Application (SPA)** responsiva e **REST API**.

Este repositório contém o motor backend da aplicação, desenvolvido em **Java com Spring Boot**, integrado ao banco de dados relacional **MySQL**.

---

## 💻 Recursos e Funcionalidades

### 📈 Dashboard Gerencial Reativo
* **Métricas Financeiras em Tempo Real:** Cards dinâmicos integrados ao banco de dados exibindo Faturamento Mensal Líquido, total de Pedidos Faturados e Clientes Ativos.
* **Gráfico de Vendas Estratégico:** Painel visual reativo que renderiza de forma proporcional o volume das 4 categorias de autopeças mais vendidas nos últimos 3 meses.

### 🛒 Módulo Lançamento de Pedidos (PDV)
* **Carrinho de Compras Multicomponente:** Permite o lançamento, acúmulo e remoção de itens em memória antes do faturamento.
* **Matemática Comercial Composta:** Cálculo dinâmico e reativo de subtotais, frete, descontos percentuais e impostos.
* **Persistência em Cascata:** Relacionamento mestre-detalhe (Mestre Pedido -> Detalhe Itens) persistido atomicamente no banco através de JPA.

### 🛡️ Segurança e Governança (LGPD)
* **Controle de Usuários e Permissões:** Gerenciamento de perfis de operadores (Administrador, Vendedor, etc.) acoplados a coleções de privilégios de acesso (*Roles*).
* **Criptografia de Credenciais:** As senhas dos operadores são tratadas e gravadas de forma irreversível utilizando o algoritmo matemático de criptografia **Hash SHA-256**.

### 💼 Cadastros Corporativos e Consultas Históricas
* **Estrutura de Apoio Relacional:** Cadastros completos de Clientes, Fornecedores (com dados bancários), Categorias e Produtos.
* **Inteligência de Venda:** Cálculo automático da margem de lucro sugerida com base no preço de custo cadastrado.
* **Filtros em Tempo Real:** Grades de dados (*Grids*) com barras de rolagem fluidas e pesquisas instantâneas sem recarregamento de página (*refresh*).

### 🎨 Experiência do Usuário (UI/UX)
* **Interface Responsiva:** Menu lateral retrátil (*Mini Sidebar*) com transições suaves que se adapta automaticamente a telas menores e dispositivos móveis.
* **Alternância de Temas:** Preferência visual flexível com suporte integrado a **Modo Claro (Light Mode)** e **Modo Escuro (Dark Mode)** com 100% de contraste de fontes.
* **Calendário Corporativo Dinâmico:** Cabeçalho inteligente alimentado de forma automatizada pelo relógio local do sistema operacional.

---

## 🛠️ Tecnologias Utilizadas

### Backend (Motor Java)
* **Java 17** / **Spring Boot 3.x**
* **Spring Web** (Construção de Endpoints RESTful)
* **Spring Data JPA** (Persistência e Mapeamento Objeto-Relacional)
* **Hibernate Core** (Geração automática de tabelas via DDL-Update)
* **MySQL Driver** (Conector físico de banco de dados)
* **Lombok** (Produtividade e eliminação de código boilerplate)
* **Maven** (Gerenciamento de dependências e automação de builds)

### Frontend (Interface Estática Acomodada)
* **HTML5** / **CSS3** (Visual corporativo minimalista e flexível)
* **JavaScript Puro (ES6+)** (Consumo assíncrono via requisições `fetch()`)
* **Font Awesome 6** (Biblioteca nativa de iconografia vetorial)

### Banco de Dados & Design
* **MySQL Server** (Armazenamento persistente de dados)
* **Figma** (Prototipação de Wireframes e maquete interativa de usabilidade)

---

## 📂 Arquitetura de Pastas Internas (SOLID)

```text
backend/
├── src/main/java/com/rjsistema/backend/
│   ├── model/         # Entidades de mapeamento do JPA (Tabelas)
│   ├── repository/    # Interfaces de persistência e Queries nativas
│   ├── service/       # Camada de Regras de Negócio e Cálculos
│   ├── controller/    # Endpoints REST e controle de rotas HTTP
│   └── BackendApplication.java
│
├── src/main/resources/
│   ├── static/        # Arquivos estáticos do Frontend (SPA)
│   │   ├── css/       # Folhas de estilo (style.css, dashboard-style.css)
│   │   ├── js/        # Inteligência assíncrona (scripts, router)
│   │   ├── imagens/   # Logotipos e ativos visuais locais
│   │   └── index.html # Ponto de entrada do sistema
│   └── application.properties # Parâmetros de infraestrutura do MySQL
└── pom.xml            # Arquivo de configurações do Maven
```

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
* Ter o **Java 17** (ou superior) instalado na máquina.
* Ter o servidor **MySQL** ativo localmente.
* IDE de sua preferência (**NetBeans**, VS Code ou IntelliJ).

### 1. Preparação do Banco de Dados
Abra o seu gerenciador de banco (MySQL Workbench, DBeaver) e crie o Schema vazio:
```sql
CREATE DATABASE IF NOT EXISTS rjweb_bd;
```

### 2. Ajuste de Credenciais
Abra o arquivo `src/main/resources/application.properties` e informe o usuário e senha do seu MySQL local:
```properties
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

### 3. Compilação e Execução
Abra o projeto na IDE NetBeans, clique com o botão direito sobre o projeto e selecione **Clean and Build** (para baixar as dependências e criar as tabelas). Em seguida, clique em **Run**.

Após a inicialização do Tomcat, abra o seu navegador de internet e acesse:
👉 **`http://localhost:8080/index.html`**

---

## 📝 Certificação e Qualidade (QA)
O sistema passou por uma rigorosa homologação baseada em **Planos de Casos de Testes** e ferramentas de **Bugtracking**, mitigando falhas de concorrência de eventos assíncronos, travamento de concorrência CSS em telas responsivas e integridade matemática financeira de faturamento.

---
Desenvolvido com dedicação como entrega consolidada da fase final do **Projeto Integrador (Senac)**. 🌟
