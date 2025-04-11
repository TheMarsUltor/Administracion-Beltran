CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_MASIVO_COMISION`(pINDEX int)
BEGIN


DECLARE listo int;
DECLARE vID int;
DECLARE cComision CURSOR FOR
select  id_comision
from    perfiles
order   by id_comision desc
limit  pINDEX; 

DECLARE CONTINUE HANDLER FOR NOT FOUND SET  listo = 1;
OPEN cComision;

bucle: LOOP

        FETCH cComision INTO  vID;
        IF listo = 1
        THEN 
            LEAVE bucle;
        END IF;


        delete
        from    perfiles
        where   id_comision = vID;
END LOOP bucle;
CLOSE cComision;


END