CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_ASIGNATURA`(pID int)
BEGIN

DECLARE vID_VALIDO bool; 

select	case when (pID >= 1 ) and pID<= max(id_asignatura)
				then true
                else false
		end
into	vID_VALIDO
from	asignaturas;

IF vID_VALIDO 
THEN
		update 	asignaturas 
		set		eliminado = 1
		where	id_asignatura = pID;
			
		select 'Asignatura eliminada.' mensaje, 0 error_code;
ELSE 
		select 'No se puede eliminar esta asignatura.' mensaje, -1 error_code; 
END IF;

END