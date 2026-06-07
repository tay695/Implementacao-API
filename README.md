SoliBank - Banco de Doações (API RESTful Segura)
O SoliBank é uma plataforma web desenvolvida para facilitar o gerenciamento de doações, oferecendo um fluxo claro entre doadores, estoque interno e entidades beneficiadas. O sistema organiza todo o processo: desde o envio da doação, passando pela coleta, até sua destinação final para famílias e ONGs.

🎯 Objetivo do Sistema
Registrar doações realizadas por usuários doadores.

Controlar entradas e saídas de itens no estoque.

Apoiar o trabalho do Assistente Social na organização e distribuição.

Manter histórico e transparência de todas as movimentações.

🧩 Arquitetura Modular (Django Apps)
O sistema é organizado em módulos especializados:

doador: Gerencia cadastro, login e o envio de doações via formulário.

estoque: Controle central de entradas (doações coletadas) e saídas (destinações).

entidade_beneficiada: Gestão de famílias e ONGs que recebem o suporte.

doacao: App central que vincula doadores, status de coleta e o estoque.

ponto_coleta: Gestão logística de locais físicos para retirada das doações.

👥 Perfis e Segurança
O sistema utiliza Django OAuth Toolkit (DOT) para uma API RESTful completa e segura.

Assistente Social (Superusuário): Acesso total para gestão de logística, estoque e administração.

Doador (Grupo DOADORES): Permissões limitadas para realizar cadastro, submeter doações e acompanhar o status das contribuições.

🛠️ Instruções de Execução
Pré-requisitos
Python 3.8+, Node.js, npm.

Configuração do Backend (API Django)
Ambiente Virtual: source venv/bin/activate

Instalação e Migrações:

Bash
pip install -r requirements.txt
python manage.py migrate
3. **Dados Iniciais:** `python manage.py loaddata inicial_groups.json`
4. **Superusuário:** `python manage.py createsuperuser`
5. **OAuth2 (No Admin):** Configure a aplicação como *Confidential* e *Resource owner password-based* em `/admin/` para obter suas credenciais.

### Configuração do Frontend (Cliente React)
1. **Instalação:** `cd CLIENTE/cliente-api && npm install`
2. **Execução:** `npm start`

---

## 📚 Documentação Oficial e Referências

Para aprofundar seus conhecimentos e validar a estrutura técnica desta implementação, consulte as fontes oficiais:

*   **Django Rest Framework (DRF):** A base da nossa API RESTful. [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
*   **Django OAuth Toolkit (DOT):** Implementação segura do padrão OAuth2 para Django. [https://django-oauth-toolkit.readthedocs.io/](https://django-oauth-toolkit.readthedocs.io/)
*   **React:** Biblioteca de interface utilizada para o consumo da API. [https://react.dev/](https://react.dev/)
*   **Django (Framework Base):** Documentação geral do framework. [https://www.djangoproject.com/](https://www.djangoproject.com/)

---
O projeto utiliza o Django OAuth Toolkit (DOT) para garantir a segurança da API seguindo o padrão OAuth 2.0. O sistema atua como um Authorization Server, onde o Django gerencia a emissão de tokens, enquanto o cliente React atua como um consumidor seguro.

Fluxo de Autenticação: Utilizamos o Resource Owner Password-based Grant, onde o cliente envia as credenciais do usuário junto ao client_id e client_secret para obter um access_token.

Segurança via Middleware: O OAuth2TokenMiddleware intercepta as requisições e valida a autenticidade do token Bearer antes mesmo do processamento da requisição.

Integração com DRF: A autenticação é delegada ao OAuth2Authentication, garantindo que todas as rotas protegidas exijam um token válido, retornando erro 401 Unauthorized caso o acesso seja indevido.

🎥 Demonstração do Sistema
Assista ao vídeo abaixo para ver a demonstração das rotas, o fluxo de geração de tokens via DOT e a interação segura entre o cliente React e a API:

👉 [https://youtu.be/zCXA_FCUDGU]

Para mais detalhes sobre as configurações, consulte a Documentação Oficial do Django OAuth Toolkit.

## 💻 Equipe de Desenvolvimento
* Jéssica Tainá Rodrigues Silva
* Maria Clara Maciel da Silva
* Tainara do Amaral Oliveira Azevedo
