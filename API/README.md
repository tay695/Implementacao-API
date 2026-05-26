# SoliBank

<p align="center">
   <img src="static/img/logo.png" width="400" alt="SoliBank Logo">
</p>

O SoliBank é uma plataforma web desenvolvida para facilitar o gerenciamento de doações, oferecendo um fluxo claro entre doadores, estoque interno e entidades beneficiadas. O sistema organiza todo o processo: desde o envio da doação, passando pela coleta, até sua destinação final para famílias e ONGs.

---

## 🎯 Objetivo do Sistema

O SoliBank tem como propósito:

* **Registrar** doações realizadas por usuários doadores.
* **Controlar** entradas e saídas de itens no estoque.
* Apoiar o trabalho do **Assistente Social** na organização e distribuição das doações.
* Manter **histórico e transparência** de todas as movimentações.

---

## 🧩 Arquitetura do Sistema

O sistema é modularizado em aplicativos (Apps) Django, cada um responsável por um conjunto específico de funcionalidades.

### 1. doador

Módulo responsável pela interação do doador com o sistema.

* **Funcionalidades:** Cadastro e login; Envio de doações por formulário; Informar ponto de coleta; Acompanhar o status da doação (coletada ou não); Visualizar histórico e informações permitidas.

### 2. estoque

Módulo central para o controle das doações recebidas.

* **Funcionalidades:** Registrar entradas (doações coletadas); Registrar saídas (destinadas às entidades beneficiadas); Listar itens e acompanhar quantidades disponíveis.
* **Fluxo Básico:** Doação enviada → fica pendente. Assistente Social coleta → gera entrada no estoque.

### 3. entidade\_beneficiada

Acesso exclusivo para o Assistente Social.

* **Funcionalidades:** Cadastro de famílias e ONGs beneficiadas; Atualização, consulta e remoção de registros; Visualização do histórico de itens recebidos.

### 4. doacao

App auxiliar que organiza e vincula as doações aos demais módulos.

* **Funcionalidades:** Registrar todas as doações enviadas pelos usuários; Controlar status da coleta; Relacionar doações às movimentações do estoque.

### 5. ponto\_de\_coleta

Módulo auxiliar que gerencia os locais físicos definidos para a entrega e coleta de doações.

* **Funcionalidades:** Cadastro e Gestão de locais de coleta (pelo Assistente Social); Permite ao Doador selecionar um ponto de coleta da lista no momento de registrar uma nova doação; Relaciona um ponto específico a cada registro de doação, auxiliando na logística de retirada.

---

## 👥 Perfis do Sistema e Permissões

### Assistente Social (Superusuário / Administrador)

Este perfil possui todas as permissões do sistema (`is_superuser=True`).

* **Responsabilidades Principais:** Gerenciar entidades beneficiadas; Controlar entradas e saídas do estoque; Atualizar o status das doações (coletada/não coletada); Administrar a logística interna do sistema.
* **Permissões de Grupo (Exemplo do Django Admin):** `Can add/change/delete/view` em todos os modelos de `entrada de log`, `grupo`, `permissão`, `usuário`, além de todas as permissões de gestão de dados.

### Doador (Usuário Comum / Grupo DOADORES)

Este perfil possui um conjunto limitado de permissões para interagir com o sistema.

* **Responsabilidades Principais:** Realizar cadastro e login; Envia doações via formulário, informando o ponto de coleta; Acompanha o status da própria doação.
* **Permissões de Grupo (Específicas do Sistema):**
    * **Doações:** `Can add doacao`, `Can change doacao`, `Can delete doacao`, `Can view doacao`
    * **Doador:** `Can change doador`
    * **Ponto de Coleta:** `Can view ponto coleta`

---

## 🔄 Fluxo do Sistema

1.  O **Doador** envia a doação pelo formulário e **seleciona um Ponto de Coleta** disponível.
2.  A doação fica registrada como **pendente** e vinculada ao ponto de coleta escolhido.
3.  O **Assistente Social** verifica as doações pendentes e atualiza o status para *coletada*.
4.  Se coletada, gera uma **entrada no estoque**.
5.  O Assistente Social destina os itens a famílias ou ONGs, registrando uma **saída**.
6.  Todo o processo fica registrado no histórico do sistema.

---

## 🛠️ Instruções de Execução

**Atenção:** Para garantir que as permissões do Grupo **DOADORES** sejam aplicadas corretamente, o comando `loaddata` é obrigatório. Certifique-se de que o arquivo de dados (`inicial_groups.json`) foi exportado via `dumpdata` e está presente na pasta `fixtures` do projeto.

### Pré-requisitos

* Python 3.8+
* Django 4.x
* Git (opcional)

### Passos para execução

1.  Clonar o repositório
2.  Aplicar as migrações do Django:
    ```bash
    python manage.py migrate
    ```
3.  **Carregar permissões iniciais e Grupos (DOADORES):**
    ```bash
    python manage.py loaddata inicial_groups.json
    ```
4.  Criar um superusuário (Assistente Social):
    ```bash
    python manage.py createsuperuser
    ```
5.  Executar o servidor:
    ```bash
    python manage.py runserver
    ```
6.  Acessar no navegador:
    ```
    [http://127.0.0.1:8000](http://127.0.0.1:8000)
    ```

Para mais detalhes sobre comandos, configurações e boas práticas, consulte a documentação oficial do Django: [🔗 https://www.djangoproject.com/](https://www.djangoproject.com/)

---

## 💻 Desenvolvedoras Full Stack

* Jéssica Tainá Rodrigues Silva
* Maria Clara Maciel da Silva
* Tainara do Amaral Oliveira Azevedo 

---

## 🎥 Vídeo de Apresentação do Sistema
(https://youtu.be/iaybZ06Mk8Y?si=mwBkW_7iS_z8DHZf)
