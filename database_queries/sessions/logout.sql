CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_LOGOUT`(pTOKEN varchar(512))
BEGIN

update	sessions
set		  finalizada = 1
where	  session_token = pTOKEN;

END
