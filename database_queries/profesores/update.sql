CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_UPDATE_PROFESOR`(
									pID int, 
									pNOMBRE 	varchar(64) , 
									pAPELLIDO	varchar(64),
									pEMAIL		varchar(128),
									pESTADO		varchar(8)
									)
BEGIN

DECLARE vID_VALIDO bool; 
DECLARE vCHECK_NOMBRE bool;
DECLARE vCHECK_APELLIDO bool;
DECLARE vCHECK_ESTADO bool;
DECLARE vCHECK_EMAIL bool;


select	case when count(*) = 1 then true else false end 
into	vID_VALIDO
from	profesores
where	id_profesor = pID 
  and	eliminado = 0;

select 	case    when 	LENGTH(pNOMBRE) >= 3 
                then true
                else false
	end,
        case    when 	LENGTH(pAPELLIDO) >= 4
                then true
                else false
	end,
	case	when 	pESTADO = 'LICENCIA' or pESTADO= 'ACTIVO' 
		then true
		else false
	end,
	case 	when	LOWER(pEMAIL) = LOWER(CONCAT(LEFT(pNOMBRE, 1 ),pAPELLIDO,'@itbeltran.com.ar' ))
		then 	true
		else 	false
	end 
into	vCHECK_NOMBRE, vCHECK_APELLIDO,vCHECK_ESTADO, vCHECK_EMAIL;

IF 		vID_VALIDO 
	AND	vCHECK_NOMBRE 
	AND vCHECK_APELLIDO 
	AND vCHECK_ESTADO 
	AND vCHECK_EMAIL
THEN
        
	update 	profesores 
	set		nombre = pNOMBRE,
			apellido = pAPELLIDO,
			estado = pESTADO,
			email = pEMAIL
	where	id_profesor = pID;
				
	select 'Profesor actualizado correctamente.' mensaje, 0 error_code;

ELSEIF !vID_VALIDO
THEN
	select 'No se puede actuaizar un registro eliminado' mensaje, -1 error_code;
ELSEIF !vCHECK_NOMBRE  
THEN
	select 'El campo: Nombre debe tener entre 3 y 64 caracteres.' mensaje, -2 error_code;
ELSEIF !vCHECK_APELLIDO
THEN
	select 'El Campo: Apellido debe tener entre 4 y 64 caracteres' mensaje, -3 error_code;
ELSEIF	!vCHECK_EMAIL 
THEN
	select	'El email institucional debe cumplir con el patrón {inicial nombre}+{apellido}@itbeltran.com.ar.' mensaje, -4 error_code;
ELSEIF	!vCHECK_ESTADO 
THEN 
	select 'El campo: Estado solo puede ser "LICENCIA" o "ACTIVO". ' mensaje, -5 error_code;
END IF;

END