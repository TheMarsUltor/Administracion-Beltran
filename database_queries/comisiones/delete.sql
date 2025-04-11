CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_COMISION`(pID int)
BEGIN


IF EXISTS 	(
			select	*
            from	comisiones
            where	id_comision = pID
              and	eliminado = 0
            )
THEN
		update 	comisiones 
		set		eliminado = 1
		where	id_comision = pID;
			
		select 'Comisión Eliminada.' mensaje, 0 error_code;
ELSE 
		select 'No se puede eliminar este registro.' mensaje, -1 error_code; 
END IF;

END