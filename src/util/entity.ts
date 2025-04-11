import { Request, Response } from "express";
import { Util, HTMLBuilder } from "./utl";
import { RowDataPacket } from "mysql2";
import { Perfil } from "../models/perfiles.models";
import { Usuario } from "../models/usuarios.models";
import { Profesor } from "../models/profesores.models";
import { Carrera } from "../models/carreras.models";
import { Asignatura } from "../models/asignaturas.models";
import { Aula } from "../models/aulas.models";
import { Comision } from "../models/comisiones.models";
import { Actividad } from "../models/actividades.models";


const EntityFields =
[
	{entidad:'perfiles',fields:["nombre","codigo"],example:`supervisor  A-SUP
administrador ADM`},
	{entidad:'aulas',fields:["tipo_aula","numero","piso"],example:`LABORATORIO    32    3
AULA    33   3`},
	{entidad:'carreras',fields:["nombre","codigo","fecha_vigente","duracion","lapso"],example:`carrera_1    EJMP_1  01/01/1990  3   AÑOS
carrera_2    EJMP_2  01/01/1990  3   AÑOS`},
	{entidad:'asignaturas',fields:["codigo_carrera","nombre","codigo"],
        example:`COD_CAR-1   asignatura1 CC1-ASIG1
COD_CAR-2   asignatura2 CC2-ASIG2`},
	{entidad:'comisiones',fields:["codigo_carrera","anio","division","turno"],example:`COD_CAR-1    1   1   TM
COD_CAR-1    1   2   TM`},
	{entidad:'profesores',fields:["nombre","apellido","email", "estado"],example:`Manuel    Estrada mestrada@itbeltran.com.ar   ACTIVO
Pedro   Palacios    ppalacios@itbeltran.com.ar`},
	{
        entidad:'actividades',
        fields:[
                "email_profesor",
                "codigo_asignatura",
                "piso",
                "comision",
                "hora",
                "dia"
            ],
        example:`mestrada@itbeltran.com.ar  CC1-ASIG1   32  1º1TM   09:00   LUN`
    }
];
const getEntity = (entity:string) => (EntityFields.filter((e) => e.entidad == entity )[0]);

export async function EntityTable (req:Request, res:Response){
    console.log('entidad: ',req.params.entity);
    const entity = {
        GetTable: async (entidad:string) => {
            const {resultado} = (await Util.ExecSQL<RowDataPacket>('CALL SP_CHECK_ENTITY(?)',[
                entidad
            ])) [0][0];

            if (resultado == 1) {
                let html:string = '';

                switch(entidad)
                {
                    case 'perfiles':    html = await Perfil.renderTable();  break;
                    case 'usuarios':    html = await Usuario.renderTable();  break;
                    case 'profesores':  html = await Profesor.renderTable();  break;
                    case 'carreras':    html = await Carrera.renderTable();  break;
                    case 'asignaturas': html = await Asignatura.renderTable();  break;
                    case 'aulas':       html = await Aula.renderTable();  break;
                    case 'comisiones':  html = await Comision.renderTable();  break;
                    case 'actividades': html = await Actividad.renderTable();  break;
                };
                return {html};
            }
            
        }
    }
    res.json(await entity.GetTable(req.params.entity))
}


