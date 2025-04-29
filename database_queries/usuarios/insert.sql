CREATE DEFINER=`root`@`localhost` 
PROCEDURE `SP_INSERT_USUARIO`   (
                                pNOMBRE_COMPLETO	varchar(64),
                                pUSERNAME 	        varchar(32),
                                pEMAIL				varchar(128),
                                pHASHED_PASS            varchar(128),
                                pPERFIL_CODE            varchar(8)
                                )
BEGIN
        DECLARE vEXISTE_PERFIL          int;
        DECLARE vEXISTE_USERNAME        int;
        DECLARE vEXISTE_PASS            int;
        DECLARE vID_PERFIL              int;
        DECLARE vCHECK_LEN_NOMBRE       int;
        DECLARE vCHECK_LEN_USERNAME     int;
        
        select 	case when LENGTH(pNOMBRE_COMPLETO) > 8  
                        then 1
                        else 0
                end,
                case when LENGTH(pUSERNAME) > 3
                        then 1
                        else 0
                end
        into vCHECK_LEN_NOMBRE, vCHECK_LEN_USERNAME;


        select 	count(*) 
        into	vEXISTE_PERFIL
        from	perfiles
        where	codigo = pPERFIL_CODE;
		
        select  count(*)
        into    vEXISTE_USERNAME
        from    usuarios
        where   pUSERNAME = alias;

        select  count(*)
        into    vEXISTE_PASS
        from    usuarios
        where   pHASHED_PASS = clave;


	
        IF (vEXISTE_PERFIL = 1 AND vEXISTE_USERNAME = 0 AND vEXISTE_PASS = 0 AND vCHECK_LEN_NOMBRE = 1 AND vCHECK_LEN_USERNAME = 1)
        THEN 
                select  id_perfil 
                into    vID_PERFIL
                from    perfiles
                where   codigo = pPERFIL_CODE;

                insert 
                into    usuarios    (
                                    nombre_completo, 
                                    alias,
                                    clave,
                                    email,
                                    id_perfil
                                    )
                        values      (
                                    pNOMBRE_COMPLETO,
                                    pUSERNAME,
                                    pHASHED_PASS,
                                    pEMAIL,
                                    vID_PERFIL
                                    );
                select concat('Se há agregado al usuario ', pNOMBRE_COMPLETO) mensaje, 0 error_code ;
        ELSEIF  vEXISTE_PERFIL = 0 
        THEN
                select 'Código de perfil invalido' mensaje, -1 error_code ;
        ELSEIF  vEXISTE_USERNAME = 1
        THEN
                select '¡El nombre de único de sesión no disponible!' mensaje, -2 error_code;
        ELSEIF  vEXISTE_PASS = 1 
        THEN
                select 'CONTRASEÑA NO ADMITIDA' mensaje, -3 error_code;
        ELSEIF  vCHECK_LEN_NOMBRE= 0
        THEN    
                select 'El nombre completo del usuario no respeta la longitud correspondiente (min: 8, max: 32 )' mensaje, -4 error_code;                
        ELSEIF  vCHECK_LEN_USERNAME= 0
        THEN    
                select 'El nombre del alias del usuario no respeta la longitud correspondiente (min: 3, max: 16 caracteres )' mensaje, -5 error_code;                
        END IF;


END
