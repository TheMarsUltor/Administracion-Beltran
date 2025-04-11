CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_UPDATE_ASIGNATURA`(
									pID int, 
									pNOMBRE varchar(128) , 
									pCODIGO_ASIGNATURA varchar(8), 
									pCODIGO_CARRERA varchar(8)
									)
BEGIN

DECLARE vID_VALIDO bool; 
DECLARE vCHECK_NOMBRE bool;
DECLARE vCHECK_CODIGO bool;
DECLARE vID_CARRERA int;


select	id_carrera 
into	vID_CARRERA
from	carreras
where	codigo = pCODIGO_CARRERA
  and	eliminado = 0;


select 	case    when LENGTH(pNOMBRE) >= 10 
                then true
                else false
	end,
        case    when LENGTH(pCODIGO_ASIGNATURA) >= 2 and pCODIGO_ASIGNATURA not in (select codigo from asignaturas where id_asignatura <> pID and eliminado = 0 )
                then true
                else false
	end
into	vCHECK_NOMBRE, vCHECK_CODIGO;

select	count(*)
into	vID_VALIDO
from	asignaturas 
where	id_asignatura = pID
  and	eliminado = 0 ;


IF vID_VALIDO AND vCHECK_NOMBRE AND vCHECK_CODIGO AND vID_CARRERA <> 0
THEN
	update	asignaturas 
	set	nombre = pNOMBRE,
		codigo = pCODIGO_ASIGNATURA,
		id_carrera = vID_CARRERA
	where	id_asignatura = pID;

	select	'Asignatura modificada!' mensaje, 0 error_code;
ELSEIF !vID_VALIDO 
THEN
	select	'No se puede modificar debido a que el registro ya está eliminado.' mensaje, -1 error_code;
ELSEIF !vCHECK_NOMBRE 
THEN
	select 	'El campo ASIGNATURAS.NOMBRE no puede tener menos de 10 caracteres.' mensaje, -2 error_code;
ELSEIF !vCHECK_CODIGO
THEN
	select 	'El campo ASIGNATURAS.CODIGO no puede tener menos de 2 caracteres.' mensaje , -3 error_code;
ELSEIF vID_CARRERA = 0
THEN
	select 'Se há ingresado un código de carrera invalido.' mensaje , -4  error_code; 
END IF;

END