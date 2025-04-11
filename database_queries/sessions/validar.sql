CREATE PROCEDURE `SP_EVALUAR_SESSION` (pTOKEN varchar(512), pDATE bigint)
BEGIN

DECLARE vSESION_VALIDA boolean ;
DECLARE vTOKEN_ACTIVO boolean;



select 	case when expira_en > pDATE then true else false end,
        count(*)
into	vSESION_VALIDA,
        vTOKEN_ACTIVO      
from	sessions
where	pTOKEN = session_token 
  and   finalizada = 0;




IF vTOKEN_ACTIVO
THEN 
        IF vSESION_VALIDA
        THEN
                select concat('session valida: ',pTOKEN) mensaje , 0 error_code;
        ELSE
                update  sessions
                set     finalizada = 1
                where   pTOKEN = pTOKEN;

                select  'Sesion invalida!' mensaje, -1 error_code;
         
        END IF ;

ELSE 
        select 'Token inactivo!' mensaje, -2 error_code;
END IF;


END
