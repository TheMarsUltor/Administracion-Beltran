CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_MASIVO_ACTIVIDAD`(pINDEX int)
BEGIN


DECLARE listo int;
DECLARE vID int;
DECLARE cActividad CURSOR FOR
select  id_actividad
from    actividades
order   by id_actividad desc
limit  pINDEX; 

DECLARE CONTINUE HANDLER FOR NOT FOUND SET  listo = 1;
OPEN cActividad;

bucle: LOOP

        FETCH cActividad INTO  vID;
        IF listo = 1
        THEN 
            LEAVE bucle;
        END IF;

        delete
        from    actividades
        where   id_actividad = vID;

END LOOP bucle;
CLOSE cActividad;


END
