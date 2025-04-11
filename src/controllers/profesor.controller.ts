import { Response,Request } from "express";
import {  Profesor, IProfesor} from "../models/profesores.models";
import { Util } from "../util/utl";
import { RowDataPacket } from "mysql2";

export async function loadPostForm (req:Request, res:Response){
    try{
        const html = await new Profesor().renderPostForm();
        res.json({html});
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
}

export async function loadPutForm (req:Request, res:Response){
    console.log("params ",req.params);
    try {
        if (!Util.Constraint.checkID(req.params.id)) {
            res.status(400).json({mensaje:'Formato de Id incorrecto!'});
            return;
        }

        const   id = parseInt(req.params.id), 
                model = new Profesor(),
                p = await model.getByID(id)
    
        const result = {html: await model.renderPutForm(),entity: (<RowDataPacket>p)[0][0] };
    
        res.json(result)
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
    
}

export async function Insert(req:Request, res:Response) {
    console.log("Params: ",req.body);
    
    try{
        const   pParams:IProfesor = req.body,
                instancia: Profesor = new Profesor(pParams),
                {error_code, mensaje} = await instancia.insert();

        if (error_code != 0)
            res.status(400).json({mensaje});
        else 
            res.json({mensaje});
    }catch(err){
        console.log(err);
    }
}

export async function Update (req:Request, res:Response) {
    try{
        if(!Util.Constraint.checkID(req.params.id)){
            res.status(400).json({mensaje:"Parametro invalido!"});
            return;
        }

        const   instancia = new Profesor(<IProfesor>req.body),
                responseSV = await instancia.update(parseInt(req.params.id));
        
        res.json(responseSV)
    }catch(err){
        console.error(err);
        res.status(400).send(err);

    }
}

export async function Delete(req:Request,res:Response) {
    try{
        if(!Util.Constraint.checkID(req.params.id)){
            res.status(400).json({mensaje:'Parametro Invalido'});
            return;
        }

        const   instancia = new Profesor(),
                responseSV = await instancia.delete(parseInt(req.params.id));
        res.json(responseSV);

    }catch(err){
        console.error(err);
        res.status(400).json(err);
    }
}