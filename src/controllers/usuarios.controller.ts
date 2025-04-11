import { Response,Request } from "express";
import { IUser, Usuario, LoginSession,Session } from "../models/usuarios.models";
import { DBMessage, HTMLBuilder, Util } from "../util/utl";
import { RowDataPacket } from "mysql2";


export async function LoginForm (req: Request, res:Response){
    const html = HTMLBuilder().LoginForm();
    
    if(!html || html.length == 0 )
        res.status(500).json({error_code:-1,mensaje:'Error interno!\nPor favor comuniquese al +549 1234 5678 o puede escribirnos al #SOPORTE_EMAIL# para poder mejorar el servicio.'})
    else 
        res.json({html, error_code :0 }) 
}

export async function Login(req:Request,res:Response){
    const credenciales : LoginSession = req.body,
        {result} = await Usuario.signIn(credenciales);

    if(result.error_code != 0){
        res.status(400).json({mensaje:result.mensaje, error_code:result.error_code});
        return;
    }
    res.json({
            token:result.token,
            refreshToken:result.refreshToken,
            mensaje:"Sesión iniciada correctamente!"
            });
}

export async function Logout(req:Request,res:Response){
    await Usuario.logout(req,res);
} 

export async function loadPostForm(req:Request, res:Response ) {
    const html = await new Usuario().renderPostForm();
    res.json({html})
}

export async function Insert(req:Request, res:Response) {
    try {
        
        console.log("response :  ",req.body ); 

        const   pParams:IUser = req.body,
                msg = await new Usuario(pParams).insert()
        if(msg.error_code != 0 )
            throw Error(msg.mensaje);
    
        res.json({mensaje:msg.mensaje});
    } catch(error) {
        console.log(error);
        res.status(400).json({mensaje:error});
    }
}

export async function loadPutForm(req:Request, res:Response) {
    try {

        if(! Util.Constraint.checkID(req.params.id)){
            res.status(400).json({mensaje:"Parametro erroneo (ID)."});
            return;
        }
        const   model = new Usuario(),
        usuario = await model.getByID(parseInt(req.params.id));
        const html = await model.renderPutForm()
        console.log(html);
        if ((<RowDataPacket>usuario).error_code != 0 )
            res.status(404).json({mensaje:(<DBMessage>usuario).mensaje});
        else {
            const c = {
                html,
                entity: {
                    id_usuario:(<IUser>usuario).id_usuario,
                    nombre_completo:(<IUser>usuario).nombre_completo,
                    alias:(<IUser>usuario).alias,
                    email:(<IUser>usuario).email,
                    perfil:(<IUser>usuario).perfil
                }
            };
        
            res.json(c)
        }
    } catch (err) {
        console.log(err);
        
    }
}


export async function Update(req:Request,res:Response){
    if(!Util.Constraint.checkID(req.params.id)){
        res.status(400).json({mensaje:'Parametro invalido. (Id)'})
        return;
    }
    try {
        const   instancia =  new Usuario(<IUser>req.body),
                responseSV =  await instancia.update(parseInt(req.params.id));
        console.log(responseSV);
        
        res.json(responseSV);
    } catch(error){
        console.error(error);
        res.status(500).json({mensaje:error});
    }
}


export async function Delete(req:Request, res:Response) {
    try {
           if(!Util.Constraint.checkID(req.params.id) ) 
               res.status(400).json('Parametro invalido (Id)');
           
           const   instancia =  new Usuario(),
                   responseSV =  await instancia.delete(parseInt(req.params.id));
           res.json(responseSV);
    } catch (err) {
           console.error(err);
           res.status(400).json(err);
    }
   
}
