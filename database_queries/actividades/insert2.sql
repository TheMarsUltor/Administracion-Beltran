CREATE DEFINER=`root`@`localhost` 
PROCEDURE `SP_INSERT_ACTIVIDAD2`   	(
									pEMAIL_PROFESOR	 	varchar(128),
									pCODIGO_ASIGNATURA 	varchar(16),
									pNUMERO_AULA 		varchar(16),
									pCOMISION			varchar(32),
									pHORA				varchar(16),
									pDIA				varchar(4)
									)
BEGIN

		DECLARE vID_PROFESOR int;
		DECLARE vID_ASIGNATURA int;
		DECLARE vID_COMISION int;
		DECLARE vID_AULA int;
		DECLARE vEVALUAR_HORA int;
		DECLARE vEVALUAR_DIA int;


		select  id_profesor
		into    vID_PROFESOR
		from    profesores
		where   email = pEMAIL_PROFESOR
		  and  	eliminado = 0;

		select  id_asignatura
		into    vID_ASIGNATURA
		from    asignaturas
		where   codigo = pCODIGO_ASIGNATURA
		and     eliminado = 0;

		select	id_aula
		into    vID_AULA
		from    aulas
		where   numero = pNUMERO_AULA
		and     eliminado = 0;

		select  id_comision
		into    vID_COMISION
		from    comisiones
		where   concat(anio,'º',division,turno) = pCOMISION
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


		IF  (	
				(vID_PROFESOR <> 0 and vID_PROFESOR <> null )  
			AND	(vID_AULA <> 0 and vID_AULA <> null)
			AND	(vID_COMISION <> 0 and vID_COMISION <> null) 
			AND	(vID_ASIGNATURA <> 0 and vID_ASIGNATURA <> null) 
			AND	vEVALUAR_HORA = 1 
			AND vEVALUAR_DIA = 1
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

		ELSEIF	vID_PROFESOR = null 
 		THEN
			select 'Profesor no encontrado!' mensaje, -1 error_code;
		ELSEIF	vID_ASIGNATURA = null
		THEN
			select 'Asignatura inexistente!' mensaje, -2 error_code;
		ELSEIF	vID_AULA = null
		THEN	
			select 'Aula no encontrada!' mensaje, -3 error_code;
		ELSEIF	vID_COMISION = null
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