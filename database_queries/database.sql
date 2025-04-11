create database beltran_adm_sistema;

use beltran_adm_sistema;

/* Tables */
create table PERFILES(
    id_perfil   int auto_increment primary key,
    nombre      varchar(32) not null,
    codigo      varchar(8) not null,
    eliminado   int default 0,
    html        varchar(1024)
);


create table USUARIOS(
    id_usuario  int auto_increment primary key,
    id_perfil   int not null,
    nombre_completo varchar(64) not null,
    alias       varchar(16) not null,
    clave       varchar(60) not null,
    email       varchar(128) not null,
    created_at  timestamp default current_timestamp(),
    updated_at  varchar(13),
    eliminado   boolean default false,
    forzar_cambio_clave boolean default false,
    ult_login   char(21),
    intento     int default 0
);

create table AULAS (
    id_aula     int auto_increment primary key,
    tipo_aula   enum('AULA','LABORATORIO','AUDITORIO', 'OFICINA'),
    piso        int ,
    numero      int,
    eliminado   boolean default false
);

--- 17/08/2019 = 1566010800000
create table CARRERAS(
    id_carrera  int auto_increment primary key,
    nombre      varchar(64) not null,
    codigo      varchar(6) not null,
    fecha_vigente bigint,
    duracion    int, 
    lapso       enum('MESES','AÑOS'),
    vigente     boolean,
    eliminado   boolean default 0
);
-- modificar el nombre asignaturas.clave a asignaturas.codigo
create table ASIGNATURAS(
    id_asignatura   int auto_increment primary key,
    id_carrera      int not null,
    nombre          varchar(128) not null,
    codigo          varchar(8) not null,
    eliminado       boolean default 0
);

create table COMISIONES(
    id_comision     int auto_increment primary key,
    id_carrera      int not null,
    anio            enum('1','2','3'),
    division        enum('1','2','3'),
    turno           enum('TM','TT','TN'),
    eliminado       boolean default 0
);

create table PROFESORES(
    id_profesor     int auto_increment primary key,
    nombre          varchar(64) not null,
    apellido        varchar(64) not null,
    email           varchar(64) not null,
    estado          enum('LICENCIA','ACTIVO'),
    eliminado       boolean default 0
);

create table PROFESORES_ASIGNATURAS(
    id_profesor_asignatura int auto_increment primary key, 
    id_profesor     int not null,
    id_asignatura   int not null
);

create table ACTIVIDADES(
    id_actividad    int auto_increment primary key,
    id_profesor     int not null,
    id_asignatura   int not null,
    id_aula         int not null,
    id_comision     int not null,
    hora            char(8),
    dia             enum('LUN','MAR','MIE','JUE','VIE','SAB','DOM') default 'DOM',
    eliminado       boolean default 0
);


/* Constraints */

-- usuarios
alter table usuarios 
add constraint FK_PERFIL_USUARIOS foreign key (id_perfil) references PERFILES(id_perfil);

alter table usuarios
add constraint UQ_ALIAS_USUARIO unique(alias);

alter table usuarios
add constraint UQ_CODIGO_USUARIO unique(codigo);

-- aulas

-- carreras
alter table carreras
add constraint UQ_NOMBRE_CARRERA unique (nombre);

alter table carreras
add constraint UQ_CODIGO_CARRERA unique (codigo);

-- asignaturas
alter table asignaturas 
add constraint FK_CARRERA_ASIGNATURAS foreign key (id_carrera) references CARRERAS(id_carrera);

alter table asignaturas
add constraint UQ_CODIGO_ASIGNATURA unique (codigo);

-- comisiones
alter table comisiones
add constraint FK_CARRERA_COMISIONES foreign key (id_carrera) references CARRERAS(id_carrera);

-- profesores_asignaturas
alter table profesores_asignaturas 
add constraint FK_PROF_ASIG_PROFESORES foreign key (id_profesor) references PROFESORES(id_profesor);

alter table profesores_asignaturas 
add constraint FK_PROF_ASIG_ASIGNATURAS foreign key (id_asignatura) references ASIGNATURAS(id_asignatura);

-- actividades
alter table actividades 
add constraint FK_PROFESOR_ACTIVIDADES foreign key (id_profesor) references PROFESORES(id_profesor);

alter table actividades
add constraint FK_ASIGNATURA_ACTIVIDADES foreign key (id_asignatura) references ASIGNATURAS(id_asignatura);

alter table actividades
add constraint FK_AULA_ACTIVIDADES foreign key (id_aula) references AULAS(id_aula);

alter table actividades
add constraint FK_COMISION_ACTIVIDADES foreign key (id_comision) references COMISIONES(id_comision);








