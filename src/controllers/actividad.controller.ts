import { Response,Request } from "express";
import { IActividad,Actividad } from "../models/actividades.models";
import { DBMessage, Util, } from "../util/utl";


const evaluarIDs =  (
                    id_profesor:string,
                    id_asignatura:string,
                    id_aula:string,
                    id_comision:string
                    ) =>
                    {
                        return 
                        (
                                Util.Constraint.checkID(id_profesor) &&
                                Util.Constraint.checkID(id_asignatura) &&
                                Util.Constraint.checkID(id_aula) &&
                                Util.Constraint.checkID(id_comision) 
                        );
                    }

export async function Insert(req:Request, res:Response) {
    const   pParams:IActividad = req.body,
            instancia:Actividad = new Actividad(pParams),
            {error_code,mensaje} = <DBMessage> await instancia.insert();
    
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

    const   instancia = new Actividad(<IActividad>req.body),
            responseSV = await instancia.update(parseInt(req.params.id));
    res.json(responseSV);
} 

export async function Delete(req:Request,res:Response) {
    if(!Util.Constraint.checkID(req.params.id)) {
        res.status(400).json({mensaje:'Parametro invalido (ID)'});
        return;
    }

    const   instancia = new Actividad(<IActividad>req.body),
            responseSV = await instancia.delete(parseInt(req.params.id));
    res.json(responseSV);
} 

export async function loadPostForm (req:Request, res:Response) {
    res.json({html: await new Actividad().renderPostForm()});
}

export async function loadPutForm (req:Request, res:Response) {
    try {
        if(!Util.Constraint.checkID(req.params.id))
            res.status(400).json({mensaje:'Parametro Invalido. (Id)'});
        
        const   model = new Actividad(), 
                actividad = await model.getByID(parseInt(req.params.id));
    
        const responseSV = {
            html: await model.renderPutForm(),
            entity: actividad
        };
        
        console.log('response: ', responseSV);
        res.json(responseSV);
    } catch ( err ) {
        console.log(err);   
    }
}
