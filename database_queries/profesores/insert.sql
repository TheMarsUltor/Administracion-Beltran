CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_INSERT_PROFESOR`(                      
			pNOMBRE 	varchar(64),
			pAPELLIDO 	varchar(64),
			pEMAIL 		varchar(128),
            pESTADO		varchar(18),
			pASIGNATURA_COD varchar(12)
			)
BEGIN

	DECLARE vEXISTE_PROFESOR int;
	DECLARE vEXISTE_ASIGNATURA int;
	DECLARE vID_PROFESOR INT;
	DECLARE vID_ASIGNATURA  INT;
	DECLARE vCHECK_LEN_NOMBRE BOOL;
	DECLARE vCHECK_LEN_APELLIDO BOOL;
	DECLARE vCHECK_EMAIL BOOL;

	select	case	when LENGTH(pNOMBRE) >= 4  
				then true
				else false
			end,
			case	when LENGTH(pAPELLIDO) >= 3
				then true
				else false
			end,
			case	when LOWER(pEMAIL) = LOWER(CONCAT(LEFT(pNOMBRE, 1 ),pAPELLIDO,'@itbeltran.com.ar' ))
				then true
				else false
			end
	into	vCHECK_LEN_NOMBRE, 
		vCHECK_LEN_APELLIDO,
		vCHECK_EMAIL;

	select  count(*)
	into    vEXISTE_PROFESOR
	from    profesores
	where   nombre = pNOMBRE
	and  	apellido = pAPELLIDO
	and	email = LOWER(pEMAIL);

	select  count(*)
	into    vEXISTE_ASIGNATURA
	from    asignaturas
	where   codigo = pASIGNATURA_COD;

		
	--	 evaluar datos antes de agregar a la tabla
	IF	(		vEXISTE_PROFESOR = 0 
		AND 	vEXISTE_ASIGNATURA = 1 
		AND 	vCHECK_LEN_NOMBRE 
		AND 	vCHECK_LEN_APELLIDO 
		AND 	vCHECK_EMAIL 
		)
	THEN	
		insert
		into    profesores (nombre, apellido, email, estado)
		values  (pNOMBRE,pAPELLIDO, LOWER(pEMAIL),pESTADO);
						
		select  id_profesor
		into    vID_PROFESOR
		from    profesores
		where   nombre = pNOMBRE
		  and	apellido = pAPELLIDO;

		select  id_asignatura
		into    vID_ASIGNATURA
		from    asignaturas
		where   codigo = pASIGNATURA_COD;

		insert
		into    profesores_asignaturas (id_profesor, id_asignatura)
		values  (vID_PROFESOR,vID_ASIGNATURA);
						
		select  'Profesor creado correctamente' mensaje, 0 error_code;
			
	ELSEIF	(	vEXISTE_PROFESOR = 1 
		AND 	vEXISTE_ASIGNATURA = 1 	
		AND  	vCHECK_LEN_NOMBRE  	
		AND	vCHECK_LEN_APELLIDO  
		)
	THEN
		select  id_profesor
		into    vID_PROFESOR
		from    profesores
		where   nombre = pNOMBRE
		  and	apellido = pAPELLIDO;

		select  id_asignatura
		into    vID_ASIGNATURA
		from    asignaturas
		where   codigo = pASIGNATURA_COD;

		-- si el profesor no está vinculado con la asignatura indicada, se crea el registro en 'profesores_asignaturas'
		IF NOT EXISTS	( 
				select * 
				from	profesores_asignaturas
				where	id_profesor = vID_PROFESOR
				  and	id_asignatura = vID_ASIGNATURA
				)
		THEN 
			insert
			into    profesores_asignaturas (id_profesor, id_asignatura)
			values  (vID_PROFESOR,vID_ASIGNATURA);
		
			select  'Profesor vinculado correctamente ' mensaje, 0 error_code;
		ELSE
			select	'Ocurrio un error al incorporar este profesor a la asignaura\0Este profesor ya se encuentra vinculado a esta asignatura.' mensaje,  -1	error_code ;
		END IF;
			
	ELSEIF   !vCHECK_LEN_NOMBRE or !vCHECK_LEN_APELLIDO 
	THEN 
		select 	'El nombre y/o apellido no cumplen con los caracteres minimos y maximos' mensaje, -2 error_code;
	ELSEIF  vEXISTE_ASIGNATURA = 0
	THEN
		select 'La asignatura no existe' mensaje, -3 error_code;
	ELSEIF 	!vCHECK_EMAIL
	THEN	
		select 	'El email no respeta la convención especificada para el Teams' mensaje, -4 error_code;
	ELSE 
		select	concat('Error inesperado.\nDatos:{\nnombre:',pNOMBRE,', apellido: ', pAPELLIDO,', email: ', pEMAIL,', Asignatura: ',pASIGNATURA_COD,'}\n\0' ) mensaje, -5 error_code;

	END IF;

END