CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_UPDATE_PERFIL`(pID int, pNOMBRE varchar(32) , pCODIGO varchar(8))
BEGIN

DECLARE vID_VALIDO bool; 
DECLARE vCHECK_NOMBRE bool;
DECLARE vCHECK_CODIGO bool;


select	case  	when count(*) = 1 
		then true 
		else false
	end 
into	vID_VALIDO
from	perfiles
where	id_perfil = pID
  and 	eliminado = 0;

select	case 	when LENGTH(pNOMBRE) >= 3 
		then true
            	else false
	end,
        case 	when LENGTH(pCODIGO) >= 2  and pCODIGO not in (select codigo from perfiles where id_perfil <> pID and eliminado = 0)
		then true
		else false
	end
into	vCHECK_NOMBRE, vCHECK_CODIGO;


IF vID_VALIDO AND vCHECK_NOMBRE AND vCHECK_CODIGO 
THEN
	update 	perfiles 
	set	nombre = pNOMBRE,
		codigo = pCODIGO 
	where	id_perfil = pID;
	
	select 'Registro actualizado correctamente.' mensaje, 0 error_code;

ELSEIF !vID_VALIDO
THEN
	select 'Imposible actualizar. El perfil al que hacer referencia está eliminado. ' mensaje, -1 error_code;
ELSEIF !vCHECK_NOMBRE  
THEN
	select 'El campo: Nombre debe tener entre 3 y 32 caracteres.' mensaje, -2 error_code;
ELSEIF !vCHECK_CODIGO
THEN
	select 	concat('El campo PERFILES.CODIGO ',
						case 	when LENGTH(pCODIGO) < 2 
							then'no cumple con la longitud minima requerida de 2 caracteres'
							else 'ya existe en la tabla y no se puede duplicar' 
						end,'.' ) mensaje, -3 error_code;
END IF;

END