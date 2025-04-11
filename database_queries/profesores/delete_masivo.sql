CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_MASIVO_PROFESOR`(pINDEX int)
BEGIN


DECLARE listo int;
DECLARE vID int;
DECLARE cProfesor CURSOR FOR
select  id_profesor
from    profesores
order   by id_profesor desc
limit  pINDEX; 

DECLARE CONTINUE HANDLER FOR NOT FOUND SET  listo = 1;
OPEN cProfesor;

bucle: LOOP

        FETCH cProfesor INTO  vID;
        IF listo = 1
        THEN 
            LEAVE bucle;
        END IF;

        delete
        from    profesores_asignaturas
        where   id_profesor = vID;

        delete
        from    profesores
        where   id_profesor = vID;
END LOOP bucle;
CLOSE cProfesor;


END