CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_ACTIVIDAD`(pID int)
BEGIN
        DECLARE vID_VALIDO bool;

        select 	case when (pID = -1 or pID >= 1) and pID<= max(id_actividad)  then true else false end
        into	vID_VALIDO
        from	actividades;

        IF vID_VALIDO   
        THEN
                IF pID = -1 
                THEN 
                        select  act.id_actividad id,
                                act.dia dia, 
                                act.hora hora, 
                                concat(p.apellido,' ,',p.nombre) profesor , 
                                asig.nombre materia, 
                                com.comision,  
                                au.numero aula 
                        from 	actividades act
                                inner join aulas au on au.id_aula = act.id_aula
                                inner join profesores p on p.id_profesor = act.id_profesor
                                inner join asignaturas asig on asig.id_asignatura = act.id_asignatura
                                inner join      (
                                                select  id_comision, concat(cast(anio as char),'º',cast(division as char),'º ',coalesce(cast(turno as char),' ') ) comision 
                                                from	comisiones
                                                where	eliminado = 0         
                                                ) com on com.id_comision = act.id_comision 
                        where   act.eliminado = 0
                        order by act.dia,act.hora;
                ELSEIF  (select count(*) from actividades where id_actividad = pID and eliminado = 0) =1
                THEN
                        select	id_actividad,
                                id_asignatura,
                                id_comision,
                                id_aula,
                                dia,
                                hora
                        from	actividades
                        where	id_actividad = pID
                        and	elimiando  = 0; 
                ELSE 
                    select -2 error_code, 'Actividad eliminada' mensaje;
                END IF;

        ELSE 
                select -1 error_code,'Actividad inexistente' mensaje;
        END IF;

END
