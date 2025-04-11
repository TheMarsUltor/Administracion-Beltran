CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_USUARIO`(pID int)
BEGIN

DECLARE vID_VALIDO bool; 

select	case when pID >= 1   and pID<= max(id_usuario) 
				then true
                else false
		end
into	vID_VALIDO
from	usuarios;

IF vID_VALIDO 
THEN
		update 	usuarios 
		set		eliminado = 0
		where	id_usuario = pID;
			
		select 'Usuario Eliminado.' mensaje, 0 error_code;
ELSE 
		select 'No se puede eliminar este Usuario.' mensaje, -1 error_code; 
END IF;

END