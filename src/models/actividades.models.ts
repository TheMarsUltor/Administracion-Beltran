import { RowDataPacket } from "mysql2";
import { DBMessage, HTMLBuilder, Statements, Util } from "../util/utl";
import { Aula } from "./aulas.models";
import { Asignatura } from "./asignaturas.models";
import { Profesor } from "./profesores.models";
import { Comision } from "./comisiones.models";

export enum DiasSemana {
    'LUN','MAR','MIE','JUE','VIE','SAB','DOM'
};

export interface IActividad {
    id_profesor:number,
    id_asignatura:number,
    id_aula:number,
    id_comision:number,
    hora:string,
    dia:DiasSemana
};

export class Actividad implements Statements<IActividad> {
    model: IActividad = {id_profesor: 0, id_asignatura:0,id_aula:0,id_comision:0,hora:'',dia:DiasSemana.DOM}; 

    private async TraerDatos() {
        return  {
                aulas:<RowDataPacket[]>await new Aula().getAll(),
                asignaturas:<RowDataPacket[]>await new Asignatura().getAll(),
                profesores: <RowDataPacket[]>await new Profesor().getAll(),
                comisiones: <RowDataPacket[]>await new Comision().getAll()
                };
    }


    constructor(m?:IActividad){
        if(m) this.model = m;
    }

