# Petshop App

## Sobre o Projeto
Interface web do sistema de gestão para Petshops. Desenvolvida como uma Single Page Application (SPA), a plataforma oferece duas experiências distintas: um painel administrativo para gestão do negócio (serviços, funcionários e agenda) e uma área do cliente intuitiva para agendamento de serviços.

## Objetivo
- **Interface Intuitiva:** Facilitar a navegação de usuários durante o processo de agendamento.
- **Gestão Visual:** Oferecer aos administradores e funcionários dashboards claros para o gerenciamento do petshop.

## Boas práticas de desenvolvimento aplicadas
- **Componentização:** Utilização de componentes Angular reutilizáveis para padronização visual.
- **Guards de Rotas:** Proteção de rotas administrativas para garantir acesso apenas a usuários autorizados.
- **Interceptors:** Injeção automática do Token JWT em requisições HTTP e tratamento das respostas da api.
- **Tipagem Estática:** Uso de TypeScript para garantir segurança e reduzir erros de desenvolvimento.

Esse é o FRONT-END do projeto. A API está disponível no repositório: [BACK-END](https://github.com/Matheus-Lz/petcare-api)

## Arquitetura e Modelagem
- [Diagrama de Casos de Uso]()
- [Diagrama C4]()

## Requisitos Funcionais
| Identificação | Requisito Funcional | Descrição |
|---------------|---------------------|-----------|
| **RF001** | **Cadastro de Usuários** | O sistema deve permitir o cadastro de novos usuários (clientes e funcionários). |
| **RF002** | **Autenticação** | O sistema deve permitir a autenticação de usuários por login e senha. |
| **RF003** | **Geração de Token** | O sistema deve gerar um token de acesso (JWT) após o login bem-sucedido. |
| **RF004** | **Recuperação de Senha** | O sistema deve oferecer funcionalidade de "esqueci minha senha" para redefinição segura. |
| **RF005** | **Atualização de Perfil** | O sistema deve permitir que usuários atualizem suas informações de perfil. |
| **RF006** | **Gestão de Funcionários** | O sistema deve permitir o cadastro, atualização e remoção de funcionários por um administrador. |
| **RF007** | **Definição de Funções** | O sistema deve permitir a definição de funções ou especialidades para os funcionários. |
| **RF008** | **Consulta de Funcionários** | O sistema deve permitir a consulta da lista de funcionários e seus detalhes. |
| **RF009** | **Gestão de Serviços** | O sistema deve permitir o gerenciamento (CRUD) de serviços (ex: banho, tosa). |
| **RF010** | **Detalhamento de Serviço** | Cada serviço deve possuir nome, descrição, duração estimada e preço. |
| **RF011** | **Agendamento** | O sistema deve permitir que o cliente agende um serviço com um horário disponível. |
| **RF012** | **Validação de Conflitos** | O sistema deve validar conflitos de horário para impedir agendamentos duplicados. |
| **RF013** | **Cancelamento** | O sistema deve permitir o cancelamento de agendamentos conforme regras de negócio. |
| **RF014** | **Visualização de Agenda** | O sistema deve permitir a visualização da agenda por dia. |

## Requisitos Não Funcionais
| Identificação | Requisito Não Funcional | Descrição |
|---------------|-------------------------|-----------|
| **RNF001** | **Criptografia** | As senhas devem ser armazenadas com criptografia. |
| **RNF002** | **Proteção de Rotas** | O acesso a rotas protegidas deve exigir token JWT válido. |
| **RNF003** | **Controle de Acesso (RBAC)** | Implementação de controle de acesso baseado em papéis (Cliente/Admin). |
| **RNF004** | **Documentação API** | Documentação automática da API via Swagger/OpenAPI. |
| **RNF005** | **Testes** | Cobertura de testes unitários e de integração (JUnit). |
| **RNF006** | **Padronização de Erros** | Respostas de erro da API devem ser padronizadas e claras. |

## Pipelines

A pipeline de CI/CD garante o deploy automático na Vercel:

### 1. **Análise de Qualidade**
- Instalação de dependências (`npm install`).
- Execução de testes unitários e análise via **SonarQube**.
- Validação de coverage da aplicação.

### 2. **Deploy (Vercel)**
- Deploy automático ao realizar push na branch principal.

## Tecnologias Utilizadas
- **Framework:** Angular
- **Linguagem:** TypeScript
- **Estilização:** CSS/SCSS
- **Deploy:** Vercel
