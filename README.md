1. Requisitos e Funcionalidades:

Inscrição em Formações: Os estudantes e interessados podem se inscrever em formações oferecidas pelo centro através do aplicativo.
Visualização de Formações: Os usuários podem visualizar informações detalhadas sobre cada formação, incluindo datas, horários, instrutores e descrição do curso.
Perfil do Usuário: Os usuários podem criar e gerenciar seus perfis, incluindo informações pessoais, histórico de formações e inscrições atuais.
Notificações: Os usuários receberão notificações sobre novas formações, alterações de horários, datas de vencimento de inscrições, entre outros.
Pesquisa e Filtragem: Os usuários podem pesquisar formações por categoria, data, instrutor, entre outros critérios, facilitando a navegação e seleção de cursos.
1.2. Administradores:
Os administradores terão acesso total ao sistema e serão responsáveis pela gestão e administração do aplicativo.
Funcionalidades incluem gerenciamento de formações, cadastro de instrutores, controle de inscrições, envio de notificações, entre outros.
Podem ser membros da equipe administrativa do centro de formação.

2. Instrutores:
Os instrutores terão acesso limitado para gerenciar suas próprias formações e interagir com os alunos inscritos.
Funcionalidades incluem visualização de alunos inscritos, envio de materiais didáticos, registro de presença, entre outros.
São profissionais responsáveis por ministrar as formações oferecidas pelo centro.

3. Alunos:
Os alunos serão os principais usuários do aplicativo, utilizando-o para se inscrever em formações, acessar materiais didáticos, verificar horários e datas de aulas, entre outros.
Funcionalidades incluem inscrição em formações, visualização de perfil pessoal, acesso a materiais de estudo, entre outros.
Representam os estudantes matriculados nas formações oferecidas pelo centro.

4. Convidados:
Convidados podem ser potenciais alunos ou interessados em conhecer mais sobre as formações oferecidas pelo centro.
Funcionalidades incluem visualização de formações disponíveis, descrição dos cursos, datas e horários de aulas, entre outros.
Não terão acesso a funcionalidades específicas de alunos, como inscrições e acesso a materiais exclusivos.


  const accessLevels = [
    { level: 'Super Admin' },
    { level: 'Admin' },
    { level: 'Moderator' },
    { level: 'Content Editor' },
    { level: 'Support Admin' },
    { level: 'Restricted Admin' },
  ];
     { level: 'Super Administrador' },
    { level: 'Administrador' },
    { level: 'Moderador' },
    { level: 'Editor de Conteúdo' },
    { level: 'Administrador de Suporte' },
    { level: 'Administrador Restrito' },

  Aqui estão alguns exemplos de níveis de acesso que você pode definir para administradores em seu aplicativo:

1. **Super Admin**: Este nível tem acesso total a todos os recursos e funcionalidades do aplicativo, incluindo gerenciamento de usuários, configurações e configurações do sistema.

2. **Administrador**: os administradores têm privilégios elevados em comparação com usuários normais, como a capacidade de criar e gerenciar conteúdo, visualizar relatórios e moderar atividades de usuários.

3. **Moderador**: os moderadores podem revisar e aprovar conteúdo gerado pelo usuário, gerenciar comentários e aplicar as diretrizes da comunidade.

4. **Editor de Conteúdo**: Os editores de conteúdo podem criar e editar conteúdo na plataforma, como artigos, postagens de blog ou conteúdo multimídia.

5. **Administrador de suporte**: os administradores de suporte têm acesso a ferramentas de suporte ao usuário, podem ajudar os usuários com problemas e gerenciar solicitações de atendimento ao cliente.

6. **Administrador restrito**: administradores restritos têm acesso limitado a seções específicas do aplicativo com base em sua função ou departamento na organização.

Estes são apenas alguns exemplos de níveis de acesso que você pode definir para administradores em seu aplicativo. Você pode personalizá-los e expandi-los com base nas funções e responsabilidades específicas da sua organização.