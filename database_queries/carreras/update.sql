CREATE DEFINER=`root`@`localhost` 
PROCEDURE `SP_UPDATE_CARRERA`	(
				pID int, 
				pNOMBRE varchar(64),
				pCODIGO varchar(8), 
				pFECHA_VIGENTE bigint, 
				pDURACION 	char(1),
				pLAPSO		varchar(5) ,
				pVIGENTE	int 
				)
BEGIN

	DECLARE vID_VALIDO 	bool; 
	DECLARE vCHECK_NOMBRE 	bool;
	DECLARE vCHECK_CODIGO 	bool;
	DECLARE vCHECK_LAPSO 	bool;

		select	case    when count(*) = 1	
						then true
						else false
				end
		into	vID_VALIDO
		from	carreras
		where	id_carrera = pID
		and	eliminado = 0;

		select 	case    when LENGTH(pNOMBRE) >= 8 
						then true
						else false
				end,
		case    when LENGTH(pCODIGO) >= 2 and pCODIGO not in (select codigo from carreras where id_carrera <> pID and eliminado = 0) 
			then true
			else false
		end,
		case	when pLAPSO in ('Años', 'Meses') then true else  false end
		into	vCHECK_NOMBRE, vCHECK_CODIGO, vCHECK_LAPSO;



	IF vID_VALIDO AND vCHECK_NOMBRE AND vCHECK_CODIGO AND vCHECK_LAPSO
	THEN
		update 	carreras
		set 	nombre = pNOMBRE,
			codigo = pCODIGO,
			fecha_vigente = pFECHA_VIGENTE,
			duracion = pDURACION,
			lapso = pLAPSO
		where	id_carrera = pID;

		select 'Carrera actualizada correctamente.' mensaje, 0 error_code;
	ELSEIF !vID_VALIDO 
	THEN
		select 'No se puede actualizar un registro eliminado.' mensaje, -1 error_code;
	ELSEIF !vCHECK_NOMBRE
	THEN
		select 'El campo CARRERAS.NOMBRE no cumple con la longitud minima de 10 caracteres.' mensaje, -2 error_code; 
	ELSEIF !vCHECK_CODIGO  
	THEN
		select 	concat 	(
				'El Campo CARRERAS.CODIGO ',
				case 	when LENGTH(pCODIGO) < 2 
					then 'no cumple con la longitud minima de 2 caracteres'
					else  'ya existe una carrera vigente con este codigo' 
				end ,'.'	
				) mensaje, 
			-2 	error_code;
	ELSEIF	!vCHECK_LAPSO
	THEN
		select 'El Campo CARRERAS.LAPSO solo admite los valores "Años" y "Meses".' mensaje , -4 error_code;
	END IF;

END