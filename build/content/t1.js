// Trilha 1 — Fundamentos
module.exports = [
  {
    trilha: '1',
    numero: '01',
    titulo: 'Introdução à linguagem C',
    subtitulo: 'história, filosofia e o porquê de o C continuar relevante',
    objetivo:
      'Entender de onde vem o C, por que ele segue dominando sistemas, kernels e embarcados, e o que significa a filosofia de "confiar no programador". Você também reapresenta seu primeiro programa completo e revisa a jornada do código ao executável.',
    prerequisitos: 'Trilha 0 (Setup)',
    duracao: '~30 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Capítulos 1 e 2 — Getting Started, Hello World e o que esperar da linguagem',
      king: 'Capítulos 1 e 2.1–2.2 — Programação em C e ciclo compilar–linkar',
      foco:
        'No Beej, leia os dois primeiros capítulos de leve, rode o Hello World e folheie as seções "Quick Start". No King, vá direto à estrutura de um programa e à diferença entre compilação e linkagem—sem se preocupar com detalhes de sintaxe ainda.',
    },
    secoes: [
      {
        titulo: 'Uma linguagem de 1972 que roda o mundo',
        rotulo: 'nascimento do C',
        paragrafos: [
          'O C nasceu nos <strong>Bell Labs</strong>, nos Estados Unidos, durante os anos 1970. <strong>Dennis Ritchie</strong> o criou a partir do B (que deriva do BCPL), com um objetivo bem prático: reescrever o sistema operacional <strong>Unix</strong>, que até então era escrito em assembly. Para escrever um SO portátil, Ritchie precisava de uma linguagem que fosse rápida quanto assembly, mas legível e portável como as linguagens de alto nível.',
          'O C "decolou" junto com o Unix: como o SO era escrito em C, qualquer máquina que tivesse um compilador C podia rodar o Unix. Da Bell Labs, a linguagem se espalhou pelas universidades e depois pela indústria inteira.',
        ],
        lista: [
          '<strong>1972</strong> — primeiras versões do C, ainda junto ao Unix (PDP-11).',
          '<strong>1978</strong> — livro clássico de Kernighan &amp; Ritchie (<em>The C Programming Language</em>), o famoso "K&amp;R".',
          '<strong>1989/1990</strong> — padronização oficial (ANSI C / C89, depois ISO C90).',
          '<strong>1999</strong> — padrão C99 (designated initializers, <code>//</code> para comentário, variantes de tipos).',
          '<strong>2011</strong> — padrão C11, o que usamos neste curso (<code>_Bool</code>, <code>_Static_assert</code>).',
          '<strong>2018 / 2023</strong> — C17 (correções) e C23 (última revisão).',
        ],
      },
      {
        titulo: 'Por que C segue na frente',
        rotulo: 'relevância',
        paragrafos: [
          'Décadas depois, o C continua entre as linguagens mais usadas do mundo — ocupa regularmente o topo de rankings como o <strong>TIOBE</strong>. O motivo é que ele resolve, com precisão e previsibilidade, problemas que quase nenhuma outra linguagem resolve:',
        ],
        lista: [
          '<strong>Kernels de sistemas operacionais</strong> — Linux, Windows, macOS: o núcleo é escrito em C.',
          '<strong>Embarcados e IoT</strong> — microcontroladores com KB de memória não suportam máquina virtual; sobra espaço só para C (e assembly).',
          '<strong>Compiladores e interpretadores</strong> — inclusive vários compiladores de linguagens "modernas".',
          '<strong>Bibliotecas de alto desempenho</strong> — de banco de dados a motores de jogo, os "miolos" caros são C/C++.',
          '<strong>Camadas de baixo nível</strong> — drivers, firmware, protocolos de rede. É onde "a borracha pega".',
        ],
      },
      {
        titulo: 'Filosofia: "o C confia em você"',
        rotulo: 'filosofia',
        paragrafos: [
          'Ao contrário de linguagens que seguram sua mão (Java, Python, Go), o C <em>assume que você sabe o que está fazendo</em>. Ele permite acessar a memória diretamente, não cria "garbage collector" e não esconde o que o processador realmente faz. Consequência: você ganha <strong>velocidade e controle</strong>, e paga com <strong>responsabilidade</strong>.',
          'Na prática, isso aparece em situações como: escrever além do fim de um vetor <del>compila</del>? não: <strong>compila, mas o comportamento é indefinido</strong>; somar dois inteiros que estouram o limite "silenciosamente"; comparar com <code>=</code> em vez de <code>==</code>. O C não vai te impedir — cabe a você se cuidar (e a nós, ensiná-lo a se cuidar).',
          'Essa é a mesma razão pela qual a <em>Trilha 4 (Cyber)</em> deste curso existe: bugs de C se tornam vulnerabilidades. Entender bem o C é entender segurança ofensiva e defensiva.',
        ],
      },
      {
        titulo: 'O que você consegue fazer com C',
        rotulo: 'o que dá para fazer',
        lista: [
          'Escrever utilitários de linha de comando (o que você fará até o fim desta trilha).',
          'Programar microcontroladores e robôs (Arduino, ESP32, ...).',
          'Implementar estruturas de dados e algoritmos do zero, sem depender de frameworks.',
          'Ler e manipular dados brutos: arquivos, rede (sockets), formatos binários.',
          'Construir sua própria linguagem, emulador ou sistema operacional.',
          'Entrar a fundo em segurança: análise de binários, exploits, engenharia reversa.',
        ],
        paragrafos: [
          'Neste curso você vai do "olá, mundo" a um utilitário de linha de comando completo no módulo 1.12 — tudo com o gcc e o terminal que você já configurou na Trilha 0.',
        ],
      },
      {
        titulo: 'Seu programa de novo, agora com atenção',
        rotulo: 'hello de novo',
        paragrafos: [
          'Compile e rode o programa abaixo. Repare que ele é idêntico em estrutura a qualquer outro programa C: a diretiva <code>#include</code> traz a biblioteca, a função <code>main</code> é o ponto de entrada, as instruções terminam com <code>;</code> e o <code>return 0</code> sinaliza sucesso para o sistema operacional.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    printf("Olá, mundo!\\n");
    printf("Trilha 1 começa aqui\\n");
    return 0;
}`,
        saida: `Olá, mundo!
Trilha 1 começa aqui`,
      },
      {
        titulo: 'Do código ao executável (recapitulando)',
        rotulo: 'ciclo de compilação',
        paragrafos: [
          'Você já viu isso na Trilha 0, mas vale fixar o ciclo. C é uma linguagem <strong>compilada</strong>: você escreve o texto em um arquivo <code>.c</code>, o gcc traduz tudo para código de máquina e <em>então</em> você executa o resultado. Diferente de linguagens interpretadas, que leem e executam linha a linha "na hora".',
        ],
        lista: [
          '<code>gcc -Wall -Wextra -std=c11 hello.c -o hello</code> — compila e linka, gerando <code>hello.exe</code>.',
          '<code>.\\hello.exe</code> — executa o programa, que roda a função <code>main</code>.',
          'Erros de sintaxe aparecem <em>na compilação</em>; erros de lógica aparecem <em>na execução</em>. Esta distinção será vital no módulo 1.11.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Modifique o programa <code>hello.c</code> para imprimir seu primeiro nome na primeira linha e a cidade onde você mora na segunda. Compile com <code>-Wall -Wextra</code> e garanta zero avisos.',
        dica: 'Dois <code>printf</code> separados bastam; só não esqueça o <code>\\n</code> de cada linha.',
        solucao: `#include <stdio.h>

int main(void)
{
    printf("Maria\\n");
    printf("Recife\\n");
    return 0;
}`,
        solucao_obs: 'Troque os nomes por você mesmo(a). O importante é o fluxo: editar, compilar, executar, ver a saída.',
      },
      {
        nivel: 1,
        enunciado:
          'Escreva um programa que imprime um triângulo de quatro linhas de asteriscos: começa com 1 e termina com 4 asteriscos.',
        dica: 'Cada linha é um <code>printf</code> com o número certo de <code>*</code> seguido de <code>\\n</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    printf("*\\n");
    printf("**\\n");
    printf("***\\n");
    printf("****\\n");
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Use <code>printf</code> para montar uma mini tabela de preços com duas colunas (item e preço) separadas por um caractere de tabulação <code>\\t</code>. Ex.: <code>Caneta\\t2.50</code>.',
        dica: 'O caractere de tabulação é escrito em C como <code>\\t</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    printf("Item\\tPreco\\n");
    printf("Caneta\\t2.50\\n");
    printf("Lapis\\t1.90\\n");
    printf("Total\\t4.40\\n");
    return 0;
}`,
        solucao_obs: 'A tabulação alinha as colunas sem você contar espaços na mão.',
      },
      {
        nivel: 2,
        enunciado:
          'Sem rodar, escreva no papel a saída do programa abaixo. Depois compile, rode e compare: <code>printf("2 + 2 = %d\\n", 4);</code> e <code>printf("%d + %d = %d\\n", 2, 2, 4);</code>.',
        dica: '<code>%d</code> é o lugar onde o número entra no texto.',
        solucao: `#include <stdio.h>

int main(void)
{
    printf("2 + 2 = %d\\n", 4);
    printf("%d + %d = %d\\n", 2, 2, 4);
    return 0;
}`,
        solucao_obs: 'Os dois <code>printf</code> produzem exatamente a mesma linha. <code>%d</code> substitui o valor do argumento no texto.',
      },
    ],
    quiz: [
      {
        pergunta: 'Quem é considerado o principal criador da linguagem C?',
        opcoes: ['Dennis Ritchie', 'Ken Thompson', 'Brian Kernighan', 'Bjarne Stroustrup'],
        correta: 0,
        explicacao: 'Dennis Ritchie criou o C nos Bell Labs nos anos 1970, a partir do B de Ken Thompson.',
      },
      {
        pergunta: 'Onde e quando o C nasceu?',
        opcoes: [
          'Nos Bell Labs, nos anos 1970',
          'Na Microsoft, nos anos 1980',
          'No MIT, nos anos 1960',
          'No Google, nos anos 1990',
        ],
        correta: 0,
        explicacao: 'Bell Labs, anos 1970, com objetivos ligados ao sistema Unix.',
      },
      {
        pergunta: 'Por que o C continua tão usado hoje?',
        opcoes: [
          'É a base de kernels, embarcados e bibliotecas de alto desempenho',
          'É a linguagem mais nova do mercado',
          'Substituiu completamente o assembly em drivers críticos',
          'Só existe por motivos históricos',
        ],
        correta: 0,
        explicacao: 'C domina onde importa velocidade e controle de baixo nível: SOs, microcontroladores e bibliotecas rápidas.',
      },
      {
        pergunta: 'A filosofia "confiar no programador" significa que...',
        opcoes: [
          'o C permite acesso de baixo nível e assume que você sabe o que faz',
          'o compilador corrige sozinho todos os seus erros',
          'o C impede qualquer erro de memória em tempo de execução',
          'o C exige um garbage collector para rodar',
        ],
        correta: 0,
        explicacao: 'O C não segura sua mão: acesso direto à memória, sem coletor de lixo, com consequências nas suas mãos.',
      },
      {
        pergunta: 'O que significa dizer que C é uma linguagem compilada?',
        opcoes: [
          'o código é traduzido para código de máquina antes de executar',
          'o código é executado linha a linha por um interpretador',
          'o código precisa de um navegador para rodar',
          'o código não precisa de compilador',
        ],
        correta: 0,
        explicacao: 'O gcc traduz o .c para código de máquina e então o executável roda.',
      },
    ],
  },
  {
    trilha: '1',
    numero: '02',
    titulo: 'Variáveis, tipos e atribuição',
    subtitulo: 'declarando, nomeando e dando valores',
    objetivo:
      'Aprender o conceito de variável como "caixa nomeada e tipada" de memória, conhecer os tipos básicos int/char/float/double, dominar atribuição e inicialização, respeitar as regras de nomenclatura e entender a diferença entre constante literal e macro #define.',
    prerequisitos: 'T1.01',
    duracao: '~35 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Seção 3.1 — Variables',
      king: 'Seções 2.4–2.7 — Variáveis, atribuição e leitura de entrada',
      foco:
        'No Beej, foque nas primeiras páginas de variáveis (declaração, tipos e atribuição). No King, leia as seções sobre tipos básicos e inicialização; pule as partes de scanf (que é só no nosso módulo 03).',
    },
    secoes: [
      {
        titulo: 'Variáveis: caixas nomeadas com tipo',
        rotulo: 'ideia central',
        paragrafos: [
          'Uma <strong>variável</strong> é um espaço de memória que você dá um nome e um <strong>tipo</strong>. O tipo diz quantos bytes aquela "caixa" ocupa e como interpretar o conteúdo. Você manipula variáveis pelo nome; quem cuida de "onde na memória ela vive" é o compilador.',
        ],
        lista: [
          '<code>int</code> — número inteiro (ex.: <code>-42</code>, <code>0</code>, <code>1000</code>).',
          '<code>char</code> — um único caractere (ex.: <code>\'A\'</code>, <code>\'7\'</code>, <code>\'¥\'</code>).',
          '<code>float</code> — número de ponto flutuante (ex.: <code>3.14f</code>).',
          '<code>double</code> — ponto flutuante com mais precisão (é o mais usado para "números reais").',
          'Há ainda <code>short</code>, <code>long</code>, <code>unsigned</code> etc. — todos serão explorados a fundo no módulo 07.',
        ],
      },
      {
        titulo: 'Declarar, atribuir, inicializar',
        rotulo: 'primeiro programa de tipos',
        paragrafos: [
          '<strong>Declarar</strong> é criar a variável: <code>tipo nome;</code>. <strong>Atribuir</strong> é guardar um valor nela: <code>nome = valor;</code>. <strong>Inicializar</strong> é fazer os dois de uma vez: <code>int idade = 25;</code>. O programa abaixo mostra os quatro tipos básicos em ação:',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int idade = 25;
    char inicial = 'D';
    float altura = 1.75f;
    double precisao = 3.141592653589793;

    printf("idade: %d\\n", idade);
    printf("inicial: %c\\n", inicial);
    printf("altura: %.2f\\n", altura);
    printf("precisao: %.12f\\n", precisao);
    return 0;
}`,
        saida: `idade: 25
inicial: D
altura: 1.75
precisao: 3.141592653590`,
        paragrafos_fim: [
          'Repare nos detalhes: o literal <code>1.75f</code> tem o sufixo <code>f</code> para ser um <code>float</code> (sem sufixo, o literal é <code>double</code>); <code>%c</code> imprime um caractere; <code>%.2f</code> e <code>%.12f</code> controlam as casas decimais. Os formatos <code>%d</code>, <code>%f</code>, <code>%c</code> são alvo do módulo 03 — aqui só precisamos do básico.',
        ],
      },
      {
        titulo: 'Regras para nomes (identificadores)',
        rotulo: 'regras de nome',
        paragrafos: [
          'O nome de uma variável é um <strong>identificador</strong>, e obedece a regras rígidas:',
        ],
        lista: [
          'Letras (<code>a–z</code>, <code>A–Z</code>), dígitos (<code>0–9</code>) e sublinhado <code>_</code>, mas o primeiro caractere não pode ser dígito.',
          'Não pode ser uma palavra reservada (veja a próxima seção).',
          'Maiúsculas e minúsculas são diferentes: <code>Nota</code> e <code>nota</code> são variáveis distintas.',
          'Por convenção, variáveis em C usam letras minúsculas: <code>mediaFinal</code> ou <code>media_final</code> (escolha um estilo e seja consistente).',
          'Nomes que começam com <code>_</code> ou com <code>__</code> são reservados ao sistema — evite.',
        ],
      },
      {
        titulo: 'Palavras reservadas e constante "não nomeada"',
        rotulo: 'reservadas',
        paragrafos: [
          'A linguagem reserva certo conjunto de palavras — você não pode usá-las como nome de variável:',
        ],
        lista: [
          '<code>auto</code> <code>break</code> <code>case</code> <code>char</code> <code>const</code> <code>continue</code> <code>default</code> <code>do</code> <code>double</code> <code>else</code> <code>enum</code> <code>extern</code> <code>float</code> <code>for</code> <code>goto</code> <code>if</code> <code>int</code> <code>long</code> <code>register</code> <code>return</code> <code>short</code> <code>signed</code> <code>sizeof</code> <code>static</code> <code>struct</code> <code>switch</code> <code>typedef</code> <code>union</code> <code>unsigned</code> <code>void</code> <code>volatile</code> <code>while</code>',
          'O padrão C11 ainda reserva palavras com sublinhado (<code>_Bool</code>, <code>_Complex</code>, <code>_Static_assert</code>...).',
          'Uma <strong>constante literal</strong> é um valor escrito direto no código: <code>25</code>, <code>3.14</code>, <code>\'A\'</code>. Ela não é uma variável.',
          '<strong>Não confunda</strong> constantes com <code>#define</code>: <code>#define MAX 100</code> é uma <em>macro do pré-processador</em>, um "troca-texto" que acontece antes de compilar — não é uma constante da linguagem. Ela é útil, mas é outra categoria (a veremos a fundo na Trilha 2).',
        ],
      },
      {
        titulo: 'Programa: média simples',
        rotulo: 'media.c',
        paragrafos: [
          'Vamos calcular a média de duas notas. A divisão por <code>2.0</code> (com vírgula e zero) garante que a operação é de ponto flutuante — se dividíssemos por <code>2</code>, com inteiros, o resultado seria truncado (assunto do módulo 04):',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    double nota1 = 7.5;
    double nota2 = 8.0;
    double media = (nota1 + nota2) / 2.0;

    printf("nota 1: %.1f\\n", nota1);
    printf("nota 2: %.1f\\n", nota2);
    printf("media: %.2f\\n", media);
    return 0;
}`,
        saida: `nota 1: 7.5
nota 2: 8.0
media: 7.75`,
      },
      {
        titulo: 'Programa: troca de valores',
        rotulo: 'troca.c',
        paragrafos: [
          'Trocar o conteúdo de duas variáveis é uma operação clássica. A intuição errada é fazer <code>a = b;</code> logo de cara — isso destruiria o valor original de <code>a</code>. A receita certa usa uma <strong>variável temporária</strong>:',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int a = 10;
    int b = 20;
    int temp;

    printf("antes: a=%d b=%d\\n", a, b);

    temp = a;
    a = b;
    b = temp;

    printf("depois: a=%d b=%d\\n", a, b);
    return 0;
}`,
        saida: `antes: a=10 b=20
depois: a=20 b=10`,
        paragrafos_fim: [
          'A variável <code>temp</code> guarda o valor de <code>a</code> antes que <code>a</code> seja sobrescrito. Sem ela, o valor original se perde.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Declare variáveis para sua idade (<code>int</code>), a letra inicial do seu nome (<code>char</code>), sua altura em metros (<code>double</code>) e imprima as três com <code>printf</code>.',
        dica: 'Inicialize cada uma na declaração e use <code>%d</code>, <code>%c</code> e <code>%.2f</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    int idade = 30;
    char inicial = 'M';
    double altura = 1.72;

    printf("idade: %d\\n", idade);
    printf("inicial: %c\\n", inicial);
    printf("altura: %.2f m\\n", altura);
    return 0;
}`,
      },
      {
        nivel: 1,
        enunciado:
          'Calcule a média de quatro notas (7.0, 8.5, 6.25, 9.0) guardadas em quatro variáveis <code>double</code> e imprima a média com duas casas decimais.',
        dica: 'Lembre de dividir por <code>4.0</code>, não por <code>4</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    double n1 = 7.0;
    double n2 = 8.5;
    double n3 = 6.25;
    double n4 = 9.0;
    double media = (n1 + n2 + n3 + n4) / 4.0;

    printf("media: %.2f\\n", media);
    return 0;
}`,
        solucao_obs: '7.0 + 8.5 + 6.25 + 9.0 = 30.75; 30.75 / 4 = 7.6875.',
      },
      {
        nivel: 2,
        enunciado:
          'Escreva um programa que troca os valores de <code>x</code> e <code>y</code> <em>sem</em> declarar variável temporária: use apenas somas e subtrações entre eles (<code>x = x + y</code>). Teste com <code>x = 3</code>, <code>y = 5</code>.',
        dica: 'Depois de <code>x = x + y</code>, faça <code>y = x - y</code> e por fim <code>x = x - y</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    int x = 3;
    int y = 5;

    printf("antes: x=%d y=%d\\n", x, y);

    x = x + y;
    y = x - y;
    x = x - y;

    printf("depois: x=%d y=%d\\n", x, y);
    return 0;
}`,
        solucao_obs: 'Funciona para inteiros, mas cuidado com overflow para valores muito grandes — a variável temporária é mais segura e legível.',
      },
      {
        nivel: 2,
        enunciado:
          'Um produto custa 120.00 e recebe 10% de desconto. Declare preço, percentual e desconto em <code>double</code>; calcule e imprima o valor do desconto e o preço final, ambos com duas casas.',
        dica: 'desconto = preco * percentual / 100.0.',
        solucao: `#include <stdio.h>

int main(void)
{
    double preco = 120.00;
    double percentual = 10.0;
    double desconto = preco * percentual / 100.0;
    double final = preco - desconto;

    printf("desconto: R$ %.2f\\n", desconto);
    printf("preco final: R$ %.2f\\n", final);
    return 0;
}`,
      },
    ],
    quiz: [
      {
        pergunta: 'Qual a declaração + inicialização correta de uma variável do tipo inteiro?',
        opcoes: ['int idade = 19;', 'integer idade = 19;', 'int idade = 19', 'var idade := 19;'],
        correta: 0,
        explicacao: 'Em C: <code>tipo nome = valor;</code>. A opção C esquece o ponto e vírgula.',
      },
      {
        pergunta: 'Qual destes NÃO é um nome de variável válido em C?',
        opcoes: ['_temp', 'temp2', '2temp', 'Temp_2'],
        correta: 2,
        explicacao: 'Um identificador não pode começar com dígito.',
      },
      {
        pergunta: 'Qual afirmativa sobre <code>#define MAX 100</code> está correta?',
        opcoes: [
          'É uma macro do pré-processador que troca texto antes de compilar',
          'É uma variável constante do tipo int',
          'Cria uma variável que ocupa memória',
          'Só pode ser usada dentro de funções',
        ],
        correta: 0,
        explicacao: '<code>#define</code> é substituição textual feita pelo pré-processador; não é uma constante/variável da linguagem.',
      },
      {
        pergunta: 'Com <code>int a = 10; int b = 20; int temp = a; a = b; b = temp;</code>, ao final tem-se:',
        opcoes: ['a=20, b=10', 'a=10, b=20', 'a=20, b=20', 'a=10, b=10'],
        correta: 0,
        explicacao: 'A troca clássica: temp guarda a (10), a recebe b (20), b recebe o valor guardado (10).',
      },
      {
        pergunta: 'Qual tipo devo usar para guardar o número 3.141592653589793 com precisão?',
        opcoes: ['double', 'int', 'char', 'não é possível em C'],
        correta: 0,
        explicacao: 'O <code>double</code> é o tipo de ponto flutuante de alta precisão padrão do C para "reais".',
      },
    ],
    projeto: {
      titulo: 'Crachá digital',
      descricao:
        'Crie um programa <code>cracha.c</code> que representa "você" com variáveis dos quatro tipos básicos: a letra inicial do nome (<code>char</code>), a idade (<code>int</code>), a altura (<code>double</code>) e uma "nota de motivação" 0–10 (<code>double</code>). Imprima um crachá em várias linhas usando <code>printf</code>, com o nome do projeto centrado e cada dado em sua linha. Depois, troque os valores das variáveis para representar outra pessoa e mostre que o mesmo código "atualiza" o crachá.',
      criterios: [
        'Declara as 4 variáveis com tipos corretos, inicializadas.',
        'Imprime um crachá legível com os dados em linhas separadas.',
        'A troca para a "segunda pessoa" usa novas atribuições às mesmas variáveis.',
        'Compila com <code>gcc -Wall -Wextra -std=c11 cracha.c -o cracha</code> sem erros nem avisos.',
      ],
    },
  },
  {
    trilha: '1',
    numero: '03',
    titulo: 'Entrada e saída formatada: printf e scanf',
    subtitulo: 'conversões, largura, precisão e leitura do teclado',
    objetivo:
      'Dominar o <code>printf</code> (especificadores %d/%f/%c/%s/%x, largura, precisão, alinhamento, escapes) e aprender o básico do <code>scanf</code> para ler números do teclado — usando o <code>&</code> como "pega o endereço", sem entrar em ponteiros ainda.',
    prerequisitos: 'T1.02',
    duracao: '~45 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Seção 3.2 — printf e scanf (somente a parte de entrada e saída)',
      king: 'Capítulo 3 — Input/Output formatado',
      foco:
        'No Beej, estude a tabela de especificadores e os exemplos de printf; o scanf leia com calma entendendo o papel do &. No King, capítulo 3 inteiro — principalmente as tabelas de conversão e os exemplos de leitura.',
    },
    secoes: [
      {
        titulo: 'printf: o conversor de valores em texto',
        rotulo: 'conversões',
        paragrafos: [
          'O <code>printf</code> recebe um texto com "buracos" chamados de <strong>especificadores de conversão</strong> e, depois, os valores que preenchem esses buracos. Cada especificador começa com <code>%</code> e termina com uma letra que diz o tipo:',
        ],
        lista: [
          '<code>%d</code> — inteiro decimal (<code>int</code>).',
          '<code>%x</code> — inteiro em <em>hexadecimal</em> (<code>%X</code> em maiúsculas).',
          '<code>%f</code> — ponto flutuante (<code>double</code>/<code>float</code>).',
          '<code>%c</code> — um caractere (<code>char</code>).',
          '<code>%s</code> — uma sequência de caracteres (texto).',
          '<code>%%</code> — imprime um <code>%</code> literal (para não abrir um novo buraco).',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int n = 255;
    double pi = 3.14159;
    char letra = 'Z';

    printf("inteiro: %d\\n", n);
    printf("hexadecimal: %x\\n", n);
    printf("real: %f\\n", pi);
    printf("real com 2 casas: %.2f\\n", pi);
    printf("um char: %c\\n", letra);
    printf("uma frase: %s\\n", "Aprenda C");
    printf("porcentagem: %%\\n");
    return 0;
}`,
        saida: `inteiro: 255
hexadecimal: ff
real: 3.141590
real com 2 casas: 3.14
um char: Z
uma frase: Aprenda C
porcentagem: %`,
      },
      {
        titulo: 'Largura, precisão e alinhamento',
        rotulo: 'formatando colunas',
        paragrafos: [
          'Você pode controlar <em>todo</em> o visual: a largura mínima do campo, as casas decimais e o alinhamento.',
        ],
        lista: [
          '<code>%5d</code> — no mínimo 5 caracteres de largura (preenche com espaços à esquerda).',
          '<code>%-5d</code> — largura mínima, alinhado à <strong>esquerda</strong> (o <code>-</code> muda de lado).',
          '<code>%05d</code> — preenche com <strong>zeros</strong> em vez de espaços.',
          '<code>%.2f</code> — exatamente 2 casas decimais.',
          '<code>%8.2f</code> — largura 8 e 2 casas decimais.',
          '<code>%-8.2f</code> — o mesmo, alinhado à esquerda.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int n = 42;
    double r = 3.14159;

    printf("[%5d]\\n", n);
    printf("[%-5d]\\n", n);
    printf("[%05d]\\n", n);
    printf("[%8.2f]\\n", r);
    printf("[%-8.2f]\\n", r);
    return 0;
}`,
        saida: `[   42]
[42   ]
[00042]
[    3.14]
[3.14    ]`,
      },
      {
        titulo: 'scanf: lendo do teclado (e o mistério do &)',
        rotulo: 'lendo com scanf',
        paragrafos: [
          'Se <code>printf</code> traduz valores em texto, o <code>scanf</code> faz o caminho inverso: lê texto digitado e guarda em uma variável.',
        ],
        lista: [
          '<code>int a;</code> <code>scanf("%d", &a);</code> — lê um inteiro e guarda em <code>a</code>.',
          '<code>double x;</code> <code>scanf("%lf", &x);</code> — lê um real; <strong>repare no <code>lf</code></strong> (é o especificador de leitura de <code>double</code>).',
          'Para <code>float</code> usa-se <code>%f</code> na leitura.',
        ],
        paragrafos_fim: [
          'O <code>&amp;</code> (comercial) antes da variável significa <strong>"pega o endereço da variável"</strong>: o <code>scanf</code> precisa saber onde guardar o valor lido. Isso envolve ponteiros — a fofoca completa fica para a Trilha 2. Por enquanto, a regra é: <em>variável simples em scanf sempre leva <code>&amp;</code></em>. Esquecer é um dos bugs mais clássicos (veremos no módulo 1.11).',
        ],
      },
      {
        titulo: 'Sequências de escape',
        rotulo: 'escapes',
        paragrafos: [
          'Dentro de uma string, uma barra invertida seguida de um caractere dá origem a um <strong>escape</strong> — um caractere especial que não dá para digitar "cru" no texto:',
        ],
        lista: [
          '<code>\\n</code> — quebra de linha (newline).',
          '<code>\\t</code> — tabulação (tab).',
          '<code>\\\\</code> — uma barra invertida literal.',
          '<code>\\"</code> — aspas duplas dentro da string.',
          '<code>\\0</code> — o caractere nulo (veremos com strings, na Trilha 2).',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    printf("Linha 1\\nLinha 2\\n");
    printf("Coluna\\tTab\\n");
    printf("Contrabarra: \\\\ \\n");
    printf("Aspas: \\"C\\"\\n");
    return 0;
}`,
        saida: `Linha 1
Linha 2
Coluna	Tab
Contrabarra: \ 
Aspas: "C"`,
      },
      {
        titulo: 'O perigo do tipo errado no printf',
        rotulo: 'formato errado',
        paragrafos: [
          'Especificador e valor devem casar. Imprimir um <code>double</code> com <code>%d</code>, ou passar um <code>int</code> onde o formato espera <code>%f</code>, é <strong>comportamento indefinido</strong>: pode sair lixo na tela em uma execução e outra coisa diferente na seguinte. A boa notícia: com a flag <code>-Wall</code>, o gcc aponta a maioria desses erros de formato com um warning — corrija até zerar avisos.',
          'Regra prática: <code>int</code> → <code>%d</code>; <code>char</code> → <code>%c</code>; <code>double</code>/<code>float</code> → <code>%f</code> (no printf). Lendo no scanf: <code>double</code> → <code>%lf</code>, <code>float</code> → <code>%f</code>.',
        ],
      },
      {
        titulo: 'Programa: conversor de temperatura',
        rotulo: 'temperatura.c',
        paragrafos: [
          'Vamos juntar tudo: ler um valor de Celsius do teclado, converter para Fahrenheit e imprimir formatado.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    double celsius;

    printf("Temperatura em Celsius: ");
    scanf("%lf", &celsius);

    printf("%.2f C = %.2f F\\n", celsius, celsius * 9.0 / 5.0 + 32.0);
    return 0;
}`,
        saida: `Temperatura em Celsius: 37.5
37.50 C = 99.50 F`,
      },
      {
        titulo: 'Programa: calculadora de área do círculo',
        rotulo: 'area.c',
        paragrafos: [
          'E um leitor de raio + cálculo de área. Usamos a constante 3.14159 para não depender de biblioteca matemática nesta trilha.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    double raio, area;

    printf("Raio do circulo: ");
    scanf("%lf", &raio);

    area = 3.14159 * raio * raio;
    printf("area: %.2f\\n", area);
    return 0;
}`,
        saida: `Raio do circulo: 2
area: 12.57`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Leia dois números inteiros e imprima a soma e o produto deles, cada um em uma linha com uma frase.',
        dica: 'Dois <code>scanf("%d", &a)</code> e <code>scanf("%d", &b)</code> resolvem.',
        solucao: `#include <stdio.h>

int main(void)
{
    int a, b;

    printf("Digite o primeiro numero: ");
    scanf("%d", &a);
    printf("Digite o segundo numero: ");
    scanf("%d", &b);

    printf("soma: %d\\n", a + b);
    printf("produto: %d\\n", a * b);
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Leia um número real e imprima-o de três formas: com 3 casas decimais, com largura 10 (alinhado à direita) e com largura 10 alinhado à esquerda. Use colchetes para enxergar as larguras.',
        dica: '<code>%.3f</code>, <code>%10.3f</code> e <code>%-10.3f</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    double x;

    printf("Digite um numero real: ");
    scanf("%lf", &x);

    printf("[%.3f]\\n", x);
    printf("[%10.3f]\\n", x);
    printf("[%-10.3f]\\n", x);
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Leia uma temperatura em Fahrenheit e converta para Celsius usando a fórmula C = (F - 32) * 5 / 9. Imprima com 1 casa decimal.',
        dica: 'Cuidado para não misturar inteiros na fórmula: escreva <code>(f - 32.0) * 5.0 / 9.0</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    double f, c;

    printf("Temperatura em Fahrenheit: ");
    scanf("%lf", &f);

    c = (f - 32.0) * 5.0 / 9.0;
    printf("%.1f F = %.1f C\\n", f, c);
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Leia duas notas e imprima a média ponderada, onde a primeira tem peso 2 e a segunda peso 3, com 2 casas decimais.',
        dica: 'média ponderada = (n1*peso1 + n2*peso2) / (peso1 + peso2).',
        solucao: `#include <stdio.h>

int main(void)
{
    double n1, n2, media;

    printf("Nota 1: ");
    scanf("%lf", &n1);
    printf("Nota 2: ");
    scanf("%lf", &n2);

    media = (n1 * 2.0 + n2 * 3.0) / (2.0 + 3.0);
    printf("media ponderada: %.2f\\n", media);
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Leia um número inteiro e imprima-o em decimal (<code>%d</code>), em hexadecimal (<code>%x</code>) e em octal (<code>%o</code>), com as palavras "dec:", "hex:" e "oct:" antes.',
        dica: '<code>%o</code> imprime em octal, assim como <code>%x</code> imprime em hexadecimal.',
        solucao: `#include <stdio.h>

int main(void)
{
    int n;

    printf("Digite um numero: ");
    scanf("%d", &n);

    printf("dec: %d\\n", n);
    printf("hex: %x\\n", n);
    printf("oct: %o\\n", n);
    return 0;
}`,
        solucao_obs: 'Para 26: decimal 26, hexadecimal 1a, octal 32.',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual especificador imprime um int em hexadecimal?',
        opcoes: ['%x', '%d', '%h', '%c'],
        correta: 0,
        explicacao: '<code>%x</code> exibe o inteiro em hexadecimal (minúsculas).',
      },
      {
        pergunta: 'O que a expressão <code>printf("%.2f", 3.14159)</code> imprime?',
        opcoes: ['3.14', '3.14159', '314', '3.1'],
        correta: 0,
        explicacao: 'A precisão <code>.2</code> limita o número a 2 casas decimais.',
      },
      {
        pergunta: 'Afirmativa correta sobre o <code>&</code> no <code>scanf("%d", &x)</code>:',
        opcoes: [
          'significa "pega o endereço da variável" — o scanf precisa saber onde guardar o valor',
          'soma o valor lido com a variável',
          'é opcional quando a variável é int',
          'imprime o valor na tela',
        ],
        correta: 0,
        explicacao: 'O & fornece o endereço da variável para o scanf gravar; detalhes de ponteiro ficam para a Trilha 2.',
      },
      {
        pergunta: 'Para ler um <code>double</code> com scanf, usa-se:',
        opcoes: ['%lf', '%f', '%d', '%double'],
        correta: 0,
        explicacao: 'Na leitura, <code>double</code> usa <code>%lf</code>; <code>float</code> usa <code>%f</code>.',
      },
      {
        pergunta: 'Qual sequência de escape representa uma barra invertida literal dentro de uma string C?',
        opcoes: ['\\\\', '/', '\\b', '\\]'],
        correta: 0,
        explicacao: '<code>\\\\</code> no código C produz uma única barra invertida impressa.',
      },
    ],
    projeto: {
      titulo: 'Conta de restaurante',
      descricao:
        'Crie <code>conta.c</code> que lê o valor do consumo (double), a taxa de serviço em % (ex.: 10) e o número de pessoas (int); o programa calcula e imprime o total com serviço e o valor por pessoa, formatados em uma "nota" com larguras e 2 casas decimais. Persona: você é o sistema de um restaurante simples.',
      criterios: [
        'Lê os três dados com <code>scanf</code> (com <code>&</code> na variável certa).',
        'Calcula serviço, total e divisão por pessoa.',
        'Imprime como uma nota: cada item em uma linha, valores em colunas alinhadas (largura fixa).',
        'Compila com <code>-Wall -Wextra -std=c11</code> sem avisos.',
      ],
    },
  },
  {
    trilha: '1',
    numero: '04',
    titulo: 'Operadores e expressões',
    subtitulo: 'aritmética, precedência, atribuições compostas e lógica',
    objetivo:
      'Dominar a aritmética de C (inclusive a diferença entre divisão inteira e real), a prioridade entre operadores, as atribuições compostas, o incremento/decremento e os operadores relacionais e lógicos com seu curto-circuito.',
    prerequisitos: 'T1.03',
    duracao: '~40 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Seção 3.2 — operadores e expressões',
      king: 'Capítulo 4 — Expressões',
      foco:
        'No King, capítulo 4 é ouro: leia com muita atenção as seções sobre divisão inteira, operadores de incremento e a tabela de precedência. No Beej, a seção de operadores do tutorial serve como resumo rápido.',
    },
    secoes: [
      {
        titulo: 'Aritmética: + - * / %',
        rotulo: 'operadores aritméticos',
        paragrafos: [
          'Os cinco operadores aritméticos do C são <code>+ - * / %</code>. O último, <code>%</code>, é o <strong>resto da divisão inteira</strong> (também chamado de módulo): <code>7 % 3</code> vale <code>1</code>, porque 7 dividido por 3 dá 2 com resto 1.',
          'A divisão merece destaque: com dois inteiros, <code>/</code> faz <strong>divisão inteira</strong> e trunca o resultado (<code>7 / 2</code> vale <code>3</code>). Se pelo menos um dos operandos for de ponto flutuante, a divisão é real (<code>7.0 / 2</code> vale <code>3.5</code>).',
          'Com números negativos, <code>%</code> em C acompanha o sinal do dividendo: <code>-7 % 3</code> vale <code>-1</code> e <code>7 % -3</code> vale <code>1</code>.',
        ],
      },
      {
        titulo: 'Precedência e associatividade',
        rotulo: 'ordem das contas',
        paragrafos: [
          'A <strong>precedência</strong> decide quem opera primeiro quando a expressão mistura operadores (<code>2 + 3 * 4</code> é 14, não 20). A <strong>associatividade</strong> decide a ordem entre operadores do mesmo nível (todos da esquerda para a direita no caso de <code>* / %</code> e <code>+ -</code>).',
        ],
        lista: [
          '<code>()</code> — parênteses: sempre primeiro, use sem medo.',
          '<code>++ --</code> — incremento/decremento (pós/pré).',
          '<code>* / %</code> — multiplicativos (esquerda → direita).',
          '<code>+ -</code> — aditivos (esquerda → direita).',
          '<code>&lt; &lt;= &gt; &gt;=</code>, depois <code>== !=</code> — relacionais (comparação).',
          '<code>&amp;&amp;</code>, depois <code>||</code> — lógicos (vêm ainda nesta trilha).',
          'Regra de ouro: quando houver dúvida, use parênteses — legibilidade conta mais que "saber de cor".',
        ],
      },
      {
        titulo: 'Atribuição composta',
        rotulo: 'operadores combinados',
        paragrafos: [
          'C permite atalhos para "mude a variável usando ela mesma": <code>x += 5</code> é o mesmo que <code>x = x + 5</code>. Isso vale para <code>+= -= *= /= %=</code>. É do jeito que o código "real" em C costuma ser escrito.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int saldo = 500;

    saldo += 150;
    printf("apos deposito: %d\\n", saldo);

    saldo -= 80;
    printf("apos saque: %d\\n", saldo);

    saldo *= 2;
    printf("apos dobrar: %d\\n", saldo);

    saldo /= 3;
    printf("apos dividir: %d\\n", saldo);

    saldo %= 100;
    printf("resto por 100: %d\\n", saldo);
    return 0;
}`,
        saida: `apos deposito: 650
apos saque: 570
apos dobrar: 1140
apos dividir: 380
resto por 100: 80`,
      },
      {
        titulo: 'Incremento e decremento: ++ e --',
        rotulo: 'incrementos',
        paragrafos: [
          '<code>x++</code> soma 1 a <code>x</code>; <code>x--</code> subtrai 1. A diferença entre <strong>pré</strong> e <strong>pós</strong> aparece quando o operador está no meio de uma expressão: no <strong>pós</strong> (<code>x++</code>) a expressão usa o valor <em>antigo</em>; no <strong>pré</strong> (<code>++x</code>) usa o valor <em>novo</em>.',
          '<strong>Atenção (regra de ouro):</strong> não misture incremento com outras operações na mesma expressão — <code>b = a++ + a</code> gera resultado indefinido em C. Use <code>++</code>/<code>--</code> como instrução isolada, ou dentro de <code>for</code> (módulo 06), e pronto.',
        ],
      },
      {
        titulo: 'Relacionais e lógicos: verdade como número',
        rotulo: 'lógica',
        paragrafos: [
          'Operadores relacionais — <code>== != &lt; &lt;= &gt; &gt;=</code> — retornam <code>1</code> (verdadeiro) ou <code>0</code> (falso). C não tem tipo booleano obrigatório: <em>qualquer valor diferente de zero é "verdadeiro"</em>, e o zero é "falso".',
          'Os lógicos <code>&amp;&amp;</code> (e), <code>||</code> (ou) e <code>!</code> (não) seguem a mesma lógica, e ainda têm um comportamento especial de <strong>curto-circuito</strong>: no <code>&amp;&amp;</code>, se a primeira parte for falsa, a segunda nem é avaliada; no <code>||</code>, se a primeira for verdadeira, a segunda é pulada. Isso será útil (e perigoso) adiante.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int x = 5;

    printf("x > 3 (1 para sim): %d\\n", x > 3);
    printf("(x > 3) && (x < 10): %d\\n", x > 3 && x < 10);
    printf("(x < 3) || (x == 5): %d\\n", x < 3 || x == 5);
    printf("!(x > 3): %d\\n", !(x > 3));
    return 0;
}`,
        saida: `x > 3 (1 para sim): 1
(x > 3) && (x < 10): 1
(x < 3) || (x == 5): 1
!(x > 3): 0`,
      },
      {
        titulo: 'Programa: segundos em horas, minutos e segundos',
        rotulo: 'segundos.c',
        paragrafos: [
          'Um uso clássico de <code>/</code> e <code>%</code>: decompor um total de segundos em horas, minutos e segundos.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int total = 7543;
    int horas, minutos, segundos;

    horas = total / 3600;
    minutos = (total % 3600) / 60;
    segundos = total % 60;

    printf("%d segundos = %dh %dm %ds\\n", total, horas, minutos, segundos);
    return 0;
}`,
        saida: `7543 segundos = 2h 5m 43s`,
      },
      {
        titulo: 'Programa: juros compostos passo a passo',
        rotulo: 'juros.c',
        paragrafos: [
          'Aqui as atribuições compostas trabalham juntas: a cada ano o montante recebe mais 10% dele mesmo.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    double montante = 1000.0;
    double taxa = 10.0;   /* % ao ano */
    int anos = 3;

    montante += montante * taxa / 100.0;  /* ano 1 */
    montante += montante * taxa / 100.0;  /* ano 2 */
    montante += montante * taxa / 100.0;  /* ano 3 */

    printf("apos %d anos: R$ %.2f\\n", anos, montante);
    return 0;
}`,
        saida: `apos 3 anos: R$ 1331.00`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Leia um número inteiro de três algarismos (ex.: 287) e imprima os algarismos da unidade, dezena e centena separadamente.',
        dica: 'unidade = n % 10; dezena = (n / 10) % 10; centena = n / 100.',
        solucao: `#include <stdio.h>

int main(void)
{
    int n, u, d, c;

    printf("Digite um numero de 3 algarismos: ");
    scanf("%d", &n);

    u = n % 10;
    d = (n / 10) % 10;
    c = n / 100;

    printf("unidade: %d\\n", u);
    printf("dezena: %d\\n", d);
    printf("centena: %d\\n", c);
    return 0;
}`,
        solucao_obs: 'Para 287: unidade 7, dezena 8, centena 2.',
      },
      {
        nivel: 2,
        enunciado:
          'Leia dois inteiros e imprima o quociente e o resto da divisão inteira, além do resultado da divisão real usando uma conversão.',
        dica: 'Para a divisão real, escreva <code>(double) a / b</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    int a, b;

    printf("Digite dois inteiros: ");
    scanf("%d %d", &a, &b);

    printf("%d / %d = %d (quociente)\\n", a, b, a / b);
    printf("%d %% %d = %d (resto)\\n", a, b, a % b);
    printf("%d / %d = %.2f (divisao real)\\n", a, b, (double) a / b);
    return 0;
}`,
        solucao_obs: 'Repare no <code>%%</code> para imprimir um símbolo de porcentagem na frente.',
      },
      {
        nivel: 2,
        enunciado:
          'Sem rodar, calcule no papel o valor de <code>x</code> após <code>int x = 3; x *= 2; x += 4; x -= x % 5;</code>. Depois confirme com um programa.',
        dica: 'x % 5 avalia com o x daquele momento. Use o programa para conferir cada passo.',
        solucao: `#include <stdio.h>

int main(void)
{
    int x = 3;

    x *= 2;
    printf("passo 1: %d\\n", x);
    x += 4;
    printf("passo 2: %d\\n", x);
    x -= x % 5;
    printf("passo 3: %d\\n", x);
    return 0;
}`,
        solucao_obs: 'Passos: 6, depois 10, depois 10 - (10 % 5) = 10 - 0 = 10. Atenção: o módulo usa o valor atual de x.',
      },
      {
        nivel: 3,
        enunciado:
          'Leia duas notas (double) e imprima a média ponderada com pesos 2 e 3 — mas desta vez declare uma variável <code>peso1</code> e <code>peso2</code> e escreva a conta com parênteses em toda parte, mesmo onde não precisa.',
        dica: 'Use <code>(n1 * peso1 + n2 * peso2) / (peso1 + peso2)</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    double n1 = 6.5;
    double n2 = 8.0;
    double peso1 = 2.0;
    double peso2 = 3.0;
    double media = (n1 * peso1 + n2 * peso2) / (peso1 + peso2);

    printf("media ponderada: %.2f\\n", media);
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Escreva um programa que demonstra o curto-circuito: faça uma condição <code>(0 && funcaoPegaLado())</code> onde a função segunda teria um efeito (imprime um "aviso"), e mostre que com o && o aviso NÃO é impresso. Depois troque para <code>||</code> e veja o aviso.',
        dica: 'funcao que imprime e retorna 1: o retorno precisa existir para a expressão compilar.',
        solucao: `#include <stdio.h>

int aviso(void)
{
    printf("  [efeito colateral executado]\\n");
    return 1;
}

int main(void)
{
    int a = 0;

    printf("Caso 1: (0 && aviso())\\n");
    if (a && aviso()) {
        printf("  entrou no if\\n");
    }

    printf("Caso 2: a || aviso()\\n");
    if (a || aviso()) {
        printf("  entrou no if\\n");
    }
    return 0;
}`,
        solucao_obs: 'No caso 1, o && é o primeiro operando falso, então aviso() nem roda. No caso 2, o || tem o primeiro operando falso, então aviso() roda para decidir.',
      },
    ],
    quiz: [
      {
        pergunta: 'Quanto vale <code>17 % 5</code> em C?',
        opcoes: ['2', '3', '3.4', '17'],
        correta: 0,
        explicacao: '17 dividido por 5 dá 3 com resto 2; % retorna o resto.',
      },
      {
        pergunta: 'O que imprime <code>printf("%d", 7 / 2)</code>?',
        opcoes: ['3', '3.5', '2', '4'],
        correta: 0,
        explicacao: 'Dois inteiros fazem divisão inteira com truncamento: 7/2 = 3.',
      },
      {
        pergunta: 'Qual o valor de <code>2 + 3 * 4</code>?',
        opcoes: ['20', '14', '24', '18'],
        correta: 1,
        explicacao: 'A multiplicação precede a adição: 2 + 12 = 14.',
      },
      {
        pergunta: '<code>x += 3</code> é equivalente a:',
        opcoes: ['x = x + 3', 'x = 3', 'x++ 3', '3 + = x'],
        correta: 0,
        explicacao: 'A atribuição composta soma 3 ao valor atual de x.',
      },
      {
        pergunta: 'No curto-circuito de <code>0 && funcao()</code>:',
        opcoes: [
          'funcao() não é chamada, pois o && já sabe que o resultado é falso',
          'funcao() é sempre chamada antes do &&',
          'o programa para de executar',
          'o resultado é um erro de compilação',
        ],
        correta: 0,
        explicacao: 'Se a primeira parte do && é falsa, o resultado já é falso — a segunda parte é pulada.',
      },
    ],
    projeto: {
      titulo: 'Um "relógio" que avança minutos',
      descricao:
        'Crie <code>relogio.c</code>: leia uma hora no formato "HH MM" (ex.: 23 58) e a quantidade de minutos a avançar; calcule a nova hora corretamente (incluindo a virada de 23:59 para 00:00). Use <code>/</code>, <code>%</code>, <code>+=</code> e variáveis intermediárias. Imprima a hora de saída no formato <code>HH:MM</code> com largura fixa (<code>%02d</code>).',
      criterios: [
        'Lê hora, minuto e avanço com scanf.',
        'Trata a virada do dia: saídas como 23:58 + 5 = 00:03.',
        'Usa pelo menos um <code>=</code> / <code>%</code> e uma atribuição composta.',
        'Imprime com <code>%02d:%02d</code> e compila sem avisos.',
      ],
    },
  },
  {
    trilha: '1',
    numero: '05',
    titulo: 'Seleção: if, else if, switch',
    subtitulo: 'decisões e caminhos alternativos',
    objetivo:
      'Aprender a controlar o fluxo por condições: if/else e cadeias de else if, a representação de "verdade" em C (qualquer valor não nulo), o problema do "dangling else", o operador ternário ?: e o switch com break e default.',
    prerequisitos: 'T1.04',
    duracao: '~40 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Seção 3.3 — if/else e switch',
      king: 'Capítulo 5 — Seleção',
      foco:
        'No King, capítulo 5 inteiro é dedicado a isso: estude a tabela de expressões lógicas, a seção do dangling else e os exemplos de switch. No Beej, a seção 3.3 dá o panorama prático.',
    },
    secoes: [
      {
        titulo: 'if e else: dois caminhos',
        rotulo: 'primeiro if',
        paragrafos: [
          'O <code>if</code> decide se um bloco roda com base em uma condição. A regra de "verdade" em C é simples: <strong>a condição é falsa se a expressão vale 0, e verdadeira para qualquer outro valor</strong>. O <code>else</code> pega o caso contrário.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int n;

    printf("Digite um numero: ");
    scanf("%d", &n);

    if (n % 2 == 0) {
        printf("%d e par\\n", n);
    } else {
        printf("%d e impar\\n", n);
    }
    return 0;
}`,
        saida: `Digite um numero: 7
7 e impar`,
      },
      {
        titulo: 'else if: mais de dois caminhos',
        rotulo: 'cadeia de decisões',
        paragrafos: [
          'Quando as opções são várias, encadeie <code>else if</code>. Cada condição só é testada se todas as anteriores falharem. A última avaliação (a que não tem condição) é o "senão" final.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    double nota;

    printf("Nota (0 a 10): ");
    scanf("%lf", &nota);

    if (nota >= 9.0) {
        printf("conceito A\\n");
    } else if (nota >= 7.0) {
        printf("conceito B\\n");
    } else if (nota >= 5.0) {
        printf("conceito C\\n");
    } else {
        printf("reprovado\\n");
    }
    return 0;
}`,
        saida: `Nota (0 a 10): 8.5
conceito B`,
      },
      {
        titulo: 'Verdade em C: qualquer coisa diferente de zero',
        rotulo: 'booleano em C',
        paragrafos: [
          'Como a verdade é "não-zero", o C aceita atalhos que em outras linguagens dão erro. <code>if (x)</code> é o mesmo que <code>if (x != 0)</code>; <code>if (!x)</code> é o mesmo que <code>if (x == 0)</code>. Graças ao curto-circuito, dá até para escrever <code>if (n &gt; 0 && n % 2 == 0)</code> e ter "n positivo e par" numa condição só.',
          'Cuidado: o atalho <code>if (x)</code> é o que leva o iniciante a escrever <code>if (x = 5)</code> em vez de <code>if (x == 5)</code> — a atribuição vale 5, que é "verdadeiro", e o bug passa despercebido (módulo 1.11 ataca isso a fundo).',
        ],
      },
      {
        titulo: 'O "dangling else"',
        rotulo: 'else perdido',
        paragrafos: [
          'Quando um <code>if</code> está dentro de outro e só há um <code>else</code>, a quem ele pertence? O C responde: <strong>o <code>else</code> se associa ao <code>if</code> mais próximo</strong> ainda sem par. O programa abaixo parece "óbvio", mas o <code>else</code> pertence ao <code>if interno</code>:',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int x = 1;
    int y = 1;

    if (x > 1)
        /* BUG: sem chaves, o else fica ambiguo */
        if (y > 1)
            printf("os dois sao grandes\\n");
        /* este else pertence ao if de cima! */
        else
            printf("entrei: x > 1, mas y nao\\n");

    printf("fim do programa\\n");
    return 0;
}`,
        saida: `dangling.c:8:8: warning: suggest explicit braces to avoid ambiguous 'else' [-Wdangling-else]
    8 |     if (x > 1)
      |        ^

fim do programa`,
        paragrafos_fim: [
          'Com <code>x = 1</code>, o <code>if externo</code> é falso — então <em>nenhum</em> dos dois branches roda. Para evitar a confusão, use sempre <strong>chaves</strong> mesmo para uma única instrução: <code>if (cond) { ... } else { ... }</code>. Chaves nunca são demais. E o próprio gcc, com <code>-Wall</code>, reclama desse código com o warning <code>-Wdangling-else</code> — ele também quer as chaves.',
        ],
      },
      {
        titulo: 'switch: quando comparar com muitos valores',
        rotulo: 'switch',
        paragrafos: [
          'O <code>switch</code> compara uma expressão inteira (ou <code>char</code>) com uma série de <code>case</code>. Cada <code>case</code> deve terminar com <code>break</code>, senão ocorre o <strong>fall-through</strong> — a execução "vaza" para o próximo caso. O <code>default</code> é opcional e pega nada que nenhum caso cubra.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int mes;

    printf("Numero do mes (1-12): ");
    scanf("%d", &mes);

    switch (mes) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            printf("31 dias\\n");
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            printf("30 dias\\n");
            break;
        case 2:
            printf("28 ou 29 dias (fevereiro)\\n");
            break;
        default:
            printf("mes invalido\\n");
            break;
    }
    return 0;
}`,
        saida: `Numero do mes (1-12): 6
30 dias`,
        paragrafos_fim: [
          'Veja o fall-through útil em ação: os meses de 31 dias são empilhados sem <code>break</code>, então todos caem no mesmo <code>printf</code>. Isso é intencional. Já esquecer um <code>break</code> por engano é um bug clássico.',
        ],
      },
      {
        titulo: 'O operador ternário ?:',
        rotulo: 'ternário',
        paragrafos: [
          'Para "if que escolhe um valor", existe o operador ternário: <code>cond ? valorSe : valorNao</code>. Ele é ótimo como abreviação, e péssimo quando vira "coding golf". Use para escolhas curtas.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int idade = 17;
    char *status = idade >= 18 ? "maior de idade" : "menor de idade";

    printf("%d anos: %s\\n", idade, status);
    return 0;
}`,
        saida: `17 anos: menor de idade`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Leia um número inteiro e diga se ele é positivo, negativo ou zero.',
        dica: 'Três caminhos: if (n > 0), else if (n < 0), else.',
        solucao: `#include <stdio.h>

int main(void)
{
    int n;

    printf("Digite um numero: ");
    scanf("%d", &n);

    if (n > 0) {
        printf("positivo\\n");
    } else if (n < 0) {
        printf("negativo\\n");
    } else {
        printf("zero\\n");
    }
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Leia três números inteiros e imprima o maior deles (use a técnica do "maior até agora": comece com o primeiro e vá atualizando).',
        dica: 'Não precisa de &&: atualize o maior na hora com dois ifs simples.',
        solucao: `#include <stdio.h>

int main(void)
{
    int a, b, c, maior;

    printf("Digite tres numeros: ");
    scanf("%d %d %d", &a, &b, &c);

    maior = a;
    if (b > maior) {
        maior = b;
    }
    if (c > maior) {
        maior = c;
    }

    printf("maior: %d\\n", maior);
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Leia altura (m) e peso (kg) e classifique o IMC: abaixo de 18.5 "abaixo", de 18.5 a 24.9 "normal", de 25 a 29.9 "sobrepeso" e 30+ "obesidade". IMC = peso / altura².',
        dica: 'altura² = altura * altura. Teste os limites em cada faixa com >=.',
        solucao: `#include <stdio.h>

int main(void)
{
    double altura, peso, imc;

    printf("Peso (kg): ");
    scanf("%lf", &peso);
    printf("Altura (m): ");
    scanf("%lf", &altura);

    imc = peso / (altura * altura);

    printf("IMC: %.2f -> ", imc);
    if (imc < 18.5) {
        printf("abaixo do peso\\n");
    } else if (imc < 25.0) {
        printf("peso normal\\n");
    } else if (imc < 30.0) {
        printf("sobrepeso\\n");
    } else {
        printf("obesidade\\n");
    }
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Use switch para imprimir o nome do dia da semana a partir de um número 1–7 (1 = domingo ... 7 = sábado). Se o número for inválido, imprima "dia invalido".',
        dica: 'Cada case com seu break; o default lida com o resto.',
        solucao: `#include <stdio.h>

int main(void)
{
    int dia;

    printf("Dia da semana (1-7): ");
    scanf("%d", &dia);

    switch (dia) {
        case 1: printf("domingo\\n"); break;
        case 2: printf("segunda\\n"); break;
        case 3: printf("terca\\n"); break;
        case 4: printf("quarta\\n"); break;
        case 5: printf("quinta\\n"); break;
        case 6: printf("sexta\\n"); break;
        case 7: printf("sabado\\n"); break;
        default: printf("dia invalido\\n"); break;
    }
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Leia um ano e diga se é bissexto: divisível por 4, exceto os divisíveis por 100 (mas os divisíveis por 400 são bissextos). Combine as regras com && e ||.',
        dica: 'Regra completa: (ano % 4 == 0 && ano % 100 != 0) || ano % 400 == 0.',
        solucao: `#include <stdio.h>

int main(void)
{
    int ano;

    printf("Ano: ");
    scanf("%d", &ano);

    if ((ano % 4 == 0 && ano % 100 != 0) || ano % 400 == 0) {
        printf("%d e bissexto\\n", ano);
    } else {
        printf("%d nao e bissexto\\n", ano);
    }
    return 0;
}`,
        solucao_obs: '1900 não é bissexto (÷100 mas não ÷400); 2000 é (÷400).',
      },
    ],
    quiz: [
      {
        pergunta: 'Em C, uma condição é VERDADEIRA quando a expressão vale:',
        opcoes: ['qualquer valor diferente de zero', 'apenas o valor 1', 'apenas valores positivos', 'o valor 0'],
        correta: 0,
        explicacao: 'Tudo que não é zero é verdadeiro em C — o 0 é o único "falso".',
      },
      {
        pergunta: 'No "dangling else", o else se liga a qual if?',
        opcoes: [
          'ao if mais próximo que ainda não tem else',
          'ao primeiro if do programa',
          'ao if com mais chaves',
          'a nenhum — dá erro de compilação',
        ],
        correta: 0,
        explicacao: 'O else é associado ao if mais próximo sem par; use chaves para evitar a armadilha.',
      },
      {
        pergunta: 'O que printa <code>switch</code> para <code>case 5: ... break;</code> e valor 5?',
        opcoes: [
          'executa o case 5 e para no break',
          'executa o case 5 e todos os seguintes',
          'nem executa o case 5',
          'dá erro, porque case só aceita char',
        ],
        correta: 0,
        explicacao: 'O break encerra o switch logo após o case 5. Sem break, haveria fall-through.',
      },
      {
        pergunta: 'O que acontece quando um switch não tem <code>break</code> no fim de um case?',
        opcoes: [
          'o código "vaza" para o próximo case (fall-through)',
          'o switch encerra automaticamente',
          'o programa reinicia',
          'ocorre erro de compilação',
        ],
        correta: 0,
        explicacao: 'Fall-through é a execução continuar no próximo case; às vezes é útil (meses de 31 dias), às vezes é bug.',
      },
      {
        pergunta: '<code>int x = 7; double r = x > 5 ? 1.5 : 2.5;</code> — qual o valor de r?',
        opcoes: ['1.5', '2.5', '7', 'true'],
        correta: 0,
        explicacao: 'x > 5 é verdadeiro, então o ternário retorna o primeiro valor: 1.5.',
      },
    ],
    projeto: {
      titulo: 'Calculadora de IMC completa',
      descricao:
        'Melhore o classificador de IMC: leia peso e altura, calcule o IMC com 2 casas e, além de classificar em 4 faixas (abaixo/normal/sobrepeso/obesidade), informe o peso ideal aproximado para uma altura "normal" (IMC 22) e uma dica simples (aumentar ou reduzir peso) em função da faixa. Use if/else if e pelo menos um switch ou ternário em algum ponto.',
      criterios: [
        'Lê peso e altura como double.',
        'Classifica em pelo menos 4 faixas de IMC com mensagens diferentes.',
        'Calcula o peso que daria IMC 22 para a altura informada.',
        'Trata entrada inválida (peso ou altura ≤ 0).',
        'Compila com <code>-Wall -Wextra -std=c11</code> sem avisos.',
      ],
    },
  },
  {
    trilha: '1',
    numero: '06',
    titulo: 'Loops: while, do-while e for',
    subtitulo: 'repetição com contador e com condição',
    objetivo:
      'Dominar os três laços do C (while, do-while, for), saber escolher o mais adequado a cada situação, entender loops infinitos + break/continue, loops aninhados e o papel das vírgulas no for.',
    prerequisitos: 'T1.05',
    duracao: '~50 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Seção 3.3 — loops (while, do-while, for)',
      king: 'Capítulo 6 — Loops',
      foco:
        'No King, capítulo 6 é o coração da repetição em C: while, do-while, for e a seção "for com vírgulas". No Beej, a seção de loops traz exemplos simples de cada forma.',
    },
    secoes: [
      {
        titulo: 'while: repita enquanto a condição valer',
        rotulo: 'while',
        paragrafos: [
          'O <code>while</code> testa a condição <em>antes</em> de cada volta: se for "falso" (zero) logo de cara, o corpo é pulado — pode nem executar uma vez. Note o padrão clássico: variável de controle, teste, e atualização da variável dentro do corpo.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int contador = 1;
    int soma = 0;

    while (contador <= 10) {
        soma += contador;
        contador++;
    }

    printf("soma de 1 a 10: %d\\n", soma);
    return 0;
}`,
        saida: `soma de 1 a 10: 55`,
      },
      {
        titulo: 'do-while: garanta ao menos uma execução',
        rotulo: 'do-while',
        paragrafos: [
          'O <code>do-while</code> testa a condição <em>depois</em> do corpo — o corpo roda sempre pelo menos uma vez. É perfeito para menus: você mostra as opções e só pergunta de novo se a resposta foi inválida.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int escolha;

    do {
        printf("1) Ver saldo\\n");
        printf("2) Depositar\\n");
        printf("3) Sair\\n");
        printf("Escolha: ");
        scanf("%d", &escolha);
    } while (escolha != 3);

    printf("Ate mais!\\n");
    return 0;
}`,
        saida: `1) Ver saldo
2) Depositar
3) Sair
Escolha: 1
1) Ver saldo
2) Depositar
3) Sair
Escolha: 2
1) Ver saldo
2) Depositar
3) Sair
Escolha: 3
Ate mais!`,
      },
      {
        titulo: 'for: o laço com contador',
        rotulo: 'for',
        paragrafos: [
          'O <code>for</code> concentra a mecânica do contador em uma linha: <code>for (inicialização; condição; passo)</code>. Tudo já é organizado para repetir "das tantas vezes até um valor". Como todos os laços de C aceitam apenas <code>int</code> como condição, o padrão de percorrer <code>0..n</code> fica comum em todo código real.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int i;

    printf(" i  | i*i\\n");
    printf("----+----\\n");
    for (i = 1; i <= 5; i++) {
        printf("%3d | %3d\\n", i, i * i);
    }
    return 0;
}`,
        saida: ` i  | i*i
----+----
  1 |   1
  2 |   4
  3 |   9
  4 |  16
  5 |  25`,
      },
      {
        titulo: 'Loops infinitos, break e continue',
        rotulo: 'controle do laço',
        paragrafos: [
          'Um <code>for (;;)</code> roda para sempre — útil quando a saída depende de um sinal lido de fora. Para sair no meio, <code>break</code> encerra o laço imediatamente; <code>continue</code> pula para a próxima volta (pulando o resto do corpo).',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int n, soma = 0;

    printf("Digite numeros (0 encerra, negativos sao ignorados):\\n");
    for (;;) {
        printf("> ");
        scanf("%d", &n);
        if (n == 0) {
            break;
        }
        if (n < 0) {
            continue;
        }
        soma += n;
    }

    printf("soma: %d\\n", soma);
    return 0;
}`,
        saida: `Digite numeros (0 encerra, negativos sao ignorados):
> 5
> -3
> 2
> 0
soma: 7`,
      },
      {
        titulo: 'Loops aninhados e a tabuada',
        rotulo: 'aninhados',
        paragrafos: [
          'Um laço dentro de outro forma <strong>loops aninhados</strong>: para cada volta do externo, o interno roda por inteiro. É assim que se percorre linhas × colunas — como a tabuada:',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int i, j;

    for (i = 1; i <= 9; i++) {
        for (j = 1; j <= 9; j++) {
            printf("%3d", i * j);
        }
        printf("\\n");
    }
    return 0;
}`,
        saida: `  1  2  3  4  5  6  7  8  9
  2  4  6  8 10 12 14 16 18
  3  6  9 12 15 18 21 24 27
  4  8 12 16 20 24 28 32 36
  5 10 15 20 25 30 35 40 45
  6 12 18 24 30 36 42 48 54
  7 14 21 28 35 42 49 56 63
  8 16 24 32 40 48 56 64 72
  9 18 27 36 45 54 63 72 81`,
      },
      {
        titulo: 'Contador vs condicional — e a vírgula no for',
        rotulo: 'escolhendo o laço',
        paragrafos: [
          'Escolha o laço pelo <em>tipo de repetição</em>, não pela aparência:',
        ],
        lista: [
          '<strong>Número conhecido de voltas</strong> — <code>for</code> (tabuada, percorrer 1..n).',
          '<strong>Repetir enquanto uma condição mudar por dados externos</strong> — <code>while</code> (processar até o 0).',
          '<strong>Garantir ao menos uma passagem</strong> — <code>do-while</code> (menus).',
          'Quem decide o fim do laço <em>dentro</em> do corpo ou lendo entrada — <code>while</code> ou <code>for (;;)</code> com <code>break</code>.',
          'No <code>for</code>, vírgulas separam múltiplas instruções na inicialização ou no passo: <code>for (i = 0, j = 10; i &lt; j; i++, j--)</code>.',
        ],
      },
      {
        titulo: 'Programa: soma da série harmônica',
        rotulo: 'serie.c',
        paragrafos: [
          'Laços fazem o trabalho "pesado" com números de ponto flutuante: somar 1 + 1/2 + 1/3 + ... + 1/n. Repare no <code>1.0 / i</code>: sem o <code>.0</code>, a divisão seria inteira e cada termo viraria 0 (menos o primeiro).',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int i, n;
    double soma = 0.0;

    printf("Quantos termos? ");
    scanf("%d", &n);

    for (i = 1; i <= n; i++) {
        soma += 1.0 / i;
    }

    printf("soma da serie 1 + 1/2 + ... + 1/%d = %.6f\\n", n, soma);
    return 0;
}`,
        saida: `Quantos termos? 5
soma da serie 1 + 1/2 + ... + 1/5 = 2.283333`,
      },
      {
        titulo: 'Programa: verificação de número primo',
        rotulo: 'primo.c',
        paragrafos: [
          'Aqui o laço testa uma propriedade e um <code>break</code> interrompe a busca na primeira evidência. <code>i * i &lt;= n</code> limita o teste à raiz quadrada do número — sem biblioteca matemática.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int n, i, eh_primo = 1;

    printf("Digite um numero: ");
    scanf("%d", &n);

    if (n < 2) {
        eh_primo = 0;
    } else {
        for (i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                eh_primo = 0;
                break;
            }
        }
    }

    if (eh_primo) {
        printf("%d e primo\\n", n);
    } else {
        printf("%d nao e primo\\n", n);
    }
    return 0;
}`,
        saida: `Digite um numero: 17
17 e primo`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Com um <code>for</code>, imprima todos os números pares de 0 a 20, um por linha.',
        dica: 'Comece em 0 e incremente de 2 em 2, ou teste <code>i % 2 == 0</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    int i;

    for (i = 0; i <= 20; i += 2) {
        printf("%d\\n", i);
    }
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Leia números inteiros e vá somando até que o usuário digite o valor 0 (o 0 não entra na soma). Imprima o total. Use while.',
        dica: 'Padrão "sentinela": só pare quando o número digitado for 0.',
        solucao: `#include <stdio.h>

int main(void)
{
    int n, soma = 0;

    printf("Digite numeros (0 encerra):\\n");
    printf("> ");
    scanf("%d", &n);

    while (n != 0) {
        soma += n;
        printf("> ");
        scanf("%d", &n);
    }

    printf("total: %d\\n", soma);
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Leia um número inteiro positivo e imprima quantos dígitos ele tem (ex.: 4528 tem 4 dígitos). Cuidado com o número 0.',
        dica: 'Divida por 10 repetidamente até sobrar 0, contando as divisões.',
        solucao: `#include <stdio.h>

int main(void)
{
    int n, qtd = 0;

    printf("Digite um numero: ");
    scanf("%d", &n);

    if (n == 0) {
        qtd = 1;
    } else {
        if (n < 0) {
            n = -n;
        }
        while (n > 0) {
            n = n / 10;
            qtd++;
        }
    }

    printf("digitos: %d\\n", qtd);
    return 0;
}`,
        solucao_obs: 'O 0 é um caso especial: com 1 dígito, o while nem rodaria.',
      },
      {
        nivel: 3,
        enunciado:
          'Calcule e imprima uma aproximação do número de Euler e: some 1 + 1/1! + 1/2! + 1/3! + ... até o termo 1/n! ficar menor que 0.000001 (use um double para o fatorial).',
        dica: 'Mantenha <code>fat</code> multiplicando por i a cada volta: fat = fat * i.',
        solucao: `#include <stdio.h>

int main(void)
{
    double e = 1.0;
    double fat = 1.0;
    double termo;
    int i = 1;

    do {
        fat *= i;
        termo = 1.0 / fat;
        e += termo;
        i++;
    } while (termo >= 0.000001);

    printf("aproximacao de e: %.10f\\n", e);
    return 0;
}`,
        solucao_obs: 'O do-while garante ao menos uma soma, e o laço para quando o termo fica pequeno demais.',
      },
      {
        nivel: 3,
        enunciado:
          'Print uma "escada digital" com dois loops aninhados: para cada linha i, imprima os números de 1 até i. Ex.: linha 3 imprime "1 2 3". Vá de 1 até 5.',
        dica: 'O loop externo controla a linha; o interno os números dela.',
        solucao: `#include <stdio.h>

int main(void)
{
    int i, j;

    for (i = 1; i <= 5; i++) {
        for (j = 1; j <= i; j++) {
            printf("%d ", j);
        }
        printf("\\n");
    }
    return 0;
}`,
        solucao_obs: 'O laço interno usa a variável do externo (i) como limite — por isso as linhas crescem.',
      },
      {
        nivel: 3,
        enunciado:
          'Imprima todos os números primos de 2 a 100, um por linha, usando uma função de teste inline (flag + break) dentro do próprio loop externo.',
        dica: 'Reuse a lógica do exemplo primo.c, mas agora ia percorrendo cada candidato.',
        solucao: `#include <stdio.h>

int main(void)
{
    int n, i, eh_primo;

    for (n = 2; n <= 100; n++) {
        eh_primo = 1;
        for (i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                eh_primo = 0;
                break;
            }
        }
        if (eh_primo) {
            printf("%d\\n", n);
        }
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        pergunta: 'Qual laço garante que o corpo rode pelo menos uma vez, mesmo se a condição já começar falsa?',
        opcoes: ['do-while', 'while', 'for', 'if'],
        correta: 0,
        explicacao: 'O do-while testa a condição depois do corpo.',
      },
      {
        pergunta: 'Quantas vezes roda o corpo de <code>for (i = 1; i <= 5; i++)</code>?',
        opcoes: ['5', '6', '4', 'infinitas'],
        correta: 0,
        explicacao: 'i vai de 1 a 5: cinco execuções; o teste <code>i <= 5</code> fica falso quando i=6.',
      },
      {
        pergunta: 'O que <code>break</code> faz dentro de um loop?',
        opcoes: [
          'encerra o loop imediatamente',
          'pula para a próxima iteração',
          'reinicia o loop do início',
          'sai do programa inteiro',
        ],
        correta: 0,
        explicacao: 'break encerra o laço mais interno; continue pula a volta atual.',
      },
      {
        pergunta: 'Qual a diferença entre <code>break</code> e <code>continue</code>?',
        opcoes: [
          'break encerra o loop; continue pula para a próxima iteração',
          'continue encerra o loop; break pula a iteração',
          'não há diferença',
          'break vale só para slow≠for',
        ],
        correta: 0,
        explicacao: 'breaks terminam a repetição; deixa passar, apenas avança a volta.',
      },
      {
        pergunta: 'Quantos números o loop externo + interno de <code>for(i=0;i<3;i++) for(j=0;j<2;j++)</code> somam no total de execuções internas?',
        opcoes: ['6', '3', '2', '9'],
        correta: 0,
        explicacao: '3 voltas externas × 2 internas = 6 execuções do corpo interno.',
      },
    ],
    projeto: {
      titulo: 'Tabela de quadrados e cubos',
      descricao:
        'Crie <code>tabela.c</code>: um programa que imprime uma tabela de n de 1 até N (N lido do teclado, máximo 100): colunas "n", "n^2", "n^3" e "soma acumulada" (dos n^2 até aquela linha). Use loops, largura fixa (<code>%6d</code>) e algumas formatações. Ao final, imprima o total geral dos quadrados.',
      criterios: [
        'Lê N e valida (rejeita N > 100 ou N < 1 com loop do-while).',
        'Imprime o cabeçalho e as linhas com colunas alinhadas.',
        'Calcula a soma acumulada dos quadrados e o total geral.',
        'Compila com <code>-Wall -Wextra -std=c11</code> sem avisos.',
      ],
    },
  },
  {
    trilha: '1',
    numero: '07',
    titulo: 'Tipos básicos a fundo',
    subtitulo: 'tamanhos, límites, unsigned, overflow e conversões',
    objetivo:
      'Entender de verdade os tipos: tamanhos variáveis de int/char/short/long, signed vs unsigned, precisão de float/double, o overflow silencioso de inteiros, os limites de <limits.h>/<float.h>, o operador sizeof e as conversões implícitas versus o cast explícito.',
    prerequisitos: 'T1.04',
    duracao: '~40 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Capítulo 14 — tipos em detalhe',
      king: 'Capítulo 7 — Tipos básicos',
      foco:
        'No King, capítulo 7 trata exatamente este tema: gere a tabela de intervalos de cada tipo e leia as seções de conversões implícitas com calma. No Beej, o capítulo sobre tipos complementa com exemplos de sizeof.',
    },
    secoes: [
      {
        titulo: 'A família int: tamanhos e o padrão',
        rotulo: 'inteiros',
        paragrafos: [
          'O C não fixa o tamanho da maioria dos tipos — ele fixa <em>mínimos</em>, e deixa a plataforma escolher o resto (praticidade máxima para quem escreve compiladores). Na nossa máquina (MinGW-w64 x86_64), os tamanhos típicos são:',
        ],
        lista: [
          '<code>char</code> — 1 byte (sempre 1, por definição).',
          '<code>short</code> — 2 bytes (garantidamente pelo menos 2).',
          '<code>int</code> — 4 bytes (pelo menos 2).',
          '<code>long</code> — 4 bytes no Windows (8 no Linux 64-bit! — cuidado, não é portável).',
          '<code>long long</code> — 8 bytes (pelo menos 8).',
          'Cada tipo pode ser <code>signed</code> (com sinal) ou <code>unsigned</code> (sem sinal, só não-negativos, o que dobra a faixa positiva). O <code>int</code> com sinal vai de <code>INT_MIN</code> a <code>INT_MAX</code>.',
        ],
      },
      {
        titulo: 'char também é um inteiro (pequeno)',
        rotulo: 'char',
        paragrafos: [
          'Um <code>char</code> guarda um valor de 0 a 127 na maioria das plataformas (assim o caracter ASCII cabe). O C permite tratá-lo como o <em>número</em> que o representa: <code>\'A\'</code> é o número 65 na tabela ASCII. Isso abre truques como converter uma letra minúscula em maiúscula subtraindo 32.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    char letra = 'a';

    printf("letra: %c, valor numerico: %d\\n", letra, letra);
    printf("maiuscula: %c\\n", letra - 32);
    return 0;
}`,
        saida: `letra: a, valor numerico: 97
maiuscula: A`,
      },
      {
        titulo: 'float vs double: precisão e representação',
        rotulo: 'ponto flutuante',
        paragrafos: [
          'Números de ponto flutuante guardam valor, expoente e sinal — como notação científica binária. Por isso, a maioria dos "números quebrados" não pode ser representada exatamente, e há <strong>arredondamento</strong>. O <code>float</code> tem ~6-7 dígitos decimais confiáveis; o <code>double</code> tem ~15-16. Regra do curso: para cálculos, use <code>double</code>.',
          'E não compare doubles com <code>==</code> para igualdade exata: <code>0.1 + 0.2</code> costuma não ser exatamente <code>0.3</code> em ponto flutuante. Compare por margem de erro (ex.: <code>fabs(a - b) &lt; 0.0001</code>).',
        ],
      },
      {
        titulo: 'Overflow: o erro que não faz barulho',
        rotulo: 'overflow',
        paragrafos: [
          'Quando um <strong>inteiro sem sinal</strong> passa do máximo, ele <strong>dá a volta</strong> (wrap-around): 4294967295 + 1 vira 0. Já o <strong>inteiro com sinal</strong> em overflow é <strong>comportamento indefinido</strong> (UB) — pode ser qualquer lixo. E o pior: <em>nada é avisado</em>. Sua única proteção é conhecer os limites e decidir na mão.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    unsigned int n = 4294967295U;   /* maior valor de unsigned int */

    printf("n: %u\\n", n);
    printf("n + 1 (estoura silenciosamente): %u\\n", n + 1U);
    printf("n + 1 eh menor que n: %d\\n", (n + 1U) < n);
    return 0;
}`,
        saida: `n: 4294967295
n + 1 (estoura silenciosamente): 0
n + 1 eh menor que n: 1`,
        paragrafos_fim: [
          'O sufixo <code>U</code> no literal torna-o <code>unsigned</code>. A comparação <code>(n + 1U) &lt; n</code> dá 1 (verdadeiro) porque a soma deu a volta para 0. Este wrap-around é a raiz de inúmeros<em>b</em>? none—é a raiz de inúmeros bugs conhecidos; por isso a Trilha 4 dedica tanto tempo a ele.',
        ],
      },
      {
        titulo: 'Limites padrão: limits.h e float.h',
        rotulo: 'limites',
        paragrafos: [
          'A biblioteca padrão fornece as constantes de limites: <code>limits.h</code> para inteiros e <code>float.h</code> para ponto flutuante. Aprender a lê-las no seu próprio computador vale mais do que decorar valores.',
        ],
        codigo: `#include <stdio.h>
#include <limits.h>
#include <float.h>

int main(void)
{
    printf("sizeof(int)       = %zu bytes\\n", sizeof(int));
    printf("sizeof(char)      = %zu bytes\\n", sizeof(char));
    printf("sizeof(float)     = %zu bytes\\n", sizeof(float));
    printf("sizeof(double)    = %zu bytes\\n", sizeof(double));
    printf("sizeof(short)     = %zu bytes\\n", sizeof(short));
    printf("sizeof(long long) = %zu bytes\\n", sizeof(long long));

    printf("\\nINT_MAX:  %d\\n", INT_MAX);
    printf("INT_MIN:  %d\\n", INT_MIN);
    printf("UINT_MAX: %u\\n", UINT_MAX);
    printf("CHAR_MAX: %d\\n", CHAR_MAX);

    printf("\\nFLT_DIG (digitos confiaveis do float):  %d\\n", FLT_DIG);
    printf("DBL_DIG (digitos confiaveis do double): %d\\n", DBL_DIG);
    return 0;
}`,
        saida: `sizeof(int)       = 4 bytes
sizeof(char)      = 1 bytes
sizeof(float)     = 4 bytes
sizeof(double)    = 8 bytes
sizeof(short)     = 2 bytes
sizeof(long long) = 8 bytes

INT_MAX:  2147483647
INT_MIN:  -2147483648
UINT_MAX: 4294967295
CHAR_MAX: 127

FLT_DIG (digitos confiaveis do float):  6
DBL_DIG (digitos confiaveis do double): 15`,
        paragrafos_fim: [
          'O <code>sizeof</code> é um <strong>operador</strong> (não uma função!) que devolve o tamanho em bytes de um tipo ou expressão; o tipo correto para imprimir o resultado é <code>%zu</code> (especificador do <code>size_t</code>).',
        ],
      },
      {
        titulo: 'Conversões: implícita vs cast',
        rotulo: 'conversões',
        paragrafos: [
          'Em uma expressão mista, o C aplica <strong>conversão implícita</strong> (usual arithmetic conversions): o menor tipo "promove" para o maior (ex.: <code>int</code> + <code>double</code> → <code>double</code>). Isso é automático e, às vezes, é justamente o que você não quer — como na divisão <code>7 / 2</code>=3.',
          'O <strong>cast</strong> é a conversão <em>explícita</em> e declarada por você: <code>(double) a / b</code>. Use cast quando a regra automática não é o que você precisa, e para deixar sua intenção clara.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int a = 7, b = 2;

    printf("7 / 2 (inteiros, trunca): %d\\n", a / b);
    printf("7.0 / 2.0 (double): %.2f\\n", 7.0 / 2.0);
    printf("(double) 7 / 2 (cast): %.2f\\n", (double) a / b);
    printf("a / (double) b: %.1f\\n", a / (double) b);

    double soma_impl = a + 0.5;   /* int promove a double */
    printf("7 + 0.5 (implicita): %.1f\\n", soma_impl);
    return 0;
}`,
        saida: `7 / 2 (inteiros, trunca): 3
7.0 / 2.0 (double): 3.50
(double) 7 / 2 (cast): 3.50
a / (double) b: 3.5
7 + 0.5 (implicita): 7.5`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Escreva um programa que imprime <code>sizeof</code> de <code>int</code>, <code>char</code>, <code>double</code> e <code>long long</code> na sua máquina, com uma frase para cada. Antes de rodar, chute os valores.',
        dica: 'Use <code>%zu</code> no printf.',
        solucao: `#include <stdio.h>

int main(void)
{
    printf("int:       %zu bytes\\n", sizeof(int));
    printf("char:      %zu bytes\\n", sizeof(char));
    printf("double:    %zu bytes\\n", sizeof(double));
    printf("long long: %zu bytes\\n", sizeof(long long));
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Crie um programa que mostra o overflow de um <code>unsigned short</code>: inicialize-o com 65535, some 1 e imprima o resultado. O que acontece?',
        dica: '65535 é o maior unsigned short; 65535 + 1 dá a volta para 0.',
        solucao: `#include <stdio.h>

int main(void)
{
    unsigned short us = 65535;

    printf("us: %u\\n", us);
    us = us + 1;
    printf("us + 1: %u\\n", (unsigned) us);
    return 0;
}`,
        solucao_obs: 'O cast (unsigned) no printf evita ambiguidade de tipos na promoção para int; o valor vira 0.',
      },
      {
        nivel: 2,
        enunciado:
          'Leia duas notas (int 0–100) e imprima a média correta como double, usando cast em vez de dividir por 2.0.',
        dica: '<code>(n1 + n2) / 2</code> com int daria truncamento; o cast muda o tipo de um dos operandos.',
        solucao: `#include <stdio.h>

int main(void)
{
    int n1, n2;

    printf("Nota 1 (0-100): ");
    scanf("%d", &n1);
    printf("Nota 2 (0-100): ");
    scanf("%d", &n2);

    printf("media: %.2f\\n", ((double) n1 + n2) / 2);
    return 0;
}`,
        solucao_obs: 'Com <code>(double) n1</code>, a soma inteira é promovida para double e a divisão é real.',
      },
      {
        nivel: 3,
        enunciado:
          'Leia uma letra minúscula e imprima a maiúscula correspondente (subtraia 32 do código ASCII) e também o código numérico de ambas.',
        dica: '"a" é 97 e "A" é 65. O printf combina %c e %d.',
        solucao: `#include <stdio.h>

int main(void)
{
    char minuscula;

    printf("Digite uma letra minuscula: ");
    scanf(" %c", &minuscula);

    char maiuscula = minuscula - 32;

    printf("minuscula: %c (%d)\\n", minuscula, minuscula);
    printf("maiuscula: %c (%d)\\n", maiuscula, maiuscula);
    return 0;
}`,
        solucao_obs: 'O espaço em <code>scanf(" %c")</code> descarta o Enter que ficou no buffer antes.',
      },
      {
        nivel: 3,
        enunciado:
          'Sem rodar, diga o resultado de <code>5/2</code>, <code>5.0/2</code>, <code>(double)5/2</code> e <code>5/2.0</code>. Confirme com um programa que imprime os quatro casos.',
        dica: 'Só a primeira é divisão inteira; as demais envolvem ponto flutuante.',
        solucao: `#include <stdio.h>

int main(void)
{
    printf("5/2    = %d\\n", 5 / 2);
    printf("5.0/2  = %.1f\\n", 5.0 / 2);
    printf("(double)5/2 = %.1f\\n", (double) 5 / 2);
    printf("5/2.0  = %.1f\\n", 5 / 2.0);
    return 0;
}`,
        solucao_obs: 'Resultado: 2, 2.5, 2.5, 2.5. Só o primeiro é divisão inteira.',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual o tamanho garantido de um char em C?',
        opcoes: ['1 byte', '2 bytes', '4 bytes', 'depende da máquina sem mínimo'],
        correta: 0,
        explicacao: 'O char tem 1 byte garantido por definição, em qualquer plataforma.',
      },
      {
        pergunta: 'O que acontece quando um unsigned int no máximo soma 1?',
        opcoes: [
          'dá a volta para 0 (wrap-around), silenciosamente',
          'vira comportamento indefinido e travar o programa',
          'o compilador acusa erro',
          'vira long long automaticamente',
        ],
        correta: 0,
        explicacao: 'Unsigned faz wrap-around sem aviso: 4294967295 + 1 = 0.',
      },
      {
        pergunta: 'O overflow de um int COM sinal é:',
        opcoes: [
          'comportamento indefinido (UB)',
          'sempre dá a volta para o mínimo',
          'um erro de compilação',
          'automaticamente tratado pelo gcc',
        ],
        correta: 0,
        explicacao: 'Sinal overflow é UB: o compilador pode otimizar de formas imprevisíveis. Nunca confie nele.',
      },
      {
        pergunta: 'Qual o valor de <code>7 / 2</code> com int, e com (double)7 / 2?',
        opcoes: ['int: 3, cast: 3.5', 'int: 3.5, cast: 3.5', 'int: 3, cast: 3', 'int: 3.5, cast: 3'],
        correta: 0,
        explicacao: 'Divisão inteira trunca para 3; com cast, a divisão é real (3.5).',
      },
      {
        pergunta: 'Quantos dígitos decimais confiáveis tem um double típico?',
        opcoes: ['cerca de 15-16', 'cerca de 6-7', '2', 'é infinito'],
        correta: 0,
        explicacao: 'DBL_DIG costuma ser 15; o float fica em ~6-7.',
      },
    ],
    projeto: {
      titulo: 'Explorando os limites do seu computador',
      descricao:
        'Crie <code>explora.c</code> que usa <limits.h> e <float.h> para apresentar, em um relatório atrativo: tamanhos (sizeof) de cada tipo inteiro e real, os valores INT_MAX/INT_MIN/UINT_MAX/LONG_MAX, o valor de DBL_MAX e o de FLT_MAX. Na parte "final" do relatório, invente O próprio teste: declare um int com o valor INT_MAX e imprima o resultado de INT_MAX + 1 com um comentário explicando por que o resultado não faz sentido (UB).',
      criterios: [
        'Relatório formatado com cabeçalho e colunas alinhadas.',
        'Usa <code>%zu</code> para sizeof e <code>%u</code>/<code>%d</code>/<code>%ld</code> para os limites corretos.',
        'Contém uma demonstração comentada de que a soma INT_MAX + 1 é indefensável (UB).',
        'Compila sem avisos com <code>-Wall -Wextra -std=c11</code>.',
      ],
    },
  },
  {
    trilha: '1',
    numero: '08',
    titulo: 'Arrays',
    subtitulo: 'coleções indexadas, 0-based, 1D e 2D',
    objetivo:
      'Dominar os arrays: declaração e indexação começando em 0, inicializadores (inclusive designated initializers do C99), arrays constantes, uso de sizeof para contar elementos e o perigo de acessar fora dos limites (comportamento indefinido).',
    prerequisitos: 'T1.07',
    duracao: '~45 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Capítulo 6 — Arrays',
      king: 'Capítulo 8 — Arrays',
      foco:
        'No King, capítulo 8 cobre array 1D/2D e inicializadores com calma matemática. No Beej, o capítulo 6 é curto e direto ao ponto; preste atenção nos exemplos de percorrimento com for.',
    },
    secoes: [
      {
        titulo: 'Array: a mesma variável, várias vezes',
        rotulo: 'o que é array',
        paragrafos: [
          'Um <strong>array</strong> é uma sequência de valores <em>do mesmo tipo</em>, guardados lado a lado na memória, e acessados por um <strong>índice</strong>. A primeira posição é a <code>0</code> — o índice 0 é o primeiro elemento. Declare com colchetes: <code>int notas[5];</code> cria cinco <code>int</code> acessíveis por <code>notas[0]</code> ... <code>notas[4]</code>.',
          'O laço natural para percorrer um array é o <code>for</code> de <code>0</code> até <code>n-1</code>. Se você tentar o intervalo <code>1..n</code>, você "pula" o primeiro e "escapa" do último — o clássico erro <strong>off-by-one</strong>.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int numeros[5];
    int i;

    numeros[0] = 10;
    numeros[1] = 20;
    numeros[2] = 30;
    numeros[3] = 40;
    numeros[4] = 50;

    for (i = 0; i < 5; i++) {
        printf("numeros[%d] = %d\\n", i, numeros[i]);
    }
    return 0;
}`,
        saida: `numeros[0] = 10
numeros[1] = 20
numeros[2] = 30
numeros[3] = 40
numeros[4] = 50`,
      },
      {
        titulo: 'Inicializadores: lista entre chaves',
        rotulo: 'inicializando',
        paragrafos: [
          'Na declaração, você pode iniciar o array com uma lista: <code>int v[5] = {1, 2, 3, 4, 5};</code>. Inicialização <em>parcial</em> zera o resto: <code>int v[5] = {1, 2};</code> → v[0]=1, v[1]=2, e os demais são 0. E se a lista é completa, o C infere o tamanho: <code>int v[] = {1,2,3};</code> cria um array de 3.',
        ],
      },
      {
        titulo: 'Designated initializers (C99)',
        rotulo: 'inicializador nomeado',
        paragrafos: [
          'O C99 trouxe a inicialização por "posição nomeada": <code>int v[10] = {[0] = 7, [2] = 9};</code> define v[0]=7 e v[2]=9 (o resto fica 0). É ótimo para deixar claro <em>quem</em> é quem, principalmente em arrays esparsos.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int v[10] = {[0] = 7, [2] = 9, [9] = 42};
    int i;

    for (i = 0; i < 10; i++) {
        printf("v[%d] = %d\\n", i, v[i]);
    }
    return 0;
}`,
        saida: `v[0] = 7
v[1] = 0
v[2] = 9
v[3] = 0
v[4] = 0
v[5] = 0
v[6] = 0
v[7] = 0
v[8] = 0
v[9] = 42`,
      },
      {
        titulo: 'sizeof de array: contando elementos',
        rotulo: 'sizeof array',
        paragrafos: [
          'O <code>sizeof(array)</code> devolve o total de <em>bytes</em>; dividindo pelo <code>sizeof</code> de um elemento, obtém-se o número de <strong>elementos</strong>. É a técnica portável para loops: <code>for (i = 0; i &lt; sizeof(v)/sizeof(v[0]); i++)</code>. Arrays constantes (<code>const int</code>) evitam que você altere por engano dentro do código.',
        ],
      },
      {
        titulo: 'Fora dos limites: comportamento indefinido',
        rotulo: 'out of bounds',
        paragrafos: [
          'Escrever em <code>v[5]</code> quando <code>v</code> tem 5 elementos (índices 0–4) <em>compila e roda</em> — mas é <strong>comportamento indefinido</strong>. O C não cuida disso: você está gravando bytes em memória que não é do seu array. Às vezes "funciona", às vezes corrompe outra variável, às vezes quebra o programa, às vezes vira uma vulnerabilidade —— é o tipo de bug mais temido do C, e o assunto central da Trilha 4.',
        ],
      },
      {
        titulo: 'Programa: inverter uma sequência',
        rotulo: 'inverter.c',
        paragrafos: [
          'Inverter um array no próprio lugar usa o padrão "troca dos extremos": ande até a metade, trocando v[i] com v[n-1-i].',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int v[5] = {1, 2, 3, 4, 5};
    int i;

    printf("original: ");
    for (i = 0; i < 5; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");

    for (i = 0; i < 5 / 2; i++) {
        int temp = v[i];
        v[i] = v[4 - i];
        v[4 - i] = temp;
    }

    printf("invertido: ");
    for (i = 0; i < 5; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
    return 0;
}`,
        saida: `original: 1 2 3 4 5 
invertido: 5 4 3 2 1 `,
      },
      {
        titulo: 'Programa: checando dígitos repetidos',
        rotulo: 'digitos.c',
        paragrafos: [
          'Um array de contadores é um dos usos mais elegantes de array: 10 posições, uma por dígito. Para cada dígito do número, incremente a contagem correspondente.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int n;
    int digitos[10] = {0};
    int d;

    printf("Digite um numero: ");
    scanf("%d", &n);

    if (n < 0) {
        n = -n;
    }

    if (n == 0) {
        digitos[0] = 1;
    }

    while (n > 0) {
        digitos[n % 10]++;
        n = n / 10;
    }

    printf("frequencia dos digitos:\\n");
    for (d = 0; d < 10; d++) {
        if (digitos[d] > 0) {
            printf("digito %d: %d vez(es)\\n", d, digitos[d]);
        }
    }
    return 0;
}`,
        saida: `Digite um numero: 455
frequencia dos digitos:
digito 4: 1 vez(es)
digito 5: 2 vez(es)`,
      },
      {
        titulo: 'Arrays 2D: matrizes',
        rotulo: 'matriz',
        paragrafos: [
          'Um <code>int m[3][4]</code> é uma tabela com 3 linhas e 4 colunas. As posições <code>m[i][j]</code> combinam o índice da linha com o da coluna; loops aninhados percorrem linha a linha. Construir uma <strong>matriz identidade</strong> (1 na diagonal, 0 no resto) é o exercício canônico:',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int mat[4][4] = {0};
    int i, j;

    for (i = 0; i < 4; i++) {
        mat[i][i] = 1;
    }

    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            printf("%d ", mat[i][j]);
        }
        printf("\\n");
    }
    return 0;
}`,
        saida: `1 0 0 0 
0 1 0 0 
0 0 1 0 
0 0 0 1 `,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Crie um array de 10 inteiros em que <code>v[i] = i * i</code> (o quadrado do índice) e imprima todos com o formato <code>i: quadrado</code>.',
        dica: 'Um for de 0 a 9 preenchendo e outro imprimindo — ou o mesmo for.',
        solucao: `#include <stdio.h>

int main(void)
{
    int v[10];
    int i;

    for (i = 0; i < 10; i++) {
        v[i] = i * i;
    }

    for (i = 0; i < 10; i++) {
        printf("%d: %d\\n", i, v[i]);
    }
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Leia 5 números, guarde em um array e depois imprima o maior valor e a posição (índice) onde ele está.',
        dica: 'Um "segundo maior" flag: maior_atual + indice_atual, atualizados quando v[i] for maior.',
        solucao: `#include <stdio.h>

int main(void)
{
    int v[5];
    int i, maior, indice;

    printf("Digite 5 numeros:\\n");
    for (i = 0; i < 5; i++) {
        printf("> ");
        scanf("%d", &v[i]);
    }

    maior = v[0];
    indice = 0;
    for (i = 1; i < 5; i++) {
        if (v[i] > maior) {
            maior = v[i];
            indice = i;
        }
    }

    printf("maior: %d na posicao %d\\n", maior, indice);
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Leia 6 números e imprima a média deles (double), usando um array. Depois imprima quantos estão acima da média.',
        dica: 'Primeiro preencha e some; depois, com a média na mão, conte em um segundo for.',
        solucao: `#include <stdio.h>

int main(void)
{
    int v[6];
    int i, soma = 0, acima = 0;
    double media;

    printf("Digite 6 numeros:\\n");
    for (i = 0; i < 6; i++) {
        printf("> ");
        scanf("%d", &v[i]);
        soma += v[i];
    }

    media = soma / 6.0;
    for (i = 0; i < 6; i++) {
        if (v[i] > media) {
            acima++;
        }
    }

    printf("media: %.2f\\n", media);
    printf("acima da media: %d\\n", acima);
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Um professor deu 10 notas (0–10). Leia-as, guarde em um array e imprima um histograma: para cada nota possível de 0 a 10, quantas vezes ela apareceu (use um array de contadores de 11 posições).',
        dica: '<code>cont[nota]++;</code> dentro do laço de leitura.',
        solucao: `#include <stdio.h>

int main(void)
{
    int notas[10];
    int cont[11] = {0};
    int i, nota;

    printf("Digite 10 notas (0-10):\\n");
    for (i = 0; i < 10; i++) {
        printf("> ");
        scanf("%d", &nota);
        notas[i] = nota;
        cont[nota]++;
    }

    printf("histograma:\\n");
    for (i = 0; i <= 10; i++) {
        if (cont[i] > 0) {
            printf("%2d: %d vez(es)\\n", i, cont[i]);
        }
    }

    printf("notas digitadas: ");
    for (i = 0; i < 10; i++) {
        printf("%d ", notas[i]);
    }
    printf("\\n");
    return 0;
}`,
        solucao_obs: 'O array notas guarda a sequência original; o cont[notas[i]]++] vira o histograma. Notas fora de 0–10 quebrariam o índice — validação fica como extensão sugerida.',
      },
      {
        nivel: 3,
        enunciado:
          'Crie uma matriz 3x3 com a diagonal principal valendo 5 nas bordas e 0 no interior, exceto o centro que vale 9. Imprima a matriz.',
        dica: 'Inicialize com {0}, force alguns pontos e imprima com loops aninhados.',
        solucao: `#include <stdio.h>

int main(void)
{
    int m[3][3] = {0};
    int i, j;

    m[0][0] = 5;
    m[1][1] = 9;
    m[2][2] = 5;

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            printf("%d ", m[i][j]);
        }
        printf("\\n");
    }
    return 0;
}`,
      },
    ],
    quiz: [
      {
        pergunta: 'Qual o índice do PRIMEIRO elemento de um array de 5 posições?',
        opcoes: ['0', '1', '5', '-1'],
        correta: 0,
        explicacao: 'Arrays em C são 0-based: a primeira posição é o índice 0.',
      },
      {
        pergunta: 'Com <code>int v[5] = {10, 20};</code>, quanto vale <code>v[4]</code>?',
        opcoes: ['0', 'não foi definido', '20', '10'],
        correta: 0,
        explicacao: 'Inicialização parcial zera as posições restantes.',
      },
      {
        pergunta: 'O que acontece ao acessar <code>v[5]</code> em um array de 5 elementos?',
        opcoes: [
          'é comportamento indefinido — pode "funcionar", corromper memória ou quebrar',
          'sempre retorna um valor zero seguro',
          'o compilador para com erro',
          'o array cresce automaticamente',
        ],
        correta: 0,
        explicacao: 'Sair dos limites é UB: o C nada impede e nada avisa.',
      },
      {
        pergunta: 'Como obter o número de elementos de <code>int v[10]</code> portavelmente?',
        opcoes: [
          'sizeof(v) / sizeof(v[0])',
          'sizeof(v)',
          'v.tamanho()',
          'sizeof(v[0]) / sizeof(v)',
        ],
        correta: 0,
        explicacao: 'sizeof total dividido pelo tamanho de um elemento dá a contagem.',
      },
      {
        pergunta: 'E o código <code>int m[3][4]</code> — quantos elementos?',
        opcoes: ['12', '7', '34', 'não compila'],
        correta: 0,
        explicacao: '3 linhas × 4 colunas = 12 posições m[i][j].',
      },
    ],
    projeto: {
      titulo: 'Quadro de velha (padrões em matriz)',
      descricao:
        'Crie <code>padrao.c</code> que preenche uma matriz 6x6 (ou tabuleiro 6x6) com um padrão seu: por exemplo, "x" nas bordas, "o" na diagonal e "." no interior. Imprima o tabuleiro com espaço entre as células. Depois adicione uma segunda matriz que gira 90° da primeira (linha vira coluna de trás para a frente) e imprima as duas lado a lado.',
      criterios: [
        'Usa array 2D com inicializador {0} e atribuições por índices.',
        'Imprime o tabuleiro com loops aninhados e formatação.',
        'A "rotação" usa loops para copiar m1 para m2 (não atribuição direta).',
        'Compila com <code>-Wall -Wextra -std=c11</code> sem avisos.',
      ],
    },
  },
  {
    trilha: '1',
    numero: '09',
    titulo: 'Funções',
    subtitulo: 'definição, protótipo, retorno e recursão de degustação',
    objetivo:
      'Aprender a criar funções: definição, protótipo (declaração), retorno, parâmetros, chamada e a crucial passagem por valor. Incluir uma degustação de recursão simples (fatorial) — a teoria profunda fica para a Trilha 2.',
    prerequisitos: 'T1.08',
    duracao: '~45 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Capítulo 4 — Funções',
      king: 'Capítulo 9 — Funções',
      foco:
        'No King, capítulo 9 é obrigatório: leia especialmente a seção sobre passagem por valor e protótipos. No Beej, o capítulo 4 dá um bom panorama com exemplos curtos.',
    },
    secoes: [
      {
        titulo: 'Por que funções?',
        rotulo: 'motivação',
        paragrafos: [
          'Uma <strong>função</strong> é uma unidade de código com nome, que recebe <strong>parâmetros</strong> (opcionais), faz algo e <strong>retorna</strong> um valor (ou nada, com <code>void</code>). Funções dão nome às partes do programa, eliminam duplicação e isolam erros. Um programa bem dividido em funções pequenas é lido quase como prosa.',
          'Peça por peça de uma definição: <code>retorno nome(parametros) { corpo }</code>.',
        ],
      },
      {
        titulo: 'Anatomia: retorno, parâmetros, corpo',
        rotulo: 'definindo',
        paragrafos: [
          'No exemplo, <code>media</code> recebe duas notas e devolve a média. Repare que o <code>return</code> envia o valor para quem chamou, e que chamar a função dentro de um <code>printf</code> é comum.',
        ],
        codigo: `#include <stdio.h>

double media(double n1, double n2)
{
    return (n1 + n2) / 2.0;
}

int main(void)
{
    printf("media de 7.5 e 8.5: %.2f\\n", media(7.5, 8.5));
    printf("media de 10.0 e 2.0: %.2f\\n", media(10.0, 2.0));
    return 0;
}`,
        saida: `media de 7.5 e 8.5: 8.00
media de 10.0 e 2.0: 6.00`,
      },
      {
        titulo: 'Protótipos: declare antes de usar',
        rotulo: 'protótipos',
        paragrafos: [
          'O compilador lê o arquivo de cima para baixo. Se <code>main</code> aparece antes da função que ela chama, o gcc reclamará ("implicit declaration") — um warning. A solução é colocar um <strong>protótipo</strong> (só o cabeçalho + <code>;</code>) antes do <code>main</code>. É o profissional: todo cabeçalho costuma vir no topo.',
        ],
        codigo: `#include <stdio.h>

int eh_par(int n);   /* protótipo: declara a função antes do uso */

int main(void)
{
    int x = 8;

    if (eh_par(x)) {
        printf("%d e par\\n", x);
    } else {
        printf("%d e impar\\n", x);
    }
    return 0;
}

int eh_par(int n)
{
    return n % 2 == 0;
}`,
        saida: `8 e par`,
      },
      {
        titulo: 'Passagem por valor: a cópia que não volta',
        rotulo: 'passagem por valor',
        paragrafos: [
          'Em C, os parâmetros são <strong>cópias</strong>: a função recebe o <em>valor</em>, não a variável. Mexer no parâmetro <em>não</em> altera a variável do chamador. Por isso a "troca" abaixo não troca nada — e por isso precisamos de ponteiros (Trilha 2) para funções que modificam o chamador.',
        ],
        codigo: `#include <stdio.h>

void tenta_trocar(int a, int b)
{
    int temp = a;
    a = b;
    b = temp;
}

int main(void)
{
    int x = 1;
    int y = 2;

    printf("antes da chamada: x=%d y=%d\\n", x, y);
    tenta_trocar(x, y);
    printf("depois da chamada: x=%d y=%d\\n", x, y);
    return 0;
}`,
        saida: `antes da chamada: x=1 y=2
depois da chamada: x=1 y=2`,
        paragrafos_fim: [
          'Considere de novo: <code>a</code> e <code>b</code> foram trocados <em>dentro da função</em>, mas eram cópias. <code>x</code> e <code>y</code> ficaram intactos. Na Trilha 2 você verá como passar <em>endereços</em> para consertar isso.',
        ],
      },
      {
        titulo: 'main(void) vs main()',
        rotulo: 'main',
        paragrafos: [
          '<code>int main(void)</code> declara que <code>main</code> não recebe argumentos. <code>int main()</code> é a sintaxe "antiga", que em C de verdade significa "recebe o que vier" (sem protótipo). O padrão recomenda <strong><code>int main(void)</code></strong> — e é o que usamos em todo o curso. (Quando quisermos ler argumentos do terminal, será <code>int main(int argc, char *argv[])</code>, no módulo 1.12.)',
        ],
      },
      {
        titulo: 'Recursão: a função que chama a si mesma (degustação)',
        rotulo: 'recursão',
        paragrafos: [
          'Uma função pode chamar a si mesma: isso é <strong>recursão</strong>. Ela precisa de um <em>caso base</em> que para a cadeia e um <em>passo recursivo</em> que se aproxima dele. O fatorial é o exemplo clássico: <code>n! = n × (n-1)!</code>, com <code>0! = 1</code>. Recursão a fundo (quando usar, quando evitar, pilha) é assunto da Trilha 2 — aqui é degustação.',
        ],
        codigo: `#include <stdio.h>

long long fatorial(int n)
{
    if (n <= 1) {
        return 1;
    }
    return n * fatorial(n - 1);
}

int main(void)
{
    int n;

    printf("Fatorial de qual numero? ");
    scanf("%d", &n);

    printf("%d! = %lld\\n", n, fatorial(n));
    return 0;
}`,
        saida: `Fatorial de qual numero? 10
10! = 3628800`,
      },
      {
        titulo: 'Programa: teste de primalidade como função',
        rotulo: 'primo-função',
        paragrafos: [
          'Fechando com o <code>eh_primo</code> reescrito como função: a função devolve 1 (verdadeiro) ou 0 (falso), e o <code>main</code> fica pequeno, contando a história.',
        ],
        codigo: `#include <stdio.h>

int eh_primo(int n)
{
    int i;

    if (n < 2) {
        return 0;
    }
    for (i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            return 0;
        }
    }
    return 1;
}

int main(void)
{
    int n;

    printf("Digite um numero: ");
    scanf("%d", &n);

    if (eh_primo(n)) {
        printf("%d e primo\\n", n);
    } else {
        printf("%d nao e primo\\n", n);
    }
    return 0;
}`,
        saida: `Digite um numero: 29
29 e primo`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Escreva uma função <code>potencia(int base, int exp)</code> que calcula base^exp com um loop (exp >= 0) e a chame no main para 2^10, 3^4 e 5^0.',
        dica: 'Acumule o resultado multiplicando pela base, exp vezes.',
        solucao: `#include <stdio.h>

int potencia(int base, int exp)
{
    int i;
    int resultado = 1;

    for (i = 0; i < exp; i++) {
        resultado *= base;
    }
    return resultado;
}

int main(void)
{
    printf("2^10 = %d\\n", potencia(2, 10));
    printf("3^4  = %d\\n", potencia(3, 4));
    printf("5^0  = %d\\n", potencia(5, 0));
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Escreva uma função <code>max3(int a, int b, int c)</code> que devolve o maior dos três, e um main que lê três números e imprime o resultado.',
        dica: 'Use a técnica "maior até agora" dentro da função.',
        solucao: `#include <stdio.h>

int max3(int a, int b, int c)
{
    int maior = a;

    if (b > maior) {
        maior = b;
    }
    if (c > maior) {
        maior = c;
    }
    return maior;
}

int main(void)
{
    int x, y, z;

    printf("Digite tres numeros: ");
    scanf("%d %d %d", &x, &y, &z);

    printf("maior: %d\\n", max3(x, y, z));
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Implemente a soma de 1 a n de forma RECURSIVA (somar de n até 1). Imprima o resultado para n = 100.',
        dica: 'Caso base: se <= 1, devolve 1; senão, n + soma(n-1).',
        solucao: `#include <stdio.h>

int soma_ate(int n)
{
    if (n <= 1) {
        return 1;
    }
    return n + soma_ate(n - 1);
}

int main(void)
{
    printf("soma de 1 a 100: %d\\n", soma_ate(100));
    return 0;
}`,
        solucao_obs: 'Recursão a fundo fica para a Trilha 2; aqui é apenas o "gosto" do conceito.',
      },
      {
        nivel: 3,
        enunciado:
          'Escreva uma função <code>fib(int n)</code> ITERATIVA que devolve o n-ésimo termo de Fibonacci (1, 1, 2, 3, 5, 8...) e imprima fibonacci de 1 a 10.',
        dica: 'Guarde um "atual" e um "anterior", atualizando em cada volta.',
        solucao: `#include <stdio.h>

int fib(int n)
{
    int a = 1, b = 1, i, prox;

    for (i = 3; i <= n; i++) {
        prox = a + b;
        a = b;
        b = prox;
    }
    return b;
}

int main(void)
{
    int i;

    for (i = 1; i <= 10; i++) {
        printf("fib(%d) = %d\\n", i, fib(i));
    }
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Crie uma função <code>eh_digito_par(int n)</code> que devolve 1 se TODOS os dígitos de n forem pares (0, 2, 4, 6, 8), e 0 caso contrário. Teste com 2468 (1) e 123 (0).',
        dica: 'Vá "arrancando" dígitos com % e /, retornando 0 ao achar um ímpar.',
        solucao: `#include <stdio.h>

int eh_digito_par(int n)
{
    if (n < 0) {
        n = -n;
    }
    if (n == 0) {
        return 1;   /* 0 e par */
    }

    while (n > 0) {
        if ((n % 10) % 2 != 0) {
            return 0;
        }
        n = n / 10;
    }
    return 1;
}

int main(void)
{
    printf("2468: %d\\n", eh_digito_par(2468));
    printf("123: %d\\n", eh_digito_par(123));
    printf("0: %d\\n", eh_digito_par(0));
    return 0;
}`,
      },
    ],
    quiz: [
      {
        pergunta: 'O que é um PROTÓTIPO de função?',
        opcoes: [
          'a declaração (cabeçalho + ;) antes do uso, evitando warnings',
          'o primeiro esboço da função, não compilável',
          'a função main sempre',
          'um comentário explicando a função',
        ],
        correta: 0,
        explicacao: 'Colocamos o cabeçalho com ; no topo para o compilador conhecer a função antes do main.',
      },
      {
        pergunta: 'Em "passagem por valor", o que a função recebe?',
        opcoes: [
          'uma cópia do valor — mexer no parâmetro não altera o chamador',
          'o endereço da variável',
          'um ponteiro para o chamador',
          'a variável original',
        ],
        correta: 0,
        explicacao: 'Parâmetros são cópias; por isso a "troca" com dois ints não troca nada fora.',
      },
      {
        pergunta: 'Qual a assinatura correta e recomendada para main sem argumentos?',
        opcoes: ['int main(void)', 'void main()', 'int main', 'main(int argc)'],
        correta: 0,
        explicacao: 'void deixa explícito que não há parâmetros; é o padrão recomendado.',
      },
      {
        pergunta: 'Toda função que devolve um valor deve ter:',
        opcoes: ['um return no caminho certo', 'um printf', 'pelo menos 2 parâmetros', 'um protótipo obrigatório'],
        correta: 0,
        explicacao: 'A função deve devolver o valor via return (em todos os caminhos possíveis).',
      },
      {
        pergunta: 'O que a recursão SEMPRE precisa ter para não entrar em loop infinito?',
        opcoes: ['um caso base que para a cadeia', 'um contador global', 'a função main', 'uma variável static'],
        correta: 0,
        explicacao: 'Sem caso base, as chamadas encadeadas nunca terminam (estouro de pilha).',
      },
    ],
  },
  {
    trilha: '1',
    numero: '10',
    titulo: 'Escopo, duração e organização',
    subtitulo: 'onde as variáveis vivem e por quanto tempo',
    objetivo:
      'Compreender escopo de bloco vs de arquivo, a duração automática vs estática, o papel do static como estado interno de funções, e as boas práticas de organização — incluindo o porquê de evitar variáveis globais e a ideia de múltiplos arquivos.',
    prerequisitos: 'T1.09',
    duracao: '~30 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Capítulo 13 — escopo e duração',
      king: 'Capítulo 10 — Organização de programas',
      foco:
        'No King, capítulo 10 fala de organização e de como dividir um programa em arquivos — leia a parte conceitual mesmo sem compilar 10 arquivos. No Beej, o capítulo sobre escopo tem o vocabulário exato (automatic/static duration, block/file scope).',
    },
    secoes: [
      {
        titulo: 'Escopo de bloco: a variável que só existe na chave',
        rotulo: 'escopo de bloco',
        paragrafos: [
          'Tudo o que é declarado dentro de <code>{ }</code> (um bloco) existe apenas dentro dele: é o <strong>escopo de bloco</strong>. Fora do bloco, a variável não é visível — e o mesmo nome pode ser reutilizado em outro bloco. Uma variável declarada dentro da função é "local" à função; um <code>for</code> com a própria variável (<code>int i</code>) é uma das formas preferidas de limitar até onde ela vale.',
          'Sombreamento: se um bloco interno declara um nome igual ao de um bloco externo, o interno "esconde" o externo (shadowing). É legal, mas confunde — evite.',
        ],
      },
      {
        titulo: 'Escopo de arquivo (globais): fique de olho',
        rotulo: 'globais',
        paragrafos: [
          'Declarar fora de toda função cria uma variável de <strong>escopo de arquivo</strong> (global): visível em todo o arquivo, de qualquer função. Isso pode parecer prático (não precisa passar parâmetro), mas é uma armadilha: qualquer função pode alterar, e o fluxo do programa vira uma sopa. A regra de ouro deste módulo: <strong>use parâmetros e retornos — evite globais</strong>.',
        ],
        codigo: `#include <stdio.h>

int total_bruto = 0;   /* global: visivel em todo o arquivo */

void soma_bruto(int valor)
{
    total_bruto += valor;
}

int main(void)
{
    soma_bruto(10);
    soma_bruto(25);

    printf("total bruto: %d\\n", total_bruto);
    return 0;
}`,
        saida: `total bruto: 35`,
        paragrafos_fim: [
          'Compare: para conseguir o mesmo efeito sem global, a função <code>soma_bruto</code> precisaria <em>devolver</em> o novo total e o main acumular. É mais código... e é o que sustenta um programa mantível.',
        ],
      },
      {
        titulo: 'Duração: automática vs estática',
        rotulo: 'duração',
        paragrafos: [
          'Escopo é <em>onde</em> o nome é visível; <strong>duração</strong> é <em>por quanto tempo</em> o espaço existe na memória. são dois conceitos independentes!',
        ],
        lista: [
          '<strong>Automática</strong> (padrão para locais): a variável é criada na entrada do bloco e destruída na saída. Cada chamada de função "recomeça do zero".',
          '<strong>Estática</strong> (<code>static</code> na declaração): o espaço persiste a <em>vida inteira do programa</em>; a variável guarda seu valor entre chamadas, mesmo dentro da função.',
          'Uma variável local <code>static</code> tem duração estática, mas escopo de bloco (só é acessível dentro). É o melhor dos dois mundos para "lembrar" sem poluir o global.',
        ],
      },
      {
        titulo: 'static local: o estado que sobrevive',
        rotulo: 'static',
        paragrafos: [
          'Aqui está o truque clássico: uma variável estática local que conta quantas vezes a função foi chamada. Estática local OU global? Ou ambas — cada uma com seu escopo.',
        ],
        codigo: `#include <stdio.h>

int proximo_id(void)
{
    static int contador = 0;   /* preservado entre chamadas */
    contador++;
    return contador;
}

int main(void)
{
    printf("id: %d\\n", proximo_id());
    printf("id: %d\\n", proximo_id());
    printf("id: %d\\n", proximo_id());
    return 0;
}`,
        saida: `id: 1
id: 2
id: 3`,
        paragrafos_fim: [
          'Se <code>contador</code> fosse automática (sem <code>static</code>), cada chamada recomeçaria em 0 e o resultado seria sempre 1. O <code>static</code> local é a ferramenta para "memória interna" da função, sem expor a nada externo.',
        ],
      },
      {
        titulo: 'Boas práticas de organização',
        rotulo: 'organização',
        lista: [
          'Declare as variáveis no <strong>menor escopo possível</strong> — perto do uso, dentro do menor bloco que precisa dela.',
          'Preira parâmetros + retorno a globais: a função fica previsível e testável.',
          'Dê nomes claros. Uma função deve caber em um sentido (ex.: <code>media</code>, <code>eh_primo</code>).',
          'Uma função, uma responsabilidade. Se você precisa de comentário "e aqui faz também", divida.',
          'Use constantes com <code>const</code> para valores que não devem mudar.',
          'Quando (e somente quando) precisar de estado persistente, prefira <code>static</code> local a global.',
        ],
      },
      {
        titulo: 'Múltiplos arquivos: a ideia em vinte segundos',
        rotulo: 'multi-arquivo',
        paragrafos: [
          'Programas reais se dividem em vários arquivos: um <code>.c</code> implementa e um <code>.h</code> declara (protótipos + constantes) — assim outras partes <code>#include</code> o <code>.h</code> e usam as funções sem precisar dos detalhes. O gcc compila todos os <code>.c</code> juntos: <code>gcc main.c util.c util.h -o prog</code>. Os mecanismos finos (headers, makefiles, linkagem) ficam para a Trilha 2; aqui você só precisa saber que o padrão existe e qual é o "o quê" de cada arquivo.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Escreva uma função <code>novo_id(void)</code> com uma variável estática que retorna 1, 2, 3... a cada chamada, e um main que chama 5 vezes imprimindo os ids.',
        dica: 'Estática local: <code>static int n = 0;</code> e <code>n++</code>.',
        solucao: `#include <stdio.h>

int novo_id(void)
{
    static int n = 0;
    n++;
    return n;
}

int main(void)
{
    int i;

    for (i = 1; i <= 5; i++) {
        printf("id %d: %d\\n", i, novo_id());
    }
    return 0;
}`,
      },
      {
        nivel: 2,
        enunciado:
          'Preveja a saída do programa abaixo (que tem sombreamento) e depois confirme rodando: uma variável global <code>x = 1</code>, um main que declara <code>x = 2</code> e um bloco interno declara <code>x = 3</code>, imprimindo na ordem.',
        dica: 'O nome mais interno "vence" dentro do seu escopo.',
        solucao: `#include <stdio.h>

int x = 1;   /* global */

int main(void)
{
    int x = 2;   /* local de main */

    printf("1) %d\\n", x);

    {
        int x = 3;   /* local do bloco interno */
        printf("2) %d\\n", x);
    }

    printf("3) %d\\n", x);
    return 0;
}`,
        solucao_obs: 'Imprime 2, 3, 2: o x interno vale apenas dentro do próprio bloco.',
      },
      {
        nivel: 3,
        enunciado:
          'Refatore: o código abaixo usa uma global <code>saldo</code>. Reescreva-o sem global, com <code>saldo</code> local em main e funções que recebem/retornam o valor.',
        dica: 'Crie <code>int depositar(int saldo, int valor)</code> retornando o novo saldo.',
        solucao: `#include <stdio.h>

int depositar(int saldo, int valor)
{
    return saldo + valor;
}

int sacar(int saldo, int valor)
{
    if (valor <= saldo) {
        return saldo - valor;
    }
    return saldo;
}

int main(void)
{
    int saldo = 100;

    saldo = depositar(saldo, 50);
    printf("apos deposito: %d\\n", saldo);

    saldo = sacar(saldo, 130);
    printf("apos saque: %d\\n", saldo);

    saldo = sacar(saldo, 130);
    printf("apos saque (negado): %d\\n", saldo);
    return 0;
}`,
        solucao_obs: 'Nenhuma variável global. O histórico do saldo vive no main e "viaja" pelos parâmetros/retornos. O segundo saque de 130 é recusado porque o saldo (20) não cobre o valor.',
      },
      {
        nivel: 3,
        enunciado:
          'Crie uma função <code>proxima_par(int n)</code> que, para n par, retorna n e para ímpar retorna n+1 — mas use uma estática local para guardar o último valor devolvido e imprima-o.',
        dica: 'A estática guarda o "último retorno"; lembre de usar apenas dentro da função.',
        solucao: `#include <stdio.h>

int proxima_par(int n)
{
    static int ultimo = 0;

    if (n % 2 != 0) {
        n = n + 1;
    }
    ultimo = n;
    printf("  (ultimo devolvido: %d)\\n", ultimo);
    return n;
}

int main(void)
{
    printf("proxima_par(5): %d\\n", proxima_par(5));
    printf("proxima_par(6): %d\\n", proxima_par(6));
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Escreva um contador de eventos: uma função <code>registrar(void)</code> que incrementa um total (estático), uma <code>consultar(void)</code> que retorna o total e uma <code>resetar(void)</code> que zera. Um main que registra 3x, consulta, reseta e consulta de novo.',
        dica: 'Todas as três precisam enxergar a MESMA variável estática — declare-a em escopo de arquivo mas com <code>static</code> (internal linkage), assim ela não vaza para o resto: <code>static int total;</code> no topo.',
        solucao: `#include <stdio.h>

static int total = 0;   /* static de arquivo: visivel so neste .c */

void registrar(void)
{
    total++;
}

int consultar(void)
{
    return total;
}

void resetar(void)
{
    total = 0;
}

int main(void)
{
    registrar();
    registrar();
    registrar();

    printf("total: %d\\n", consultar());

    resetar();
    printf("apos reset: %d\\n", consultar());
    return 0;
}`,
        solucao_obs: 'O static de arquivo dá "privacidade": só este arquivo enxerga a variável — um meio-termo entre global pública e local.',
      },
    ],
    quiz: [
      {
        pergunta: 'Escopo de bloco significa que a variável:',
        opcoes: [
          'só existe dentro das chaves onde foi declarada',
          'existe no arquivo inteiro',
          'dura a vida toda do programa',
          'é visível para todas as funções',
        ],
        correta: 0,
        explicacao: 'Dentro de { } é local; fora das chaves o nome não existe.',
      },
      {
        pergunta: 'Uma variável local <code>static</code>:',
        opcoes: [
          'tem duração estática (persiste entre chamadas) mas escopo de bloco (só visível na função)',
          'vira global automaticamente',
          'não pode ser usada em funções',
          'é destruída a cada chamada',
        ],
        correta: 0,
        explicacao: 'Static local = memória que persiste + nome que não vaza. O melhor dos mundos.',
      },
      {
        pergunta: 'Por que evitar variáveis globais na maioria dos casos?',
        opcoes: [
          'qualquer função pode alterá-las, tornando o fluxo imprevisível',
          'elas ocupam memória demais',
          'o compilador proíbe',
          'elas não se pode ler',
        ],
        correta: 0,
        explicacao: 'Com globais, a ordem das chamadas muda o estado global; é difícil raciocinar e testar.',
      },
      {
        pergunta: 'Duração automática significa que a variável:',
        opcoes: [
          'é criada na entrada do bloco e destruída na saída',
          'dura até o fim do programa',
          'é guardada em disco',
          'só pode ser lida uma vez',
        ],
        correta: 0,
        explicacao: 'Locais automáticas "morrem" ao sair do bloco — recompartilhadas em cada chamada.',
      },
      {
        pergunta: 'Num projeto multi-arquivo, o que normalmente fica no arquivo .h?',
        opcoes: [
          'protótipos (declarações) e constantes, para os outros incluírem',
          'a implementação completa de todas as funções',
          'o arquivo com a função main',
          'nunca nada',
        ],
        correta: 0,
        explicacao: 'O .c implementa; o .h declara — os outros arquivos #include o .h e usam as funções.',
      },
    ],
    projeto: {
      titulo: 'Painel de estatísticas do jogador',
      descricao:
        'Crie <code>painel.c</code>: um "painel" em que várias funções compartilham estado: <code>ganhar(int pts)</code>, <code>perder(int pts)</code>, <code>consultar_pontos()</code>, <code>consultar_partidas()</code> e <code>resetar()</code>. Use <code>static</code> de arquivo para os contadores, funções pequenas e um menu do-while que lê comandos (g de ganhar, p de perder, c consultar, r resetar, s sair).',
      criterios: [
        'Estado compartilhado via static de arquivo (sem globais não estáticos).',
        '5+ funções pequenas com responsabilidades únicas.',
        'Menu do-while com scanf e switch/if.',
        'Sem avisos com <code>-Wall -Wextra -std=c11</code>.',
      ],
    },
  },
  {
    trilha: '1',
    numero: '11',
    titulo: 'Erros comuns e depuração',
    subtitulo: 'caçando bugs com warnings, printf, assert e gdb',
    objetivo:
      'Conhecer os erros clássicos de iniciante (faltar ;, = vs ==, off-by-one, esquecer & no scanf, tipo errado no printf), aprender a ler warnings do gcc, usar printf de depuração, assert como trava de pré-condições e o gdb para passo a passo.',
    prerequisitos: 'T1.09',
    duracao: '~50 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Seções 4.1 (erros comuns) e 28.4 (assert)',
      king: 'Capítulos 1 (primeiros passos) e 9 (depuração, até testes)',
      foco:
        'No Beej, leia a lista de erros comuns e a seção do assert. No King, o final do capítulo 9 tem a estratégia de depuração passo a passo; volte aos capítulos 1 e 2 para os erros de sintaxe listados.',
    },
    secoes: [
      {
        titulo: 'As armadilhas clássicas do C',
        rotulo: 'erros clássicos',
        paragrafos: [
          'A maior parte do tempo de um iniciante é devorado por um punhado de bugs que se repetem. Conheça o crime para reconhecer o criminoso:',
        ],
        lista: [
          '<strong>Ponto e vírgula esquecido</strong> — o gcc acusa na linha seguinte. Corrija o primeiro erro primeiro.',
          '<strong><code>=</code> no lugar de <code>==</code></strong> — o programa compila e a condição vira sempre verdadeira. O gcc avisa com <code>-Wall</code> ("suggest parentheses").',
          '<strong>Off-by-one</strong> — usar <code>&lt;=</code> onde deveria ser <code>&lt;</code>, ou percorrer 1..n em vez de 0..n-1. Compila perfeitamente.',
          '<strong>Esquecer <code>&amp;</code> no scanf</strong> — o scanf recebe um valor em vez de um endereço; com <code>-Wall</code> há warning, e em execução costuma estourar.',
          '<strong>Tipo errado no printf</strong> — <code>%f</code> com <code>int</code>, <code>%d</code> com <code>double</code>... comportamento indefinido, e o <code>-Wall -Wformat</code> denuncia.',
          '<strong>Comparar double com <code>==</code></strong> — ponto flutuante arredonda; use margem de erro.',
        ],
      },
      {
        titulo: 'Como ler um warning (e o infame = vs ==)',
        rotulo: 'warnings',
        paragrafos: [
          'Um <strong>warning</strong> é o compilador dizendo "isso provavelmente não é o que você quer". O formato é <code>arquivo:linha:coluna: warning: mensagem [-Wtipo]</code>. O trecho <code>[-W...]</code> identifica a família do aviso. Compile com <code>-Wall -Wextra</code> e trate qualquer warning como erro em potencial.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int x = 2;

    if (x = 3) {   /* BUG: atribuicao, nao comparacao */
        printf("x vale 3\\n");
    }
    return 0;
}`,
        saida: `bug.c:7:9: warning: suggest parentheses around assignment used as truth value [-Wparentheses]
    7 |     if (x = 3) {   /* BUG: atribuicao, nao comparacao */
      |         ^

x vale 3`,
        paragrafos_fim: [
          'Com <code>-Wall</code>, o gcc aponta o "x = 3" como suspeito. Sem o flag, o programa roda imprimindo "x vale 3" — o bug passa despercebido. Para comparar: <code>x == 3</code>.',
        ],
      },
      {
        titulo: 'O scanf sem &: a receita do desastre',
        rotulo: 'scanf sem &',
        paragrafos: [
          'Escrever <code>scanf("%d", x);</code> em vez de <code>scanf("%d", &x);</code> é o erro mais famoso de todos. O compilador avisa (veremos o warning real), e na execução o scanf tenta gravar em um endereço "sem sentido" — na prática, comportamento indefinido.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int x;

    printf("Digite um numero: ");
    scanf("%d", x);   /* BUG: faltou o & */
    printf("voce digitou: %d\\n", x);
    return 0;
}`,
        saida: `bug2.c: In function 'main':
bug2.c:8:13: warning: format '%d' expects argument of type 'int *', but argument 2 has type 'int' [-Wformat=]
    8 |     scanf("%d", x);   /* BUG: faltou o & */
      |            ~^   ~
      |             |   |
      |             |   int
      |             int *
bug2.c:8:5: warning: 'x' is used uninitialized [-Wuninitialized]
    8 |     scanf("%d", x);   /* BUG: faltou o & */
      |     ^~~~~~~~~~~~~~
bug2.c:5:9: note: 'x' was declared here
    5 |     int x;
      |         ^`,
        paragrafos_fim: [
          'A mensagem é clara: "expects argument of type int *, but argument 2 has type int". A regra é simples — <em>toda variável simples no scanf leva <code>&amp;</code></em>.',
        ],
      },
      {
        titulo: 'O off-by-one no espelho',
        rotulo: 'off-by-one',
        paragrafos: [
          'O off-by-one não dá warning: ele <em>roda errado e nada fala</em>. Compare o bug com a correção — a diferença é um sinal de comparação:',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int soma = 0;
    int i;

    for (i = 1; i <= 7; i++) {   /* BUG: deveria ser i <= 5 */
        soma += i;
    }

    printf("soma de 1 a 5: %d\\n", soma);
    return 0;
}`,
        saida: `soma de 1 a 5: 28`,
        paragrafos_fim: [
          'O programa "funciona", a resposta está errada, e nenhum erro aparece. É o tipo de bug que exige os dois aliados a seguir: <em>pensar sobre o domínio</em> e <em>inspecionar com o depurador</em>.',
        ],
      },
      {
        titulo: 'Depuração por printf: seu primeiro detector',
        rotulo: 'printf de depuração',
        paragrafos: [
          'Quando o programa compila e roda mas faz o contrário do esperado, imprima <em>o que você está pensando</em>: <code>printf("i=%d, soma=%d\\n", i, soma);</code> dentro do loop. Você vê a evolução das variáveis e acha o instante exato em que algo sai dos trilhos. Retire (ou comente) os prints de depuração ao terminar — código limpo não tem lixo.',
        ],
      },
      {
        titulo: 'assert: a trava que para o programa',
        rotulo: 'assert',
        paragrafos: [
          'O <code>assert</code> (de <code>&lt;assert.h&gt;</code>) avalia uma condição e, se for falsa, aborta o programa imprimindo o que falhou, o arquivo e a linha. É perfeito para <strong>pré-condições</strong>: "aqui, matematicamente, isto tem que ser verdade". Se algum dia não for, você quer descobrir <em>agora</em>.',
        ],
        codigo: `#include <stdio.h>
#include <assert.h>

int divide(int a, int b)
{
    assert(b != 0);
    return a / b;
}

int main(void)
{
    printf("10 / 2 = %d\\n", divide(10, 2));
    printf("8 / 0 = %d\\n", divide(8, 0));   /* assert trava aqui */
    printf("nunca chega aqui\\n");
    return 0;
}`,
        saida: `10 / 2 = 5
Assertion failed: b != 0, file assert_demo.c, line 6`,
        paragrafos_fim: [
          'Depuração acharia a divisão "impossível". Produção: compilar com <code>-DNDEBUG</code> desliga todos os asserts (cuidado: condição não é avaliada, então não coloque efeitos colaterais dentro de assert).',
        ],
      },
      {
        titulo: 'gdb: o passo a passo de verdade',
        rotulo: 'gdb',
        paragrafos: [
          'Compilado com <code>-g</code>, o programa carrega "mapa" de linhas e variáveis. Os quatro comandos que resolvem 90% dos casos: <code>break</code> (para em uma linha/função), <code>next</code> (executa próxima linha, sem entrar em função), <code>step</code> (entra em função), <code>print</code> (mostra o valor de uma variável).',
        ],
        codigo: `gcc -g -Wall -Wextra -std=c11 prog.c -o prog
gdb ./prog.exe
(gdb) break main
(gdb) run
(gdb) next
(gdb) print soma
(gdb) print i
(gdb) step
(gdb) continue
(gdb) quit`,
        paragrafos_fim: [
          'Para o off-by-one acima, um <code>print i</code> justo antes do break no laço mostra <code>i = 6</code> entrando quando deveria parar em 5 — o "último retorno inesperado" é a prova do bug.',
        ],
      },
      {
        titulo: 'A versão corrigida',
        rotulo: 'correção',
        paragrafos: [
          'O mesmo programa, certo:',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    int soma = 0;
    int i;

    for (i = 1; i <= 5; i++) {
        soma += i;
    }

    printf("soma de 1 a 5: %d\\n", soma);
    return 0;
}`,
        saida: `soma de 1 a 5: 15`,
      },
    ],
    exercicios: [
      {
        nivel: 3,
        enunciado:
          'Encontre e corrija os dois erros no código: falta um <code>&amp;</code> no scanf e um ponto e vírgula está faltando em uma das linhas.',
        dica: 'Compile com -Wall e leia <code>arquivo:linha</code>. O primeiro erro bloqueia, o segundo aparece depois.',
        solucao: `#include <stdio.h>

int main(void)
{
    int n;

    printf("Digite um numero: ");
    scanf("%d", &n);

    printf("voce digitou: %d\\n", n);
    return 0;
}`,
        solucao_obs: 'O enunciado intencionalmente tinha <code>scanf("%d", n);</code> e <code>printf(...)</code> sem ponto e vírgula.',
      },
      {
        nivel: 3,
        enunciado:
          'O programa abaixo soma as notas até digitar 0, mas está devolvendo valores estranhos. Depure com <code>printf</code> de depuração (ou gdb) e corrija: <code>int n; int soma = 0; do { scanf("%d", &amp;n); soma += n; } while (n != 0);</code>. O bug: ele soma o 0 final na média errada de notas — refaça para não contar o 0 sentinela.',
        dica: 'aumente o soma apenas quando n != 0.',
        solucao: `#include <stdio.h>

int main(void)
{
    int n;
    int soma = 0;

    printf("Digite notas (0 encerra):\\n");
    do {
        printf("> ");
        scanf("%d", &n);
        if (n != 0) {
            soma += n;
        }
    } while (n != 0);

    printf("total: %d\\n", soma);
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Use <code>assert</code> para validar que uma função de divisão não recebe divisor zero, e faça um main que teste a função com 0 para ver o programa abortar com a mensagem do assert.',
        dica: 'Inclua <assert.h>. A mensagem mostrada inclui arquivo e linha.',
        solucao: `#include <stdio.h>
#include <assert.h>

double dividir(double a, double b)
{
    assert(b != 0.0);
    return a / b;
}

int main(void)
{
    printf("%.2f\\n", dividir(10.0, 4.0));
    printf("%.2f\\n", dividir(10.0, 0.0));
    return 0;
}`,
        solucao_obs: 'Ao rodar, o programa imprime "2.50" e depois aborta no assert—a mensagem mostrada inclui arquivo e linha.',
      },
      {
        nivel: 4,
        enunciado:
          'O programa seguinte percorre um array de 5 posições, mas imprime um valor lixo na última execução. Descubra o off-by-one e corrija: <code>int v[5] = {10,20,30,40,50}; for (i = 1; i <= 5; i++) printf("%d ", v[i]);</code>.',
        dica: 'v[5] não existe! O laço vai de 0 a 4.',
        solucao: `#include <stdio.h>

int main(void)
{
    int v[5] = {10, 20, 30, 40, 50};
    int i;

    for (i = 0; i < 5; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
    return 0;
}`,
        solucao_obs: 'O valor lixo vinha da leitura fora dos limites (UB). Percorrimento de array é sempre 0..n-1.',
      },
      {
        nivel: 4,
        enunciado:
          'Crie um programa com o erro <code>=</code> no lugar de <code>==</code> (ex.: decidir se o usuário digitou a senha 1234). Compile SEM -Wall, rode, veja a condição sempre "verdadeira"; depois compile COM -Wall e leia o warning. Corrija o programa.',
        dica: 'Warnings são seus amigos: para a condição de senha compare com <code>==</code>.',
        solucao: `#include <stdio.h>

int main(void)
{
    int senha;

    printf("Digite a senha: ");
    scanf("%d", &senha);

    if (senha == 1234) {
        printf("acesso liberado\\n");
    } else {
        printf("acesso negado\\n");
    }
    return 0;
}`,
        solucao_obs: 'No bug, <code>if (senha = 1234)</code> sempre "passava", pois o valor da atribuição é 1234 (verdadeiro).',
      },
    ],
    quiz: [
      {
        pergunta: 'O gcc avisa sobre <code>if (x = 5)</code> se você compilar com:',
        opcoes: ['-Wall (suggest parentheses…)', 'nunca avisa', 'apenas com -O2', 'é erro, não aviso'],
        correta: 0,
        explicacao: 'Com -Wall, o gcc gera o warning "suggest parentheses around assignment used as truth value".',
      },
      {
        pergunta: 'O que informa "arquivo:linha:coluna: warning:..."?',
        opcoes: [
          'onde exatamente está o problema, para você olhar primeiro',
          'onde mora o executável',
          'a versão do compilador',
          'o histórico de compilação',
        ],
        correta: 0,
        explicacao: 'Formato clássico do gcc/clang: localização precisa + tipo + mensagem.',
      },
      {
        pergunta: 'Qual a cara do erro &lt;code&gt;scanf("%d", x)&lt;/code&gt; (sem &amp;) no -Wall?',
        opcoes: [
          'warning: format expects int *, argument has int',
          'nenhum aviso, é 100% válido',
          'error de sintaxe na declaração',
          'o scanf vira printf',
        ],
        correta: 0,
        explicacao: 'O warning -Wformat= mostra exatamente a incompatibilidade de tipos do argumento.',
      },
      {
        pergunta: 'O que faz <code>assert(x > 0)</code> quando x é 0?',
        opcoes: [
          'aborta o programa imprimindo a condição, arquivo e linha',
          'imprime um aviso e continua',
          'troca x por 1',
          'apenas devolve 0',
        ],
        correta: 0,
        explicacao: 'Assert falha → programa aborta com diagnóstico — trava proposital para pré-condições.',
      },
      {
        pergunta: 'Para inspecionar o valor de uma variável no gdb, o comando é:',
        opcoes: ['print var', 'debug var', 'var x', 'show var'],
        correta: 0,
        explicacao: 'print <nome> mostra o valor atual; next/step/break controlam onde parar.',
      },
    ],
  },
  {
    trilha: '1',
    numero: '12',
    titulo: 'Tudo junto: programa de linha de comando',
    subtitulo: 'argc, argv, atoi e um utilitário completo',
    objetivo:
      'Fazer a costura final da trilha: ler argumentos do terminal (argc/argv), converter texto para número (atoi), estruturar um utilitário (entrada → processamento → saída), dividir em funções pequenas e construir um programa completo — além de orientar o projeto final de um interpretador de comandos.',
    prerequisitos: 'T1.09, T1.10',
    duracao: '~40 min',
    nivel: 'Iniciante',
    leitura: {
      beej: 'Capítulo 18 — argc e argv',
      king: 'Capítulos 10 e 19 — organização e programas maiores',
      foco:
        'No Beej, o capítulo de line arguments é curto e objetivo: entenda argc (contagem) e argv (vetor de textos). No King, o capítulo 10 consolidou organização de funções; o 19 mostra um programa maior no fim do livro, inspiração para o seu projeto final.',
    },
    secoes: [
      {
        titulo: 'argc e argv: o terminal falando com seu programa',
        rotulo: 'argc argv',
paragrafos: [
          'Chamar <code>.\\meuprog.exe bom dia</code> dá <code>argc = 3</code>. O <code>argv[0]</code> é o próprio nome do programa, <code>argv[1]</code> é o primeiro argumento (<code>"bom"</code>) e <code>argv[2]</code> o segundo (<code>"dia"</code>).',
          '<strong>Detalhe do Windows:</strong> com o MinGW, o <code>argv[0]</code> costuma chegar com o caminho completo (ex.: <code>C:\\minha\\pasta\\eco.exe</code>), enquanto no Linux costuma ser só o nome digitado. Isso não muda nada no que <em>você</em> programa — mas explica por que a primeira linha do exemplo abaixo varia de máquina para máquina.',
        ],
        codigo: `#include <stdio.h>

int main(int argc, char *argv[])
{
    int i;

    printf("argc: %d\\n", argc);
    for (i = 0; i < argc; i++) {
        printf("argv[%d]: %s\\n", i, argv[i]);
    }
    return 0;
}`,
        saida: `> .\\eco.exe bom dia ja
argc: 4
argv[0]: C:\\caminho\\para\\eco.exe
argv[1]: bom
argv[2]: dia
argv[3]: ja`,
      },
      {
        titulo: 'Convertendo texto em número: atoi',
        rotulo: 'atoi',
        paragrafos: [
          'Argumentos chegam como <em>texto</em>; para somar, precisamos converter. A função <code>atoi</code> (ASCII-to-integer, de <code>&lt;stdlib.h&gt;</code>) faz exatamente isso: lê os dígitos e devolve o <code>int</code>. O utilitário abaixo valida o número de argumentos e imprime a soma:',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    int a, b;

    if (argc != 3) {
        printf("uso: soma.exe numero1 numero2\\n");
        return 1;
    }

    a = atoi(argv[1]);
    b = atoi(argv[2]);

    printf("%d + %d = %d\\n", a, b, a + b);
    return 0;
}`,
        saida: `> .\soma.exe 4 9
4 + 9 = 13

> .\soma.exe sem_arg
uso: soma.exe numero1 numero2`,
      },
      {
        titulo: 'O fluxo de um utilitário: entrada → processamento → saída',
        rotulo: 'fluxo',
        paragrafos: [
          'Um programa de terminal bem-feito obedece um esqueleto previsível:',
        ],
        lista: [
          '<strong>Entrada</strong> — argumentos (argc/argv) e/ou leitura de teclado (scanf).',
          '<strong>Validação</strong> — quantidade de argumentos, tipos, limites. Falhou? mensagem de uso e <code>return 1</code> (código de erro).',
          '<strong>Processamento</strong> — as contas, loops, funções (o "miolo").',
          '<strong>Saída</strong> — resultado formatado; <code>return 0</code> para sucesso.',
        ],
      },
      {
        titulo: 'Dividir para conquistar: main fino',
        rotulo: 'main fino',
        paragrafos: [
          'Um bom utilitário tem <code>main</code> pequeno e funções específicas para cada passo. Onde está a lógica? Nas funções, testáveis e legíveis. É o "cheiro" de programa profissional: você lê o <code>main</code> e sabe o que o programa faz em 5 linhas.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

double media_de_n(int n)
{
    long long soma = 0;
    int i;

    for (i = 1; i <= n; i++) {
        soma += i;
    }
    return soma / (double) n;
}

int main(int argc, char *argv[])
{
    int n;

    if (argc != 2) {
        printf("uso: media.exe N\\n");
        return 1;
    }
    n = atoi(argv[1]);

    if (n <= 0) {
        printf("erro: N deve ser positivo\\n");
        return 1;
    }

    printf("media dos numeros de 1 a %d: %.4f\\n", n, media_de_n(n));
    return 0;
}`,
        saida: `> .\media.exe 10
media dos numeros de 1 a 10: 5.5000`,
      },
      {
        titulo: 'Exemplo completo: um interpretador de comandos',
        rotulo: 'interpretador',
        paragrafos: [
          'O projeto final (abaixo) é um <strong>interpretador de comandos</strong>: um loop que lê um comando ("s" soma, "m" média, "?" ajuda, "q" sair), executa e repete. É um "mini shell" numérico — joga com <code>for (;;)</code>, <code>switch</code>, <code>scanf</code> e funções: tudo desta trilha em um único programa. A versão de referência:',
        ],
        codigo: `#include <stdio.h>

void menu(void)
{
    printf("Comandos:\\n");
    printf("  s <n1> <n2>   soma dois numeros\\n");
    printf("  m             media de 3 numeros\\n");
    printf("  ?             mostra este menu\\n");
    printf("  q             sai\\n");
}

double soma(double a, double b)
{
    return a + b;
}

double media3(double a, double b, double c)
{
    return (a + b + c) / 3.0;
}

int main(void)
{
    char comando;
    double a, b, c;

    menu();

    for (;;) {
        printf("> ");
        scanf(" %c", &comando);

        if (comando == 'q') {
            printf("Ate mais!\\n");
            break;
        } else if (comando == 's') {
            scanf("%lf %lf", &a, &b);
            printf("%.2f + %.2f = %.2f\\n", a, b, soma(a, b));
        } else if (comando == 'm') {
            scanf("%lf %lf %lf", &a, &b, &c);
            printf("media: %.2f\\n", media3(a, b, c));
        } else if (comando == '?') {
            menu();
        } else {
            printf("comando invalido. use ? para ajuda.\\n");
        }
    }
    return 0;
}`,
        saida: `Comandos:
  s <n1> <n2>   soma dois numeros
  m             media de 3 numeros
  ?             mostra este menu
  q             sai
> ?
Comandos:
  s <n1> <n2>   soma dois numeros
  m             media de 3 numeros
  ?             mostra este menu
  q             sai
> s 2.5 3
2.50 + 3.00 = 5.50
> m 10 20 30
media: 20.00
> q
Ate mais!`,
        paragrafos_fim: [
          'O espaço em <code>scanf(" %c")</code> descarta quebras de linha, evitando que o comando vire "Enter". Esse é o tipo de detalhe que a prática ensina — e que você vai caçar com as ferramentas do módulo 1.11.',
        ],
      },
      {
        titulo: 'Como testar seu programa',
        rotulo: 'testes',
        paragrafos: [
          'Teste de terminal é previsível: monte uma lista de casos e execute todos.',
        ],
        lista: [
          'Nenhum argumento (mensagem de uso).',
          'Argumentos inválidos (texto em vez de número) — atoi devolve 0; decida o comportamento.',
          'Casos-limite: 0, negativos, valores que podem estourar <code>long long</code>.',
          'Entrada incompleta no interpretador ("s" sem números) — o scanf espera e o programa pausa.',
          'Sempre compile com <code>-Wall -Wextra</code> — um utilitário com warning é um utilitário com dívida.',
        ],
      },
      {
        titulo: 'O projeto final: passo a passo',
        rotulo: 'projeto final',
        paragrafos: [
          'Seguindo a receita abaixo, você constrói o <code>calc_estudo.exe</code> (detalhes no quadro do projeto):',
        ],
        lista: [
          '<strong>Esqueleto</strong>: crie <code>calc_estudo.c</code> com menu() e main que chama menu() e entra no <code>for (;;)</code>.',
          '<strong>Comando soma</strong>: adicione <code>s</code> com leitura de dois doubles e a função <code>soma()</code>. Compile, teste.',
          '<strong>Comando media</strong>: <code>m</code> com três doubles e <code>media3()</code>. Compile, teste.',
          '<strong>Comando extra</strong>: escolha <code>p</code> (produto), <code>d</code> (desconto) ou <code>f</code> (fatorial). Compile, teste.',
          '<strong>Histórico</strong>: com <code>static</code>, guarde quantas operações foram feitas e exiba com <code>h</code>.',
          '<strong>Polimento</strong>: mensagem de uso, validações, e rodada final com <code>-Wall -Wextra</code> em todos os testes.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Crie um programa <code>eco.c</code> que imprime todos os argumentos (a partir de argv[1]) separados por espaço em uma única linha, ignorando argv[0].',
        dica: 'Um for de i=1 até argc-1 com printf("%s ", argv[i]).',
        solucao: `#include <stdio.h>

int main(int argc, char *argv[])
{
    int i;

    for (i = 1; i < argc; i++) {
        printf("%s ", argv[i]);
    }
    printf("\\n");
    return 0;
}`,
        solucao_obs: 'Rode: <code>.\\eco.exe bom dia</code> → <code>bom dia</code>.',
      },
      {
        nivel: 2,
        enunciado:
          'Crie <code>mult.exe</code>: leia DOIS argumentos, converta com atoi e imprima o produto. Se não houver exatamente dois argumentos, imprima a mensagem de uso e retorne 1.',
        dica: 'Validar argc antes de converter evita crash com argumentos faltando.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    int a, b;

    if (argc != 3) {
        printf("uso: mult.exe numero1 numero2\\n");
        return 1;
    }

    a = atoi(argv[1]);
    b = atoi(argv[2]);

    printf("%d * %d = %d\\n", a, b, a * b);
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Crie <code>media_args.exe</code>: aceita quantos argumentos numéricos o usuário quiser, converte todos com atoi, soma e imprime a média com 2 casas. Se não houver argumentos, mensagem de uso.',
        dica: 'argc - 1 é a quantidade de números; some cada argv[i] convertido.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    int i;
    long long soma = 0;

    if (argc < 2) {
        printf("uso: media_args.exe n1 n2 n3 ...\\n");
        return 1;
    }

    for (i = 1; i < argc; i++) {
        soma += atoi(argv[i]);
    }

    printf("media: %.2f\\n", soma / (double) (argc - 1));
    return 0;
}`,
        solucao_obs: 'A média usa (argc - 1) como divisor — a quantidade de números lidos.',
      },
      {
        nivel: 3,
        enunciado:
          'Refatore o <code>soma.exe</code> (o exemplo de atoi) em três funções: <code>uso()</code> (imprime e sai), <code>somar(int a, int b)</code> e um main que só valida e chama. O programa continua idêntico em comportamento.',
        dica: 'uso() pode imprimir e retornar um código; main usa o retorno no return.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

int uso(void)
{
    printf("uso: soma.exe numero1 numero2\\n");
    return 1;
}

int somar(int a, int b)
{
    return a + b;
}

int main(int argc, char *argv[])
{
    int a, b;

    if (argc != 3) {
        return uso();
    }

    a = atoi(argv[1]);
    b = atoi(argv[2]);

    printf("%d + %d = %d\\n", a, b, somar(a, b));
    return 0;
}`,
      },
      {
        nivel: 3,
        enunciado:
          'Crie <code>converte.exe</code> que recebe um argumento numérico e o converte de Celsius para Fahrenheit, e outro que faz o caminho inverso — decida pela presença de um segundo argumento ("c" ou "f"). Ex.: <code>converte.exe 37 c</code> converte 37°C para °F.',
        dica: 'Um if no argv[2] escolhe a fórmula; a fórmula de F→C é (F−32)×5/9.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    double valor;

    if (argc != 3) {
        printf("uso: converte.exe <valor> <c|f>\\n");
        printf("  c: Celsius -> Fahrenheit\\n");
        printf("  f: Fahrenheit -> Celsius\\n");
        return 1;
    }

    valor = atof(argv[1]);

    if (argv[2][0] == 'c') {
        printf("%.2f C = %.2f F\\n", valor, valor * 9.0 / 5.0 + 32.0);
    } else if (argv[2][0] == 'f') {
        printf("%.2f F = %.2f C\\n", valor, (valor - 32.0) * 5.0 / 9.0);
    } else {
        printf("erro: segundo argumento deve ser c ou f\\n");
        return 1;
    }
    return 0;
}`,
        solucao_obs: '<code>atof</code> converte texto para double (como atoi, mas para ponto flutuante).',
      },
    ],
    quiz: [
      {
        pergunta: 'Rodando <code>.\\prog.exe tilha teste</code>, o valor de argc é:',
        opcoes: ['3', '2', '4', '1'],
        correta: 0,
        explicacao: 'argc conta o próprio nome (argv[0]) mais os 2 argumentos = 3.',
      },
      {
        pergunta: 'Qual é argv[0] quando você chama o programa na linha de comando?',
        opcoes: [
          'o nome do executável',
          'o primeiro argumento digitado',
          'o caminho do compilador',
          'sempre vazio',
        ],
        correta: 0,
        explicacao: 'argv[0] é o nome do programa; os argumentos de verdade começam em argv[1].',
      },
      {
        pergunta: 'O que <code>atoi("42")</code> devolve?',
        opcoes: ['o inteiro 42', 'a string "42"', '42.0 (double)', 'um erro'],
        correta: 0,
        explicacao: 'atoi converte texto para int, via <stdlib.h>.',
      },
      {
        pergunta: 'Melhor prática ao receber argumentos inválidos (ex.: faltando número):',
        opcoes: [
          'imprimir mensagem de uso e retornar 1',
          'ignorar e continuar com lixo',
          'travar o programa com assert',
          'ficar em loop esperando o usuário',
        ],
        correta: 0,
        explicacao: 'A validação na entrada + return 1 é o padrão de utilitários de terminal.',
      },
      {
        pergunta: 'A "média de 1 a N" calculada como <code>soma/(double)N</code> precisa de cast porque:',
        opcoes: [
          'soma é int e a divisão seria inteira (truncaria)',
          'double não pode dividir por int',
          'o cast não pode existir nessa posição',
          'N não foi declarado',
        ],
        correta: 0,
        explicacao: '(double) força a divisão real; sem ele, a média sairia truncada.',
      },
    ],
    projeto: {
      titulo: 'CalcEstudo: seu interpretador de comandos',
      descricao:
        'Construa <code>calc_estudo.exe</code>, um interpretador de comandos numéricos que rode em loop: comandos <code>s</code> (soma de 2 números), <code>m</code> (média de 3), <code>f</code> (fatorial de um número via função recursiva ou iterativa), <code>h</code> (mostra quantas operações foram executadas até agora, usando variável estática), <code>?</code> (menu) e <code>q</code> (sai). Siga o passo a passo da seção "projeto final", compilando e testando a cada comando adicionado. Baseie-se no interpretador de referência da seção e estenda-o com o comando f e o histórico h.',
      criterios: [
        'Roda em loop até o comando q, com o menu ?.',
        'Implementa soma (s), média (m), fatorial (f) e histórico (h) com funções próprias.',
        'Histórico usa variável estática (estado interno sem global).',
        'Valida entradas: fatorial de 0 ou 1 = 1; valores negativos rejeitados.',
        'Compila com <code>gcc -Wall -Wextra -std=c11 calc_estudo.c -o calc_estudo</code> sem erros nem avisos.',
        'Você consegue explicar, para outra pessoa, cada função do seu programa',
      ],
    },
  },
];