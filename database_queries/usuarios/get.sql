CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_USUARIO`( 
															pID		int
															)
BEGIN

DECLARE vID_VALIDO bool;

select 	case when (pID = -1 or pID >= 1) and pID<= max(id_usuario)  then true else false end
into	vID_VALIDO
from	usuarios;


IF vID_VALIDO
THEN
        IF pID = -1
        THEN
	
				select	u.id_usuario id,
						p.nombre perfil,
						u.nombre_completo,
						u.alias,
						case when u.intento = 3 THEN 'SI' ELSE 'NO' end blanqueo,
						date_format(u.created_at, '%d/%m/%Y %H:%i') created_at, 
						date_format(u.updated_at, '%d/%m/%Y %H:%i') updated_at, 
						date_format(u.ult_login, '%d/%m/%Y %H:%i') ult_login
				from	usuarios u 
						inner join perfiles p on p.id_perfil = u.id_perfil
				where	u.eliminado = 0;
        
        ELSEIF (select count(*) from usuarios where id_usuario = pID and eliminado = 0)
        THEN
				select	0 error_code, 
						u.id_usuario, 
                        u.id_perfil,
                        u.nombre_completo, 
                        u.alias, 
                        u.email, 
                        p.codigo perfil
                from	usuarios u
						inner join perfiles p on p.id_perfil = u.id_perfil
                where	id_usuario = pID;
        ELSE 
				select 'Este usuario se encuentra eliminado' mensaje, -2 error_code;
        END IF;

ELSE
    select "Id Invalido!" mensaje, -1 error_code;

END IF;

END