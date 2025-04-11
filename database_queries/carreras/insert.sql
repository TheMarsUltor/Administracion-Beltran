CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_INSERT_CARRERA`(
				pNOMBRE     VARCHAR(64),
				pCODIGO     VARCHAR(6),
				pFECHA      BIGINT,
				pDURACION   INT,
				pLAPSO      CHAR(6)
				)
BEGIN

	DECLARE vEXISTE INT;

	select  count(*)
	into    vEXISTE
	from    carreras 
	where   codigo = pCODIGO
	  and	eliminado = 0;

	IF vEXISTE = 0
	THEN

		insert
		into    carreras(
				nombre,
				codigo,
				fecha_vigente,
				duracion,
				lapso,
				vigente
				)
		values  (
			pNOMBRE,
			pCODIGO,
			pFECHA,
			pDURACION,
			pLAPSO,
			true
			);

		select 'Carrera creada correctamente' mensaje, 0 error_code ;

	ELSEIF vEXISTE <> 0
	THEN
		select 'El codigo de carrera debe ser único' mensaje , -1 error_code;
	END IF;

END	