create table sessions(
    id_session   int auto_increment primary key,
    id_usuario  int not null,
    session_token        varchar(1024) ,
    refresh_session     varchar(1024) ,
    expira_en   bigint not null,
    inicio      bigint not null,
    finalizada  bit default 0  
);

alter table sessions 
add constraint FK_USUARIO_SESSION foreign key ( id_usuario ) references usuarios( id_usuario );

alter   table sessions
add     constraint UQ_TOKEN_SESSION  unique (session_token);

alter   table sessions
add     constraint UQ_REF_TOKEN_SESSION  unique (refresh_session);



-- 3600000
/*
alter table sessions
add column finalizada bit default 0;

alter table sessions
add column inicio int ;

*/