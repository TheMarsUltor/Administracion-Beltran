CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_CHECK_ENTITY`(pENTITY varchar(16))
BEGIN
select count(*) resultado
from	(
		select	table_name tabla
		from	information_schema.tables
		where	table_schema = 'beltran_adm_sistema'
		  and	table_name <> 'profesores_asignaturas' 
		  and	table_name <> 'sesiones'
		) x
where	x.tabla = pEntity;
END