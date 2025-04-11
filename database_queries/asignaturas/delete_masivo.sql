CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_MASIVO_ASIGNATURA`(pINDEX int)
BEGIN


DECLARE listo int;
DECLARE vID int;
DECLARE cAsignatura CURSOR FOR
select  id_asignatura
from    aulas
order   by id_asignatura desc
limit  pINDEX; 

DECLARE CONTINUE HANDLER FOR NOT FOUND SET  listo = 1;
OPEN cAsignatura;

bucle: LOOP

        FETCH cAsignatura INTO  vID;
        IF listo = 1
        THEN 
            LEAVE bucle;
        END IF;

        delete
        from    aulas
        where   id_asignatura = vID;

END LOOP bucle;
CLOSE cAsignatura;


END
