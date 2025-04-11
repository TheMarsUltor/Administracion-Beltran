CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_PROFESOR`(pID int)
BEGIN
        DECLARE vID_VALIDO bool;

        select 	case when (pID = -1 or pID >= 1) and pID<= max(id_profesor)  then true else false end
        into	vID_VALIDO
        from	profesores;

        IF vID_VALIDO   
        THEN
                IF pID = -1 
                THEN 
                        select 	id_profesor id,
                                email,
                                nombre, 
                                apellido,
                                estado
                        from	profesores
                        where	eliminado = 0;
                ELSEIF  (select count(*) from profesores where id_profesor = pID and eliminado = 0) =1
                THEN
                        select	id_profesor,
                                nombre,
                                apellido,
                                estado, 
                                email
                        from	profesores
                        where	id_profesor = pID
                        and	eliminado = 0; 
                ELSE 
                    select -2 error_code, 'profesor eliminado' mensaje;
                END IF;

        ELSE 
                select -1 error_code,'profesor inexistente' mensaje;
        END IF;

END