CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_INSERT_AULA`(
                                pTIPO_AULA varchar(32),
                                pNUMERO int, 
                                pPISO int 
                                )
BEGIN

        DECLARE vCHECK_TIPO_AULA int;
        DECLARE vCHECK_NUMERO int;

        select 	count(*)
        into	vCHECK_TIPO_AULA
        where	pTIPO_AULA in	(
                                'AULA',
                                'LABORATORIO',
                                'AUDITORIO',
                                'OFICINA'
                                );
                                        
        select  count(*)
        into	vCHECK_NUMERO
        from	aulas
        where	numero = pNUMERO
        and	eliminado = 0
        ; 


        IF (vCHECK_TIPO_AULA = 1 and vCHECK_NUMERO = 0 and  (pPISO in (1,2,3,4,5,6) and (pNUMERO >= ( pPISO*10) and  pNUMERO < ( pPISO*10) +10 )) )
        THEN
                insert 
                into	aulas(tipo_aula, numero,piso )
                select	pTIPO_AULA,
                        pNUMERO,
                        pPISO;
                
                select 0 error_code, 'Aula ingresada' mensaje;

        ELSEIF (vCHECK_TIPO_AULA = 0) 
        THEN
                select -1 error_code, 'Aulas.TIPO_AULA valor invalido.' mensaje;
        ELSEIF ( pPISO not in (0,1,2,3,4,5,6) )
        THEN
			select -2 error_code, concat('No existe el piso ', pPISO, '.\n Solo son validos los valores de PB al 6to piso' ) mensaje;
        ELSEIF ((pNUMERO >= ( pPISO*10) and  pNUMERO < ( pPISO*10) +10 ))
        THEN
				select 'El numero del aula no corresponde para el piso indicado o el piso no existe' mensaje, -3 error_code;
        ELSEIF (vCHECK_NUMERO >= 1  )
        THEN
			select -4 error_code, 'Ya existe un aula con este numero. Debe eliminar el registro para poder insertar!' mensaje;
        END IF
        ;

END