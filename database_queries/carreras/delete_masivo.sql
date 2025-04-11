CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_MASIVO_CARRERA`(pINDEX int)
BEGIN
DECLARE listo int;
DECLARE vID int;
DECLARE cCarreras CURSOR FOR
select  id_carrera
from    carreras
order   by id_carrera desc
limit  pINDEX; 

DECLARE CONTINUE HANDLER FOR NOT FOUND SET  listo = 1;
OPEN cCarreras;

bucle: LOOP

        FETCH cCarreras INTO  vID;
        IF listo = 1
        THEN 
            LEAVE bucle;
        END IF;


        delete
        from    carreras
        where   id_carrera = vID;
END LOOP bucle;
CLOSE cCarreras;

END