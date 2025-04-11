IF EXISTS	(
		select	1
		from	information_schema.table 
		where	schema_name = 'sprint1'
		  and	table_name = 'perfiles'	
		)
DROP TABLE perfiles;

CREATE TABLE perfiles (
	id_perfil	int auto_increment primary key,
	nombre		varchar(32) not null,
	codigo 		varchar(32) not null,
	html		varchar(1024),
	eliminado	int default 0 
);




-- llenarr datos
insert
into	perfiles (nombre, codigo, html, eliminado)
select	'Administrador' nombre,
	'MASTER'	codigo,
	'`${NavBar("logo.png","Instituto Tecnologico Beltrán",true)}<main>${ButtonAGroup(["Perfiles","Usuarios","Profesores","Comisiones","Carreras","Asignaturas","Aulas","Actividades"])}</main>`' html,
	0 eliminado
union all
select	'Dto. Alumnos'	nombre,
	'DTOA'		codigo,
	'`${NavBar("logo.png","Instituto Tecnologico Beltrán",true)}<main>${ButtonAGroup(["Profesores","Comisiones","Carreras","Asignaturas","Aulas","Actividades"])}</main>`'	html,
	0 eliminado
union all 
select	'Usuario de Consultas'	nombre,
	'UQUERY'		codigo,
	'`${NavBar("logo.png","Instituto Tecnologico Beltrán",true)}<main>${"Renderizar vista de tabla con actividades"}</main>`' html,	
	0 eliminado
;