    async insert(){
        return <DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>(
                "CALL SP_INSERT_ACTIVIDAD(?,?,?,?,?,?)",[
                    this.model.id_profesor,
                    this.model.id_asignatura,
                    this.model.id_comision,
                    this.model.id_aula,
                    this.model.hora,
                    this.model.dia
                ])
        )
    }

    async getAll () {
        return <IActividad[]|DBMessage> (await Util.ExecSQL<RowDataPacket[]>('CALL SP_GET_ACTIVIDAD(-1)',[]))[0];
    }
    async getByID (id: number) {
        return <IActividad|DBMessage> (await Util.ExecSQL<RowDataPacket[]>('CALL SP_GET_ACTIVIDAD(?)',[id]))[0][0];
    }
    async update (id: number) {
        return <DBMessage> (await Util.ExecSQL<RowDataPacket>('CALL SP_UPDATE_ACTIVIDAD(?,?,?,?,?,?,?)',[
            id,
            this.model.id_profesor,
            this.model.id_asignatura,
            this.model.id_comision,
            this.model.id_aula,
            this.model.hora,
            this.model.dia
        ]))[0][0]
    }
    async delete (id: number) {
        return <DBMessage> (await Util.ExecSQL<RowDataPacket>('CALL SP_DELETE_ACTIVIDAD(?)',[id]))[0];
    }

    async renderPostForm() {
        const   values = await this.TraerDatos(),
                {combobox,optionGenerator,renderForm} = HTMLBuilder();
        return renderForm(
            'post',
            'actividades',
            'Registar Actividad',[
                {
                    name:'id_aula',
                    type:'select',
                    msg:'Aula',
                    placeholder:'Seleccione el Aula',
                    templatedOPValues:
                     combobox(
                        values.aulas, 
                        e => optionGenerator(e.id,`Piso: ${e.piso},${e.tipo_aula} Nº${e.numero}`) )
                },
                {
                    name:'id_asignatura',
                    type:'select',
                    msg:'Asignatura',
                    placeholder:'Seleccione la Asignatura',
                    templatedOPValues:
                        combobox(
                            values.asignaturas,
                            e => optionGenerator(e.id,e.nombre) )
                },
                {
                    name:'id_profesor',
                    type:'select',
                    msg:'Profesor',
                    placeholder:'Seleccione al Profesor',
                    templatedOPValues:
                        combobox(
                            <RowDataPacket[]>(values.profesores)[0],
                            e => optionGenerator(e.id,`${e.nombre} ${e.apellido}`) )
                },
                {
                    name:'id_comision',
                    type:'select',
                    msg:'Comisión',
                    placeholder:'Seleccione la Comisión',
                    templatedOPValues:
                        combobox(
                            values.comisiones,
                            e => optionGenerator(e.id,`${e.comision} ${e.turno} ${e.carrera}`) )
                },
                {
                    name:'dia',
                    type:'select',
                    msg:'Día',
                    placeholder:'Seleccione el Día',
                    templatedOPValues:
                        combobox([
                            "LUN.Lunes",
                            "MAR.Martes",
                            "MIE.Miercóles",
                            "JUE.Jueves",
                            "VIE.Viernes",
                            "SAB.Sabádo",
                            "DOM.Domingo"
                        ],
                        itm => {
                            const [val, text] = itm.split('.');
                            return `<option value="${val}">${text}</option>`
                        })
                },
                {
                    name:'hora',
                    type:'select',
                    msg:'Horario',
                    placeholder:'Seleccione el Horario',
                    templatedOPValues: 
                        combobox(
                            ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
                            itm => optionGenerator(itm,itm)
                        ) 
                }
            ]
        )

    }

    async renderPutForm () {
        const   values = await this.TraerDatos(),
                {combobox, optionGenerator,renderForm} = HTMLBuilder();
        return  renderForm('put','actividades', 'Modificar Actividad',[
            {name:'id_actividad',type:'hidden'},
            {
                name:'id_aula',
                type:'select',
                msg:'Aula',
                templatedOPValues:
                    combobox(
                        values.aulas, 
                        e => optionGenerator(e.id,`Piso: ${e.piso},${e.tipo_aula} Nº${e.numero}`) )
            },
            {
                name:'id_asignatura',
                type:'select',
                msg:'Asignatura',
                templatedOPValues:
                    combobox(
                        values.asignaturas,
                        e => optionGenerator(e.id,e.nombre) )
            },
            {
                name:'id_profesor',
                type:'select',
                msg:'Profesor',
                templatedOPValues:
                    combobox(
                        values.profesores,
                        e => optionGenerator(e.id,`${e.nombre} ${e.apellido}`) )
            },
            {
                name:'id_comision',
                type:'select',
                msg:'Comisión',
                templatedOPValues:
                    combobox(
                        values.comisiones,
                        e => optionGenerator(e.id,`${e.comision} ${e.turno} ${e.carrera}`) )
            },
            {
                name:'dia',
                type:'select',
                msg:'Indique el Día',
                templatedOPValues:
                    combobox([
                        "LUN.Lunes",
                        "MAR.Martes",
                        "MIE.Miercóles",
                        "JUE.Jueves",
                        "VIE.Viernes",
                        "SAB.Sabádo"], 
                    itm => {
                        const [val, text] = itm.split('.');
                        return `<option value="${val}">${text}</option>`
                    })
            },
            {
                name:'hora',
                type:'select',
                msg:'Indicar Horario',
                templatedOPValues: 
                    combobox(
                        ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
                        itm => optionGenerator(itm,itm)
                    )
            }
        ])
    }

    static async renderTable(){
        const   values = <RowDataPacket[]> await new Actividad().getAll(),
                hayError = (values[0])?.error_code != undefined,
                {BtnFormToInsert,renderSearchOptions,table,TableButtons} = HTMLBuilder();

        let html = (hayError) ? `<div class="actividades" >${BtnFormToInsert('actividad')} <h1> No hay Registros para mostrar </h1>` :
        `<div class="actividades" >${BtnFormToInsert('actividad') + renderSearchOptions(["Día","Hora","Materia","Comisión","Profesor","Aula"])}
        </div>
        <table class="table">${ await table<{
            profesor:string,
            materia:string,
            comision:string,
            aula:string,
            dia:string,
            hora:string}> (
                ["Día","Hora","Materia","Comisión","Profesor","Aula","",""],
                values,
                entity =>`
                <tr>
                    <input type="hidden"  value=${entity.id} >
                    <td>${entity.data.dia}</td>
                    <td>${entity.data.hora}</td>
                    <td>${entity.data.materia}</td>
                    <td>${entity.data.comision}</td>
                    <td>${entity.data.profesor}</td>
                    <td>${entity.data.aula}</td>
                    ${TableButtons}
                </tr>`
            )}</tbody></table></div>`

        return html;
    }

}
