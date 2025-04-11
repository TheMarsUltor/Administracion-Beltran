CREATE DEFINER=`root`@`localhost` 
PROCEDURE `SP_INSERT_ASIGNATURA`    (
                                    pNOMBRE     varchar(128),
                                    pCODIGO      varchar(8),
                                    pCODIGO_CARRERA varchar(6)
                                    )
BEGIN

        DECLARE vEXISTE_CARRERA INT;
        DECLARE vEXISTE_ASIGNATURA INT;
        DECLARE vID_CARRERA INT;

        select  count(*)
        into    vEXISTE_CARRERA
        from    carreras 
        where   codigo = pCODIGO_CARRERA;

        select  count(*)
        into    vEXISTE_ASIGNATURA
        from    asignaturas 
        where   codigo = pCODIGO;

        IF vEXISTE_ASIGNATURA = 0 
        THEN
                IF vEXISTE_CARRERA = 1 
                THEN
                    select  id_carrera
                    into    vID_CARRERA
                    from    carreras
                    where   codigo = pCODIGO_CARRERA;


                    insert
                    into    asignaturas (
                                        nombre,
                                        codigo,
                                        id_carrera
                                        )
                    values  (
                            pNOMBRE,
                            pCODIGO,
                            vID_CARRERA
                            );

                    select '¡Asignatura cargada correctamente!' mensaje , 0 error_code;

            ELSEIF vEXISTE_CARRERA = 0 
            THEN 
                    select '¡Carrera inexistente!' mensaje , -1 error_code;
            END IF;
        ELSEIF vEXISTE_ASIGNATURA <> 0
        THEN
                select 'Ya existe una asignatura con este código, no se puede cargar.' mensaje, -2 error_code;
        END IF;


END