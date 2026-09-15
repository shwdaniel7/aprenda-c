// Trilha 2 — Intermediário (continuação): módulos 13 a 15
module.exports = [
  {
    trilha: '2',
    numero: '13',
    titulo: 'Arquivos: texto e binário',
    subtitulo: 'FILE*, fopen, modos r/w/a, fgets/fscanf, fwrite/fread e fseek',
    objetivo:
      'Dominar a persistência em C: abrir e fechar arquivos com FILE*, gravar e ler texto com fprintf/fscanf e fgets, gravar e ler binário com fwrite/fread, navegar com fseek/ftell/rewind — e sair de cada programa com arquivos íntegros e bem fechados.',
    prerequisitos: 'T2.04 e T2.06',
    duracao: '~45 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 9 (File I/O)',
      king: 'Capítulo 22 (Input/Output)',
      foco:
        'No Beej, leia as seções de fopen/fclose, fprintf/fscanf, fgets/fputs e fread/fwrite. No King, o capítulo 22 é todo dedicado a arquivos: modos de abertura, navegação e o ciclo de vida do FILE*.',
    },
    secoes: [
      {
        titulo: 'Por que arquivos: persistência',
        rotulo: 'primeiro-arquivo.c',
        paragrafos: [
          'Tudo o que você imprimiu até aqui morreu no terminal. <strong>Arquivos</strong> são a memória de longo prazo do programa: o dado gravado hoje pode ser lido amanhã — por outro programa seu, pelo editor de texto ou por um banco de dados. Sem arquivos, agendas, logs, configurações e jogos salvos não existiriam.',
          'O meio de acesso é a struct <code>FILE</code>. Quem "abre" um arquivo é <code>fopen(caminho, modo)</code>, que devolve um ponteiro <code>FILE *</code> — ou <code>NULL</code> se algo deu errado (permissão, disco cheio, arquivo inexistente...). Regra de ouro: <strong>confira sempre o retorno</strong> antes de usar.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    FILE *f = fopen("dados.txt", "w");
    if (f == NULL) {
        printf("nao consegui abrir o arquivo para escrita\\n");
        return 1;
    }
    fprintf(f, "Ana 8.5\\n");
    fprintf(f, "Bruno 7.0\\n");
    fclose(f);

    f = fopen("dados.txt", "r");
    if (f == NULL) {
        printf("nao consegui abrir o arquivo para leitura\\n");
        return 1;
    }

    char nome[50];
    double nota;
    while (fscanf(f, "%49s %lf", nome, &nota) == 2) {
        printf("li: %s com nota %.1f\\n", nome, nota);
    }
    fclose(f);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 primeiro-arquivo.c -o pa
> .\\pa.exe

li: Ana com nota 8.5
li: Bruno com nota 7.0`,
      },
      {
        titulo: 'Modos de abertura e texto vs binário',
        rotulo: 'modos.c',
        paragrafos: [
          '<code>fopen</code> recebe o caminho e o <em>modo</em>: <code>"r"</code> (read), <code>"w"</code> (write — <strong>apaga</strong> o que havia e recomeça do zero), <code>"a"</code> (append — escreve no fim), e os "plus" <code>"r+"</code>/<code>"w+"</code>/<code>"a+"</code>, que abrem para leitura E escrita. Neste módulo os programas criam/leem arquivos na pasta atual.',
          'Nos modos <em>de texto</em> (sem <code>"b"</code>), o C traduz a quebra de linha: você escreve <code>\\n</code> e o arquivo guarda <code>\\r\\n</code> no Windows. Os modos <strong>binários</strong> (<code>"rb"</code>, <code>"wb"</code>) copiam os bytes exatamente como estão — essencial para arquivos de dados sem tradução.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    FILE *f;

    f = fopen("notas.txt", "w");
    if (f == NULL) {
        return 1;
    }
    fprintf(f, "primeira linha\\n");
    fclose(f);

    f = fopen("notas.txt", "a");
    if (f == NULL) {
        return 1;
    }
    fprintf(f, "segunda linha (anexada)\\n");
    fclose(f);

    f = fopen("notas.txt", "r");
    if (f == NULL) {
        return 1;
    }
    char linha[200];
    int n = 0;
    while (fgets(linha, sizeof linha, f) != NULL) {
        n++;
        printf("%d: %s", n, linha);
    }
    fclose(f);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 modos.c -o modos
> .\\modos.exe

1: primeira linha
2: segunda linha (anexada)`,
      },
      {
        titulo: 'Texto: escrever com formato e ler com o "padrão fgets"',
        rotulo: 'texto.c',
        paragrafos: [
          'Para texto formatado, o par <code>fprintf</code>/<code>fscanf</code> é o <code>printf</code>/<code>scanf</code> com um <code>FILE *</code> como primeiro argumento. Para ler <em>linhas inteiras</em> — incluindo espaços —, o padrão é <code>fgets</code>: ele lê até a quebra de linha e <strong>conserva o <code>\\n</code></strong> no buffer. E o truque do loop: enquanto <code>fgets</code> devolver <code>NULL</code>, não chegamos ao fim; quando o arquivo acaba, o retorno vira <code>NULL</code> e o loop encerra sozinho.',
          'Depois do loop, <code>feof(f)</code> diz "terminou normalmente"; <code>ferror(f)</code> indica erro real de I/O (disco, permissão). No dia a dia, esperamos o fim natural e conferimos <code>ferror</code> ao sair.',
        ],
        codigo: `#include <stdio.h>
#include <string.h>

int main(void)
{
    FILE *f = fopen("texto.txt", "w");
    if (f == NULL) {
        return 1;
    }
    fprintf(f, "linha um: aprendendo C\\n");
    fprintf(f, "linha dois: arquivos\\n");
    fprintf(f, "linha tres: misterio termina em EOF\\n");
    fclose(f);

    f = fopen("texto.txt", "r");
    if (f == NULL) {
        return 1;
    }

    char buf[200];
    int contador = 0;
    while (fgets(buf, sizeof buf, f) != NULL) {
        contador++;
        printf("linha %d (%zu bytes): %s", contador, strlen(buf), buf);
    }
    if (ferror(f)) {
        printf("erro de leitura!\\n");
    } else {
        printf("fim de arquivo (EOF) apos %d linhas\\n", contador);
    }
    fclose(f);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 texto.c -o texto
> .\\texto.exe

linha 1 (23 bytes): linha um: aprendendo C
linha 2 (21 bytes): linha dois: arquivos
linha 3 (36 bytes): linha tres: misterio termina em EOF
fim de arquivo (EOF) apos 3 linhas

(strlen conta até o \\n inclusive, daí os tamanhos das linhas)`,
      },
      {
        titulo: 'Binário: fwrite e fread',
        rotulo: 'binario.c',
        paragrafos: [
          'Arquivo binário guarda a memória "crua": <code>fwrite(endereco, tamanho_do_elemento, quantidade, f)</code> grava <code>quantidade</code> blocos; <code>fread</code> faz o caminho inverso. Os dois devolvem quantos <em>elementos</em> conseguiram processar — confira esse número contra o esperado.',
          '<strong>Cuidado com structs:</strong> gravar uma struct direto grava também o <em>padding</em> (T2.06), que muda de compilador para compilador. Um arquivo criado numa máquina pode não ser lido de forma igual noutra. Para formatos duradouros, grava-se campo a campo e embute-se um campo <code>versao</code> no próprio arquivo.',
        ],
        codigo: `#include <stdio.h>

typedef struct {
    int id;
    double valor;
    char nome[20];
    int versao;
} Registro;

int main(void)
{
    Registro dados[3] = {
        {1, 10.50, "maca", 1},
        {2, 3.25, "feijao", 1},
        {3, 99.00, "cafe", 1},
    };
    Registro lido[3];
    FILE *f;

    printf("sizeof(Registro) = %zu bytes\\n", sizeof(Registro));

    f = fopen("dados.bin", "wb");
    if (f == NULL) {
        return 1;
    }
    size_t escritos = fwrite(dados, sizeof dados[0], 3, f);
    printf("fwrite gravou %zu de 3 registros\\n", escritos);
    fclose(f);

    f = fopen("dados.bin", "rb");
    if (f == NULL) {
        return 1;
    }
    size_t lidos = fread(lido, sizeof lido[0], 3, f);
    printf("fread leu %zu de 3 registros\\n", lidos);
    fclose(f);

    for (int i = 0; i < 3; i++) {
        printf("id=%d valor=%.2f nome=%s versao=%d\\n",
               lido[i].id, lido[i].valor, lido[i].nome, lido[i].versao);
    }
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 binario.c -o binario
> .\\binario.exe

sizeof(Registro) = 40 bytes
fwrite gravou 3 de 3 registros
fread leu 3 de 3 registros
id=1 valor=10.50 nome=maca versao=1
id=2 valor=3.25 nome=feijao versao=1
id=3 valor=99.00 nome=cafe versao=1

(os 40 bytes incluem padding: int 4 + double 8 + char[20] + int 4 + alinhamento — depende da arquitetura)`,
      },
      {
        titulo: 'Navegando: fseek, rewind e ftell',
        rotulo: 'fseek.c',
        paragrafos: [
          'Todo arquivo aberto tem um "ponteiro de posição" interno. <code>fseek(f, offset, SEEK_SET)</code> pula para o byte <code>offset</code> a partir do início (<code>SEEK_CUR</code> a partir do atual, <code>SEEK_END</code> a partir do fim); <code>ftell(f)</code> diz em qual byte você está e <code>rewind(f)</code> volta ao início.',
          'Em um arquivo de registros de tamanho fixo, o registro N mora no offset <code>N × sizeof(Registro)</code>. Com um único <code>fseek</code>, lemos só o registro desejado — sem percorrer os anteriores. É o acesso aleatório que bancos de dados usam por trás dos índices.',
        ],
        codigo: `#include <stdio.h>

typedef struct {
    int id;
    int valor;
} Registro;

int main(void)
{
    Registro regs[6];
    for (int i = 0; i < 6; i++) {
        regs[i].id = 100 + i;
        regs[i].valor = i * 10;
    }

    FILE *f = fopen("registros.bin", "wb");
    if (f == NULL) {
        return 1;
    }
    fwrite(regs, sizeof regs[0], 6, f);
    fclose(f);

    f = fopen("registros.bin", "rb");
    if (f == NULL) {
        return 1;
    }

    int indice = 4;
    long offset = (long)indice * (long)sizeof(Registro);
    if (fseek(f, offset, SEEK_SET) != 0) {
        printf("falha no fseek\\n");
        fclose(f);
        return 1;
    }
    printf("ftell depois do fseek: %ld\\n", ftell(f));

    Registro r;
    size_t n = fread(&r, sizeof r, 1, f);
    printf("li %zu registro: id=%d valor=%d\\n", n, r.id, r.valor);

    rewind(f);
    n = fread(&r, sizeof r, 1, f);
    printf("com rewind li de novo o registro 0: id=%d\\n", r.id);

    fclose(f);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 fseek.c -o fseek
> .\\fseek.exe

ftell depois do fseek: 32
li 1 registro: id=104 valor=40
com rewind li de novo o registro 0: id=100

(32 = 4 registros × 8 bytes cada; o registro 104 é o 5º, de índice 4)`,
      },
      {
        titulo: 'Boas práticas: o fluxo de um programa de qualidade',
        rotulo: 'fluxo-seguro.c',
        paragrafos: [
          'Um programa que mexe com arquivo merece os mesmos cuidados de um que mexe com ponteiros. A lista abaixo é o "checklist" que todo código de arquivo sério segue:',
        ],
        lista: [
          '<strong>Fechar sempre</strong>: <code>fclose</code> despeja os buffers no disco. Esquecer pode perder o último pedaço de dados e, em volume, esgotar os descritores do processo.',
          '<strong>Checar o retorno do fclose</strong>: boa parte das falhas de escrita (disco cheio, por exemplo) só aparece no fechamento.',
          'Conferir <code>NULL</code> logo após o <code>fopen</code> e conferir o retorno dos <code>fwrite</code>/<code>fread</code>/<code>fprintf</code>.',
          '<strong>Conferir o modo</strong>: <code>"w"</code> destrói o arquivo antigo; abrir para escrita algo que devia ser lido é corrupção em câmara lenta.',
          'Fechar cada arquivo assim que terminar de usá-lo, mesmo que o programa siga com outros.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    FILE *f = fopen("importante.txt", "w");
    if (f == NULL) {
        printf("erro: nao deu para criar o arquivo\\n");
        return 1;
    }

    if (fprintf(f, "dados importantes\\n") < 0) {
        printf("erro: falha ao escrever\\n");
        fclose(f);
        return 1;
    }

    if (fclose(f) != 0) {
        printf("erro: falha ao fechar (dados podem nao ter ido ao disco)\\n");
        return 1;
    }
    printf("arquivo salvo e fechado com sucesso\\n");
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 fluxo-seguro.c -o fluxo
> .\\fluxo.exe

arquivo salvo e fechado com sucesso`,
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Escreva um programa que grava 5 inteiros num arquivo <code>numeros.txt</code> com <code>fprintf</code> (um por linha), fecha, reabre para leitura e lê tudo com <code>fscanf</code> somando. Imprima cada valor lido e a soma final.',
        dica: 'O loop <code>while (fscanf(f, "%d", &x) == 1)</code> para sozinho ao chegar no fim do arquivo.',
        solucao: `#include <stdio.h>

int main(void)
{
    int valores[5] = {3, 8, 15, 22, 47};

    FILE *f = fopen("numeros.txt", "w");
    if (f == NULL) {
        return 1;
    }
    for (int i = 0; i < 5; i++) {
        fprintf(f, "%d\\n", valores[i]);
    }
    fclose(f);

    f = fopen("numeros.txt", "r");
    if (f == NULL) {
        return 1;
    }

    int x, soma = 0, lidos = 0;
    while (fscanf(f, "%d", &x) == 1) {
        soma += x;
        lidos++;
        printf("li: %d\\n", x);
    }
    fclose(f);

    printf("lidos=%d soma=%d\\n", lidos, soma);
    return 0;
}`,
        solucao_obs: 'Para 3, 8, 15, 22 e 47, a soma esperada é 95.',
      },
      {
        nivel: 2,
        enunciado:
          'Escreva um programa que cria <code>origem.txt</code> com três linhas, copia para <code>destino.txt</code> <strong>linha a linha</strong> com <code>fgets</code>/<code>fputs</code> e por fim imprime o conteúdo copiado para provar que a cópia funcionou.',
        dica: 'fgets devolve NULL no fim do arquivo; fputs reescreve a linha sem formato (o \\n já vem embutido).',
        solucao: `#include <stdio.h>

int main(void)
{
    FILE *origem = fopen("origem.txt", "w");
    if (origem == NULL) {
        return 1;
    }
    fprintf(origem, "primeira linha\\n");
    fprintf(origem, "segunda linha\\n");
    fprintf(origem, "terceira linha\\n");
    fclose(origem);

    origem = fopen("origem.txt", "r");
    if (origem == NULL) {
        return 1;
    }
    FILE *dest = fopen("destino.txt", "w");
    if (dest == NULL) {
        fclose(origem);
        return 1;
    }

    char linha[256];
    int copiadas = 0;
    while (fgets(linha, sizeof linha, origem) != NULL) {
        fputs(linha, dest);
        copiadas++;
    }

    fclose(origem);
    if (fclose(dest) != 0) {
        return 1;
    }
    printf("copiei %d linhas\\n", copiadas);

    dest = fopen("destino.txt", "r");
    if (dest == NULL) {
        return 1;
    }
    while (fgets(linha, sizeof linha, dest) != NULL) {
        printf("%s", linha);
    }
    fclose(dest);
    return 0;
}`,
        solucao_obs: 'fputs conserva exatamente o que fgets leu, inclusive o \\n — nada de formatar de novo.',
      },
      {
        nivel: 2,
        enunciado:
          'Implemente um "wc" caseiro: crie um arquivo de texto com duas linhas, reabra para leitura e conte <strong>linhas, palavras e bytes</strong>. Palavra é qualquer sequência de caracteres que não seja espaço, tab ou quebra de linha.',
        dica: 'Conte palavras dentro de cada linha com uma função simples que alterna os estados "dentro de palavra" e "fora de palavra". Bytes = soma de strlen das linhas lidas.',
        solucao: `#include <stdio.h>
#include <string.h>

int contar_palavras(const char *linha)
{
    int n = 0;
    int dentro = 0;
    for (const char *p = linha; *p != '\\0'; p++) {
        if (*p == ' ' || *p == '\\t' || *p == '\\n') {
            dentro = 0;
        } else if (!dentro) {
            dentro = 1;
            n++;
        }
    }
    return n;
}

int main(void)
{
    FILE *f = fopen("texto.txt", "w");
    if (f == NULL) {
        return 1;
    }
    fprintf(f, "o rato roeu a roupa do rei de roma\\n");
    fprintf(f, "programacao em c\\n");
    fclose(f);

    f = fopen("texto.txt", "r");
    if (f == NULL) {
        return 1;
    }

    char linha[512];
    int linhas = 0, palavras = 0;
    long bytes = 0;
    while (fgets(linha, sizeof linha, f) != NULL) {
        linhas++;
        palavras += contar_palavras(linha);
        bytes += (long)strlen(linha);
    }
    fclose(f);

    printf("linhas:  %d\\n", linhas);
    printf("palavras: %d\\n", palavras);
    printf("bytes:   %ld\\n", bytes);
    return 0;
}`,
        solucao_obs: 'Com o conteúdo do exemplo, o resultado real é linhas 2, palavras 12, bytes 52.',
      },
      {
        nivel: 3,
        enunciado:
          'Crie a struct <code>Contato</code> (nome[40], telefone[20], idade) e grave um array de 3 contatos com <code>fwrite</code> em <code>contatos.bin</code> (modo <code>"wb"</code>). Depois releia com <code>fread</code> e liste tudo.',
        dica: '<code>fwrite(agenda, sizeof agenda[0], 3, f)</code>; confira que o retorno é 3.',
        solucao: `#include <stdio.h>

typedef struct {
    char nome[40];
    char telefone[20];
    int idade;
} Contato;

int main(void)
{
    Contato agenda[3] = {
        {"Ana", "119999-0001", 25},
        {"Bruno", "119999-0002", 31},
        {"Carla", "119999-0003", 44},
    };
    Contato lido[3];
    FILE *f;

    f = fopen("contatos.bin", "wb");
    if (f == NULL) {
        return 1;
    }
    size_t n = fwrite(agenda, sizeof agenda[0], 3, f);
    printf("gravados: %zu\\n", n);
    fclose(f);

    f = fopen("contatos.bin", "rb");
    if (f == NULL) {
        return 1;
    }
    n = fread(lido, sizeof lido[0], 3, f);
    printf("lidos: %zu\\n", n);
    fclose(f);

    for (int i = 0; i < 3; i++) {
        printf("%s | %s | %d anos\\n",
               lido[i].nome, lido[i].telefone, lido[i].idade);
    }
    return 0;
}`,
        solucao_obs: 'O arquivo .bin é ilegível num editor de texto: são bytes puros. É o preço — e a vantagem — do binário.',
      },
      {
        nivel: 4,
        enunciado:
          'Grave 5 registros da struct <code>Record { int id; long pontos; }</code> em <code>records.bin</code>. Depois, <strong>sem ler os anteriores</strong>, use <code>fseek</code> para ler direto o 3º registro (índice 2).',
        dica: 'O offset do registro N é <code>N * sizeof(Record)</code>. Leia um único elemento com fread.',
        solucao: `#include <stdio.h>

typedef struct {
    int id;
    long pontos;
} Record;

int main(void)
{
    Record dados[5];
    for (int i = 0; i < 5; i++) {
        dados[i].id = i + 1;
        dados[i].pontos = (long)(i + 1) * 1000;
    }

    FILE *f = fopen("records.bin", "wb");
    if (f == NULL) {
        return 1;
    }
    fwrite(dados, sizeof dados[0], 5, f);
    fclose(f);

    f = fopen("records.bin", "rb");
    if (f == NULL) {
        return 1;
    }

    int indice = 2;
    if (fseek(f, (long)indice * (long)sizeof(Record), SEEK_SET) != 0) {
        fclose(f);
        return 1;
    }

    Record r;
    if (fread(&r, sizeof r, 1, f) != 1) {
        fclose(f);
        return 1;
    }

    printf("registro %d (o 3o da lista) = id %d, pontos %ld\\n",
           indice + 1, r.id, r.pontos);
    fclose(f);
    return 0;
}`,
        solucao_obs: 'Chave do acesso aleatório: registros de tamanho fixo e a conta N × sizeof. Valide o índice antes de pagar o fseek em produção.',
      },
    ],
    quiz: [
      {
        pergunta: 'O que <code>fopen("dados.bin", "rb")</code> devolve em caso de sucesso?',
        opcoes: [
          'O endereço do primeiro byte do arquivo',
          'Um ponteiro FILE *',
          'Um inteiro positivo',
          'Um novo arquivo vazio',
        ],
        correta: 1,
        explicacao: 'fopen devolve um <code>FILE *</code> que representa o arquivo aberto; em falha, devolve NULL.',
      },
      {
        pergunta: 'Qual modo de abertura apaga o arquivo que já existia antes de começar a escrever?',
        opcoes: ['"r"', '"w"', '"a"', '"r+"'],
        correta: 1,
        explicacao: '<code>"w"</code> trunca (apaga) o arquivo existente. <code>"a"</code> preserva e anexa no fim.',
      },
      {
        pergunta: 'O que <code>fgets</code> faz com a quebra de linha da entrada?',
        opcoes: [
          'Remove automaticamente',
          'Conserva o \\n no buffer',
          'Deixa o buffer sem \\0',
          'Transforma em espaço',
        ],
        correta: 1,
        explicacao: 'fgets lê até o \\n inclusive e o guarda no buffer — por isso tiramos o \\n quando não o queremos.',
      },
      {
        pergunta: 'No loop <code>while (fgets(buf, n, f) != NULL)</code>, como descobrimos que o arquivo acabou?',
        opcoes: [
          'feof(f) retorna 1 dentro do loop',
          'fgets devolve NULL',
          'fclose retorna 1',
          'O compilador avisa com um warning',
        ],
        correta: 1,
        explicacao: 'O NULL de fgets é a sentinela de fim de arquivo; feof vale antes/fora do loop para diagnóstico.',
      },
      {
        pergunta: 'Por que gravar uma struct inteira com fwrite em binário pede cuidado?',
        opcoes: [
          'fwrite é lento demais para structs',
          'O padding depende da arquitetura/compilador; o formato pode não ser compatível entre máquinas',
          'structs não podem ser gravadas',
          'o arquivo fica invisível no bloco de notas',
        ],
        correta: 1,
        explicacao: 'fwrite grava bytes com padding (T2.06). Para portabilidade, grava-se campo a campo com um campo de versão.',
      },
    ],
    projeto: {
      titulo: 'Agenda de contatos binária',
      descricao:
        'Construa uma agenda persistente em <code>agenda.bin</code> com a struct Contato (nome, telefone, idade) gravada via <code>fwrite</code>. O programa abre o arquivo (cria se não existir), lê os registros existentes com <code>fread</code> para um vetor em memória e apresenta um menu: (1) adicionar contato, (2) listar todos, (3) buscar por posição (índice) usando <code>fseek</code> sem ler os anteriores, (4) sair — reescrevendo o vetor inteiro com fwrite antes de fechar.',
      criterios: [
        'Leitura inicial e gravação final sempre via fwrite/fread sobre a mesma struct; nada de texto.',
        'Adicionar respeita um teto definido por você (ex.: 100 contatos) com mensagem clara.',
        'Buscar por posição usa fseek com N * sizeof(Contato) e confirma o resultado; índice fora do intervalo é tratado.',
        'Todos os fopen conferem NULL e todos os fclose conferem o retorno.',
        'Compila com gcc -Wall -Wextra -std=c11 sem avisos e trabalha com o arquivo na pasta atual.',
      ],
    },
  },
  {
    trilha: '2',
    numero: '14',
    titulo: 'Funções variádicas: va_list',
    subtitulo: '<stdarg.h>, ... , va_start/va_arg/va_end, promoções e a família v*',
    objetivo:
      'Escrever suas próprias funções de número variável de argumentos — como o printf — usando <stdarg.h>; entender as promoções de argumento padrão (char→int, float→double) e reutilizar format strings com segurança através de vprintf, vfprintf e vsnprintf.',
    prerequisitos: 'T2.13',
    duracao: '~40 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulo 25 (Variadic Functions)',
      king: 'Capítulo 21 (The Standard Library, seção de argumentos variáveis)',
      foco:
        'No Beej, leia a seção de variadic functions com va_start/va_arg/va_end e a tabela de promoções. No King, o contexto de printf/scanf mostra onde nascem os argumentos variáveis na biblioteca padrão.',
    },
    secoes: [
      {
        titulo: 'O problema: número variável de argumentos',
        rotulo: 'por-que.c',
        paragrafos: [
          '<code>printf</code> é o caso da vida: às vezes imprime 1 valor, às vezes 5, às vezes 100. Assinaturas rígidas como <code>f(int, int)</code> não cobrem isso. A resposta do C são as <strong>funções variádicas</strong>: uma função que aceita uma quantidade variável de argumentos, declarada com reticências <code>...</code> no fim.',
          'O suporte fica em <code>&lt;stdarg.h&gt;</code>. A partir deste módulo, o <code>printf</code> deixa de ser caixa preta — e você ganha o poder de fazer os seus próprios.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    printf("printf com 1 argumento\\n");
    printf("com 2 argumentos: x=%d\\n", 7);
    printf("com 3 argumentos: %d + %d = %d\\n", 2, 3, 5);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 por-que.c -o por-que
> .\\por-que.exe

printf com 1 argumento
com 2 argumentos: x=7
com 3 argumentos: 2 + 3 = 5`,
      },
      {
        titulo: 'Anatomia: va_list, va_start, va_arg, va_end',
        rotulo: 'soma-variadica.c',
        paragrafos: [
          'Uma função variádica tem pelo menos um parâmetro <strong>fixo</strong> e as reticências: <code>int soma(int n, ...)</code>. Dentro dela o ritual tem quatro passos: (1) declarar uma <code>va_list ap</code>; (2) <code>va_start(ap, n)</code> — "a lista começa logo depois do parâmetro fixo n"; (3) a cada <code>va_arg(ap, int)</code>, o próximo argumento é devolvido já no tipo pedido; (4) <code>va_end(ap)</code> no fim — obrigatório, ele limpa o estado interno.',
          'O tipo que você pede em <code>va_arg</code> precisa bater com o argumento <em>de verdade</em>; e a quantidade fica por sua conta — o parâmetro fixo normalmente carrega a contagem. Errar o tipo ou a contagem é comportamento indefinido.',
        ],
        codigo: `#include <stdio.h>
#include <stdarg.h>

int soma(int n, ...)
{
    va_list ap;
    va_start(ap, n);

    int total = 0;
    for (int i = 0; i < n; i++) {
        total += va_arg(ap, int);
    }

    va_end(ap);
    return total;
}

int main(void)
{
    printf("soma(3, 10, 20, 30) = %d\\n", soma(3, 10, 20, 30));
    printf("soma(5, 1..5)       = %d\\n", soma(5, 1, 2, 3, 4, 5));
    printf("soma(0)             = %d\\n", soma(0));
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 soma-variadica.c -o soma
> .\\soma.exe

soma(3, 10, 20, 30) = 60
soma(5, 1..5)       = 15
soma(0)             = 0`,
      },
      {
        titulo: 'Promoções de argumento padrão',
        rotulo: 'promocoes.c',
        paragrafos: [
          'Antes de chegar a uma função variádica, cada argumento passa pelas <strong>default argument promotions</strong>: <code>char</code>, <code>short</code> e enum sobem para <code>int</code>; <code>float</code> sobe para <code>double</code>. Nenhum argumento "chega float" — ele vira double na viagem.',
          'Consequência prática: <code>va_arg(ap, float)</code> é <strong>sempre errado</strong>. Se o argumento era float, chegou double; é o double que você pede. (Não rodamos esse UB de propósito: basta saber que ler float onde existe double é lixo.) O exemplo lê corretamente os dois casos: ints promovidos e doubles.',
        ],
        codigo: `#include <stdio.h>
#include <stdarg.h>

void mostrar_promovidos(int n, ...)
{
    va_list ap;
    va_start(ap, n);
    for (int i = 0; i < n; i++) {
        int v = va_arg(ap, int);
        printf("arg %d promovido a int: %d\\n", i, v);
    }
    va_end(ap);
}

void mostrar_doubles(int n, ...)
{
    va_list ap;
    va_start(ap, n);
    for (int i = 0; i < n; i++) {
        double v = va_arg(ap, double);
        printf("arg %d chega como double: %.3f\\n", i, v);
    }
    va_end(ap);
}

int main(void)
{
    char c = 'A';
    short s = 300;

    mostrar_promovidos(3, c, s, 42);
    mostrar_doubles(2, 1.5f, 2.75f);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 promocoes.c -o promocoes
> .\\promocoes.exe

arg 0 promovido a int: 65
arg 1 promovido a int: 300
arg 2 promovido a int: 42
arg 0 chega como double: 1.500
arg 1 chega como double: 2.750

(o char 'A' chegou como 65; o short 300, como 300; os floats chegaram como double)`,
      },
      {
        titulo: 'A família v*: format strings reutilizáveis',
        rotulo: 'vlog.c',
        paragrafos: [
          'Com uma <code>va_list</code> pronta, dá para <em>formatar</em> reusando o motor do printf: <code>vprintf</code> (stdout), <code>vfprintf</code> (um <code>FILE *</code>) e <code>vsnprintf</code> (um buffer, com limite). Elas recebem a va_list "no lugar das reticências".',
          'O padrão de ouro: sua função variádica recebe o formato, chama <code>va_start</code> e entrega a lista para a versão <code>v*</code> — um único ponto centralizado de formatação, em vez de repetir format string a cada chamada.',
        ],
        codigo: `#include <stdio.h>
#include <stdarg.h>

void log_event(const char *nivel, const char *fmt, ...)
{
    FILE *f = fopen("eventos.log", "a");
    if (f == NULL) {
        return;
    }

    fprintf(f, "[%s] ", nivel);
    va_list ap;
    va_start(ap, fmt);
    vfprintf(f, fmt, ap);
    va_end(ap);
    fprintf(f, "\\n");
    fclose(f);
}

int main(void)
{
    log_event("INFO", "inicio do programa");
    log_event("ERRO", "operacao %d falhou na etapa %d", 7, 2);
    log_event("INFO", "concluido com %d itens", 42);

    FILE *f = fopen("eventos.log", "r");
    if (f == NULL) {
        return 1;
    }
    char linha[256];
    while (fgets(linha, sizeof linha, f) != NULL) {
        printf("%s", linha);
    }
    fclose(f);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 vlog.c -o vlog
> .\\vlog.exe

[INFO] inicio do programa
[ERRO] operacao 7 falhou na etapa 2
[INFO] concluido com 42 itens

(o log é aberto em modo append: rode o exe de novo e o arquivo eventos.log ganha mais 3 linhas)`,
      },
      {
        titulo: 'Armadilhas e segurança',
        rotulo: 'format-perigo.c',
        paragrafos: [
          'Regra número um: em <code>va_arg</code>, peça exatamente o tipo que chegou após as promoções — erro aí é comportamento indefinido. Regra número dois: quem garante que a quantidade de argumentos bate com o formato é <strong>você</strong>; nada impede ninguém de mandar <code>%s</code> sem a string.',
          'A armadilha mais grave é deixar o <strong>usuário controlar a format string</strong>: <code>printf(entrada_do_usuario)</code>. Um usuário malicioso injeta <code>%x</code> para vazar memória do stack ou <code>%n</code> para <em>escrever</em> na memória — é a origem da classe de vulnerabilidades de format strings, estudada a fundo na <strong>Trilha 4</strong>. A forma correta é sempre formatar com formato fixo e passar o texto como dado: <code>printf("%s", entrada)</code>.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    char buf[128];

    printf("Escreva algo: ");
    if (fgets(buf, sizeof buf, stdin) == NULL) {
        return 1;
    }

    printf(buf);          /* PERIGOSO: usuario controla a format string */
    printf("%s", buf);    /* seguro: a string vira dado, nao formato */
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 format-perigo.c -o format-perigo
> echo oi | .\\format-perigo.exe

Escreva algo: oi
oi

(com entrada benigna as duas impressoes coincidem. Troque o input por "%x %x %x %x": a primeira impressao despeja lixo da pilha/registradores; "%n" escreve na memoria. E a Trilha 4.)`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Escreva <code>int soma(int n, ...)</code> e use-a para somar 4 números (1, 2, 3, 4) e 6 números (5, 10, 15, 20, 25, 30). Imprima os dois resultados.',
        dica: 'Parâmetro fixo n + va_start, laço com va_arg(ap, int) e va_end.',
        solucao: `#include <stdio.h>
#include <stdarg.h>

int soma(int n, ...)
{
    va_list ap;
    va_start(ap, n);

    int total = 0;
    for (int i = 0; i < n; i++) {
        total += va_arg(ap, int);
    }

    va_end(ap);
    return total;
}

int main(void)
{
    int r1 = soma(4, 1, 2, 3, 4);
    int r2 = soma(6, 5, 10, 15, 20, 25, 30);

    printf("soma(1, 2, 3, 4)         = %d\\n", r1);
    printf("soma(5, 10, 15, 20, 25, 30) = %d\\n", r2);
    return 0;
}`,
        solucao_obs: 'Esperado 10 e 105.',
      },
      {
        nivel: 2,
        enunciado:
          'Escreva <code>int maximo(int n, ...)</code> que devolve o maior entre n inteiros. Teste com (7, 12, 4, 9), com os negativos (-5, -2, -9) e com um único 42.',
        dica: 'Comece o máximo com o primeiro va_arg e compare os demais. Sua API deve exigir n ≥ 1.',
        solucao: `#include <stdio.h>
#include <stdarg.h>

int maximo(int n, ...)
{
    va_list ap;
    va_start(ap, n);

    int m = va_arg(ap, int);
    for (int i = 1; i < n; i++) {
        int x = va_arg(ap, int);
        if (x > m) {
            m = x;
        }
    }

    va_end(ap);
    return m;
}

int main(void)
{
    printf("maximo(4, 7, 12, 4, 9)   = %d\\n", maximo(4, 7, 12, 4, 9));
    printf("maximo(3, -5, -2, -9)    = %d\\n", maximo(3, -5, -2, -9));
    printf("maximo(1, 42)            = %d\\n", maximo(1, 42));
    return 0;
}`,
        solucao_obs: 'Esperado 12, -2 e 42.',
      },
      {
        nivel: 3,
        enunciado:
          'Crie <code>void log_format(const char *nivel, const char *fmt, ...)</code> que abre <code>log.txt</code> em modo <code>"a"</code> e grava uma linha com hora atual (<code>time.h</code>), o nível e a mensagem formatada por <code>vfprintf</code>. Registre um INFO, um WARN e um ERRO e depois imprima o log.',
        dica: 'Monte o tempo com <code>time(NULL)</code> + <code>localtime</code> + <code>strftime</code>; o "charme" da v* é o vfprintf.',
        solucao: `#include <stdio.h>
#include <stdarg.h>
#include <time.h>

void log_format(const char *nivel, const char *fmt, ...)
{
    FILE *f = fopen("log.txt", "a");
    if (f == NULL) {
        return;
    }

    time_t agora = time(NULL);
    struct tm *info = localtime(&agora);
    char tempo[32];
    strftime(tempo, sizeof tempo, "%Y-%m-%d %H:%M:%S", info);

    fprintf(f, "%s [%s] ", tempo, nivel);

    va_list ap;
    va_start(ap, fmt);
    vfprintf(f, fmt, ap);
    va_end(ap);

    fprintf(f, "\\n");
    fclose(f);
}

int main(void)
{
    log_format("INFO", "configuracoes carregadas");
    log_format("WARN", "valor %d acima do limite %d", 150, 100);
    log_format("ERRO", "arquivo \\"%s\\" nao encontrado", "dados.conf");

    FILE *f = fopen("log.txt", "r");
    if (f == NULL) {
        return 1;
    }
    char linha[256];
    while (fgets(linha, sizeof linha, f) != NULL) {
        printf("log: %s", linha);
    }
    fclose(f);
    return 0;
}`,
        solucao_obs: 'O timestamp muda a cada execução — é a hora real da gravação. O resto do texto você controla pelo formato.',
      },
      {
        nivel: 3,
        enunciado:
          'Implemente <code>char *formatar(const char *fmt, ...)</code> que produz o texto num buffer <strong>alocado no heap</strong> com duas passadas de <code>vsnprintf</code>: a primeira com tamanho 0 só para descobrir o tamanho (o retorno), a segunda para escrever de verdade. Teste com "<code>%s tem %d anos</code>" e "<code>media %.2f de %d provas</code>".',
        dica: '<code>vsnprintf(NULL, 0, fmt, ap)</code> devolve quantos bytes seriam necessários. Use <code>va_copy</code> quando precisar da lista mais de uma vez.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>

char *formatar(const char *fmt, ...)
{
    va_list ap, ap2;

    va_start(ap, fmt);
    va_copy(ap2, ap);
    int tam = vsnprintf(NULL, 0, fmt, ap);
    va_end(ap);

    if (tam < 0) {
        va_end(ap2);
        return NULL;
    }

    char *buf = malloc((size_t)tam + 1);
    if (buf == NULL) {
        va_end(ap2);
        return NULL;
    }

    vsnprintf(buf, (size_t)tam + 1, fmt, ap2);
    va_end(ap2);
    return buf;
}

int main(void)
{
    char *s1 = formatar("%s tem %d anos", "Leo", 23);
    char *s2 = formatar("media %.2f de %d provas", 8.75, 4);

    if (s1 != NULL) {
        printf("%s\\n", s1);
        free(s1);
    }
    if (s2 != NULL) {
        printf("%s\\n", s2);
        free(s2);
    }
    return 0;
}`,
        solucao_obs: 'O retorno de vsnprintf é o tamanho que seria escrito, mesmo com truncamento; aloque esse valor + 1 para o \\0. A memória é sua: free depois.',
      },
      {
        nivel: 4,
        enunciado:
          'Escreva <code>char *juntar(int n, const char *sep, ...)</code> que concatena n strings com <code>sep</code> entre elas, usando <code>vsnprintf</code> em duas passadas: construa uma format string com <code>%s</code> e separadores, meça com <code>vsnprintf(NULL, 0, ...)</code> e depois escreva. Ex.: <code>juntar(4, " - ", "azul","verde","amarelo","vermelho")</code> deve dar "azul - verde - amarelo - vermelho".',
        dica: 'Construa fmt como "%s - %s - %s - %s" a partir de sep e n, depois rode vsnprintf duas vezes recomeçando o va_start.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>

char *juntar(int n, const char *sep, ...)
{
    size_t fmt_cap = 2 + (size_t)(n > 0 ? (n - 1) : 0) * (strlen(sep) + 2);
    char *fmt = malloc(fmt_cap + 1);
    if (fmt == NULL) {
        return NULL;
    }

    int p = 0;
    for (int i = 0; i < n; i++) {
        p += snprintf(fmt + p, fmt_cap + 1 - (size_t)p,
                      i > 0 ? "%s%%s" : "%%s", i > 0 ? sep : "");
    }

    va_list ap;
    va_start(ap, sep);
    int tam = vsnprintf(NULL, 0, fmt, ap);
    va_end(ap);

    char *buf = NULL;
    if (tam >= 0) {
        buf = malloc((size_t)tam + 1);
        if (buf != NULL) {
            va_start(ap, sep);
            vsnprintf(buf, (size_t)tam + 1, fmt, ap);
            va_end(ap);
        }
    }

    free(fmt);
    return buf;
}

int main(void)
{
    char *j = juntar(4, " - ", "azul", "verde", "amarelo", "vermelho");
    if (j != NULL) {
        printf("%s\\n", j);
        free(j);
    }

    j = juntar(3, ",", "a", "b", "c");
    if (j != NULL) {
        printf("%s\\n", j);
        free(j);
    }
    return 0;
}`,
        solucao_obs: 'Não confie que a libc avance a sua va_list entre chamadas de vsnprintf — por isso as duas passadas recomeçam com va_start (ou va_copy).',
      },
    ],
    quiz: [
      {
        pergunta: 'O que as reticências <code>...</code> indicam na declaração de uma função?',
        opcoes: [
          'Que a função nunca termina',
          'Que a função aceita um número variável de argumentos',
          'Que a função é uma variável global',
          'Um erro de sintaxe',
        ],
        correta: 1,
        explicacao: 'As reticências marcam a parte variável da lista de parâmetros — o mecanismo do printf.',
      },
      {
        pergunta: 'Qual tipo de argumento chega como <code>double</code> a uma função variádica?',
        opcoes: ['float', 'double', 'long double', 'char'],
        correta: 0,
        explicacao: 'Pelas default argument promotions, float é promovido a double — por isso va_arg(ap, float) é sempre errado.',
      },
      {
        pergunta: 'O que faz <code>va_arg(ap, int)</code>?',
        opcoes: [
          'Declara ap',
          'Devolve o próximo argumento, já tratado como int',
          'Termina a lista',
          'Reinicia a lista do início',
        ],
        correta: 1,
        explicacao: 'Cada chamada a va_arg consome e devolve o próximo argumento variádico no tipo pedido.',
      },
      {
        pergunta: 'Por que <code>va_arg(ap, float)</code> é errado?',
        opcoes: [
          'float ocupa apenas 2 bytes',
          'o float chega promovido a double; ler float é comportamento indefinido',
          'va_arg só aceita int',
          'o compilador não conhece float',
        ],
        correta: 1,
        explicacao: 'Promoção padrão: char/short→int, float→double. O tipo lido deve ser o tipo após a promoção.',
      },
      {
        pergunta: 'Qual chamada é perigosa (format string controlada pelo usuário)?',
        opcoes: ['printf("%s", buf)', 'printf(buf)', 'puts(buf)', 'fputs(buf, stdout)'],
        correta: 1,
        explicacao: 'printf(buf) interpreta o texto do usuário como formato — vetor de vazamento (%x) e escrita (%n). Sempre use printf("%s", buf).',
      },
    ],
    projeto: {
      titulo: 'Mini-biblioteca de logging',
      descricao:
        'Implemente <code>log.h</code>/<code>log.c</code> e um <code>main.c</code> de teste. A biblioteca expõe <code>void log_msg(int nivel, const char *fmt, ...)</code> com níveis ERROR/WARN/INFO via enum; a função grava em <code>app.log</code> uma linha com timestamp (<code>time.h</code>), o texto do nível e a mensagem formatada por <code>vfprintf</code>. Suporte também um limiar configurável: mensagens de nível abaixo do mínimo são descartadas.',
      criterios: [
        'log.h com include guard (T2.08) e log.c com a implementação real de log_msg.',
        'Níveis ERROR/WARN/INFO via enum; a linha impressa traz o nome do nível por extenso.',
        'Timestamp com time.h (strftime) no formato "YYYY-MM-DD HH:MM:SS".',
        'Limiar configurável (ex.: log_set_level) — nível abaixo do limiar não grava.',
        'Várias execuções anexam ao mesmo app.log sem corromper nada (modo "a" + fclose conferido).',
        'Compila com gcc -Wall -Wextra -std=c11 log.c main.c -o app sem avisos.',
      ],
    },
  },
  {
    trilha: '2',
    numero: '15',
    titulo: 'Estruturas de dados fundamentais',
    subtitulo: 'pilha/fila, busca linear e binária, ordenação, hash table e big-O',
    objetivo:
      'Montar as estruturas que sustentam sistemas de verdade: pilha e fila sobre array, busca linear vs binária, ordenação com contadores de passos (bubble, insertion), hash table com encadeamento — e ganhar intuição prática de big-O para escolher a estrutura certa para cada problema.',
    prerequisitos: 'T2.05 e T2.12',
    duracao: '~40 min',
    nivel: 'Intermediário',
    leitura: {
      beej: 'Capítulos 5–6 (arrays e ponteiros) para revisar o substrato das implementações',
      king: 'Capítulos 8–9 (arrays e funções) e 17 (ponteiros avançados e estruturas)',
      foco:
        'No King, use os capítulos 8–9 como referência de arrays/funções e o 17 para as structs dinâmicas. Os algoritmos de busca e ordenação não estão no livro — implemente-os nos exercícios deste módulo.',
    },
    secoes: [
      {
        titulo: 'Pilha e fila sobre array',
        rotulo: 'pilha-array.c',
        paragrafos: [
          'No T2.12 você viu pilha e fila sobre <em>lista encadeada</em>. A mesma lógica vive sobre um <strong>array dinâmico</strong>: a pilha guarda um índice <code>topo</code> (o próximo lugar livre) e a posição 0 é o fundo; a fila de tamanho fixo usa a <em>fila circular</em> — índices <code>ini</code> e <code>cont</code> que "dão a volta" no array com <code>%</code>.',
          'Vetor ganha em cache e acesso O(1) por índice; lista encadeada ganha quando o tamanho é imprevisível e há remoção no meio. Veja a pilha com array abaixo; a fila circular fica para você no exercício.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *dados;
    int topo;
    int cap;
} Pilha;

int pilha_inicia(Pilha *p, int cap)
{
    p->dados = malloc((size_t)cap * sizeof *p->dados);
    if (p->dados == NULL) {
        return 0;
    }
    p->topo = 0;
    p->cap = cap;
    return 1;
}

int pilha_vazia(const Pilha *p) { return p->topo == 0; }
int pilha_cheia(const Pilha *p) { return p->topo == p->cap; }

int empilhar(Pilha *p, int v)
{
    if (pilha_cheia(p)) {
        return 0;
    }
    p->dados[p->topo++] = v;
    return 1;
}

int desempilhar(Pilha *p, int *saida)
{
    if (pilha_vazia(p)) {
        return 0;
    }
    *saida = p->dados[--p->topo];
    return 1;
}

int topo(const Pilha *p, int *saida)
{
    if (pilha_vazia(p)) {
        return 0;
    }
    *saida = p->dados[p->topo - 1];
    return 1;
}

void pilha_destroi(Pilha *p)
{
    free(p->dados);
    p->dados = NULL;
    p->topo = 0;
    p->cap = 0;
}

int main(void)
{
    Pilha p;
    if (!pilha_inicia(&p, 4)) {
        return 1;
    }

    empilhar(&p, 10);
    empilhar(&p, 20);
    empilhar(&p, 30);

    int v;
    topo(&p, &v);
    printf("topo sem remover: %d\\n", v);

    while (desempilhar(&p, &v)) {
        printf("desempilhou: %d\\n", v);
    }
    printf("vazia? %s\\n", pilha_vazia(&p) ? "sim" : "nao");

    pilha_destroi(&p);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 pilha-array.c -o pilha
> .\\pilha.exe

topo sem remover: 30
desempilhou: 30
desempilhou: 20
desempilhou: 10
vazia? sim`,
      },
      {
        titulo: 'Busca: linear vs binária',
        rotulo: 'busca.c',
        paragrafos: [
          '<strong>Busca linear</strong> anda do início ao fim sem assumir nada: funciona até em array desordenado, mas custa até n passos. <strong>Busca binária</strong> exige array <strong>ordenado</strong>: compara com o elemento do meio e descarta metade do array a cada passo — custa cerca de log2(n) passos.',
          'Regra prática: poucos elementos ou dados desordenados → linear (simples e sem custo de ordenação prévia); dados já ordenados e muitos elementos → binária.',
        ],
        codigo: `#include <stdio.h>

int busca_linear(const int v[], int n, int alvo)
{
    int passos = 0;
    for (int i = 0; i < n; i++) {
        passos++;
        if (v[i] == alvo) {
            printf("linear: %d no indice %d em %d passos\\n", alvo, i, passos);
            return i;
        }
    }
    printf("linear: %d nao existe (levou %d passos)\\n", alvo, passos);
    return -1;
}

int busca_binaria(const int v[], int n, int alvo, int *passos)
{
    int ini = 0, fim = n - 1;
    *passos = 0;
    while (ini <= fim) {
        (*passos)++;
        int meio = ini + (fim - ini) / 2;
        if (v[meio] == alvo) {
            return meio;
        }
        if (v[meio] < alvo) {
            ini = meio + 1;
        } else {
            fim = meio - 1;
        }
    }
    return -1;
}

int main(void)
{
    int v[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = 10;
    int passos;

    busca_linear(v, n, 23);
    int idx = busca_binaria(v, n, 23, &passos);
    printf("binaria: %d no indice %d em %d passos\\n", 23, idx, passos);

    busca_linear(v, n, 100);
    idx = busca_binaria(v, n, 100, &passos);
    printf("binaria: %d nao existe (levou %d passos)\\n", 100, passos);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 busca.c -o busca
> .\\busca.exe

linear: 23 no indice 5 em 6 passos
binaria: 23 no indice 5 em 3 passos
linear: 100 nao existe (levou 10 passos)
binaria: 100 nao existe (levou 4 passos)`,
      },
      {
        titulo: 'Ordenação: bubble (didático) e insertion vs comparação por contadores',
        rotulo: 'bubble.c',
        paragrafos: [
          '<strong>Bubble sort</strong> é puramente didático: compara vizinhos e troca se estiverem fora de ordem, "empurrando" o maior para o fim a cada passada. O <strong>insertion sort</strong> constrói uma metade ordenada à esquerda e encaixa cada novo elemento no lugar — bom para arrays pequenos e quase ordenados.',
          'A forma de <em>medir</em> um algoritmo nesta fase é contar: quantas comparações e quantas trocas ele fez? A saída abaixo traz os números reais do bubble sobre 6 elementos — guarde essas contagens na cabeça para a seção de big-O.',
        ],
        codigo: `#include <stdio.h>

void imprimir(const int v[], int n)
{
    for (int i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
}

int main(void)
{
    int v[] = {7, 2, 9, 4, 3, 8};
    int n = 6;
    int comparacoes = 0;
    int trocas = 0;

    printf("original: ");
    imprimir(v, n);

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            comparacoes++;
            if (v[j] > v[j + 1]) {
                int tmp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = tmp;
                trocas++;
            }
        }
        printf("apos passada %d: ", i + 1);
        imprimir(v, n);
    }

    printf("comparacoes=%d trocas=%d\\n", comparacoes, trocas);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 bubble.c -o bubble
> .\\bubble.exe

original: 7 2 9 4 3 8 
apos passada 1: 2 7 4 3 8 9 
apos passada 2: 2 4 3 7 8 9 
apos passada 3: 2 3 4 7 8 9 
apos passada 4: 2 3 4 7 8 9 
apos passada 5: 2 3 4 7 8 9 
comparacoes=15 trocas=7

(15 = n·(n-1)/2 com n=6: o bubble sempre faz o pior número de comparações)`,
      },
      {
        titulo: 'Hash table simples: encadeamento separado',
        rotulo: 'hash.c',
        paragrafos: [
          'Uma <strong>hash table</strong> usa uma função hash para converter a chave em um índice de array e guarda o dado lá. Colisões (duas chaves caindo no mesmo índice) são resolvidas com <strong>encadeamento separado</strong>: cada posição guarda uma lista encadeada de chaves. Inserir, buscar e remover ficam O(1) na média.',
          'O custo de verdade depende da <em>qualidade da função hash</em> e do tamanho da tabela. Abaixo usamos a clássica djb2 sobre strings — simples e suficiente para aprender.',
        ],
        codigo: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TAM 5

typedef struct No {
    char *palavra;
    struct No *proximo;
} No;

typedef struct {
    No *buckets[TAM];
} Hash;

unsigned hash_djb2(const char *s)
{
    unsigned h = 5381;
    for (const unsigned char *p = (const unsigned char *)s; *p; p++) {
        h = h * 33u + *p;
    }
    return h;
}

void hash_inserir(Hash *ht, const char *s)
{
    unsigned idx = hash_djb2(s) % TAM;

    No *novo = malloc(sizeof *novo);
    if (novo == NULL) {
        return;
    }
    novo->palavra = malloc(strlen(s) + 1);
    if (novo->palavra == NULL) {
        free(novo);
        return;
    }
    strcpy(novo->palavra, s);
    novo->proximo = ht->buckets[idx];
    ht->buckets[idx] = novo;
}

int hash_buscar(const Hash *ht, const char *s)
{
    unsigned idx = hash_djb2(s) % TAM;
    for (const No *p = ht->buckets[idx]; p != NULL; p = p->proximo) {
        if (strcmp(p->palavra, s) == 0) {
            return 1;
        }
    }
    return 0;
}

void hash_destroi(Hash *ht)
{
    for (int i = 0; i < TAM; i++) {
        No *atual = ht->buckets[i];
        while (atual != NULL) {
            No *prox = atual->proximo;
            free(atual->palavra);
            free(atual);
            atual = prox;
        }
        ht->buckets[i] = NULL;
    }
}

int main(void)
{
    Hash ht = {{NULL}};
    const char *palavras[] = {
        "gato", "cachorro", "peixe", "passaro",
        "cobra", "gato", "tartaruga"
    };
    int n = 7;

    for (int i = 0; i < n; i++) {
        hash_inserir(&ht, palavras[i]);
    }

    for (int i = 0; i < TAM; i++) {
        int cont = 0;
        for (const No *p = ht.buckets[i]; p != NULL; p = p->proximo) {
            cont++;
        }
        printf("bucket %d: %d itens\\n", i, cont);
    }

    printf("buscar 'peixe': %s\\n", hash_buscar(&ht, "peixe") ? "achou" : "nao achou");
    printf("buscar 'leao':  %s\\n", hash_buscar(&ht, "leao") ? "achou" : "nao achou");

    hash_destroi(&ht);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 hash.c -o hash
> .\\hash.exe

bucket 0: 0 itens
bucket 1: 1 itens
bucket 2: 1 itens
bucket 3: 4 itens
bucket 4: 1 itens
buscar 'peixe': achou
buscar 'leao':  nao achou

(4 das 7 chaves caíram no bucket 3: hash simples + tabela pequena. O encadeamento resolveu; uma hash melhor distribuiria melhor.)`,
      },
      {
        titulo: 'Big-O em palavras simples',
        rotulo: 'big-o',
        paragrafos: [
          'Big-O descreve como o trabalho cresce quando a entrada cresce — "o que domina". Não é sobre segundos, é sobre <em>escala</em>:',
        ],
        lista: [
          '<code>O(1)</code> — trabalho constante: acessar <code>arr[i]</code>, push/pop de pilha, ler um registro com fseek.',
          '<code>O(log n)</code> — divide o problema pela metade a cada passo: busca binária.',
          '<code>O(n)</code> — uma passada: percorrer um array, busca linear.',
          '<code>O(n log n)</code> — ordenar bem feito (merge sort, qsort da stdlib).',
          '<code>O(n²)</code> — loops aninhados sobre tudo: bubble/insertion no pior caso.',
          'Regra de bolso: identifique o trecho que domina. Busca binária em array ordenado vence uma hash de má qualidade; e nunca subestime o <strong>custo de inserir/remover no meio</strong>.',
        ],
      },
      {
        titulo: 'Teste de contadores na prática',
        rotulo: 'medir.c',
        paragrafos: [
          'Fechando: um experimento que junta as peças — ordenar com bubble contando comparações e trocas, depois buscar binariamente contando passos. Os números saem do próprio programa, que é a sua "medição mental" com valores reais.',
        ],
        codigo: `#include <stdio.h>

void imprimir(const int v[], int n)
{
    for (int i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
}

int main(void)
{
    int v[] = {5, 1, 4, 2, 3, 0};
    int n = 6;
    int comp = 0;
    int trocas = 0;

    printf("antes : ");
    imprimir(v, n);

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            comp++;
            if (v[j] > v[j + 1]) {
                int tmp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = tmp;
                trocas++;
            }
        }
    }
    printf("depois: ");
    imprimir(v, n);
    printf("bubble: %d comparacoes, %d trocas\\n", comp, trocas);

    int passos = 0;
    int alvo = 3;
    int ini = 0, fim = n - 1, achado = -1;
    while (ini <= fim) {
        passos++;
        int meio = ini + (fim - ini) / 2;
        if (v[meio] == alvo) {
            achado = meio;
            break;
        }
        if (v[meio] < alvo) {
            ini = meio + 1;
        } else {
            fim = meio - 1;
        }
    }
    printf("busca binaria por %d: indice %d em %d passos\\n", alvo, achado, passos);
    return 0;
}`,
        saida: `> gcc -Wall -Wextra -std=c11 medir.c -o medir
> .\\medir.exe

antes : 5 1 4 2 3 0 
depois: 0 1 2 3 4 5 
bubble: 15 comparacoes, 11 trocas
busca binaria por 3: indice 3 em 3 passos`,
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Implemente a pilha com array dinâmico que <strong>cresce sozinha</strong> — dobre a capacidade com realloc quando lotar — com <code>push</code>, <code>pop</code>, <code>is_empty</code> e <code>peek</code>. Empilhe 10, 20, ..., 60 e imprima a capacidade a cada empilhada.',
        dica: 'Comece com cap 2; o realloc pode mover o bloco, então atualize o ponteiro e a capacidade ao mesmo tempo.',
        solucao: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *dados;
    int topo;
    int cap;
} Pilha;

int pilha_inicia(Pilha *p)
{
    p->cap = 2;
    p->topo = 0;
    p->dados = malloc((size_t)p->cap * sizeof *p->dados);
    return p->dados != NULL;
}

int pilha_vazia(const Pilha *p) { return p->topo == 0; }

int empilhar(Pilha *p, int v)
{
    if (p->topo == p->cap) {
        int novo_cap = p->cap * 2;
        int *novo = realloc(p->dados, (size_t)novo_cap * sizeof *novo);
        if (novo == NULL) {
            return 0;
        }
        p->dados = novo;
        p->cap = novo_cap;
    }
    p->dados[p->topo++] = v;
    return 1;
}

int desempilhar(Pilha *p, int *out)
{
    if (pilha_vazia(p)) {
        return 0;
    }
    *out = p->dados[--p->topo];
    return 1;
}

int espiar(const Pilha *p, int *out)
{
    if (pilha_vazia(p)) {
        return 0;
    }
    *out = p->dados[p->topo - 1];
    return 1;
}

int main(void)
{
    Pilha p;
    if (!pilha_inicia(&p)) {
        return 1;
    }

    for (int i = 10; i <= 60; i += 10) {
        if (empilhar(&p, i)) {
            printf("empilhou %d (cap %d)\\n", i, p.cap);
        } else {
            printf("falha ao empilhar %d\\n", i);
        }
    }

    int v;
    if (espiar(&p, &v)) {
        printf("espiar (topo): %d\\n", v);
    }

    while (desempilhar(&p, &v)) {
        printf("desempilhou %d\\n", v);
    }
    printf("vazia? %s\\n", pilha_vazia(&p) ? "sim" : "nao");

    free(p.dados);
    return 0;
}`,
        solucao_obs: 'A capacidade dobra 2 → 4 → 8 conforme o topo encosta no limite; isso é a "pilha que cresce".',
      },
      {
        nivel: 2,
        enunciado:
          'Implemente a <strong>fila circular</strong> FIFO com array de tamanho fixo <code>TAM 5</code>: campos <code>ini</code> e <code>cont</code>, e o índice do próximo buraco <code>(ini + cont) % TAM</code>. Enfileire 10..50 (deve encher), tente 60 (deve falhar), remova um, insira 70 no buraco e esvazie tudo.',
        dica: 'Remover avança <code>ini</code> com <code>%</code>; a fila "dá a volta" no array sem mover nada.',
        solucao: `#include <stdio.h>

#define TAM 5

typedef struct {
    int dados[TAM];
    int ini;
    int cont;
} Fila;

int fila_vazia(const Fila *f) { return f->cont == 0; }
int fila_cheia(const Fila *f) { return f->cont == TAM; }

int enfileirar(Fila *f, int v)
{
    if (fila_cheia(f)) {
        return 0;
    }
    int pos = (f->ini + f->cont) % TAM;
    f->dados[pos] = v;
    f->cont++;
    return 1;
}

int desenfileirar(Fila *f, int *out)
{
    if (fila_vazia(f)) {
        return 0;
    }
    *out = f->dados[f->ini];
    f->ini = (f->ini + 1) % TAM;
    f->cont--;
    return 1;
}

int main(void)
{
    Fila f = {0};

    for (int i = 1; i <= 5; i++) {
        printf("enfileirar %2d: %d\\n", i * 10, enfileirar(&f, i * 10));
    }
    printf("enfileirar 60 (cheia): %d\\n", enfileirar(&f, 60));

    int v;
    desenfileirar(&f, &v);
    printf("saiu %d\\n", v);
    printf("entrou 70 no lugar: %d\\n", enfileirar(&f, 70));

    while (desenfileirar(&f, &v)) {
        printf("saiu %d\\n", v);
    }
    return 0;
}`,
        solucao_obs: 'Saiu o 10 e entrou o 70 no mesmo espaço: essa é a vantagem da circular — nenhum dado é deslocado.',
      },
      {
        nivel: 3,
        enunciado:
          'Implemente <code>int busca_binaria_rec(int v[], int ini, int fim, int alvo)</code> <strong>recursiva</strong> que devolve o índice do alvo ou -1. Teste no array {2, 5, 8, 12, 16, 23, 38, 56, 72, 91} com os alvos 2, 16, 91, 100 e 7.',
        dica: 'Caso base: ini > fim → -1. Senão compare com o meio e desça em uma das metades.',
        solucao: `#include <stdio.h>

int busca_binaria_rec(const int v[], int ini, int fim, int alvo)
{
    if (ini > fim) {
        return -1;
    }
    int meio = ini + (fim - ini) / 2;
    if (v[meio] == alvo) {
        return meio;
    }
    if (v[meio] < alvo) {
        return busca_binaria_rec(v, meio + 1, fim, alvo);
    }
    return busca_binaria_rec(v, ini, meio - 1, alvo);
}

int main(void)
{
    int v[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int alvos[] = {2, 16, 91, 100, 7};

    for (int i = 0; i < 5; i++) {
        int idx = busca_binaria_rec(v, 0, 9, alvos[i]);
        if (idx >= 0) {
            printf("%d esta no indice %d\\n", alvos[i], idx);
        } else {
            printf("%d nao encontrado\\n", alvos[i]);
        }
    }
    return 0;
}`,
        solucao_obs: 'Esperado: índices 0, 4, 9 e os dois "nao encontrado".',
      },
      {
        nivel: 3,
        enunciado:
          'Implemente <strong>insertion sort decrescente</strong> com um contador de comparações de chave. Ordene {4, 2, 9, 1, 7, 3} do maior para o menor e imprima antes, depois e o total de comparações.',
        dica: 'Enquanto o elemento à esquerda for <em>menor</em> que a chave, desloque (no crescente, seria "maior que a chave").',
        solucao: `#include <stdio.h>

int main(void)
{
    int v[] = {4, 2, 9, 1, 7, 3};
    int n = 6;
    int comparacoes = 0;
    int deslocamentos = 0;

    printf("antes:  ");
    for (int i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");

    for (int i = 1; i < n; i++) {
        int chave = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] < chave) {
            comparacoes++;
            v[j + 1] = v[j];
            deslocamentos++;
            j--;
        }
        if (j >= 0) {
            comparacoes++;
        }
        v[j + 1] = chave;
    }

    printf("depois: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
    printf("comparacoes=%d deslocamentos=%d\\n", comparacoes, deslocamentos);
    return 0;
}`,
        solucao_obs: 'Depois: 9 7 4 3 2 1. O contador inclui a comparação final que encerra cada encaixe.',
      },
      {
        nivel: 4,
        enunciado:
          'Monte a hash table de strings com encadeamento separado (TAM 4): <code>hash_inserir</code> (evita duplicatas), <code>hash_buscar</code> e <code>hash_destroi</code> (free de cada palavra e de cada nó). Insira {sol, lua, estrela, ceu, nuvem, ar, sol, mar}, liste todos os buckets e libere tudo no fim.',
        dica: 'Na destruição, percorra cada bucket guardando o próximo nó antes do free. "sol" inserido duas vezes deve retornar 0 na segunda tentativa.',
        solucao: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TAM 4

typedef struct No {
    char *palavra;
    struct No *proximo;
} No;

typedef struct {
    No *buckets[TAM];
} Hash;

unsigned hash_fn(const char *s)
{
    unsigned h = 0;
    for (const unsigned char *p = (const unsigned char *)s; *p; p++) {
        h = h * 31u + *p;
    }
    return h;
}

int hash_inserir(Hash *ht, const char *s)
{
    unsigned idx = hash_fn(s) % TAM;

    for (const No *p = ht->buckets[idx]; p != NULL; p = p->proximo) {
        if (strcmp(p->palavra, s) == 0) {
            return 0;
        }
    }

    No *novo = malloc(sizeof *novo);
    if (novo == NULL) {
        return 0;
    }
    novo->palavra = malloc(strlen(s) + 1);
    if (novo->palavra == NULL) {
        free(novo);
        return 0;
    }
    strcpy(novo->palavra, s);
    novo->proximo = ht->buckets[idx];
    ht->buckets[idx] = novo;
    return 1;
}

int hash_buscar(const Hash *ht, const char *s)
{
    unsigned idx = hash_fn(s) % TAM;
    for (const No *p = ht->buckets[idx]; p != NULL; p = p->proximo) {
        if (strcmp(p->palavra, s) == 0) {
            return 1;
        }
    }
    return 0;
}

void hash_destroi(Hash *ht)
{
    for (int i = 0; i < TAM; i++) {
        No *atual = ht->buckets[i];
        while (atual != NULL) {
            No *prox = atual->proximo;
            free(atual->palavra);
            free(atual);
            atual = prox;
        }
        ht->buckets[i] = NULL;
    }
}

int main(void)
{
    Hash ht = {{NULL}};
    const char *palavras[] = {
        "sol", "lua", "estrela", "ceu", "nuvem", "ar", "sol", "mar"
    };
    int n = (int)(sizeof palavras / sizeof palavras[0]);

    for (int i = 0; i < n; i++) {
        printf("inserir %-8s -> %d\\n", palavras[i], hash_inserir(&ht, palavras[i]));
    }

    printf("buscar 'lua':  %s\\n", hash_buscar(&ht, "lua") ? "achou" : "nao achou");
    printf("buscar 'chao': %s\\n", hash_buscar(&ht, "chao") ? "achou" : "nao achou");

    for (int i = 0; i < TAM; i++) {
        printf("bucket %d:", i);
        for (const No *p = ht.buckets[i]; p != NULL; p = p->proximo) {
            printf(" %s", p->palavra);
        }
        printf("\\n");
    }

    hash_destroi(&ht);
    printf("memoria liberada\\n");
    return 0;
}`,
        solucao_obs: '"sol" entra uma vez (a segunda inserção retorna 0). No fim, cada palavra e cada nó ganham seu free — o padrão sem vazamento do projeto.',
      },
    ],
    quiz: [
      {
        pergunta: 'Num array ordenado com 1.000.000 de elementos, a busca binária faz no máximo...',
        opcoes: ['1.000.000 passos', 'cerca de 20 passos', 'cerca de 1.000 passos', 'nunca termina'],
        correta: 1,
        explicacao: 'log2(1.000.000) ≈ 20: cada passo descarta metade do array.',
      },
      {
        pergunta: 'O que deixa push/pop em O(1) numa pilha sobre array?',
        opcoes: [
          'uma fila circular',
          'um índice de topo (e realloc quando a capacidade acaba)',
          'uma hash table',
          'percorrer até o fim do array',
        ],
        correta: 1,
        explicacao: 'Empilhar/desempilhar mexe só no topo: O(1). O realloc ocasional amortiza o crescimento.',
      },
      {
        pergunta: 'O que distingue a busca binária da linear?',
        opcoes: [
          'a binária exige array ordenado',
          'a linear é sempre mais rápida',
          'a binária precisa de uma função hash',
          'nada: são sinônimas',
        ],
        correta: 0,
        explicacao: 'A binária compara com o meio e descarta metade a cada passo — mas só funciona em dados ordenados.',
      },
      {
        pergunta: 'Numa hash table com encadeamento separado, colisões são resolvidas...',
        opcoes: [
          'redimensionando o array a cada inserção',
          'guardando uma lista encadeada em cada bucket',
          'apagando a chave antiga',
          'lançando um erro em tempo de execução',
        ],
        correta: 1,
        explicacao: 'Quando duas chaves caem no mesmo índice, os nós entram numa lista nesse bucket; a busca caminha pela lista.',
      },
      {
        pergunta: 'Qual operação custa O(n²) no pior caso?',
        opcoes: ['acessar arr[i]', 'busca binária', 'bubble/insertion sort', 'push numa pilha'],
        correta: 2,
        explicacao: 'Bubble e insertion têm pior caso O(n²) pelos loops aninhados. Acesso por índice é O(1); binária, O(log n).',
      },
    ],
    projeto: {
      titulo: 'Minidicionário com hash table',
      descricao:
        'Construa um dicionário palavra → definição com hash table de encadeamento separado (struct no com palavra e significado). Menu: (1) inserir palavra e definição (fgets, limites respeitados), (2) buscar e imprimir a definição, (3) listar tudo bucket a bucket, (4) remover uma palavra (religando a lista e com free da palavra e do nó), (5) sair — liberando TODA a memória. Desafio extra: rode o valgrind se tiver WSL2, ou faça a auditoria manual "todo malloc × free".',
      criterios: [
        'Hash table própria (função hash + encadeamento separado): inserir, buscar e remover implementados do zero.',
        'Remoção religa a lista sem perder o restante e libera palavra + nó.',
        'Listagem reproduz a tabela bucket por bucket, na ordem das listas.',
        'Destruição total no fim da execução: zero vazamentos (cada malloc tem seu free).',
        'Entrada com fgets e limites de tamanho de palavra/definição — nada de scanf %s solto.',
        'Compila com gcc -Wall -Wextra -std=c11 sem avisos.',
      ],
    },
  },
];