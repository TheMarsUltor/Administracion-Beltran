import { Request, Response, NextFunction } from "express";
import { Util, HTMLBuilder, tokenList} from "./utl";
import { Perfil } from "../models/perfiles.models";
import { RowDataPacket } from "mysql2";

async function CheckToken(refreshToken:string) {
    const resultado =( await Util.ExecSQL<RowDataPacket>("select count(*) resultado from sessions where refresh_token =? and finalizada = 0",[
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWxpYXMiOiJJdGJTaXN0IiwicGVyZmlsIjoiTUFTVEVSIiwiaWF0IjoxNzQwNjA2ODYxLCJleHAiOjE3NDA2MTA0NjF9.LxCp2j8E7LvfWrM2uRVgnghNbxr1REpT0SKYa2DivjA"
    ]));

    return resultado.resultado== 1 ;
}



export async function RefreshToken (req: Request, res:Response) {
    const {token,refreshToken} = req.body;
    console.log(req.body);
    const check = (await CheckToken(refreshToken))
    console.log(check);
    try {
        if(!token || !refreshToken)
            throw Error('Es necesario el token!');

        // evaluar si existe el refresh token en la base y en la lista de tokens

        if(refreshToken in tokenList ){
            // traer los datos del usuario de la base
            const user = (await Util.ExecSQL<RowDataPacket>('call sp_get_user_by_token(?)',[token]) )[0][0]
            // crear un nuevo token de sesion
            const newToken = Util.Token.encode(user,process.env.JWT_SECRET||'tokentest',{expiresIn:'15m'});
            // actualizar en lista de token, el token de sesion
            if (!tokenList[refreshToken]){
                tokenList[refreshToken] = {
                    id_usuario:parseInt(user[0].id_usuario),
                    status:'active',
                    token : newToken,
                    refreshToken
                }; 
            } else tokenList[refreshToken].token = newToken;

            Util.ExecSQL("update sessions set session_token = ?, expira_en= ? where session_token= ? ",[newToken,new Date().getTime(),refreshToken]);

            // devolver token nuevo u error
            res.json({token:newToken})
        }
        
    }catch (error){
        res.status(400).json({mensaje: error})
    }
}

export async function CheckEntity(req: Request, res: Response, next: NextFunction) {
    const entityList=[
		'comisiones','asignaturas',
		'aulas','profesores',
		'actividades','carreras',
		'perfiles','usuarios'
	];
	const entity = req.params.entity;
	const op = entityList.find((e)=>e === entity);
	
    
    if(!op) res.status(403).json({message:`Entidad ${entity} inexistente`});
	
	if(req.params.id)  req.params.id = req.params.id;
	
    req.params.entity =req.params.entity;
	
	req.body = req.body;
	next();
}

export async function Auth (req:Request, res:Response,next:NextFunction){
    const token = req.headers['authorization'];
    
    const {LoginForm} = HTMLBuilder();
    if( !token  ) {
        res.status(401).json({mensaje:'Sin token de Sesión.',html:LoginForm() })
    }
    
    try {
        /** 
         *      validar si el token sigue activo
         *      pertenece a una sesion activa
         *      no figura finalizada
         * */
        const {mensaje, error_code} = (
            await   Util.ExecSQL<RowDataPacket>(
                    'CALL SP_EVALUAR_SESSION(?,?)',
                    [
                        token,
                        new Date().getTime()
                    ]
            )
        )[0][0];

        console.log('session valida :   ',error_code,'\nmensaje: ', mensaje);

        if( error_code == -2 ){
            console.log(mensaje);
        }

        const jwtPayload = Util.Token.decode(<string>token,process.env.JWT_SECRET||'test-token')
        
        if (jwtPayload){
            res.locals.JwtPayload = jwtPayload;
            if(Object.entries(req.body).length != 0) 
                req.body = req.body;
        
            next();
        }
                
    } catch (error ) {
        console.log(error);
        res.status(500).json({mensaje:"Sesión invalida!", html:LoginForm()});
    }
    
}

export async function ViewHandler(req:Request,res:Response) {
    console.log("View Handler token Payload : ", res.locals.JwtPayload);
    const html = await Perfil.render(res.locals.JwtPayload.perfil)
    res.json({html, codigo:res.locals.JwtPayload.perfil});
    
}

