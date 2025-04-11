CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_CARRERA`(pID int)
BEGIN

        DECLARE vID_VALIDO bool;

        select  case when(pID = -1 or pID >= 1) and pID<=max(id_carrera) then true else false end
        into    vID_VALIDO
        from    carreras;


        IF vID_VALIDO
        THEN    -- traer todos
                IF pID = -1
                THEN
                        select	id_carrera id, 
                                nombre, 
                                codigo,  
                                fecha_vigente, 
                                duracion,
                                lapso,
                                vigente
                        from	carreras
                        where	eliminado = 0;
                -- traer 1
                ELSEIF  (
                        select  count(*) 
                        from    carreras 
                        where   id_carrera = pID 
                          and   eliminado = 0
                        ) = 1
                THEN
                        select  id_carrera,
                                nombre,
                                codigo,
                                fecha_vigente,
                                duracion,
                                lapso,
                                vigente
                        from    carreras 
                        where   id_carrera = pID; 
                ELSE    
                        select -2 error_code, 'Carrera no disponible' mensaje;
                END IF;

        ELSE 
                select 'Carrera inexistente' mensaje,  -1 error_code ; 
        END IF;
        
END