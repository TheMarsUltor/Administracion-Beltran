CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_MASIVO_AULA`(pINDEX int)
BEGIN


DECLARE listo int;
DECLARE vID int;
DECLARE cAula CURSOR FOR
select  id_aula
from    aulas
order   by id_aula desc
limit  pINDEX; 

DECLARE CONTINUE HANDLER FOR NOT FOUND SET  listo = 1;
OPEN cAula;

bucle: LOOP

        FETCH cAula INTO  vID;
        IF listo = 1
        THEN 
            LEAVE bucle;
        END IF;

        delete
        from    aulas
        where   id_aula = vID;

END LOOP bucle;
CLOSE cAula;


END
