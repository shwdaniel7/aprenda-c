// Trilha 3 — Avançado
module.exports = [
  {
    trilha: '3',
    numero: '01',
    titulo: 'Biblioteca padrão e tratamento de erros',
    subtitulo: 'stdlib, errno, exit status, atexit e assert',
    objetivo:
      'Conhecer o mapa da biblioteca padrão do C e adotar a postura de quem programa "à prova de erros": retornar status de saída explícitos, validar conversões com strtol, descobrir a causa de uma falha com errno/perror/strerror, agendar limpeza com atexit e usar assert como trava de desenvolvimento.',
    prerequisitos: 'T2.10 (funções), T2.11 (strings), T2.13 (arquivos)',
    duracao: '~35 min',
    nivel: 'Avançado',
    leitura: {
      beej: 'Capítulos 18 (Error Handling) e 28 (visão geral da biblioteca padrão)',
      king: 'Capítulos 21 (The Standard Library) e 24 (Error Handling)',
      foco:
        'No King, o capítulo 21 é um mapa dos cabeçalhos padrão: foque em stdio.h, stdlib.h, string.h, math.h, ctype.h, limits.h e errno.h. O capítulo 24 explica o padrão de tratamento de erros que vamos exercitar.',
    },
    secoes: [
      {
        titulo: 'Um mapa da biblioteca padrão',
        rotulo: 'visão geral',
        paragrafos: [
          'A biblioteca padrão do C é o conjunto de funções e macros que acompanham qualquer compilador. Ela não é parte da "linguagem" (sintaxe), mas sem ela não existe programa prático. Você já usa várias; aqui está o mapa para quem quer enxergar o todo:',
        ],
        lista: [
          '<code>&lt;stdio.h&gt;</code> — entrada/saída <em>padrão</em>: <code>printf</code>, <code>fopen</code>, <code>fgets</code>, <code>fwrite</code>.',
          '<code>&lt;stdlib.h&gt;</code> — utilitários gerais: <code>malloc/free</code>, <code>strtol</code>, <code>atoi</code>, <code>exit</code>, <code>atexit</code>, <code>qsort</code>.',
          '<code>&lt;string.h&gt;</code> — manipulação de strings e memória: <code>strcpy</code>, <code>strlen</code>, <code>memcpy</code>, <code>strtok</code>.',
          '<code>&lt;math.h&gt;</code> — funções matemáticas: <code>sqrt</code>, <code>pow</code>, <code>floor</code>, <code>isfinite</code>.',
          '<code>&lt;time.h&gt;</code> — tempo e datas: <code>time</code>, <code>clock</code>, <code>difftime</code>.',
          '<code>&lt;ctype.h&gt;</code> — classificação de caracteres: <code>isalpha</code>, <code>isdigit</code>, <code>toupper</code>.',
          '<code>&lt;limits.h&gt;</code> e <code>&lt;float.h&gt;</code> — faixas e precisão dos tipos (INT_MAX, DBL_EPSILON...).',
          '<code>&lt;errno.h&gt;</code> — a variável global <code>errno</code> para reportar o último erro da libc.',
          '<code>&lt;assert.h&gt;</code> — a macro <code>assert</code> para validações em tempo de desenvolvimento.',
        ],
      },
      {
        titulo: 'Aberturas de arquivo com verificação completa',
        rotulo: 'abre.c',
        paragrafos: [
          'O erro mais comum de quem começa é ignorar o retorno de <code>fopen</code>. Quando o arquivo não existe, <code>fopen</code> devolve <code>NULL</code> e o motivo fica na variável global <code>errno</code> (um número inteiro). <code>strerror(errno)</code> converte esse número numa mensagem legível; <code>perror("texto")</code> imprime o texto seguido de dois-pontos e da mensagem. Depois do loop de leitura, <code>ferror(fp)</code> detecta erros de I/O que não apareceram durante a leitura.',
        ],
        lista: [
          'Sempre verifique o retorno de <code>fopen</code> antes de usar o ponteiro.',
          'No loop, prefira <code>fgets</code> e teste <code>ferror</code> ao final (sair do loop não significa sucesso).',
          'Use <code>EXIT_FAILURE</code> para falhas e <code>EXIT_SUCCESS</code> no fim normal (definidos em <code>&lt;stdlib.h&gt;</code>).',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

int main(int argc, char **argv)
{
    if (argc != 2) {
        fprintf(stderr, "uso: %s <arquivo>\\n", argv[0]);
        return EXIT_FAILURE;
    }
    FILE *fp = fopen(argv[1], "r");
    if (fp == NULL) {
        fprintf(stderr, "fopen: %s\\n", strerror(errno));
        return EXIT_FAILURE;
    }
    char linha[256];
    unsigned num_linhas = 0;
    while (fgets(linha, sizeof linha, fp) != NULL) {
        num_linhas++;
    }
    if (ferror(fp)) {
        fprintf(stderr, "leitura: %s\\n", strerror(errno));
        fclose(fp);
        return EXIT_FAILURE;
    }
    printf("%s tem %u linhas\\n", argv[1], num_linhas);
    fclose(fp);
    return EXIT_SUCCESS;
}`,
        saida: `> abre nao_existe.txt
fopen: No such file or directory     (sai com EXIT_FAILURE)

> abre numeros.txt    (arquivo com 1.5, 2.5 e 3.0, uma por linha)
numeros.txt tem 3 linhas`,
      },
      {
        titulo: 'Validando conversão de texto para número com strtol',
        rotulo: 'divisor.c',
        paragrafos: [
          '<code>strtol</code> (e o irmão de 64 bits <code>strtoll</code>) é a forma correta de converter texto em inteiro — muito superior a <code>atoi</code>, que não sinaliza erro nenhum. Ela devolve o número e usa três canais para reportar problema: <code>errno</code> (fica <code>ERANGE</code> se o valor estourar a faixa), o ponteiro <code>endptr</code> (aponta onde a conversão parou), e o retorno. Regras de ouro: zere <code>errno</code> antes; considere falha se <code>endptr == nptr</code> (nada foi convertido) ou se sobrarem caracteres (<code>*endptr != \'\\0\'\</code>).',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>

int main(int argc, char **argv)
{
    if (argc != 3) {
        fprintf(stderr, "uso: %s <dividendo> <divisor>\\n", argv[0]);
        return EXIT_FAILURE;
    }
    errno = 0;
    char *fim = NULL;
    long long a = strtoll(argv[1], &fim, 10);
    if (errno == ERANGE || fim == argv[1] || *fim != '\\0') {
        fprintf(stderr, "dividendo invalido: %s\\n", argv[1]);
        return EXIT_FAILURE;
    }
    errno = 0;
    fim = NULL;
    long long b = strtoll(argv[2], &fim, 10);
    if (errno == ERANGE || fim == argv[2] || *fim != '\\0') {
        fprintf(stderr, "divisor invalido: %s\\n", argv[2]);
        return EXIT_FAILURE;
    }
    if (b == 0) {
        fprintf(stderr, "divisao por zero\\n");
        return EXIT_FAILURE;
    }
    if (a == LLONG_MIN && b == -1) {
        fprintf(stderr, "overflow: LLONG_MIN / -1\\n");
        return EXIT_FAILURE;
    }
    printf("%lld / %lld = %lld (resto %lld)\\n", a, b, a / b, a % b);
    return EXIT_SUCCESS;
}`,
        saida: `> divisor 100 8
100 / 8 = 12 (resto 4)

> divisor 100 0
divisao por zero

> divisor abc 5
dividendo invalido: abc

> divisor -9223372036854775808 -1
overflow: LLONG_MIN / -1`,
        },
      {
        titulo: 'exit, exit status e atexit',
        rotulo: 'despedida.c',
        paragrafos: [
          'A função <code>main</code> retornar um número (o <em>exit status</em>) é como o programa responde ao sistema operacional: 0 (ou <code>EXIT_SUCCESS</code>) significa sucesso; qualquer outro valor (convencionalmente <code>EXIT_FAILURE</code> = 1) significa falha. <code>exit(n)</code> encerra no meio do caminho executando a mesma limpeza do <code>return</code> de main; <code>_Exit(n)</code> encerra <strong>sem</strong> limpeza nenhuma. <code>atexit(funcao)</code> registra funções que rodam na saída — na ordem inversa do registro (LIFO).',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

static void limpar(void)
{
    printf("limpando recursos...\\n");
}

static void despedida(void)
{
    printf("ate logo!\\n");
}

int main(void)
{
    atexit(limpar);
    atexit(despedida);
    printf("corpo do programa\\n");
    return 0;
}`,
        saida: `> despedida
corpo do programa
ate logo!
limpando recursos...`,
      },
      {
        titulo: 'assert: a trava de desenvolvimento',
        rotulo: 'fat.c',
        paragrafos: [
          'A macro <code>assert(expressao)</code> aborta o programa com uma mensagem se a expressão for falsa — mas somente na compilação de desenvolvimento. É a forma barata de declarar pré-condições: "aqui, esta condição TEM que valer". No momento da release, você compila com <code>-DNDEBUG</code> e todas as asserções somem do executável (sem custo). Note a diferença: assert serve para <strong>bugs de lógica</strong>, não para erros de usuário (esses você trata com errno/if).',
        ],
        codigo: `#include <stdio.h>
#include <assert.h>

static int fatorial(int n)
{
    assert(n >= 0 && n <= 12);
    int r = 1;
    for (int i = 2; i <= n; i++) {
        r *= i;
    }
    return r;
}

int main(void)
{
    printf("5! = %d\\n", fatorial(5));
    printf("12! = %d\\n", fatorial(12));
    return 0;
}`,
        saida: `> fat
5! = 120
12! = 479001600`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Escreva um programa que tenta abrir uma arquivo inexistente e mostra o erro de três formas: (1) imprimindo o valor cru de <code>errno</code>, (2) com <code>perror</code>, (3) com <code>strerror(errno)</code> dentro de um <code>printf</code> seu.',
        dica: 'Lembre-se de incluir <code>&lt;errno.h&gt;</code>. <code>perror</code> recebe um rótulo e já escreve na saída de erro.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

int main(void)
{
    FILE *fp = fopen("arquivo_que_nao_existe.txt", "r");
    if (fp == NULL) {
        printf("errno = %d\\n", errno);
        perror("perror diz");
        printf("strerror diz: %s\\n", strerror(errno));
        printf("mensagem propria: nao consegui abrir o arquivo\\n");
        return EXIT_FAILURE;
    }
    fclose(fp);
    return EXIT_SUCCESS;
}`,
        solucao_obs: 'No Windows (MinGW) a mensagem vem em inglês — "No such file or directory". O número <code>errno</code> 2 é ENOENT. Em scripts você compara com as constantes, nunca com números mágicos.',
      },
      {
        nivel: 2,
        enunciado:
          'Crie uma função <code>media(const double v[], size_t n)</code> que tem <code>assert(n > 0)</code>. Compile e rode sem flags; depois compile com <code>-DNDEBUG</code> e rode de novo, observando o que muda quando a pré-condição é violada chame <code>media</code> com um vetor vazio.',
        dica: 'No teste, chame <code>media</code> com n == 0 de propósito. Com assert ativo o programa aborta; com NDEBUG ele segue e faz divisão por zero.',
        solucao: `#include <stdio.h>
#include <assert.h>

static double media(const double v[], size_t n)
{
    assert(n > 0);
    double soma = 0.0;
    for (size_t i = 0; i < n; i++) {
        soma += v[i];
    }
    return soma / (double)n;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);   /* saia de vez (sem buffer) antes do abort */
    printf("media = %.2f\\n", media((double[]){10.0, 20.0, 30.0}, 3));
    printf("media vazia = %.2f\\n", media((double[]){5.0}, 0));
    return 0;
}`,
        solucao_obs: 'Saída com assert ativo: "media = 20.00" seguida de "Assertion failed: n > 0". Com <code>-DNDEBUG</code>: "media = 20.00" e "media vazia = -nan(ind)" (0.0/0.0). Isso é o assert na prática: ele pega o bug antes dele virar comportamento estranho.',
      },
      {
        nivel: 3,
        enunciado:
          'Implemente um somador de linha de comando <code>somaargs 10 20 30</code> que soma todos os argumentos (de <code>long long</code>). Cada argumento deve ser validado com <code>strtoll</code> (ERANGE, sem conversão, sobra de caracteres) e a soma deve detectar overflow <strong>antes</strong> de somar, usando <code>LLONG_MAX</code>/<code>LLONG_MIN</code>.',
        dica: 'A soma estoura se <code>(v > 0 && soma > LLONG_MAX - v)</code> ou <code>(v < 0 && soma < LLONG_MIN - v)</code>. Isso evita que a soma sequer chegue a estourar.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>

int main(int argc, char **argv)
{
    long long soma = 0;
    for (int i = 1; i < argc; i++) {
        errno = 0;
        char *fim = NULL;
        long long v = strtoll(argv[i], &fim, 10);
        if (errno == ERANGE || fim == argv[i] || *fim != '\\0') {
            fprintf(stderr, "argumento %d invalido: %s\\n", i, argv[i]);
            return EXIT_FAILURE;
        }
        if ((v > 0 && soma > LLONG_MAX - v) ||
            (v < 0 && soma < LLONG_MIN - v)) {
            fprintf(stderr, "overflow da soma\\n");
            return EXIT_FAILURE;
        }
        soma += v;
    }
    printf("soma = %lld\\n", soma);
    return EXIT_SUCCESS;
}`,
        solucao_obs: 'Observe a saída real: <code>somaargs 10 20 30</code> imprime "soma = 60"; <code>somaargs 9223372036854775807 5</code> imprime "overflow da soma"; <code>somaargs 1 dois</code> imprime "argumento 2 invalido".',
      },
    ],
    quiz: [
      {
        pergunta: 'fopen falhou e devolveu NULL. Qual é a melhor forma de saber o motivo?',
        opcoes: [
          'Usar atoi',
          'Ler a variável global errno (com strerror/perror)',
          'Chamar fclose mesmo assim',
          'Imprimir o ponteiro com %p',
        ],
        correta: 1,
        explicacao: 'A libc deixa o motivo em <code>errno</code>; <code>strerror(errno)</code> converte em texto e <code>perror</code> imprime direto.',
      },
      {
        pergunta: 'O que significa, por convenção, retornar EXIT_SUCCESS em main?',
        opcoes: ['O programa falhou', 'O programa terminou com sucesso', 'Erro de compilação', 'O programa segue em segundo plano'],
        correta: 1,
        explicacao: '<code>EXIT_SUCCESS</code> é 0, o status padrão de sucesso para o sistema operacional.',
      },
      {
        pergunta: 'O que faz a função atexit(funcao)?',
        opcoes: [
          'Executa funcao imediatamente',
          'Registra funcao para rodar na saída do programa (LIFO)',
          'Cria uma thread',
          'Aborta o programa',
        ],
        correta: 1,
        explicacao: 'Ate exit: handlers registrados rodam na ordem inversa do registro quando o programa termina.',
      },
      {
        pergunta: 'Por que assert é uma ferramenta de desenvolvimento e não de produção?',
        opcoes: [
          'Porque compilando com -DNDEBUG as asserções são removidas',
          'Porque assert imprime a mensagem em inglês',
          'Porque assert precisa de internet',
          'Porque assert retorna errno',
        ],
        correta: 0,
        explicacao: '<code>-DNDEBUG</code> define o símbolo que desativa <code>assert</code>; na release elas não existem no executável.',
      },
      {
        pergunta: 'strtol indica que o valor não coube no tipo devolvendo...',
        opcoes: ['NULL', '-1', 'ERANGE em errno', 'um ponteiro nulo em endptr'],
        correta: 2,
        explicacao: 'Quando o número estoura, <code>strtol</code> devolve o limite e deixa <code>errno == ERANGE</code>.',
      },
    ],
    projeto: {
      titulo: 'wc-lite: contador de linhas, palavras e bytes',
      descricao:
        'Crie um utilitário tipo o <code>wc</code> do Linux: <code>wclite arquivo.txt</code> imprime o número de linhas, de palavras (separadas por espaço/tab/nova linha) e de bytes do arquivo. Trate TODOS os erros: argumento ausente (uso), arquivo inexistente (strerror), erro no meio da leitura (ferror). Use EXIT_SUCCESS/EXIT_FAILURE corretamente e registre um atexit que imprime o tempo total gasto.',
      criterios: [
        'Compila sem avisos com <code>gcc -Wall -Wextra -std=c11</code>.',
        'Sem o argumento de arquivo, mostra a mensagem de uso e retorna EXIT_FAILURE.',
        'Arquivo inexistente: mensagem com strerror(errno) e EXIT_FAILURE.',
        'Relatório correto de linhas/palavras/bytes para um arquivo de teste com 3 linhas.',
        'Saída final ordenada (não embaralhada) quando você o redireciona para um arquivo.',
      ],
    },
  },
  {
    trilha: '3',
    numero: '02',
    titulo: 'Como os números vivem na memória',
    subtitulo: 'complemento de 2, IEEE 754, NaN/Infinity e sizes',
    objetivo:
      'Descer até o bit: entender por que ~x+1 == -x, ler um float como sinal+expoente+mantissa, explicar a inexatidão de 0.1, reconhecer NaN/Infinity, e saber que sizeof/limits mudam de plataforma para plataforma.',
    prerequisitos: 'T3.01; T2.09 (arrays e ponteiros) ajuda',
    duracao: '~35 min',
    nivel: 'Avançado',
    leitura: {
      beej: 'Capítulos 14–15 (typecasting e bitwise) e 37 (floating point obs.)',
      king: 'Capítulo 7 (Tipos básicos) e seção 20.1 (nível de bits)',
      foco:
        'No King, o capítulo 7 é o lar dos tipos; a seção 20.1 é onde você vê bits, bytes e palavras. No Beej, foque nos operadores de bits (<<, >>, &, |, ~) porque vamos usá-los para inspecionar números.',
    },
    secoes: [
      {
        titulo: 'Inteiros e o complemento de 2',
        paragrafos: [
          'Praticamente todos os processadores modernos representam inteiros negativos em <strong>complemento de 2</strong>: o negativo de um número é <code>~x + 1</code> (inverte todos os bits e soma 1). Isso faz com que a soma <code>x + (~x + 1)</code> vire exatamente zero sem lógica especial, e que o bit mais significativo funcione como sinal. Consequências práticas: a faixa é assimétrica (num int de 32 bits vai de -2147483648 a 2147483647), estouro de sinal é um undefined behavior teórico (embora na prática ele "dê a volta"), e <code>INT_MIN</code> é o único cujo negativo não cabe.',
        ],
        lista: [
          'Em complemento de 2, <code>~x + 1</code> é sempre igual a <code>-x</code> — teste no exercício 2.',
          'O bit mais à esquerda = 0 para positivos, 1 para negativos.',
          'Somador de hardware não diferencia positivo/negativo: a matemática "simplesmente funciona".',
          'Nunca desloque um valor negativo para a direita esperando o sinal se propagar — comportamento de implementação.',
        ],
      },
      {
        titulo: 'Lendo os bits de um float',
        rotulo: 'bits.c',
        paragrafos: [
          'Um <code>float</code> IEEE 754 de 32 bits divide-se em três campos: <strong>1 bit de sinal</strong>, <strong>8 bits de expoente</strong> (com viés de 127) e <strong>23 bits de mantissa</strong> (a fração binária, com um 1 implícito). O valor é <code>±1.fração × 2^(expoente−127)</code>. O truque clássico para inspecionar os bits é uma <code>union</code> que enxerga os mesmos 4 bytes como <code>float</code> ou como <code>uint32_t</code>.',
        ],
        codigo: `#include <stdio.h>
#include <stdint.h>

static void bits_float(float f)
{
    union {
        float f;
        uint32_t u;
    } conv;
    conv.f = f;
    printf("%10g = ", (double)f);
    for (int i = 31; i >= 0; i--) {
        putchar((conv.u >> i) & 1u ? '1' : '0');
        if (i == 31 || i == 23) {
            putchar(' ');
        }
    }
    putchar('\\n');
}

int main(void)
{
    bits_float(1.0f);
    bits_float(0.5f);
    bits_float(-2.5f);
    return 0;
}`,
        saida: `> bits
         1 = 0 01111111 00000000000000000000000
       0.5 = 0 01111110 00000000000000000000000
      -2.5 = 1 10000000 01000000000000000000000`,
      },
      {
        titulo: 'Por que 0.1 é inexato',
        rotulo: 'inexato.c',
        paragrafos: [
          'Assim como 1/3 não tem representação finita em decimal, 0.1 em binário é uma dízima periódica. Então <code>0.1</code> guardado num double é o "mais próximo representável" — e não o 0.1 exato. Somar dez vezes esse valor não devolve 1.0, e <code>0.1 + 0.2</code> não é <code>0.3</code>. Isso não é bug do C: é a natureza do ponto flutuante. A comparação correta usa uma tolerância (ex.: <code>fabs(a - b) &lt; 1e-9</code>).',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    double soma = 0.0;
    for (int i = 0; i < 10; i++) {
        soma += 0.1;
    }
    printf("soma = %.20f\\n", soma);
    printf("soma == 1.0? %s\\n", soma == 1.0 ? "sim" : "NAO");
    printf("1.0 - soma = %.20g\\n", 1.0 - soma);
    double a = 0.1 + 0.2;
    printf("0.1 + 0.2 = %.20f\\n", a);
    printf("0.1 + 0.2 == 0.3? %s\\n", a == 0.3 ? "sim" : "NAO");
    return 0;
}`,
        saida: `> inexato
soma = 0.99999999999999988898
soma == 1.0? NAO
1.0 - soma = 1.1102230246251565404e-16
0.1 + 0.2 = 0.30000000000000004441
0.1 + 0.2 == 0.3? NAO`,
      },
      {
        titulo: 'NaN e Infinity: os valores especiais',
        rotulo: 'especiais.c',
        paragrafos: [
          'O IEEE 754 reserva valores de expoente para representar <em>infinito</em> e <em>não-número</em> (NaN). Dividir por zero dá <code>inf</code> (ou <code>-inf</code>); 0.0/0.0 dá NaN. A macro <code>isfinite</code> de <code>&lt;math.h&gt;</code> testa se o número é finito, e <code>isnan</code> testa NaN. A regra de ouro: <strong>NaN nunca é igual a nada</strong>, nem a ele mesmo — <code>nan == nan</code> é falso. É por isso que você testa com <code>isnan</code> e não com <code>==</code>.',
        ],
        codigo: `#include <stdio.h>
#include <math.h>

int main(void)
{
    double inf = 1.0 / 0.0;
    double nan = 0.0 / 0.0;
    printf("1.0/0.0 = %g\\n", inf);
    printf("0.0/0.0 = %g\\n", nan);
    printf("inf e finito? %s\\n", isfinite(inf) ? "sim" : "nao");
    printf("nan e NaN? %s\\n", isnan(nan) ? "sim" : "nao");
    printf("inf == inf? %s\\n", inf == inf ? "sim" : "nao");
    printf("nan == nan? %s\\n", nan == nan ? "sim" : "nao");
    return 0;
}`,
        saida: `> especiais
1.0/0.0 = inf
0.0/0.0 = -nan(ind)
inf e finito? nao
nan e NaN? sim
inf == inf? sim
nan == nan? nao`,
      },
      {
        titulo: 'sizeof, limits.h e a verdade das plataformas',
        rotulo: 'sizes.c',
        paragrafos: [
          'O C garante faixas <em>mínimas</em>, não tamanhos exatos. O mesmo código compilado em Windows e Linux pode mudar: no Windows (modelo LLp64) <code>long</code> tem 4 bytes; no Linux (LP64) <code>long</code> tem 8 bytes. <code>int</code>, <code>float</code> e <code>double</code> costumam ser 4/4/8 em ambos, mas você nunca deve confiar — confie em <code>sizeof</code> e nas constantes de <code>&lt;limits.h&gt;</code>/<code>&lt;float.h&gt;</code>. Para inteiros com tamanho garantido use os tipos de <code>&lt;stdint.h&gt;</code> (<code>int32_t</code>, <code>int64_t</code>).',
        ],
        codigo: `#include <stdio.h>
#include <limits.h>
#include <float.h>

int main(void)
{
    printf("char:     %2zu bytes  (%d ate %d)\\n", sizeof(char), CHAR_MIN, CHAR_MAX);
    printf("int:      %2zu bytes  (%d ate %d)\\n", sizeof(int), INT_MIN, INT_MAX);
    printf("long:     %2zu bytes  (%ld ate %ld)\\n", sizeof(long), LONG_MIN, LONG_MAX);
    printf("long long:%2zu bytes  (%lld ate %lld)\\n", sizeof(long long), LLONG_MIN, LLONG_MAX);
    printf("float:    %2zu bytes  (epsilon ~%g)\\n", sizeof(float), FLT_EPSILON);
    printf("double:   %2zu bytes  (epsilon ~%g)\\n", sizeof(double), DBL_EPSILON);
    printf("ponteiro: %2zu bytes\\n", sizeof(void *));
    return 0;
}`,
        saida: `> sizes     (Windows / MinGW 64 bits)
char:      1 bytes  (-128 ate 127)
int:       4 bytes  (-2147483648 ate 2147483647)
long:      4 bytes  (-2147483648 ate 2147483647)
long long: 8 bytes  (-9223372036854775808 ate 9223372036854775807)
float:     4 bytes  (epsilon ~1.19209e-07)
double:    8 bytes  (epsilon ~2.22045e-16)
ponteiro:  8 bytes`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Escreva um programa que guarda o <code>uint32_t</code> 0x01020304 na memória e imprime os 4 bytes em ordem de endereço. Com base na saída, diga se a máquina é little-endian ou big-endian.',
        dica: 'Faça um cast de <code>unsigned char\*</code> sobre o endereço do inteiro e imprima p[0], p[1], p[2], p[3].',
        solucao: `#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint32_t x = 0x01020304u;
    unsigned char *p = (unsigned char *)&x;
    printf("bytes em memoria: %02x %02x %02x %02x\\n", p[0], p[1], p[2], p[3]);
    if (p[0] == 0x04) {
        printf("little-endian (x86, x86-64)\\n");
    } else if (p[0] == 0x01) {
        printf("big-endian\\n");
    } else {
        printf("ordem inesperada\\n");
    }
    return 0;
}`,
        solucao_obs: 'Saída neste computador (x86-64): "bytes em memoria: 04 03 02 01" e "little-endian". O byte menos significativo vem primeiro.',
      },
      {
        nivel: 1,
        enunciado:
          'Prove em C que <code>~x + 1 == -x</code> para vários valores (0, 1, -1, 42, -42, 100000, -100000) e imprima a comparação para cada um.',
        dica: 'Use um array de ints e um loop; compare <code>(~x + 1) == -x</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    int vals[] = {0, 1, -1, 42, -42, 100000, -100000};
    for (size_t i = 0; i < sizeof vals / sizeof vals[0]; i++) {
        int x = vals[i];
        int neg = ~x + 1;
        printf("x=%7d  ~x+1=%7d  igual a -x? %s\\n", x, neg,
               neg == -x ? "sim" : "nao");
    }
    return 0;
}`,
        solucao_obs: 'Saída real: para todos os valores testados a igualdade é "sim" — é o complemento de 2 funcionando.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva um "decodificador de float": com uma union, leia os bits de um float, extraia sinal, expoente e mantissa, e reconstrua o valor <code>±(1.fração) × 2^(expoente−127)</code> usando <code>ldexp</code>. Use -13.25f como caso de teste.',
        dica: 'A fração é a mantissa lida do bit 22 ao bit 0: se o bit k está ligado, soma <code>ldexp(1.0, -(k+1))</code> à fração (que começa em 1.0).',
        solucao: `#include <stdio.h>
#include <stdint.h>
#include <math.h>

int main(void)
{
    union {
        float f;
        uint32_t u;
    } c;
    c.f = -13.25f;
    uint32_t u = c.u;
    unsigned sinal = u >> 31;
    unsigned expo = (u >> 23) & 0xffu;
    uint32_t mant = u & 0x7fffffu;

    double fracao = 1.0;
    for (unsigned i = 0; i < 23; i++) {
        if (mant & (1u << (22 - i))) {
            fracao += ldexp(1.0, -(int)(i + 1));
        }
    }
    double valor = ldexp(fracao, (int)expo - 127);
    if (sinal) {
        valor = -valor;
    }

    printf("bits: %08x\\n", (unsigned)u);
    printf("sinal=%u expoente=%u mantissa=%06x\\n", sinal, expo, (unsigned)mant);
    printf("valor decodificado = %.6g\\n", valor);
    return 0;
}`,
        solucao_obs: 'Saída real: <code>bits: c1540000 / sinal=1 expoente=130 mantissa=540000 / valor decodificado = -13.25</code>. Expoente 130−127 = 3 e 1.65625×2³ = 13.25.',
      },
    ],
    quiz: [
      {
        pergunta: 'Em complemento de 2, quanto vale ~x + 1?',
        opcoes: ['x - 1', '-x', 'x + 1', 'Sempre zero'],
        correta: 1,
        explicacao: 'Inverter os bits e somar 1 é a definição do negativo em complemento de 2.',
      },
      {
        pergunta: 'Em um float IEEE 754, o campo de 8 bits do expoente usa viés de...',
        opcoes: ['64', '127', '255', '1023'],
        correta: 1,
        explicacao: 'O viés do float (32 bits) é 127; o do double (64 bits) é 1023.',
      },
      {
        pergunta: 'Por que somar 0.1 dez vezes não dá exatamente 1.0?',
        opcoes: [
          'Porque o C é impreciso',
          'Porque 0.1 não tem representação exata em binário',
          'Porque falta a biblioteca math',
          'Porque o tipo devia ser float',
        ],
        correta: 1,
        explicacao: '0.1 vira uma dízima periódica em binário; o valor guardado é o mais próximo representável.',
      },
      {
        pergunta: 'Como você testa se um double é NaN?',
        opcoes: ['valor == NaN', 'valor != valor dá falso', 'isnan(valor)', 'isinf(valor)'],
        correta: 2,
        explicacao: 'NaN nunca é igual a nada, então na prática usa-se a macro <code>isnan</code> de <code>&lt;math.h&gt;</code>.',
      },
      {
        pergunta: 'No Windows (MinGW 64 bits), qual desses NÃO tem 8 bytes?',
        opcoes: ['long long', 'double', 'ponteiro', 'long'],
        correta: 3,
        explicacao: 'No modelo LLp64 do Windows, <code>long</code> tem 4 bytes; <code>long long</code>, <code>double</code> e ponteiros têm 8.',
      },
    ],
    projeto: {
      titulo: 'Dump de arquivo em hex e binário',
      descricao:
        'Crie <code>hexdump.c</code>: dado um arquivo (ex.: um .txt pequeno), imprime cada byte como hex (offset de 4 dígitos + 16 bytes em hex + os bytes legíveis ao lado). No fim, mostre a contagem de bytes que são ASCII imprimível e a dos que pertencem a sequências multibyte (bit 7 ligado). É o início do seu "olho de baixo nível" — útil para a Trilha 4.',
      criterios: [
        'Compila com <code>gcc -Wall -Wextra -std=c11</code> sem avisos.',
        'Para o arquivo numeros.txt (3 linhas), imprime o offset inicial 0000 e todos os bytes em hex.',
        'A última coluna mostra os caracteres ASCII legíveis e ponto (.) para os demais.',
        'Relatório final: total de bytes, ASCII imprimíveis e bytes com bit 7 ligado.',
        'Trata erro de abertura com strerror e EXIT_FAILURE.',
      ],
    },
  },

{
    trilha: '3',
    numero: '03',
    titulo: 'Tipos avançados, storage classes e declarações',
    subtitulo: 'const, volatile, static/extern, typedef e declarações complexas',
    objetivo:
      'Dominar os qualificadores e classes de armazenamento: usar const com precisão (ponteiro para const versus const ponteiro), entender por que volatile existe, diferenciar extern/static/register/auto/_Thread_local, ler declarações complexas da direita para a esquerda e usar structs auto-referenciais e tipos incompletos.',
    prerequisitos: 'T2.03 (ponteiros), T2.06 (structs), T2.09 (arrays)',
    duracao: '~35 min',
    nivel: 'Avançado',
    leitura: {
      beej: 'Capítulos 16 (mais conversões de tipo) e 35 (aspectos avançados de declarações)',
      king: 'Capítulo 18 (Declarations) — a referência canônica de storage classes e complexidade',
      foco:
        'No King, o capítulo 18 é obrigatório: ele cobre extern/static, qualificadores const/volatile, typedef e declarações complexas. Leia com calma as seções de "declarações-na-linguagem-complexa".',
    },
    secoes: [
      {
        titulo: 'const, ponteiro para const e const ponteiro',
        rotulo: 'const_ptr.c',
        paragrafos: [
          'O qualificador <code>const</code> cria <em>valores que não mudam</em> — e o compilador vira seu fiscal. A posição da palavra muda tudo: <code>const int \*p</code> = ponteiro para um int que não muda (o ponteiro pode apontar para outro lugar); <code>int \*const p</code> = ponteiro fixo apontando para um int mutável; <code>const int \*const p</code> = os dois fixos. Leia sempre do lado direito do <code>*</code>: o que está à esquerda do <code>\*</code> é o tipo do dado apontado; o que está entre <code>\*</code> e o nome é a "natureza" do ponteiro.',
        ],
        lista: [
          'Tentou <code>*p = x</code> onde p é <code>const int \*</code>? Erro de compilação.',
          'Tentou <code>p = &outra</code> onde p é <code>int \*const</code>? Erro de compilação.',
          'Função que só lê um vetor deve receber <code>const int v[]</code>: promessa explícita ao chamador.',
          'Cast para remover const (forçar o compilador) é código de cheiro — evite.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int a = 10, b = 20;
    const int *p1 = &a;   /* ponteiro para const: *p1 nao pode mudar */
    int *const p2 = &a;   /* const ponteiro: p2 nao pode apontar para outro */
    const int *const p3 = &a;

    p1 = &b;              /* ok: o ponteiro em si pode mudar */
    *p2 = 30;             /* ok: o int apontado pode mudar */
    /* *p1 = 99;   erro de compilacao: *p1 e const */
    /* p2 = &b;    erro de compilacao: p2 e const */

    printf("a=%d b=%d *p1=%d *p2=%d *p3=%d\\n", a, b, *p1, *p2, *p3);
    return 0;
}`,
        saida: `> const_ptr
a=30 b=20 *p1=20 *p2=30 *p3=30`,
      },
      {
        titulo: 'Lendo declarações complexas: da direita para a esquerda',
        rotulo: 'decl.c',
        paragrafos: [
          'Declarações como <code>int (\*pa)[4]</code> assustam até você aplicar a regra: comece do nome e leia para a direita, dando a volta nos parênteses. <code>pa</code> é … leia a direita: nada → volta: <code>\*pa</code> = pa é um ponteiro → para a direita: <code>[4]</code> = para um array de 4 → para a esquerda: de <code>int</code>. Logo, <code>pa</code> é "ponteiro para array de 4 int". Compare com <code>int \*arr[4]</code>: arr é "array de 4 ponteiros para int". A diferença entre um e outro é feita só pelos parênteses.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int arr[4] = {1, 2, 3, 4};
    int(*pa)[4] = &arr;   /* leia: pa e "ponteiro para array de 4 int" */
    for (int i = 0; i < 4; i++) {
        printf("%d ", (*pa)[i]);
    }
    putchar('\\n');
    return 0;
}`,
        saida: `> decl
1 2 3 4`,
      },
      {
        titulo: 'storage classes: extern, static, register, auto, _Thread_local',
        rotulo: 'stor.c',
        paragrafos: [
          'As <em>storage classes</em> controlam onde a variável mora e o tempo de vida. <code>auto</code> é o padrão (variável local de função, soma e some). <code>register</code> é uma dica esquecida (o compilador decide). <code>static</code> em escopo local dá à variável "memória de longo prazo" entre chamadas; em escopo de arquivo, limita a visibilidade ao arquivo. <code>extern</code> declara algo definido em outro arquivo: o link é feito na fase de linkagem. <code>_Thread_local</code> (C11) cria uma cópia por thread — veremos threads no módulo 06. A melhor pergunta para escolher é sempre: <em>o que deve acontecer com essa variável quando a função termina?</em>',
        ],
        lista: [
          '<code>static int contador = 100;</code> dentro de função → persiste entre chamadas.',
          '<code>static</code> no topo do arquivo → chave "privada" daquele .c.',
          '<code>extern int global;</code> → "existe em outro arquivo, me deixa usar aqui".',
          '<code>register</code> é histórico; com otimizadores modernos é inócuo.',
          '<code>_Thread_local</code> → uma instância por thread (C11).',
        ],
        codigo: `#include <stdio.h>

static int chamadas = 0;   /* static em escopo de arquivo: visivel so neste .c */

static int proximo_id(void)
{
    static int contador = 100;   /* static local: persiste entre chamadas */
    chamadas++;
    return contador++;
}

int main(void)
{
    for (int i = 0; i < 5; i++) {
        printf("id %d\\n", proximo_id());
    }
    printf("chamadas = %d\\n", chamadas);
    return 0;
}`,
        saida: `> stor
id 100
id 101
id 102
id 103
id 104
chamadas = 5`,
      },
      {
        titulo: 'typedef com structs e tipos incompletos',
        rotulo: 'no.c',
        paragrafos: [
          '<code>typedef</code> cria apelidos. Combinado com struct, elimina a repetição da palavra <code>struct</code>. A técnica do <strong>tipo incompleto</strong> é o coração das listas encadeadas: <code>typedef struct No No;</code> anuncia o nome antes do corpo; dentro do próprio struct usamos <code>No \*prox</code> (ponteiro, que não precisa do corpo completo). O corpo completo só precisa existir quando o compilador precisar do <em>tamanho</em> do struct. É assim que structs se referenciam.',
        ],
        codigo: `#include <stdio.h>

typedef struct No {
    int valor;
    struct No *proximo;
} No;

int main(void)
{
    No a = {1, NULL};
    No b = {2, NULL};
    No c = {3, NULL};
    a.proximo = &b;
    b.proximo = &c;
    for (No *p = &a; p != NULL; p = p->proximo) {
        printf("%d ", p->valor);
    }
    putchar('\\n');
    return 0;
}`,
        saida: `> no
1 2 3`,
      },
      {
        titulo: 'volatile: quando o valor muda sem o código saber',
        paragrafos: [
          'Um <code>int</code> normal pode ser mantido pelo compilador num registro por otimização — tudo bem, porque nenhum código externo o altera. <code>volatile</code> diz ao compilador: "não confie na sua cópia; releia da memória toda vez". É usado quando o valor muda por fatores fora do fluxo do programa: registradores de hardware (chips), memória compartilhada entre processos, ou variáveis modificadas por interrupções/sinais (que veremos no módulo 05). Sem volatile, o otimizador pode "cachear" a variável e nunca perceber a mudança.',
        ],
        lista: [
          '<code>volatile int registrador;</code> — aponta para um registrador de um periférico.',
          '<code>volatile sig_atomic_t flag</code> — comunicando com um handler de sinal.',
          'Sem volatile, um loop <code>while (flag) {}</code> compilado em -O2 pode virar loop infinito real.',
          'volatile não é atômico: impede otimização, não corrida entre threads (ver módulo 07).',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Uma função <code>imprime(const int v[], size_t n)</code> que apenas lê o vetor deve aceitar tanto um array normal quanto um literal <code>(int[]){7, 8}</code>. Escreva a função e um main que a chama com <code>nums[]</code> e com o literal. Depois tente <code>const int \*p = nums; p[0] = 9;</code> e observe o erro do compilador.',
        dica: 'O nome do array "decai" para um ponteiro para o primeiro elemento; com <code>const</code> no parâmetro, a escrita vira erro garantido.',
        solucao: `#include <stdio.h>

static void imprime(const int v[], size_t n)
{
    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    putchar('\\n');
}

int main(void)
{
    int nums[] = {5, 10, 15};
    const int *p = nums;   /* posso ler atraves de p, mas nao escrever */
    /* p[0] = 9;   erro: elemento e const */
    printf("leitura via const ponteiro: %d\\n", *p);
    imprime(nums, 3);
    imprime((int[]){7, 8}, 2);
    return 0;
}`,
        solucao_obs: 'Saída real: "leitura via const ponteiro: 5", depois "5 10 15" e "7 8". Remova o comentário na linha proibida e veja o gcc reclamar.',
      },
      {
        nivel: 2,
        enunciado:
          'Crie um typedef <code>typedef int (\*operacao)(int, int);</code> e implemente <code>soma</code>, <code>multiplica</code> e <code>maior</code>. Monte um array <code>operacao ops[] = {soma, multiplica, maior}</code> e chame cada uma com (6, 7) num loop.',
        dica: 'array de operação: <code>ops[i](6, 7)</code>. Um array de vetor de ponteiros de função é "array de ponteiros para função que recebe 2 int e devolve int".',
        solucao: `#include <stdio.h>

typedef int (*operacao)(int, int);

static int soma(int a, int b)
{
    return a + b;
}

static int multiplica(int a, int b)
{
    return a * b;
}

static int maior(int a, int b)
{
    return a > b ? a : b;
}

int main(void)
{
    operacao ops[] = {soma, multiplica, maior};
    const char *nomes[] = {"soma", "multiplica", "maior"};
    int a = 6, b = 7;
    for (size_t i = 0; i < sizeof ops / sizeof ops[0]; i++) {
        printf("%s(%d, %d) = %d\\n", nomes[i], a, b, ops[i](a, b));
    }
    return 0;
}`,
        solucao_obs: 'Saída real: soma=13, multiplica=42, maior=7. Esse padrão é o motor de "tabelas de operações".',
      },
      {
        nivel: 3,
        enunciado:
          'Implemente uma lista encadeada simples usando o padrão de tipo incompleto: <code>typedef struct No No;</code> no topo, corpo depois, funções <code>insere</code> (no início, com malloc) e <code>conta</code>. No main, insira 30, 20, 10 e imprima o total de nós.',
        dica: 'O `typedef struct No No;` permite escrever <code>No \*prox</code> dentro do próprio struct. Lembre de free() em todos os nós no final.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

typedef struct No No;   /* incomplete type: so o "nome" chamado */

struct No {
    int valor;
    No *prox;
};

static No *insere(No *lista, int v)
{
    No *n = malloc(sizeof *n);
    if (n != NULL) {
        n->valor = v;
        n->prox = lista;
    }
    return n;
}

static int conta(No *lista)
{
    int c = 0;
    for (No *p = lista; p != NULL; p = p->prox) {
        c++;
    }
    return c;
}

int main(void)
{
    No *lista = NULL;
    lista = insere(lista, 30);
    lista = insere(lista, 20);
    lista = insere(lista, 10);
    printf("nos = %d\\n", conta(lista));
    while (lista != NULL) {
        No *tmp = lista;
        lista = lista->prox;
        free(tmp);
    }
    return 0;
}`,
        solucao_obs: 'Saída real: "nos = 3". Inserir na frente é O(1) — é por isso que `prox` precisa ser um ponteiro.',
      },
    ],
    quiz: [
      {
        pergunta: 'Em <code>const int \*p</code>, o que é const?',
        opcoes: ['o ponteiro p', 'o int apontado', 'os dois', 'nenhum'],
        correta: 1,
        explicacao: 'O <code>const</code> está à esquerda do <code>\*</code>: modifica o tipo do dado apontado. O ponteiro ainda pode ser reatribuído.',
      },
      {
        pergunta: 'Em <code>int \*const p</code>, o que é const?',
        opcoes: ['o int apontado', 'o ponteiro p', 'os dois', 'nenhum'],
        correta: 1,
        explicacao: 'O <code>const</code> fica entre <code>\*</code> e o nome: fixa o ponteiro, não o valor.',
      },
      {
        pergunta: 'Uma variável local <code>static int contador = 0;</code> dentro de uma função...',
        opcoes: [
          'é destruída a cada chamada',
          'persiste entre chamadas, inicializada uma única vez',
          'torna-se global e visível em outros arquivos',
          'não pode ser modificada',
        ],
        correta: 1,
        explicacao: 'Static local mantém o valor entre chamadas; a inicialização acontece uma vez.',
      },
      {
        pergunta: 'Qual é a utilidade de <code>volatile</code>?',
        opcoes: [
          'Tornar a variável atômica',
          'Impedir que o otimizador guarde cópias em registro',
          'Acelerar o código',
          'Criar uma constante',
        ],
        correta: 1,
        explicacao: 'Volatile força releitura da memória — essencial para registradores de hardware e flags de sinais.',
      },
      {
        pergunta: '<code>typedef struct No No;</code> antes do corpo do struct é um exemplo de...',
        opcoes: ['tipo incompleto', 'ponteiro para função', 'array de structs', 'storage class'],
        correta: 0,
        explicacao: 'Anunciamos o nome do tipo antes do corpo; isso permite auto-referências via ponteiro.',
      },
    ],
  },
  {
    trilha: '3',
    numero: '04',
    titulo: 'Unicode, wide characters e localização',
    subtitulo: 'UTF-8, wchar_t, mbrtowc/wcrtomb e setlocale',
    objetivo:
      'Entender o que é Unicode (code points), ver como UTF-8 codifica caracteres em 1–4 bytes, descobrir que wchar_t tem tamanho diferente por plataforma (2 bytes no Windows, 4 no Linux), e converter entre multibyte e wide com mbrtowc e wcrtomb sob controle do setlocale.',
    prerequisitos: 'T2.05 (strings)',
    duracao: '~35 min',
    nivel: 'Avançado',
    leitura: {
      beej: 'Capítulos 26–27 (wide/multibyte e Unicode)',
      king: 'Seção pertinente de strings (cap. 13) + documentação do sistema para setlocale',
      foco:
        'No Beej foque nas funções multibyte/wide e na ideia do code point. Depois rode os exemplos deste módulo — eles revelam detalhes reais que variam entre Windows e Linux.',
    },
    secoes: [
      {
        titulo: 'O que é Unicode',
        paragrafos: [
          'Unicode é uma tabela universal que atribui um número — o <strong>code point</strong> — a cada caractere de todos os alfabetos do mundo (U+0041 é o "A", U+00E1 é o á, U+1F600 é o 😀). Mas um <em>code point</em> é só um número; ele ainda precisa ser <em>codificado</em> em bytes para ser armazenado e transmitido. Aí entram os encodings.',
        ],
        lista: [
          '<strong>UTF-8</strong> — codifica cada code point em 1 a 4 bytes; compatível com ASCII; a codificação padrão da web e de quase tudo hoje. O "á" vira 2 bytes, o 😀 vira 4.',
          '<strong>UTF-16</strong> — usa 2 ou 4 bytes. É internamente usado no Windows (wchar_t).',
          '<strong>UTF-32</strong> — usa exatamente 4 bytes por code point; simples de indexar, ineficiente de guardar.',
          'Regra do UTF-8: bytes com bit 7 zero são ASCII (1 byte); bytes 0xC0–0xDF iniciam sequência de 2; 0xE0–0xEF de 3; 0xF0–0xF7 de 4. Os bytes de continuação sempre começam com 10.',
        ],
      },
      {
        titulo: 'wchar_t e a surpresa de cada plataforma',
        paragrafos: [
          'O tipo <code>wchar_t</code> é o "caractere largo" do C. O problema é que ele <strong>não tem tamanho fixo</strong>: no Windows vale 2 bytes (e guarda UTF-16); no Linux vale 4 bytes (e guarda UTF-32). Isso muda o programa compilado, e é um dos motivos de existir o tipo fixo <code>char32_t</code> em C11. Strings e funções wide têm o prefixo L e as funções <code>wcs\*</code> (<code>wcslen</code>, <code>wprintf</code>...). Em geral, para texto trocado com o mundo, o C moderno prefere trabalhar com UTF-8 (bytes) e converter na fronteira.',
        ],
        lista: [
          'Literal wide: <code>L"Olá"</code>; tipo <code>wchar_t</code>; cabeçalho <code>&lt;wchar.h&gt;</code>.',
          'Funções <code>wcslen</code>, <code>wcscpy</code>, <code>wcsstr</code>... espelham as de <code>&lt;string.h&gt;</code>.',
          'No Windows, um código point fora do BMP (ex.: 😀)=2 unidades wchar_t (par de surrogates); no Linux é 1.',
          'A constante via <code>setlocale(LC_ALL, ".UTF-8")</code> deixa a libc operar em UTF-8 no Windows; no Linux, "en_US.UTF-8" ou "C.UTF-8".',
        ],
      },
      {
        titulo: 'Contando code points de uma string UTF-8',
        rotulo: 'unica.c',
        paragrafos: [
          'O maior erro é contar <em>bytes</em> numa string UTF-8 achando que está contando caracteres. A função certa para percorrer é <code>mbrtowc</code>: ela converte (e consome) um code point por iteração e devolve quantos bytes ela andou. Aqui contamos quantas vezes o loop passou — independente de o caractere ter 1, 2, 3 ou 4 bytes. Note que em UTF-8 obter contagens iguais (ler 17, contar 13 code points) é o comportamento esperado.',
        ],
        codigo: `#include <stdio.h>
#include <locale.h>
#include <string.h>
#include <wchar.h>

int main(void)
{
    if (setlocale(LC_ALL, ".UTF-8") == NULL) {
        fprintf(stderr, "setlocale falhou\\n");
        return 1;
    }
    const char *s = "Olá, 😀 mundo!";
    mbstate_t estado;
    memset(&estado, 0, sizeof estado);
    size_t total = 0;
    size_t nbytes = strlen(s);
    size_t i = 0;
    while (i < nbytes) {
        wchar_t wc;
        size_t n = mbrtowc(&wc, s + i, nbytes - i, &estado);
        if (n == (size_t)-1 || n == (size_t)-2) {
            fprintf(stderr, "sequencia invalida\\n");
            return 1;
        }
        i += n;
        total++;
    }
    printf("bytes       = %zu\\n", strlen(s));
    printf("code points = %zu\\n", total);
    return 0;
}`,
        saida: `> unica
bytes       = 17
code points = 13`,
      },
      {
        titulo: 'Do wide para UTF-8 com os bits na mão',
        rotulo: 'emoji8.c',
        paragrafos: [
          'Como o <code>wprintf</code> do Windows mistura code pages na saída, o jeito controlado de produzir Unicode é converter você mesmo: de <code>wchar_t</code> para bytes UTF-8 com uma máquina de estados simples. Este programa percorre uma string wide, emenda pares de surrogates (o jeito que 😀 existe como 2 wchar_t no Windows) e codifica cada code point em UTF-8 bit a bit. Repare na divisão: 😀 tem code point U+1F600 e "pesa" 4 bytes em UTF-8.',
        ],
        codigo: `#include <stdio.h>
#include <locale.h>
#include <wchar.h>

static void cp_para_utf8(unsigned long cp, char buf[4], size_t *n)
{
    if (cp < 0x80) {
        buf[0] = (char)cp;
        *n = 1;
    } else if (cp < 0x800) {
        buf[0] = (char)(0xC0 | (cp >> 6));
        buf[1] = (char)(0x80 | (cp & 0x3F));
        *n = 2;
    } else if (cp < 0x10000) {
        buf[0] = (char)(0xE0 | (cp >> 12));
        buf[1] = (char)(0x80 | ((cp >> 6) & 0x3F));
        buf[2] = (char)(0x80 | (cp & 0x3F));
        *n = 3;
    } else {
        buf[0] = (char)(0xF0 | (cp >> 18));
        buf[1] = (char)(0x80 | ((cp >> 12) & 0x3F));
        buf[2] = (char)(0x80 | ((cp >> 6) & 0x3F));
        buf[3] = (char)(0x80 | (cp & 0x3F));
        *n = 4;
    }
}

int main(void)
{
    setlocale(LC_ALL, ".UTF-8");
    const wchar_t *ws = L"Olá \\xD83D\\xDE00";   /* "Olá" + 😀 em UTF-16 */
    printf("wchar_t tem %d bytes nesta plataforma\\n", (int)sizeof(wchar_t));
    printf("bytes da string wide: %zu unidades wchar_t\\n", wcslen(ws));

    char utf8[64] = {0};
    size_t total = 0;
    int i = 0;
    while (ws[i] != L'\\0') {
        unsigned long cp;
        if (ws[i] >= 0xD800 && ws[i] <= 0xDBFF) {
            unsigned long lo = ws[i + 1];
            cp = 0x10000 + ((ws[i] - 0xD800) << 10) + (lo - 0xDC00);
            i += 2;
        } else {
            cp = ws[i];
            i++;
        }
        size_t n = 0;
        cp_para_utf8(cp, utf8 + total, &n);
        printf("U+%04lX -> %zu byte(s)\\n", cp, n);
        total += n;
    }
    printf("texto final em UTF-8: ");
    fwrite(utf8, 1, total, stdout);
    printf("\\n");
    return 0;
}`,
        saida: `> emoji8
wchar_t tem 2 bytes nesta plataforma
bytes da string wide: 6 unidades wchar_t
U+004F -> 1 byte(s)
U+006C -> 1 byte(s)
U+00E1 -> 2 byte(s)
U+0020 -> 1 byte(s)
U+1F600 -> 4 byte(s)
texto final em UTF-8: Olá 😀`,
      },
      {
        titulo: 'Mão dupla: UTF-8 → wide → UTF-8 (mbrtowc/wcrtomb)',
        rotulo: 'arredonda.c',
        paragrafos: [
          'O par <code>mbrtowc</code> (multibyte → wide) e <code>wcrtomb</code> (wide → multibyte) faz a troca de formato sob a "lupa" do locale atual. É importante zerar a <code>mbstate_t</code> antes (estado multibyte). Note que <code>wcrtomb</code> converte de um em um <code>wchar_t</code>; no Windows isso significa que caracteres não-BMP (surrogates) precisam do tratamento manual que você viu na seção anterior.',
        ],
        codigo: `#include <stdio.h>
#include <locale.h>
#include <string.h>
#include <wchar.h>

int main(void)
{
    setlocale(LC_ALL, ".UTF-8");
    const char *entrada = "Olá café";
    mbstate_t est;
    memset(&est, 0, sizeof est);
    wchar_t wide[32] = {0};
    int j = 0;
    printf("UTF-8 -> wide (mbrtowc):\\n");
    size_t nbytes = strlen(entrada);
    size_t i = 0;
    while (i < nbytes) {
        size_t n = mbrtowc(&wide[j], entrada + i, nbytes - i, &est);
        if (n == (size_t)-1 || n == (size_t)-2) break;
        printf("  bytes[%zu..%zu] -> wchar U+%04X\\n", i, i + n, (unsigned)wide[j]);
        i += n;
        j++;
    }
    printf("wide -> UTF-8 (wcrtomb):\\n");
    memset(&est, 0, sizeof est);
    char saida[64] = {0};
    char *p = saida;
    for (int k = 0; wide[k] != L'\\0'; k++) {
        size_t n = wcrtomb(p, wide[k], &est);
        if (n == (size_t)-1) {
            fprintf(stderr, "erro de conversao\\n");
            return 1;
        }
        printf("  U+%04X -> %zu byte(s)\\n", (unsigned)wide[k], n);
        p += n;
    }
    printf("texto final: %s\\n", saida);
    return 0;
}`,
        saida: `> arredonda
UTF-8 -> wide (mbrtowc):
  bytes[0..1] -> wchar U+004F
  bytes[1..2] -> wchar U+006C
  bytes[2..4] -> wchar U+00E1
  bytes[4..5] -> wchar U+0020
  bytes[5..6] -> wchar U+0063
  bytes[6..7] -> wchar U+0061
  bytes[7..8] -> wchar U+0066
  bytes[8..10] -> wchar U+00E9
wide -> UTF-8 (wcrtomb):
  U+004F -> 1 byte(s)
  U+006C -> 1 byte(s)
  U+00E1 -> 2 byte(s)
  U+0020 -> 1 byte(s)
  U+0063 -> 1 byte(s)
  U+0061 -> 1 byte(s)
  U+0066 -> 1 byte(s)
  U+00E9 -> 2 byte(s)
texto final: Olá café`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Escreva um "lente de caracteres": para a string "Olá, 😀 mundo!", percorra com mbrtowc e imprima, para cada caracter, o offset do byte, o nº de bytes consumidos e o code point em U+XXXX. No fim imprima o total de code points e quantos são ASCII.',
        dica: 'O offset é o índice i antes de avançar. No Windows, o emoji pode aparecer como U+FFFD — descubra por quê na explicação.',
        solucao: `#include <stdio.h>
#include <locale.h>
#include <string.h>
#include <wchar.h>

int main(void)
{
    setlocale(LC_ALL, ".UTF-8");
    const char *texto = "Olá, 😀 mundo!";
    mbstate_t est;
    memset(&est, 0, sizeof est);
    size_t nbytes = strlen(texto);
    size_t i = 0;
    size_t primos = 0;
    size_t ascii = 0;
    while (i < nbytes) {
        wchar_t wc;
        size_t n = mbrtowc(&wc, texto + i, nbytes - i, &est);
        if (n == (size_t)-1 || n == (size_t)-2) break;
        printf("offset %3zu: %zu byte(s) -> U+%04X\\n", i, n, (unsigned)wc);
        primos++;
        if (wc <= 0x7F) ascii++;
        i += n;
    }
    printf("code points: %zu (ASCII: %zu)\\n", primos, ascii);
    return 0;
}`,
        solucao_obs: 'Saída real no Windows: o á aparece como U+00E1 e o emoji como U+FFFD (o mbrtowc consumiu os 4 bytes mas converteu para o caractere de substituição, porque wchar_t de 2 bytes não guarda code point fora do BMP). No Linux (wchar_t 4 bytes) você veria U+1F600. Total: 13 code points, 11 ASCII.',
      },
      {
        nivel: 2,
        enunciado:
          'Crie um "filtro de emojis": remova da string "vamos 😀 comer 🐍 hoje" todos os caracteres fora do BMP (os que têm 4 bytes em UTF-8). Imprima antes e depois.',
        dica: 'A regra do mbrtowc devolve n bytes consumidos; caracteres fora do BMP consomem n == 4. Copie só os de n < 4.',
        solucao: `#include <stdio.h>
#include <locale.h>
#include <string.h>
#include <wchar.h>

int main(void)
{
    setlocale(LC_ALL, ".UTF-8");
    const char *texto = "vamos 😀 comer 🐍 hoje";
    printf("antes:  %s\\n", texto);
    printf("depois: ");
    mbstate_t est;
    memset(&est, 0, sizeof est);
    size_t nbytes = strlen(texto);
    size_t i = 0;
    while (i < nbytes) {
        wchar_t wc;
        size_t n = mbrtowc(&wc, texto + i, nbytes - i, &est);
        if (n == (size_t)-1 || n == (size_t)-2) break;
        if (n < 4) {   /* somente caractere do BMP (1 a 3 bytes) */
            fwrite(texto + i, 1, n, stdout);
        }
        i += n;
    }
    printf("\\n");
    return 0;
}`,
        solucao_obs: 'Saída real: "antes:  vamos 😀 comer 🐍 hoje" e "depois: vamos  comer  hoje". A armação por nº de bytes é portável entre Windows e Linux.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva um conversor wide→UTF-8: parta da string wide "café" e, com wcrtomb, gere os bytes UTF-8 num buffer. Imprima o resultado como texto e também como hex, mostrando quantos bytes cada caractere ocupou.',
        dica: 'Depois de cada wcrtomb, avance o ponteiro para o próximo trecho do buffer. O "café" termina com os bytes c3 a9.',
        solucao: `#include <stdio.h>
#include <locale.h>
#include <stdlib.h>
#include <string.h>
#include <wchar.h>

int main(void)
{
    setlocale(LC_ALL, ".UTF-8");
    const wchar_t *ws = L"café";
    char saida[64] = {0};
    mbstate_t est;
    memset(&est, 0, sizeof est);
    char *p = saida;
    for (size_t i = 0; ws[i] != L'\\0'; i++) {
        size_t n = wcrtomb(p, ws[i], &est);
        if (n == (size_t)-1) {
            fprintf(stderr, "erro de conversao\\n");
            return EXIT_FAILURE;
        }
        p += n;
    }
    printf("wide \\\"café\\\" -> UTF-8 (%zu bytes): %s\\n", (size_t)(p - saida), saida);
    printf("hex: ");
    for (char *q = saida; q < p; q++) {
        printf("%02x ", (unsigned char)*q);
    }
    printf("\\n");
    return EXIT_SUCCESS;
}`,
        solucao_obs: 'Saída real: "wide \"café\" -> UTF-8 (5 bytes): café" e "hex: 63 61 66 c3 a9". O é vira 2 bytes (c3 a9) — a "pegadinha" dos acentos em UTF-8.',
      },
    ],
    quiz: [
      {
        pergunta: 'Quantos bytes ocupa o caractere á (U+00E1) em UTF-8?',
        opcoes: ['1', '2', '3', '4'],
        correta: 1,
        explicacao: 'Code points entre 0x80 e 0x7FF viram 2 bytes em UTF-8 (c3 a9 no caso do á).',
      },
      {
        pergunta: 'No Windows, quanto vale sizeof(wchar_t)?',
        opcoes: ['1 byte', '2 bytes', '4 bytes', '8 bytes'],
        correta: 1,
        explicacao: 'No Windows, wchar_t tem 2 bytes e guarda UTF-16; no Linux tem 4 bytes e guarda UTF-32.',
      },
      {
        pergunta: 'Qual função converte uma sequência multibyte (UTF-8) em um wchar_t de cada vez?',
        opcoes: ['wcrtomb', 'mbrtowc', 'strtok', 'wcslen'],
        correta: 1,
        explicacao: 'mbrtowc ("multi-byte to wide char") é a conversão da direção multibyte → wide.',
      },
      {
        pergunta: 'Por que o exercício 1 mostrou U+FFFD para o emoji no Windows?',
        opcoes: [
          'O emoji é inválido',
          'wchar_t de 2 bytes não guarda code points fora do BMP num único valor',
          'Faltou setlocale',
          'A string não era UTF-8',
        ],
        correta: 1,
        explicacao: '! = U+1F600 está fora do BMP; num wchar_t de 2 bytes ele vira par de surrogates, e o mbrtowc/CRT entrega o caractere de substituição U+FFFD.',
      },
      {
        pergunta: 'Para que serve setlocale(LC_ALL, ".UTF-8")?',
        opcoes: [
          'Para abrir arquivos',
          'Para ativar o suporte UTF-8 na libc (base das conversões multibyte/wide)',
          'Para compilar mais rápido',
          'Para mudar o fuso horário',
        ],
        correta: 1,
        explicacao: 'Setlocale define o "dialeto" de conversão de caracteres da libc; sem ele, mbrtowc/wcrtomb operam em "C" (só ASCII).',
      },
    ],
    projeto: {
      titulo: 'wc -m: contador de caracteres reais',
      descricao:
        'Crie <code>conta9.c</code>: dado um arquivo ou entrada padrão, conte e imprima (1) o total de bytes, (2) o total de code points com mbrtowc e (3) a lista dos code points únicos aparecendo no texto com U+XXXX. Use a string do módulo como teste. É o "wc -m" das distribuições, mas com os detalhes abertos na tela.',
      criterios: [
        'Compila com <code>gcc -Wall -Wextra -std=c11</code> sem avisos.',
        'Para "Olá, 😀 mundo!" devolve 17 bytes e 13 code points.',
        'Lista de U+ única: imprime U+004F, U+006C, U+00E1, U+002C, U+0020, U+FFFD (Windows), U+006D, U+0075, U+006E, U+0064, U+006F, U+0021.',
        'Usa setlocale com verificação e mbrtowc com tratamento de erro.',
        'Não usa wprintf para a saída (seria vítima da code page).',
      ],
    },
  },
{
    trilha: '3',
    numero: '05',
    titulo: 'Sinais: as interrupções do SO',
    subtitulo: 'signal(), SIG_DFL/SIG_IGN, sig_atomic_t e a armadilha do reset',
    objetivo:
      'Entender o que são sinais assíncronos, capturar SIGINT com signal(), diferenciar handler, SIG_DFL e SIG_IGN, comunicar-se com o handler via volatile sig_atomic_t, e conhecer a diferença crítica: no Windows/UCRT o handler volta a SIG_DFL após cada disparo (precisa ser reinstalado), enquanto no Linux isso não acontece com signal().',
    prerequisitos: 'T2.01 (funções), T2.04 (ponteiros e volatile ainda não, mas ter feito o T3.03 ajuda)',
    duracao: '~35 min',
    nivel: 'Avançado',
    leitura: {
      beej: 'Capítulo 29 (sinais)',
      king: 'Referência do seu sistema para signal/sigaction',
      foco:
        'O Beej cobre handler global, sig_atomic_t e as armadilhas. Teste você mesmo os exemplos deste módulo: a mensagem sobre reinstalar o handler vale especialmente no Windows.',
    },
    secoes: [
      {
        titulo: 'Sinais: o que são e os principais',
        paragrafos: [
          'Um <strong>sinal</strong> é uma interrupção assíncrona que o sistema operacional entrega a um processo — Ctrl+C no terminal gera SIGINT, um ponteiro inválido gera SIGSEGV, uma divisão por zero gera SIGFPE. O tratamento padrão (SIG_DFL) na maioria deles é encerrar o processo. Você pode substituir esse comportamento com <code>signal(sig, funcao)</code>, ignorá-lo com <code>SIG_IGN</code> ou restaurar o padrão. Um sinal pode chegar a qualquer instante, <em>no meio de quase qualquer instrução</em> — por isso o que se faz dentro do handler precisa ser mínimo.',
        ],
        lista: [
          '<code>SIGINT</code> (2) — Ctrl+C ou raise(SIGINT); padrão: terminar.',
          '<code>SIGSEGV</code> (11) — acesso a memória inválida; padrão: terminar (com dumps).',
          '<code>SIGFPE</code> (8) — erro aritmético como divisão por zero.',
          '<code>SIGTERM</code> (15) — pedido de término (o "kill" educado).',
          '<code>SIGABRT</code> (6) — abort() ou falha de assert().',
        ],
      },
      {
        titulo: 'Capturando e ignorando com signal()',
        rotulo: 'panel.c',
        paragrafos: [
          'Uso básico: <code>signal(SIGINT, trata)</code> instala <code>trata</code>; <code>signal(SIGINT, SIG_IGN)</code> faz o sinal ser descartado. Neste exemplo, <code>raise()</code> simula o que Ctrl+C faz. Como <code>raise</code> é síncrono, conseguimos uma saída determinística para demonstrar; num terminal real seria o seu dedo no Ctrl+C.',
        ],
        codigo: `#include <stdio.h>
#include <signal.h>

static void trata(int sig)
{
    (void)sig;
    printf("sinal %d capturado!\\n", sig);
}

int main(void)
{
    signal(SIGINT, trata);
    printf("disparando SIGINT com raise()...\\n");
    raise(SIGINT);
    signal(SIGINT, SIG_IGN);
    printf("agora ignoro SIGINT; disparando de novo...\\n");
    raise(SIGINT);
    printf("o segundo sinal foi ignorado\\n");
    return 0;
}`,
        saida: `> panel
disparando SIGINT com raise()...
sinal 2 capturado!
agora ignoro SIGINT; disparando de novo...
o segundo sinal foi ignorado`,
      },
      {
        titulo: 'volatile sig_atomic_t: a ponte entre handler e programa',
        rotulo: 'tick.c',
        paragrafos: [
          'O padrão mais comum: o handler apenas "acende um sinal" numa flag e o loop principal a observa. A flag precisa de duas coisas: <code>volatile</code> (o compilador jura que sempre confere a memória, sem cachear em registro — ver módulo 03) e o tipo <code>sig_atomic_t</code> (int garantido atômico para sinais; pode ser escrito no meio de qualquer coisa). A regra de ouro: no handler, só atribuição a sig_atomic_t;, não use printf (não é async-signal-safe) — o printf aqui serve só para você ver o que acontece.',
        ],
        codigo: `#include <stdio.h>
#include <signal.h>

static volatile sig_atomic_t rodando = 1;

static void trata(int sig)
{
    (void)sig;
    rodando = 0;
}

int main(void)
{
    signal(SIGINT, trata);
    printf("simulando trabalho (no terminal, Ctrl+C dispara SIGINT)...\\n");
    long tick = 0;
    while (rodando && tick < 5) {
        tick++;
        printf("tick %ld\\n", tick);
        if (tick == 3) {
            printf("(simulando um Ctrl+C disparado pelo sistema)\\n");
            raise(SIGINT);
        }
    }
    printf("trabalho interrompido: %ld ticks concluidos\\n", tick);
    return 0;
}`,
        saida: `> tick
simulando trabalho (no terminal, Ctrl+C dispara SIGINT)...
tick 1
tick 2
tick 3
(simulando um Ctrl+C disparado pelo sistema)
trabalho interrompido: 3 ticks concluidos`,
      },
      {
        titulo: 'Duas passadas no Ctrl+C e a armadilha do reset',
        rotulo: 'duas.c',
        paragrafos: [
          'O padrão "aperte Ctrl+C de novo para sair" é elegante para programas que fazem trabalho real. Mas há uma <strong>armadilha do Windows/UCRT</strong>: depois de entregar o sinal, o handler volta sozinho para SIG_DFL — se você não reinstalar <code>signal(SIGINT, trata)</code> dentro do próprio handler, o segundo Ctrl+C encerra o processo no meio da "fila de despedida". No Linux (semantics POSIX de signal()), a reinstalação é opcional. Escrever o handler reinstalando-se a si mesmo funciona nos dois. Repare também no <code>atexit</code>: se o processo terminar de modo controlado, a despedida roda uma vez.',
        ],
        codigo: `#include <stdio.h>
#include <signal.h>
#include <stdlib.h>

static volatile sig_atomic_t vez = 0;

static void trata(int sig)
{
    (void)sig;
    signal(SIGINT, trata);   /* Windows/UCRT cai para SIG_DFL apos o disparo */
    vez++;
}

static void despedida(void)
{
    printf("recursos limpos; saida limpa (%d Ctrl+C)\\n", (int)vez);
}

int main(void)
{
    atexit(despedida);
    signal(SIGINT, trata);
    printf("aperte Ctrl+C 2x para encerrar (simulacao com raise abaixo)\\n");
    long long n = 0;
    int avisou = 0;
    while (vez < 2) {
        n++;
        if (vez == 1 && !avisou) {
            printf("primeiro Ctrl+C recebido no tick %lld ---- aperte de novo\\n", n);
            avisou = 1;
        }
        if (n == 5000000LL) {
            printf("(simulando o 1o Ctrl+C)\\n");
            raise(SIGINT);
        }
        if (n == 15000000LL) {
            printf("(simulando o 2o Ctrl+C)\\n");
            raise(SIGINT);
        }
    }
    printf("encerrando voluntariamente apos %lld ticks\\n", n);
    return 0;
}`,
        saida: `> duas
aperte Ctrl+C 2x para encerrar (simulacao com raise abaixo)
(simulando o 1o Ctrl+C)
primeiro Ctrl+C recebido no tick 5000001 ---- aperte de novo
(simulando o 2o Ctrl+C)
encerrando voluntariamente apos 15000000 ticks
recursos limpos; saida limpa (2 Ctrl+C)`,
      },
      {
        titulo: 'O que funciona e o que NÃO funciona dentro de um handler',
        paragrafos: [
          'Um handler roda como se fosse um "eclipse" no meio da execução: as funções que você chama ali precisam ser <strong>async-signal-safe</strong>. Chamar printf dentro de um handler é tecnicamente indefinido (é a pressa de sempre) — nas plataformas comuns acaba funcionando, mas não é garantido: se SEGFAULT acontecer no meio de outra printf, o buffer pode simplesmente não sair. O que é seguro: escrever em <code>sig_atomic_t</code>, chamar <code>signal()</code> para reinstalar, <code>_Exit()</code>/<code>_exit()</code> (não <code>exit()</code>), <code>raise()</code>. O que não é garantido: quase tudo com FILE*, malloc/free, funções que bloqueiam.',
        ],
        lista: [
          'Seguro: atribuição a <code>volatile sig_atomic_t</code>; <code>signal()</code>, <code>_Exit()</code>, <code>raise()</code>.',
          'Não garantido: <code>printf</code>, <code>fopen/fwrite/fclose</code>, <code>malloc/free</code>, <code>exit()</code>.',
          'O truque real: o handler só "acende a flag"; o programa principal faz a parte cara (fechar arquivos, dar free, bailar com <code>_Exit</code>).',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Um programa que captura SIGINT na primeira vez ("apanhado 1") e depois restaura SIG_DFL com signal(SIGINT, SIG_DFL). Ao disparar o próximo SIGINT, o processo deve terminar sem imprimir a última linha.',
        dica: 'O comportamento padrão de SIGINT é terminar o processo: é isso que "restaurar o padrão" significa.',
        solucao: `#include <stdio.h>
#include <signal.h>
#include <stdlib.h>

static void trata(int s)
{
    (void)s;
    puts("apanhado 1");
}

int main(void)
{
    signal(SIGINT, trata);
    raise(SIGINT);
    signal(SIGINT, SIG_DFL);
    puts("handler removido; o proximo SIGINT segue o comportamento padrao (morrer)");
    raise(SIGINT);
    puts("essa linha nunca e alcancada");
    return 0;
}`,
        solucao_obs: 'Saída real: "apanhado 1" e a linha do morrer; depois o processo termina (no Windows com código de saída 3 / sinal). A última linha nunca aparece.',
      },
      {
        nivel: 2,
        enunciado:
          'Monte um "cofre de sinais": mude para SIG_IGN, dispare 2 sinais com raise e mostre que nenhum é entregue; depois instale um handler que conta via sig_atomic_t e dispara mais um, mostrando o contador.',
        dica: 'SIG_IGN não incrementa nada porque o sinal nem chega; o handler incrementa a cada chegada.',
        solucao: `#include <stdio.h>
#include <signal.h>

static volatile sig_atomic_t recebidos = 0;

static void conta(int s)
{
    (void)s;
    recebidos++;
}

int main(void)
{
    signal(SIGINT, SIG_IGN);
    printf("sinais ignorados (SIG_IGN); sou imune agora\\n");
    raise(SIGINT);
    raise(SIGINT);
    printf("mandei 2 sinais, mas o contador continua em %d\\n", (int)recebidos);
    signal(SIGINT, conta);
    raise(SIGINT);
    printf("com handler ativo, recebidos = %d\\n", (int)recebidos);
    return 0;
}`,
        solucao_obs: 'Saída real: "sou imune agora", "mandei 2 sinais, mas o contador continua em 0", "com handler ativo, recebidos = 1".',
      },
      {
        nivel: 3,
        enunciado:
          'Um programa que, ao receber SIGINT, salva um "estado" num arquivo (escreve o caractere s em estado.bin) e termina com _Exit(0). Ao rodar, deve imprimir uma mensagem e finalizar deixando o arquivo criado.',
        dica: 'Use _Exit(0) dentro do handler para terminar imediatamente sem rodar o resto do main. Cheque depois se estado.bin existe.',
        solucao: `#include <stdio.h>
#include <signal.h>
#include <stdlib.h>

static void salvar(int sig)
{
    (void)sig;
    FILE *fp = fopen("estado.bin", "w");
    if (fp != NULL) {
        fputc('s', fp);
        fclose(fp);
    }
    _Exit(0);
}

int main(void)
{
    signal(SIGINT, salvar);
    printf("salvando estado ao receber SIGINT...\\n");
    raise(SIGINT);
    return 0;
}`,
        solucao_obs: 'Saída real: a mensagem "salvando estado..." é impressa, o processo termina e o arquivo estado.bin é criado no diretório atual.',
      },
    ],
    quiz: [
      {
        pergunta: 'O que significa o tratamento padrão SIG_DFL de SIGINT?',
        opcoes: [
          'O sinal é ignorado',
          'O processo termina',
          'O programa pausa',
          'O sinal é reenviado',
        ],
        correta: 1,
        explicacao: 'O padrão de SIGINT (como de quase todos os sinais de término) é encerrar o processo.',
      },
      {
        pergunta: 'Por que a flag lida com o handler precisa ser volatile sig_atomic_t?',
        opcoes: [
          'Para ficar mais rápida',
          'Volatile impede cache em registro e sig_atomic_t é atômico para sinais',
          'Para poder usar em thread',
          'Para virar ponteiro',
        ],
        correta: 1,
        explicacao: 'volatile evita o "cache" do compilador; sig_atomic_t garante escrita atômica no contexto de sinal.',
      },
      {
        pergunta: 'O que acontece no Windows/UCRT após um handler de sinal ser executado?',
        opcoes: [
          'Nada muda',
          'O handler volta para SIG_DFL e precisa ser reinstalado',
          'O programa pausa',
          'O sinal é reentregue',
        ],
        correta: 1,
        explicacao: 'No Windows/UCRT a reinstalação manual é necessária — sem ela, o segundo sinal usa o comportamento padrão (morte).',
      },
      {
        pergunta: 'Qual destas operações NÃO é considerada segura dentro de um handler?',
        opcoes: ['Atribuir a sig_atomic_t', 'Chamar signal()', 'Chamar printf()', 'Chamar _Exit()'],
        correta: 2,
        explicacao: 'printf não é async-signal-safe; o handler deve se limitar ao mínimo (flag, reinstalação, término imediato).',
      },
      {
        pergunta: 'No padrão "Ctrl+C duas vezes para sair", qual é o papel do atexit?',
        opcoes: [
          'Capturar o sinal',
          'Registrar uma rotina de limpeza que roda só na saída controlada',
          'Ignorar sinais',
          'Criar threads',
        ],
        correta: 1,
        explicacao: 'atexit registra a despedida; ela roda no retorno controlado do main — e por isso só uma vez.',
      },
    ],
  },
  {
    trilha: '3',
    numero: '06',
    titulo: 'Threads com pthreads',
    subtitulo: 'Criando, juntando e os perigos de dados compartilhados',
    objetivo:
      'Criar threads com pthread_create/pthread_join, passar dados via struct e intptr_t, entender a corrida de dados (data race) quando várias threads escrevem sem sincronização, e montar um produtor-consumidor com mutex + condition variables.',
    prerequisitos: 'T3.02 (limites numéricos), T2.09 (arrays)',
    duracao: '~35 min',
    nivel: 'Avançado',
    leitura: {
      beej: 'Capítulo 39 (pthreads)',
      king: 'Documentação do pthreads no seu sistema',
      foco:
        'Compile os exemplos deste módulo com -pthread. O MinGW-W64 posix deste ambiente suporta; em Linux use gcc -pthread também.',
    },
    secoes: [
      {
        titulo: 'Primeira thread: somando em paralelo',
        rotulo: 'par.c',
        paragrafos: [
          '<code>pthread_create</code> dispara uma função (<code>void \*fn(void \*)</code>) numa nova linha de execução; <code>pthread_join</code> espera ela terminar. Onde está o trabalho divisível? Aqui o vetor de 1.000.000 de uns é fatiado em 4 faixas <code>[inicio, fim)</code> e cada thread soma a sua, depositando o resultado num slot próprio (<code>somas_parciais[id]</code>). Como cada thread escreve num endereço diferente, não há corrida — o padrão "cada thread escreve no seu slot" é a receita da soma paralela correta.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define TAM 1000000
#define NTHREADS 4

static long vetor[TAM];
static long somas_parciais[NTHREADS];

typedef struct {
    int id;
    long inicio;
    long fim;
} RANGE;

static void *soma(void *arg)
{
    RANGE *r = arg;
    long total = 0;
    for (long i = r->inicio; i < r->fim; i++) {
        total += vetor[i];
    }
    somas_parciais[r->id] = total;
    return NULL;
}

int main(void)
{
    for (long i = 0; i < TAM; i++) {
        vetor[i] = 1;
    }
    pthread_t tids[NTHREADS];
    RANGE rs[NTHREADS];
    for (int i = 0; i < NTHREADS; i++) {
        rs[i].id = i;
        rs[i].inicio = (long)i * TAM / NTHREADS;
        rs[i].fim = (long)(i + 1) * TAM / NTHREADS;
        if (pthread_create(&tids[i], NULL, soma, &rs[i]) != 0) {
            perror("pthread_create");
            return EXIT_FAILURE;
        }
    }
    long total = 0;
    for (int i = 0; i < NTHREADS; i++) {
        pthread_join(tids[i], NULL);
        total += somas_parciais[i];
    }
    printf("total = %ld (esperado %d)\\n", total, TAM);
    return 0;
}`,
        saida: `> par
total = 1000000 (esperado 1000000)`,
      },
      {
        titulo: 'Corrida de dados: quando a soma paralela "se perde"',
        rotulo: 'corrida.c',
        paragrafos: [
          'E se em vez de um slot por thread todas incrementassem o <em>mesmo</em> contador global? Cada incremento é "ler, somar 1, escrever" — três passos que podem se intercalar entre threads. Duas leituras simultâneas do mesmo valor, duas somas e duas escritas fazem um incremento "sumir": o total final fica menor que o esperado. Isso é a <strong>data race</strong>: comportamento indefinido do padrão C. Rode algumas vezes e veja números diferentes. O valor abaixo é um exemplo real de uma execução típica.',
        ],
        codigo: `#include <stdio.h>
#include <pthread.h>

#define NTHREADS 4
#define ALVO 1000000

static long contador = 0;

static void *trabalha(void *arg)
{
    (void)arg;
    for (long i = 0; i < ALVO / NTHREADS; i++) {
        contador++;   /* ler, somar, escrever: NAO atomico sem mutex */
    }
    return NULL;
}

int main(void)
{
    pthread_t t[NTHREADS];
    for (int i = 0; i < NTHREADS; i++) {
        pthread_create(&t[i], NULL, trabalha, NULL);
    }
    for (int i = 0; i < NTHREADS; i++) {
        pthread_join(t[i], NULL);
    }
    printf("contador = %ld (esperado %d)\\n", contador, ALVO);
    return 0;
}`,
        saida: `> corrida
contador = 1278951 (esperado 1000000)`,
      },
      {
        titulo: 'Mutex: a fechadura que conserta a corrida',
        rotulo: 'mutex.c',
        paragrafos: [
          'A resposta clássica é o <strong>mutex</strong> (de "mutual exclusion"): antes de mexer no crítico, a thread faz <code>pthread_mutex_lock</code> — quem chegar depois espera <code>wait</code> na fechadura — e ao terminar <code>pthread_mutex_unlock</code>. O incremento volta a ser "ler, somar, escrever" mas com ninguém intercalando no meio. Inicialize com <code>PTHREAD_MUTEX_INITIALIZER</code>; depois <code>pthread_mutex_destroy</code>. O custo: a contenda serializa o trecho (mais devagar que o atômico do módulo 07).',
        ],
        codigo: `#include <stdio.h>
#include <pthread.h>

#define NTHREADS 4
#define ALVO 1000000

static long contador = 0;
static pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

static void *trabalha(void *arg)
{
    (void)arg;
    for (long i = 0; i < ALVO / NTHREADS; i++) {
        pthread_mutex_lock(&m);
        contador++;
        pthread_mutex_unlock(&m);
    }
    return NULL;
}

int main(void)
{
    pthread_t t[NTHREADS];
    for (int i = 0; i < NTHREADS; i++) {
        pthread_create(&t[i], NULL, trabalha, NULL);
    }
    for (int i = 0; i < NTHREADS; i++) {
        pthread_join(t[i], NULL);
    }
    printf("contador = %ld (esperado %d)\\n", contador, ALVO);
    return 0;
}`,
        saida: `> mutex
contador = 1000000 (esperado 1000000)`,
      },
      {
        titulo: 'Produtor-consumidor com condition variables',
        rotulo: 'pc.c',
        paragrafos: [
          'O cenário clássico: um <strong>produtor</strong> enche um buffer circular de 5 slots; um <strong>consumidor</strong> esvazia. O mutex protege as variáveis do buffer, e as <em>condition variables</em> <code>cheio</code>/<code>vazio</code> permitem esperar "até que alguma condição mude" sem queimar CPU: produtor espera em <code>cheio</code> enquanto count==CAP; consumidor espera em <code>vazio</code> enquanto count==0. Note o padrão obrigatório: <code>while</code> (não <code>if</code>) em torno do <code>pthread_cond_wait</code> — sempre confira a condição de novo após acordar.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define CAP 5
#define ITEMS 20

static int buffer[CAP];
static int inicio = 0;
static int fim = 0;
static int count = 0;
static pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t cheio = PTHREAD_COND_INITIALIZER;
static pthread_cond_t vazio = PTHREAD_COND_INITIALIZER;

static void *produtor(void *arg)
{
    (void)arg;
    for (int i = 1; i <= ITEMS; i++) {
        pthread_mutex_lock(&mutex);
        while (count == CAP) {
            pthread_cond_wait(&cheio, &mutex);
        }
        buffer[fim] = i;
        fim = (fim + 1) % CAP;
        count++;
        pthread_cond_signal(&vazio);
        pthread_mutex_unlock(&mutex);
        printf("produzi  %d\\n", i);
    }
    return NULL;
}

static void *consumidor(void *arg)
{
    (void)arg;
    for (int i = 1; i <= ITEMS; i++) {
        pthread_mutex_lock(&mutex);
        while (count == 0) {
            pthread_cond_wait(&vazio, &mutex);
        }
        int v = buffer[inicio];
        inicio = (inicio + 1) % CAP;
        count--;
        pthread_cond_signal(&cheio);
        pthread_mutex_unlock(&mutex);
        printf("consumi  %d\\n", v);
    }
    return NULL;
}

int main(void)
{
    pthread_t p, c;
    if (pthread_create(&p, NULL, produtor, NULL) != 0 ||
        pthread_create(&c, NULL, consumidor, NULL) != 0) {
        perror("pthread_create");
        return EXIT_FAILURE;
    }
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    pthread_mutex_destroy(&mutex);
    pthread_cond_destroy(&cheio);
    pthread_cond_destroy(&vazio);
    printf("fim: %d itens processados\\n", ITEMS);
    return 0;
}`,
        saida: `> pc
produzi  1
produzi  2
produzi  3
produzi  4
produzi  5
produzi  6
consumi  1
consumi  2
consumi  3
consumi  4
consumi  5
consumi  6
produzi  7
produzi  8
produzi  9
produzi  10
produzi  11
consumi  7
consumi  8
consumi  9
produzi  12
produzi  13
produzi  14
produzi  15
consumi  10
consumi  11
consumi  12
consumi  13
consumi  14
consumi  15
produzi  16
produzi  17
produzi  18
produzi  19
produzi  20
consumi  16
consumi  17
consumi  18
consumi  19
consumi  20
fim: 20 itens processados`,
      },
      {
        titulo: 'Regras de ouro do código com threads',
        paragrafos: [
          'Threads são "funções que rodam ao mesmo tempo" — a disciplina daí é: (1) cada thread recebe só o que precisa via o argumento <code>void \*</code> (o sweet spot é mandar uma cópia de ponteiro para dados que ficam vivos enquanto a thread roda — <code>&rs[i]</code> vive no main até todos os join); (2) dado compartilhado <strong>sempre</strong> atrás de mutex; (3) o provedor do mutex é quem passa a régua: toda leitura E escrita do compartilhado passa pelo lock; (4) condition variables sempre com a condição conferida em <code>while</code>. Passar ints "no argumento": o caminho idiomático é <code>intptr_t</code> — ver exercício 1.',
        ],
        lista: [
          'Crie com pthread_create, junte com pthread_join (ou detache com pthread_detach).',
          'Argumento e retorno da thread são <code>void \*</code>: use <code>intptr_t</code> para ids/flag inteiros.',
          'Quem marca com lock/unlock: mutex agarrado, solto SEMPRE no mesmo caminho (cuidado com return no meio).',
          'Condition variables: sem o "while", os wakeups espúrios quebram a lógica.',
          'Compile com -pthread; adicione -fsanitize=thread para caçar corridas no Linux.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Crie 6 threads, cada uma imprimindo "oi da thread N" usando o argumento inteiro passado via (void*)(intptr_t)N (o jeito correto de carregar um int no void*). Junte as 6 e imprima que todas terminaram.',
        dica: 'intptr_t (de <stdint.h>) garante que coube o int; o compilador não lança warning de conversão.',
        solucao: `#include <stdio.h>
#include <stdint.h>
#include <pthread.h>

#define NTHREADS 6

static void *diz_oi(void *arg)
{
    intptr_t id = (intptr_t)arg;
    printf("oi da thread %d\\n", (int)id);
    return NULL;
}

int main(void)
{
    pthread_t t[NTHREADS];
    for (int i = 0; i < NTHREADS; i++) {
        if (pthread_create(&t[i], NULL, diz_oi, (void *)(intptr_t)i) != 0) {
            perror("pthread_create");
            return 1;
        }
    }
    for (int i = 0; i < NTHREADS; i++) {
        pthread_join(t[i], NULL);
    }
    printf("todas as %d threads terminaram\\n", NTHREADS);
    return 0;
}`,
        solucao_obs: 'Saída real (a ordem das linhas varia entre execuções — é o charme das threads): as 6 mensagens em qualquer ordem, depois a linha final.',
      },
      {
        nivel: 2,
        enunciado:
          'Calcule 20! numa thread: passe uma struct {int n; long long resultado;} e o fatorial devolve o resultado preenchendo o campo da struct (retorno pelo próprio struct). O main espera e imprime.',
        dica: 'long long porque 20! = 2432902008176640000 estoura int (32 bits). Use pthread_join antes de ler o campo.',
        solucao: `#include <stdio.h>
#include <pthread.h>

typedef struct {
    int n;
    long long resultado;
} TAREFA;

static void *fatorial(void *arg)
{
    TAREFA *t = arg;
    long long r = 1;
    for (int i = 2; i <= t->n; i++) {
        r *= i;
    }
    t->resultado = r;
    return NULL;
}

int main(void)
{
    TAREFA t = {20, 0};
    pthread_t th;
    pthread_create(&th, NULL, fatorial, &t);
    pthread_join(th, NULL);
    printf("20! = %lld\\n", t.resultado);
    return 0;
}`,
        solucao_obs: 'Saída real: "20! = 2432902008176640000". Padrão "resultado por struct" evita malloc/join com ponteiro retornado.',
      },
      {
        nivel: 3,
        enunciado:
          'Variação do produtor-consumidor com DOIS consumidores: o buffer circular conversa com 1 produtor que gera 30 itens e 2 consumidores que dividem o trabalho. Cada consumidor conta os próprios itens e no fim imprime seu total; main imprime o global (deve ser 30). Use pthread_cond_broadcast no vazio para acordar os dois.',
        dica: 'O consumidor para quando consumidos_global >= TOTAL. Use a condição em while e dê lock/unlock em todo acesso ao compartilhado.',
        solucao: `#include <stdio.h>
#include <pthread.h>

#define CAP 5
#define TOTAL 30

static int buffer[CAP];
static int inicio = 0;
static int fim = 0;
static int count = 0;
static int consumidos_global = 0;
static pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t cheio = PTHREAD_COND_INITIALIZER;
static pthread_cond_t vazio = PTHREAD_COND_INITIALIZER;

static void *produtor(void *arg)
{
    (void)arg;
    for (int i = 1; i <= TOTAL; i++) {
        pthread_mutex_lock(&mutex);
        while (count == CAP) {
            pthread_cond_wait(&cheio, &mutex);
        }
        buffer[fim] = i;
        fim = (fim + 1) % CAP;
        count++;
        pthread_cond_broadcast(&vazio);
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

static void *consumidor(void *arg)
{
    int id = *(int *)arg;
    int meus = 0;
    for (;;) {
        pthread_mutex_lock(&mutex);
        while (count == 0 && consumidos_global < TOTAL) {
            pthread_cond_wait(&vazio, &mutex);
        }
        if (consumidos_global >= TOTAL) {
            pthread_mutex_unlock(&mutex);
            break;
        }
        int v = buffer[inicio];
        inicio = (inicio + 1) % CAP;
        count--;
        consumidos_global++;
        meus++;
        pthread_cond_signal(&cheio);
        pthread_mutex_unlock(&mutex);
        printf("consumidor %d pegou %d\\n", id, v);
    }
    printf("consumidor %d total: %d\\n", id, meus);
    return NULL;
}

int main(void)
{
    pthread_t p, c1, c2;
    int id1 = 1, id2 = 2;
    pthread_create(&p, NULL, produtor, NULL);
    pthread_create(&c1, NULL, consumidor, &id1);
    pthread_create(&c2, NULL, consumidor, &id2);
    pthread_join(p, NULL);
    pthread_join(c1, NULL);
    pthread_join(c2, NULL);
    printf("consumidos=%d (esperado %d)\\n", consumidos_global, TOTAL);
    return 0;
}`,
        solucao_obs: 'Saída real: intercala as mensagens entre consumidor 1 e 2 (ordem varia), cada consumidor imprime seu total (exemplo: 17 e 13) e o final é "consumidos=30 (esperado 30)".',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual função espera uma thread terminar?',
        opcoes: ['pthread_create', 'pthread_join', 'pthread_detach', 'pthread_cond_wait'],
        correta: 1,
        explicacao: 'pthread_join bloqueia o chamador até a thread alvo terminar.',
      },
      {
        pergunta: 'O que é uma data race?',
        opcoes: [
          'Duas threads lendo o mesmo valor',
          'Duas threads acessando dados compartilhados sem sincronização (pelo menos uma escrevendo)',
          'Uma thread mais rápida que outra',
          'Um loop infinito',
        ],
        correta: 1,
        explicacao: 'A data race exige concorrência de acesso sem sincronização com escrita — comportamento indefinido.',
      },
      {
        pergunta: 'Por que o incremento contador++ falha em threads?',
        opcoes: [
          'É lento',
          'É "ler, somar, escrever" não-atômico e pode ser interrompido no meio',
          'O compilador não otimiza',
          'contador precisa ser unsigned',
        ],
        correta: 1,
        explicacao: 'A non-atomicidade permite que duas threads percam uma atualização simultânea.',
      },
      {
        pergunta: 'Para que serve o mutex nesse contexto?',
        opcoes: [
          'Acelerar o código',
          'Garantir exclusão mútua: só uma thread entra no trecho crítico por vez',
          'Criar threads',
          'Terminar o processo',
        ],
        correta: 1,
        explicacao: 'Lock/unlock em torno do dado compartilhado restaura a correção da operação.',
      },
      {
        pergunta: 'Por que usar while (não if) junto de pthread_cond_wait?',
        opcoes: [
          'Para ser mais rápido',
          'Porque o wakeup pode ser espúrio e a condição pode ter mudado',
          'Porque if não existe em C',
          'Para evitar incremento',
        ],
        correta: 1,
        explicacao: 'Mesmo acordado, a condição deve ser re-checada — é a regra padrão das condition variables.',
      },
    ],
  },
{
    trilha: '3',
    numero: '07',
    titulo: 'Atômicos e sincronização sem locks',
    subtitulo: 'atomic_int, fetch_add, CAS e memory_order',
    objetivo:
      'Usar os tipos atômicos de C11 (stdatomic.h) para incrementar/ler/escrever sem mutex, entender a operação compare-and-swap (CAS) que resolve o "quem chega primeiro", conhecer atomic_flag, e captar a ideia de memory_order — a régua com que o hardware ordena as operações atômicas.',
    prerequisitos: 'T3.06 (threads e data race)',
    duracao: '~25 min',
    nivel: 'Avançado',
    leitura: {
      beej: 'Capítulo 40 (atômicos)',
      king: 'C11 draft (seções 7.17 de stdatomic.h) quando precisar detalhar',
      foco:
        'Rode os exemplos lado a lado com o módulo 06: o contador atômico dá o mesmo resultado do mutex, mas sem fechadura. Em Linux, compile e rode com -fsanitize=thread para ver a diferença na prática.',
    },
    secoes: [
      {
        titulo: 'O contador atômico: sem mutex, sem corrida',
        rotulo: 'aconta.c',
        paragrafos: [
          'Um <code>atomic_int</code> é um int que o hardware promete manipular "sem rasgar": cada operação atômica é indivisível. O incremente <code>atomic_fetch_add(&contador, 1)</code> é "ler, somar 1, escrever" feito numa única instrução (RMW — read-modify-write) do processador. Quatro threads fazem isso em paralelo e o total fecha em 4.000.000 — igual ao mutex do módulo 06, mas sem travar ninguém. Atômicos são particularmente bons no coletivo "cada thread lê valores simples sem fila de espera".',
        ],
        codigo: `#include <stdio.h>
#include <stdatomic.h>
#include <pthread.h>

#define NTHREADS 4
#define VEZES 1000000

static atomic_int contador = 0;

static void *conta(void *arg)
{
    (void)arg;
    for (int i = 0; i < VEZES; i++) {
        atomic_fetch_add(&contador, 1);
    }
    return NULL;
}

int main(void)
{
    pthread_t t[NTHREADS];
    for (int i = 0; i < NTHREADS; i++) {
        pthread_create(&t[i], NULL, conta, NULL);
    }
    for (int i = 0; i < NTHREADS; i++) {
        pthread_join(t[i], NULL);
    }
    printf("esperado %d, obtido %d\\n", NTHREADS * VEZES, atomic_load(&contador));
    return 0;
}`,
        saida: `> aconta
esperado 4000000, obtido 4000000`,
      },
      {
        titulo: 'Compare-and-swap: a eleição do vencedor',
        rotulo: 'cas.c',
        paragrafos: [
          'O CAS resolve o problema "só o primeiro passa". <code>atomic_compare_exchange_strong(&vencedor, &esperado, id)</code> fica: <em>se o valor atual é igual a *esperado, troca para id e volta true; senão, devolve false e grava o atual em *esperado</em>. Quatro threads disputam: exatamente uma encontra <code>-1</code> e escreve o id (o "vencedor"); as outras três veem a mudança e se declaram perdedoras. Isso é o coração de lock-free structures, contadores com únicos, e de implementações de "uma vez só".',
        ],
        codigo: `#include <stdio.h>
#include <stdatomic.h>
#include <pthread.h>

#define NTHREADS 4

static atomic_int vencedor = -1;

static void *corre(void *arg)
{
    int id = *(int *)arg;
    int esperado = -1;
    if (atomic_compare_exchange_strong(&vencedor, &esperado, id)) {
        printf("thread %d venceu!\\n", id);
    } else {
        printf("thread %d perdeu para %d\\n", id, atomic_load(&vencedor));
    }
    return NULL;
}

int main(void)
{
    pthread_t t[NTHREADS];
    int ids[NTHREADS];
    for (int i = 0; i < NTHREADS; i++) {
        ids[i] = i + 1;
        pthread_create(&t[i], NULL, corre, &ids[i]);
    }
    for (int i = 0; i < NTHREADS; i++) {
        pthread_join(t[i], NULL);
    }
    printf("vencedor final: %d\\n", atomic_load(&vencedor));
    return 0;
}`,
        saida: `> cas
thread 1 venceu!
thread 2 perdeu para 1
thread 3 perdeu para 1
thread 4 perdeu para 1
vencedor final: 1`,
      },
      {
        titulo: 'memory_order: por que o atômico é mais fino que parece',
        paragrafos: [
          'Um atômico não "blinda" nada além daquele acesso — o mundo ao redor pode ser lido fora de ordem pelo processador (reorder). O <strong>memory_order</strong> diz com que força o compilador barra essas reordenações. <code>memory_order_relaxed</code>: só a própria operação, ordem de outras leituras é livre (bom para contadores). <code>memory_order_acquire</code>/<code>release</code>: emparelha assimetria — produzir dados e publicar uma flag com release garante que quem ler a flag com acquire vê todos os dados anteriores. <code>memory_order_seq_cst</code> (padrão das funções que você já usou): a ordem total mais forte — tudo vira "uma fila única". A lição prática: para avisos simples (flag de status), seq_cst/acquire-release resolve; para contadores de hot path, relaxed é honesto e rápido.',
        ],
        lista: [
          'relaxed — sem barreiras; ok para incrementos que ninguém usa para sincronizar.',
          'acquire (lado de quem lê a flag) — garante que leituras seguintes não passem antes.',
          'release (lado de quem publica) — garante que escritas anteriores não passem depois.',
          'seq_cst — ordem total única de todas as operações; o padrão de atomic_fetch_add? Não! o padrão das primitivas é seq_cst.',
          'Regra de ouro: release/acquire é o casal; relaxed é para "só somar"; seq_cst quando tiver dúvida.',
        ],
      },
      {
        titulo: 'Atômico vs mutex na prática',
        paragrafos: [
          'Mutex e atômico resolvem problemas diferentes. O mutex dá <em>exclusão de trecho inteiro</em>: várias operações acontecem "sem cortes" (protege a receita do buffer, como no produtor-consumidor). O atômico vale onde o momento crítico é <em>uma única operação</em> (incrementar, trocar um valor). Traduzindo: se o seu "critico" é contador++ ou escrever uma flag — atômico. Se é 5 linhas mexendo em 3 variáveis — mutex. Para comparar na prática, o spinlock do exercício 2 é o mutex "feito à mão" com atomic_flag.',
        ],
        lista: [
          'Contador compartilhado, flag de status, "quem chegou primeiro" → atômico.',
          'Fila circular, lista encadeada, transação de 3 campos → mutex.',
          'Num lock-free, cada parte individual é atômica; o conjunto precisa de CAS para compor.',
          'Atômico não substitui mutex para "ações compostas"; mutex não é barato como um contador.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Rode o exercício da data race do módulo 06 (contador++ com 4 threads), mas troque long por atomic_int e o incremento por atomic_fetch_add. Imprima o total esperado e obtido, com a marca "(data race corrigida)". O resultado deve fechar em 4.000.000 toda vez.',
        dica: 'Diferente do mutex, aqui não há lock/unlock: a própria instrução RMW garante a indivisibilidade.',
        solucao: `#include <stdio.h>
#include <stdatomic.h>
#include <pthread.h>

#define NTHREADS 4
#define VEZES 1000000

static atomic_int contador = 0;

static void *conta(void *arg)
{
    (void)arg;
    for (int i = 0; i < VEZES; i++) {
        atomic_fetch_add(&contador, 1);
    }
    return NULL;
}

int main(void)
{
    pthread_t t[NTHREADS];
    for (int i = 0; i < NTHREADS; i++) {
        pthread_create(&t[i], NULL, conta, NULL);
    }
    for (int i = 0; i < NTHREADS; i++) {
        pthread_join(t[i], NULL);
    }
    printf("esperado %d, obtido %d (data race corrigida)\\n",
           NTHREADS * VEZES, atomic_load(&contador));
    return 0;
}`,
        solucao_obs: 'Saída real: "esperado 4000000, obtido 4000000 (data race corrigida)" em todas as execuções.',
      },
      {
        nivel: 3,
        enunciado:
          'Implemente um spinlock manual: uma variável atomic_flag trava a porta; cada thread faz "espera ocupada" com atomic_flag_test_and_set enquanto a porta estiver fechada, incrementa um long protegido e destrava com atomic_flag_clear. O total deve ser 400.000.',
        dica: 'atomic_flag é 0/1; test_and_set devolve o valor antigo — se era 1, outro segura a porta; loop enquanto isso.',
        solucao: `#include <stdio.h>
#include <stdatomic.h>
#include <pthread.h>

#define NTHREADS 4
#define VEZES 100000

static atomic_flag trava = ATOMIC_FLAG_INIT;
static long contador = 0;

static void *conta(void *arg)
{
    (void)arg;
    for (int i = 0; i < VEZES; i++) {
        while (atomic_flag_test_and_set(&trava)) {
            /* espera ocupada (spinlock) */
        }
        contador++;
        atomic_flag_clear(&trava);
    }
    return NULL;
}

int main(void)
{
    pthread_t t[NTHREADS];
    for (int i = 0; i < NTHREADS; i++) {
        pthread_create(&t[i], NULL, conta, NULL);
    }
    for (int i = 0; i < NTHREADS; i++) {
        pthread_join(t[i], NULL);
    }
    printf("esperado %d, obtido %ld\\n", NTHREADS * VEZES, contador);
    return 0;
}`,
        solucao_obs: 'Saída real: "esperado 400000, obtido 400000". (Spinlock é a versão atômica do mutex: simples, mas "queima" CPU na espera.)',
      },
      {
        nivel: 3,
        enunciado:
          'Thread A (trabalha) muda o status_atomico de 0 → 1 → 2. Thread B (observa) faz atomic_load em loop e guarda os estados distintos que viu (sem repetições consecutivas), parando ao ver 2. Imprima os estados observados e o status final.',
        dica: 'O observador pode perder o 0 ou o 1 se a transição for rapidíssima — compilação com -O2 deixa isso até mais provável. Isso não é bug: o atômico só garante o valor lido, não que você "pegue todos".',
        solucao: `#include <stdio.h>
#include <stdatomic.h>
#include <pthread.h>

static atomic_int status = 0;   /* 0 = pronto, 1 = trabalhando, 2 = feito */

static void *trabalha(void *arg)
{
    (void)arg;
    atomic_store(&status, 1);
    volatile double acc = 0.0;
    for (int i = 0; i < 100000000; i++) {
        acc += 1.0e-12;
    }
    if (acc < 0.0) {
        printf("impossivel\\n");
    }
    atomic_store(&status, 2);
    return NULL;
}

static void *observa(void *arg)
{
    (void)arg;
    int vistos[4];
    size_t n = 0;
    int ultimo = -1;
    for (;;) {
        int v = atomic_load(&status);
        if (v != ultimo) {
            vistos[n++] = v;
            ultimo = v;
        }
        if (v == 2) {
            break;
        }
    }
    printf("estados observados: ");
    for (size_t i = 0; i < n; i++) {
        printf("%d%s", vistos[i], i + 1 < n ? " " : "");
    }
    printf("\\n");
    return NULL;
}

int main(void)
{
    pthread_t a, b;
    pthread_create(&a, NULL, trabalha, NULL);
    pthread_create(&b, NULL, observa, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("status final: %d\\n", atomic_load(&status));
    return 0;
}`,
        solucao_obs: 'Saída real desta execução: "estados observados: 1 2" e "status final: 2" (a thread B "perdeu" o 0 porque a troca 1 aconteceu antes do primeiro load). Em execuções mais lentas ele pode ver "0 1 2". Ambas são corretas.',
      },
    ],
    quiz: [
      {
        pergunta: 'O que atomic_fetch_add(&c, 1) garante de diferente de c++?',
        opcoes: [
          'Nada',
          'Que a operação "ler, somar, escrever" é indivisível entre threads',
          'Que c fica const',
          'Que é maior que c',
        ],
        correta: 1,
        explicacao: 'fetch_add é um RMW atômico: nenhuma outra thread observa um valor "pela metade" da operação.',
      },
      {
        pergunta: 'Para que serve atomic_compare_exchange_strong?',
        opcoes: [
          'Somar valores',
          'Trocar o valor só se ele ainda for o esperado — resolver "quem elege o vencedor"',
          'Criar uma thread',
          'Esperar um mutex',
        ],
        correta: 1,
        explicacao: 'CAS combina "compare" e "exchange": se igual ao esperado, troca; senão, devolve o atual.',
      },
      {
        pergunta: 'Qual memory_order é o mais fraco (sem barreiras)?',
        opcoes: ['seq_cst', 'acquire', 'release', 'relaxed'],
        correta: 3,
        explicacao: 'relaxed garante só a atomicidade da operação, sem reordenar nada mais — ideal para contadores.',
      },
      {
        pergunta: 'Quando usar mutex em vez de atômico?',
        opcoes: [
          'Criar threads',
          'Ao proteger um trecho com várias operações/variáveis juntas',
          'Ao somar contadores',
          'Nunca: atômico substitui mutex sempre',
        ],
        correta: 1,
        explicacao: 'Mutex dá exclusão mútua de trechos inteiros; atômico só garante operações unitárias.',
      },
      {
        pergunta: 'O observador que "perdeu" o estado 0 do exercício 3 indica bug?',
        opcoes: [
          'Sim, o atômico falhou',
          'Não: o atômico garante o valor lido em cada load, não que todos os estados intermediários sejam vistos',
          'Sim, faltou memory_order_relaxed',
          'Não, mas precisa de mutex',
        ],
        correta: 1,
        explicacao: 'Cada load lê um valor atômico coerente; um estado de vida curtíssima pode nunca ser amostrado.',
      },
    ],
  },
  {
    trilha: '3',
    numero: '08',
    titulo: 'Sockets com POSIX (no Linux/WSL)',
    subtitulo: 'Ordems de bytes, getaddrinfo, servidor e cliente de eco',
    objetivo:
      'Montar o primeiro par cliente-servidor em C: entender por que htons/htonl existem, resolver nomes com getaddrinfo, criar e ouvir um socket com socket/bind/listen/accept, conversar com connect/send/recv e encerrar com shutdown(SHUT_WR). Todo o código deste módulo usa a API POSIX (usada no Linux e no WSL).',
    prerequisitos: 'T3.06 (threads — usadas no exercício 2)',
    duracao: '~35 min',
    nivel: 'Avançado',
    leitura: {
      beej: 'Beej\'s Guide to Network Programming — capítulos 5 a 9 (socket, bind, listen, accept, send/recv e getaddrinfo)',
      king: 'Referência POSIX do seu sistema (man 2 socket, man 2 connect...)',
      foco:
        'Este módulo só compila e roda em ambiente POSIX (Linux ou WSL). Nosso ambiente Windows sem distro WSL instalada não compila estes exemplos; eles ficam com "saída esperada" como referência. Se você está no Linux, compile com: gcc -Wall -Wextra -std=c11 eco_serv.c -o eco_serv e teste em dois terminais.',
    },
    secoes: [
      {
        titulo: 'Endianness na rede: por que htons existe',
        rotulo: 'bytes.c',
        paragrafos: [
          'A rede não usa o byte order do seu processador: ela fala <strong>big-endian</strong> (o primeiro byte é o mais significativo) em todos os números dos cabeçalhos. Em x86/x86-64 (little-endian), o número 9000 vive na memória como <code>28 23</code>, mas a rede espera <code>23 28</code>. As funções <code>htons</code>/<code>ntohs</code> (host-to-network / network-to-host, "s" = short/porta) fazem a troca quando preciso; em big-endian elas são identidade. Como o número "vira" valor diferente ao ser interpretado na outra ponta, o jeito seguro é sempre usar htons/ntohs ao montar/ler structs de rede.',
        ],
        codigo: `#include <stdio.h>
#include <stdint.h>
#include <arpa/inet.h>

int main(void)
{
    uint16_t porta = 9000;
    uint16_t rede = htons(porta);
    printf("host:        %u\\n", (unsigned)porta);
    printf("na rede:     %u  (bytes %u %u)\\n", (unsigned)rede,
           (unsigned)((rede >> 8) & 0xffu), (unsigned)(rede & 0xffu));
    printf("de volta:    %u\\n", (unsigned)ntohs(rede));
    return 0;
}`,
        saida: `> bytes
host:        9000
na rede:     10275  (bytes 40 35)
de volta:    9000`,
      },
      {
        titulo: 'Resolvendo nomes com getaddrinfo',
        rotulo: 'resolv.c',
        paragrafos: [
          'O jeito moderno (e portável) de "achar" um destino é <code>getaddrinfo</code>: ele consulta DNS e devolve uma lista de candidatos (<code>struct addrinfo</code> encadeada) com endereço, família e socket type prontos — não precisamos brincar manualmente com IPv4/IPv6. Passamos como ajuda <code>ai_family = AF_UNSPEC</code> e <code>ai_socktype = SOCK_STREAM</code> e recebemos tudo. <code>inet_ntop</code> converte o endereço binário para texto legível. Este programa resolve "example.com" (ou o argumento dado) e lista os IPs.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <arpa/inet.h>

int main(int argc, char **argv)
{
    const char *host = argc > 1 ? argv[1] : "example.com";
    struct addrinfo dicas;
    memset(&dicas, 0, sizeof dicas);
    dicas.ai_family = AF_UNSPEC;
    dicas.ai_socktype = SOCK_STREAM;

    struct addrinfo *res = NULL;
    int rc = getaddrinfo(host, NULL, &dicas, &res);
    if (rc != 0) {
        fprintf(stderr, "getaddrinfo: %s\\n", gai_strerror(rc));
        return EXIT_FAILURE;
    }
    for (struct addrinfo *p = res; p != NULL; p = p->ai_next) {
        char ip[INET6_ADDRSTRLEN] = "";
        const void *addr = NULL;
        if (p->ai_family == AF_INET) {
            addr = &((struct sockaddr_in *)p->ai_addr)->sin_addr;
        } else if (p->ai_family == AF_INET6) {
            addr = &((struct sockaddr_in6 *)p->ai_addr)->sin6_addr;
        }
        if (addr != NULL) {
            inet_ntop(p->ai_family, addr, ip, sizeof ip);
            printf("%s -> %s\\n", host, ip);
        }
    }
    freeaddrinfo(res);
    return EXIT_SUCCESS;
}`,
        saida: `> resolv example.com
example.com -> 93.184.215.14
example.com -> 2606:2800:220:1:248:1893:25c8:1946`,
      },
      {
        titulo: 'O servidor (1ª vez): socket, bind, listen, accept e eco',
        rotulo: 'eco_serv.c',
        paragrafos: [
          'O esqueleto de um servidor TCP: <code>socket()</code> abre um descritor; <code>bind()</code> amarra ele a um endereço:porta (usando <code>INADDR_ANY</code> para todas as interfaces); <code>listen()</code> avisa o sistema para aceitar conexões (fila de 8); <code>accept()</code> bloqueia até chegar um cliente e devolve um <em>novo</em> socket para conversar; <code>send/recv</code> fazem o eco; <code>close()</code> encerra. Este servidor lida com um cliente por vez e ecoa tudo que recebe. Compile no Linux/WSL com <code>gcc -Wall -Wextra -std=c11 eco_serv.c -o eco_serv</code> e teste com o cliente da próxima seção.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORTA 9000

int main(void)
{
    int srv = socket(AF_INET, SOCK_STREAM, 0);
    if (srv < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }
    int opt = 1;
    setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof opt);

    struct sockaddr_in end;
    memset(&end, 0, sizeof end);
    end.sin_family = AF_INET;
    end.sin_addr.s_addr = htonl(INADDR_ANY);
    end.sin_port = htons(PORTA);

    if (bind(srv, (struct sockaddr *)&end, sizeof end) < 0) {
        perror("bind");
        return EXIT_FAILURE;
    }
    if (listen(srv, 8) < 0) {
        perror("listen");
        return EXIT_FAILURE;
    }
    printf("eco pronto na porta %d (Ctrl+C encerra)\\n", PORTA);

    while (1) {
        struct sockaddr_in cli;
        socklen_t len = sizeof cli;
        int c = accept(srv, (struct sockaddr *)&cli, &len);
        if (c < 0) {
            perror("accept");
            continue;
        }
        printf("cliente conectado de %s\\n", inet_ntoa(cli.sin_addr));
        char buf[1024];
        ssize_t n;
        while ((n = recv(c, buf, sizeof buf, 0)) > 0) {
            (void)send(c, buf, (size_t)n, 0);
        }
        close(c);
        printf("cliente desconectado\\n");
    }
    return 0;
}`,
        saida: `> ./eco_serv
eco pronto na porta 9000 (Ctrl+C encerra)
cliente conectado de 127.0.0.1
cliente desconectado`,
      },
      {
        titulo: 'O cliente e o "meio-círculo": fgets + recv',
        rotulo: 'eco_cli.c',
        paragrafos: [
          'O cliente monta um socket, preenche <code>sockaddr_in</code> com <code>127.0.0.1</code> (via inet_pton) e a porta, e chama <code>connect()</code>. Depois é um loop: ler linha do teclado com fgets, mandar com send e imprimir o eco com recv. Vale aprender a leitura <code>recv</code> devolve o nº de bytes de uma "rajada" — que pode ser menor que a mensagem; para o eco por linha funciona bem. Teste no Linux/WSL com o eco_serv rodando num terminal e o eco_cli em outro.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORTA 9000

int main(void)
{
    int s = socket(AF_INET, SOCK_STREAM, 0);
    if (s < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }
    struct sockaddr_in end;
    memset(&end, 0, sizeof end);
    end.sin_family = AF_INET;
    end.sin_port = htons(PORTA);
    if (inet_pton(AF_INET, "127.0.0.1", &end.sin_addr) != 1) {
        fprintf(stderr, "endereco invalido\\n");
        close(s);
        return EXIT_FAILURE;
    }
    if (connect(s, (struct sockaddr *)&end, sizeof end) < 0) {
        perror("connect");
        close(s);
        return EXIT_FAILURE;
    }
    printf("conectado; digite linhas para eco (Ctrl+D sai)\\n");
    char buf[1024];
    while (fgets(buf, sizeof buf, stdin) != NULL) {
        size_t tam = strlen(buf);
        (void)send(s, buf, tam, 0);
        ssize_t n = recv(s, buf, sizeof buf, 0);
        if (n <= 0) {
            printf("servidor fechou a conexao\\n");
            break;
        }
        printf("eco: %.*s", (int)n, buf);
    }
    close(s);
    return 0;
}`,
        saida: `> ./eco_cli
conectado; digite linhas para eco (Ctrl+D sai)
hello
eco: hello
mundo
eco: mundo`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Um cliente "one-shot": conecta em 127.0.0.1:9000, manda a string "oi servidor\\n" e espera/ imprime a resposta. É o mínimo para testar um servidor de eco sem digitação.',
        dica: 'Você não precisa de loop: um send e um recv resolvem. Chame connect antes e verifique o erro.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORTA 9000

int main(void)
{
    int s = socket(AF_INET, SOCK_STREAM, 0);
    if (s < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }
    struct sockaddr_in end;
    memset(&end, 0, sizeof end);
    end.sin_family = AF_INET;
    end.sin_port = htons(PORTA);
    if (inet_pton(AF_INET, "127.0.0.1", &end.sin_addr) != 1) {
        fprintf(stderr, "endereco invalido\\n");
        close(s);
        return EXIT_FAILURE;
    }
    if (connect(s, (struct sockaddr *)&end, sizeof end) < 0) {
        perror("connect");
        close(s);
        return EXIT_FAILURE;
    }
    const char *msg = "oi servidor\\n";
    (void)send(s, msg, strlen(msg), 0);
    char buf[1024];
    ssize_t n = recv(s, buf, sizeof buf, 0);
    if (n > 0) {
        printf("resposta: %.*s", (int)n, buf);
    }
    close(s);
    return 0;
}`,
        solucao_obs: 'Execução esperada com o eco_serv rodando: "resposta: oi servidor". Se não houver servidor, connect falha e o perror mostra "Connection refused".',
      },
      {
        nivel: 2,
        enunciado:
          'Vamos fazer o servidor atender várias conexões ao mesmo tempo: cada conexão aceita vai para uma thread própria (padrão thread-per-connection). Use malloc para entregar o descritor para a thread e pthread_detach após criar.',
        dica: 'O fd da conexão precisa sobreviver à volta do accept: passe uma cópia heap da int. A thread fecha e libera ao terminar.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORTA 9000

static void *atende(void *arg)
{
    int c = *(int *)arg;
    free(arg);
    char buf[1024];
    ssize_t n;
    while ((n = recv(c, buf, sizeof buf, 0)) > 0) {
        (void)send(c, buf, (size_t)n, 0);
    }
    close(c);
    printf("conexao encerrada\\n");
    return NULL;
}

int main(void)
{
    int srv = socket(AF_INET, SOCK_STREAM, 0);
    if (srv < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }
    int opt = 1;
    setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof opt);
    struct sockaddr_in end;
    memset(&end, 0, sizeof end);
    end.sin_family = AF_INET;
    end.sin_addr.s_addr = htonl(INADDR_ANY);
    end.sin_port = htons(PORTA);
    if (bind(srv, (struct sockaddr *)&end, sizeof end) < 0) {
        perror("bind");
        return EXIT_FAILURE;
    }
    if (listen(srv, 8) < 0) {
        perror("listen");
        return EXIT_FAILURE;
    }
    printf("servidor com 1 thread por conexao na porta %d (Ctrl+C encerra)\\n", PORTA);
    while (1) {
        struct sockaddr_in cli;
        socklen_t len = sizeof cli;
        int c = accept(srv, (struct sockaddr *)&cli, &len);
        if (c < 0) {
            perror("accept");
            continue;
        }
        int *fd = malloc(sizeof *fd);
        if (fd == NULL) {
            close(c);
            continue;
        }
        *fd = c;
        pthread_t t;
        if (pthread_create(&t, NULL, atende, fd) != 0) {
            perror("pthread_create");
            free(fd);
            close(c);
            continue;
        }
        pthread_detach(t);
    }
    return 0;
}`,
        solucao_obs: 'Compile com -pthread. Sob dois clientes simultâneos, o servidor atende os dois: a saída esperada é "servidor com 1 thread por conexao na porta 9000" + duas "conexao encerrada" conforme os clientes saem.',
      },
      {
        nivel: 3,
        enunciado:
          'O cliente que envia várias linhas deve terminar de forma elegante: depois do último fgets, chame shutdown(s, SHUT_WR) para avisar o servidor "fim de envio" e ainda ler o eco que estiver por vir. O loop termina quando recv devolve 0 (FIN).',
        dica: 'shutdown(SHUT_WR) envia FIN; o servidor "vê" o EOF no recv dele e fecha; aí o seu recv devolve 0. Sem shutdown, a conexão ficaria esperando.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORTA 9000

int main(void)
{
    int s = socket(AF_INET, SOCK_STREAM, 0);
    if (s < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }
    struct sockaddr_in end;
    memset(&end, 0, sizeof end);
    end.sin_family = AF_INET;
    end.sin_port = htons(PORTA);
    if (inet_pton(AF_INET, "127.0.0.1", &end.sin_addr) != 1) {
        fprintf(stderr, "endereco invalido\\n");
        close(s);
        return EXIT_FAILURE;
    }
    if (connect(s, (struct sockaddr *)&end, sizeof end) < 0) {
        perror("connect");
        close(s);
        return EXIT_FAILURE;
    }
    printf("digite linhas; fim de entrada encerra (Ctrl+D)\\n");
    char buf[1024];
    while (fgets(buf, sizeof buf, stdin) != NULL) {
        size_t tam = strlen(buf);
        (void)send(s, buf, tam, 0);
    }
    shutdown(s, SHUT_WR);   /* aviso de fim de dados: o eco volta tudo antes */
    printf("aguardando o resto do eco...\\n");
    ssize_t n;
    while ((n = recv(s, buf, sizeof buf, 0)) > 0) {
        printf("eco: %.*s", (int)n, buf);
    }
    printf("conexao encerrada (FIN recebido)\\n");
    close(s);
    return 0;
}`,
        solucao_obs: 'Execução esperada: digite 2 linhas, Ctrl+D; o programa imprime os dois ecos e fecha com "conexao encerrada (FIN recebido)".',
      },
    ],
    quiz: [
      {
        pergunta: 'Para que serve htons(porta)?',
        opcoes: [
          'Acelerar a porta',
          'Converter a porta do byte order do host para o big-endian da rede',
          'Definir a porta',
          'Conectar o socket',
        ],
        correta: 1,
        explicacao: 'A rede numera com o byte mais significativo primeiro; o host little-endian precisa da conversão.',
      },
      {
        pergunta: 'Qual o papel de getaddrinfo no cliente/servidor?',
        opcoes: [
          'Abrir um arquivo',
          'Resolver nomes (DNS) para endereços do tipo struct addrinfo',
          'Enviar dados',
          'Fechar a conexão',
        ],
        correta: 1,
        explicacao: 'getaddrinfo devolve a lista de endereços possíveis com família, socket type e estrutura pronta para connect/bind.',
      },
      {
        pergunta: 'O que accept() devolve?',
        opcoes: [
          'O socket original do servidor',
          'Um novo descritor pronto para conversar com o cliente conectado',
          'O endereço do host remoto',
          'O número da porta',
        ],
        correta: 1,
        explicacao: 'accept bloqueia até um cliente e devolve um socket "filho"; o socket do servidor segue em listen.',
      },
      {
        pergunta: 'Quando recv devolve 0?',
        opcoes: [
          'Quando o buffer vazio',
          'Quando a outra ponta fechou (FIN recebido)',
          'Quando o tempo esgotou',
          'Quando ocorreu erro',
        ],
        correta: 1,
        explicacao: '0 significa EOF na conexão: a outra ponta fechou ou enviou FIN (casos: shutdown(SHUT_WR)).',
      },
      {
        pergunta: 'Por que o servidor thread-per-connection usou malloc para o fd?',
        opcoes: [
          'Para gastar memória de propósito',
          'Porque o descritor precisa sobreviver ao retorno do accept e do loop, e a thread o libera',
          'Para acelerar o accept',
          'É obrigatório no POSIX',
        ],
        correta: 1,
        explicacao: 'A variável local do loop morreria; heap mantém o valor vivo até a thread terminar e dar free.',
      },
    ],
    projeto: {
      titulo: 'campo.minado: controle remoto via TCP',
      descricao:
        'Transforme o Campo Minado (jogo de linha de comando) num servidor controlado por TCP: um servidor <code>m3_serv</code> mantém o tabuleiro e aguarda clientes; o cliente <code>m3_cli</code> envia comandos como "jogar (linha coluna)" e "marcar (linha coluna)". O servidor responde com o estado do tabuleiro a cada jogada. Use thread-per-connection para aceitar vários clientes.',
      criterios: [
        'Servidor em socket/listen/accept de onde o jogo roda; usa htons para a porta 9000.',
        'Cliente conecta em 127.0.0.1:9000, envia os comandos e imprime o tabuleiro retornado.',
        'Termina com shutdown(SHUT_WR) ao sair e lê o estado final.',
        'Partida com uma bomba fixa (por exemplo, linha 3 coluna 2): "explodiu" deve aparecer ao clicar na bomba.',
        'Múltiplos clientes podem entrar na mesma partida (o servidor não pode quebrar ao receber dois clientes de uma vez).',
      ],
    },
  },
];