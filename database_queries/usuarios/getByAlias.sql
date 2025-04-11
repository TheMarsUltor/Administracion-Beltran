CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_USUARIO_BY_ALIAS`(pALIAS varchar(16))
BEGIN
	
		DECLARE vCHECK_BY_ALIAS int; 
		DECLARE vCHECK_INTENTOS bool;

		select  count(*)
		into    vCHECK_BY_ALIAS
		from    usuarios 
		where   alias = pALIAS 
		  and   eliminado = 0 ;

		IF vCHECK_BY_ALIAS = 1 
		THEN
				select case when intento = 5 then false else true end
				into	vCHECK_INTENTOS
				from	usuarios
				where	alias = pALIAS;

				IF vCHECK_INTENTOS
				THEN
						select  u.id_usuario id, 
								u.nombre_completo , 
								u.clave,
								u.alias alias, 
								u.intento intentos_fallidos,
								p.codigo perfil
						from 	usuarios u 
								inner join perfiles p on p.id_perfil = u.id_perfil
						where   u.alias = pALIAS
						  and 	u.eliminado = 0;

				ELSE	select "Este usuario supera los (5) intentos de clave" mensaje, -2 error_code;
				END IF;
		ELSE		select 'Alias inexistente!' mensaje, -1 error_code;
		END IF;

END