CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DELETE_ENTITY_LAST_INSERTED`(pENTITY varchar(16), pINDEX int)
BEGIN

DECLARE vQUERY nvarchar(400);

select  case lower(pENTITY) 
                when 'perfiles' then   	concat(N'call sp_delete_masivo_perfil(',pINDEX,')')
                when 'profesores' then 	concat(N'call sp_delete_masivo_profesor(',pINDEX,')')
                when 'carreras' then 	concat(N'call sp_delete_masivo_carrera(',pINDEX,')')
                when 'comisiones' then 	concat(N'call sp_delete_masivo_comision(',pINDEX,')')
                when 'aulas' then 		concat(N'call sp_delete_masivo_aula(',pINDEX,')')
                when 'actividades' then concat(N'call sp_delete_masivo_actividad(',pINDEX,')')
		end
into    vQUERY;

PREPARE  delete_masive from @vQUERY;
EXECUTE vQUERY;
DEALLOCATE PREPARE delete_masive;

END