CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_INSERT_COMISION`(
    	                        pANIO		CHAR(1),
                                pDIVISION 	CHAR(1),
                                pTURNO      CHAR(2),
                                pCODIGO_CARRERA varchar(8)
                                )
BEGIN

		DECLARE vID_CARRERA int;
		DECLARE vEXISTE_COMISION int;
		DECLARE vCHECK_ANIO int;
		DECLARE vCHECK_DIVISION int;
		DECLARE vCHECK_TURNO int;


		select 	coalesce(id_carrera, 0)  
		into	vID_CARRERA
		from	carreras
		where	codigo = pCODIGO_CARRERA;

		select  case 	when pANIO in ('1','2','3')
						then 1
						else 0
				end 
		into    vCHECK_ANIO;
                
    	select  case when pDIVISION in ("1","2","3")
				then 1
				else 0
		end
    	into    vCHECK_DIVISION;            

    	select  case when pTURNO in ('TM','TT' ,'TN' )
						then 1
						else 0
				end
    	into    vCHECK_TURNO;

		select  count(*)
		into    vEXISTE_COMISION
		from    comisiones
		where   id_carrera = vID_CARRERA
		  and   anio = pANIO
		  and   division = pDIVISION
		  and   turno = pTURNO
          and	eliminado = 0;


	IF  (vCHECK_ANIO = 1 AND vCHECK_DIVISION = 1 AND vCHECK_TURNO = 1 AND vID_CARRERA <> 0 AND vEXISTE_COMISION = 0)
	THEN
			insert
			into	comisiones (id_carrera, anio, division, turno)
			select  vID_CARRERA, pANIO, pDIVISION, pTURNO;

			select 'Comisión cargada con exito' mensaje , 0 error_code;  

	ELSEIF vID_CARRERA = 0
	THEN
		select 'Código de carrera erroneo.' mensaje, -1 error_code;
	ELSEIF vCHECK_ANIO = 0 
	THEN
		select 'Año fuera de rango.' mensaje, -2 error_code;
	ELSEIF vCHECK_DIVISION = 0
	THEN
		select 'División fuera de rango' mensaje, -3 error_code;
	ELSEIF vCHECK_TURNO = 0
	THEN
		select 'Turno indicado incorrecto' mensaje, -4 error_code;
    ELSEIF vEXISTE_COMISION <> 0
    THEN	
			select 'La comisión ya existe en el sistena.' mensaje, -5 error_code;
	END IF;

END