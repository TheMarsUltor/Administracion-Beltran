CREATE DEFINER=`root`@`localhost` 
PROCEDURE `SP_INSERT_ACTIVIDAD`	(
								pID_PROFESOR int,
								pID_ASIGNATURA int,
								pID_AULA int,
								pID_COMISION int,
								pHORA char(8),
								pDIA char(3)
								)
BEGIN

		DECLARE vEVALUAR_ID_PROFESOR int;
		DECLARE vEVALUAR_ID_ASIGNATURA int;
		DECLARE vEVALUAR_ID_COMISION int;
		DECLARE vEVALUAR_ID_AULA int;
		DECLARE vEVALUAR_HORA int;
		DECLARE vEVALUAR_DIA int;


		select  count(*)
		into    vEVALUAR_ID_PROFESOR
		from    profesores
		where   id_profesor = pID_PROFESOR
		  and  	eliminado = 0;

		select  count(*)
		into    vEVALUAR_ID_ASIGNATURA
		from    asignaturas
		where   id_asignatura = pID_ASIGNATURA
		and     eliminado = 0;

		select  count(*)
		into    vEVALUAR_ID_AULA
		from    aulas
		where   pID_AULA = id_aula
		and     eliminado = 0;

		select  count(*)
		into    vEVALUAR_ID_COMISION
		from    comisiones
		where   pID_COMISION = id_comision
		and     eliminado = 0;


		select  case    when pHORA in	(
						'07:00','08:00','09:00','10:00',
						'11:00','12:00','13:00','14:00',
						'15:00','16:00','17:00','18:00',
						'19:00','20:00','21:00','22:00'
						)
				then 1 
				else 0
			end ,
			case    when pDIA in    (
						'LUN',
						'MAR',
						'MIE',
						'JUE',
						'VIE',
						'SAB',
						'DOM'
						) 
				then 1
				else 0
			end 
		into    vEVALUAR_HORA,
				vEVALUAR_DIA;


		IF  	(	vEVALUAR_ID_PROFESOR = 1 
			AND	vEVALUAR_ID_AULA = 1 
			AND	vEVALUAR_ID_COMISION = 1
			AND	vEVALUAR_ID_ASIGNATURA = 1 
			AND	vEVALUAR_HORA = 1 
			AND 	vEVALUAR_DIA = 1
			)
		THEN 
			insert 
			into    actividades	
					(
					id_profesor, 
					id_asignatura,
					id_aula,
					id_comision,
					hora,
					dia
					)
			select	pID_PROFESOR,
				pID_ASIGNATURA,
				pID_AULA,
				pID_COMISION,
				pHORA,
				pDIA;

			select 'Actividad nueva creada!' mensaje, 0 error_code;

		ELSEIF vEVALUAR_ID_PROFESOR = 0
		THEN
			select 'Profesor no encontrado!' mensaje, -1 error_code;
		ELSEIF vEVALUAR_ID_ASIGNATURA = 0
		THEN
			select 'Asignatura inexistente!' mensaje, -2 error_code;
		ELSEIF	vEVALUAR_ID_AULA = 0
		THEN	
			select 'Aula no encontrada!' mensaje, -3 error_code;
		ELSEIF	vEVALUAR_ID_COMISION
		THEN
			select 'Comisión no encontrada!' mensaje, -4 error_code;
		ELSEIF	vEVALUAR_HORA = 0
		THEN
			select 'Se há encontrado un error en la hora ingresada.
			¡No soportado en el sistema!
			Contacte con soporte técnico.' mensaje , -5 error_code;
		ELSEIF vEVALUAR_DIA = 0 
		THEN
			select 'Parametro "dia" invalido.' mensaje , -6 error_code;
		END IF;

END