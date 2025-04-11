CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_INSERT_PERFIL`(
                                pNOMBRE varchar(32), 
                                pCODIGO varchar(8) 
                                )
BEGIN


IF NOT EXISTS 	(
				select 	1 
                from	perfiles
                where	codigo = pCODIGO 
                  and	eliminado = 0
                )
THEN
		insert
        into	perfiles	(
							nombre,
                            codigo
							)
		select pNOMBRE, pCODIGO;
        
        select 'Perfil ingresado.' mensaje, 0 error_code;
ELSE 
		select 'Codigo existente!' mensaje, -1 error_code;
END IF;

END