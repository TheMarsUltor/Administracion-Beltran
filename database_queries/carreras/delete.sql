CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_CARRERA`(pID int)
BEGIN

DECLARE vID_VALIDO bool; 

select	case when pID >= 1  and pID<= max(id_carrera)
				then true
                else false
		end
into	vID_VALIDO
from	carreras;

IF vID_VALIDO 
THEN
		update 	carreras 
		set		eliminado = 1
		where	id_carrera = pID;

		update	comisiones 
		set		eliminado = 1
		where	id_carrera = pID;

		

		select 'Registro Eliminado.' mensaje, 0 error_code;
ELSE 
		select 'No se puede eliminar este registro.' mensaje, -1 error_code; 
END IF;

END