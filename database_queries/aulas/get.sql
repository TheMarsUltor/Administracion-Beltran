CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_AULA`(pID int)
BEGIN
        DECLARE vID_VALIDO bool;
        DECLARE vEXISTE int;

        select  case when(pID = -1 or pID >= 1) and pID<=max(id_aula) then true else false end
        into    vID_VALIDO
        from    aulas;

        select  count(*)
        into    vEXISTE
        from    aulas 
        where   eliminado = 0;
	
        IF vID_VALIDO AND vEXISTE <> 0
        THEN    -- traer todos
                IF pID = -1
                THEN
                        select  id_aula id,
                                tipo_aula,
                                piso,
                                numero
                        from    aulas
                        where   eliminado = 0;
                -- traer 1
                ELSEIF  (
                        select  count(*) 
                        from    aulas
                        where   id_aula = pID 
                          and   eliminado = 0
                        ) = 1
                THEN
                        select	id_aula,
                                tipo_aula,
                                piso,
                                numero
                        from    aulas 
                        where   eliminado = 0
                          and   id_aula = pID;
                ELSE    
                        select -3 error_code, 'Aula no disponible' mensaje;
                END IF;

        ELSEIF !vID_VALIDO
        THEN
                select 'Aula inexistente' mensaje,  -1 error_code ;
        ELSEIF vEXISTE = 0
        THEN
                select concat('El aula no existe (id: ',pID,') o la tabla se encuentra vacia.' ) mensaje, -2 error_code;
        END IF;
        
END
