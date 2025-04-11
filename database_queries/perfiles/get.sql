CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_PERFIL`(pID int)
BEGIN
        DECLARE vID_VALIDO bool;
        select 	case when (pID = -1 or pID >= 1) and pID<= max(id_perfil)  then true else false end
        into	vID_VALIDO
        from	perfiles;

        IF vID_VALIDO   
        THEN
                IF pID = -1 
                THEN 
                        select 	id_perfil id,
                                nombre,
                                codigo
                        from	perfiles
                        where	eliminado = 0;
                ELSEIF (select count(*) from perfiles where id_perfil = pID and eliminado = 0) = 1
                THEN
                        select	id_perfil id,
                                nombre,
                                codigo
                        from	perfiles
                        where	id_perfil = pID; 
                ELSE 
                        select -2 error_code, 'Perfil eliminado' mensaje;
                END IF;
        ELSE 
                select -1 error_code,'Perfil inexistente' mensaje;
        END IF;

END