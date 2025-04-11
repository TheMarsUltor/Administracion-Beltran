CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_PROFESOR`(pID int)
BEGIN

DECLARE vID_VALIDO bool; 

select	case when pID >= 1  and pID<= max(id_profesor)
				then true
                else false
		end
into	vID_VALIDO
from	profesores;

IF vID_VALIDO 
THEN
		update 	profesores 
		set		eliminado = 0
		where	id_profesor = pID;
			
		select 'Profesor Eliminado.' mensaje, 0 error_code;
ELSE 
		select 'No se puede eliminar este Profesor.' mensaje, -1 error_code; 
END IF;

END