export async function CargaMasivaForm(req:Request,res:Response) {
    const   {Title,ButtonGroup} = HTMLBuilder(),
                
    render = (entity:string) => `
    <div class="${entity}"> ${Title("Carga Masiva de "+ entity)} 
    ${(entity.toLowerCase() == 'usuarios')? '' :
        `<details>
        <summary>Confección del archivo</summary>
        <ul>
        <li>El archivo debe tener la codificación de caracteres ASCII y debe tener el formato '.txt'.</li>
        <li>La primer linea del archivo deben estar los campos indicados (Para esta entidad, los campos son ${
        getEntity(entity).fields.toString().toUpperCase() } ]) separados mediante tabulación y <strong>¡Todos en ese orden!</strong>.</li>
        <li>Cada linea, hace referencia a un registro a crear y cada campo debe estar separado por 1 Tabulación(TAB).</li>
        <li>Ejemplo para la entidad la entidad '${entity}' :</li>
        <pre>${
            (() => {
                const {fields,example} =  getEntity(entity); 
                return `${fields.toString().replaceAll(',','    ').toUpperCase()+'\n'+example}`;
                })()
                }</pre>
        </ul>
                </details>` 
    }
    <form method="post">
    ${(entity.toLowerCase() == 'usuarios') ? `<div> <p>La carga masiva de Usuarios esta deshabilitada.</p> </div>` :`<div class="form-input" ><input type="file" name="archivo" required></div>`}
        ${ButtonGroup("Cargar Archivo")}
        </form>
    </div>`,
    html =render(req.params.entity); 
    res.json({html});
}

export async function CargaMasivaProcesamiento(req:Request, res:Response) {

    const   archivo = (req.body.fileContent), 
            entidad = req.params.entity, 
            filas = archivo.split('\r\n'),
            {resultado} =   (
                            await
                            Util.ExecSQL<RowDataPacket>(
                                "select count(*) resultado from information_schema.columns where table_schema = 'beltran_adm_sistema' and	table_name =? and column_name in (?)",
                                [
                                    entidad,
                                    filas[0].split('\t')
                                ])
                            ) [0],
            {call_sp_insert} = (await Util.ExecSQL<RowDataPacket>(
        `select concat	('CALL SP_INSERT_', 
                    case LOWER(?) 
						when 'perfiles'     THEN 'PERFIL(?)'
                        when 'profesores'   THEN 'PROFESOR(?)'
                        when 'carreras'     THEN 'CARRERA(?)'
                        when 'comisiones'   THEN 'COMISION(?)'
                        when 'aulas'        THEN 'AULA(?)'
                        when 'asignaturas'  THEN 'ASIGNATURA(?)'
                        when 'actividades'  THEN 'ACTIVIDAD2(?)'
				end
                ) call_sp_insert`,[entidad]))[0],
        cabecera:string =  filas[0];
    
        console.log(getEntity(entidad).fields.toString(),'\n',cabecera.replaceAll('\t',',').toLocaleLowerCase());
        


    if (resultado != cabecera.split('\t').length || (cabecera.replaceAll('\t',',').toLocaleLowerCase() !== getEntity(entidad).fields.toString())  ) {
        res.status(400).json({mensaje:"Hay un error en la definición de los campos, ubicados en la primer fila del archivo.\nRecuerde que deben estar como se muestra en el ejemplo."});
        return;
    }
    
    for (let i = 1; i<filas.length; i++ ) {

        let data = filas[i].split('\t')

        if(data.length != resultado){
            res.status(400).json({mensaje:`Error al procesar la fila número: ${i}.\nEs posible que el archivo no esta formateado correctamente o sobren/falten campos para ingresar.\nDATA: ${data}`});
            return;
        }

        let resultado_operacion = ( await Util.ExecSQL<RowDataPacket>(call_sp_insert,[data]))[0][0];

        if(resultado_operacion.error_code !== 0){
            const msg ='Falló al insertar registro número '+ i +'.\n'+ resultado_operacion.mensaje+'.\n'+''+'\nSe eliminarán los registros insertados.';
            if( i !== 1) {
                const resultado_operacion2 = (await Util.ExecSQL<RowDataPacket>('CALL SP_DELETE_ENTITY_LAST_INSERTED(?,?)',[entidad,i-1]))
                console.log("campos eliminados: ", resultado_operacion2);
            }

            res.status(400).json({mensaje:msg})
            return;
        }
        
    }

    res.json({mensaje:("Se han cargado los datos exitosamente!\nSe han añadido "+ (filas.length-1)+ " registros nuevos a la entidad "+ entidad+".")})    
    
}
