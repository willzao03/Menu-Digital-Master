# 🍔 Menu Digital - Sistema de Pedidos

Sistema completo de cardápio digital com frontend React e backend Spring Boot.

## 📋 Sobre o Projeto

Sistema de pedidos para restaurantes com:
- Cardápio digital interativo
- Carrinho de compras
- Criação e acompanhamento de pedidos
- Painel administrativo
- Integração completa frontend-backend

## 🛠️ Tecnologias

### Backend
- Java 17
- Spring Boot 3.2.3
- Spring Data JPA
- MySQL 8
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui
- React Router

## 🚀 Como Executar

### Pré-requisitos
- Java 17+
- Node.js 16+
- MySQL 8+
- Maven

### 1. Configurar Banco de Dados
```sql
CREATE DATABASE menudigital;
```

### 2. Iniciar Backend
```bash
cd backend
mvn spring-boot:run
```
Backend rodará em: `http://localhost:8080`

### 3. Iniciar Frontend
```bash
cd frontend/smart-menu-token-main
npm install
npm run dev
```
Frontend rodará em: `http://localhost:5173`

## 📚 Documentação Completa

### 🚀 Início Rápido
- [📖 Instruções Completas](INSTRUCOES.md) - Como executar o projeto
- [⚡ Comandos Rápidos](COMANDOS_RAPIDOS.md) - Atalhos úteis

### 📝 Desenvolvimento
- [📝 Resumo das Alterações](RESUMO_ALTERACOES.md) - O que foi modificado
- [🏗️ Arquitetura](ARQUITETURA.md) - Estrutura e fluxo do sistema
- [🎨 Guia Visual](GUIA_VISUAL.md) - Design e interface
- [💻 Dicas de Desenvolvimento](DICAS_DESENVOLVIMENTO.md) - Boas práticas

### 🧪 Testes
- [🧪 Testes de API](TESTE_API.md) - Como testar os endpoints
- [💡 Exemplos de Uso](EXEMPLOS_USO.md) - Cenários práticos
- [✅ Checklist](CHECKLIST.md) - Verificação completa do sistema

## 🎯 Funcionalidades

### Cliente
- ✅ Visualizar cardápio por categorias
- ✅ Adicionar itens ao carrinho
- ✅ Finalizar pedido
- ✅ Receber token do pedido
- ✅ Acompanhar status do pedido

### Administração
- ✅ Listar todos os pedidos
- ✅ Ver detalhes de cada pedido
- ✅ Deletar pedidos
- ✅ Visualizar informações completas

## 🔌 API Endpoints

```
GET    /api/orders              - Lista todos os pedidos
POST   /api/orders              - Cria novo pedido
GET    /api/orders/{id}         - Busca pedido por ID
GET    /api/orders/token/{token} - Busca pedido por token
PUT    /api/orders/{id}         - Atualiza pedido
DELETE /api/orders/{id}         - Deleta pedido
```

## 📱 Páginas

- `/` - Menu principal
- `/checkout` - Finalizar pedido
- `/order/:token` - Confirmação do pedido
- `/track` - Acompanhar pedido
- `/admin/orders` - Painel administrativo

## 🔧 Configuração

### Backend
Edite `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/menudigital
spring.datasource.username=root
spring.datasource.password=SUA_SENHA
```

### Frontend
Edite `frontend/smart-menu-token-main/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🧪 Testando

### Criar pedido via cURL
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "João Silva",
    "tableNumber": "5",
    "items": [
      {"name": "X-Burger", "price": 28.90, "quantity": 2}
    ]
  }'
```

### Listar pedidos
```bash
curl http://localhost:8080/api/orders
```

## 📊 Estrutura do Projeto

```
.
├── backend/                    # Backend Spring Boot
│   ├── src/main/java/
│   │   └── com/example/menudigital/
│   │       ├── controller/    # Controllers REST
│   │       ├── model/         # Entidades JPA
│   │       ├── repository/    # Repositórios
│   │       ├── service/       # Lógica de negócio
│   │       └── dto/           # Data Transfer Objects
│   └── pom.xml
│
├── frontend/smart-menu-token-main/  # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── services/         # Serviços de API
│   │   ├── contexts/         # Contextos React
│   │   └── App.tsx
│   └── package.json
│
└── docs/                      # Documentação
    ├── INSTRUCOES.md
    ├── RESUMO_ALTERACOES.md
    ├── ARQUITETURA.md
    ├── GUIA_VISUAL.md
    ├── TESTE_API.md
    ├── EXEMPLOS_USO.md
    ├── COMANDOS_RAPIDOS.md
    ├── CHECKLIST.md
    └── DICAS_DESENVOLVIMENTO.md
```

## 🎨 Screenshots

### Menu Principal
Interface com cardápio organizado por categorias (Lanches, Bebidas, Sobremesas)

### Checkout
Formulário para finalizar pedido com validações

### Acompanhamento
Busca de pedido por token com status em tempo real

### Admin
Painel para gerenciar todos os pedidos

## 🔐 Segurança

- CORS habilitado para desenvolvimento
- Validações no backend
- Tratamento de erros
- Transações no banco de dados

## 🚧 Melhorias Futuras

- [ ] Autenticação de usuários
- [ ] WebSocket para atualizações em tempo real
- [ ] Sistema de status mais detalhado
- [ ] Notificações push
- [ ] Relatórios e dashboard
- [ ] Integração com pagamento
- [ ] QR Code para pedidos
- [ ] Impressão de comprovantes

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a [documentação](INSTRUCOES.md)
2. Consulte os [comandos rápidos](COMANDOS_RAPIDOS.md)
3. Teste a [API diretamente](TESTE_API.md)

---

Desenvolvido com ❤️ usando Spring Boot e React
