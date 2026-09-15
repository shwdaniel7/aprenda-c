<h1 align="center">APRENDA C</h1>

<p align="center"><strong>DO ZERO AO SHELLCODE</strong></p>

<p align="center"><em>Um compilador. Um leitor. Eu.</em></p>

<p align="center"><sub><em>made by daniel • @shwdaniel7 • para daniel • com ajuda de agentes de IA</em></sub></p>

---

## ⚠ Warning

APRENDA C é um curso **educacional e pessoal**. Foi escrito para **uma única pessoa: eu**. Se um dia ajudar você também, ótimo — mas ele foi desenhado para o *meu* ritmo, as *minhas* lacunas (ponteiros, memoria, syscalls) e o *meu* jeito de aprender: teoria curta, leitura guiada, muitos exemplos compiláveis e uma trilha inteira de exploração.

A **Trilha 4 (Cyber)** ensina exploração de memória em C — buffer overflow, format string, ROP, shellcode. É conhecimento dual-use e **existe para eu entender como (e por que) o C falha**, para escrever código defensivo de verdade.

- Execute a Trilha 4 **somente em WSL2 ou VM isolada**, fora de qualquer rede de produção.
- Nunca use isso contra software real, redes de terceiros ou sistemas sem autorização por escrito.
- Nenhum exploit deste curso funciona contra nada que não seja um binário-vítima **didático e fictício** criado nos próprios exercícios.
- Se você não é autorizado a testar um alvo, **não teste**.

---

## 📖 About

