CREATE DEFINER=`root`@`localhost` 
PROCEDURE `SP_UPDATE_ACTIVIDADES`	(
					pID int,
					pID_PROFESOR int , 
					pID_ASIGNATURA int,
					pID_COMISION int,
					pID_AULA int ,
					pHORA varchar(8),
					pDIA varchar(3)
					)
BEGIN

	IF EXISTS
		(
		select 	1
		from	actividades 
		where	id_actividad = pID
		  and	eliminado = 0
		)
	THEN
		update	actividades 
		set	id_profesor = pID_PROFESOR,
			id_asignatura = pID_ASIGNATURA,
			id_aula = pID_AULA,
			id_comision = pID_COMISION,
			hora = pHORA,
			dia = pDIA 
		where 	id_actividad = pID;

		select 'Actividad modificada!' mensaje, 0 error_code;
	ELSE 
		select 'Error inesperado al querer actualizar el registro.' mensaje, -1 error_code;
	END IF;

END