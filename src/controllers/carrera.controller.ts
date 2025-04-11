    import { Response,Request } from "express";
    import { Carrera , ICarrera} from "../models/carreras.models";
    import { Util} from "../util/utl";
    
    
    export async function loadPostForm (req:Request, res:Response){
        try{
            const html = await new Carrera().renderPostForm();
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
                res.status(400).json({mensaje:'Forrmato de Id incorrecto!'});
                return;
            }
            
            const   id = parseInt(req.params.id), 
                    model = new Carrera(),
                    p = await model.getByID(id)
        
            const result = {html: await model.renderPutForm(),entity: p };
            console.log(result);
        
            res.json(result)
        } catch (err) {
            console.error(err);
            res.status(400).json(err);
        }
        
    }
    
    export async function Insert(req:Request,res:Response) :Promise<void> {
        try {
            const   pParams:ICarrera = req.body,
                    instancia:Carrera = new Carrera(pParams),
                    msg = await instancia.insert();
        
            if(msg.error_code !=0)
                res.status(400).json({mensaje:msg.mensaje})
            else
                res.json({mensaje:msg.mensaje});
        } catch(err){
            console.log(err);
            
        }
    }
    
    export async function Update (req:Request, res:Response) {
        try{
            if(!Util.Constraint.checkID(req.params.id)  ) 
                res.status(400).json('Parametro invalido (Id)');
            
            const   instancia =  new Carrera(<ICarrera>req.body),
                    responseSV =  await instancia.update(parseInt(req.params.id));
            res.json(responseSV);
        } catch (err) {
            console.error(err);
            res.status(400).json(err);
        }
    }
    
    export async function Delete (req:Request, res:Response) {
        try {
            if(!Util.Constraint.checkID(req.params.id) ) 
                res.status(400).json('Parametro invalido (Id)');
            
            const   instancia =  new Carrera(),
                    responseSV =  await instancia.delete(parseInt(req.params.id));
            res.json(responseSV);
        } catch (err) {
            console.error(err);
            res.status(400).json(err);
        }
    }
