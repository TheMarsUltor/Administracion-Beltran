CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_AULA`(pID int)
BEGIN

IF EXISTS	(
			select 	count(*)
            from	aulas
            where	id_aula = pID
            )
THEN
		update	actividades 
		set		eliminado = 1
		where	id_actividad in ( 
								select	act.id_actividad
								from	actividades act 
										inner join aulas a on a.id_aula = act.id_aula 
								where	a.id_aula = pID
								); 
	
		
		update	aulas 
		set		eliminado = 1
		where	id_aula = pID;

		select 0 error_code, 'Aula eliminada!' mensaje;
	else 
		select -1 error_code, 'No exitse este ID' mensaje;
	END IF;
END
