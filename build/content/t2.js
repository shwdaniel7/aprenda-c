// Trilha 2 — Intermediário
module.exports = [
  {
    trilha: '2',
    numero: '01',
    titulo: 'Ponteiros: o coração do C',
    subtitulo: 'endereços, operador &, dereferência, NULL e retorno múltiplo',
    objetivo:
      'Entender que toda variável mora em um endereço de memória, que um ponteiro é uma caixa que guarda esse endereço, e usar & e * para ler, escrever e "devolver" valores por meio de funções — o famoso swap.',
    prerequisitos: 'T1.06 a T1.08 (arrays, loops e funções)',
    duracao: '~45 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 5 (Pointers and Arrays)',
      king: 'Capítulo 11 (Pointers)',
      foco:
        'No Beej, leia a ideia de ponteiro como "variável que guarda um endereço" e os exemplos com & e *. No King, capriche nos diagramas de memória do capítulo 11 — eles fixam o modelo mental.',
    },
    secoes: [
      {
        titulo: 'A memória e o endereço das variáveis',
        rotulo: 'endereco.c',
        paragrafos: [
          'Imagine a memória RAM como uma rua com milhões de casas numeradas. Cada byte tem um <em>endereço</em> — um número que diz onde ele está. Quando você declara <code>int x = 42;</code>, o compilador reserva 4 bytes em algum lugar dessa rua e associa o nome <code>x</code> a esse endereço.',
          'O operador <strong>unário <code>&amp;</code></strong> (e-comercial) devolve o endereço de uma variável. É como perguntar "qual casa o <code>x</code> mora?". O especificador <code>%p</code> imprime um endereço (elemento tem de ser disparado como <code>void *</code>):',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int x = 42;
    char c = 'A';
    double d = 3.14;

    printf("x = %d, &x = %p\\n", x, (void *)&x);
    printf("c = %c, &c = %p\\n", c, (void *)&c);
    printf("d = %.2f, &d = %p\\n", d, (void *)&d);
    return 0;
}`,
        saida: `x = 42, &x = 000000A177BFFDCC
c = A, &c = 000000A177BFFDCB
d = 3.14, &d = 000000A177BFFDC0

(as casas são números longos; endereços mudam a cada execução. x, c e d ficaram pertinhos no stack)`,
      },
      {
        titulo: 'Ponteiro: uma caixa que guarda um endereço',
        rotulo: 'primeiro-ponteiro.c',
        paragrafos: [
          'Um ponteiro é exatamente isso: uma variável cujo <em>conteúdo é um endereço</em>. A declaração <code>int *p;</code> lê-se "p é um ponteiro para int". Diagrama mental: <em>uma caixa com um bilhete escrito &amp;x</em>.',
          'Para <strong>pegar o endereço</strong> usamos <code>&amp;x</code>; para <strong>seguir para a casa</strong> (ler ou escrever no valor apontado) usamos o operador unário <strong><code>*</code></strong>, chamado <em>dereferência</em>:',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int x = 42;
    int *p = &x;

    printf("x = %d\\n", x);
    printf("&x = %p\\n", (void *)&x);
    printf("p = %p\\n", (void *)p);
    printf("*p = %d\\n", *p);

    *p = 7;              /* escreve no mesmo endereço de x */
    printf("depois de *p = 7 -> x = %d\\n", x);
    return 0;
}`,
        saida: `x = 42
&x = 000000A8D05FFA34
p = 000000A8D05FFA34
*p = 42
depois de *p = 7 -> x = 7

(p e &x imprimem o mesmo número: p guarda o endereço de x)`,
      },
      {
        titulo: 'Por que o tipo do ponteiro importa',
        rotulo: 'tipos.c',
        paragrafos: [
          '<code>int *p</code> e <code>char *p</code> guardam endereços do mesmo tamanho (8 bytes em 64 bits). Então por que o tipo? Porque <code>*</code> precisa saber <strong>quantos bytes e como interpretá-los</strong> na casa apontada: um <code>int</code> ocupa 4 bytes; um <code>char</code>, 1. O tipo define a "unidade" da casa.',
          'O exemplo abaixo olha os <em>bytes por dentro</em> de um int usando um <code>char *</code>. Em máquinas little-endian (x86/x64), o byte menos significativo vem primeiro:',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int x = 1000;               /* 0x000003E8 */
    int *pi = &x;
    char *pc = (char *)&x;

    printf("sizeof(ponteiro) = %zu bytes\\n", sizeof(pi));
    printf("*pi = %d\\n", *pi);
    printf("primeiro byte via char* = %d\\n", (int)*pc);
    printf("bytes do int: %02X %02X %02X %02X\\n",
           (unsigned char)pc[0], (unsigned char)pc[1],
           (unsigned char)pc[2], (unsigned char)pc[3]);
    return 0;
}`,
        saida: `sizeof(ponteiro) = 8 bytes
*pi = 1000
primeiro byte via char* = -24
bytes do int: E8 03 00 00

(o byte 0xE8 visto como unsigned char seria 232; como char com sinal aparece -24)`,

      },
      {
        titulo: 'Ponteiro que não aponta para nada: NULL',
        rotulo: 'nulo.c',
        paragrafos: [
          'Um ponteiro <strong>não inicializado</strong> guarda lixo — dereferenciá-lo é comportamento indefinido (crash). Por isso a linguagem fornece <code>NULL</code>: um valor sentinela <em>garantidamente inválido</em> que significa "não aponto para lugar nenhum". Compare com <code>NULL</code> antes de usar, e use <code>NULL</code> após um <code>free</code> para não "seguir" um ponteiro já apagado.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int *p = NULL;

    if (p == NULL) {
        printf("p ainda nao aponta para lugar nenhum.\\n");
    }

    int x = 5;
    p = &x;
    printf("depois de p = &x, *p = %d\\n", *p);
    return 0;
}`,
        saida: `p ainda nao aponta para lugar nenhum.
depois de p = &x, *p = 5`,
      },
      {
        titulo: 'Swap: funções que modificam quem chamou',
        rotulo: 'swap.c',
        paragrafos: [
          'Em C, funções recebem <strong>cópias</strong> dos argumentos. Por isso <code>trocar(a, b)</code> com valores não muda nada lá fora. A solução clássica é passar <em>endereços</em>: a função segue o bilhete e mexe na casa original.',
          'Este é o ponto de virada para "retornar" múltiplos valores: em vez de um <code>return</code>, você recebe endereços de variáveis do chamador e escreve nelas.',
        ],
        codigo: `#include <stdio.h>

void trocar(int *a, int *b)
{
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void)
{
    int x = 10, y = 99;
    printf("antes : x=%d y=%d\\n", x, y);
    trocar(&x, &y);
    printf("depois: x=%d y=%d\\n", x, y);
    return 0;
}`,
        saida: `antes : x=10 y=99
depois: x=99 y=10`,
      },
      {
        titulo: 'Devolvendo dois resultados: quociente e resto',
        rotulo: 'divisao-com-resto.c',
        paragrafos: [
          'A mesma técnica resolve o caso de uma operação que produz dois resultados. Aqui <code>divide</code> "devolve" o quociente e o resto por meio de dois ponteiros — nenhum <code>return</code> é necessário.',
          'Observe ainda dois detalhes do C: <code>-17 / 5</code> trunca em direção a zero (dá -3), e o resto acompanha o sinal do dividendo (dá -2). Programas científicos de verdade desenham as regras de arredondamento de propósito.',
        ],
        codigo: `#include <stdio.h>

void divide(int a, int b, int *quociente, int *resto)
{
    *quociente = a / b;
    *resto = a % b;
}

int main(void)
{
    int q, r;
    divide(17, 5, &q, &r);
    printf("17 / 5  = %d, resto %d\\n", q, r);
    divide(-17, 5, &q, &r);
    printf("-17 / 5 = %d, resto %d\\n", q, r);
    return 0;
}`,
        saida: `17 / 5  = 3, resto 2
-17 / 5 = -3, resto -2`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Declare um <code>int</code>, um <code>char</code> e um <code>double</code>, imprima os três valores e os três endereços com <code>%p</code>. Imprima também <code>sizeof(int*)</code> e <code>sizeof(char*)</code>. Rode o programa algumas vezes: os endereços mudam? O <code>sizeof</code> muda?',
        dica: 'Imprima endereço sempre com <code>(void *)</code> no argumento do <code>%p</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    int x = 1;
    char c = 'z';
    double d = 2.5;

    printf("x = %d  &x = %p\\n", x, (void *)&x);
    printf("c = %c  &c = %p\\n", c, (void *)&c);
    printf("d = %.2f &d = %p\\n", d, (void *)&d);

    printf("sizeof(int*)  = %zu\\n", sizeof(int *));
    printf("sizeof(char*) = %zu\\n", sizeof(char *));
    return 0;
}`,
        solucao_obs: 'Os endereços variam a cada execução (o sistema posiciona o stack onde quiser); o <code>sizeof</code> depende da arquitetura (8 em 64 bits).',
      },
      {
        nivel: 2,
        enunciado:
          'Escreva a função <code>trocar</code> e use-a para inverter os valores de duas variáveis lidas de um array, mostrando o array antes e depois (ex.: <code>arr = {5, 9}</code> vira <code>{9, 5}</code>).',
        dica: 'Um array decai para o endereço do primeiro elemento; você pode passar <code>&amp;arr[0]</code> e <code>&amp;arr[1]</code>.',
        solucao: `#include <stdio.h>

void trocar(int *a, int *b)
{
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void)
{
    int arr[2] = {5, 9};

    printf("antes : arr[0]=%d arr[1]=%d\\n", arr[0], arr[1]);
    trocar(&arr[0], &arr[1]);
    printf("depois: arr[0]=%d arr[1]=%d\\n", arr[0], arr[1]);
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Gere quociente e resto de 29 ÷ 7 e também de -29 ÷ 7 usando uma função com ponteiros. Imprima resultados em formato <code>a / b = q, resto r</code>.',
        dica: 'A função <code>divide</code> acima já faz isso — basta adaptar os valores.',
        solucao: `#include <stdio.h>

void divide(int a, int b, int *q, int *r)
{
    *q = a / b;
    *r = a % b;
}

int main(void)
{
    int q, r;
    divide(29, 7, &q, &r);
    printf("29 / 7 = %d, resto %d\\n", q, r);
    divide(-29, 7, &q, &r);
    printf("-29 / 7 = %d, resto %d\\n", q, r);
    return 0;
}`,
        solucao_obs: 'Esperado: 29/7 = 4 resto 1; -29/7 = -4 resto -1 (truncamento em direção a zero).',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva <code>estatisticas(a, b, c, &menor, &maior)</code> que devolve, pelos ponteiros, o menor e o maior de três inteiros. Teste com valores com negativos e repita com ordem trocada.',
        dica: 'Comece com <code>*menor = a</code> e <code>*maior = a</code>, depois compare com <code>b</code> e <code>c</code>.',
        solucao: `#include <stdio.h>

void estatisticas(int a, int b, int c, int *menor, int *maior)
{
    *menor = a;
    *maior = a;

    if (b < *menor) *menor = b;
    if (b > *maior) *maior = b;
    if (c < *menor) *menor = c;
    if (c > *maior) *maior = c;
}

int main(void)
{
    int mn, mx;
    estatisticas(-3, 12, 0, &mn, &mx);
    printf("entre -3, 12 e 0: menor=%d maior=%d\\n", mn, mx);
    estatisticas(7, 7, 1, &mn, &mx);
    printf("entre 7, 7 e 1: menor=%d maior=%d\\n", mn, mx);
    return 0;
}`,
      },
      {
        nivel: 4,
        enunciado:
          'Escreva uma função <code>apontar_para(int **pp, int *alvo)</code> que muda para onde o ponteiro do chamador aponta (dica: receba o endereço do próprio ponteiro). No <code>main</code>, faça <code>p</code> apontar para <code>a</code>, imprima <code>*p</code>, chame a função com <code>&amp;p</code> e <code>&amp;b</code>, e imprima <code>*p</code> de novo.',
        dica: 'Isso é um ponteiro-para-ponteiro: <code>**pp</code> é o ponteiro original; <code>*pp = alvo</code> troca o ponteiro do chamador.',
        solucao: `#include <stdio.h>

void apontar_para(int **pp, int *alvo)
{
    *pp = alvo;
}

int main(void)
{
    int a = 10, b = 20;
    int *p = &a;

    printf("p aponta para %d\\n", *p);
    apontar_para(&p, &b);
    printf("p agora aponta para %d\\n", *p);
    return 0;
}`,
        solucao_obs: 'A mesma ideia de passar o endereço da caixa que você quer alterar — aqui a caixa guarda um ponteiro. Esse padrão será explorado no módulo T2.11 e no strtok.',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual operador devolve o endereço de uma variável?',
        opcoes: ['*', '&', '%', '#'],
        correta: 1,
        explicacao: '<code>&amp;x</code> ("endereço de x") é o operador que retorna o endereço em memória da variável.',
      },
      {
        pergunta: 'O que declara <code>int *p;</code>?',
        opcoes: [
          'Uma variável inteira chamada *p',
          'Um ponteiro para int chamado p',
          'Um ponteiro que guarda o valor 0',
          'Um array de inteiros',
        ],
        correta: 1,
        explicacao: '<code>int *p</code> declara p como um ponteiro capaz de guardar o endereço de um <code>int</code>.',
      },
      {
        pergunta: 'Se <code>int *p = &amp;x;</code>, o que faz <code>*p = 7;</code>?',
        opcoes: [
          'Muda o ponteiro p para apontar para o valor 7',
          'Escreve 7 na variável x (na casa apontada)',
          'Copia o endereço de x para 7',
          'Gera erro de compilação obrigatoriamente',
        ],
        correta: 1,
        explicacao: 'Com <code>*</code> na esquerda (dereferência em escrita), escrevemos 7 no endereço guardado por p, ou seja, em x.',
      },
      {
        pergunta: 'Qual valor usamos para um ponteiro "não aponta para nada"?',
        opcoes: ['NULL', '0x00 apenas em main', 'NaN', 'undefined (em C lispe)'],
        correta: 0,
        explicacao: 'NULL é o valor sentinela que significa "nenhum endereço válido". Testamos com <code>if (p == NULL)</code>.',
      },
      {
        pergunta: 'Por que o swap clássico usa ponteiros?',
        opcoes: [
          'Para deixar o código mais curto',
          'Porque funções recebem cópias; com ponteiros a função altera as variáveis do chamador.',
          'Porque int não pode ser copiado',
          'É apenas uma tradição histórica',
        ],
        correta: 1,
        explicacao: 'Passando <code>&amp;a</code> e <code>&amp;b</code>, a função segue os endereços e modifica diretamente as variáveis originais.',
      },
    ],
    projeto: {
      titulo: 'Caixa registradora: troco em cédulas',
      descricao:
        'Implemente a função <code>troco(int valor, int *c100, int *c50, int *c20, int *c10, int *c5, int *c2, int *c1)</code> que preenche a menor quantidade de cédulas/moedas para pagar um valor. No <code>main</code>, teste com 289, 117 e 30 e imprima o "extrato". Vale também validar que a soma das cédulas multiplicadas pelos valores bate com o total.',
      criterios: [
        'Função usa ponteiros para "devolver" as sete quantidades.',
        'Menu/testes cobrem valores variados (incluindo múltiplos de 5 e ímpares).',
        'Verificação de soma: 100*c100 + 50*c50 + ... + 1*c1 == valor informado.',
        'Compila com <code>gcc -Wall -Wextra -std=c11</code> sem avisos.',
      ],
    },
  },
  {
    trilha: '2',
    numero: '02',
    titulo: 'Ponteiros e arrays: aritmética de ponteiros',
    subtitulo: 'arrays que decaem para ponteiros, p+n, a[i] == *(a+i), void* e size_t',
    objetivo:
      'Entender a equivalência fundamental entre arrays e ponteiros, somar e comparar ponteiros com segurança (stride do tipo), percorrer arrays com ponteiros e dominar ponteiros void* e o tipo size_t.',
    prerequisitos: 'T2.01',
    duracao: '~40 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulos 5 e 6.6 (Pointers and Arrays); seções 11 e sobre void* e size_t',
      king: 'Capítulo 12 (Pointers and Arrays)',
      foco:
        'No Beej, fixe a regra "um array decai para o endereço do primeiro elemento na maioria das expressões". No King, faça os exercícios de aparidade de ponteiros e os diagramas de a[i] vs *(a+i).',
    },
    secoes: [
      {
        titulo: 'Arrays decaem para o ponteiro do primeiro elemento',
        rotulo: 'decai.c',
        paragrafos: [
          'Exceto em alguns contextos (<code>sizeof</code>, <code>&amp;arr</code>), o nome de um array se converte ("decai") para um ponteiro para o seu primeiro elemento. Ou seja: <code>arr</code> na maioria das expressões vale <code>&amp;arr[0]</code>.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int arr[5] = {10, 20, 30, 40, 50};

    printf("arr     = %p\\n", (void *)arr);
    printf("&arr[0] = %p\\n", (void *)&arr[0]);
    printf("iguais? %s\\n", arr == &arr[0] ? "sim" : "nao");
    return 0;
}`,
        saida: `arr     = 0000007355BFF990
&arr[0] = 0000007355BFF990
iguais? sim`,
      },
      {
        titulo: 'Aritmética de ponteiros: p + n',
        rotulo: 'aritmetica.c',
        paragrafos: [
          'Somar um inteiro a um ponteiro <strong>não soma 1 byte</strong>: soma <code>n × sizeof(tipo)</code>. Isso chama-se <em>stride</em>. <code>p + 2</code> em um <code>int *</code> pula 2 inteiros, ou seja, 8 bytes. É por isso que o tipo do ponteiro importa.',
          'Visualize: <code>p = &amp;arr[0]</code>; então <code>p + 1</code> é <code>&amp;arr[1]</code>, <code>p + 2</code> é <code>&amp;arr[2]</code>, e assim por diante.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int arr[5] = {10, 20, 30, 40, 50};
    int *p = arr;

    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %2d   p+%d = %p\\n", i, arr[i], i, (void *)(p + i));
    }
    return 0;
}`,
        saida: `arr[0] = 10   p+0 = 000000A68A7FFB20
arr[1] = 20   p+1 = 000000A68A7FFB24
arr[2] = 30   p+2 = 000000A68A7FFB28
arr[3] = 40   p+3 = 000000A68A7FFB2C
arr[4] = 50   p+4 = 000000A68A7FFB30

(repare: cada passo soma 4 bytes = sizeof(int))`,
      },
      {
        titulo: 'Percorrendo um array com ponteiro',
        rotulo: 'percorrer.c',
        paragrafos: [
          'Com a aritmética pronta, um loop deve percorrer um array com <code>++p</code>: a variável <code>p</code> "anda" de casa em casa. A condição de parada compara ponteiros — <code>arr + n</code> é o endereço <em>um-passo-além</em> do último elemento (válido para comparar, mas não para dereferenciar).',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int arr[5] = {10, 20, 30, 40, 50};
    int soma = 0;
    int *p;

    for (p = arr; p < arr + 5; p++) {
        soma += *p;
    }

    printf("soma = %d\\n", soma);
    return 0;
}`,
        saida: `soma = 150`,
      },
      {
        titulo: 'Equivalência: a[i] é açúcar para *(a + i)',
        rotulo: 'equivalencia.c',
        paragrafos: [
          'O compilador trata <code>a[i]</code> como <code>*(a + i)</code> — não é coincidência que os dois escrevam com os mesmos símbolos. Como a adição é comutativa, <code>a[i]</code> e <code>i[a]</code> são tecnicamente a mesma coisa, mas <em>ninguém</em> escreve <code>i[a]</code> em código real.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int arr[5] = {10, 20, 30, 40, 50};

    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d    *(arr + %d) = %d\\n",
               i, arr[i], i, *(arr + i));
    }
    return 0;
}`,
        saida: `arr[0] = 10    *(arr + 0) = 10
arr[1] = 20    *(arr + 1) = 20
arr[2] = 30    *(arr + 2) = 30
arr[3] = 40    *(arr + 3) = 40
arr[4] = 50    *(arr + 4) = 50`,
      },
      {
        titulo: 'void* e size_t: o ponteiro "maioral" e o tipo de tamanho',
        rotulo: 'void-e-size.c',
        paragrafos: [
          '<code>void *</code> é um ponteiro <em>sem tipo</em>: serve para transportar endereços sem saber o conteúdo (é o que <code>malloc</code> retorna). Você <strong>não pode dereferenciar</strong> um <code>void *</code> (o C não sabe quantos bytes ler) — é preciso converter com um cast para o tipo certo.',
          '<code>size_t</code> (em <code>&lt;stddef.h&gt;</code> / <code>&lt;stdlib.h&gt;</code>) é o tipo "sem sinal de tamanho" usado por <code>sizeof</code>, <code>strlen</code>, índices de alocação etc. No printf usamos <code>%zu</code>.',
        ],
        codigo: `#include <stdio.h>
#include <stddef.h>

int main(void)
{
    int x = 7;
    void *pv = &x;
    int *pi = (int *)pv;

    printf("pv = %p\\n", pv);
    printf("*pi = %d (apos cast de void* para int*)\\n", *pi);
    printf("sizeof(size_t) = %zu\\n", sizeof(size_t));
    return 0;
}`,
        saida: `pv = 0000000FD71FFA3C
*pi = 7 (apos cast de void* para int*)
sizeof(size_t) = 8`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Prove, imprimindo com <code>%p</code>, que <code>arr</code>, <code>&amp;arr[0]</code> e um <code>int *p = arr;</code> têm o mesmo endereço. Repita com um array de <code>double</code>.',
        dica: 'O próprio array decai; imprima os três e compare visualmente.',
        solucao: `#include <stdio.h>

int main(void)
{
    int arr[3] = {1, 2, 3};
    double d[3] = {1.5, 2.5, 3.5};
    int *pi = arr;
    double *pd = d;

    printf("arr     = %p   pi     = %p   &arr[0] = %p\\n",
           (void *)arr, (void *)pi, (void *)&arr[0]);
    printf("d       = %p   pd     = %p   &d[0]   = %p\\n",
           (void *)d, (void *)pd, (void *)&d[0]);
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Some os elementos de um array de 8 inteiros usando apenas um ponteiro com <code>++</code> (sem índice). Imprima a soma.',
        dica: 'Loop do padrão <code>for (p = arr; p < arr + 8; p++)</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    int arr[8] = {1, 2, 3, 4, 5, 6, 7, 8};
    int soma = 0;
    int *p;

    for (p = arr; p < arr + 8; p++) {
        soma += *p;
    }
    printf("soma = %d\\n", soma);
    return 0;
}`,
        solucao_obs: 'Esperado 36. O ponteiro p anda 8 casas de 4 bytes cada.',
      },
      {
        nivel: 3,
        enunciado:
          'Inverta um array de 6 inteiros in-place usando dois ponteiros (um no início, outro no fim) e a função trocar. Mostre antes e depois.',
        dica: 'Enquanto <code>ini &lt; fim</code>: troque <code>*ini</code> e <code>*fim</code>, depois <code>ini++</code> e <code>fim--</code>.',
        solucao: `#include <stdio.h>

void trocar(int *a, int *b)
{
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void)
{
    int arr[6] = {1, 2, 3, 4, 5, 6};
    int *ini = arr;
    int *fim = arr + 5;

    printf("original: ");
    for (int i = 0; i < 6; i++) printf("%d ", arr[i]);
    printf("\\n");

    while (ini < fim) {
        trocar(ini, fim);
        ini++;
        fim--;
    }

    printf("invertido: ");
    for (int i = 0; i < 6; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
        solucao_obs: 'Saída esperada: original 1 2 3 4 5 6; invertido 6 5 4 3 2 1.',
      },
      {
        nivel: 3,
        enunciado:
          'Usando apenas ponteiros (nada de <code>[]</code>), encontre o menor valor e a posição dele em um array <code>{9, 3, 12, -2, 5, 3}</code>. Imprima o valor e o índice.',
        dica: 'Mantenha <code>p_menor</code> como ponteiro para o menor até agora; no fim, <code>p_menor - arr</code> é o índice.',
        solucao: `#include <stdio.h>

int main(void)
{
    int arr[6] = {9, 3, 12, -2, 5, 3};
    int *p_menor = arr;

    for (int *p = arr + 1; p < arr + 6; p++) {
        if (*p < *p_menor) {
            p_menor = p;
        }
    }

    printf("menor valor = %d na posicao %ld\\n",
           *p_menor, (long)(p_menor - arr));
    return 0;
}`,
        solucao_obs: 'A subtração de dois ponteiros dá vetor de diferença (tipo <code>ptrdiff_t</code>) — número de elementos entre eles.',
      },
      {
        nivel: 4,
        enunciado:
          'Uma matriz 2×3 em C é contígua na memória. Percorra <code>mat[2][3]</code> com um único <code>int *p = &amp;mat[0][0]</code>, calcule a soma de todos os elementos e ainda imprima o endereço do primeiro e do último.',
        dica: '<code>&amp;mat[0][0]</code> é o "chão" da grade; <code>p + (2*3)</code> é o fim.',
        solucao: `#include <stdio.h>

int main(void)
{
    int mat[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int *p = &mat[0][0];
    int soma = 0;

    for (int *q = p; q < p + 6; q++) {
        soma += *q;
    }

    printf("soma = %d\\n", soma);
    printf("primeiro: %p   derradeiro: %p\\n",
           (void *)p, (void *)(p + 5));
    return 0;
}`,
        solucao_obs: 'Esperado soma = 21. Matrizes 2D são "arrays de arrays" contíguos: 2 blocos de 3 ints seguidos.',
      },
    ],
    quiz: [
      {
        pergunta: 'O que "o array decai para ponteiro" significa na prática?',
        opcoes: [
          'O array vira um ponteiro e perde os dados',
          'Na maioria das expressões, arr vale &amp;arr[0]',
          'O array fica mais lento',
          'O sizeof(arr) muda de valor',
        ],
        correta: 1,
        explicacao: 'Em expressões (exceto <code>sizeof</code> e <code>&amp;arr</code>), o nome do array se converte para o endereço do primeiro elemento.',
      },
      {
        pergunta: 'Se <code>int *p = &amp;x;</code> e <code>x</code> está em 0x1000, quanto vale <code>p + 1</code>?',
        opcoes: ['0x1001', '0x1004', '0x1002', '0x1000'],
        correta: 1,
        explicacao: 'Somar 1 a um <code>int *</code> soma <code>1 × sizeof(int)</code> = 4 bytes: 0x1004.',
      },
      {
        pergunta: 'Qual expressão é exatamente equivalente a <code>a[i]</code>?',
        opcoes: ['a + i', '*(a + i)', '&amp;a + i', 'i * sizeof(a)'],
        correta: 1,
        explicacao: 'O operador <code>[]</code> é açúcar para dereferência de <code>a + i</code>.',
      },
      {
        pergunta: 'Por que não podemos dereferenciar um ponteiro <code>void *</code>?',
        opcoes: [
          'Porque void* ocupa 0 bytes',
          'Porque o compilador não sabe quantos bytes e como interpretar',
          'Porque void é uma palavra-chave reservada',
          'Dá para dereferenciar, mas só com --std=c23',
        ],
        correta: 1,
        explicacao: 'Sem o tipo, não há stride nem interpretação; <code>*pv</code> é proibido. Converte-se para <code>int *</code>, <code>char *</code>, etc.',
      },
      {
        pergunta: 'O tipo <code>size_t</code> é usado para...',
        opcoes: [
          'guardar floats especiais',
          'tamanhos e contagens (sem sinal), como sizeof e strlen',
          'números com sinal de ponteiro válido',
          'endereços de memória apenas',
        ],
        correta: 1,
        explicacao: '<code>size_t</code> é um inteiro sem sinal adequado a tamanhos/contagens; no printf usamos <code>%zu</code>.',
      },
    ],
  },
  {
    trilha: '2',
    numero: '03',
    titulo: 'Strings em C',
    subtitulo: 'char[] + \'\\0\', literais, char*, fgets vs gets, scanf %s e strlen',
    objetivo:
      'Saber que uma string em C é um array de char terminado em \'\\0\', diferenciar array vs literal imutável, ler entradas de forma segura com fgets e percorrer strings com ponteiros.',
    prerequisitos: 'T2.01 e T2.02',
    duracao: '~35 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 7 (Strings)',
      king: 'Capítulos 13.1–13.3 (Strings: conceito, literais, entrada/saída)',
      foco:
        'No Beej, leia a seção sobre string as char array e a de input com fgets. No King, atenção especial à diferença entre "string é um array" e "ponteiro para string literal" na seção 13.2.',
    },
    secoes: [
      {
        titulo: 'String = array de char terminado em \\0',
        rotulo: 'literal.c',
        paragrafos: [
          'No C, "string" é uma convenção: um array de <strong>char</strong> terminado em <code>\'\\0\'</code> (byte 0). O tamanho da string não é guardado em lugar nenhum — o código para ao encontrar o <code>\\0</code>. Por isso "tamanho do array" (<code>sizeof</code>) e "tamanho da string" (<code>strlen</code>) são coisas diferentes: o array inclui o <code>\\0</code>.',
          'Um <em>string literal</em> (<code>"Ana"</code>) gera um array estático <strong>só de leitura</strong> — tentar modificar é comportamento indefinido. Para ter uma string modificável, copiamos os caractéres para um array próprio:',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char nome1[] = "Ana";        /* array de 4: 'A','n','a','\\0' */
    char *nome2 = "Ana";         /* ponteiro para literal (read-only) */
    char copia[] = "Software Livre";

    nome1[0] = 'B';              /* ok: nome1 eh uma copia propria */
    /* nome2[0] = 'B'; */        /* proibido: literal e read-only */

    printf("nome1 (array)   = %s\\n", nome1);
    printf("nome2 (literal) = %s\\n", nome2);
    printf("strlen(nome1) = %zu\\n", strlen(nome1));
    printf("sizeof(nome1) = %zu (inclui o '\\\\0')\\n", sizeof nome1);
    printf("len da string = %zu, bytes do array = %zu\\n",
           strlen(copia), sizeof copia);
    return 0;
}`,
        saida: `nome1 (array)   = Bna
nome2 (literal) = Ana
strlen(nome1) = 3
sizeof(nome1) = 4 (inclui o '\\0')
len da string = 14, bytes do array = 15`,
      },
      {
        titulo: 'Lendo com fgets: seguro, mas cuidado com o \\n',
        rotulo: 'fgets.c',
        paragrafos: [
          'A função <code>gets</code> é <strong>proibida</strong> (nem existe mais no padrão): ela não tem como saber o tamanho do buffer e estoura a memória. Use <code>fgets(buffer, tamanho, stdin)</code>, que lê no máximo <code>tamanho-1</code> caracteres e <strong>sempre</strong> coloca o <code>\\0</code>.',
          'Charme do fgets: ele guarda a nova linha pressionada no buffer. Removê-la é trabalho nosso — um truque comum é o <code>strcspn</code> (módulo T2.04) ou um loop que localiza o <code>\'\\n\'</code>:',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char nome[100];

    printf("Digite seu nome: ");
    if (fgets(nome, sizeof nome, stdin) == NULL) {
        return 1;
    }

    nome[strcspn(nome, "\\n")] = '\\0';   /* remove a quebra de linha */

    printf("Ola, %s!\\n", nome);
    printf("A string tem %zu caracteres.\\n", strlen(nome));
    return 0;
}`,
        saida: `Digite seu nome: Daniel
Ola, Daniel!
A string tem 6 caracteres.`,
      },
      {
        titulo: 'scanf %s: rápido, com limitações',
        rotulo: 'scanf-string.c',
        paragrafos: [
          '<code>scanf("%s", buf)</code> lê uma palavra (para no primeiro espaço) e <strong>não valida o tamanho</strong> — com um campo de largura como <code>%99s</code> limitamos a 99 caracteres, evitando estouro. A grande limitação: ele para no espaço, então não serve para ler frases.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    char nome[100];
    int idade;

    printf("Digite nome e idade: ");
    if (scanf("%99s %d", nome, &idade) != 2) {
        return 1;
    }

    printf("Nome: %s\\n", nome);
    printf("Idade: %d\\n", idade);
    return 0;
}`,
        saida: `Digite nome e idade: Maria 28
Nome: Maria
Idade: 28

(tente digitar "Ana Clara Souza 28": só "Ana" é lido como nome)`,
      },
      {
        titulo: 'Percorrendo uma string com ponteiro',
        rotulo: 'percorrer.c',
        paragrafos: [
          'Como a string é um array terminado em <code>\\0</code>, o padrão <code>for (p = s; *p != \'\\0\'; p++)</code> anda casa por casa até a sentinela. Veja a contagem de caracteres feita à mão (o que a <code>strlen</code> faz por dentro):',
        ],
        codigo: `#include <stdio.h>

int tamanho(const char *s)
{
    int n = 0;
    while (s[n] != '\\0') {
        n++;
    }
    return n;
}

int main(void)
{
    const char *msg = "caminho";

    printf("tamanho(\\"%s\\") = %d\\n", msg, tamanho(msg));

    printf("letras: ");
    for (const char *p = msg; *p != '\\0'; p++) {
        printf("%c ", *p);
    }
    printf("\\n");
    return 0;
}`,
        saida: `tamanho("caminho") = 7
letras: c a m i n h o`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Escreva sua própria <code>comprimento</code> (parecida com <code>strlen</code>) que conta caracteres até o <code>\\0</code>. Teste com <code>"ada"</code>, <code>"programacao"</code> e <code>""</code> (string vazia).',
        dica: 'loop <code>while (s[n] != \'\\0\') n++;</code>',
        solucao: `#include <stdio.h>

int comprimento(const char *s)
{
    int n = 0;
    while (s[n] != '\\0') {
        n++;
    }
    return n;
}

int main(void)
{
    printf("\\"ada\\"          -> %d\\n", comprimento("ada"));
    printf("\\"programacao\\"  -> %d\\n", comprimento("programacao"));
    printf("\\"\\" (vazia)     -> %d\\n", comprimento(""));
    return 0;
}`,
        solucao_obs: 'Esperado: 3, 11 e 0. Note que a string vazia tem só o \\0.',
      },
      {
        nivel: 2,
        enunciado:
          'Leia o nome do usuário com <code>fgets</code>, remova o <code>\\n</code> e imprima uma saudação com a quantidade de letras, ex.: "Olá, JULIA! Seu nome tem 5 letras."',
        dica: 'Use <code>strcspn</code> para achar o \\n e <code>strlen</code> para contar.',
        solucao: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char nome[100];

    printf("Digite seu nome: ");
    if (fgets(nome, sizeof nome, stdin) == NULL) {
        return 1;
    }
    nome[strcspn(nome, "\\n")] = '\\0';

    printf("Ola, %s!  Seu nome tem %zu letras.\\n",
           nome, strlen(nome));
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Implemente seu próprio <code>copiar</code> (clone de <code>strcpy</code>) que copia o conteúdo de <code>origem</code> para <code>destino</code> incluindo o <code>\\0</code>. Teste copiando <code>"linguagem"</code> para um buffer e imprima.',
        dica: 'O clássico: <code>while ((*dest++ = *src++)) ;</code> — para quando copiar o \\0. Ou um loop simples por índice.',
        solucao: `#include <stdio.h>

void copiar(char *dest, const char *src)
{
    int i = 0;
    while (src[i] != '\\0') {
        dest[i] = src[i];
        i++;
    }
    dest[i] = '\\0';
}

int main(void)
{
    char copia[32];

    copiar(copia, "linguagem");
    printf("copia = \\"%s\\"\\n", copia);
    return 0;
}`,
        solucao_obs: 'Garanta que <code>destino</code> tem espaço suficiente (>= strlen(origem)+1).',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva <code>contar_vogais</code> que conta as vogais (a, e, i, o, u, ignorando maiúsculas) de uma string. Teste com <code>"Programacao em C"</code>.',
        dica: 'Compare cada char já normalizado com <code>tolower</code> ou faça duas listas (maiúsculas e minúsculas).',
        solucao: `#include <stdio.h>
#include <ctype.h>

int contar_vogais(const char *s)
{
    int total = 0;
    for (; *s != '\\0'; s++) {
        char c = (char)tolower((unsigned char)*s);
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            total++;
        }
    }
    return total;
}

int main(void)
{
    printf("vogais em \\"Programacao em C\\": %d\\n",
           contar_vogais("Programacao em C"));
    return 0;
}`,
        solucao_obs: 'Resultado esperado: 7 vogais.',
      },
      {
        nivel: 4,
        enunciado:
          'Inverta uma string in-place com dois ponteiros, um no início e outro no fim. Cuidado para não inverter o <code>\\0</code>! Teste com <code>"abcdefg"</code>.',
        dica: '<code>fim</code> deve apontar para o último caractere, ou seja, <code>base + comprimento - 1</code>.',
        solucao: `#include <stdio.h>

void trocar(char *a, char *b)
{
    char tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void)
{
    char texto[] = "abcdefg";
    char *ini = texto;
    char *fim = texto;

    while (*fim != '\\0') {
        fim++;
    }
    fim--;                     /* para no ultimo caractere */

    while (ini < fim) {
        trocar(ini, fim);
        ini++;
        fim--;
    }

    printf("invertida: %s\\n", texto);
    return 0;
}`,
        solucao_obs: 'Esperado "gfedcba". Crucial: começar o <code>fim</code> no último caractere, nunca apontar o fim para o \\0 durante a troca.',
      },
    ],
    quiz: [
      {
        pergunta: 'O que marca o fim de uma string em C?',
        opcoes: ['o byte 0 (\\0)', 'um caractere \\n', 'o fim do array sempre', 'um tamanho guardado'],
        correta: 0,
        explicacao: 'A convenção do C: a string termina no primeiro byte <code>\\0</code>.',
      },
      {
        pergunta: 'Por que <code>gets</code> é proibido?',
        opcoes: [
          'Porque ocupa muita memória',
          'Porque não existe limite de leitura e estoura o buffer',
          'Porque não lê espaços',
          'Porque imprime lixo no terminal',
        ],
        correta: 1,
        explicacao: '<code>gets</code> copia sem verificar o tamanho do destino — vetor de buffer overflow. Em C11 foi removida.',
      },
      {
        pergunta: 'Se <code>char s[] = "oi";</code>, qual é o valor de <code>sizeof s</code>?',
        opcoes: ['2', '3', '4', 'ugual a strlen(s)'],
        correta: 1,
        explicacao: 'O array guarda \'o\',\'i\',\'\\0\' = 3 bytes. Já <code>strlen(s)</code> daria 2.',
      },
      {
        pergunta: 'O que há de especial em um string literal como <code>"Ana"</code>?',
        opcoes: [
          'É sempre mutável',
          'Vive em memória read-only; modificar é comportamento indefinido',
          'Não tem \\0 no final',
          'Só pode ser usado em printf',
        ],
        correta: 1,
        explicacao: 'O literal gera um array estático apenar-leitura; para modificar, copiamos para um array nosso.',
      },
      {
        pergunta: 'Depois de <code>fgets(buf, n, stdin)</code>, o que geralmente precisa ser feito?',
        opcoes: [
          'Chamar strlen para apagar tudo',
          'Remover o \\n que o fgets deixou no final',
          'Redimensionar o buffer',
          'Nada, o fgets já faz tudo',
        ],
        correta: 1,
        explicacao: 'fgets inclui a quebra de linha; técnicas como <code>strcspn</code> a removem antes de processar.',
      },
    ],
    projeto: {
      titulo: 'Leitor de frases amigável',
      descricao:
        'Crie um programa que pergunta três frases (uma por linha, com fgets), remove as quebras de linha, e depois imprime: a frase mais longa (com posição), a frase mais curta, e a soma total de caracteres. Faça sem usar strlen em pelo menos uma parte (uma função própria de tamanho) e com ponteiros para comparar.',
      criterios: [
        'Entrada 100% com fgets (sem scanf %s no texto final).',
        'Função própria de tamanho + uso de strlen em outro trecho.',
        'Impressão das frases na ordem digitada e dos resultados pedidos.',
        'Compila com -Wall -Wextra sem avisos.',
      ],
    },
  },
  {
    trilha: '2',
    numero: '04',
    titulo: 'Manipulando strings',
    subtitulo: 'string.h: strcpy, strcat, strcmp, strchr, strstr, strtok e snprintf',
    objetivo:
      'Dominar o kit de funções de <string.h> para copiar, concatenar, comparar, buscar e separar strings com segurança, evitando as armadilhas clássicas de buffer.',
    prerequisitos: 'T2.03',
    duracao: '~45 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 7 (seção de funções de string; biblioteca string.h)',
      king: 'Capítulos 13.4–13.6 (limites, funções de string)',
      foco:
        'No Beej, a tabela de funções de string com assinaturas e exemplos de uso. No King, as seções 13.4–13.6 explicam por que strncpy/strncat são mais seguras e como funciona a busca.',
    },
    secoes: [
      {
        titulo: 'Copiar: strcpy e strncpy',
        rotulo: 'strcpy.c',
        paragrafos: [
          '<code>strcpy(dest, src)</code> copia a origem inteira (parando no <code>\\0</code>); é sua responsabilidade garantir que <code>dest</code> tem espaço. <code>strncpy(dest, src, n)</code> copia no máximo <code>n</code> caracteres — e aqui mora a sutileza: <strong>não</strong> garante <code>\\0</code> automático, então escrevemos <code>dest[n-1] = \'\\0\'</code> à mão:',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char a[32];
    char b[32];

    strcpy(a, "primeira");
    strncpy(b, "segunda", sizeof b - 1);
    b[sizeof b - 1] = '\\0';

    printf("a = \\"%s\\"\\n", a);
    printf("b = \\"%s\\"\\n", b);
    return 0;
}`,
        saida: `a = "primeira"
b = "segunda"`,
      },
      {
        titulo: 'Concatenar: strcat e strncat',
        rotulo: 'strcat.c',
        paragrafos: [
          '<code>strcat(dest, src)</code> acha o <code>\\0</code> de <code>dest</code> e copia <code>src</code> a partir dali. Novo estouro clássico: <code>dest</code> deve ter espaço para o resultado todo. <code>strncat</code> limita quantos caracteres vêm de <code>src</code> — a fórmula do tamanho disponível é <code>sizeof(dest) - strlen(dest) - 1</code>:',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char frase[64] = "Aprender";
    char resto[32];

    strncat(frase, " C", sizeof frase - strlen(frase) - 1);
    strcpy(resto, " e' divertido");
    strncat(frase, resto, sizeof frase - strlen(frase) - 1);

    printf("%s\\n", frase);
    return 0;
}`,
        saida: `Aprender C e' divertido`,
      },
      {
        titulo: 'Comparar: strcmp e strncmp',
        rotulo: 'strcmp.c',
        paragrafos: [
          '<code>strcmp(a, b)</code> compara byte a byte e devolve um valor: <strong>negativo</strong> se <code>a &lt; b</code>, <strong>zero</strong> se iguais, <strong>positivo</strong> se <code>a &gt; b</code> (comparação lexicográfica, com os códigos ASCII). <code>strncmp</code> compara só os primeiros n caracteres.',
          'Nunca compare strings com <code>==</code>: isso compara endereços, não conteúdo.',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

int main(void)
{
    printf("strcmp(\\"abc\\", \\"abc\\") = %d\\n", strcmp("abc", "abc"));
    printf("strcmp(\\"abc\\", \\"abd\\") = %d\\n", strcmp("abc", "abd"));
    printf("strcmp(\\"abd\\", \\"abc\\") = %d\\n", strcmp("abd", "abc"));
    printf("strncmp(\\"abcde\\", \\"abcfg\\", 3) = %d\\n", strncmp("abcde", "abcfg", 3));
    return 0;
}`,
        saida: `strcmp("abc", "abc") = 0
strcmp("abc", "abd") = -1
strcmp("abd", "abc") = 1
strncmp("abcde", "abcfg", 3) = 0`,
      },
      {
        titulo: 'Buscar: strchr e strstr',
        rotulo: 'strchr-strstr.c',
        paragrafos: [
          '<code>strchr(s, c)</code> acha o primeiro <code>c</code> na string e devolve um ponteiro para ele (ou NULL). <code>strstr(s, sub)</code> acha a primeira ocorrência de uma substring. Subtrair o ponteiro devolvido do início da string dá o índice:',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

int main(void)
{
    const char *texto = "O rato roeu a roupa do rei";
    char *achado;

    achado = strchr(texto, 'r');
    if (achado != NULL) {
        printf("primeiro 'r' no indice %td\\n", achado - texto);
    }

    achado = strstr(texto, "roupa");
    if (achado != NULL) {
        printf("\\"roupa\\" comeca no indice %td\\n", achado - texto);
    }
    return 0;
}`,
        saida: `primeiro 'r' no indice 2
"roupa" comeca no indice 14`,
      },
      {
        titulo: 'Separar: strtok (e seus cuidados)',
        rotulo: 'strtok.c',
        paragrafos: [
          '<code>strtok</code> parte a string em "pedaços" usando delimitadores. Primeira chamada recebe a string e o conjunto de delimitadores; as chamadas seguintes recebem <code>NULL</code> e continuam de onde parou.',
          'Cuidados: (1) <em>destrói</em> a string original (insere \\0 nos divisores) — passe uma cópia; (2) <em>não é reentrante</em> — não use dentro de dois loops aninhados simultâneos; (3) usa estado global, então não há garantias em múltiplas threads.', 
        ],
        codigo: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char linha[] = "nome:email:idade:cidade";
    char *parte;

    parte = strtok(linha, ":");
    while (parte != NULL) {
        printf("-> %s\\n", parte);
        parte = strtok(NULL, ":");
    }
    return 0;
}`,
        saida: `-> nome
-> email
-> idade
-> cidade`,
      },
      {
        titulo: 'Formatar com segurança: snprintf',
        rotulo: 'snprintf.c',
        paragrafos: [
          '<code>snprintf(buf, tamanho, formato, ...)</code> é o printf para strings: formata direto no buffer, sempre com <code>\\0</code>, e devolve quantos caracteres <em>deveriam</em> ter sido escritos. Se o retorno for maior ou igual ao tamanho do buffer, houve truncamento.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    char buffer[32];
    int escritos;

    escritos = snprintf(buffer, sizeof buffer, "%s tem %d anos", "Leo", 23);
    if (escritos >= (int)sizeof buffer) {
        printf("String foi truncada.\\n");
    }
    printf("buffer = \\"%s\\" (%d caracteres)\\n", buffer, escritos);
    return 0;
}`,
        saida: `buffer = "Leo tem 23 anos" (15 caracteres)`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Crie um buffer <code>nome_completo[64]</code> e monte "Fulano da Silva" usando strcpy + strcat (ou strncpy/strncat com limites). Imprima o resultado e o tamanho com strlen.',
        dica: 'Comece com <code>strcpy(nome_completo, "Fulano")</code>, depois acrescente " da Silva".',
        solucao: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char nome_completo[64];

    strcpy(nome_completo, "Fulano");
    strncat(nome_completo, " da Silva",
            sizeof nome_completo - strlen(nome_completo) - 1);

    printf("%s (len %zu)\\n", nome_completo, strlen(nome_completo));
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Escreva uma função que substitui todas as ocorrências de um caractere por outro em uma string modificável, ex.: trocar todos os "a" por "@" em "banana". Imprima antes e depois.',
        dica: 'Percorra com ponteiro e <code>*p = novo</code> quando <code>*p == velho</code>.',
        solucao: `#include <stdio.h>

void substituir(char *s, char velho, char novo)
{
    for (; *s != '\\0'; s++) {
        if (*s == velho) {
            *s = novo;
        }
    }
}

int main(void)
{
    char fruta[] = "banana";

    printf("antes : %s\\n", fruta);
    substituir(fruta, 'a', '@');
    printf("depois: %s\\n", fruta);
    return 0;
}`,
        solucao_obs: 'A string precisa ser um array mutável, <em>jamais</em> um literal (T2.03).',
      },
      {
        nivel: 3,
        enunciado:
          'Conte as palavras de uma frase usando <code>strtok</code> com delimitadores espaço e tab. Teste com <code>"o rato roeu a roupa"</code>.',
        dica: 'Delimitadores: <code>" \\t"</code>. Cada pedaço devolvido não-NULO é uma palavra.',
        solucao: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char frase[] = "o rato roeu a roupa";
    int n = 0;

    char *palavra = strtok(frase, " \\t");
    while (palavra != NULL) {
        n++;
        palavra = strtok(NULL, " \\t");
    }

    printf("palavras: %d\\n", n);
    return 0;
}`,
        solucao_obs: 'Lembre-se: strtok modifica a string original — aqui está tudo bem, frase é uma cópia própria.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva um programa que usa <code>strstr</code> para achar a posição da primeira ocorrência de <code>"ca"</code> dentro de <code>"cachorro":</code> e imprime o índice; depois repita buscando algo que não existe (<code>"zz"</code>) e trate o NULL.',
        dica: 'Se <code>p = strstr(s, sub)</code>, o índice é <code>p - s</code>.',
        solucao: `#include <stdio.h>
#include <string.h>

int main(void)
{
    const char *frase = "cachorro";
    char *p;

    p = strstr(frase, "ca");
    if (p != NULL) {
        printf("'ca' em %td\\n", p - frase);
    }

    p = strstr(frase, "zz");
    if (p == NULL) {
        printf("'zz' nao encontrado\\n");
    }
    return 0;
}`,
        solucao_obs: 'Esperado: ca em 0 e mensagem de não encontrado. Note o uso de <code>%td</code> para a diferença de ponteiros (ptrdiff_t).',
      },
      {
        nivel: 4,
        enunciado:
          'Leia uma frase com fgets, corte a quebra de linha, use strtok para separar em palavras e imprima as palavras <strong>em ordem inversa</strong> da digitação. Dica: guarde as palavras num array de ponteiros <code>char *palavras[20]</code>.',
        dica: 'Cada token do strtok aponta para dentro do buffer; guarde o ponteiro, não copie.',
        solucao: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char frase[256];
    char *palavras[20];
    int n = 0;

    printf("Digite uma frase: ");
    if (fgets(frase, sizeof frase, stdin) == NULL) {
        return 1;
    }
    frase[strcspn(frase, "\\n")] = '\\0';

    char *token = strtok(frase, " ");
    while (token != NULL && n < 20) {
        palavras[n++] = token;
        token = strtok(NULL, " ");
    }

    printf("inverso: ");
    for (int i = n - 1; i >= 0; i--) {
        printf("%s ", palavras[i]);
    }
    printf("\\n");
    return 0;
}`,
        solucao_obs: 'Exemplo: "vou aprender c" sai "c aprender vou". O array palavras guarda ponteiros para dentro de frase (que o strtok fatiou).',
      },
    ],
    quiz: [
      {
        pergunta: 'O que <code>strncpy</code> <strong>não</strong> garante?',
        opcoes: [
          'Copia até n caracteres',
          'O \\0 final se a origem for longa ou passar dos n',
          'Que source seja válida',
          'Nada: strncpy garante tudo',
        ],
        correta: 1,
        explicacao: 'strncpy pode deixar a string sem \\0; por isso escrevemos <code>dest[n-1] = \'\\0\'</code> depois.',
      },
      {
        pergunta: 'Como <code>strcmp("abc", "abd")</code> se comporta?',
        opcoes: [
          'Retorna 0, são iguais',
          'Retorna um valor negativo (abc < abd)',
          'Retorna um valor positivo',
          'Gera erro de compilação',
        ],
        correta: 1,
        explicacao: 'Na comparação lexicográfica, \'c\' &lt; \'d\', então o retorno é negativo (geralmente -1 ou a diferença de bytes).',
      },
      {
        pergunta: 'Qual condição indica truncamento ao usar <code>int n = snprintf(buf, tam, ...)</code>?',
        opcoes: [
          'n == 0',
          'n < tam',
          'n >= tam',
          'n == tam - 1 sempre',
        ],
        correta: 2,
        explicacao: 'snprintf devolveo que escreveria; se n >= tam, algo foi cortado.',
      },
      {
        pergunta: 'Por que <code>strtok</code> não é reentrante?',
        opcoes: [
          'Porque usa estado interno global entre chamadas',
          'Porque modifica a fonte',
          'Porque é muito lenta',
          'Porque só aceita um delimitador',
        ],
        correta: 0,
        explicacao: 'A posição de continuação é guardada em uma variável global interna; loops/threads concorrentes quebram a lógica. Nas glibcs modernas prefira strtok_r/strtok_s.',
      },
      {
        pergunta: 'Qual função devolve um ponteiro para a primeira ocorrência de um caractere numa string?',
        opcoes: ['strstr', 'strchr', 'strspn', 'strlen'],
        correta: 1,
        explicacao: 'strchr busca um caractere; strstr busca uma substring.',
      },
    ],
    projeto: {
      titulo: 'Gravador de perfil de usuário',
      descricao:
        'Crie um programa que pergunta nome, e-mail e cidade (fgets), monta com strncpy/strncat/snprintf um "cartão" formatado, remove o @ do nome para gerar um login, e por fim conta palavras no nome completo. Combina copiar, concatenar, buscar e separar.',
      criterios: [
        'Todos os buffers com limites (strncpy/strncat/snprintf); nenhum estouro possível.',
        'Gera campo "login" removendo espaços e vírgulas do nome.',
        'Imprime o cartão formatado e a contagem de palavras.',
        'Compila com -Wall -Wextra sem avisos.',
      ],
    },
  },
  {
    trilha: '2',
    numero: '05',
    titulo: 'Alocação dinâmica de memória',
    subtitulo: 'heap vs stack, malloc, calloc, realloc, free e vazamentos',
    objetivo:
      'Pedir memória ao sistema no tempo de execução com malloc/calloc/realloc, devolver com free, e construir dados de tamanho desconhecido — listas que crescem e grades 2D — sem vazar memória.',
    prerequisitos: 'T2.02 e T2.04',
    duracao: '~40 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 12 (Dynamic Memory Allocation)',
      king: 'Capítulos 17.1–17.2 (Alocação dinâmica e ponteiros)',
      foco:
        'No Beej, a seção de malloc/calloc/realloc/free e o padrão "sempre confira o NULL". No King, repare na distinção entre stack (automática, limitada) e heap (dinâmica, controlada por você).',
    },
    secoes: [
      {
        titulo: 'Duas memórias: stack (automática) e heap (dinâmica)',
        rotulo: 'stack-heap',
        paragrafos: [
          '<strong>Stack</strong> é a memória automática: variáveis locais nascem quando a função começa e morrem ao fim dela. É rápida, mas tem tamanho fixo e limitado (a pilha de um programa típico é de alguns MB).',
          '<strong>Heap</strong> é a memória dinâmica: pedimos blocos ao sistema operacional com <code>malloc</code>, eles sobrevivem enquanto você não os devolver com <code>free</code>, e o tamanho só esbarra na RAM da máquina. Regra de ouro: <em>todo malloc/calloc/realloc que deu certo precisa de um free</em>.',
        ],
      },
      {
        titulo: 'malloc e a verificação de NULL',
        rotulo: 'malloc.c',
        paragrafos: [
          '<code>malloc(n)</code> devolve um endereço de n bytes (ou NULL se não conseguir). A forma idiomática é <code>malloc(n * sizeof *p)</code>: assim o tamanho do tipo segue o tipo do ponteiro, sem repetir o tipo. <strong>Sempre</strong> teste o retorno contra NULL antes de usar.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int n;
    int *v;

    printf("Quantos numeros? ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        return 1;
    }

    v = malloc((size_t)n * sizeof *v);
    if (v == NULL) {
        printf("Falha ao alocar.\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) {
        v[i] = i * i;
    }
    for (int i = 0; i < n; i++) {
        printf("%d%s", v[i], i == n - 1 ? "\\n" : " ");
    }

    free(v);
    return 0;
}`,
        saida: `Quantos numeros? 5
0 1 4 9 16`,
      },
      {
        titulo: 'calloc: malloc com zeros',
        rotulo: 'calloc.c',
        paragrafos: [
          '<code>calloc(n, tam)</code> aloca n blocos do tamanho dado e <strong>zera tudo</strong>. Já <code>malloc</code> devolve lixo de memória. O preço do zeramento é uma passada a mais pela CPU; escolha calloc quando precisar de zeros iniciais.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int n = 5;
    int *a = malloc((size_t)n * sizeof *a);
    int *b = calloc((size_t)n, sizeof *b);
    volatile int *va = a;   /* leitura "bruta": evita que o compilador assuma valor */

    if (a == NULL || b == NULL) {
        printf("Falha na alocacao.\\n");
        free(a);
        free(b);
        return 1;
    }

    for (int i = 0; i < n; i++) {
        printf("a[%d] = %8d   b[%d] = %d\\n", i, va[i], i, b[i]);
    }

    free(a);
    free(b);
    return 0;
}`,
        saida: `a[0] =        0   b[0] = 0
a[1] =        0   b[1] = 0
a[2] =        0   b[2] = 0
a[3] =        0   b[3] = 0
a[4] =        0   b[4] = 0

(esta execução caiu numa página zerada — coincidência. malloc não promete NADA: tente rodar o programa depois de um programa que lotou o heap e a[0..4] virarão lixo. calloc, ao contrário, garante zerado sempre)`,
      },
      {
        titulo: 'realloc: uma lista que cresce',
        rotulo: 'grow.c',
        paragrafos: [
          '<code>realloc(ptr, novo_tamanho)</code> tenta crescer/encolher o bloco, movendo-o se preciso. Ele devolve o novo endereço — <em>nunca</em> faça <code>p = realloc(p, ...)</code> sem usar uma variável intermediária (se realloc falhar e devolver NULL, você perde o ponteiro original).',
          'Padrão clássico de lista dinâmica: guardamos capacidade <code>cap</code> e contador <code>cont</code>; quando enchemos, dobramos a capacidade com realloc.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *numeros = NULL;
    int cont = 0;
    int cap = 0;
    int v;

    while (scanf("%d", &v) == 1) {
        if (cont == cap) {
            int novo_cap = cap == 0 ? 4 : cap * 2;
            int *novo = realloc(numeros, (size_t)novo_cap * sizeof *numeros);
            if (novo == NULL) {
                free(numeros);
                printf("Falha ao expandir.\\n");
                return 1;
            }
            numeros = novo;
            cap = novo_cap;
        }
        numeros[cont++] = v;
    }

    printf("%d numeros lidos:", cont);
    for (int i = 0; i < cont; i++) {
        printf(" %d", numeros[i]);
    }
    printf("\\n");

    free(numeros);
    return 0;
}`,
        saida: `> echo "7 2 9 1 0 5 3" | .\\grow.exe

7 numeros lidos: 7 2 9 1 0 5 3`,
      },
      {
        titulo: 'Grade 2D alocada: array de ponteiros',
        rotulo: 'grade.c',
        paragrafos: [
          'Um <code>int **</code> pode representar uma matriz de linhas variáveis: alocamos um vetor de ponteiros de linhas e, para cada linha, um vetor de colunas. A liberação é no sentido inverso: primeiro as linhas, depois o vetor de ponteiros.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int linhas = 3, cols = 4;
    int **grid;

    grid = malloc((size_t)linhas * sizeof *grid);
    if (grid == NULL) {
        return 1;
    }

    for (int i = 0; i < linhas; i++) {
        grid[i] = malloc((size_t)cols * sizeof *grid[i]);
        if (grid[i] == NULL) {
            for (int k = 0; k < i; k++) {
                free(grid[k]);
            }
            free(grid);
            return 1;
        }
    }

    for (int i = 0; i < linhas; i++) {
        for (int j = 0; j < cols; j++) {
            grid[i][j] = i * 10 + j;
        }
    }

    for (int i = 0; i < linhas; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%2d ", grid[i][j]);
        }
        printf("\\n");
    }

    for (int i = 0; i < linhas; i++) {
        free(grid[i]);
    }
    free(grid);
    return 0;
}`,
        saida: ` 0  1  2  3
10 11 12 13
20 21 22 23`,
      },
      {
        titulo: 'Array de strings alocadas',
        rotulo: 'array-strings.c',
        paragrafos: [
          'Um vetor de nomes em C é um <code>char *[]</code>: um array de ponteiros, cada um apontando para sua própria string (idealmente alocada). Cada ponteiro livre um free no final:',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    char *nomes[3];

    nomes[0] = malloc(16);
    nomes[1] = malloc(16);
    nomes[2] = malloc(16);
    if (nomes[0] == NULL || nomes[1] == NULL || nomes[2] == NULL) {
        printf("Falha ao alocar.\\n");
        return 1;
    }

    strcpy(nomes[0], "Ana");
    strcpy(nomes[1], "Bruno");
    strcpy(nomes[2], "Carolina");

    for (int i = 0; i < 3; i++) {
        printf("%s\\n", nomes[i]);
    }

    for (int i = 0; i < 3; i++) {
        free(nomes[i]);
    }
    return 0;
}`,
        saida: `Ana
Bruno
Carolina`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Aloque com malloc um vetor de 10 inteiros, preencha com os quadrados dos índices (0, 1, 4, 9, ...) e imprima. Confira o NULL e libere com free no fim.',
        dica: '<code>malloc(10 * sizeof *v)</code> e <code>v[i] = i * i</code>.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *v = malloc(10 * sizeof *v);
    if (v == NULL) {
        return 1;
    }

    for (int i = 0; i < 10; i++) {
        v[i] = i * i;
    }
    for (int i = 0; i < 10; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");

    free(v);
    return 0;
}`,
        solucao_obs: 'Esperado: 0 1 4 9 16 25 36 49 64 81.',
      },
      {
        nivel: 2,
        enunciado:
          'Use calloc para alocar um vetor de 6 inteiros, imprima os valores (devem ser zeros) e depois atribua e imprima de novo, mostrando a diferença antes/depois da escrita.',
        dica: 'calloc(n, sizeof *v) já deixa tudo em 0.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *v = calloc(6, sizeof *v);
    if (v == NULL) {
        return 1;
    }

    printf("antes:  ");
    for (int i = 0; i < 6; i++) printf("%d ", v[i]);
    printf("\\n");

    for (int i = 0; i < 6; i++) {
        v[i] = (i + 1) * 10;
    }

    printf("depois: ");
    for (int i = 0; i < 6; i++) printf("%d ", v[i]);
    printf("\\n");

    free(v);
    return 0;
}`,
        solucao_obs: 'calloc traz valores zerados; completa com malloc seria lixo.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva um programa que lê números do terminal com scanf (até EOF) guardando em um vetor dinâmico que dobra de capacidade (realloc). Ao final, imprima a média e quantos números foram lidos. Teste com: <code>4 0 7 9 5</code>.',
        dica: 'Reuse o padrão cap/cont do exemplo grow.c.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *v = NULL;
    int cont = 0, cap = 0;
    int x;
    long soma = 0;

    while (scanf("%d", &x) == 1) {
        if (cont == cap) {
            int novo_cap = cap == 0 ? 4 : cap * 2;
            int *nv = realloc(v, (size_t)novo_cap * sizeof *nv);
            if (nv == NULL) {
                free(v);
                printf("Falha ao expandir.\\n");
                return 1;
            }
            v = nv;
            cap = novo_cap;
        }
        v[cont++] = x;
        soma += x;
    }

    if (cont > 0) {
        printf("media de %d numeros = %.2f\\n", cont, (double)soma / cont);
    }
    free(v);
    return 0;
}`,
        solucao_obs: 'Com a sequência 4 0 7 9 5, espera-se média 5.00 de 5 números (4+0+7+9+5=25).',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva a função <code>char *criar_saudacao(const char *nome)</code> que aloca uma string com o resultado de <code>snprintf</code>: "Ola, NOME!" e a devolve. No main, chame, imprima e dê free. Teste com "Ana" e "programador".',
        dica: 'Dentro, aloque um buffer do tamanho 8 + strlen(nome), monte com snprintf e devolva o ponteiro.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *criar_saudacao(const char *nome)
{
    size_t tam = 8 + strlen(nome);
    char *s = malloc(tam);
    if (s == NULL) {
        return NULL;
    }
    snprintf(s, tam, "Ola, %s!", nome);
    return s;
}

int main(void)
{
    char *a = criar_saudacao("Ana");
    char *b = criar_saudacao("programador");

    printf("%s\\n", a);
    printf("%s\\n", b);

    free(a);
    free(b);
    return 0;
}`,
        solucao_obs: 'A função devolve memória do heap — quem chama é responsável pelo free.',
      },
      {
        nivel: 4,
        enunciado:
          'Crie uma grade <code>linhas × cols</code> alocada dinamicamente (int**), preencha cada célula com o produto linha×col, e imprima a soma de todos os elementos, além da grade. Aloque com linhas e cols obtidos do usuário via scanf (teste com 3 e 4).',
        dica: 'Libre cada linha primeiro e o vetor de ponteiros por último; confira NULL em cada malloc.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int linhas, cols;
    int **grid;
    long soma = 0;

    printf("linhas e colunas: ");
    if (scanf("%d %d", &linhas, &cols) != 2 || linhas <= 0 || cols <= 0) {
        return 1;
    }

    grid = malloc((size_t)linhas * sizeof *grid);
    if (grid == NULL) {
        return 1;
    }
    for (int i = 0; i < linhas; i++) {
        grid[i] = malloc((size_t)cols * sizeof *grid[i]);
        if (grid[i] == NULL) {
            for (int k = 0; k < i; k++) free(grid[k]);
            free(grid);
            return 1;
        }
    }

    for (int i = 0; i < linhas; i++) {
        for (int j = 0; j < cols; j++) {
            grid[i][j] = i * j;
            soma += grid[i][j];
        }
    }

    for (int i = 0; i < linhas; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%2d ", grid[i][j]);
        }
        printf("\\n");
    }
    printf("soma = %ld\\n", soma);

    for (int i = 0; i < linhas; i++) free(grid[i]);
    free(grid);
    return 0;
}`,
        solucao_obs: 'Grade 3×4 preenchida com i*j tem soma 18 (0+0+0+0 + 0+1+2+3 + 0+2+4+6).',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual função devolve memória ao sistema?',
        opcoes: ['malloc', 'free', 'calloc', 'realloc'],
        correta: 1,
        explicacao: 'free(p) devolve o bloco apontado por um malloc/calloc/realloc anterior.',
      },
      {
        pergunta: 'Se <code>malloc</code> não conseguir reservar memória, ele devolve...',
        opcoes: ['0', 'NULL', 'malloc(0)', 'um endereço da ROM'],
        correta: 1,
        explicacao: 'Malloc devolve NULL em falha. Por isso sempre conferimos <code>if (p == NULL)</code>.',
      },
      {
        pergunta: 'Por que usamos variável intermediária em <code>realloc</code>?',
        opcoes: [
          'Não é preciso, realloc é infalível',
          'Porque se realloc falhar, devolver NULL e o ponteiro original se perde',
          'Porque realloc troca de thread',
          'Porque realloc só funciona com ponteiros globais',
        ],
        correta: 1,
        explicacao: 'Se fizermos p = realloc(p,...) e ele falhar, p vira NULL e o bloco original fica sem ponteiro (leak).',
      },
      {
        pergunta: 'Qual diferença entre malloc e calloc?',
        opcoes: [
          'malloc é mais rápido; calloc zera o bloco',
          'calloc não aceita NULL',
          'malloc só aloca em stack',
          'Nenhuma, são sinônimos',
        ],
        correta: 0,
        explicacao: 'calloc(n, tam) aloca e preenche com zeros; malloc não inicializa.',
      },
      {
        pergunta: 'O que é um "vazamento de memória" (memory leak)?',
        opcoes: [
          'Programa crasha ao alocar',
          'Alocar sem free: blocos ficam presos até o programa terminar',
          'Usar malloc dentro de loops',
          'o stack transborda para o heap',
        ],
        correta: 1,
        explicacao: 'Todo malloc sem free correspondente "vaza" — memoria inutilizada mas reservada, acumulando durante a execução.',
      },
    ],
  },
  {
    trilha: '2',
    numero: '06',
    titulo: 'Structs',
    subtitulo: 'agrupando dados: declaração, . e ->, cópia, arrays de structs e padding',
    objetivo:
      'Criar tipos de dado compostos com struct, inicializá-los (inclusive designated), acessar campos com . e ->, entender passagem por valor vs por ponteiro, e saber que comparar structs exige comparação campo a campo.',
    prerequisitos: 'T2.01, T2.03 e T2.05',
    duracao: '~40 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 8 (Structs)',
      king: 'Capítulo 16 (Structures, Unions, and Enumerations)',
      foco:
        'No Beej, inicialização e acesso a campos, structs como parâmetros/retorno e typed safe. No King, fique atento à discussão de padding/bytes (as regras por trás do sizeof) na seção 16.',
    },
    secoes: [
      {
        titulo: 'O que é uma struct',
        rotulo: 'pessoa.c',
        paragrafos: [
          'Uma <strong>struct</strong> agrupa várias variáveis relacionadas em um único "objeto", que pode ser copiado, passado a funções e armazenado em arrays. A sintaxe declara o <em>molde</em> (tipo) e depois criamos variáveis do tipo.',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

struct Pessoa {
    char nome[50];
    int idade;
    float altura;
};

int main(void)
{
    struct Pessoa p;

    p.idade = 30;
    p.altura = 1.75f;
    strcpy(p.nome, "Marina");

    printf("nome: %s\\n", p.nome);
    printf("idade: %d\\n", p.idade);
    printf("altura: %.2f\\n", p.altura);
    return 0;
}`,
        saida: `nome: Marina
idade: 30
altura: 1.75`,
      },
      {
        titulo: 'Inicializadores e designated',
        rotulo: 'inicial.c',
        paragrafos: [
          'Como arrays, structs podem ser inicializadas por lista <code>{...}</code> na ordem dos campos. C99 adicionou os <em>designated initializers</em>: <code>.campo = valor</code>, que permitem inicializar fora de ordem e deixam o código autoexplicativo.',
        ],
        codigo: `#include <stdio.h>

struct Pessoa {
    char nome[50];
    int idade;
    float altura;
};

int main(void)
{
    struct Pessoa a = {"Ana", 25, 1.65f};
    struct Pessoa b = {.altura = 1.80f, .idade = 33, .nome = "Bruno"};

    printf("%s, %d anos, %.2f m\\n", a.nome, a.idade, a.altura);
    printf("%s, %d anos, %.2f m\\n", b.nome, b.idade, b.altura);
    return 0;
}`,
        saida: `Ana, 25 anos, 1.65 m
Bruno, 33 anos, 1.80 m`,
      },
      {
        titulo: 'Passagem por valor vs por ponteiro (->)',
        rotulo: 'passagem.c',
        paragrafos: [
          'Por padrão, uma struct entra na função <strong>por cópia</strong>: alterar o parâmetro não muda o original. Para modificar o original passamos um ponteiro e usamos o operador <strong><code>-&gt;</code></strong> (que é açúcar para <code>(*p).campo</code>). Structs grandes também são passadas por ponteiro por eficiência.',
        ],
        codigo: `#include <stdio.h>

struct Pessoa {
    char nome[50];
    int idade;
};

void aniversario_valor(struct Pessoa p)      /* muda a copia */
{
    p.idade++;
}

void aniversario_ponteiro(struct Pessoa *p)  /* muda o original */
{
    p->idade++;
}

int main(void)
{
    struct Pessoa maria = {"Maria", 20};

    aniversario_valor(maria);
    printf("depois de valor:    %d\\n", maria.idade);

    aniversario_ponteiro(&maria);
    printf("depois de ponteiro: %d\\n", maria.idade);
    return 0;
}`,
        saida: `depois de valor:    20
depois de ponteiro: 21`,
      },
      {
        titulo: 'Cópia com = e arrays de structs',
        rotulo: 'turma.c',
        paragrafos: [
          'Structs se copiam inteiras com <code>=</code> (campo a campo, incluindo os arrays internos). E assim como int ou char, structs vivem confortavelmente em arrays — o que permite a "tabela" clássica de cadastro:',
        ],
        codigo: `#include <stdio.h>

struct Aluno {
    char nome[40];
    int nota;
};

int main(void)
{
    struct Aluno turma[4] = {
        {"Ana", 8},
        {"Bruno", 6},
        {"Carla", 9},
        {"Diego", 7},
    };
    int melhor = 0;

    for (int i = 1; i < 4; i++) {
        if (turma[i].nota > turma[melhor].nota) {
            melhor = i;
        }
    }

    printf("Melhor nota: %s com %d\\n", turma[melhor].nome, turma[melhor].nota);
    return 0;
}`,
        saida: `Melhor nota: Carla com 9`,
      },
      {
        titulo: 'Comparar structs é campo a campo; e o padding',
        rotulo: 'padding.c',
        paragrafos: [
          'Não existe <code>a == b</code> entre structs (dica: por causa do padding!). A arquitetura alinha campos em fronteiras de 4/8 bytes, deixando "buracos" entre eles — comparar os bytes brutos com <code>memcmp</code> compararia lixo. Por isso comparamos campo a campo.',
          '<code>offsetof</code> (de <code>&lt;stddef.h&gt;</code>) mostra onde cada campo mora, e a ordem dos campos muda o tamanho total:',
        ],
        codigo: `#include <stdio.h>
#include <stddef.h>

struct Compacto {
    char a;
    char b;
    int c;
};

struct Folgado {
    char a;
    int c;
    char b;
};

int main(void)
{
    printf("sizeof(struct Compacto) = %zu\\n", sizeof(struct Compacto));
    printf("offsetof a=%zu b=%zu c=%zu\\n",
           offsetof(struct Compacto, a),
           offsetof(struct Compacto, b),
           offsetof(struct Compacto, c));

    printf("sizeof(struct Folgado) = %zu\\n", sizeof(struct Folgado));
    printf("offsetof a=%zu c=%zu b=%zu\\n",
           offsetof(struct Folgado, a),
           offsetof(struct Folgado, c),
           offsetof(struct Folgado, b));
    return 0;
}`,
        saida: `sizeof(struct Compacto) = 8
offsetof a=0 b=1 c=4
sizeof(struct Folgado) = 12
offsetof a=0 c=4 b=8`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Declare uma struct <code>Produto</code> com <code>nome[30]</code>, <code>preco</code> (double) e <code>estoque</code> (int). Crie duas variáveis inicializadas por lista e imprima todas as informações. Depois baixe o preço da segunda em 10%.',
        dica: 'Acesse com <code>p.preco</code> etc. para modificar um campo, basta atribuir.',
        solucao: `#include <stdio.h>

struct Produto {
    char nome[30];
    double preco;
    int estoque;
};

int main(void)
{
    struct Produto a = {"Arroz", 22.50, 40};
    struct Produto b = {"Feijao", 9.90, 15};

    printf("%s: R$ %.2f (estoque %d)\\n", a.nome, a.preco, a.estoque);
    printf("%s: R$ %.2f (estoque %d)\\n", b.nome, b.preco, b.estoque);

    b.preco *= 0.90;   /* desconto de 10%% */
    printf("com desconto: %s: R$ %.2f\\n", b.nome, b.preco);
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Escreva a versão por valor e a versão por ponteiro de uma função <code>aplicar_cupom(struct Produto p/struct Produto *p, double desconto)</code> e mostre no main que a versão por valor não altera o original e a por ponteiro altera.',
        dica: 'No ponteiro use <code>p-&gt;preco *= (1 - desconto)</code>.',
        solucao: `#include <stdio.h>

struct Produto {
    char nome[30];
    double preco;
};

void cupom_valor(struct Produto p, double desconto)
{
    p.preco *= 1.0 - desconto;
}

void cupom_ponteiro(struct Produto *p, double desconto)
{
    p->preco *= 1.0 - desconto;
}

int main(void)
{
    struct Produto camiseta = {"Camiseta", 50.0};

    cupom_valor(camiseta, 0.20);
    printf("apos por valor:   %.2f\\n", camiseta.preco);

    cupom_ponteiro(&camiseta, 0.20);
    printf("apos por ponteiro: %.2f\\n", camiseta.preco);
    return 0;
}`,
        solucao_obs: 'Esperado: 50.00 (o valor não muda na cópia) e depois 40.00.',
      },
      {
        nivel: 3,
        enunciado:
          'Crie um array de structs <code>Aluno</code> (nome e nota) e escreva uma função <code>buscar(struct Aluno turma[], int n, const char *nome)</code> que devolve o índice do aluno ou -1 se não existir. Teste procurando "Carla" (deve achar) e "Zeca" (não deve).',
        dica: 'Compare com <code>strcmp</code>.',
        solucao: `#include <stdio.h>
#include <string.h>

struct Aluno {
    char nome[40];
    int nota;
};

int buscar(struct Aluno turma[], int n, const char *nome)
{
    for (int i = 0; i < n; i++) {
        if (strcmp(turma[i].nome, nome) == 0) {
            return i;
        }
    }
    return -1;
}

int main(void)
{
    struct Aluno turma[3] = {
        {"Ana", 8},
        {"Bruno", 6},
        {"Carla", 9},
    };

    int i = buscar(turma, 3, "Carla");
    printf("Carla no indice %d\\n", i);

    i = buscar(turma, 3, "Zeca");
    printf("Zeca no indice %d\\n", i);
    return 0;
}`,
        solucao_obs: 'Esperado: Carla no índice 2 e Zeca no índice -1.',
      },
      {
        nivel: 3,
        enunciado:
          'Crie uma struct <code>Pessoa</code> com um campo <code>nascimento</code> que é outra struct <code>Data</code> (dia, mes, ano). Inicialize com designated (ex.: nascimento .ano = 1999) e imprima no formato dd/mm/aaaa.',
        dica: 'Acesso aninhado: <code>p.nascimento.ano</code>.',
        solucao: `#include <stdio.h>

struct Data {
    int dia;
    int mes;
    int ano;
};

struct Pessoa {
    char nome[40];
    struct Data nascimento;
};

int main(void)
{
    struct Pessoa ana = {
        .nome = "Ana",
        .nascimento = {.dia = 10, .mes = 3, .ano = 1999},
    };

    printf("%s nasceu em %02d/%02d/%04d\\n",
           ana.nome, ana.nascimento.dia,
           ana.nascimento.mes, ana.nascimento.ano);
    return 0;
}`,
      },
      {
        nivel: 4,
        enunciado:
          'Ordene um array de <code>Aluno</code> por nota (decrescente) com bubble sort, comparando <code>nota</code>. Imprima o ranking antes e depois. A ordenação deve ser estável no nome em caso de empate.',
        dica: 'Compare vizinhos com <code>if (turma[j].nota &lt; turma[j+1].nota)</code> e troque a struct inteira com uma variável temporária do tipo struct.',
        solucao: `#include <stdio.h>

struct Aluno {
    char nome[40];
    int nota;
};

int main(void)
{
    struct Aluno turma[5] = {
        {"Ana", 8}, {"Bruno", 6}, {"Carla", 9},
        {"Diego", 7}, {"Elisa", 8},
    };

    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 4 - i; j++) {
            if (turma[j].nota < turma[j + 1].nota) {
                struct Aluno tmp = turma[j];
                turma[j] = turma[j + 1];
                turma[j + 1] = tmp;
            }
        }
    }

    printf("ranking\\n");
    for (int i = 0; i < 5; i++) {
        printf("%d. %s (%d)\\n", i + 1, turma[i].nome, turma[i].nota);
    }
    return 0;
}`,
        solucao_obs: 'A struct inteira é copiada na troca (autorizada pelo =). Saída: Carla(9), Ana(8), Elisa(8), Diego(7), Bruno(6).',
      },
    ],
    quiz: [
      {
        pergunta: 'O que é uma struct em C?',
        opcoes: [
          'Uma função que guarda dados',
          'Um tipo que agrupa várias variáveis relacionadas',
          'Um ponteiro especial',
          'Uma biblioteca padrão',
        ],
        correta: 1,
        explicacao: 'Uma struct define um novo tipo que reúne campos de tipos possivelmente diferentes.',
      },
      {
        pergunta: 'Qual operador acessa um campo a partir de um ponteiro para struct?',
        opcoes: ['.', '->', '>>', '*'],
        correta: 1,
        explicacao: '<code>p-&gt;campo</code> é açúcar para <code>(*p).campo</code>.',
      },
      {
        pergunta: 'Por que não usamos <code>a == b</code> para comparar structs?',
        opcoes: [
          'C não tem esse operador para structs — a comparação é feita campo a campo',
          'Porque dá warning lento',
          'Porque structs não podem ser comparadas mesmo campo a campo',
          'Porque o operador é <> ',
        ],
        correta: 0,
        explicacao: 'O C não define == para structs. Comparamos campo a campo (o padding tornaria memcmp enganoso).',
      },
      {
        pergunta: 'Passar uma struct por valor a uma função...',
        opcoes: [
          'modifica o original automaticamente',
          'copia a struct; alterações não refletem fora',
          'gera erro de compilação',
          'é obrigatório para structs pequenas',
        ],
        correta: 1,
        explicacao: 'Parâmetros por valor são cópias; para alterar o original, passe um ponteiro.',
      },
      {
        pergunta: 'O que é padding em uma struct?',
        opcoes: [
          'Um método de compactação automático',
          'Bytes de alinhamento inseridos entre campos',
          'a soma dos campos',
          'o equivalente ao \'\\0\' de strings',
        ],
        correta: 1,
        explicacao: 'A arquitetura alinha os campos; o compilador insere bytes "buracos", o que afeta o sizeof.',
      },
    ],
    projeto: {
      titulo: 'Cadastro de alunos',
      descricao:
        'Construa um mini-cadastro com struct <code>Aluno</code> (nome, nota1, nota2, media) e um array fixo de até 30 alunos. O programa apresenta um menu: (1) incluir aluno (lê nome e notas, calcula média), (2) listar, (3) buscar por nome, (4) melhor e pior média, (5) encerrar. Reuse funções com ponteiros e arrays de structs dos módulos anteriores.',
      criterios: [
        'Menu funcionando com switch e enum (T2.07 já à frente — pode usar int por enquanto).',
        'Cálculo de média armazenado no próprio struct.',
        'Busca por nome retornando "não encontrado" quando não existir.',
        'Nenhum buffer estourado (fgets + limites).',
        'Compila com -Wall -Wextra sem avisos.',
      ],
    },
  },
  {
    trilha: '2',
    numero: '07',
    titulo: 'typedef, enum e union',
    subtitulo: 'apelidos de tipo, constantes nomeadas e memória compartilhada',
    objetivo:
      'Criar apelidos legíveis para tipos com typedef, constantes com nomes usando enum, e entender union — o tipo que compartilha o mesmo espaço de memória para interpretações diferentes.',
    prerequisitos: 'T2.06',
    duracao: '~40 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulos 8–10 (structs, typedefs) e a seção sobre enum/union',
      king: 'Capítulos 16.4–16.6 (typedef, unions, enumerations)',
      foco:
        'No King, 16.4 (typedef), 16.5 (unions) e 16.6 (enumerations): foque em valores implícitos do enum e no compartilhamento de memória do union.',
    },
    secoes: [
      {
        titulo: 'typedef: um apelido para o tipo',
        rotulo: 'typedef.c',
        paragrafos: [
          '<code>typedef</code> cria um <strong>apelido</strong> — não um tipo novo, apenas outro nome. Embora seja possível usar os nomes originais, apelidos como <code>Pessoa</code>, <code>Idade</code> ou <code>int32_t</code> deixam o código mais legível e facilitam mudanças futuras.',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

typedef int Idade;

typedef struct {
    char nome[50];
    int idade;
} Pessoa;

int main(void)
{
    Idade i = 42;
    Pessoa p;

    p.idade = i;
    strcpy(p.nome, "Jose");

    printf("%s tem %d anos\\n", p.nome, p.idade);
    return 0;
}`,
        saida: `Jose tem 42 anos`,
      },
      {
        titulo: 'enum: constantes com nomes',
        rotulo: 'enum.c',
        paragrafos: [
          'Um <strong>enum</strong> cria constantes inteiras nomeadas. Sem valores explícitos, os membros valem 0, 1, 2, ... na ordem. Com <code>= valor</code> forçamos valores arbitrários (inclusive negativos). Útil para estados, tipos e opções.',
        ],
        codigo: `#include <stdio.h>

enum Cor { VERMELHO, VERDE, AZUL };

int main(void)
{
    enum Cor escolha = VERDE;

    printf("VERMELHO = %d\\n", VERMELHO);
    printf("VERDE    = %d\\n", VERDE);
    printf("AZUL     = %d\\n", AZUL);
    printf("escolha  = %d\\n", escolha);

    if (escolha == VERDE) {
        printf("voce escolheu verde.\\n");
    }
    return 0;
}`,
        saida: `VERMELHO = 0
VERDE    = 1
AZUL     = 2
escolha  = 1
voce escolheu verde.`,
      },
      {
        titulo: 'enum com valores explícitos',
        rotulo: 'enum-valores.c',
        paragrafos: [
          'Valores explícitos são comuns em protocolos, máscaras e códigos de estado. Aqui podemos atribuir livremente os valores (inclusive negativos):',
        ],
        codigo: `#include <stdio.h>

enum Estado {
    DESLIGADO = 0,
    LIGADO = 1,
    SUSPENSO = 5,
    INVALIDO = -1
};

int main(void)
{
    printf("DESLIGADO=%d LIGADO=%d SUSPENSO=%d INVALIDO=%d\\n",
           DESLIGADO, LIGADO, SUSPENSO, INVALIDO);
    return 0;
}`,
        saida: `DESLIGADO=0 LIGADO=1 SUSPENSO=5 INVALIDO=-1`,
      },
      {
        titulo: 'union: espaço compartilhado',
        rotulo: 'union.c',
        paragrafos: [
          'Uma <strong>union</strong> faz todos os campos <em>compartilharem o mesmo endereço</em>. O tamanho da union é o do maior campo. Escrever em um campo invalida a leitura dos outros — ler um campo "errado" é lixo (o dado bruto reinterpretado).',
          'Em baixo nível, unions são usadas p/ reinterpretação de bytes, protocolos, variantes de valor único e registradores de hardware.',
        ],
        codigo: `#include <stdio.h>

union Dado {
    int i;
    float f;
    unsigned char bytes[4];
};

int main(void)
{
    union Dado d;

    d.i = 0x41424344;   /* bytes 'D','C','B','A' em little-endian */

    printf("sizeof(union Dado) = %zu\\n", sizeof(union Dado));
    printf("d.i    = 0x%08X\\n", d.i);
    printf("bytes  = %c %c %c %c\\n",
           d.bytes[0], d.bytes[1], d.bytes[2], d.bytes[3]);
    printf("d.f    = %g (lixo: union guarda um int aqui)\\n", d.f);
    return 0;
}`,
        saida: `sizeof(union Dado) = 4
d.i    = 0x41424344
bytes  = D C B A
d.f    = 12.1414 (lixo: union guarda um int aqui)`,
      },
      {
        titulo: 'enum + switch: menus legíveis',
        rotulo: 'menu.c',
        paragrafos: [
          'Combinar enum com switch torna os menus quase auto-documentados. O <code>default</code> captura entradas inválidas:',
        ],
        codigo: `#include <stdio.h>

typedef enum {
    OP_SAIR,
    OP_SOMAR,
    OP_SUBTRAIR,
    OP_MULTIPLICAR
} Opcao;

int main(void)
{
    Opcao o;
    int a = 6, b = 4;
    char linha[32];

    printf("Menu (0 sair, 1 somar, 2 subtrair, 3 multiplicar): ");
    if (fgets(linha, sizeof linha, stdin) == NULL) {
        return 1;
    }
    o = (Opcao)(linha[0] - '0');

    switch (o) {
    case OP_SOMAR:
        printf("%d + %d = %d\\n", a, b, a + b);
        break;
    case OP_SUBTRAIR:
        printf("%d - %d = %d\\n", a, b, a - b);
        break;
    case OP_MULTIPLICAR:
        printf("%d * %d = %d\\n", a, b, a * b);
        break;
    case OP_SAIR:
    default:
        printf("Tchau!\\n");
        break;
    }
    return 0;
}`,
        saida: `> echo 2 | .\\menu.exe
Menu (0 sair, 1 somar, 2 subtrair, 3 multiplicar): 6 - 4 = 2`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Crie <code>typedef struct { char nome[40]; int matricula; } Aluno;</code>. Inicialize dois alunos e imprima nome + matrícula. Use o typedef em todas as declarações.',
        dica: 'Com typedef você escreve <code>Aluno a;</code> — sem "struct" na frente.',
        solucao: `#include <stdio.h>
#include <string.h>

typedef struct {
    char nome[40];
    int matricula;
} Aluno;

int main(void)
{
    Aluno a = {"Ana", 1001};
    Aluno b;
    strcpy(b.nome, "Bruno");
    b.matricula = 1002;

    printf("%s - mat %d\\n", a.nome, a.matricula);
    printf("%s - mat %d\\n", b.nome, b.matricula);
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Defina um enum <code>DiaSemana</code> (segunda a domingo, começando em 1). Imprima os valores e atribua DOMINGO a uma variável e mostre que vale 7.',
        dica: 'Comece com <code>enum DiaSemana { SEGUNDA = 1, TERCA, ... }</code>.',
        solucao: `#include <stdio.h>

enum DiaSemana {
    SEGUNDA = 1,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO,
    DOMINGO
};

int main(void)
{
    enum DiaSemana hoje = DOMINGO;

    printf("SEGUNDA=%d SEXTA=%d DOMINGO=%d\\n", SEGUNDA, SEXTA, DOMINGO);
    printf("hoje vale %d\\n", hoje);
    return 0;
}`,
        solucao_obs: 'Como SEGUNDA = 1, os demais vão 2..7 automaticamente.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva a função <code>const char *nome_dia(enum DiaSemana d)</code> que devolve o nome do dia ("Segunda-feira" ... ) via switch. Trate valores fora do intervalo como "Invalido". Teste com QUARTA, DOMINGO e o valor 99.',
        dica: 'Cada case retorna um literal; <code>default</code> retorna "Invalido".',
        solucao: `#include <stdio.h>

enum DiaSemana { SEGUNDA = 1, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO };

const char *nome_dia(enum DiaSemana d)
{
    switch (d) {
    case SEGUNDA: return "Segunda-feira";
    case TERCA:   return "Terca-feira";
    case QUARTA:  return "Quarta-feira";
    case QUINTA:  return "Quinta-feira";
    case SEXTA:   return "Sexta-feira";
    case SABADO:  return "Sabado";
    case DOMINGO: return "Domingo";
    default:      return "Invalido";
    }
}

int main(void)
{
    printf("%s\\n", nome_dia(QUARTA));
    printf("%s\\n", nome_dia(DOMINGO));
    printf("%s\\n", nome_dia(99));
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Use uma union para imprimir os 4 bytes de um <code>float</code> como números hex, mostrando o conteúdo do número 1.0f. Explique por que a ordem parece "invertida" (little-endian).',
        dica: 'Se <code>u.f = 1.0f</code>, então <code>u.bytes[i]</code> mostra cada byte. 1.0f = 0x3F800000.',
        solucao: `#include <stdio.h>

union VisorFloat {
    float f;
    unsigned char bytes[4];
};

int main(void)
{
    union VisorFloat u;
    u.f = 1.0f;

    printf("float 1.0f = bytes ");
    for (int i = 0; i < 4; i++) {
        printf("%02X ", u.bytes[i]);
    }
    printf("\\n");
    return 0;
}`,
        solucao_obs: 'Esperado algo como "00 00 80 3F": em little-endian o byte menos significativo vem primeiro (0x3F800000 de trás para frente).',
      },
      {
        nivel: 4,
        enunciado:
          'Monte um menu de capitu com enum + switch que lê a opção com fgets/scanf e executa: 1 = converter Fahrenheit para Celsius, 2 = Celsius para Fahrenheit, 3 = sair. Valores de teste: 98.6F e 30C. Trate opções inválidas com default.',
        dica: 'fgets + sscanf na linha lida é mais robusto que scanf direto.',
        solucao: `#include <stdio.h>

typedef enum { OP_SAIR = 3, OP_F_PARA_C = 1, OP_C_PARA_F = 2 } Opcao;

int main(void)
{
    char linha[32];
    double valor;

    printf("1. F->C   2. C->F   3. sair\\nOpcao e valor: ");
    if (fgets(linha, sizeof linha, stdin) == NULL) {
        return 1;
    }

    int op;
    if (sscanf(linha, "%d %lf", &op, &valor) != 2) {
        printf("Entrada invalida\\n");
        return 1;
    }

    switch ((Opcao)op) {
    case OP_F_PARA_C:
        printf("%.2f F = %.2f C\\n", valor, (valor - 32.0) * 5.0 / 9.0);
        break;
    case OP_C_PARA_F:
        printf("%.2f C = %.2f F\\n", valor, valor * 9.0 / 5.0 + 32.0);
        break;
    case OP_SAIR:
        printf("Ate logo\\n");
        break;
    default:
        printf("Opcao invalida\\n");
        break;
    }
    return 0;
}`,
        solucao_obs: 'Com "2 30": sai 86.00 F. Com "1 98.6": sai 37.00 C.',
      },
    ],
    quiz: [
      {
        pergunta: 'O que faz <code>typedef</code>?',
        opcoes: [
          'Cria um novo tipo de verdade',
          'Cria um apelido para um tipo já existente',
          'Aloca memória',
          'Compara dois tipos',
        ],
        correta: 1,
        explicacao: 'typedef só dá outro nome; por baixo é o mesmo tipo.',
      },
      {
        pergunta: 'Sem valores explícitos, <code>enum Cor {A, B, C}</code> define A, B, C como...',
        opcoes: ['1, 2, 3', '0, 1, 2', 'valores aleatórios', 'símbolos sem valor'],
        correta: 1,
        explicacao: 'Enums sem inicialização valem 0, 1, 2, ... na ordem de declaração.',
      },
      {
        pergunta: 'O que é característico de uma union?',
        opcoes: [
          'Todos os campos têm espaço próprio',
          'Todos os campos compartilham o mesmo endereço de memória',
          'Só pode ter um campo',
          'É igual a uma struct',
        ],
        correta: 1,
        explicacao: 'A union sobrepõe os campos; escrever um invalida a leitura dos outros.',
      },
      {
        pergunta: 'Qual o tamanho em bytes de uma union com um char e um int?',
        opcoes: ['5', 'o maior (o int: 4)', 'a soma (5)', '1'],
        correta: 1,
        explicacao: 'A union ocupa o tamanho do maior membro — todos compartilham o mesmo espaço.',
      },
      {
        pergunta: 'Para que servem os enums em menus?',
        opcoes: [
          'Para acelerar o compilador',
          'Para dar nomes legíveis às opções e estados',
          'Para obrigar o switch',
          'Para gerar números aleatórios',
        ],
        correta: 1,
        explicacao: 'Constantes nomeadas deixam o código claro e segui-lo de mudanças de números mágicos.',
      },
    ],
  },
  {
    trilha: '2',
    numero: '08',
    titulo: 'O pré-processador',
    subtitulo: '#include, #define, macros com parênteses, #ifdef e guardas',
    objetivo:
      'Entender o que o pré-processador faz antes da compilação, escrever macros seguras (com os parênteses!), usar condicionais de compilação e guardas de inclusão, e reconhecer as armadilhas clássicas.',
    prerequisitos: 'T2.01 a T2.07',
    duracao: '~45 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 19 (The Preprocessor)',
      king: 'Capítulo 14 (The Preprocessor)',
      foco:
        'No King, o capítulo 14 inteiro é dedicado ao pré-processador: dedique atenção às macros com argumentos e às condicionais #if/#ifdef. No Beej, veja as macros embutidas e os exemplos práticos.',
    },
    secoes: [
      {
        titulo: '#include, #define e o "repeat" do texto',
        rotulo: 'macros.c',
        paragrafos: [
          'O pré-processador roda <strong>antes</strong> do compilador e é, na prática, um "substituidor de texto". <code>#include</code> cola o conteúdo de um arquivo (<code>&lt;...&gt;</code> procura em diretórios de sistema; <code>"..."</code> procura na pasta atual). <code>#define</code> cria macros — constantes ou "mini-funções" textuais.',
          '<strong>Parênteses, parênteses, parênteses:</strong> toda macro com argumentos envolve cada parâmetro e o corpo inteiro em parênteses; sem isso a expansão textual produz erros sutis.',
        ],
        codigo: `#include <stdio.h>

#define PI 3.14159
#define AREA_CIRCULO(r) (PI * (r) * (r))
#define SOMA(a, b) ((a) + (b))

int main(void)
{
    printf("PI = %.5f\\n", PI);
    printf("area de raio 2 = %.5f\\n", AREA_CIRCULO(2));
    printf("soma(3, 4) = %d\\n", SOMA(3, 4));
    printf("com parenteses: SOMA(2, 3) * 2 = %d\\n", SOMA(2, 3) * 2);
    return 0;
}`,
        saida: `PI = 3.14159
area de raio 2 = 12.56636
soma(3, 4) = 7
com parenteses: SOMA(2, 3) * 2 = 10`,
      },
      {
        titulo: 'Macros embutidas: __func__, __LINE__, __FILE__, __DATE__',
        rotulo: 'log-macro.c',
        paragrafos: [
          'O pré-processador oferece macros automáticas: <code>__FILE__</code> é o nome do arquivo, <code>__LINE__</code> o número da linha, <code>__func__</code> a função atual (isso daqui do compilador) e <code>__DATE__</code>/<code>__TIME__</code> quando foi compilado. Excelente para logs leves:',
        ],
        codigo: `#include <stdio.h>

#define LOG(msg) printf("[%s:%d] %s\\n", __func__, __LINE__, msg)

int processar(void)
{
    LOG("processando...");
    return 0;
}

int main(void)
{
    LOG("inicio");
    processar();

    printf("Arquivo: %s\\n", __FILE__);
    printf("Compilado em: %s %s\\n", __DATE__, __TIME__);
    return 0;
}`,
        saida: `[main:13] inicio
[processar:7] processando...
Arquivo: log-macro.c
Compilado em: Sep 15 2026 16:21:01

(os números de linha, o nome do arquivo e a data dependem de onde você compila)`,
      },
      {
        titulo: 'Stringizing (#) e token pasting (##)',
        rotulo: 'stringize.c',
        paragrafos: [
          '<code>#</code> transforma o argumento em uma string literal; <code>##</code> "cola" dois tokens para construir identificadores. Ferramentas raras, mas poderosas em meta-programação:',
        ],
        codigo: `#include <stdio.h>

#define STR(x) #x
#define CONCAT(a, b) a##b

int main(void)
{
    int carros = 3;

    printf(STR(carros) "\\n");
    printf("carros = %d\\n", CONCAT(car, ros));
    return 0;
}`,
        saida: `carros
carros = 3`,
      },
      {
        titulo: 'Compilação condicional: #if, #ifdef, #else, #endif',
        rotulo: 'condicional.c',
        paragrafos: [
          'Trechos inteiros de código podem nascer ou morrer na compilação. <code>#ifdef X</code> inclui o bloco se a macro X existir; <code>#if</code> avalia uma expressão; <code>#undef</code> apaga uma macro. Padrão típico: código de depuração que só é compilado com <code>-DDEBUG</code>:',
        ],
        codigo: `#include <stdio.h>

#define NIVEL 3

int main(void)
{
#if NIVEL >= 3
    printf("modo avancado ativo (NIVEL=%d)\\n", NIVEL);
#else
    printf("modo basico\\n");
#endif

#ifdef DEBUG
    printf("debug ligado\\n");
#else
    printf("debug desligado\\n");
#endif
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 condicional.c -o cond
> .\\cond.exe

modo avancado ativo (NIVEL=3)
debug desligado

> gcc -DDEBUG -Wall -Wextra -std=c11 condicional.c -o cond2
> .\\cond2.exe

modo avancado ativo (NIVEL=3)
debug ligado`,
      },
      {
        titulo: 'Guardas de inclusão: o cabeçalho "anti-duplicado"',
        rotulo: 'contador.h (fragmento de cabeçalho)',
        paragrafos: [
          'Quando dois arquivos .c incluem o mesmo .h (que por sua vez inclui outro), as declarações colariam duas vezes. A <em>include guard</em> — um <code>#ifndef</code> na primeira inclusão e <code>#endif</code> no fim — garante que o conteúdo seja colado uma única vez.',
          'Este trecho é um cabeçalho (<code>.h</code>), não um programa completo; ele ganha vida ao ser <code>#include</code>ado pelos .c do módulo T2.09.',
        ],
        codigo: `#ifndef CONTADOR_H
#define CONTADOR_H

#define VALOR_INICIAL 0

int proximo(void);

#endif  /* CONTADOR_H */`,
      },
      {
        titulo: 'Macros vs funções e a avaliação dupla',
        rotulo: 'dupla-evaluacao.c',
        paragrafos: [
          'Macro é texto: os argumentos são colados sem avaliação. Se o argumento tem efeito colateral (<code>++n</code>) ou é uma chamada cara, a macro pode <strong>avaliá-lo mais de uma vez</strong>. Funções avaliam cada argumento uma única vez — prefira funções (e <code>static inline</code>) sempre que possível.',
        ],
        codigo: `#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))

int chamadas = 0;

int custoso(int v)
{
    chamadas++;
    return v;
}

int main(void)
{
    int r = MAX(custoso(7), custoso(3));

    printf("r = %d\\n", r);
    printf("custoso foi chamado %d vezes (numa funcao seriam 2)\\n", chamadas);
    return 0;
}`,
        saida: `r = 7
custoso foi chamado 3 vezes (numa funcao seriam 2)`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Defina <code>#define TAXA 0.08</code> e um programa que calcula o preço com imposto de um valor lido do usuário. Imprima o resultado formatado.',
        dica: 'Use <code>scanf("%lf", &amp;v)</code> e depois <code>printf("%.2f", v * (1 + TAXA))</code>.',
        solucao: `#include <stdio.h>

#define TAXA 0.08

int main(void)
{
    double preco;

    printf("Preco sem imposto: ");
    if (scanf("%lf", &preco) != 1) {
        return 1;
    }

    printf("Com imposto: %.2f\\n", preco * (1 + TAXA));
    return 0;
}`,
        solucao_obs: 'Teste com 100: imprime 108.00.',
      },
      {
        nivel: 2,
        enunciado:
          'Defina a macro BUGADA <code>QUADRADO_BUG(x) x * x</code> e use em <code>QUADRADO_BUG(2 + 3)</code> — imprima para ver o erro — e depois a versão correta <code>QUADRADO(x) ((x) * (x))</code> que dá o esperado (25).',
        dica: 'A expansion textual: 2 + 3 * 2 + 3 = 11. É esse "+ 3 * 2" o problema.',
        solucao: `#include <stdio.h>

#define QUADRADO_BUG(x) x * x
#define QUADRADO(x) ((x) * (x))

int main(void)
{
    printf("QUADRADO_BUG(2 + 3) = %d\\n", QUADRADO_BUG(2 + 3));
    printf("QUADRADO(2 + 3)     = %d\\n", QUADRADO(2 + 3));
    return 0;
}`,
        solucao_obs: 'Esperado: 11 (o bug) e 25 (correto). É a lição dos parênteses.',
      },
      {
        nivel: 3,
        enunciado:
          'Crie uma macro <code>LOG_ERRO(msg)</code> que imprime <code>[erro em FUNCAO (linha N)]: msg</code> usando <code>__func__</code> e <code>__LINE__</code>. Chame-a dentro de duas funções diferentes e mostre que a localização muda.',
        dica: '<code>#define LOG_ERRO(msg) printf("[erro em %s (linha %d)]: %s\\n", __func__, __LINE__, msg)</code>.',
        solucao: `#include <stdio.h>

#define LOG_ERRO(msg) printf("[erro em %s (linha %d)]: %s\\n", __func__, __LINE__, msg)

int carregar(void)
{
    LOG_ERRO("falha ao ler arquivo");
    return -1;
}

int main(void)
{
    LOG_ERRO("tudo certo?");
    carregar();
    return 0;
}`,
        solucao_obs: 'O número da linha muda conforme a chamada — o pré-processador cola o valor real.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva um programa com <code>#ifdef DEBUG</code> imprimindo o valor de uma variável e <code>#else</code> imprimindo só o resultado. Compile uma vez sem flag e outra com <code>-DDEBUG</code>, mostrando comportamentos diferentes.',
        dica: '<code>gcc -DDEBUG prog.c -o prog_db</code> define a macro DEBUG na linha de comando.',
        solucao: `#include <stdio.h>

int main(void)
{
    int soma = 2 + 3;

#ifdef DEBUG
    printf("DEBUG: soma calculada = %d\\n", soma);
#endif

    printf("resultado = %d\\n", soma);
    return 0;
}`,
        solucao_obs: 'Sem -DDEBUG só aparece "resultado = 5"; com -DDEBUG aparece também a linha de depuração.',
      },
      {
        nivel: 4,
        enunciado:
          'Use <code>#</code> e <code>##</code> para criar uma macro <code>DECLARA_E_USA(v, val)</code> que declara <code>int v = val;</code> e imprime o nome da variável e seu conteúdo, juntando mesagens como <code>DECLARA_E_USA(idade, 21)</code>.',
        dica: '`#` gera o nome; chame <code>STR(idade)</code> para imprimir o texto "idade".',
        solucao: `#include <stdio.h>

#define NOME_VAR(v) #v

int main(void)
{
    int idade = 21;
    int nota = 9;

    printf("%s = %d\\n", NOME_VAR(idade), idade);
    printf("%s = %d\\n", NOME_VAR(nota), nota);
    return 0;
}`,
        solucao_obs: 'Colando tokens (##) você poderia construir identificadores, ex.: <code>CONCAT(var, i)</code> vira <code>vari</code>. Tente como extra.',
      },
    ],
    quiz: [
      {
        pergunta: 'O que faz o pré-processador antes do compilador?',
        opcoes: [
          'Otimiza loops',
          'Substitui texto: cola #include, expande #define',
          'Cria o executável',
          'Roda o depurador',
        ],
        correta: 1,
        explicacao: 'É a fase textual: inclusões e macros são resolvidas antes da compilação propriamente dita.',
      },
      {
        pergunta: 'Por que envolver argumentos de macro em parênteses?',
        opcoes: [
          'É obrigatório em C11',
          'Para evitar erros de precedência na expansão textual',
          'Para deixar mais rápido',
          'Para impedir macros com efeito colateral',
        ],
        correta: 1,
        explicacao: 'Sem parênteses, <code>QUADRADO(2+3)</code> vira <code>2+3*2+3</code> = 11.',
      },
      {
        pergunta: 'O que <code>#ifdef DEBUG</code> faz?',
        opcoes: [
          'Sempre inclui o bloco',
          'Inclui o bloco somente se a macro DEBUG estiver definida',
          'Apaga a macro DEBUG',
          'Compila em modo slow',
        ],
        correta: 1,
        explicacao: '#ifdef testa se a macro existe; com -DDEBUG ligamos o bloco na linha de comando.',
      },
      {
        pergunta: 'Qual é o papel das include guards?',
        opcoes: [
          'Acelerar o linker',
          'Impedir que o cabeçalho seja incluído duas vezes no mesmo arquivo',
          'Pedir senha ao compilar',
          'Definir macros de sistema',
        ],
        correta: 1,
        explicacao: 'O #ifndef/#define/#endif torna a segunda inclusão vazia, evitando duplicatas.',
      },
      {
        pergunta: 'Qual macro embutida indica a função atual?',
        opcoes: ['__FILE__', '__FUNCTION__', '__func__', 'LINE()'],
        correta: 2,
        explicacao: '__func__ (e __FUNCTION__ em alguns compiladores) contém o nome da função em execução.',
      },
    ],
    projeto: {
      titulo: 'Logger com macros',
      descricao:
        'Construa um mini-logger: um cabeçalho <code>log.h</code> com guarda de inclusão definindo <code>LOG_INFO</code>, <code>LOG_AVISO</code> e <code>LOG_ERRO</code> que imprimem nível, função e linha (usa __func__/__LINE__), e um programa principal que simula uma "sessão" (iniciar, processar nota, encerrar) gravando no terminal. Crie também um modo com -DDEBUG que imprime valores extras.',
      criterios: [
        'log.h com include guard e macros com parênteses.',
        'Três níveis de log chamados em funções diferentes, mostrando localização.',
        'Bloco #ifdef DEBUG adicionando saída extra sem quebrar o normal.',
        'Compila sem e com -DDEBUG, sempre -Wall -Wextra limpos.',
      ],
    },
  },
  {
    trilha: '2',
    numero: '09',
    titulo: 'Programas multiarquivo e compilação separada',
    subtitulo: '.h, .c, protótipos, guardas, static/extern, Makefile',
    objetivo:
      'Dividir um programa em cabeçalhos (.h) e implementações (.c), compilar peça por peça com gcc -c, linkar tudo depois, e automatizar a build com um Makefile simples com build incremental.',
    prerequisitos: 'T2.08',
    duracao: '~45 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 17 (Separate Compilation, Makefiles)',
      king: 'Capítulo 15 (Writing Large Programs)',
      foco:
        'No King, o capítulo 15 cobre exatamente o cenário aqui: dividir em arquivos, cabeçalhos, e o papel das guardas. No Beej, foque na parte de compilar vários arquivos e no exemplo de Makefile.',
    },
    secoes: [
      {
        titulo: 'O cabeçalho: só declarações',
        rotulo: 'calc.h (fragmento de cabeçalho)',
        paragrafos: [
          'A regra do jogo: o <strong>.h</strong> traz apenas declarações (protótipos, tipos, macros, constantes); o <strong>.c</strong> traz as definições concretas. Quem quer usar uma função faz <code>#include "calc.h"</code> e o compilador sabe a assinatura. A include guard evita duplicação (T2.08).',
          'Este bloco é um cabeçalho; os dois próximos são as peças compiláveis que, juntas, formam o programa.',
        ],
        codigo: `/* calc.h */
#ifndef CALC_H
#define CALC_H

int soma(int a, int b);
int sub(int a, int b);
int mul(int a, int b);

#endif`,
      },
      {
        titulo: 'A implementação: definitions',
        rotulo: 'calc.c',
        paragrafos: [
          '<code>calc.c</code> <em>inclui o próprio</em> cabeçalho — assim o compilador confere se o protótipo bate com a definição. Note que este arquivo <strong>não tem</strong> <code>main</code>: é uma biblioteca, um translação unit que só fará sentido ao ser linkado com quem tem <code>main</code>.',
        ],
        codigo: `/* calc.c */
#include "calc.h"

int soma(int a, int b) { return a + b; }
int sub(int a, int b)  { return a - b; }
int mul(int a, int b)  { return a * b; }`,
      },
      {
        titulo: 'O programa principal',
        rotulo: 'main.c',
        paragrafos: [
          '<code>main.c</code> usa as funções com a interface declarada no <code>calc.h</code>. Para gerar o executável, <code>gcc calc.c main.c -o calc</code>: o compilador gera objetos de cada .c e o linker junta tudo, resolvendo as chamadas.',
        ],
        codigo: `/* main.c */
#include <stdio.h>
#include "calc.h"

int main(void)
{
    printf("soma: %d\\n", soma(3, 4));
    printf("sub:  %d\\n", sub(10, 4));
    printf("mul:  %d\\n", mul(3, 4));
    return 0;
}`,
        saida: `> gcc calc.c main.c -o calc
> .\\calc.exe

soma: 7
sub:  6
mul:  12`,
      },
      {
        titulo: 'Compilação separada: gcc -c e os arquivos .o',
        rotulo: 'compilando-por-partes',
        paragrafos: [
          'Projetos grandes compilam cada <code>.c</code> em um <strong>arquivo objeto</strong> (<code>.o</code>) com <code>gcc -c</code>, e só a mudança de um arquivo exige recompilar aquele arquivo. No fim, o linker junta os <code>.o</code> no executável:',
        ],
        codigo: `gcc -Wall -Wextra -std=c11 -c calc.c
gcc -Wall -Wextra -std=c11 -c main.c
gcc calc.o main.o -o calc
.\\calc.exe`,
        saida: `soma: 7
sub:  6
mul:  12`,
      },
      {
        titulo: 'Makefile: build incremental por dependências',
        rotulo: 'Makefile',
        paragrafos: [
          'Um Makefile descreve <strong>alvos</strong> (targets), <strong>pré-requisitos</strong> e <strong>regras</strong>: se qualquer pré-requisito mudou, o alvo é reconstruído. Isso dá o build incremental — imagina recompilar 200 arquivos porque trocou 1.',
          'Abaixo, o Makefile do nosso mini-projeto (no Windows, use <code>mingw32-make</code>):',
        ],
        lista: [
          '<code>calc:</code> — alvo final, depende de <code>calc.o</code> e <code>main.o</code>.',
          '<code>calc.o:</code> e <code>main.o:</code> — dependem de seus <code>.c</code> e do <code>calc.h</code>.',
          '<code>clean:</code> — remove os artefatos gerados.',
        ],
        codigo: `# Makefile
CC = gcc
CFLAGS = -Wall -Wextra -std=c11

calc: calc.o main.o
	$(CC) $(CFLAGS) calc.o main.o -o calc

calc.o: calc.c calc.h
	$(CC) $(CFLAGS) -c calc.c

main.o: main.c calc.h
	$(CC) $(CFLAGS) -c main.c

clean:
	del /q calc.o main.o calc.exe`,
      },
      {
        titulo: 'static e extern',
        rotulo: 'contador-static.c',
        paragrafos: [
          '<code>extern</code> diz que uma variável/função está <em>definida em outro arquivo</em> (já é o padrão para funções). <code>static</code> no nível de arquivo esconde o símbolo daquele arquivo (linkage interna); <code>static</code> dentro de função preserva o valor entre chamadas — a "memória" da função:',
        ],
        codigo: `#include <stdio.h>

int chamadas_estaticas(void)
{
    static int contador = 0;
    contador++;
    return contador;
}

int main(void)
{
    printf("chamada 1: %d\\n", chamadas_estaticas());
    printf("chamada 2: %d\\n", chamadas_estaticas());
    printf("chamada 3: %d\\n", chamadas_estaticas());
    return 0;
}`,
        saida: `chamada 1: 1
chamada 2: 2
chamada 3: 3`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Separe em <code>media.h</code> e <code>media.c</code> a função <code>double media(double a, double b)</code> e use-a em um <code>main.c</code>. Responda com os três arquivos e o comando de compilação. (Solução mostra uma versão compacta e a regra de ouro dos arquivos.)',
        dica: 'media.h declara e media.c define. main.c inclui media.h e chamam media(7.5, 4.5).',
        solucao: `/* media.h */
#ifndef MEDIA_H
#define MEDIA_H
double media(double a, double b);
#endif

/* media.c */
#include "media.h"
double media(double a, double b) { return (a + b) / 2.0; }

/* main.c */
#include <stdio.h>
#include "media.h"
int main(void)
{
    printf("media de 7.5 e 4.5 = %.2f\\n", media(7.5, 4.5));
    return 0;
}

/* compilar: gcc media.c main.c -o media */
`,
        solucao_obs: 'Na prática, cada arquivo vai em um arquivo de verdade (.h e .c); a solução acima junta os três em um código único só para conferência rápida.',
      },
      {
        nivel: 2,
        enunciado:
          'Com os arquivos do exemplo calc (calc.h/calc.c/main.c), compile manualmente em duas etapas: gere os objetos com <code>gcc -c</code> e linke com os .o. Depois, usando o Makefile, rode <code>mingw32-make</code> duas vezes seguidas e observe como a segunda build é mais curta (nothing to be done).',
        dica: 'O Makefile deve estar na mesma pasta dos .c. A segunda execução imprime "make: Nothing to be done".',
        solucao: `> gcc -Wall -Wextra -std=c11 -c calc.c main.c
> gcc calc.o main.o -o calc
> .\\calc.exe
soma: 7
sub:  6
mul:  12

> mingw32-make
calc.o  (ou "nada a fazer" na segunda vez)
> .\\calc.exe`,
        solucao_obs: 'O Makefile compara timestamps: nada que mudou, nada a recompilar.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva uma função com <code>static int contador</code> que devolve 1, 2, 3... a cada chamada (o exemplo do módulo). Agora alterne: crie uma versão SEM static (sempre 1) e outra COM static, em um só programa, e imprima as duas sequências lado a lado.',
        dica: 'A função sem static reinicia em 0 a cada chamada; a com static lembra.',
        solucao: `#include <stdio.h>

int sem_static(void)
{
    int c = 0;
    c++;
    return c;
}

int com_static(void)
{
    static int c = 0;
    c++;
    return c;
}

int main(void)
{
    for (int i = 0; i < 4; i++) {
        printf("sem_static:%d   com_static:%d\\n", sem_static(), com_static());
    }
    return 0;
}`,
        solucao_obs: 'A variável static vive entre chamadas; a local morre ao fim da função.',
      },
      {
        nivel: 4,
        enunciado:
          'Use <code>extern</code>: em <code>global.c</code> defina <code>int contador_global = 0;</code> e a função <code>void incrementar_global(void)</code>; em <code>main.c</code> declare <code>extern int contador_global;</code>, chame a função três vezes e imprima o valor. Compile com os dois arquivos.',
        dica: 'precisa de dois arquivos; responda com o conteúdo de cada um e o comando <code>gcc global.c main.c -o prog</code>.',
        solucao: `/* global.c */
int contador_global = 0;

void incrementar_global(void)
{
    contador_global++;
}

/* main.c */
#include <stdio.h>

extern int contador_global;
void incrementar_global(void);

int main(void)
{
    incrementar_global();
    incrementar_global();
    incrementar_global();
    printf("contador_global = %d\\n", contador_global);
    return 0;
}

/* compilar: gcc global.c main.c -o prog  -> imprime 3 */
`,
        solucao_obs: 'extern não é uma declaração "nova": apenas promete que a variável existe em outro arquivo. O linker resolve na fase de linkagem.',
      },
    ],
    quiz: [
      {
        pergunta: 'O que normalmente vive num arquivo .h?',
        opcoes: [
          'Código compilado',
          'Declarações: protótipos, tipos, macros, constantes',
          'Somente a função main',
          'o binário do programa',
        ],
        correta: 1,
        explicacao: 'O .h é a "interface"; as definições ficam nos .c.',
      },
      {
        pergunta: 'Para que serve <code>gcc -c arquivo.c</code>?',
        opcoes: [
          'Cria o executável final',
          'Compila apenas gerando o arquivo objeto (sem linkar)',
          'Limpa arquivos temporários',
          'Compila e executa na mesma hora',
        ],
        correta: 1,
        explicacao: '-c gera foo.o sem chamar o linker; a junção final acontece depois.',
      },
      {
        pergunta: 'O que o "build incremental" de um Makefile faz?',
        opcoes: [
          'Recompila tudo a cada comando',
          'Recompila apenas os arquivos cujos pré-requisitos mudaram',
          'Compila em 3 threads sempre',
          'Impede o uso de -g',
        ],
        correta: 1,
        explicacao: 'Comparando timestamps, o make só recompila o que está desatualizado.',
      },
      {
        pergunta: 'O que signfica <code>static</code> numa variável local?',
        opcoes: [
          'Vira global automaticamente',
          'Preserva o valor entre chamadas da função',
          'Fica na heap',
          'Não pode ser usada em loops',
        ],
        correta: 1,
        explicacao: 'A variável static local nasce uma vez e mantém seu valor nas próximas chamadas.',
      },
      {
        pergunta: 'Um arquivo .c sem main...',
        opcoes: [
          'não compila nunca',
          'compila como objeto (-c); só liga quando linkado com outro que tenha main.',
          'é ignorado pelo gcc',
          'gera sempre um executável vazio',
        ],
        correta: 1,
        explicacao: 'Bibliotecas são unidades de tradução sem main; o linker as junta com quem tem a função de entrada.',
      },
    ],
  },
  {
    trilha: '2',
    numero: '10',
    titulo: 'Operações bit a bit',
    subtitulo: 'máscaras, flags, & | ^ ~ << >>, XOR e popcount',
    objetivo:
      'Operar diretamente sobre os bits de inteiros: definir/limpar/testar flags, usar máscaras, deslocamentos, encriptação XOR simples e contagem de bits set — habilidades do mundo de sistemas e de baixo nível.',
    prerequisitos: 'T1.06 (lógica) e T1.09 (binário/hex)',
    duracao: '~35 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 24 (Bitwise Operations)',
      king: 'Capítulos 20.2–20.3 (Bitwise operators)',
      foco:
        'No King, 20.2 apresenta cada operador bit a bit e 20.3 as aplicações com bandeiras (flags). No Beej, os exemplos de ler um bit específico e montar/limpar bandeiras.',
    },
    secoes: [
      {
        titulo: 'Os operadores na prática',
        rotulo: 'operadores.c',
        paragrafos: [
          'Os operadores bit a bit trabalham bit por bit nos inteiros: <code>&amp;</code> (E), <code>|</code> (OU), <code>^</code> (OU exclusivo), <code>~</code> (complemento), <code>&lt;&lt;</code> e <code>&gt;&gt;</code> (deslocamentos). Eles não funcionam com tipos ponto flutuante.',
        ],
        codigo: `#include <stdio.h>

void mostrar(const char *nome, int v)
{
    printf("%-14s = %4d  (0x%08X)\\n", nome, v, (unsigned)v);
}

int main(void)
{
    int a = 0x0C;   /* 1100 em binario */
    int b = 0x0A;   /* 1010 em binario */

    mostrar("a", a);
    mostrar("b", b);
    mostrar("a & b", a & b);
    mostrar("a | b", a | b);
    mostrar("a ^ b", a ^ b);
    mostrar("~a", ~a);
    mostrar("a << 1", a << 1);
    mostrar("b >> 1", b >> 1);
    return 0;
}`,
        saida: `a             =   12  (0x0000000C)
b             =   10  (0x0000000A)
a & b         =    8  (0x00000008)
a | b         =   14  (0x0000000E)
a ^ b         =    6  (0x00000006)
~a            =  -13  (0xFFFFFFF3)
a << 1        =   24  (0x00000018)
b >> 1        =    5  (0x00000005)`,
      },
      {
        titulo: 'Flags e máscaras: permissões estilo chmod',
        rotulo: 'flags.c',
        paragrafos: [
          'Um int de 32 bits pode guardar 32 bandeiras binárias de uma vez — economia extrema. Para <strong>ligar</strong> um bit usamos <code>|=</code>, para <strong>limpar</strong> <code>&amp;= ~mascara</code>, para <strong>alternar</strong> <code>^=</code>, e para <strong>testar</strong> <code>(v &amp; mascara)</code>. É exatamente assim que o chmod/unix representa permissões (r = 4, w = 2, x = 1) e como drivers leem registradores de hardware.',
        ],
        codigo: `#include <stdio.h>

#define FLAG_LEITURA  (1 << 0)
#define FLAG_ESCRITA  (1 << 1)
#define FLAG_EXEC     (1 << 2)

int main(void)
{
    int permissoes = 0;

    permissoes |= FLAG_LEITURA;   /* liga bit 0 */
    permissoes |= FLAG_EXEC;      /* liga bit 2 */

    printf("permissoes = %d (0x%X)\\n", permissoes, permissoes);
    printf("tem leitura? %s\\n", (permissoes & FLAG_LEITURA) ? "sim" : "nao");
    printf("tem escrita? %s\\n", (permissoes & FLAG_ESCRITA) ? "sim" : "nao");

    permissoes ^= FLAG_EXEC;      /* alterna bit 2 */
    printf("alternando EXEC: %d (0x%X)\\n", permissoes, permissoes);

    permissoes &= ~FLAG_LEITURA;  /* limpa bit 0 */
    printf("limpando LEITURA: %d (0x%X)\\n", permissoes, permissoes);
    return 0;
}`,
        saida: `permissoes = 5 (0x5)
tem leitura? sim
tem escrita? nao
alternando EXEC: 1 (0x1)
limpando LEITURA: 0 (0x0)`,
      },
      {
        titulo: 'Bits em perfumaria: registradores e hardware',
        rotulo: 'registradores',
        paragrafos: [
          'Em embarcados e sistemas, os bits de um <strong>registrador</strong> controlam hardware: um bit de habilitação, um de modo, um de interrupção. Ler um registrador é "ler um int"; configurá-lo é montar a máscara certa. É por isso que essa habilidade é requisito básico na trilha Cyber/sistemas.',
        ],
      },
      {
        titulo: 'Encriptação XOR: o cifrador do sim',
        rotulo: 'xor.c',
        paragrafos: [
          'O XOR tem uma propriedade mágica: aplicar duas vezes o mesmo valor "desfaz" a operação — <code>(x ^ k) ^ k == x</code>. Por isso serve de cifra de aprendizado (não use em produção!): cifrar com a chave e decifrar com a mesma chave. O hardware usa a mesma lógica internamente.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    char msg[] = "secreto";
    int chave = 0x5A;

    for (int i = 0; msg[i] != '\\0'; i++) {
        msg[i] ^= chave;
    }
    printf("cifrado: ");
    for (int i = 0; msg[i] != '\\0'; i++) {
        printf("%02X ", (unsigned char)msg[i]);
    }
    printf("\\n");

    for (int i = 0; msg[i] != '\\0'; i++) {
        msg[i] ^= chave;
    }
    printf("decifrado: %s\\n", msg);
    return 0;
}`,
        saida: `cifrado: 29 3F 39 28 3F 2E 35
decifrado: secreto`,
      },
      {
        titulo: 'Popcount: contando bits ligados',
        rotulo: 'popcount.c',
        paragrafos: [
          'Contar os bits 1 de um inteiro tem aplicações (paridade, CRC, criptografia). A versão manual: testa o bit 0 com <code>v &amp; 1</code> e desloca um lugar a cada iteração. (A CPU moderna tem a instrução popcnt, mas a lógica é esta.)',
        ],
        codigo: `#include <stdio.h>

int contar_bits(int v)
{
    int total = 0;
    while (v != 0) {
        total += v & 1;
        v = (unsigned)v >> 1;
    }
    return total;
}

int main(void)
{
    printf("popcount(0xC3) = %d   (1100 0011)\\n", contar_bits(0xC3));
    printf("popcount(0xFF) = %d\\n", contar_bits(0xFF));
    printf("popcount(0)    = %d\\n", contar_bits(0));
    return 0;
}`,
        saida: `popcount(0xC3) = 4   (1100 0011)
popcount(0xFF) = 8
popcount(0)    = 0`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Escreva um programa que determina se um número é par ou ímpar usando <code>n &amp; 1</code> (último bit). Teste com 7, 8 e 0.',
        dica: 'Números ímpares têm o bit 0 ligado.',
        solucao: `#include <stdio.h>

int main(void)
{
    int v[3] = {7, 8, 0};

    for (int i = 0; i < 3; i++) {
        printf("%d -> %s\\n", v[i], (v[i] & 1) ? "impar" : "par");
    }
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Defina as macros <code>BIT_3 = (1 &lt;&lt; 3)</code>. Crie um programa que liga o bit 3 de um int (valor inicial 1), imprime, alterna (^), imprime, limpa (&amp;= ~), imprime. Mostre também o estado antes.',
        dica: 'Use printf com %d e %X para visualizar.',
        solucao: `#include <stdio.h>

#define BIT_3 (1 << 3)

int main(void)
{
    int v = 1;

    printf("inicio   : %d (0x%X)\\n", v, v);
    v |= BIT_3;
    printf("ligado   : %d (0x%X)\\n", v, v);
    v ^= BIT_3;
    printf("alternou : %d (0x%X)\\n", v, v);
    v &= ~BIT_3;
    printf("limpado  : %d (0x%X)\\n", v, v);
    return 0;
}`,
        solucao_obs: 'Sequência: 1 (0x1) -> 9 (0x9) -> 1 (0x1) -> 1 (0x1).',
      },
      {
        nivel: 3,
        enunciado:
          'Troque os valores de duas variáveis int, a e b, <em>sem variável temporária</em>, usando três XOR sucessivos: a ^= b; b ^= a; a ^= b. Imprima antes e depois e confira que o par (a,b) ficou invertido.',
        dica: 'Propriedade: (x ^ y) ^ x == y.',
        solucao: `#include <stdio.h>

int main(void)
{
    int a = 6, b = 13;

    printf("antes : a=%d b=%d\\n", a, b);
    a = a ^ b;
    b = b ^ a;
    a = a ^ b;
    printf("depois: a=%d b=%d\\n", a, b);
    return 0;
}`,
        solucao_obs: 'Funciona para qualquer par; é truque clássico (embora menos legível que o tmp).',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva a função <code>int eh_potencia_de_2(int n)</code> usando o truque <code>(n &amp; (n-1)) == 0</code>. Teste com 1, 2, 4, 16, 12 e 0 (0 <em>não</em> é potência).',
        dica: 'Uma potência de 2 tem exatamente um bit ligado; n-1 apaga esse bit e acende os de baixo.',
        solucao: `#include <stdio.h>

int eh_potencia_de_2(int n)
{
    return n > 0 && (n & (n - 1)) == 0;
}

int main(void)
{
    int v[6] = {1, 2, 4, 16, 12, 0};

    for (int i = 0; i < 6; i++) {
        printf("%d -> %s\\n", v[i], eh_potencia_de_2(v[i]) ? "sim" : "nao");
    }
    return 0;
}`,
      },
      {
        nivel: 4,
        enunciado:
          'Imprima um inteiro (ex.: 0xA5) como sequência de bits do mais significativo para o menos (8 bits). Use um loop que testa cada bit com uma máscara <code>1 &lt;&lt; i</code>.',
        dica: 'Do i=7 até i=0: <code>printf(v &amp; (1 &lt;&lt; i) ? "1" : "0")</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    int v = 0xA5;   /* 1010 0101 */
    printf("v = %d = ", v);

    for (int i = 7; i >= 0; i--) {
        putchar((v & (1 << i)) ? '1' : '0');
    }
    printf("\\n");
    return 0;
}`,
        solucao_obs: 'Esperado: 10100101. Adapte para 16/32 bits trocando os limites do loop.',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual operador testa se um bit específico está ligado (máscara m)?',
        opcoes: [
          'v != m',
          'v & m',
          'v | m',
          'v ^ m',
        ],
        correta: 1,
        explicacao: '<code>v &amp; m</code> é diferente de zero exatamente quando os bits da máscara estão ligados em v.',
      },
      {
        pergunta: 'Como "ligar" o bit de posição n de v?',
        opcoes: [
          'v &= (1 << n)',
          'v |= (1 << n)',
          'v ^= (1 << n) sempre',
          'v &= ~(1 << n)',
        ],
        correta: 1,
        explicacao: 'OU com a máscara acende o bit; AND com ~(mascara) apaga; ^ alterna.',
      },
      {
        pergunta: 'Qual resultado de <code>0xFF ^ 0xFF</code>?',
        opcoes: ['0xFF', '0x00', '0xFE', '0x01'],
        correta: 1,
        explicacao: 'XOR de iguais é 0: bit a bit, 1^1=0 e 0^0=0.',
      },
      {
        pergunta: 'O que faz <code>v &lt;&lt; 2</code>?',
        opcoes: [
          'Multiplica v por 2',
          'Desloca os bits 2 posições à esquerda (equivale a multiplicar por 4, ignorando estouro)',
          'Divide v por 4',
          'Inverte os bits',
        ],
        correta: 1,
        explicacao: 'Cada deslocamento à esquerda dobra o valor; << 2 multiplica por 4 (com alerta de estouro).',
      },
      {
        pergunta: 'Por que usar flags em um único int em vez de várias variáveis?',
        opcoes: [
          'Porque int não pode guardar valores lógicos',
          'Compactação: 32 estados por inteiro, fáceis de setar/testar e transmitir',
          'Porque o compilador obriga',
          'Para deixar o programa mais lento de propósito',
        ],
        correta: 1,
        explicacao: 'Bit flags agrupam muitos estados em um inteiro com operações rápidas — padrão em sistemas, drivers e protocolos.',
      },
    ],
    projeto: {
      titulo: 'Permissões estilo chmod',
      descricao:
        'Crie um programa que trabalha com um <code>int permissoes</code> de 9 bits (leitura/escrita/execução do dono, do grupo e de outros) usando macros <code>U_LEITURA</code> etc. (ex.: dono rwx = 7 = 700 em octal). O menu: 1) mostrar em formato rwxr-xr-x, 2) adicionar permissão (recebe "u+x", "g-r" ...), 3) remover, 4) sair. A interpretação do rwxr-xr-x usa os bits na ordem certa.',
      criterios: [
        'Formatação rwxr-xr-x correta a partir dos 9 bits.',
        'Pelo menos um comando de adicionar e um de remover (u/g/o com + ou - e r/w/x).',
        'Validação de comando inválido.',
        'Compila com -Wall -Wextra sem avisos.',
      ],
    },
  },
  {
    trilha: '2',
    numero: '11',
    titulo: 'Ponteiros para funções e ponteiros para ponteiros',
    subtitulo: 'callbacks, qsort, tabelas de funções e char**',
    objetivo:
      'Armazenar endereços de funções e usá-los como argumentos (callbacks), ordenar com qsort, montar tabelas de funções para menus, e dominar ponteiros para ponteiros (funções que devolvem via parâmetro).',
    prerequisitos: 'T2.05, T2.06, T2.09',
    duracao: '~40 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 23, seções sobre function pointers e typedef',
      king: 'Capítulos 17.6–17.7 (Pointers to functions, pointers to pointers)',
      foco:
        'No King, 17.7 trata ponteiros para ponteiros aplicados a matrizes/strtok; 17) funções como argumentos. No Beej, os exemplos de ponteiros de função e o uso com qsort.',
    },
    secoes: [
      {
        titulo: 'Ponteiro para função: um endereço que você chama',
        rotulo: 'fnptr.c',
        paragrafos: [
          'Um ponteiro para função guarda o endereço de uma função — você pode guardá-lo em variável, passá-lo como argumento e chamá-lo através do parâmetro. É o mecanismo dos <em>callbacks</em>: uma função recebe "o que fazer" como parâmetro.',
          'A sintaxe é esquisita: <code>int (*f)(int)</code> é um ponteiro para função que recebe <code>int</code> e devolve <code>int</code>. Chame com <code>f(x)</code> ou <code>(*f)(x)</code>.',
        ],
        codigo: `#include <stdio.h>

int dobrar(int v)    { return v * 2; }
int triplicar(int v) { return v * 3; }

int aplicar(int (*f)(int), int valor)
{
    return f(valor);
}

int main(void)
{
    int (*ptr)(int) = dobrar;

    printf("dobrar(5) via ponteiro = %d\\n", ptr(5));
    printf("aplicar(triplicar, 5)  = %d\\n", aplicar(triplicar, 5));
    printf("aplicar(triplicar, 7)  = %d\\n", aplicar(triplicar, 7));
    return 0;
}`,
        saida: `dobrar(5) via ponteiro = 10
aplicar(triplicar, 5)  = 15
aplicar(triplicar, 7)  = 21`,
      },
      {
        titulo: 'qsort e seu comparador',
        rotulo: 'qsort.c',
        paragrafos: [
          '<code>qsort</code> ordena qualquer array, mas não sabe o que significa "maior/menor" para os seus dados — por isso pede um <em>comparador</em>: uma função <code>int cmp(const void *, const void *)</code> que devolve negativo/zero/positivo. O parâmetro é <code>void *</code>; dentro, convertemos e então lemos.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

int cmp_int(const void *a, const void *b)
{
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

int main(void)
{
    int v[] = {42, 7, 19, 3, 88, 1};
    int n = (int)(sizeof v / sizeof v[0]);

    qsort(v, (size_t)n, sizeof v[0], cmp_int);

    for (int i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
    return 0;
}`,
        saida: `1 3 7 19 42 88`,
      },
      {
        titulo: 'typedef para ponteiro de função e tabelas',
        rotulo: 'tabela.c',
        paragrafos: [
          'Uma linha inteira complicada fica legível com typedef: <code>typedef int (*Operacao)(int, int);</code>. Com isso, declara-se um <em>array</em> de funções — a base de menus, máquinas de estado e despachos:',
        ],
        codigo: `#include <stdio.h>

typedef int (*Operacao)(int, int);

int somar(int a, int b)       { return a + b; }
int subtrair(int a, int b)    { return a - b; }
int multiplicar(int a, int b) { return a * b; }

int main(void)
{
    Operacao ops[3] = {somar, subtrair, multiplicar};
    int a = 12, b = 4;

    for (int i = 0; i < 3; i++) {
        printf("op[%d](%d, %d) = %d\\n", i, a, b, ops[i](a, b));
    }
    return 0;
}`,
        saida: `op[0](12, 4) = 16
op[1](12, 4) = 8
op[2](12, 4) = 48`,
      },
      {
        titulo: 'Ponteiro para ponteiro: trocar ponteiros',
        rotulo: 'ptrptr.c',
        paragrafos: [
          'Ponteiro para ponteiro (<code>int **</code>) é "o endereço de um ponteiro". Serve para funções que <strong>modificam o ponteiro do chamador</strong> — como já vimos no swap, mas desta vez trocando alvos:',
        ],
        codigo: `#include <stdio.h>

void trocar_ponteiros(int **a, int **b)
{
    int *tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void)
{
    int x = 1, y = 2;
    int *px = &x, *py = &y;

    printf("antes : px -> %d , py -> %d\\n", *px, *py);
    trocar_ponteiros(&px, &py);
    printf("depois: px -> %d , py -> %d\\n", *px, *py);
    return 0;
}`,
        saida: `antes : px -> 1 , py -> 2
depois: px -> 2 , py -> 1`,
      },
      {
        titulo: 'Ponteiro para ponteiro: alocar e "devolver"',
        rotulo: 'criar-string.c',
        paragrafos: [
          'Outro uso clássico: a função <em>cria</em> algo (aloca) e precisa entregar o endereço ao chamador. Passamos <code>char **saida</code> e escrevemos o ponteiro <code>*saida = malloc(...)</code> — quem chama recebe a string (e é responsável pelo free).',
          'É o mesmo padrão visto no T2.01 com <code>int **</code> e claramente com o strtok do T2.04? Não — strtok guarda estado interno; aqui é "devolver alocação por parâmetro", padrão comum em bibliotecas (ex.: ler uma linha).',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void criar_saudacao(char **saida)
{
    *saida = malloc(64);
    if (*saida != NULL) {
        strcpy(*saida, "oi, mundo!");
    }
}

int main(void)
{
    char *s = NULL;

    criar_saudacao(&s);
    if (s != NULL) {
        printf("%s\\n", s);
        free(s);
    }
    return 0;
}`,
        saida: `oi, mundo!`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Declare um ponteiro para função <code>int (*op)(int, int)</code>, aponte para uma função <code>max</code> que devolve o maior de dois ints, chame através do ponteiro com (7, 2) e (3, 8), e imprima.',
        dica: 'Declaração: <code>int (*op)(int, int) = max;</code> e chamada <code>op(a, b)</code>.',
        solucao: `#include <stdio.h>

int max(int a, int b)
{
    return a > b ? a : b;
}

int main(void)
{
    int (*op)(int, int) = max;

    printf("max(7, 2) = %d\\n", op(7, 2));
    printf("max(3, 8) = %d\\n", op(3, 8));
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Ordene um array de <code>Aluno</code> (nome, idade) com qsort pelo campo idade (crescente), usando um comparador que converte <code>void *</code> para <code>const Aluno *</code>. Imprima o resultado.',
        dica: 'qsort(array, n, sizeof(Aluno), cmp_idade); no comparador, <code>const Aluno *a = pa;</code>.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char nome[40];
    int idade;
} Aluno;

int cmp_idade(const void *pa, const void *pb)
{
    const Aluno *a = pa;
    const Aluno *b = pb;
    return (a->idade > b->idade) - (a->idade < b->idade);
}

int main(void)
{
    Aluno turma[4] = {
        {"Carla", 33}, {"Ana", 25}, {"Bruno", 30}, {"Diego", 28}
    };
    int n = (int)(sizeof turma / sizeof turma[0]);

    qsort(turma, (size_t)n, sizeof turma[0], cmp_idade);

    for (int i = 0; i < n; i++) {
        printf("%s (%d)\\n", turma[i].nome, turma[i].idade);
    }
    return 0;
}`,
        solucao_obs: 'Esperado: Ana(25), Diego(28), Bruno(30), Carla(33).',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva <code>void aplicar_todos(int (*f)(int), int arr[], int n)</code> que aplica f a cada elemento e imprime o transformado. Teste com uma função <code>dobrar</code> sobre <code>{1,2,3,4}</code>.',
        dica: 'Dentro, <code>for (i...) printf("%d ", f(arr[i]))</code>.',
        solucao: `#include <stdio.h>

int dobrar(int v) { return v * 2; }

void aplicar_todos(int (*f)(int), int arr[], int n)
{
    for (int i = 0; i < n; i++) {
        printf("%d ", f(arr[i]));
    }
    printf("\\n");
}

int main(void)
{
    int v[] = {1, 2, 3, 4};
    aplicar_todos(dobrar, v, 4);
    return 0;
}`,
        solucao_obs: 'Esse é o "map" de linguagens funcionais.',
      },
      {
        nivel: 4,
        enunciado:
          'Escreva <code>void criar_nome(char **out, const char *nome)</code> que aloca "Olá, NOME!" (use snprintf) e devolve por ponteiro-para-ponteiro. No main, chame, imprima e dê free. Teste com "C" e "C++".',
        dica: 'tamanho = 8 + strlen(nome); alocar; snprintf; *out = s.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void criar_nome(char **out, const char *nome)
{
    size_t tam = 8 + strlen(nome);
    char *s = malloc(tam);
    if (s == NULL) {
        *out = NULL;
        return;
    }
    snprintf(s, tam, "Ola, %s!", nome);
    *out = s;
}

int main(void)
{
    char *a = NULL, *b = NULL;

    criar_nome(&a, "C");
    criar_nome(&b, "C++");

    if (a != NULL) { printf("%s\\n", a); free(a); }
    if (b != NULL) { printf("%s\\n", b); free(b); }
    return 0;
}`,
      },
      {
        nivel: 4,
        enunciado:
          'Monte um menu com uma tabela de ponteiros para função: as 4 operações (somar, subtrair, multiplicar, dividir — com divisão checando zero). Leia dois números e a opção do usuário e despache via <code>ops[op](a, b)</code>.',
        dica: '<code>typedef double (*Op)(double, double);</code> e <code>Op ops[4] = {somar, subtrair, multiplicar, dividir};</code>',
        solucao: `#include <stdio.h>

typedef double (*Op)(double, double);

double somar(double a, double b)       { return a + b; }
double subtrair(double a, double b)    { return a - b; }
double multiplicar(double a, double b) { return a * b; }
double dividir(double a, double b)     { return a / b; }

int main(void)
{
    Op ops[4] = {somar, subtrair, multiplicar, dividir};
    double a = 20.0, b = 4.0;

    for (int i = 0; i < 4; i++) {
        printf("op[%d]: %.2f\\n", i, ops[i](a, b));
    }
    return 0;
}`,
        solucao_obs: 'Versão com scanf: <code>scanf("%d %lf %lf", &op, &a, &b)</code> e valide o intervalo antes de despachar. Divisão por zero seria NaN/inf — trate antes em produção.',
      },
    ],
    quiz: [
      {
        pergunta: 'A sintaxe <code>int (*f)(int)</code> declara...',
        opcoes: [
          'Uma função que devolve int*',
          'Um ponteiro para função que recebe int e devolve int',
          'Um array de ints',
          'Um ponteiro para int',
        ],
        correta: 1,
        explicacao: 'Entre parênteses *f marca "ponteiro para função"; o resto descreve a assinatura.',
      },
      {
        pergunta: 'Para que serve o "comparador" passado ao qsort?',
        opcoes: [
          'Saber o tamanho dos elementos',
          'Definir a ordem (negativo/zero/positivo) entre dois elementos',
          'Desenhar a interface',
          'Contar os elementos',
        ],
        correta: 1,
        explicacao: 'qsort é genérico; o comparador diz se a < b, igual ou a > b.',
      },
      {
        pergunta: 'Uma tabela de ponteiros para função permite...',
        opcoes: [
          'acelerar o hardware',
          'despachar chamadas por índice (menus, máquinas de estado)',
          'multiplicar ponteiros',
          'evitar o uso de main',
        ],
        correta: 1,
        explicacao: 'Com <code>ops[i](args)</code> o índice escolhe a função — padrão em menus e despachos.',
      },
      {
        pergunta: 'Por que uma função usa <code>char **saida</code> para "devolver" uma string alocada?',
        opcoes: [
          'Para economizar memória',
          'Porque precisa modificar o ponteiro do chamador (o endereço da string nova)',
          'Porque char* não pode ser retornado',
          'É sintaxe obrigatória para strings',
        ],
        correta: 1,
        explicacao: 'Para gravar no ponteiro do chamador, precisamos do endereço dele — daí o duplo ponteiro.',
      },
      {
        pergunta: 'O que é um callback?',
        opcoes: [
          'Uma função que chama o SO',
          'Uma função passada a outra para ser executada em determinado momento',
          'Uma variável global',
          'Um erro de compilação do C',
        ],
        correta: 1,
        explicacao: 'Callbacks são ponteiros para função usados como argumento, ex.: o comparador do qsort.',
      },
    ],
  },
  {
    trilha: '2',
    numero: '12',
    titulo: 'Estruturas de dados: listas encadeadas e recursão',
    subtitulo: 'nós, inserir/remover/buscar/destruir, pilhas, filas e recursão',
    objetivo:
      'Montar listas encadeadas dinâmicas sem vazar memória, implementar pilha e fila sobre elas, revisitar recursão em problemas clássicos, e decidir com critério quando usar vetor vs lista.',
    prerequisitos: 'T1.08 (funções/recursão), T2.02 e T2.06',
    duracao: '~35 min',
    nivel: 'Intermediário',
    leitura: {
      beej: '— (ver referências em sala e a matriz de EAD)',
      king: 'Capítulos 9.6 (Recursion) e 17.5 (Linked Lists/Coding a linked list)',
      foco:
        'No King, 9.6 para recursão com exemplos clássicos e 17.5 para a implementação de lista: ponteiros encadeados, inserção e percurso. No Beej, procure na seção de linked list dentro dos capítulos avançados.',
    },
    secoes: [
      {
        titulo: 'Recursão revisitada',
        rotulo: 'recursao.c',
        paragrafos: [
          'Recursão brilha onde o problema se define em termos de si mesmo. Dois casos clássicos: a soma dos primeiros naturais e inverter uma string "de dentro para fora". Todo caso recursivo tem caso base (para) e caso recursivo (encolhe o problema).',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

int soma_positivos(int n)
{
    if (n == 0) {
        return 0;
    }
    return n + soma_positivos(n - 1);
}

void inverter(char s[], int ini, int fim)
{
    if (ini >= fim) {
        return;
    }
    char tmp = s[ini];
    s[ini] = s[fim];
    s[fim] = tmp;
    inverter(s, ini + 1, fim - 1);
}

int main(void)
{
    char texto[] = "abcde";

    printf("soma(1..5) = %d\\n", soma_positivos(5));
    inverter(texto, 0, (int)strlen(texto) - 1);
    printf("invertida  = %s\\n", texto);
    return 0;
}`,
        saida: `soma(1..5) = 15
invertida  = edcba`,
      },
      {
        titulo: 'Nó, inserção no início, percurso, busca',
        rotulo: 'lista.c',
        paragrafos: [
          'Uma lista encadeada é uma corrente de <strong>nós</strong> alocados no heap; cada nó tem o dado e um ponteiro para o próximo. O último nó aponta para NULL, marcando o fim. A cabeça da fila é um ponteiro para o primeiro nó (ou NULL se vazia).',
          'Inserir no início é O(1): alocamos um nó e o apontamos para a cabeça atual.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct No *inserir_inicio(struct No *lista, int valor)
{
    struct No *novo = malloc(sizeof *novo);
    if (novo == NULL) {
        return lista;
    }
    novo->valor = valor;
    novo->proximo = lista;
    return novo;
}

void imprimir(const struct No *lista)
{
    for (const struct No *p = lista; p != NULL; p = p->proximo) {
        printf("%d ", p->valor);
    }
    printf("\\n");
}

int buscar(const struct No *lista, int alvo)
{
    for (const struct No *p = lista; p != NULL; p = p->proximo) {
        if (p->valor == alvo) {
            return 1;
        }
    }
    return 0;
}

void destruir(struct No *lista)
{
    while (lista != NULL) {
        struct No *prox = lista->proximo;
        free(lista);
        lista = prox;
    }
}

int main(void)
{
    struct No *lista = NULL;

    lista = inserir_inicio(lista, 10);
    lista = inserir_inicio(lista, 20);
    lista = inserir_inicio(lista, 30);

    imprimir(lista);
    printf("tem 20? %s\\n", buscar(lista, 20) ? "sim" : "nao");
    printf("tem 99? %s\\n", buscar(lista, 99) ? "sim" : "nao");

    destruir(lista);
    return 0;
}`,
        saida: `30 20 10
tem 20? sim
tem 99? nao`,
      },
      {
        titulo: 'Remover um nó (sem vazar memória)',
        rotulo: 'remover.c',
        paragrafos: [
          'Remover exige achar o nó anterior ao alvo para religar a corrente. O truque do <strong>ponteiro-para-ponteiro</strong> (<code>&&lista</code>) resolve elegante: percorremos um <code>struct No **p</code> que aponta para "a ligação atual" — seja a cabeça, seja um <code>-&gt;proximo</code> — e o free do nó removido é sempre o mesmo código:',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct No *criar_no(int v)
{
    struct No *n = malloc(sizeof *n);
    if (n == NULL) {
        return NULL;
    }
    n->valor = v;
    n->proximo = NULL;
    return n;
}

struct No *remover_valor(struct No *lista, int alvo)
{
    struct No **p = &lista;
    while (*p != NULL && (*p)->valor != alvo) {
        p = &(*p)->proximo;
    }
    if (*p != NULL) {
        struct No *removido = *p;
        *p = removido->proximo;   /* religa a corrente sem o nó */
        free(removido);
    }
    return lista;
}

void imprimir(const struct No *lista)
{
    for (const struct No *q = lista; q != NULL; q = q->proximo) {
        printf("%d ", q->valor);
    }
    printf("\\n");
}

void destruir(struct No *lista)
{
    while (lista != NULL) {
        struct No *q = lista->proximo;
        free(lista);
        lista = q;
    }
}

int main(void)
{
    struct No *lista = criar_no(10);
    lista->proximo = criar_no(20);
    lista->proximo->proximo = criar_no(30);

    imprimir(lista);
    lista = remover_valor(lista, 20);
    imprimir(lista);
    lista = remover_valor(lista, 10);
    imprimir(lista);
    lista = remover_valor(lista, 99);
    imprimir(lista);

    destruir(lista);
    return 0;
}`,
        saida: `10 20 30
10 30
30
30`,
      },
      {
        titulo: 'Pilha (stack) com lista',
        rotulo: 'pilha.c',
        paragrafos: [
          'Uma <strong>pilha</strong> é LIFO (último a entrar, primeiro a sair). Com lista encadeada, empilhar = inserir no início; desempilhar = remover o início. Encapsulamos tudo em uma struct <code>Pilha</code>:',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct Pilha {
    struct No *topo;
};

void empilhar(struct Pilha *p, int v)
{
    struct No *novo = malloc(sizeof *novo);
    if (novo == NULL) {
        return;
    }
    novo->valor = v;
    novo->proximo = p->topo;
    p->topo = novo;
}

int desempilhar(struct Pilha *p)
{
    if (p->topo == NULL) {
        return -1;   /* vazia */
    }
    struct No *removido = p->topo;
    int v = removido->valor;
    p->topo = removido->proximo;
    free(removido);
    return v;
}

int main(void)
{
    struct Pilha p = {NULL};

    empilhar(&p, 1);
    empilhar(&p, 2);
    empilhar(&p, 3);

    printf("desempilha: %d\\n", desempilhar(&p));
    printf("desempilha: %d\\n", desempilhar(&p));
    printf("desempilha: %d\\n", desempilhar(&p));
    printf("desempilha (vazia): %d\\n", desempilhar(&p));

    while (p.topo != NULL) {
        (void)desempilhar(&p);
    }
    return 0;
}`,
        saida: `desempilha: 3
desempilha: 2
desempilha: 1
desempilha (vazia): -1`,
      },
      {
        titulo: 'Vetor ou lista?',
        rotulo: 'vetor-vs-lista',
        paragrafos: [
          '<strong>Vetor (array)</strong> ganha quando o tamanho é estável e o acesso é por índice: <code>arr[i]</code> é O(1), tem localidade de cache excelente e ocupa pouco. <strong>Lista</strong> ganha quando há muitas inserções/remoções longe do fim e o tamanho é imprevisível — sem redimensionamentos caros.',
          'Boas práticas: sempre destruir (free) do primeiro nó até NULL ao fim; nunca perder a referência da cabeça (ex.: leve <code>copia = lista</code> antes de percorrer); testar NULL em cada malloc.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Escreva <code>long long fatorial(int n)</code> recursiva (com caso base 0! = 1). Imprima fatorial(0..6).',
        dica: '<code>if (n <= 1) return 1; return n * fatorial(n-1);</code>',
        solucao: `#include <stdio.h>

long long fatorial(int n)
{
    if (n <= 1) {
        return 1;
    }
    return n * fatorial(n - 1);
}

int main(void)
{
    for (int i = 0; i <= 6; i++) {
        printf("%d! = %lld\\n", i, fatorial(i));
    }
    return 0;
}`,
        solucao_obs: 'Esperado: 0,1,2,6,24,120,720. Use long long para não estourar tão cedo.',
      },
      {
        nivel: 2,
        enunciado:
          'Implemente <code>inserir_ordenado</code>: insere um valor já em ordem crescente na lista. Teste inserindo 30, 10, 20, 25 e imprima após cada inserção (deve terminar em 10 20 25 30).',
        dica: 'Caminhe com um ponteiro duplo até achar o lugar onde o novo nó encaixa.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct No *inserir_ordenado(struct No *lista, int v)
{
    struct No **p = &lista;
    while (*p != NULL && (*p)->valor < v) {
        p = &(*p)->proximo;
    }

    struct No *novo = malloc(sizeof *novo);
    if (novo == NULL) {
        return lista;
    }
    novo->valor = v;
    novo->proximo = *p;
    *p = novo;
    return lista;
}

void imprimir(const struct No *lista)
{
    for (const struct No *q = lista; q != NULL; q = q->proximo) {
        printf("%d ", q->valor);
    }
    printf("\\n");
}

void destruir(struct No *lista)
{
    while (lista != NULL) {
        struct No *q = lista->proximo;
        free(lista);
        lista = q;
    }
}

int main(void)
{
    struct No *lista = NULL;

    lista = inserir_ordenado(lista, 30);
    lista = inserir_ordenado(lista, 10);
    imprimir(lista);
    lista = inserir_ordenado(lista, 20);
    lista = inserir_ordenado(lista, 25);
    imprimir(lista);

    destruir(lista);
    return 0;
}`,
        solucao_obs: 'Esperado: 10 30 na primeira impressão e 10 20 25 30 na final.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva <code>remover_valor</code> (como no exemplo do módulo) e <code>destruir</code>. Teste montando a lista 5→15→25→35, removendo 15 e 35, imprimindo a cada passo, e garantindo que a lista fica 5→25. Depois destrua.',
        dica: 'A remoção religa usando ponteiro para ponteiro; o free é do nó desligado.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct No *criar(int v)
{
    struct No *n = malloc(sizeof *n);
    if (n == NULL) {
        return NULL;
    }
    n->valor = v;
    n->proximo = NULL;
    return n;
}

struct No *remover_valor(struct No *lista, int alvo)
{
    struct No **p = &lista;
    while (*p != NULL && (*p)->valor != alvo) {
        p = &(*p)->proximo;
    }
    if (*p != NULL) {
        struct No *r = *p;
        *p = r->proximo;
        free(r);
    }
    return lista;
}

void imprimir(const struct No *lista)
{
    for (const struct No *q = lista; q != NULL; q = q->proximo) {
        printf("%d ", q->valor);
    }
    printf("\\n");
}

void destruir(struct No *lista)
{
    while (lista != NULL) {
        struct No *q = lista->proximo;
        free(lista);
        lista = q;
    }
}

int main(void)
{
    struct No *lista = criar(5);
    lista->proximo = criar(15);
    lista->proximo->proximo = criar(25);
    lista->proximo->proximo->proximo = criar(35);

    lista = remover_valor(lista, 15);
    lista = remover_valor(lista, 35);
    imprimir(lista);

    destruir(lista);
    return 0;
}`,
        solucao_obs: 'Esperado: 5 25. Remover a cabeça (5) também funcionaria com a mesma lógica.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva <code>int tamanho(struct No *lista)</code> <strong>recursiva</strong> que conta os nós: caso base NULL → 0; senão 1 + tamanho(proximo). Teste com 4 nós.',
        dica: '<code>if (n == NULL) return 0; return 1 + tamanho(n-&gt;proximo);</code>',
        solucao: `#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct No *criar(int v)
{
    struct No *n = malloc(sizeof *n);
    if (n == NULL) {
        return NULL;
    }
    n->valor = v;
    n->proximo = NULL;
    return n;
}

int tamanho(struct No *lista)
{
    if (lista == NULL) {
        return 0;
    }
    return 1 + tamanho(lista->proximo);
}

void destruir(struct No *lista)
{
    while (lista != NULL) {
        struct No *q = lista->proximo;
        free(lista);
        lista = q;
    }
}

int main(void)
{
    struct No *lista = criar(1);
    lista->proximo = criar(2);
    lista->proximo->proximo = criar(3);
    lista->proximo->proximo->proximo = criar(4);

    printf("tamanho = %d\\n", tamanho(lista));

    destruir(lista);
    return 0;
}`,
        solucao_obs: 'A recursão percorre a corrente até o NULL e "sobe" somando 1 por nó.',
      },
      {
        nivel: 4,
        enunciado:
          'Implemente uma <strong>fila</strong> (FIFO: primeiro a entrar, primeiro a sair) com lista encadeada: struct <code>Fila</code> com ponteiros <code>ini</code> e <code>fim</code>; <code>enfileirar</code> adiciona no fim (O(1) graças ao ponteiro fim), <code>desenfileirar</code> remove do início. Teste enfileirando 1,2,3 e desenfileirando tudo.',
        dica: 'O fim é também um nó; ao enfileirar, o atual fim-&gt;proximo aponta para o novo nó.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct Fila {
    struct No *ini;
    struct No *fim;
};

void enfileirar(struct Fila *f, int v)
{
    struct No *novo = malloc(sizeof *novo);
    if (novo == NULL) {
        return;
    }
    novo->valor = v;
    novo->proximo = NULL;

    if (f->fim != NULL) {
        f->fim->proximo = novo;
    } else {
        f->ini = novo;
    }
    f->fim = novo;
}

int desenfileirar(struct Fila *f)
{
    if (f->ini == NULL) {
        return -1;   /* vazia */
    }
    struct No *r = f->ini;
    int v = r->valor;
    f->ini = r->proximo;
    if (f->ini == NULL) {
        f->fim = NULL;
    }
    free(r);
    return v;
}

int main(void)
{
    struct Fila f = {NULL, NULL};

    enfileirar(&f, 1);
    enfileirar(&f, 2);
    enfileirar(&f, 3);

    for (int i = 0; i < 4; i++) {
        printf("%d ", desenfileirar(&f));
    }
    printf("\\n");

    while (f.ini != NULL) {
        (void)desenfileirar(&f);
    }
    return 0;
}`,
        solucao_obs: 'Esperado: 1 2 3 -1 (a fifo respeita a ordem de entrada). O print final esvazia qualquer nó remanescente.',
      },
    ],
    quiz: [
      {
        pergunta: 'O que marca o fim de uma lista encadeada?',
        opcoes: [
          'O índice máximo do array',
          'Um nó cujo proximo é NULL',
          'Um contador de bytes',
          'o tamanho armazenado no nó',
        ],
        correta: 1,
        explicacao: 'O percurso segue proximo até encontrar NULL, o sentinela de fim.',
      },
      {
        pergunta: 'Qual o custo de inserir no início de uma lista encadeada?',
        opcoes: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correta: 2,
        explicacao: 'Cria o nó e ajusta um ponteiro — independente do tamanho da lista.',
      },
      {
        pergunta: 'Por que é criticamente importante executar <code>destruir</code> em listas?',
        opcoes: [
          'Para imprimir mais rápido',
          'Para liberar os nós alocados e não vazar memória',
          'Para ordenar os valores',
          'Não é necessário',
        ],
        correta: 1,
        explicacao: 'Cada nó vem de malloc/free; esquecer a destruição vaza memória.',
      },
      {
        pergunta: 'Em uma pilha (stack), quem sai primeiro?',
        opcoes: [
          'O primeiro a entrar (FIFO)',
          'O último a entrar (LIFO)',
          'O de menor valor',
          'Aleatório',
        ],
        correta: 1,
        explicacao: 'Pilha é LIFO: como empilhar pratos, o último colocado é o primeiro retirado.',
      },
      {
        pergunta: 'Quando a lista encadeada tende a vencer do vetor?',
        opcoes: [
          'Acesso aleatório por índice',
          'Muitas inserções/remoções no meio e tamanho imprevisível',
          'Menor uso de memória sempre',
          'Quando o programa é pequeno',
        ],
        correta: 1,
        explicacao: 'Vetor brilha em índice O(1) e cache; lista brilha em inserções/remoções frequentes sem reallocs.',
      },
    ],
    projeto: {
      titulo: 'Agenda de contatos com lista encadeada',
      descricao:
        'Construa uma agenda com nós de lista encadeada (nome, telefone, struct No *proximo). Menu: (1) adicionar no fim, (2) listar, (3) buscar por nome (reportando o índice do nó), (4) remover por nome, (5) sair. Ao sair, destrua TODA a lista. Desafio extra: decidir e justificar se um vetor dinâmico serviria melhor aqui.',
      criterios: [
        'Estrutura de nó com struct e ponteiros encadeados corretos.',
        'Todas as operações do menu funcionando (adicionar no fim com ponteiro fim, buscar, remover religando).',
        'Garantia de que a lista é destruída no fim (sem vazamentos).',
        'Menus com enum/switch e leitura robusta com fgets.',
        'Compila com -Wall -Wextra sem avisos.',
      ],
    },
  },
];