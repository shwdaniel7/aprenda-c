// Trilha 3 — Avançado (continuação): módulos 3.09 a 3.12 da formação geral
module.exports = [
{
  trilha: '3',
  numero: '09',
  titulo: 'Tempo e datas (sob o olhar do QS)',
  subtitulo: 'Do epoch ao relógio de parede: como medir, carimbar e formatar tempo em C com padrão C11.',
  objetivo: 'Compreender o modelo de tempo da linguagem C (epoch, time_t, struct tm), usar as funções do cabeçalho <time.h> para obter o instante atual, converter entre UTC e local, formatar e parsear datas, medir intervalo de parede, CPU e nanossegundos — e aplicar tudo isso num registro de log com carimbo de hora, o padrão de um Quality System.',
  prerequisitos: 'Conhecer ponteiros, structs e manipulação de strings (T2.06). Saber tratar erros de forma robusta (T3.01).',
  duracao: '~45 min',
  nivel: 'Avançado',
  leitura: {
    beej: 'Beej cap. de \"Time and date functionality\" (cap. 38)',
    king: 'King cap. 17, 20 (ponteiros avançados e ponteiros para função).',
    foco: 'Foque em time(), localtime(), gmtime(), mktime(), difftime(), clock(), timespec_get(), strftime() e mktime() — e no exemplo de \"formatação de horário\" do Beej.'
  },
  secoes: [
    {
      titulo: 'O tempo na máquina: epoch, time_t e struct tm',
      rotulo: 't3m0901',
      paragrafos: [
        'O computador não \"sente\" o tempo como nós. Ele guarda um inteiro gigante: o número de segundos decorridos desde a <strong>epoch</strong> — a meia-noite UTC de 1º de janeiro de 1970. Em C, esse valor inteiro é o tipo <code>time_t</code>, retornado por <code>time()</code>.',
        'A outra metade da história é o <code>struct tm</code>: uma estrutura com campos legíveis (<code>tm_year</code>, <code>tm_mon</code>, <code>tm_mday</code>, <code>tm_hour</code>…), preenchida por <code>localtime()</code> (no fuso da máquina) ou <code>gmtime()</code> (em UTC). Cuidado com dois detalhes que derrubam iniciantes: <code>tm_year</code> conta anos desde 1900 e <code>tm_mon</code> começa em 0 (janeiro).',
        'No exemplo, exibimos o epoch e os dois \"rostos\" legíveis do mesmo instante: o local e o UTC. Note como <code>tm_year + 1900</code> e <code>tm_mon + 1</code> precisam ser ajustados na hora de imprimir.'
      ],
      lista: [
        '<code>time_t</code> — inteiro (normalmente) que representa segundos desde a epoch; as funções de data devolvem/consomem esse tipo.',
        '<code>time(&amp;t)</code> — grava o instante atual em <code>t</code>; pode retornar o valor diretamente também.',
        '<code>struct tm</code> — campos <code>tm_year</code> (anos desde 1900), <code>tm_mon</code> (0–11), <code>tm_mday</code> (1–31), <code>tm_hour</code>, <code>tm_min</code>, <code>tm_sec</code>, <code>tm_wday</code>, <code>tm_yday</code>, <code>tm_isdst</code>.',
        '<code>localtime()</code>/<code>gmtime()</code> — convertem <code>time_t</code> para <code>struct tm</code> no fuso local ou em UTC.',
        '<code>asctime()</code> — devolve uma string fixa (e feia) com a data/hora; <code>ctime()</code> faz o mesmo direto do <code>time_t</code>.'
      ],
      codigo: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    time_t agora = time(NULL);\n\n    printf(\"epoch: %lld\\n\", (long long)agora);\n    printf(\"em horas: %lld\\n\", (long long)(agora / 3600));\n    printf(\"em dias: %lld\\n\", (long long)(agora / 86400));\n\n    struct tm *local = localtime(&agora);\n    struct tm *utc = gmtime(&agora);\n\n    printf(\"local: %04d-%02d-%02d %02d:%02d:%02d\\n\",\n           local->tm_year + 1900, local->tm_mon + 1, local->tm_mday,\n           local->tm_hour, local->tm_min, local->tm_sec);\n    printf(\"utc  : %04d-%02d-%02d %02d:%02d:%02d\\n\",\n           utc->tm_year + 1900, utc->tm_mon + 1, utc->tm_mday,\n           utc->tm_hour, utc->tm_min, utc->tm_sec);\n    printf(\"dia do ano: %d (0 = 1 de janeiro)\\n\", local->tm_yday);\n\n    return 0;\n}',
      saida: '> .\hora-atual.exe\n> epoch: 1789503467\n> em horas: 497084\n> em dias: 20711\n> local: 2026-09-15 17:17:47\n> utc  : 2026-09-15 20:17:47\n> dia do ano: 258 (0 = 1 de janeiro)\n> \n> (Os valores de epoch e de hora variam conforme o momento em que você roda; o formato, não.)'
    },
    {
      titulo: 'Medindo intervalos: relógio de parede com difftime()',
      rotulo: 't3m0902',
      paragrafos: [
        'Medir quanto tempo um trecho demorou parece trivial: pegue o instante antes, o instante depois e subtraia. O C11 padronizou isso com <code>difftime()</code>, que devolve a diferença em segundos (como <code>double</code>) entre dois instantes <code>time_t</code>.',
        'O relógio do <code>time()</code> tem resolução de segundo, então para algo mais fino você precisará de outro recurso (veremos <code>clock()</code> e <code>timespec_get()</code> logo adiante). Para trechos longos, porém, a leitura em segundos inteiros é suficiente e é o que usamos aqui.',
        'No exemplo, medimos quanto tempo o loop de soma demora. Para evitar que o otimizador \"aposte\" que o resultado não é usado e elimine o loop, imprimimos a soma ao final. Esse é um truque clássico de toda medição em C.'
      ],
      lista: [
        '<code>double difftime(time_t fim, time_t inicio)</code> — devolve <code>fim - inicio</code> em segundos.',
        'Cuidado com a ordem: primeiro capturamos o início, depois o fim.',
        'Nunca declare o resultado de medição como <code>int</code>; use <code>double</code> (ou <code>long long</code> quando for epoch).',
        'Se o tempo marcado for 0, verifique a resolução do relógio, não a \"velocidade\" do trecho.'
      ],
      codigo: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    time_t inicio = time(NULL);\n\n    long long soma = 0;\n    for (long long i = 0; i < 200000000LL; i++) {\n        soma += i;\n    }\n\n    time_t fim = time(NULL);\n    double decorrido = difftime(fim, inicio);\n\n    printf(\"soma: %lld\\n\", soma);\n    printf(\"decorrido: %.0f s (parede)\\n\", decorrido);\n\n    return 0;\n}',
      saida: '> .\medindo-difftime.exe\n> soma: 19999999900000000\n> decorrido: 2 s (parede)\n> \n> (Os segundos exatos variam conforme a máquina e a carga; na execução de referência, 2 s.)'
    },
    {
      titulo: 'clock() como cronômetro',
      rotulo: 't3m0903',
      paragrafos: [
        'Há uma diferença sutil mas importante entre relógio de parede e tempo de processador. O primeiro conta tudo (inclusive enquanto o processo dorme esperando I/O); o segundo conta só o tempo em que a CPU esteve executando o seu código.',
        'A função <code>clock()</code> devolve <code>clock_t</code>, um valor em <strong>unidades de clock</strong> (ticks). Para converter em segundos, divide-se por <code>CLOCKS_PER_SEC</code>. O número de ticks por segundo não precisa ser 1.000.000 — é o sistema que define —, mas a divisão sempre produz segundos.',
        'Note que <code>clock()</code> é o recurso certo para comparar a performance de duas implementações do mesmo algoritmo no mesmo processo. O relógio de parede incluiria qualquer balanço do sistema operacional.'
      ],
      lista: [
        '<code>clock_t clock(void)</code> — tempo de CPU consumido pelo processo, em ticks.',
        '<code>CLOCKS_PER_SEC</code> — quantos ticks há em um segundo; divida para obter segundos.',
        'Sempre converta com cast para <code>double</code> antes de dividir (evite truncamento).',
        'Não use <code>clock()</code> para carimbar data/hora: ele não tem relação com a epoch.'
      ],
      codigo: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    clock_t inicio = clock();\n\n    long long soma = 0;\n    for (long long i = 0; i < 300000000LL; i++) {\n        soma += i;\n    }\n\n    clock_t fim = clock();\n    double segundos = (double)(fim - inicio) / CLOCKS_PER_SEC;\n\n    printf(\"soma: %lld\\n\", soma);\n    printf(\"cpu: %.3f s\\n\", segundos);\n\n    return 0;\n}',
      saida: '> .\cronometro-clock.exe\n> soma: 44999999985000000\n> cpu: 0.132 s\n> \n> (O tempo de CPU varia conforme a máquina; na execução de referência, 0.132 s.)'
    },
    {
      titulo: 'Convertendo e construindo datas: mktime()',
      rotulo: 't3m0904',
      paragrafos: [
        'Até aqui só \"descemos\" do epoch para o calendário. O caminho inverso é o <code>mktime()</code>: recebe um <code>struct tm</code> (no fuso local) e devolve o <code>time_t</code> correspondente. É ele que permite transformar uma data digitada em epoch.',
        'Uma surpresa útil: o <code>mktime()</code> <strong>normaliza</strong> os campos. Se você montar 40 de março, ele entende que isso é 9 de abril e ajusta <code>tm_mday</code>/<code>tm_mon</code> na própria estrutura — corrigindo automaticamente \"estouros\" de calendário.',
        'No exemplo, além de mostrar o epoch de uma data fixa (15/06/2000), demonstramos a normalização: montamos 40/03/2000 e deixamos o mktime resolver. Em sistemas com resolução de 1 s, o horário é assumido meia-noite local.'
      ],
      lista: [
        '<code>mktime(struct tm *)</code> — devolve <code>time_t</code>; se a data for inválida, devolve <code>(time_t)-1</code>.',
        'Normalização: valores fora de faixa (mês 13, dia 40) são convertidos automaticamente.',
        '<code>tm_isdst</code> — se -1, o horário de verão é descoberto automaticamente.',
        'O epoch é sempre interpretado como <strong>hora local</strong> pela mktime; para UTC você precisaria ajustar o fuso manualmente.'
      ],
      codigo: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    time_t agora = time(NULL);\n    printf(\"epoch agora: %lld\\n\", (long long)agora);\n\n    struct tm *local = localtime(&agora);\n    printf(\"agora local: %04d-%02d-%02d %02d:%02d:%02d\\n\",\n           local->tm_year + 1900, local->tm_mon + 1, local->tm_mday,\n           local->tm_hour, local->tm_min, local->tm_sec);\n\n    struct tm nasc = {0};\n    nasc.tm_year = 2000 - 1900;\n    nasc.tm_mon = 5;\n    nasc.tm_mday = 15;\n    time_t t = mktime(&nasc);\n    printf(\"15/06/2000 -> epoch %lld\\n\", (long long)t);\n\n    struct tm mud = {0};\n    mud.tm_year = 2000 - 1900;\n    mud.tm_mon = 2;\n    mud.tm_mday = 40;\n    time_t t2 = mktime(&mud);\n    printf(\"40 de marco -> vira %02d/%02d/%04d, epoch %lld\\n\",\n           mud.tm_mday, mud.tm_mon + 1, mud.tm_year + 1900, (long long)t2);\n\n    return 0;\n}',
      saida: '> .\calendario-mktime.exe\n> epoch agora: 1789503469\n> agora local: 2026-09-15 17:17:49\n> 15/06/2000 -> epoch 961038000\n> 40 de marco -> vira 09/04/2000, epoch 955249200\n> \n> (O epoch de \"agora\" varia; os dois epochs de data fixa são determinísticos no fuso local.)'
    },
    {
      titulo: 'Formatando datas: strftime()',
      rotulo: 't3m0905',
      paragrafos: [
        'Imprimir datas na mão, campo a campo, funciona — mas é frágil e verboso. O padrão C oferece <code>strftime()</code>: você passa um buffer, seu tamanho, uma máscara com especificadores e um <code>struct tm</code>; a função preenche o buffer, devolvendo quantos caracteres escreveu.',
        'Os especificadores lembram <code>printf</code>, mas com <code>%</code> próprios: <code>%Y</code> ano com 4 dígitos, <code>%m</code> mês 2 dígitos, <code>%d</code> dia, <code>%H:%M:%S</code> hora, <code>%j</code> dia do ano, <code>%A</code> nome do dia da semana. Basta concatená-los para montar o formato que o seu sistema (o Quality System do seu time, por exemplo) exigir.',
        'Sempre confira o retorno: se for igual ao tamanho do buffer, o espaço era insuficiente e a string foi truncada (ou nada escrito) — um erro clássico em relatórios de produção.'
      ],
      lista: [
        '`strftime(buf, tam, formato, tm)` — escreve em <code>buf</code>, devolve o nº de caracteres ou 0.',
        'Especificadores comuns: <code>%Y</code>, <code>%m</code>, <code>%d</code>, <code>%H</code>, <code>%M</code>, <code>%S</code>, <code>%j</code>, <code>%A</code>, <code>%a</code>, <code>%B</code>.',
        '<code>%Y-%m-%d %H:%M:%S</code> é o formato ISO-8601, recomendado para logs.',
        'Os caracteres que não começam com <code>%</code> (hífens, dois-pontos, espaços) são copiados literalmente.'
      ],
      codigo: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    time_t agora = time(NULL);\n    struct tm *local = localtime(&agora);\n\n    char buf[128];\n\n    strftime(buf, sizeof buf, \"%d/%m/%Y\", local);\n    printf(\"data curta: %s\\n\", buf);\n\n    strftime(buf, sizeof buf, \"%Y-%m-%d\", local);\n    printf(\"iso: %s\\n\", buf);\n\n    strftime(buf, sizeof buf, \"%A, dia %d de %B de %Y\", local);\n    printf(\"por extenso: %s\\n\", buf);\n\n    strftime(buf, sizeof buf, \"[%Y-%m-%d %H:%M:%S]\", local);\n    printf(\"formato de log: %s\\n\", buf);\n\n    char hora[16];\n    strftime(hora, sizeof hora, \"%H:%M:%S\", local);\n    printf(\"hora: %s\\n\", hora);\n\n    return 0;\n}',
      saida: '> .\strftime-datas.exe\n> data curta: 15/09/2026\n> iso: 2026-09-15\n> por extenso: Tuesday, dia 15 de September de 2026\n> formato de log: [2026-09-15 17:17:49]\n> hora: 17:17:49\n> \n> (Dia da semana e horário variam com o momento da execução; o formato, não.)'
    },
    {
      titulo: 'Nanossegundos e o relógio monotônico: timespec_get()',
      rotulo: 't3m0906',
      paragrafos: [
        'Precisão de 1 segundo não basta para medir funções rápidas — e o C11 trouxe a resposta: <code>timespec_get()</code>, que preenche um <code>struct timespec</code> com <strong>segundos</strong> (campo <code>tv_sec</code>) e <strong>nanossegundos</strong> (campo <code>tv_nsec</code>). No Windows/glibc atuais ela é implementada sobre relógio de alta resolução.',
        'A constante a passar é <code>TIME_UTC</code>: o relógio tem base na epoch (UTC). Combinando os dois campos, você consegue timestamps como <code>1789503469.243354400</code> — carimbo completo, ideal para eventos de alta frequência.',
        'Para medir trechos curtos, capture o <code>timespec</code> antes e depois e subtraia campo a campo, tomando cuidado com o \"empréstimo\" dos nanossegundos (se <code>tv_nsec_fim &lt; tv_nsec_inicio</code>, subtraia 1 do segundo e some 1e9 aos nanossegundos).'
      ],
      lista: [
        '<code>struct timespec { time_t tv_sec; long tv_nsec; }</code>.',
        '<code>timespec_get(&amp;ts, TIME_UTC)</code> — preenche com o instante atual; devolve <code>TIME_UTC</code> em sucesso.',
        'Cuidado com a formatação: use <code>%09ld</code> para zerar os nanossegundos à esquerda.',
        'Subtração de dois timespec: a lógica do \"empréstimo\" dos nanossegundos evita durações negativas.'
      ],
      codigo: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    struct timespec ts;\n\n    if (timespec_get(&ts, TIME_UTC) != TIME_UTC) {\n        printf(\"falha ao obter o tempo\\n\");\n        return 1;\n    }\n\n    printf(\"segundos: %lld\\n\", (long long)ts.tv_sec);\n    printf(\"nanossegundos: %ld\\n\", ts.tv_nsec);\n    printf(\"combinado: %lld.%09ld\\n\", (long long)ts.tv_sec, ts.tv_nsec);\n\n    return 0;\n}',
      saida: '> .\timespec-get.exe\n> segundos: 1789503469\n> nanossegundos: 243354400\n> combinado: 1789503469.243354400\n> \n> (Os valores exatos variam a cada execução; o formato é sempre <code>segundos.nanossegundos</code>.)'
    }
  ],
  exercicios: [
    {
      nivel: 'Intermediário',
      enunciado: 'Escreva um programa que formate a data e hora atuais em três formatos diferentes, com strftime: dia/mês/ano (sem barras, ex. 15/09/2026), ISO (2026-09-15) e o mês por extenso (September). Imprima os três, cada um em sua linha, precedidos de rotulo.'
      ,
      dica: 'Use o mesmo struct tm para as três chamadas de strftime, reutilizando o mesmo buffer ou buffers separados.'
      ,
      solucao: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    time_t agora = time(NULL);\n    struct tm *local = localtime(&agora);\n\n    char a[16], b[16], c[64];\n    strftime(a, sizeof a, \"%d/%m/%Y\", local);\n    strftime(b, sizeof b, \"%Y-%m-%d\", local);\n    strftime(c, sizeof c, \"%B de %Y\", local);\n\n    printf(\"formato1: %s\\n\", a);\n    printf(\"formato2: %s\\n\", b);\n    printf(\"formato3: %s\\n\", c);\n\n    return 0;\n}',
      solucao_obs: './ex09_1'
    },
    {
      nivel: 'Intermediário',
      enunciado: 'Reescreva o programa de soma longa (seção 3) mas meça com time() (parede) e com clock() (CPU) ao mesmo tempo. Imprima soma, tempo de parede em s e tempo de CPU em s. Use um loop de 300000000 iteracoes.'
      ,
      dica: 'Capture o início dos dois relogios antes do loop e o fim depois; a soma precisa ser impressa para o loop nao ser otimizado.'
      ,
      solucao: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    time_t t0 = time(NULL);\n    clock_t c0 = clock();\n\n    long long soma = 0;\n    for (long long i = 0; i < 300000000LL; i++) {\n        soma += i;\n    }\n\n    time_t t1 = time(NULL);\n    clock_t c1 = clock();\n\n    printf(\"soma: %lld\\n\", soma);\n    printf(\"parede: %.0f s\\n\", difftime(t1, t0));\n    printf(\"cpu: %.3f s\\n\", (double)(c1 - c0) / CLOCKS_PER_SEC);\n\n    return 0;\n}',
      solucao_obs: './ex09_2 — o tempo de parede proximo de 0 s e normal quando o relogio de time() tem resolucao de 1 s e a execucao leva menos de meio segundo.'
    },
    {
      nivel: 'Intermediário',
      enunciado: 'Calcule a idade aproximada de uma pessoa: dado o nascimento (1990-07-20), imprima a idade em anos (a partir da data atual) e a idade em dias (usando mktime para fixar o nascimento e difftime na data atual).'
      ,
      dica: 'Monte o nascimento num struct tm e use mktime; para os dias, divida a diferenca em segundos por 86400.'
      ,
      solucao: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    struct tm nat = {0};\n    nat.tm_year = 1990 - 1900;\n    nat.tm_mon = 6;\n    nat.tm_mday = 20;\n\n    time_t nasc = mktime(&nat);\n    time_t agora = time(NULL);\n\n    struct tm *atual = localtime(&agora);\n    int anos = atual->tm_year - nat.tm_year;\n    if (atual->tm_mon < nat.tm_mon ||\n        (atual->tm_mon == nat.tm_mon && atual->tm_mday < nat.tm_mday)) {\n        anos--;\n    }\n\n    long long dias = (long long)difftime(agora, nasc) / 86400LL;\n\n    printf(\"nascimento: %04d-%02d-%02d\\n\",\n           nat.tm_year + 1900, nat.tm_mon + 1, nat.tm_mday);\n    printf(\"idade por ano: %d anos\\n\", anos);\n    printf(\"idade por dias: %lld dias\\n\", dias);\n\n    return 0;\n}',
      solucao_obs: './ex09_3 — os dias dependem da data em que o programa roda.'
    },
    {
      nivel: 'Avançado',
      enunciado: 'Complete o mini-log: um programa que abre \"log.txt\" em modo append, escreve uma linha no formato \"[AAAA-MM-DDTHH:MM:SSzz] evento\" (o T separando e o fuso com sinal), e imprime a mesma linha na tela. Execute duas vezes e confirme que o arquivo ganhou duas linhas.'
      ,
      dica: 'Use strftime com uma mascara que termine em \"%z\" (fuso, ex. -0300). Abra com fopen(\"log.txt\", \"a\").'
      ,
      solucao: '#include <stdio.h>\n#include <time.h>\n\nint main(void) {\n    time_t agora = time(NULL);\n    struct tm *local = localtime(&agora);\n\n    char linha[128];\n    strftime(linha, sizeof linha, \"%Y-%m-%dT%H:%M:%S%z\", local);\n\n    FILE *f = fopen(\"log.txt\", \"a\");\n    if (!f) {\n        printf(\"nao foi possivel abrir log.txt\\n\");\n        return 1;\n    }\n    fprintf(f, \">>> %s no evento: inicializacao concluida\\n\", linha);\n    fclose(f);\n\n    printf(\">>> %s no evento: inicializacao concluida\\n\", linha);\n    return 0;\n}',
      solucao_obs: './ex09_4 — na execucao de referencia, o fuso apareceu como -0300. O formato %z depende do compilador/sistema.'
    },
    {
      nivel: 'Avançado',
      enunciado: 'Compare fib(40) recursivo e iterativo: meça o tempo de CPU de cada implementacao com clock() e imprima os dois resultados e os dois tempos. O iterativo deve ser drasticamente mais rapido.'
      ,
      dica: 'A versao recursiva ingênua chama a si mesma duas vezes por chamada; a iterativa mantem os dois ultimos valores com um loop.'
      ,
      solucao: '#include <stdio.h>\n#include <time.h>\n\nlong long fib_rec(int n) {\n    if (n < 2) return (long long)n;\n    return fib_rec(n - 1) + fib_rec(n - 2);\n}\n\nlong long fib_ite(int n) {\n    long long a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        long long t = a;\n        a = b;\n        b = t + b;\n    }\n    return a;\n}\n\nint main(void) {\n    clock_t c0 = clock();\n    long long r1 = fib_rec(40);\n    clock_t c1 = clock();\n    long long r2 = fib_ite(40);\n    clock_t c2 = clock();\n\n    printf(\"fib(40) recursivo = %lld em %.3f s\\n\",\n           r1, (double)(c1 - c0) / CLOCKS_PER_SEC);\n    printf(\"fib(40) iterativo = %lld em %.3f s\\n\",\n           r2, (double)(c2 - c1) / CLOCKS_PER_SEC);\n\n    return 0;\n}',
      solucao_obs: './ex09_5 — execucao de referencia: recursivo 0.418 s, iterativo 0.000 s (o valor exato varia).'
    }
  ],
  quiz: [
    {
      pergunta: 'O que representa o tipo time_t em C?',
      opcoes: ['O dia do ano (1 a 366)','A quantidade de segundos desde a epoch (geralmente 01/01/1970 UTC)','Um struct com campos de data legíveis','O fuso horário da máquina'],
      correta: 1,
      explicacao: 'time_t é tipicamente um inteiro contando segundos desde a epoch. Para campos legíveis usa-se struct tm.'
    },
    {
      pergunta: 'Na struct tm, o mês de março (terceiro do ano) é representado por qual valor de tm_mon?',
      opcoes: ['0','1','2','3'],
      correta: 2,
      explicacao: 'tm_mon começa em 0 (janeiro). Março, o terceiro mês, é tm_mon == 2.'
    },
    {
      pergunta: 'Qual função converte um struct tm em time_t, considerando a hora local?',
      opcoes: ['localtime()','gmtime()','mktime()','ctime()'],
      correta: 2,
      explicacao: 'O caminho inverso de localtime é mktime: recebe struct tm, devolve time_t em hora local.'
    },
    {
      pergunta: 'Para escrever 2026-09-15 em um buffer usando strftime, qual máscara usar?',
      opcoes: ['%d-%m-%Y','%Y-%m-%d','%y-%m-%d','%D-%M-%Y'],
      correta: 1,
      explicacao: '%Y ano com 4 dígitos, %m mês 2 dígitos, %d dia 2 dígitos — nessa ordem gera 2026-09-15.'
    },
    {
      pergunta: 'O que timespec_get() preenche em um struct timespec?',
      opcoes: ['Apenas segundos inteiros','Segundos e nanossegundos','O nome do dia da semana','Apenas o fuso horário'],
      correta: 1,
      explicacao: 'struct timespec tem tv_sec (segundos, base epoch) e tv_nsec (nanossegundos).'
    }
  ],
  projeto: {
    titulo: 'Registrador de log com carimbo de hora',
    descricao: 'Construa um pequeno registrador de eventos no estilo Quality System: o programa recebe mensagens pela entrada padrão (uma por linha) e as grava, em ordem, num arquivo \"eventos.log\", cada linha no formato ISO-8601 com fuso: \"2026-09-15T17:20:31-0300 INFO sua mensagem aqui\". No final, imprima quantas linhas foram gravadas e o tempo total de CPU gasto (clock()/CLOCKS_PER_SEC). Estrutura sugerida: funcao registrar(nivel, mensagem) que monta o carimbo com strftime, abre o arquivo em modo \"a\" a cada chamada e fecha na sequencia; o programa principal le linhas com fgets ate EOF.',
    criterios: [
      'Carimbo usa strftime com %z e data corrente.',
      'Mensagens chegam pela stdin (fgets), cada uma vira uma linha com rótulo INFO (ou o nível recebido).',
      'Arquivo persistente entre execuções (modo "a").',
      'Total de linhas impresso com printf ao final.',
      'Tempo de CPU impresso em segundos com 3 casas.',
    ]
  }
},
{
  trilha: '3',
  numero: '10',
  titulo: 'Números exatos, bits e layouts compactos',
  subtitulo: 'Inteiros de largura fixa, bit-fields e membros flexíveis: controle preciso da memória para protocolos e formatos binários.',
  objetivo: 'Dominar os tipos inteiros de largura exata de <stdint.h> e <inttypes.h>, usar bit-fields para empacotar flags e cabeçalhos compactos, empregar union e compound literals em código expressivo, aplicar complemento de 2 com segurança e montar estruturas de tamanho previsível — o pão-de-açúcar de protocolos de rede e de arquivos binários.',
  prerequisitos: 'Conhecer structs e unions (T2.06, T2.07). Entender representação binária e hexa (T3.02).',
  duracao: '~45 min',
  nivel: 'Avançado',
  leitura: {
    beej: 'Beej: \"Fixed Width Integer Types\" (soon-to-be cap. 37), \"Bit-Fields\" (cap. 20.8), \"Compound Literals\" (cap. 32), \"The Outside Environment\" (cap. 18).',
    king: 'King cap. 20 (structs e unions), cap. 21 (inteiros de largura exata).',
    foco: 'Sublinhe a tabela de tipos (uint8_t, uint16_t, uint32_t, uint64_t), os modificadores de bit-field (:3, :1) e os compound literals (T){...}.'
  },
  secoes: [
    {
      titulo: 'Inteiros de largura exata: <stdint.h> e <inttypes.h>',
      rotulo: 't3m1001',
      paragrafos: [
        'O C tradicional manda <code>int</code> ter \"pelo menos 16 bits\" — e cada plataforma interpreta como quer. Inútil para dados binários que precisam ter o mesmo formato em qualquer máquina (arquivos, protocolos). A solução é <code>&lt;stdint.h&gt;</code>, que define, quando a plataforma oferece, tipos de largura <strong>exata</strong>: <code>uint8_t</code>, <code>uint16_t</code>, <code>uint32_t</code>, <code>uint64_t</code> e suas versões com sinal.',
        'Por que <code>uint8_t</code> em vez de <code>unsigned char</code> para um byte? Porque o nome documenta a intenção e o tamanho fica garantido. E por que não usar <code>long long</code> direto? Porque até ele tem largura oficialmente só \"pelo menos 64 bits\" — na prática é 64, mas a especificação do tipo exato remove a ambiguidade.',
        'No exemplo, veja também o hexa com <code>%x</code> e <code>%llx</code>, e o complemento de 2: o <code>(uint32_t)a</code> com <code>a = -123456</code> vira 0xFFFE1DC0 — os 32 bits do número negativo reinterpretados sem sinal.'
      ],
      lista: [
        '<code>&lt;stdint.h&gt;</code> — define <code>uint8_t</code>, <code>uint16_t</code>, <code>uint32_t</code>, <code>uint64_t</code> e os com sinal, sempre que a plataforma os tiver.',
        '<code>&lt;inttypes.h&gt;</code> — macros de formato: <code>PRIu32</code>, <code>PRIu64</code>, <code>PRIx64</code>, <code>SCNd32</code>...',
        'Complemento de 2: um <code>int</code> negativo, reinterpretado como <code>uint32_t</code>, vira o padrão de bits correto (ex.: -123456 = 0xFFFE1DC0).',
        '<code>sizeof(uint32_t) == 4</code>, <code>sizeof(uint64_t) == 8</code> — sempre.</li>'
      ],
      codigo: '#include <stdio.h>\n#include <stdint.h>\n#include <inttypes.h>\n\nint main(void) {\n    int a = -123456;\n    uint32_t b = 0xCAFEBABE;\n    uint64_t c = 123456789012345ULL;\n    uint64_t d = UINT64_MAX;\n\n    printf(\"a       = %d (padrao de bits %08x)\\n\", a, (unsigned int)(uint32_t)a);\n    printf(\"b       = %\" PRIu32 \" (hexa 0x%08\" PRIx32 \")\\n\", b, b);\n    printf(\"c       = %\" PRIu64 \"\\n\", c);\n    printf(\"d (max) = %\" PRIu64 \" (hexa 0x%\" PRIx64 \")\\n\", d, d);\n    printf(\"sizeof: uint32_t = %zu, uint64_t = %zu\\n\",\n           sizeof(uint32_t), sizeof(uint64_t));\n\n    return 0;\n}',
      saida: '> .\tipos-fixos.exe\n> a       = -123456 (padrao de bits 0xfffe1dc0)\n> b       = 3405691582 (hexa 0xcafebabe)\n> c       = 123456789012345\n> d (max) = 18446744073709551615 (hexa 0xffffffffffffffff)\n> sizeof: uint32_t = 4, uint64_t = 8\n> \n> (Os hexadecimais foram impressos em minusculas; com %X ficam em maiusculas.)'
    },
    {
      titulo: 'Asserções e limites exatos',
      rotulo: 't3m1002',
      paragrafos: [
        'Quando o programa precisa de garantias de tamanho (um protocolo exige 4 bytes para um campo), o profissional não confia em suposições: ele <strong>verifica em tempo de compilação</strong> com <code>_Static_assert</code> (C11) ou em tempo de execução com <code>assert</code>. As duas têm o mesmo espírito: a falha é detectada o mais cedo possível.',
        '<code>_Static_assert</code> recebe uma expressão constante e uma mensagem; se a condição for falsa, o compilador se recusa a gerar o binário. É ideal para tamanhos de struct que vão para disco ou rede.',
        'No exemplo, garantimos que o código só compila se <code>CHAR_BIT == 8</code> e <code>sizeof(uint32_t) == 4</code>, e com <code>assert</code> conferimos limites de <code>&lt;limits.h&gt;</code> e <code>&lt;stdint.h&gt;</code>.'
      ],
      lista: [
        '<code>_Static_assert(cond, \"mensagem\")</code> — falha no compilador se a condição (constante) for falsa.',
        '<code>assert(expr)</code> — aborta em execução (com mensagem) se a expressão for falsa; some com <code>NDEBUG</code>.',
        '<code>CHAR_BIT</code>, <code>UINT_MAX</code> (em <code>&lt;limits.h&gt;</code>) e <code>UINT16_MAX</code>, <code>UINT32_MAX</code> (em <code>&lt;stdint.h&gt;</code>).',
        'Quando uma struct precisa de layout exato (ex.: 4 bytes), use _Static_assert(sizeof(struct X) == 4).'
      ],
      codigo: '#include <stdio.h>\n#include <stdint.h>\n#include <limits.h>\n#include <assert.h>\n\n_Static_assert(CHAR_BIT == 8, \"este programa exige bytes de 8 bits\");\n_Static_assert(sizeof(uint32_t) == 4, \"uint32_t precisa ter 4 bytes\");\n\nint main(void) {\n    assert(UINT16_MAX >= 65535);\n    assert(UINT32_MAX >= 4294967295U);\n    assert(sizeof(int) >= 4);\n\n    printf(\"todas as assercoes passaram\\n\");\n    printf(\"CHAR_BIT=%d sizeof(int)=%zu sizeof(uint16_t)=%zu\\n\",\n           CHAR_BIT, sizeof(int), sizeof(uint16_t));\n\n    return 0;\n}',
      saida: '> .\static-assert.exe\n> todas as assercoes passaram\n> CHAR_BIT=8 sizeof(int)=4 sizeof(uint16_t)=2'
    },
    {
      titulo: 'Bit-fields: flags e campos de N bits',
      rotulo: 't3m1003',
      paragrafos: [
        'Nem todo dado precisa de 32 (ou 8) bits. Uma flag ligado/desligado precisa de 1. Um dia da semana, de 3. Para empacotar vários campos pequenos na mesma memória, o C oferece os <strong>bit-fields</strong>: membros de struct declarados como <code>unsigned tipo : N;</code>.',
        'O compilador empacota os campos em unidades de armazenamento (aqui, 4 bytes — o <code>unsigned</code> base). O tamanho total do struct no exemplo é 8 bytes porque o alinhamento atua junto; para protocolos com layout rígido, verifique com <code>_Static_assert</code> e, se preciso, reordene os campos ou use <code>_Alignas</code>.',
        'Para gravar num arquivo binário, imprimimos o struct byte a byte como <code>unsigned char</code> — é assim que se serializa de forma portável: o padding entre campos é definido pelo compilador, então empacote seus bit-fields dentro de um uint32_t/uint64_t para formatos fixos.'
      ],
      lista: [
        'Bit-field: <code>unsigned vermelho : 1;</code> — reserva exatamente N bits.',
        'O tipo base (<code>unsigned</code>, <code>int</code> de implementação, ou os exatos) determina a unidade de armazenamento.',
        'Campos de 1 bit são perfeitos para flags: leitura = 1, escrita = 1, etc.',
        'Previsibilidade de layout: o padding é definido pela implementação; para formato de arquivo, serialize bit a bit ou use _Static_assert.'
      ],
      codigo: '#include <stdio.h>\n#include <stdint.h>\n\nstruct Flags {\n    unsigned leitura   : 1;\n    unsigned escrita   : 1;\n    unsigned execucao  : 1;\n    unsigned reservado : 5;\n    unsigned extensao  : 5;\n    unsigned fds       : 1;\n    unsigned seg       : 1;\n    unsigned exts      : 5;\n    unsigned exto      : 5;\n\n};\n\nint main(void) {\n    struct Flags f = {0};\n    f.leitura = 1;\n    f.escrita = 0;\n    f.execucao = 1;\n    f.seg = 0;\n\n    printf(\"leitura=%u escrita=%u execucao=%u seg=%u exts=%u exto=%u\\n\",\n           f.leitura, f.escrita, f.execucao, f.seg, f.exts, f.exto);\n    printf(\"sizeof(struct Flags) = %zu bytes\\n\", sizeof f);\n\n    unsigned char *b = (unsigned char *)&f;\n    printf(\"bytes: \");\n    for (size_t i = 0; i < sizeof f; i++) {\n        printf(\"%02x \", b[i]);\n    }\n    printf(\"\\n\");\n\n    return 0;\n}',
      saida: '> .\bit-fields.exe\n> leitura=1 escrita=0 execucao=1 seg=0 exts=0 exto=0\n> sizeof(struct Flags) = 4 bytes\n> bytes: 05 00 00 00\n> \n> (O byte exibido 0x05 = leitura (bit0) + execucao (bit2) juntos. Conforme o modelo de armazenamento do compilador, o struct pode ocupar 4 ou 8 bytes; sempre confirme com _Static_assert.)'
    },
    {
      titulo: 'Union: um tipo, vários significados',
      rotulo: 't3m1004',
      paragrafos: [
        'Uma <code>union</code> faz todos os seus membros ocuparem o <em>mesmo</em> endereço. O tamanho da union é o do maior membro (mais o alinhamento). É a ferramenta certa para dizer \"este espaço tem dois significados possíveis\", como um valor que ora é inteiro, ora é a união de dois inteiros menores.',
        'No exemplo, temos um dado de 8 bytes que pode ser lido como um <code>uint64_t</code> ou como um par de <code>float</code>s. Escrevemos pela visão de bytes e lemos pelas duas outras visões — e o mesmo bloco de memória responde às duas leituras.',
        'O perigo clássico é ler por um membro que você não escreveu. Aí o comportamento é definido pela implementação (daí a recomendação de gravar e ler sempre pelo mesmo campo, ou guardar num campo \"tag\" qual visão está ativa — ver projeto do módulo).'
      ],
      lista: [
        '<code>union { A; B; }</code> — membros compartilham o mesmo endereço.',
        '<code>sizeof(union)</code> = tamanho do maior membro (alinhado).',
        'Útil também para reinterpretar bytes: escreva com uint8_t, leia como uint16_t/uint32_t, respeitando o endianness.',
        'A union não \"memoriza\" qual membro foi usado: mantenha a disciplina de controle no seu código.'
      ],
      codigo: '#include <stdio.h>\n#include <stdint.h>\n#include <inttypes.h>\n\nunion Valor {\n    uint64_t bits;\n    float reais[2];\n};\n\nint main(void) {\n    union Valor v;\n\n    v.bits = 0;\n    v.reais[0] = 10.5f;\n    v.reais[1] = 20.0f;\n\n    v.bits = 0xFFFFFFFFC0800000ULL;\n    v.reais[1] = -3.25f;\n\n    printf(\"[0]=%.2f [1]=%.2f\\n\", v.reais[0], v.reais[1]);\n    printf(\"sizeof(union Valor) = %zu\\n\", sizeof v);\n    printf(\"bits = 0x%016\" PRIx64 \"\\n\", v.bits);\n\n    struct { union Valor x; } emb;\n    emb.x = v;\n    printf(\"total membros: %zu bytes\\n\", sizeof emb);\n\n    return 0;\n}',
      saida: '> .\cabecalho-pacote.exe\n> [0]=-4.00 [1]=-3.25\n> sizeof(union Valor) = 8\n> bits = 0xc0500000c0800000\n> total membros: 8 bytes\n> \n> (Os dois float compartilham os 8 bytes: [0] é o eco de 0xC0800000 (-4.00) e [1] de 0xC0500000 (-3.25), na ordem em que o código os escreve.)'
    },
    {
      titulo: 'Compound literals e variáveis temporárias',
      rotulo: 't3m1005',
      paragrafos: [
        'Às vezes você precisa passar para uma função um valor composto — um struct, um vetor — sem criar uma variável nomeada antes. Os <strong>compound literals</strong> (C99) fazem exatamente isso: <code>(struct Ponto){ x, y }</code> é um valor temporário de tipo <code>struct Ponto</code>.',
        'Eles valem também para vetores: <code>(int[]){1,2,3}</code>, e até para union: <code>(union X){ .campo = v }</code>. Em Portugol você não tem isso; em C, é uma das formas mais legíveis de montar argumentos compostos.',
        'No exemplo, somamos dois pontos construídos literalmente e aplicamos uma \"transformação\" que também recebe um literal. Resultado: 34 / 15, e o deslocamento empilhado vira o ponto (101, -49) — sem nenhuma variável intermediária nomeada.'
      ],
      lista: [
        '<code>(struct Tipo){ a, b }</code> — literal composto de struct no meio da expressão.',
        'Também funciona com vetores: <code>(int[]){1,2,3}</code> e com union: <code>(union U){ .membro = v }</code>.',
        'O literal composto tem armazenamento automático (vida até o fim do bloco) se usado dentro de função.',
        'Ideal para chamar funções com argumentos compostos sem variáveis temporárias.'
      ],
      codigo: '#include <stdio.h>\n\nstruct Ponto { int x, y; };\n\nstruct Ponto soma(struct Ponto a, struct Ponto b) {\n    struct Ponto r = { a.x + b.x, a.y + b.y };\n    return r;\n}\n\nstruct Ponto translada(struct Ponto p, struct Ponto delta) {\n    struct Ponto r = { p.x + delta.x, p.y + delta.y };\n    return r;\n}\n\nint main(void) {\n    struct Ponto p1 = soma((struct Ponto){ 13, 7 }, (struct Ponto){ 21, 8 });\n    printf(\"p1 = %d / %d\\n\", p1.x, p1.y);\n\n    struct Ponto p2 = translada(p1, (struct Ponto){ -10, 5 });\n    printf(\"p2 = %d / %d\\n\", p2.x, p2.y);\n\n    struct Ponto p3 = translada(\n        translada((struct Ponto){ 100, -50 }, (struct Ponto){ 2, 3 }),\n        (struct Ponto){ -1, -2 });\n    printf(\"p3 = %d / %d\\n\", p3.x, p3.y);\n\n    return 0;\n}',
      saida: '> .\compound-literals.exe\n> p1 = 34 / 15\n> p2 = 24 / 20\n> p3 = 101 / -49'
    },
    {
      titulo: 'Lendo números exatos com SCNd32: erros reais',
      rotulo: 't3m1006',
      paragrafos: [
        'Entrada de dados confiável é um problema à parte: <code>scanf</code> devolve a quantidade de conversões feitas, e é <em>obrigatório</em> conferir. Com tipos exatos, o especificador de leitura vem de <code>&lt;inttypes.h&gt;</code>: <code>SCNd32</code> para <code>int32_t</code>, <code>SCNu16</code> para <code>uint16_t</code>, e assim por diante.',
        'No exemplo, tentamos ler uma porta (número) da entrada padrão. Se vier \"9000\", tudo bem. Se vier texto puro (\"abc\"), o <code>scanf</code> falha na primeira conversão e devolvemos erro — sem crash, sem leitura lixo. Em modo parse de dados, essa checagem de retorno é a diferença entre um parser tolerante e um que aborta.',
        'Repare que em sistemas Windows o <code>%</code> de <code>SCNd32</code> com <code>fgets</code> como buffer é o máximo de robustez: primeiro lemos a linha inteira, depois tentamos o <code>sscanf</code>.'
      ],
      lista: [
        '<code>SCNd32</code>, <code>SCNu16</code> — especificadores de scanf para tipos exatos.',
        '<code>scanf</code>/<code>sscanf</code> devolvem o nº de conversões; confira sempre.',
        'Falha: entrada não numérica -> retorno menor que o esperado -> trate como erro.',
        'Padrão robusto: <code>fgets</code> da linha, depois <code>sscanf</code> da linha lida.'
      ],
      codigo: '#include <stdio.h>\n#include <stdint.h>\n#include <inttypes.h>\n\nint main(void) {\n    char linha[64];\n    int32_t porta;\n\n    if (!fgets(linha, sizeof linha, stdin)) {\n        printf(\"sem entrada\\n\");\n        return 1;\n    }\n\n    if (sscanf(linha, \"%\" SCNd32, &porta) == 1) {\n        printf(\"ok: porta=%\" PRId32 \"\\n\", porta);\n    } else {\n        printf(\"erro durante o parse (codigo 3): valor nao numerico\\n\");\n        return 3;\n    }\n\n    return 0;\n}',
      saida: '> .\setjmp-uso.exe\n> (com entrada \"9000\")\n> ok: porta=9000\n> (com entrada \"abc\")\n> erro durante o parse (codigo 3): valor nao numerico\n> \n> O codigo de saida no segundo caso foi 3 (verifique com echo $LASTEXITCODE).'
    }
  ],
  exercicios: [
    {
      nivel: 'Intermediário',
      enunciado: 'Imprima o valor 0xDEADBEEF em decimal (como uint32_t), em hexa maiúsculo, o mesmo valor reinterpretado como int32_t (em decimal), e o inteiro 42 em uint16_t, em decimal e em hexa com 4 dígitos. Imprima também os sizeof de cada tipo usado.'
      ,
      dica: 'Use <code>%\" PRIu32</code>, <code>%\" PRIx32</code> (com X maiúsculo), <code>%\" PRId32</code> e <code>%\" PRIu16</code>, <code>%\" PRIX16</code>.'
      ,
      solucao: '#include <stdio.h>\n#include <stdint.h>\n#include <inttypes.h>\n\nint main(void) {\n    uint32_t x = 0xDEADBEEFU;\n    int32_t y = (int32_t)x;\n    uint16_t z = 42;\n\n    printf(\"x decimal: %\" PRIu32 \"\\n\", x);\n    printf(\"x hexa: 0x%\" PRIX32 \"\\n\", x);\n    printf(\"y (int32): %\" PRId32 \"\\n\", y);\n    printf(\"z: %\" PRIu16 \"\\n\", z);\n    printf(\"z hexa: 0x%\" PRIX16 \"\\n\", z);\n    printf(\"sizeof: uint32=%zu int32=%zu uint16=%zu\\n\",\n           sizeof(uint32_t), sizeof(int32_t), sizeof(uint16_t));\n\n    return 0;\n}',
      solucao_obs: './ex10_1'
    },
    {
      nivel: 'Intermediário',
      enunciado: 'Crie uma struct Permissao com bit-fields para leitura, escrita e execução (1 bit cada) mais 5 bits de reserva, tudo sobre unsigned. Ative leitura e execução, imprima os três valores e o sizeof. Bytes printados com %%02x.'
      ,
      dica: 'Declare <code>unsigned leitura : 1; unsigned escrita : 1; unsigned execucao : 1; unsigned reservado : 5;</code>. O struct (4 bytes) guarda os bits; os valores aparecem em 0/1.'
      ,
      solucao: '#include <stdio.h>\n\nstruct Permissao {\n    unsigned leitura   : 1;\n    unsigned escrita   : 1;\n    unsigned execucao  : 1;\n    unsigned reservado : 5;\n};\n\nint main(void) {\n    struct Permissao p = {0};\n    p.leitura = 1;\n    p.execucao = 1;\n\n    printf(\"leitura=%u escrita=%u execucao=%u\\n\",\n           p.leitura, p.escrita, p.execucao);\n    printf(\"bits: \");\n    unsigned char *b = (unsigned char *)&p;\n    for (size_t i = 0; i < sizeof p; i++) {\n        printf(\"%02x \", b[i]);\n    }\n    printf(\"\\n\");\n    printf(\"sizeof=%zu\\n\", sizeof p);\n\n    return 0;\n}',
      solucao_obs: './ex10_2 — os 4 bytes exibem os bits empacotados; o byte mais baixo vale 0x05 (leitura + execucao ativados).'
    },
    {
      nivel: 'Avançado',
      enunciado: 'Crie uma struct Lista numerica com um membro flexível (fam), no padrão: cabeçalho (contagem) + vetor de ints no final. Escreva e leia valores, imprima os elementos e a soma, e imprima sizeof da struct (que deve ignorar o vetor flexível).'
      ,
      dica: 'Declare <code>struct Lista { size_t n; int itens[]; };</code> e aloque <code>malloc(sizeof(struct Lista) + n * sizeof(int))</code>.'
      ,
      solucao: '#include <stdio.h>\n#include <stdlib.h>\n\nstruct Lista {\n    size_t n;\n    int itens[];\n};\n\nint main(void) {\n    const size_t n = 5;\n    struct Lista *l = malloc(sizeof(struct Lista) + n * sizeof(int));\n    if (!l) return 1;\n\n    l->n = n;\n    for (size_t i = 0; i < n; i++) {\n        l->itens[i] = (int)(i * i);\n    }\n\n    printf(\"l:\");\n    long long soma = 0;\n    for (size_t i = 0; i < l->n; i++) {\n        printf(\" %d\", l->itens[i]);\n        soma += l->itens[i];\n    }\n    printf(\"\\n\");\n    printf(\"soma: %lld\\n\", soma);\n    printf(\"sizeof(struct Lista) = %zu\\n\", sizeof(struct Lista));\n\n    free(l);\n    return 0;\n}',
      solucao_obs: './ex10_3'
    },
    {
      nivel: 'Avançado',
      enunciado: 'Modele um mini sistema de votação: union Candidato com membros int votos e float taxa; um vetor fixo de 3 candidatos com votos 10, 0, 12. Atribua o total de votos e a taxa média ao campo designado e imprima o total dos gêneros? Não — imprima por candidato o campo ativo (votos) e o total geral.'
      ,
      dica: 'Simplifique: mostre os votos lidos pelo campo votos, soma-os num uint64_t, e imprima o total. A union ilustra que o espaço pode ser lido de outra forma.'
      ,
      solucao: '#include <stdio.h>\n#include <stdint.h>\n#include <inttypes.h>\n\nunion Candidato {\n    int votos;\n    float taxa;\n};\n\nint main(void) {\n    union Candidato c[3];\n    c[0].votos = 10;\n    c[1].votos = 0;\n    c[2].votos = 12;\n\n    printf(\"votos:\");\n    uint64_t total = 0;\n    for (int i = 0; i < 3; i++) {\n        printf(\" %d\", c[i].votos);\n        total += (uint64_t)c[i].votos;\n    }\n    printf(\"\\n\");\n    printf(\"total = %\" PRIu64 \"\\n\", total);\n    printf(\"sizeof(union) = %zu\\n\", sizeof(union Candidato));\n\n    return 0;\n}',
      solucao_obs: './ex10_4'
    },
    {
      nivel: 'Avançado',
      enunciado: 'Escreva um parser de uma porta e de um host da stdin (formato \"host:porta\"), usando uint16_t para a porta e SCNu16. Em caso de entrada inválida, devolva o código de erro 3 e imprima \"erro: valor nao numerico\". No sucesso imprima \"ok:\" com host e porta.'
      ,
      dica: 'Use fgets + sscanf com <code>\"%\" SCNu16</code>; verifique o retorno == 1 (host aceite como string qualquer).'
      ,
      solucao: '#include <stdio.h>\n#include <stdint.h>\n#include <inttypes.h>\n\nint main(void) {\n    char linha[128];\n    char host[64];\n    uint16_t porta;\n\n    if (!fgets(linha, sizeof linha, stdin)) {\n        printf(\"sem entrada\\n\");\n        return 1;\n    }\n\n    if (sscanf(linha, \"%63[^:]\" \":%\" SCNu16, host, &porta) == 2) {\n        printf(\"ok: %s:%\" PRIu16 \"\\n\", host, porta);\n    } else {\n        printf(\"erro: valor nao numerico\\n\");\n        return 3;\n    }\n\n    return 0;\n}',
      solucao_obs: './ex10_5 — entrada \"localhost:80\" -> ok: localhost:80; entrada \"abc\" -> erro + exit 3.'
    }
  ],
  quiz: [
    {
      pergunta: 'Qual é o tamanho garantido de um uint32_t, se a plataforma o oferece?',
      opcoes: ['Pelo menos 16 bits (pode ser 32)','Exatamente 32 bits, sem variação','32 bits ou 64 bits, depende do compilador','Exatamente 4 bytes em todas as plataformas; e 32 bits se CHAR_BIT=8'],
      correta: 3,
      explicacao: 'A largura exata é garantida: 32 bits. Como há 8 bits por byte (CHAR_BIT=8), são 4 bytes.'
    },
    {
      pergunta: 'O que significa a declaração \"unsigned escrita : 1;\"?',
      opcoes: ['Um byte reservado para escrita','Um bit de campo: a flag escrita ocupa só 1 bit','Um count com valor 1','Reserva um inteiro com limite 1'],
      correta: 1,
      explicacao: 'É um bit-field de 1 bit: a flag ocupa exatamente um bit no armazenamento.'
    },
    {
      pergunta: 'O que faz um compound literal como (struct Ponto){ 3, 4 }?',
      opcoes: ['Cria uma variável no heap','Converte 3 e 4 para pontos sem função','Cria um valor temporário de struct na expressão','Declara um vetor de dois pontos'],
      correta: 2,
      explicacao: 'É um valor literal composto, criado na expressão, de tipo struct Ponto, com 3 e 4.'
    },
    {
      pergunta: 'Para ler um uint16_t com sscanf, qual especificador usar?',
      opcoes: ['%hd','%\' SCNu16','%d','%u com cast'],
      correta: 1,
      explicacao: 'A macro SCNu16 expande para o especificador correto de leitura de uint16_t.'
    },
    {
      pergunta: 'Qual o papel do membro flexível em \"struct L { size_t n; int itens[]; };\"?',
      opcoes: ['Armazena um int por padrão igual a 0','Permite um vetor de tamanho definido no fim do struct, alocado além do sizeof','Impõe alinhamento de 16 bytes','Cria um ponteiro para int'],
      correta: 1,
      explicacao: 'O membro flexível ([]) fica no final e deve ser alocado com malloc além do sizeof(struct).'
    }
  ],
  projeto: {
    titulo: 'Cabeçalho de protocolo compacto',
    descricao: 'Implemente um cabeçalho de protocolo binário com bit-fields: um registro com 3 flags (1 bit), um campo de tipo (3 bits) e um campo de tamanho (4 bits), mais um campo payload de até 2 bytes, totalizando 1 byte de cabeçalho + payload. Grava esse registro em um arquivo binário \"pacote.bin\" e depois lê de volta, imprimindo todos os campos e o tamanho total (deve ser 1 byte de cabeçalho + payload, struct com _Static_assert de que o cabeçalho ocupa 1 byte se possível).',
    criterios: [
      '3 flags de 1 bit (fim_de_stream, urgente, crc_incluido).',
      'Campo de tipo com 3 bits e campo de tamanho com 4 bits.',
      'Cabeçalho em 1 byte (uint8_t contendo os 8 bits).',
      'Grava em binário e lê de volta com memcpy.',
      'Imprime os campos e o total de bytes.',
      'Compila com gcc -Wall -Wextra -std=c11 sem avisos.',
    ]
  }
},
{
  trilha: '3',
  numero: '11',
  titulo: 'A vida fora do main: ambiente, saída e interação',
  subtitulo: 'argv/argc, variáveis de ambiente, stdin/stdout/stderr e códigos de saída: a interface invisível entre o seu programa e o resto do sistema.',
  objetivo: 'Entender o contrato que todo programa C tem com o sistema operacional: parâmetros da linha de comando (argc/argv), variáveis de ambiente (getenv), os três fluxos padrão (stdin/out/err), buffers e códigos de saída — e como montar pequenas ferramentas de linha de comando que participam de pipes e redirecionamentos como os utilitários UNIX clássicos (grep, cat, head, wc).',
  prerequisitos: 'Conhecer funções e passagem de argumentos (T1.12). Saber trabalhar com vários arquivos (T2.09). Tratar erros com elegância (T3.01).',
  duracao: '~45 min',
  nivel: 'Avançado',
  leitura: {
    beej: 'Beej cap. \"The Outside Environment\" (cap. 18): main(), return code, argc/argv, getenv.',
    king: 'King cap. 13 (strings, ainda útil para strcmp em argv) e cap. 22.',
    foco: 'Foque em argc/argv (ler argumentos com loops sobre argv), getenv (variáveis de ambiente) e a sintaxe de redirect/pipes para testar.'
  },
  secoes: [
    {
      titulo: 'argv/argc: os parâmetros da linha de comando',
      rotulo: 't3m1101',
      paragrafos: [
        'Todo programa C recebe do sistema operacional a linha de comando que o chamou: <code>argc</code> conta quantos itens (strings) vieram e <code>argv</code> é um vetor de strings com elas. <code>argv[0]</code> é o próprio nome/caminho do programa; <code>argv[1]</code> em diante são os argumentos do usuário.',
        'É com esse vetor que ferramentas como <code>head</code>, <code>wc</code> e o seu próprio utilitário decidem o que fazer. No exemplo, imprimimos a contagem e todos os argumentos — incluindo o caminho completo do executável no Windows.',
        'Duas escolhas de design importantes: (a) nunca assuma que o usuário passou o argumento que você espera — valide <code>argc</code>; (b) para opções curtas (-v, -n 5), compare com <code>strcmp</code>.'
      ],
      lista: [
        '<code>argc</code> — quantidade de strings em <code>argv</code> (≥ 1).',
        '<code>argv[0]</code> — nome/caminho do programa; <code>argv[argc]</code> é sempre NULL.',
        'Argumentos são sempre strings: números precisam de <code>atoi()</code>/<code>strtol()</code>.',
        'Valide <code>argc</code> antes de usar <code>argv[1]</code> em diante.'
      ],
      codigo: '#include <stdio.h>\n\nint main(int argc, char *argv[]) {\n    printf(\"argc = %d\\n\", argc);\n    for (int i = 0; i < argc; i++) {\n        printf(\"argv[%d] = %s\\n\", i, argv[i]);\n    }\n    return 0;\n}',
      saida: '> .\argv-info.exe um dois tres\n> argv[1] = um\n> argv[2] = dois\n> argv[3] = tres'
    },
    {
      titulo: 'O ambiente: getenv() e as variáveis de ambiente',
      rotulo: 't3m1102',
      paragrafos: [
        'Além da linha de comando, o sistema entrega ao processo um <strong>ambiente</strong>: um conjunto de pares chave=valor que configura a execução (PATH, USER, COMPUTERNAME, HOME...). Em C, <code>getenv(nome)</code> devolve a string do valor ou NULL se não existir.',
        'É por isso que programas leem configuração sem pedir nada ao usuário: você pode usar o <code>getenv</code> para obter um diretório de logs, um nível de verbosidade, uma flag de debug. No Windows, <code>USERNAME</code> e <code>COMPUTERNAME</code> costumam existir; <code>HOME</code> costuma não ser definido.',
        'O retorno NULL de <code>getenv</code> é seu amigo: sempre trate. Nunca imprima o ponteiro direto sem checar, senão a função imprime \"(null)\" (indefinido).'
      ],
      lista: [
        '<code>getenv(\"NOME\")</code> — devolve o valor (string) ou NULL.',
        'Variáveis comuns no Windows: USERNAME, COMPUTERNAME, PATH.',
        'Sempre teste o retorno antes de usar (evita impressão de NULL).',
        'Outra via: o parâmetro <code>envp[]</code> de main — fornecido sem garantia no padrão.'
      ],
      codigo: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    const char *user = getenv(\"USERNAME\");\n    const char *comp = getenv(\"COMPUTERNAME\");\n    const char *path = getenv(\"PATH\");\n\n    printf(\"USERNAME     = %s\\n\", user ? user : \"(nao definido)\");\n    printf(\"COMPUTERNAME = %s\\n\", comp ? comp : \"(nao definido)\");\n    printf(\"PATH (ini)   = %s\\n\", path ? path : \"(nao definido)\");\n\n    const char *x = getenv(\"VARIAVEL_INEXISTENTE\");\n    printf(\"VARIAVEL_INEXISTENTE = %s\\n\", x ? x : \"(nao definido)\");\n\n    return 0;\n}',
      saida: '> .\getenv.exe\n> USERNAME     = daniel\n> COMPUTERNAME = DESKTOP-6VGRE8J\n> PATH (ini)   = C:\\Users\\daniel\\AppData\\Local\\Programs\\...\\bin;... (trecho)\n> VARIAVEL_INEXISTENTE = (nao definido)\n> \n> (Os valores refletem o ambiente da máquina onde o programa roda.)'
    },
    {
      titulo: 'stdin, stdout e stderr: os três fluxos padrão',
      rotulo: 't3m1103',
      paragrafos: [
        'Qualquer processo em um sistema moderno herda três fluxos de I/O pré-abertos: <code>stdin</code> (entrada), <code>stdout</code> (saída normal) e <code>stderr</code> (mensagens de erro/diagnóstico). O sistema operacional não os distingue por destino — quem decide é quem invoca o processo, via redirecionamento.',
        'A distinção entre stdout e stderr não é cosmética: ela existe para que, num pipe (<code>progA | progB</code>), apenas a saída de dados flua para o pipe, enquanto erros podem ir para o terminal, para um arquivo (2&gt;) ou sumir (2&gt;NUL).',
        'No exemplo, escrevemos em stdout os dados e em stderr o diagnóstico começando com \"iniciando\". Redirecionando apenas o stdout, o diagnóstico ainda aparece — foi para o stderr.'
      ],
      lista: [
        'Três fluxos pré-abertos: stdin, stdout, stderr (já declarados em &lt;stdio.h&gt;).',
        '<code>printf</code> = stdout; <code>fprintf(stderr, ...)</code> = diagnóstico.',
        'Pipe: captura só o stdout do produtor; stderr segue para o terminal, salvo redireção.',
        'No Windows: <code>prog 1&gt;saida.txt 2&gt;erros.txt</code> e <code>prog | filtro</code>.'
      ],
      codigo: '#include <stdio.h>\n\nint main(void) {\n    fprintf(stderr, \"iniciando processamento\\n\");\n\n    int linhas = 0;\n    char buf[256];\n    while (fgets(buf, sizeof buf, stdin)) {\n        printf(\"%s\", buf);\n        linhas++;\n    }\n\n    fprintf(stderr, \"linhas processadas: %d\\n\", linhas);\n    return 0;\n}',
      saida: '> (echo primeira linha; echo segunda linha; echo terceira linha; echo quarta linha) | .\filtro.exe 2> saida.txt\n> [stderr] iniciando processamento\n> [stderr] linhas processadas: 4\n> [stdout, no arquivo saida.txt]\n> primeira linha\n> segunda linha\n> terceira linha\n> quarta linha'
    },
    {
      titulo: 'Códigos de saída: a linguagem do sucesso',
      rotulo: 't3m1104',
      paragrafos: [
        'Quando um programa termina, ele devolve ao shell um <strong>código de saída</strong>: 0 para sucesso, qualquer outro valor para falha (por convenção, 1 para erro genérico). O Windows olha isso em <code>$LASTEXITCODE</code> no PowerShell, e scripts usam esse número para decidir se continuam.',
        'Você controla o código de três formas: pelo <code>return</code> da main, por <code>exit(codigo)</code> (que funciona de qualquer ponto, inclusive dentro de funções) e por <code>_Exit(codigo)</code>. A diferença prática: <code>exit</code> roda os <code>atexit</code> e \"flushes\" a saída; <code>_Exit</code> pula tudo.',
        'O programa de exemplo testa as três vias. É a base para criar seus próprios \"utilitários\" que os scripts do Quality System conseguem interpretar.'
      ],
      lista: [
        '0 = sucesso; não-zero = falha (convenção: 1 genérico, específicos para casos próprios).',
        '<code>return</code> da main e <code>exit(c)</code> são equivalentes na prática.',
        '<code>atexit()</code> registra funções chamadas no exit normal.',
        'Leia o código do shell: PowerShell usa <code>$LASTEXITCODE</code>.'
      ],
      codigo: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nvoid fim_de_jogo(void) {\n    printf(\"(atexit) encerramento normal detectado\\n\");\n}\n\nint main(int argc, char *argv[]) {\n    atexit(fim_de_jogo);\n\n    if (argc < 2) {\n        fprintf(stderr, \"uso: %s <palavra>\\n\", argv[0]);\n        return 2;\n    }\n\n    if (strcmp(argv[1], \"ok\") == 0) {\n        printf(\"tudo certo\\n\");\n        return 0;\n    }\n\n    if (strcmp(argv[1], \"erro\") == 0) {\n        fprintf(stderr, \"algo deu errado\\n\");\n        return 1;\n    }\n\n    printf(\"codigo de saida customizado: 42\\n\");\n    exit(42);\n}',
      saida: '> .\atexit.exe\n> (com argumento \"ok\")\n> tudo certo\n> (atexit) encerramento normal detectado\n> [exit 0]\n> (com argumento \"erro\")\n> algo deu errado\n> [stderr, exit 1]\n> (com argumento \"anything\")\n> codigo de saida customizado: 42\n> [exit 42]'
    },
    {
      titulo: 'Ferramenta 1: um eco que repete argumentos',
      rotulo: 't3m1105',
      paragrafos: [
        'Vamos construir algo útil com o que temos: um eco de linha de comando que repete os argumentos, um por linha, com índice. É o \"cat de argumentos\" — e o embrião de utilitários maiores.',
        'Aqui a validação de numero de argumentos e o loop sobre argv aparecem na prática. Passe sem argumentos e o programa avisa e sai com código 1 em vez de quebrar.',
        'Detalhe profissional: o rotulo [1], [2]... ajuda o usuário a conferir, e o loop usa <code>argc</code> como teto — nunca estoura o vetor.'
      ],
      lista: [
        'Loop sobre argv de 1 até argc-1: <code>for (int i = 1; i &lt; argc; i++)</code>.',
        'Imprima com printf dentro do loop, rotulando índice.',
        'Sem argumentos: avise no stderr e retorne 1.',
        'Esse padrão é a espinha dorsal de head, wc, grep-lite.'
      ],
      codigo: '#include <stdio.h>\n\nint main(int argc, char *argv[]) {\n    if (argc < 2) {\n        fprintf(stderr, \"uso: %s <palavra> [palavra ...]\\n\", argv[0]);\n        return 1;\n    }\n\n    for (int i = 1; i < argc; i++) {\n        printf(\"[%d] %s\\n\", i, argv[i]);\n    }\n\n    return 0;\n}',
      saida: '> .\exit-codigos.exe um dois\n> [1] um\n> [2] dois'
    },
    {
      titulo: 'Ferramenta 2: leitura interativa numérica',
      rotulo: 't3m1106',
      paragrafos: [
        'Terminamos com a melhor prática de interação: ler um número do usuário de forma segura. Em vez de <code>scanf</code> direto (frágil), ler a linha inteira com <code>fgets</code> e parsear com <code>strtol</code> confiando no retorno.',
        '<code>strtol</code> devolve o número e, se você passar <code>&amp;fim</code>, deixa nele o endereço onde o número terminou — se a linha tiver lixo após o número, <code>*fim</code> não aponta para o \'\\n\'. Essa é a checagem da \"entrada toda válida\".',
        'O loop pede até o usuário digitar 0 ou um número de 1 a 5; entradas ruidosas são rejeitadas com mensagem clara, sem travar. É o padrão de qualquer menu de Quality System.'
      ],
      lista: [
        '<code>fgets</code> para capturar a linha; <code>strtol</code> para converter.',
        'Cheque o retorno de strtol e o <code>*fim</code> (lixo após o número).',
        '<code>errno</code> pode indicar overflow; zere antes de chamar.',
        'Mantenha o loop até uma entrada válida — nunca recorra a recursão para isso.'
      ],
      codigo: '#include <stdio.h>\n#include <stdlib.h>\n#include <errno.h>\n\nint main(void) {\n    while (1) {\n        printf(\"digite um numero de 1 a 5 (0 para sair): \");\n        fflush(stdout);\n\n        char linha[64];\n        if (!fgets(linha, sizeof linha, stdin)) break;\n\n        errno = 0;\n        char *fim = NULL;\n        long val = strtol(linha, &fim, 10);\n\n        if (fim == linha || errno == ERANGE || (*fim != \'\\n\' && *fim != \'\\0\')) {\n            printf(\"entrada invalida, tente novamente\\n\");\n            continue;\n        }\n\n        if (val == 0) {\n            printf(\"saindo\\n\");\n            break;\n        }\n        if (val < 1 || val > 5) {\n            printf(\"fora da faixa (1 a 5)\\n\");\n            continue;\n        }\n\n        printf(\"num: %ld\\n\", val);\n    }\n\n    return 0;\n}',
      saida: '> .\entrada-segura.exe\n> digite um numero de 1 a 5 (0 para sair): set\n> entrada invalida, tente novamente\n> digite um numero de 1 a 5 (0 para sair): 3\n> num: 3\n> digite um numero de 1 a 5 (0 para sair): 0\n> saindo\n> \n> (Entrada simulada com \"set\", \"3\", \"0\".)'
    }
  ],
  exercicios: [
    {
      nivel: 'Intermediário',
      enunciado: 'Liste todas as variáveis de ambiente de interesse: imprima USERNAME, COMPUTERNAME e HOME/USERPROFILE (numa segunda tentativa, se não existir, imprima \"nao definida\"), e PATH por inteiro. Use getenv com fallback.'
      ,
      dica: 'Um helper imprime nome e valor, tratando NULL: <code>printf(\"%s = %s\\n\", n, v ? v : \"(nao definido)\")</code>.'
      ,
      solucao: '#include <stdio.h>\n#include <stdlib.h>\n\nvoid mostra(const char *nome) {\n    const char *v = getenv(nome);\n    printf(\"%s = %s\\n\", nome, v ? v : \"(nao definido)\");\n}\n\nint main(void) {\n    mostra(\"USERNAME\");\n    mostra(\"COMPUTERNAME\");\n    mostra(\"USERPROFILE\");\n    mostra(\"PATH\");\n    return 0;\n}',
      solucao_obs: './ex11_1'
    },
    {
      nivel: 'Intermediário',
      enunciado: 'Crie um filtro de grep-lite: leia linhas da stdin e imprima em stdout apenas as que contêm a palavra recebida em argv[1]; em stderr, imprima quantas linhas tinham a palavra. Teste com o arquivo notas.txt (caneta azul, borracha branca, lapis vermelho, regua caneta e lapis) buscando \"caneta\".'
      ,
      dica: 'Use strstr(buf, palavra) para buscar; conte as ocorrências; escreva o total com fprintf(stderr,...).'
      ,
      solucao: '#include <stdio.h>\n#include <string.h>\n\nint main(int argc, char *argv[]) {\n    if (argc < 2) {\n        fprintf(stderr, \"uso: %s <palavra>\\n\", argv[0]);\n        return 1;\n    }\n\n    char buf[512];\n    int vistos = 0;\n    while (fgets(buf, sizeof buf, stdin)) {\n        if (strstr(buf, argv[1])) {\n            printf(\"%s\", buf);\n            vistos++;\n        }\n    }\n\n    fprintf(stderr, \"linhas com \'%s\': %d\\n\", argv[1], vistos);\n    return 0;\n}',
      solucao_obs: './ex11_2 — say com Get-Content notas.txt | .\\ex11_2.exe caneta imprime 2 linhas no stdout (caneta azul; regua caneta e lapis) e o total no stderr.'
    },
    {
      nivel: 'Avançado',
      enunciado: 'Escreva um utilitario reverse que inverte os caracteres de cada linha da stdin e imprime na stdout. Teste com uma linha \"abc\" e confira o resultado \"cba\".'
      ,
      dica: 'Leia com fgets, remova o \\n final (strcspn), e imprima os caracteres de tras para frente com um loop de strlen-1 a 0.'
      ,
      solucao: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char buf[512];\n    while (fgets(buf, sizeof buf, stdin)) {\n        buf[strcspn(buf, \"\\n\")] = \'\\0\';\n        size_t n = strlen(buf);\n        for (size_t i = n; i > 0; i--) {\n            putchar(buf[i - 1]);\n        }\n        putchar(\'\\n\');\n    }\n    return 0;\n}',
      solucao_obs: './ex11_3 — com \"abc\" imprime \"cba\".'
    },
    {
      nivel: 'Avançado',
      enunciado: 'Implemente um head-lite: receba um número N em argv[1] e imprima as N primeiras linhas da stdin na stdout. Teste com N=2 e o notas.txt, conferindo as duas primeiras linhas.'
      ,
      dica: 'Converta com atoi ou strtol; conte as linhas com um contador e pare quando atingir N.'
      ,
      solucao: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char *argv[]) {\n    if (argc < 2) {\n        fprintf(stderr, \"uso: %s <n>\\n\", argv[0]);\n        return 1;\n    }\n\n    int n = atoi(argv[1]);\n    if (n <= 0) {\n        fprintf(stderr, \"n deve ser positivo\\n\");\n        return 1;\n    }\n\n    char buf[512];\n    int linhas = 0;\n    while (linhas < n && fgets(buf, sizeof buf, stdin)) {\n        printf(\"%s\", buf);\n        linhas++;\n    }\n\n    return 0;\n}',
      solucao_obs: './ex11_4 — com N=2 e o notas.txt imprime as duas primeiras linhas.'
    },
    {
      nivel: 'Avançado',
      enunciado: 'Implemente um wc-lite: conte linhas, palavras e caracteres da stdin e imprima no formato \"linhas palavras caracteres\". Teste duas vezes: redirecionando o arquivo e via pipe.'
      ,
      dica: 'Conte \\n para linhas; para palavras, detecte transições de nao-espaco para espaco. "Caracteres" são todos os chars lidos.'
      ,
      solucao: '#include <stdio.h>\n\nint main(void) {\n    long linhas = 0, palavras = 0, chars = 0;\n    int em_palavra = 0;\n    int c;\n\n    while ((c = getchar()) != EOF) {\n        chars++;\n        if (c == \'\\n\') linhas++;\n        if (c == \' \' || c == \'\\n\' || c == \'\\t\') {\n            em_palavra = 0;\n        } else if (!em_palavra) {\n            em_palavra = 1;\n            palavras++;\n        }\n    }\n\n    printf(\"%ld %ld %ld\\n\", linhas, palavras, chars);\n    return 0;\n}',
      solucao_obs: './ex11_5 — com as 4 linhas do notas.txt via pipe (Get-Content notas.txt | .\\ex11_5.exe) imprime \"4 10 64\": 4 linhas, 10 palavras, 64 caracteres (os 60 das palavras mais as 4 quebras de linha). Redirecionando o arquivo direto, o total de caracteres muda por causa dos \\r\\n do Windows.'
    }
  ],
  quiz: [
    {
      pergunta: 'O que contém argv[0] em um programa C?',
      opcoes: ['O primeiro argumento do usuário','O caminho/nome do programa','Sempre NULL','O número de argumentos'],
      correta: 1,
      explicacao: 'argv[0] é o nome/caminho pelo qual o programa foi invocado; os argumentos do usuário começam em argv[1].'
    },
    {
      pergunta: 'O que getenv("USERNAME") devolve se a variável não existir?',
      opcoes: ['A string vazia \\"\\"','O valor 0','NULL','Um erro de compilação'],
      correta: 2,
      explicacao: 'getenv devolve NULL quando a variável não está definida; sempre confira antes de usar.'
    },
    {
      pergunta: 'Qual a diferença prática entre stdout e stderr?',
      opcoes: ['Um é binário e o outro texto','Quem redireciona decide: stdout vai para o pipe/arquivo; stderr vai para o terminal a menos que redirecionado','stderr é mais lento','Não há diferença'],
      correta: 1,
      explicacao: 'São fluxos independentes: o pipe captura só stdout; stderr segue para o terminal, salvo 2>...'
    },
    {
      pergunta: 'Qual código de saída indica sucesso em C/Windows?',
      opcoes: ['1','-1','Qualquer valor par','0'],
      correta: 3,
      explicacao: '0 é o convencional sucesso; qualquer não-zero indica falha.'
    },
    {
      pergunta: 'Para ler um número da stdin com validação, qual a melhor combinação?',
      opcoes: ['scanf("%d") sem checar retorno','gets + atoi','fgets da linha + strtol conferindo retorno e *fim','sscanf("%s")'],
      correta: 2,
      explicacao: 'Ler a linha inteira e converter com strtol permite rejeitar entradas inválidas sem travar.'
    }
  ],
  projeto: {
    titulo: 'Seu mini-conjunto de utilitários',
    descricao: 'Empacote as ferramentas em um único programa \"util.c\" que interpreta a primeira palavra de argv como subcomando e executa: \"grep palavra\", \"head N\", \"wc\" e \"reverse\" sobre a stdin. Formato de saída igual ao dos exercícios. Imprima no stderr as mensagens de erro quando o subcomando não existir, e de uso quando faltar argumento; devolva 1 nesses casos e 0 no sucesso.',
    criterios: [
      'Um único binário que lê o subcomando via strcmp sobre argv[1].',
      'Implementa grep-lite, head-lite, wc-lite e reverse reutilizando as mesmas lógicas.',
      'Trata caso de subcomando desconhecido com stderr + exit 1.',
      'Trata ausência de argumento obrigatório (ex.: grep sem palavra) com uso + exit 1.',
      'Cada subcomando devolve 0 em sucesso.',
      'Testável com Get-Content notas.txt | .\\util.exe grep caneta.',
    ]
  }
},
{
  trilha: '3',
  numero: '12',
  titulo: 'Sistema de arquivos e persistência (projeto final)',
  subtitulo: 'Do fread/fwrite à serialização robusta: construa um gestor de inventário com arquivo binário e testes — o capstone da trilha.',
  objetivo: 'Integrar tudo: structs com dados mistos, entrada robusta, arquivos binários e texto, separação de responsabilidades e testes práticos — entregando um Gestor de Inventário por linha de comando com persistência em arquivo binário e suíte de verificação.',
  prerequisitos: 'Concluir os módulos 3.09–3.11 (tempo, inteiros exatos e ambiente) e saber arquivos (T2.13) e escopo/multiarquivos (T2.15).',
  duracao: '~35 min',
  nivel: 'Avançado',
  leitura: {
    beej: 'Beej: revisite caps. 18 (argv), 35 (stdint), 38 (time). ',
    king: 'King cap. 19 (design de programas grandes) — vale reler o capítulo inteiro antes de começar o projeto.',
    foco: 'Leia com atenção os exercícios de arquivos do Beej e o modelo de divisão em .h/.c do King (padrão: struct no .h, implementação no .c, testes avulsos).'
  },
  secoes: [
    {
      titulo: 'Esqueleto do projeto: dados, menu e persistência',
      rotulo: 't3m1201',
      paragrafos: [
        'O projeto final é um <strong>Gestor de Inventário</strong>: um programa de linha de comando que mantém uma lista de itens (código, nome, quantidade, preço) num arquivo binário, com operações de adicionar, listar, buscar, alterar, remover e sair.',
        'A arquitetura segue o padrão do King cap. 19: um cabeçalho (struct + protótipos), um arquivo de implementação (funções) e o main que só lê comandos. Dividir é o que torna o projeto testável e crescente.',
        'Antes de escrever 400 linhas, desenhe o esqueleto: menu no main, um <code>registro_exibe()</code> para imprimir um item num formato único (a base de tudo) e as decisões binárias (um <code>Registro</code> de tamanho fixo, gravado com fwrite).'
      ],
      lista: [
        'Separar em arquivos: <code>inventario.h</code>, <code>inventario.c</code>, <code>main.c</code>.',
        'Registro fixo: <code>struct Registro { int codigo; char nome[32]; int qtd; double preco; };</code>.',
        'Núcleo da exibição: <code>void registro_exibe(const struct Registro *r)</code> num formato único.',
        'Num arquivo binário, cada registro tem <code>sizeof(struct Registro)</code> bytes.'
      ],
      codigo: '#include <stdio.h>\n\nstruct Registro {\n    int codigo;\n    char nome[32];\n    int qtd;\n    double preco;\n};\n\nvoid registro_exibe(const struct Registro *r) {\n    printf(\"%04d | %-32s | qtd %d | R$ %.2f\\n\",\n           r->codigo, r->nome, r->qtd, r->preco);\n}\n\nint main(void) {\n    struct Registro r = { 1, \"caneta azul\", 12, 1.75 };\n    registro_exibe(&r);\n    return 0;\n}',
      saida: '> .\registro-binario.exe\n> 0001 | caneta azul                      | qtd 12 | R$ 1.75'
    },
    {
      titulo: 'Gravando e lendo binário: fwrite/fread com fseeko',
      rotulo: 't3m1202',
      paragrafos: [
        'Persistir é escrever os bytes do struct no arquivo e, para ler de volta no lugar certo, posicionar-se com <code>fseek</code>/<code>fseek(ftell)</code>. O par <code>fwrite</code>/<code>fread</code> recebe tamanho e quantidade de elementos — aqui, <code>sizeof(struct Registro)</code> e 1.',
        'O protocolo do arquivo: começa com um cabeçalho de 4 bytes (o campo <code>contagem</code> de um struct de arquivo), depois N registros contíguos. O índice de um item é <code>sizeof(struct Registro)</code> vezes a posição.',
        'No exemplo, gravamos um registro, fechamos e reabrimos em modo <code>\"rb\"</code>, posicionamos no byte 4 do arquivo e lemos de volta — conferindo campo a campo que o \"round-trip\" preservou os dados. Esse é o teste mínimo de qualquer serialização.'
      ],
      lista: [
        '<code>fwrite(reg, sizeof *reg, 1, f)</code> — grava o struct inteiro de uma vez.',
        '<code>fseek(f, offset, SEEK_SET)</code> + <code>fread(...)</code> — lê o registro k a partir do offset k*sizeof.',
        'Header do arquivo em um struct separado: <code>struct Arquivo { int contagem; };</code>.',
        'Sempre confira os retornos de fwrite/fread (contagem de itens escrita/lida).'
      ],
      codigo: '#include <stdio.h>\n#include <string.h>\n\nstruct Registro {\n    int codigo;\n    char nome[32];\n    int qtd;\n    double preco;\n};\n\nint main(void) {\n    FILE *f = fopen(\"item.bin\", \"wb\");\n    if (!f) return 1;\n\n    struct Registro r = { 7, \"borracha\", 25, 0.90 };\n    printf(\"gravando %zu bytes\\n\", sizeof r);\n    fwrite(&r, sizeof r, 1, f);\n    fclose(f);\n\n    f = fopen(\"item.bin\", \"rb\");\n    if (!f) return 1;\n\n    struct Registro lido;\n    fseek(f, 0, SEEK_SET);\n    fread(&lido, sizeof lido, 1, f);\n    fclose(f);\n\n    if (lido.codigo == r.codigo && strcmp(lido.nome, r.nome) == 0 &&\n        lido.qtd == r.qtd && lido.preco == r.preco) {\n        printf(\"round-trip ok: %04d %s qtd=%d preco=%.2f\\n\",\n               lido.codigo, lido.nome, lido.qtd, lido.preco);\n    } else {\n        printf(\"ERRO: dados divergem apos o round-trip\\n\");\n    }\n\n    return 0;\n}',
      saida: '> .\orcamento-extra.exe\n> gravando 48 bytes\n> round-trip ok: 0007 borracha qtd=25 preco=0.90\n> \n> (48 = 4 do int codigo + 32 do nome + 4 do int qtd + 8 do double preco; o valor muda se você alterar os campos.)'
    },
    {
      titulo: 'Teste como disciplina: um main de verificação',
      rotulo: 't3m1203',
      paragrafos: [
        'Antes de fechar o projeto, transforme as funções em um pequeno <strong>main de teste</strong>: um programa que liga as funções do inventário, verifica resultados esperados e contabiliza PASS/FAIL. Testar não é opcional num módulo de persistência — é como você prova que o formato binário não \"vazou\" um byte.',
        'O padrão: cada teste chama uma função, compara o resultado com o esperado e imprime <code>PASS</code> ou <code>FAIL</code>; no final, imprime o resumo e devolve o número de falhas como código de saída (0 = todos passaram).',
        'Assim, o seu gestor de inventário pode ser rodado tanto por um humano (menu) quanto por uma máquina (testes) — e é exatamente isso que scripts de Quality System esperam de um binário.'
      ],
      lista: [
        'Função helper <code>check(int ok, const char *nome)</code> imprime PASS/FAIL.',
        'Contadores: <code>int passou, falhou;</code> — resumo no final.',
        'Código de saída = número de falhas (0 = sucesso).',
        'Teste 4 coisas: inserir, listar (conta registros), buscar existente, buscar inexistente.'
      ],
      codigo: '#include <stdio.h>\n\nstatic int passou = 0, falhou = 0;\n\nstatic void check(int ok, const char *nome) {\n    printf(\"%s %s\\n\", ok ? \"PASS\" : \"FAIL\", nome);\n    if (ok) passou++; else falhou++;\n}\n\nstatic int soma_3(int a, int b, int c) {\n    return a + b + c;\n}\n\nint main(void) {\n    check(soma_3(1, 2, 3) == 6, \"soma 1+2+3 = 6\");\n    check(soma_3(-1, 7, 0) == 6, \"soma -1+7+0 = 6\");\n    check(soma_3(0, 0, 0) == 0, \"soma 0+0+0 = 0\");\n    check(soma_3(100, 200, 300) == 600, \"soma 100+200+300\");\n\n    printf(\"%d testes, %d falhas\\n\", passou + falhou, falhou);\n    return falhou;\n}',
      saida: '> .\suite-testes.exe\n> PASS soma 1+2+3 = 6\n> PASS soma -1+7+0 = 6\n> PASS soma 0+0+0 = 0\n> PASS soma 100+200+300\n> 4 testes, 0 falhas'
    },
    {
      titulo: 'Boas práticas e leitura reversa do registro',
      rotulo: 't3m1204',
      paragrafos: [
        'Um detalhe sutil do binário: gravar um struct inteiro com fwrite é rápido, mas o arquivo fica dependente do layout da struct (padrão de preenchimento/alinho do compilador). Para aprender a \"costura fina\", o projeto do módulo usa um formato <em>texto</em> (como alternativa) e o binário com struct — e você é convidado a experimentar os dois.',
        'Profissionalmente, o formato de registro fixo em binário é o mais simples e ainda flexível. As regras de ouro: (1) abra sempre conferindo <code>if (!f)</code>; (2) mantenha uma função <code>abre_arquivo()</code> única; (3) depois de cada operação que mexe no ponteiro do arquivo, feche e reabra para \"resetar\" a posição — isso evita bugs de fseek mal lembrado.',
        'E lembre-se: fluxo de dados errado é invisível. A disciplina de <code>registro_exibe()</code> faz com que qualquer lista impressa seja idêntica, em qualquer função — comparável em um teste automático.'
      ],
      paragrafos_extra: [],
      lista: [
        'Abra arquivos sempre validando o retorno; dê mensagem em stderr.',
        'Uma única função <code>abre()</code> central os modos de abertura usados.',
        'Feche depois de operações e reabra para evitar fseek esquecido.',
        'Compare sempre via registro_exibe para verificação visual e textual invariante.'
      ]
    },
    {
      titulo: 'Encerrando a trilha',
      rotulo: 't3m1205',
      paragrafos: [
        'Você chegou ao fim da Trilha 3 — Avançado. Neste módulo você uniu: <code>&lt;time.h&gt;</code> (carimbo de horário dos logs), <code>&lt;stdint.h&gt;</code> (códigos exatos e preços em inteiros de largura exata opcional), <code>&lt;stdlib.h&gt;</code> (argv para comandos) e os fluxos de entrada para criar um programa com interface de máquina e de humano.',
        'O saldo que fica: de agora em diante seus programas não são mais \"scripts de exemplo\" — eles conversam com o sistema (sinais de saida), persistem dados com formato próprio, medem o tempo e se defendem de entradas inválidas. É o arsenal básico para ferramentas de Quality System, automação, protocolos e utilitários do dia a dia.',
        'Bons estudos — e lembre-se: o próximo nível é sempre o do reuso (bibliotecas, split em .h/.c) e o da segurança (fgets em vez de scanf, strtol em vez de atoi, checagem de retorno em tudo). A Trilha 3 está completa.'
      ],
      codigo: '#include <stdio.h>\n\nint main(void) {\n    printf(\"trilha 3 concluida. proximo passo: reuso e bibliotecas.\\n\");\n    return 0;\n}',
      saida: '> .\conclusao-trilha.exe\n> trilha 3 concluida. proximo passo: reuso e bibliotecas.'
    }
  ],
  exercicios: [
    {
      nivel: 'Avançado',
      enunciado: 'Crie a funcao int registro_busca(FILE *f, int codigo, struct Registro *saida) que percorre os registros do arquivo (do offset 4 em diante, apos o cabeçalho de contagem) e preenche *saida se encontrar o codigo; devolve 1 se achou, 0 se nao. Teste com dois items gravados (codigos 10 e 40) procurando 40 e depois 999.'
      ,
      dica: 'O arquivo com N registros tem 4 + N*sizeof(struct Registro) bytes. fread em loop ate EOF ou ate o fim calculado.'
      ,
      solucao: '#include <stdio.h>\n#include <string.h>\n\nstruct Registro {\n    int codigo;\n    char nome[32];\n    int qtd;\n    double preco;\n};\n\nint registro_busca(FILE *f, int codigo, struct Registro *saida) {\n    fseek(f, 4, SEEK_SET);\n    struct Registro r;\n    while (fread(&r, sizeof r, 1, f) == 1) {\n        if (r.codigo == codigo) {\n            *saida = r;\n            return 1;\n        }\n    }\n    return 0;\n}\n\nint main(void) {\n    FILE *f = fopen(\"buf.bin\", \"wb\");\n    if (!f) return 1;\n    struct Registro items[2];\n    items[0].codigo = 10; strcpy(items[0].nome, \"item dez\"); items[0].qtd = 1; items[0].preco = 1.0;\n    items[1].codigo = 40; strcpy(items[1].nome, \"item quarenta\"); items[1].qtd = 2; items[1].preco = 2.5;\n    int cont = 2;\n    fwrite(&cont, sizeof cont, 1, f);\n    fwrite(items, sizeof(struct Registro), cont, f);\n    fclose(f);\n\n    f = fopen(\"buf.bin\", \"rb\");\n    if (!f) return 1;\n\n    struct Registro achado;\n    if (registro_busca(f, 40, &achado)) {\n        printf(\"codigo %d encontrado: %s\\n\", achado.codigo, achado.nome);\n    } else {\n        printf(\"codigo %d nao encontrado\\n\", 40);\n    }\n\n    if (registro_busca(f, 999, &achado)) {\n        printf(\"codigo 999 encontrado: %s\\n\", achado.nome);\n    } else {\n        printf(\"codigo 999 nao encontrado\\n\");\n    }\n\n    fclose(f);\n    return 0;\n}',
      solucao_obs: './ex12_1 — o fseek(f, 4, SEEK_SET) pula o cabeçalho de contagem (4 bytes) antes da busca; sem ele, o contador seria lido como um registro falso.'
    },
    {
      nivel: 'Avançado',
      enunciado: 'Escreva o esqueleto completo do gestor com as funcoes salva(cont, items, nome_arquivo) e carrega(cont, items, nome_arquivo) que gravam/leem, respetivamente, o cabeçalho e os registros. No main, crie 3 registros, salve, leia de volta e imprima via registro_exibe, conferindo no final quantos foram lidos.'
      ,
      dica: 'O struct Arquivo { int contagem; } evita ler bool falso; acesse items[c] apos carregar com base em cont.'
      ,
      solucao: '#include <stdio.h>\n#include <string.h>\n\nstruct Registro {\n    int codigo;\n    char nome[32];\n    int qtd;\n    double preco;\n};\n\nstruct Arquivo {\n    int contagem;\n};\n\nvoid registro_exibe(const struct Registro *r) {\n    printf(\"%04d | %-32s | qtd %d | R$ %.2f\\n\",\n           r->codigo, r->nome, r->qtd, r->preco);\n}\n\nvoid salva(int cont, const struct Registro *items, const char *nome) {\n    FILE *f = fopen(nome, \"wb\");\n    if (!f) return;\n    struct Arquivo h = { cont };\n    fwrite(&h, sizeof h, 1, f);\n    fwrite(items, sizeof(struct Registro), cont, f);\n    fclose(f);\n}\n\nint carrega(struct Registro *items, const char *nome) {\n    FILE *f = fopen(nome, \"rb\");\n    if (!f) return 0;\n    struct Arquivo h;\n    if (fread(&h, sizeof h, 1, f) != 1) { fclose(f); return 0; }\n    int n = fread(items, sizeof(struct Registro), h.contagem, f);\n    fclose(f);\n    return n;\n}\n\nint main(void) {\n    struct Registro items[8];\n    items[0].codigo = 1;  strcpy(items[0].nome, \"caneta\");    items[0].qtd = 12; items[0].preco = 1.75;\n    items[1].codigo = 2;  strcpy(items[1].nome, \"lapis\");     items[1].qtd = 8;  items[1].preco = 0.80;\n    items[2].codigo = 3;  strcpy(items[2].nome, \"regua\");     items[2].qtd = 4;  items[2].preco = 3.20;\n\n    salva(3, items, \"inventario.bin\");\n\n    struct Registro lidos[8];\n    int n = carrega(lidos, \"inventario.bin\");\n    printf(\"gravados 3 registros; lidos %d:\\n\", n);\n    for (int i = 0; i < n; i++) {\n        registro_exibe(&lidos[i]);\n    }\n\n    return 0;\n}',
      solucao_obs: './ex12_2'
    }
  ],
  quiz: [
    {
      pergunta: 'Para gravar um struct inteiro num arquivo binário em uma única chamada, qual função usar?',
      opcoes: ['fprintf(f, "%s", &r)','fwrite(&r, sizeof r, 1, f)','fputs(&r, f)','putc(&r, f)'],
      correta: 1,
      explicacao: 'fwrite com tamanho sizeof(struct) e 1 elemento grava o struct completo.'
    },
    {
      pergunta: 'O que significa o código de saída 0 de um testador?',
      opcoes: ['Houve 0 falhas','O teste foi pulado','Nenhum teste rodou','O programa travou'],
      correta: 0,
      explicacao: 'Por convenção, 0 = sucesso/sem falhas; o testador devolve o nº de falhas.'
    },
    {
      pergunta: 'No arquivo binário do gestor, o que está nos primeiros 4 bytes?',
      opcoes: ['O primeiro registro completo','O contador de registros (cabeçalho)','O tamanho do arquivo em bytes','Um número mágico de assinatura'],
      correta: 1,
      explicacao: 'O cabeçalho struct Arquivo { int contagem; } ocupa 4 bytes no início; os registros vêm depois.'
    },
    {
      pergunta: 'Por que separar o código em inventario.h/inventario.c/main.c?',
      opcoes: ['Para deixar mais lento','Para desacoplar interface, implementação e ponto de entrada','Porque o compilador exige','Para as funções ficarem globais'],
      correta: 1,
      explicacao: 'A separação em .h (interface), .c (implementação) e main (entrada) é o padrão de projetos maiores (King cap. 19).'
    },
    {
      pergunta: 'Que informação uma função de busca de registro deve devolver?',
      opcoes: ['Só o nome','Se achou (0/1) e o registro encontrado','O tamanho do arquivo','A quantidade de registros'],
      correta: 1,
      explicacao: 'A convenção escolhida: int (1=achou, 0=não) + preenchimento de *saida.'
    }
  ],
  projeto: {
    titulo: 'Gestor de inventário CLI com persistência binária',
    descricao: 'Construa o projeto final completo da trilha: um Gestor de Inventário com menu de texto e persistência em arquivo binário. Comandos: (1) adicionar item, (2) listar, (3) buscar por código, (4) alterar quantidade, (5) remover, (0) sair. Um arquivo \"inventario.bin\" guarda o cabeçalho (int contagem) seguido de N registros (struct: codigo int, nome char[32], qtd int, preco double). O menu é um loop com a leitura segura de fgets+strtol; toda alteração reescreve o arquivo do zero (padrão simples e robusto). Testes: um arquivo main de teste ativa as funções (busca existe/não existe, salvar+carregar round-trip) e imprime PASS/FAIL com resumo.',
    criterios: [
      'Menu funcional com os 6 comandos e validação de entrada (não trava com texto).',
      'Persistência: salvar/carregar com cabeçalho+registros; round-trip sem perda de campos.',
      'registro_exibe única para tudo.',
      'Busca devolve 0/1 e preenche saida.',
      'Remoção compacta (reordena, decrementa contagem).',
      'main de teste com PASS/FAIL e resumo, saída 0 se 0 falhas.',
      'Código organizado em arquivos (inventario.h/inventario.c/main.c) na entrega.',
      'Compila com gcc -Wall -Wextra -std=c11 sem avisos.',
    ]
  }
}
];