APRENDA C é um curso completo e **offline** (arquivos estáticos) de C11 em português, organizado em 5 trilhas e 50 módulos. Cada módulo traz teoria objetiva, exemplos completos e compiláveis, leitura guiada de duas referências clássicas — o [Beej's Guide to C](https://beej.us/guide/bgc/) (grátis, online) e *C Programming: A Modern Approach* (2ª ed., K. N. King) —, quiz de fixação, exercícios resolvidos e um projeto. O conteúdo sai de um conjunto de arquivos JS que alimentam um **gerador de site estático** (`build/build.js`), que produz um site HTML/CSS/JS sem dependências.

**Como este curso foi feito:** o conteúdo foi produzido com **agentes de IA** que executaram **pesquisas** na web e **analisaram livros** fornecidos por mim (incluindo o Beej's Guide e o livro do King) para extrair a teoria, validar a ordem pedagógica e garantir que cada exemplo fosse correto e compilável. Todo código é verificado de verdade: os exemplos são extraídos e compilados com `gcc` por um script do próprio repositório. A experiência é minha — eu leio, compilo, quebro e reescrevo — mas a curadoria e a redação foram fortemente apoiadas por IA.

O fluxo é linear e cumulativo: cada módulo aponta os pré-requisitos exatos e o que aprender antes de prosseguir.

O projeto nasceu de uma decisão simples: antes de seguir para segurança e sistemas, eu precisava aprender C **para valer** — não "saber ler C". A trilha Cyber existe como destino final e motivação, não como atalho.

**Planos:** pretendo **adicionar mais fontes de livros e referências** ao longo do tempo para enriquecer o curso — novos capítulos de leitura guiada, exercícios e material complementar conforme eu avançar e encontrar obras que valham a pena.

---

## ✨ Capabilities

| Trilha | Módulos | Foco | Avaliação |
|---|---|---|---|
| 0 — Setup | 1 | Instalar toolchain, compilar o primeiro "Olá, mundo", entender o pipeline | Quiz + exercício |
| 1 — Fundamentos | 12 | Variáveis, controle de fluxo, funções, ponteiros, arrays, structs, strings | Quiz + exercícios |
| 2 — Intermediário | 15 | Memória dinâmica, arquivos, variádicas, estruturas de dados, linked lists | Quiz + exercícios + projeto |
| 3 — Avançado | 12 | Make e ferramentas, múltiplos arquivos, data/hora, UTF-8, capstone de persistência | Quiz + exercícios + projeto |
| 4 — Cyber | 10 | Cast, buffer overflow, format string, ROP/ret2libc, shellcode, defesa, escrita segura | Quiz + exercícios + projeto |

O curso oferece:

- **50 módulos** com pré-requisitos explícitos e navegação linear
- teoria curta por seções, com blocos de código **completos e compiláveis**: `gcc -Wall -Wextra -std=c11`
- leitura guiada do Beej (link) e do King (leitura recomendada — **nenhum PDF é redistribuído**)
- quiz de fixação com explicação automática da alternativa correta
- exercícios com gabarito comentado (`solucao` + `solucao_obs`)
- 50 projetos práticos com critérios de aceite explícitos
- **compile-check automatizado**: todo bloco de código do curso é extraído e compilado de verdade
- barra de progresso local (localStorage) e sintaxe destacada, sem frameworks
- painel de carga horária calculado por conteúdo (≈ **34,3h de aulas**, ≈ **117,8h–184,3h de prática**, ≈ **152h–219h total**)

---

## 📂 Project Structure

```
aprenda-c/
├── README.md
├── .gitignore
├── .nojekyll (na raiz servida pelo Pages)
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── highlight.js   (destaque de sintaxe)
│       ├── progress.js    (barra de progresso local)
│       └── quiz.js        (quizzes interativos)
├── build/
│   ├── build.js           (gera site/ a partir do conteúdo)
│   ├── check-links.js     (valida os links do site)
│   ├── compile-check.js   (extrai e compila todos os códigos)
│   ├── validate.js        (valida o schema dos módulos)
│   └── content/
│       ├── t0.js          (Trilha 0 — Setup, 1 módulo)
│       ├── t1.js          (Trilha 1 — Fundamentos, 12 módulos)
│       ├── t2.js          (Trilha 2 — Intermediário, 12 módulos)
│       ├── t2e.js         (Trilha 2 — continuação, módulos 13–15)
│       ├── t3.js          (Trilha 3 — Avançado, 8 módulos)
│       ├── t3e.js         (Trilha 3 — continuação, módulos 09–12)
│       └── t4.js          (Trilha 4 — Cyber, 10 módulos)
└── site/                  (saída gerada — o que vai para o Pages)
    ├── index.html         (painel geral + carga horária)
    ├── exercicios/
    ├── projetos/
    ├── trilha-0-setup/
    ├── trilha-1-fundamentos/
    ├── trilha-2-intermediario/
    ├── trilha-3-avancado/
    ├── trilha-4-cyber/
    └── assets/            (cópia do CSS/JS)
```

- `build/content/*.js` é a **única fonte de verdade** do curso.
- `build/build.js` transforma o conteúdo em 53 páginas HTML estáticas.
- `build/validate.js` garante que todo módulo respeita o schema (seções, exercícios, projeto, quiz).
- `build/compile-check.js` extrai **todos** os blocos de código e os compila de verdade (333/333 aprovados).
- `build/check-links.js` percorre as 53 páginas e confere todos os links internos.
- `site/` é a pasta publicada no GitHub Pages — nunca edite à mão, edite o conteúdo e rode o build.

---

## 🔄 Fluxo de aprendizagem

```text
[Setup] Trilha 0 — instalar gcc/WSL2 e rodar o primeiro programa
        │
        ▼
[Fundamentos] Trilha 1 — sintaxe, tipos, ponteiros, structs, strings
        │
        ▼
[Intermediário] Trilha 2 — memória dinâmica, arquivos, estruturas de dados
        │
        ▼
[Avançado] Trilha 3 — ferramentas, múltiplos arquivos, capstone
        │
        ▼
[Cyber] Trilha 4 — entender as falhas para aprender a não cometê-las
        │
        ▼
[FIM] código defensivo + base para sistemas e baixo nível
```

Só avance para um módulo quando o anterior estiver **compilado manualmente** (não apenas lido). Cada aula termina com quiz; cada trilha, com projeto e critérios de aceite.

---

## 🚀 Installation

```bash
git clone https://github.com/shwdaniel7/aprenda-c.git
cd aprenda-c
node build/build.js     # gera (ou regera) site/ a partir do conteúdo
```

Pré-requisitos:

- **gcc** (MinGW no Windows ou gcc no WSL2) — para os exemplos: `gcc -Wall -Wextra -std=c11`
- **Node.js** — somente para rodar o gerador/validações
- **WSL2 ou VM isolada** — obrigatório para a Trilha 4

> Nenhum `npm install` é necessário. Zero dependências de runtime.

---

## 💻 Usage

O curso é consumido por navegador, de preferência **offline**:

```bash
# abre o painel principal
start site/index.html        # Windows
xdg-open site/index.html     # Linux/WSL2
```

ou no navegador, em qualquer lugar do mundo:

```text
https://shwdaniel7.github.io/aprenda-c/
```

Pipeline de geração e verificação:

```bash
node build/build.js          # gera site/
node build/validate.js       # valida schema dos 50 módulos
node build/compile-check.js  # compila todos os exemplos (333/333)
node build/check-links.js    # confere links das 53 páginas
```

Navegação: o painel em `index.html` mostra as 5 trilhas, a carga horária e o total geral. Cada módulo tem seções teóricas, código, quiz e um projeto com critérios. A barra de progresso fica salva localmente por navegador.

### Exemplo de interação

Compilando e rodando o primeiro programa do curso, direto do terminal:

```text
$ cat > ola.c <<'EOF'
#include <stdio.h>

int main(void) {
    printf("Olá, mundo!\n");
    return 0;
}
EOF

$ gcc -Wall -Wextra -std=c11 ola.c -o ola && ./ola
Olá, mundo!

$ node build/build.js
[build] 50/50 módulos processados
[build] 53 páginas geradas em site/
```

### Painel de carga horária

O `index.html` calcula a estimativa por conteúdo (não por opinião):

| Coluna | Valor |
|---|---|
| Módulos | 50 |
| Aulas (site) | ≈ 34,3h |
| Prática (mínimo–máximo) | ≈ 117,8h – 184,3h |
| **Total estimado** | **≈ 152h – 219h** |

Com um ritmo realista de 8–10h/semana, o curso completo fica em **4–6 meses**; apenas trilhas 1–3, **3–4 meses**.

---

## 🧪 Testing

O repo não roda uma suíte de testes no sentido clássico, mas tem **três validações automatizadas** que rodam de verdade:

```bash
node build/validate.js       # schema: seções, exercícios, projeto, quiz, duração
node build/compile-check.js  # extrai TODO código do curso e compila (gcc)
node build/check-links.js    # percorre as 53 páginas e valida os links
```

- `compile-check` cobre 333 blocos de código e falha o build se **um único** exemplo não compilar.
- Dois módulos (T2.09 e T3.08) dependem de chamadas de sistema Linux e são pulados com guarda explícita — não são "compilados às cegas" no Windows.
- Os artefatos temporários das checagens vivem em `build/_tmp/` e são **ignorados pelo git** (`.gitignore`).

---

## 🔬 Conceitos técnicos por trilha

### Trilha 1 — Fundamentos

- Tipos, escopo, controle de fluxo e funções em C11.
- **Ponteiros são ensinados cedo**, com diagramas mentais de pilha.
- Arrays, structs e strings como o `\0` manda.

### Trilha 2 — Intermediário

- `malloc`/`free`, vazamentos, valgrind (ou ASan) para pegar o que o compilador não vê.
- Arquivos em texto e binário, funções variádicas (`printf` por dentro).
- Linked lists e estruturas de dados "na mão" — antes de qualquer STL, que em C não existe.

### Trilha 3 — Avançado

- Compilação multiarquivo, `make`, flags de build, depuração.
- Data/hora, encoding UTF-8, ferramentas do ecossistema.
- Capstone: um programa de persistência de verdade, com critérios de aceite.

### Trilha 4 — Cyber

- Endereços e invalidação de cast, `-m32 -fno-stack-protector -z execstack -no-pie`.
- Buffer overflow clássico, format string, ret2libc/ROP, shellcode mínimo.
- **Defensivo de verdade**: por que as mitigações existem e como escrever C que não precisa delas.
- Regra dura: emitida e reafirmada — só WSL2/VM, só binários-vítima fictícios, nunca redes reais.

---

## 📚 Technologies

- **C11** (padrão rigoroso) — `gcc -Wall -Wextra -std=c11`
- **Beej's Guide to C** — leitura guiada (online, grátis)
- **C Programming: A Modern Approach** (K. N. King) — leitura recomendada (não redistribuída)
- HTML/CSS/JS **vanilla** — zero frameworks, funciona offline via `file://`
- Node.js — somente no pipeline de build/validação
- GitHub Pages — hospedagem do site gerado

---

## ⚖ Legal Notice

APRENDA C é material educacional criado **por mim e para mim** (com curadoria de conteúdo e escrita assistidas por agentes de IA), hospedado publicamente para acesso de qualquer lugar.

O conteúdo Cyber é estritamente **didático e de pesquisa**, executado apenas contra binários-vítima fictícios criados nos próprios exercícios, em WSL2/VM isolada.

O autor não se responsabiliza por mau uso, testes sem autorização ou qualquer ação tomada com este material. Use apenas onde você tem permissão explícita para testar.

O curso **referencia** o Beej's Guide e o livro do King por links; nenhum PDF, código-fonte ou texto dessas obras é redistribuído no repositório.