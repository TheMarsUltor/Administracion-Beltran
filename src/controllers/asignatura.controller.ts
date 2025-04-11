import { Response,Request } from "express";
import { Asignatura,IAsignatura } from "../models/asignaturas.models";
import { DBMessage, Util } from "../util/utl";


export async function Insert(req:Request, res:Response) {
    const   pParams:IAsignatura = req.body,
            instancia:Asignatura = new Asignatura(pParams),
            {error_code,mensaje} = <DBMessage> await instancia.insert();

    console.log(mensaje);
    

    if(error_code != 0)
        res.status(400).json({mensaje});
    else
        res.json({mensaje});
}

export async function Update(req:Request,res:Response) {
    console.log(req.params.id);
    

    if(!Util.Constraint.checkID(req.params.id)) {
        res.status(400).json({mensaje:'Parametro invalido (ID)'});
        return;
    }

    const   instancia = new Asignatura(<IAsignatura>req.body),
            responseSV = await instancia.update(parseInt(req.params.id));
    res.json(responseSV);
} 

export async function Delete(req:Request,res:Response) {
    if(!Util.Constraint.checkID(req.params.id)) {
        res.status(400).json({mensaje:'Parametro invalido (ID)'});
        return;
    }

    const   instancia = new Asignatura(<IAsignatura>req.body),
            responseSV = await instancia.delete(parseInt(req.params.id));
    res.json(responseSV);
} 

export async function loadPostForm (req:Request, res:Response) {
    res.json({html: await new Asignatura().renderPostForm()});
}

export async function loadPutForm (req:Request, res:Response) {
    try {
        if(!Util.Constraint.checkID(req.params.id))
            res.status(400).json({mensaje:'Parametro Invalido. (Id)'});
        
        const   model = new Asignatura(), 
                asignatura = await model.getByID(parseInt(req.params.id));
    
        const responseSV = {
            html: await model.renderPutForm(),
            entity: asignatura
        };
        console.log('response: ', responseSV);
        

         res.json(responseSV);
    } catch ( err ) {
        console.log(err);   
    }
}
