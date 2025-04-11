CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_UPDATE_COMISION`(
																	pID int, 
																	pANIO char(1) , 
																	pDIVISION CHAR(1),
																	pTURNO CHAR(3),
																	pCODIGO_CARRERA varchar(8)
																	)
BEGIN


DECLARE vID_CARRERA int;
DECLARE vCHECK_ANIO bool;
DECLARE vCHECK_DIVISION bool;
DECLARE vCHECK_TURNO bool;
DECLARE vCHECK_ID bool;

select 	coalesce(id_carrera, 0) 
into	vID_CARRERA
from	carreras
where	codigo = pCODIGO_CARRERA
  and	eliminado = 0; 

select	case 	when pANIO in ('1' , '2' ,'3' )
				then true 
				else false 
		end,
		case 	when pDIVISION in ('1' , '2' ,'3' )
				then true
				else false
		end,
		case 	when pTURNO in ('TM', 'TT', 'TN')
				then true 
				else false
		end
into	vCHECK_ANIO,vCHECK_DIVISION,vCHECK_TURNO;

select	count(*)
into	vCHECK_ID
from	comisiones c 
where	c.id_comision = pID
  and	c.eliminado = 0;


IF	vCHECK_ANIO AND 
	vCHECK_DIVISION AND 
	vCHECK_TURNO AND 
	(vID_CARRERA <> 0) AND 
	vCHECK_ID 
THEN
        update	comisiones
		set		anio = pANIO,
				division = pDIVISION,
				turno = pTURNO,
				id_carrera = vID_CARRERA
		where	id_comision = pID;

		select 'Comisión actualizada.' mensaje , 0 error_code; 
ELSEIF vID_CARRERA = 0
THEN
		select 'Error al actualizar Comisión. Carrera invalida.' mensaje, -1 error_code;
ELSEIF !vCHECK_ANIO
THEN
		select 'Error al actualizar Comisión. Año erroneo.' mensaje, -2 error_code;
ELSEIF !vCHECK_DIVISION 
THEN
		select 'Error al actualizar Comisión. División erronea.' mensaje, -3 error_code;
ELSEIF !vCHECK_TURNO
THEN
		select 'Error al actualizar Comisión. Turno Erroneo.' mensaje, -4 error_code;
ELSEIF !vCHECK_ID
THEN
		select 'Imposible Actualizar. El registro que intenta actualizar está eliminado.' mensaje , -5 error_code; 
END IF;


END