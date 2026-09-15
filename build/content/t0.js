// Trilha 0 — Setup
module.exports = [
  {
    trilha: '0',
    numero: '01',
    titulo: 'Preparando o ambiente de desenvolvimento',
    subtitulo: 'gcc, editor, terminal e primeiros comandos',
    objetivo:
      'Deixar seu computador pronto para escrever, compilar e executar programas em C com confiança: entender o que o gcc faz, compilar um programa, ver erros de compilação e dar os primeiros passos no depurador gdb.',
    prerequisitos: 'Nenhum',
    duracao: '~45 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Capítulo 2, seções 2.4–2.7 (Building with gcc, clang, IDEs)',
      king: 'Capítulo 2.1 (Compiling and Linking)',
      foco:
        'No Beej, foque em como o compilador transforma seu arquivo .c em um executável e como passar flags. No King, entenda a diferença entre compilar e linkar.',
    },
    secoes: [
      {
        titulo: 'As ferramentas que você já tem',
        rotulo: 'verificando seu ambiente',
        paragrafos: [
          'Você já tem o compilador gcc instalado (MinGW-w64). Isso é o essencial. Para acompanhar o curso você precisa apenas de:',
        ],
        lista: [
          '<strong>gcc</strong> (compilador) — já instalado. No terminal, confira com <code>gcc --version</code>.',
          '<strong>Um editor de código</strong> — VS Code, Notepad++, Sublime ou o próprio Vim/Neovim. Qualquer um serve; o importante é salvar arquivos em texto puro.',
          '<strong>PowerShell</strong> (que você já usa) ou o <strong>Windows Terminal</strong> padrão do Windows 11.',
          '<strong>git</strong> (recomendado, para versionar seus exercícios) — instale de https://git-scm.com se ainda não tiver.',
        ],
        codigo: `gcc --version`,
        saida: `gcc.exe (MinGW-W64 x86_64-ucrt-posix-seh, built by Brecht Sanders, r4) 16.1.0
Copyright (C) 2026 Free Software Foundation, Inc.
...`,
      },
      {
        titulo: 'O que o gcc faz: do .c ao executável',
        paragrafos: [
          'Quando você roda <code>gcc prog.c</code>, o compilador executa quatro etapas em sequência:',
        ],
        lista: [
          '<strong>Pré-processamento</strong> (<code>cpp</code>): resolve as diretivas <code>#include</code>, <code>#define</code> etc.; gera um arquivo gigante "achatado".',
          '<strong>Compilação</strong>: transforma o C em <strong>assembly</strong> (linguagem da CPU).',
          '<strong>Montagem</strong> (<code>as</code>): transforma assembly em <strong>código de máquina</strong>, dentro de um arquivo objeto (<code>.o</code>).',
          '<strong>Linkagem</strong> (<code>ld</code>): junta seu código com a biblioteca padrão (stdio, string...) e produz o executável final.',
        ],
        rotulo: 'pipeline do compilador',
        codigo: `# Etapas que o gcc executa por baixo dos panos:
gcc -E prog.c      > prog.i   # 1. pré-processamento
gcc -S prog.i               # 2. compilação  -> prog.s (assembly)
gcc -c prog.s               # 3. montagem    -> prog.o (objeto)
gcc prog.o -o prog          # 4. linkagem    -> prog (executável)`,
      },
      {
        titulo: 'Seu primeiro programa compilado',
        paragrafos: [
          'Crie um arquivo chamado <code>hello.c</code> com o conteúdo abaixo. Preste atenção em cada linha: a diretiva <code>#include &lt;stdio.h&gt;</code> traz as declarações de <code>printf</code>; cada programa em C tem uma função <code>main</code>, que é o ponto de entrada; <code>printf</code> imprime; <code>return 0;</code> diz ao sistema operacional que o programa terminou com sucesso.',
        ],
        rotulo: 'hello.c',
        codigo: `#include <stdio.h>

int main(void)
{
    printf("Olá, mundo!\\n");
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 hello.c -o hello
> .\\hello.exe

Olá, mundo!`,
      },
      {
        titulo: 'Flags do gcc que você vai usar o tempo todo',
        paragrafos: [
          'As flags abaixo viram sua "higiene de compilação". Acostume-se a usá-las em todos os exercícios:',
        ],
        lista: [
          '<code>-Wall -Wextra</code> — liga avisos valiosos (warnings). Código limpo compila sem nenhum aviso.',
          '<code>-std=c11</code> — fixa o padrão da linguagem (C11). Também existem <code>c99</code> e <code>c17</code>.',
          '<code>-g</code> — inclui informações de depuração (necessário para o gdb).',
          '<code>-O0 / -O2</code> — nível de otimização. <code>-O0</code> (padrão) para estudar; <code>-O2</code> para programar "de verdade".',
          '<code>-o nome</code> — nome do executável de saída (senão o gcc gera <code>a.exe</code>).',
        ],
        rotulo: 'compilando com boas práticas',
        codigo: `gcc -Wall -Wextra -std=c11 -g -O0 hello.c -o hello`,
      },
      {
        titulo: 'Como ler um erro de compilação',
        paragrafos: [
          'Erros de compilação têm um formato padronizado: <em>arquivo</em>, <em>linha</em>, <em>coluna</em>, e a mensagem. Sempre corrija <strong>o primeiro erro primeiro</strong> — erros seguintes costumam ser "efeito colateral" dos anteriores.',
        ],
        rotulo: 'um erro de exemplo (falta o ;)',
        codigo: `#include <stdio.h>

int main(void)
{
    printf("Olá\\n")   // <-- falta o ponto e vírgula aqui
    return 0;
}`,
        saida: `hello.c:5:5: error: expected ';' before 'return'
    5 |     printf("Olá\\n")
      |     ^
      |     ;
    6 |     return 0`,
      },
      {
        titulo: 'Primeiros passos no depurador gdb',
        paragrafos: [
          'O gdb (GNU Debugger) deixa você executar o programa passo a passo e inspecionar variáveis — o que é essencial quando um programa compila mas não faz o que deveria. Na Trilha 4 (Cyber) vamos usar isso pesado. Por enquanto, aprenda os 4 comandos básicos:',
        ],
        lista: [
          '<code>gdb ./hello.exe</code> — abre o depurador com o programa carregado.',
          '<code>break main</code> — pausa a execução na função <code>main</code>.',
          '<code>run</code> (ou <code>r</code>) — roda o programa até o breakpoint.',
          '<code>next</code> (ou <code>n</code>) + <code>print var</code> — avança uma linha e imprime o valor de uma variável.',
        ],
        rotulo: 'sessão gdb',
        codigo: `gdb ./hello.exe
(gdb) break main
(gdb) run
(gdb) next
(gdb) print "chegamos até aqui"
(gdb) quit`,
      },
      {
        titulo: 'Organizando seus projetos',
        paragrafos: [
          'Crie uma pasta <code>exercicios</code> dentro desta (a pasta <code>aprenda-c</code>) e um subpasta por exercício. Sempre que terminar um exercício, compile com a dupla <code>-Wall -Wextra</code> e garanta zero avisos. A consistência de poucas pastas organizadas vale mais do que ferramentas sofisticadas nesta fase.',
        ],
        lista: [
          'Pastas sugeridas: <code>exercicios/</code>, <code>projetos/</code>, <code>labs/</code> (para a trilha Cyber).',
          'Nomeie os arquivos com padrão: <code>ex01.c</code>, <code>ex02.c</code>, ...',
          'Salve seus arquivos como UTF-8 (padrão dos editores modernos).',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Crie o arquivo <code>eu.c</code> que imprime seu nome e sua cidade em duas linhas. Compile com <code>gcc -Wall -Wextra -std=c11 eu.c -o eu</code> e rode. Se houver algum aviso, corrija até zerar.',
        dica: 'Use dois <code>printf</code> ou um só com <code>\\n</code> no meio.',
        solucao: `#include <stdio.h>

int main(void)
{
    printf("Seu Nome Aqui\\n");
    printf("Sua Cidade\\n");
    return 0;
}`,
      },
      {
        nivel: 1,
        enunciado:
          'Escreva um programa que cause, de propósito, um erro de compilação (ex.: esqueça o ponto e vírgula). Compile e leia a mensagem. Depois conserte e compile de novo até emitir nenhum erro/aviso.',
        dica: 'Tente trocar <code>return 0;</code> por <code>return 0</code> e veja onde o erro aparece.',
        solucao: `#include <stdio.h>

int main(void)
{
    printf("O erro já se foi\\n");
    return 0;
}`,
        solucao_obs: 'Repare que o tipo da mensagem de erro muda conforme o erro: "error" (bloqueia a compilação) vs "warning" (compila mas é suspeito).',
      },
      {
        nivel: 2,
        enunciado:
          'Declare uma variável inteira <code>x = 7</code> e um <code>y = 4</code>, imprima a soma, subtração, multiplicação e divisão <em>inteira</em> dos dois. O que acontece com 7/4? Compile com <code>-Wall -Wextra</code>.',
        dica: 'Divisão de inteiros em C trunca o resto. Experimente imprimir 7.0/4 também usando um literal float.',
        solucao: `#include <stdio.h>

int main(void)
{
    int x = 7, y = 4;
    printf("soma: %d\\n", x + y);
    printf("subtracao: %d\\n", x - y);
    printf("multiplicacao: %d\\n", x * y);
    printf("divisao inteira: %d\\n", x / y);      /* 7/4 = 1 (resto 3) */
    printf("divisao real: %.2f\\n", 7.0 / 4.0);   /* 1.75 */
    return 0;
}`,
        solucao_obs: 'O literal <code>7.0</code> é ponto flutuante, o que muda o tipo da operação. Veremos tipos a fundo na Trilha 1.',
      },
      {
        nivel: 2,
        enunciado:
          'Usando o gdb: compile <code>eu.c</code> com <code>-g</code>, abra com <code>gdb ./eu.exe</code>, coloque um breakpoint em <code>main</code>, rode, avance com <code>next</code> e saia com <code>quit</code>.',
        dica: 'Depois de <code>run</code>, o programa pausa em main. Cada <code>next</code> executa uma linha.',
        solucao: `> gcc -g -Wall -Wextra -std=c11 eu.c -o eu
> gdb ./eu.exe
(gdb) break main
Breakpoint 1 at ...
(gdb) run
(gdb) next
(gdb) next
(gdb) quit`,
        solucao_obs: 'Se o gdb pedir para sair com "Quit anyway? (y or n)", responda y.',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual comando compila hello.c gerando o executável hello (com warnings ativos)?',
        opcoes: [
          'gcc -Wall -Wextra -std=c11 hello.c -o hello',
          'gcc hello.c -v',
          'run hello.c',
          'gcc -Wall -Wextra -std=c11 -o hello.c hello',
        ],
        correta: 0,
        explicacao: 'A ordem do gcc é: <code>gcc [flags] [arquivos.c] -o [nome do executável]</code>.',
      },
      {
        pergunta: 'Qual função todo programa em C precisa ter para ser executado?',
        opcoes: ['start', 'main', 'begin', 'run'],
        correta: 1,
        explicacao: 'O sistema operacional chama a função <code>main</code> quando o programa inicia.',
      },
      {
        pergunta: 'A diretiva #include <stdio.h> tem a função de...',
        opcoes: [
          'compilar mais rápido',
          'incluir declarações da biblioteca padrão (como printf)',
          'criar o executável',
          'otimizar o código',
        ],
        correta: 1,
        explicacao: '<code>#include</code> copia o conteúdo do cabeçalho, que declara funções padrão como printf e scanf.',
      },
      {
        pergunta: 'O que significa a flag -g?',
        opcoes: [
          'gerar executável gráfico',
          'incluir símbolos de depuração (usado pelo gdb)',
          'depurar erros automaticamente',
          'usar o padrão C99',
        ],
        correta: 1,
        explicacao: '<code>-g</code> adiciona informações (nomes de variáveis, linhas) que o gdb usa.',
      },
      {
        pergunta: 'Na linha "hello.c:6:9: error: expected \';\'" — o que é o "6"?',
        opcoes: ['a coluna do erro', 'o número de erros', 'a linha onde está o erro', 'a versão do compilador'],
        correta: 2,
        explicacao: 'O formato é <code>arquivo:linha:coluna: tipo: mensagem</code>.',
      },
    ],
    projeto: {
      titulo: 'Cartão de visita em C',
      descricao:
        'Crie um programa <code>cartao.c</code> que imprime um "cartão de visita" ASCII: seu nome, papel/objetivo de estudo e um dos seus hobbies. Use <code>printf</code> com <code>\\n</code> e pelo menos um caractere de borda (ex.: <code>+---o---</code>). Compile com <code>-Wall -Wextra -std=c11</code> e garanta zero avisos.',
      criterios: [
        'Programa compila com <code>gcc -Wall -Wextra -std=c11 cartao.c -o cartao</code> sem erros nem avisos.',
        'Saída contém seu nome, objetivo e um hobby, formatada com bordas ou separadores.',
        'Função <code>main</code> retorna 0.',
        'Você consegue explicar cada linha para outra pessoa.',
      ],
    },
  },
];