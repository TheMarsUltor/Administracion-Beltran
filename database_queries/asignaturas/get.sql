CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_ASIGNATURA`(pID int)
BEGIN

        DECLARE vID_VALIDO bool;
        DECLARE vEXISTE int;

        select  case when(pID = -1 or pID >= 1) and pID<=max(id_asignatura) then true else false end
        into    vID_VALIDO
        from    asignaturas;

        select count(*)
        into	vEXISTE
        from	asignaturas a 
        inner join carreras c on c.id_carrera = a.id_carrera 
        where	c.eliminado = 0
          and	a.eliminado = 0;


        IF vID_VALIDO AND vEXISTE <> 0
        THEN    -- traer todos
                IF pID = -1
                THEN
                        select	a.id_asignatura id, 
                                c.nombre carrera, 
                                a.nombre nombre, 
                                a.codigo codigo
                        from	asignaturas a 
                                        inner join carreras c on c.id_carrera = a.id_carrera 
                        where	c.eliminado = 0
                          and	a.eliminado = 0;
                -- traer 1
                ELSEIF  (
                        select  count(*) 
                        from    asignaturas 
                        where   id_asignatura = pID 
                          and   eliminado = 0
                        ) = 1
                THEN
                        select	a.id_asignatura id, 
                                c.codigo codigoCarrera, 
                                a.nombre nombre, 
                                a.codigo codigo
                        from	asignaturas a 
                                        inner join carreras c on c.id_carrera = a.id_carrera 
                        where	c.eliminado = 0
                          and	a.eliminado = 0
                          and   a.id_asignatura = pID;
                ELSE    
                        select -3 error_code, 'Asignatura no disponible' mensaje;
                END IF;

        ELSEIF !vID_VALIDO
        THEN
                select 'Asignaturra inexistente' mensaje,  -1 error_code ;
        ELSE 
                select concat('La Asignatura no existe (id: ',pID,').' ) mensaje, -2 error_code;
        END IF;
        
END


