CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_UPDATE_AULA`(
							pID int, 
                            pTIPO_AULA varchar(16) , 
                            pNUMERO int, 
                            pPISO int
                            )
BEGIN

		DECLARE vCHECK_TIPO_AULA int;
        DECLARE vID_VALIDO int;
        -- El número de aula tiene que coincidir con el id_aula o ser nuevo en la lista
        DECLARE vCHECK_NUMERO int;
        -- El piso no puede ser ni 0 (cero), ni negativo
        DECLARE vCHECK_PISO int ;

        select	case    when count(*) = 1	
						then true
						else false
				end
		into	vID_VALIDO
		from 	aulas 
        where	id_aula = pID
          and	eliminado = 0;
		
        select count(*)
		into	vCHECK_TIPO_AULA
		where	pTIPO_AULA in ('AULA','LABORATORIO','AUDITORIO','OFICINA');
        
        -- si devuelve 2, se anula la operación update
        select 	count(*)
        into	vCHECK_NUMERO 
        from	aulas
        where	(
				id_aula = pID
				or	
                numero = pNUMERO
                )
		  and	eliminado = false;
		
		select case when pPISO <= 0 
					then 0
                    else 1
				end
		into	vCHECK_PISO;
		
            
		IF vID_VALIDO = 1 AND vCHECK_TIPO_AULA = 1 AND vCHECK_NUMERO = 1 AND vCHECK_PISO = 1 AND pNUMERO >0
        THEN
				update	aulas
                set		tipo_aula = pTIPO_AULA,
						numero = pNUMERO,
                        piso = pPISO
				where	id_aula = pID;
                
                select 0 error_code, 'Aula actualizada correctamente!' mensaje ; 
		ELSEIF vID_VALIDO = 0
        THEN	
				select -1 error_code, 'Id_aula invvalida.' mensaje;
		ELSEIF vCHECK_TIPO_AULA = 2
        THEN 
				select -2 error_code, concat(pTIPO_AULA,' no es un tipo valido de Aula!.') mensaje;
		ELSEIF vCHECK_NUMERO = 2 or pNUMERO <= 0
        THEN 	
				select -3 error_code, 	case 	when pNUMERO <= 0 
												then 'No se puede asignar 0 ni valores negativos al campo AULAS.NUMERO.' 
												else concat('Ya existe un aula con este número. Debe eliminar el aula con el nro ', pNUMERO,' para realizar sta operación.') 
										end mensaje;
		ELSEIF vCHECK_PISO = 0
        THEN
				select -4 error_code, 'AULAS.PISO no puede ser 0 ni negativo.' mensaje;
		END IF;

END
