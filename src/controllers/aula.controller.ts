import { Response,Request } from "express";
import {  Aula,IAula as IAula } from "../models/aulas.models";
import { DBMessage, Util } from "../util/utl";


export async function Insert(req:Request, res:Response) {
    const   pParams:IAula = req.body,
            instancia:Aula = new Aula(pParams),
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

    const   instancia = new Aula(<IAula>req.body),
            responseSV = await instancia.update(parseInt(req.params.id));
    res.json(responseSV);
} 

export async function Delete(req:Request,res:Response) {
    if(!Util.Constraint.checkID(req.params.id)) {
        res.status(400).json({mensaje:'Parametro invalido (ID)'});
        return;
    }

    const   instancia = new Aula(<IAula>req.body),
            responseSV = await instancia.delete(parseInt(req.params.id));
    res.json(responseSV);
} 

export async function loadPostForm (req:Request, res:Response) {
    res.json({html: await new Aula().renderPostForm()});
}

export async function loadPutForm (req:Request, res:Response) {
    try {
        if(!Util.Constraint.checkID(req.params.id))
            res.status(400).json({mensaje:'Parametro Invalido. (Id)'});
        
        const   model = new Aula(), 
                aula = await model.getByID(parseInt(req.params.id));
    
        const responseSV = {
            html: await model.renderPutForm(),
            entity: aula
        };
        console.log('response: ', responseSV);
         res.json(responseSV);
    } catch ( err ) {
        console.log(err);   
    }
}
