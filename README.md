**Planning Poker App**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg) ![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📖 Descrição

Projeto destinado a equipes que utilizam a metodologia ágil Scrum para estimar seu backlog. Adota o método de Fibonacci no Planning Poker, oferecendo uma interface prática e simples, com funcionalidades essenciais ao ritual de estimativa.

## 📑 Table of Contents

* [Features](#-features)
* [Tecnologias](#-tecnologias)
* [Pré-requisitos](#-pré-requisitos)
* [Instalação](#-instalação)
* [Uso](#-uso)
* [Configuração e Variáveis de Ambiente](#-configuração-e-variáveis-de-ambiente)
* [Demo / Screenshots](#-demo--screenshots)
* [Roadmap](#-roadmap)
* [Contribuição](#-contribuição)
* [Licença](#-licença)
* [Autor](#-autor)

---

## 💡 Features

* Estimativa colaborativa em tempo real via WebSocket.
* Cartões de pontuação baseados na sequência de Fibonacci.
* Interface minimalista e intuitiva.
* Suporte a múltiplas salas.
* Dockerizado para facilitar o setup e deployment.

---

## 🛠 Tecnologias

* **Frontend:** Vue 3 + Vite + TypeScript
* **Backend:** Node.js + WebSocket
* **Containerização:** Docker & Docker Compose

---

## 🔧 Pré-requisitos

* [Node.js](https://nodejs.org/) v16+
* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
* Git

---

## 🚀 Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/china-dev/planning-poker.git
   ```
2. Acesse a pasta do projeto:

   ```bash
   cd planning-poker.app
   ```
3. Instale as dependências:

   ```bash
   npm install
   ```
4. Inicie os containers:

   ```bash
   docker-compose up --build
   ```

---

## 🎯 Uso

* **Frontend** aberta automaticamente em: `http://localhost:5173`
* **Backend WebSocket** rodando em: `ws://localhost:3001`

1. No frontend, crie ou entre em uma sala.
2. Envie seu valor de estimativa (sequência de Fibonacci).
3. Revele as estimativas quando todos estiverem prontos.

---

## ⚙️ Configuração e Variáveis de Ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
# Porta do servidor WebSocket backend/.env
PORT=3001
FRONTEND_URL=http://localhost:5173

# Porta para o frontend frontend/.env
VITE_API_URL=http://localhost:3001
```

---

## 🎥 Demo / Screenshots

![Tela do App](./docs/screenshot.png)

> Inclua aqui link para demo ao vivo ou GIFs da interface.

---

## 🛣 Roadmap

* [ ] Temas personalizáveis
* [ ] Sequência de votos personalizáveis
* [ ] Integração com ferramentas de Board

---

## 🤝 Contribuição

1. Fork este repositório
2. Crie uma branch com sua feature: `git checkout -b feature/nome-da-feature`
3. Faça commit das alterações: `git commit -m 'Adiciona nova feature'`
4. Envie para o branch original: `git push origin feature/nome-da-feature`
5. Abra uma Pull Request

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

* **Lucas Paulino** – [LinkedIn](https://www.linkedin.com/in/lucaspaulinodev/)