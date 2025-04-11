CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_LOGIN`(pID_USUARIO int, pTOKEN varchar(512), pREFRESH_TOKEN varchar(512), pDURACION bigint)
BEGIN

-- si eiste session abierta
DECLARE vHAY_SESION int; 

select	count(*)
into	vHAY_SESION
from	sessions
where	id_usuario = pID_USUARIO;


-- si hay sesion, cerrarla
IF vHAY_SESION <> 0
THEN
		update	sessions
		set		finalizada = 1
		where	id_usuario = pID_USUARIO;
END IF;

-- ingresar nueva sesion abierta
insert
into	sessions (id_usuario,session_token,expira_en, inicio, refresh_token)
select	id_usuario, pTOKEN,pDURACION, pDURACION - (1000 *60 * 60) ,pREFRESH_TOKEN
from	usuarios
where	id_usuario = pID_USUARIO;

update 	usuarios
set		updated_at = CURRENT_TIMESTAMP(),
		ult_login = CURRENT_TIMESTAMP(),
		intento = 0
where	id_usuario = pID_USUARIO;


END