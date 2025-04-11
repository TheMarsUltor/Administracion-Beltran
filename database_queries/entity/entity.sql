create table entity(
    table_name  ENUM('PERFILES','PROFESORES','CARRERAS','ASIGNATURAS','COMISIONES','AULAS','ACTIVIDADES') not null,
    column_name varchar(32) not null,
    type        varchar(16) not null
)