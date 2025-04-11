CREATE DEFINER=`root`@`localhost` 
PROCEDURE `SP_UPDATE_USUARIO`	(
								pID int,
								pNOMBRE_COMPLETO	varchar(64),
								pUSERNAME 	        varchar(32),
								pPERFIL_CODE            varchar(8)
								)
BEGIN


	DECLARE vID_VALIDO 		bool;
	DECLARE vID_PERFIL 		int;
	DECLARE vCHECK_LEN_NOMBRE       bool;
	DECLARE vCHECK_USERNAME     	bool;

	select	case when count(*) = 1 then true else false end
	into	vID_VALIDO
	from	usuarios
	where	id_usuario = pID
	and	eliminado = 0;


	select 	coalesce(id_perfil, 0) 
	into	vID_PERFIL
	from	perfiles
	where	codigo = pPERFIL_CODE
	and 	eliminado = 0;
			
	select 	case	when LENGTH(pNOMBRE_COMPLETO) > 8  
			then true
			else false
		end,
		case 	when	( 	LENGTH(pUSERNAME) > 3 
				and 	pUSERNAME not in(
							select	alias 
							from 	usuarios 
							where 	id_usuario <> pID 
							and	eliminado = 0 
							)
				)
			then true
			else false
		end
	into	vCHECK_LEN_NOMBRE, 
			vCHECK_USERNAME;


	IF	(	vID_VALIDO 
		AND 	vID_PERFIL > 0
		AND 	vCHECK_LEN_NOMBRE 
		AND 	vCHECK_USERNAME 
		)
	THEN 	
		update	usuarios
		set	id_perfil = vID_PERFIL,
			nombre_completo	= pNOMBRE_COMPLETO,
			alias = pUSERNAME,
			updated_at = CURRENT_TIMESTAMP()
		where	id_usuario = pID;

		select 'Usuario actualizado' mensaje , 0 error_code;

	ELSEIF 	 !vID_VALIDO
	THEN
		select 	'Parametro erroneo' mensaje, -1 error_code; 
	ELSEIF	!(vID_PERFIL > 0)
	THEN
		select 'Codigo perfil erroneo' mensaje, -2 error_code;
	ELSEIF	!vCHECK_LEN_NOMBRE
	THEN
		select 'El nombre de usuario no cumple la longitud minima de 8 caracteres' mensaje, -2 error_code;
	ELSEIF	!(vCHECK_USERNAME)
	THEN
		select 'Este nombre de usuario es demasiado corto o ya existe un usuario con este alias en el sistema' mensaje, -3 error_code;
	END IF;


	END
