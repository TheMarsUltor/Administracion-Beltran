CREATE PROCEDURE `SP_GET_USER_BY_TOKEN` (pTOKEN varchar(512))
BEGIN


IF EXISTS   (
            select 	1
            from	usuarios u 
                    inner join perfiles p on p.id_perfil = u.id_perfil
                    inner join sessions s on s.id_usuario = u.id_usuario
            where	s.session_token = pTOKEN
              and	finalizada = 0
            )
THEN 
    
        select 	u.id_usuario, 
                p.codidgo,
                u.alias
        from	usuarios u 
                inner join perfiles p on p.id_perfil = u.id_perfil
                inner join sessions s on s.id_usuario = u.id_usuario
        where	s.session_token = pTOKEN
        and	finalizada = 0;
ELSE 
        select 'Token Invalido' mensaje, -1 error_code;
END IF;



END