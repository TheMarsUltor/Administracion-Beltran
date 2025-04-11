CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_MASIVO_PERFIL`(pINDEX int)
BEGIN


DECLARE listo int;
DECLARE vID int;
DECLARE cPerfiles CURSOR FOR
select  id_perfil
from    perfiles
order   by id_perfil desc
limit  pINDEX; 

DECLARE CONTINUE HANDLER FOR NOT FOUND SET  listo = 1;
OPEN cPerfiles;

bucle: LOOP

        FETCH cPerfiles INTO  vID;
        IF listo = 1
        THEN 
            LEAVE bucle;
        END IF;


        delete
        from    perfiles
        where   id_perfil = vID;
END LOOP bucle;
CLOSE cPerfiles;


END