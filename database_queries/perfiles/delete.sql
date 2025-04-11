CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_PERFIL`(pID int)
BEGIN

DECLARE vID_VALIDO bool; 

select	case when pID >= 1   and pID<= max(id_perfil)
				then true
                else false
		end
into	vID_VALIDO
from	perfiles;

IF vID_VALIDO 
THEN
		update 	perfiles 
		set		habilitado = 0
		where	id_perfil = pID;
			
		select 'Registro Eliminado.' mensaje, 0 error_code;
ELSE 
		select 'No se puede eliminar este registro.' mensaje, -1 error_code; 
END IF;

END