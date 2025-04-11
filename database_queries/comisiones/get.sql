CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_COMISION`(pID int)
BEGIN
        DECLARE vCHK_ID bool;
        
        select 	case    when (pID =-1 or pID >= 1) and pID <= max(id_comision) 
                        then true 
                        else false
                end 
        into	vCHK_ID
        from    comisiones; 
        
        IF vCHK_ID  
        THEN 
                IF pID = -1
                THEN 
                        select 	c.id_comision id, 
                                case    when    c.division = '2' 
                                        then 	concat(c.anio,'º ',c.division,'da')
                                        else	concat(c.anio,'º ',c.division,'ra')
                                end 	comision,
                                c.turno,
                                car.nombre carrera 
                        from    comisiones c 
                                inner join carreras car on car.id_carrera = c.id_carrera 
                        where   c.eliminado = 0
                        order by c.id_comision desc;
                ELSEIF (select count(*) from comisiones where id_comision = pID and eliminado = 0) = 1
                THEN
                        select 	c.id_comision id_comision,
                                c.anio anio,
                                c.division division,
                                c.turno turno,
                                car.codigo codCarrera
                        from	comisiones c
                                inner join carreras car on car.id_carrera = c.id_carrera
                        where	c.id_comision = pID
                          and	c.eliminado = 0 ;
                ELSE 
                select 'Registro Eliminado, no se puede modificar' mensaje,  -2 error_code ;
                END IF;
        ELSE 
                select 'Comisión inexistente' mensaje, -1 error_code;
        END IF;
        
END