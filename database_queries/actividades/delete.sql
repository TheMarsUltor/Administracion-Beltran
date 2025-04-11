CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_ACTIVIDAD`(pID int)
BEGIN

IF 	EXISTS 	(
			select 	1 
			from	actividades
			where	id_actividad = pID 
			  and	eliminado = 0
			)
THEN
		update 	actividades 
		set		eliminado = 1
		where	id_actividad = pID;
			
		select 'Actividad eliminada.' mensaje, 0 error_code;
ELSE 
		select 'No se puede eliminar esta acttividad.' mensaje, -1 error_code; 
END IF;

END