import { RowDataPacket } from "mysql2";
import { DBMessage,HTMLBuilder,Statements,Util } from "../util/utl";
import { Carrera } from "./carreras.models";

export interface IComision {
    id_comision?:number,
    codCarrera?:string,
    anio:string,
    division:string,
    turno:string
};


export class Comision implements Statements<IComision> {
    model: IComision={codCarrera:'',anio:'',division:'',turno:''};

    constructor(m?:IComision) {
        if(m) this.model = m;
    }


    async insert () : Promise<DBMessage>{
        return <DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>(
                "CALL SP_INSERT_COMISION(?,?,?,?)",[
                    this.model.anio,
                    this.model.division,
                    this.model.turno,
                    this.model.codCarrera
                ]
            )
        )[0][0];
    }
    
    async getAll () {
        return <IComision[]|DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>
            (
                "CALL SP_GET_COMISION(-1)",[]
            )
        )[0];
    }

    async getByID (id: number) {
        return  <IComision | DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>
            (
                "CALL SP_GET_COMISION(?)",
                [id]
            )
        )[0][0];
    }

    async update (id: number) {
        return <DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>
            (
                "CALL SP_UPDATE_COMISION(?,?,?,?,?)",
                [
                    id,
                    this.model.anio,
                    this.model.division,
                    this.model.turno,
                    this.model.codCarrera
                ]
            )
        )[0][0];
    }
    
    async delete (id: number) {
        return <DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>
            (
                "CALL SP_DELETE_COMISION(?)",
                [id]
            )
        )[0][0];
    }

    async renderPostForm () {
        const carreras = <RowDataPacket[]> await new Carrera().getAll(),
        {renderForm,combobox,optionGenerator} = HTMLBuilder();

        return  renderForm(
            "post",
            'comisiones',
            'Registrar Comisión',
            [
                {
                    name:'anio',
                    type:'select',
                    msg:'Año',
                    placeholder:'Indique el año de la Comisión',
                    templatedOPValues:
                        combobox(
                            [1,2,3],
                            itm=>`<option value="${itm}">${itm}</option>`
                        )
                },
                {
                    name:'division',
                    type:'select',
                    msg:'División',
                    placeholder:'Indique la división',
                    templatedOPValues:
                        combobox(
                            ["1ra","2da","3ra"],
                            itm=>`<option value="${itm[0]}">${itm}</option>`
                        )
                },
                {
                    name:'turno',
                    type:'select',
                    msg:'Turno',
                    placeholder:'Seleccione el turno',
                    templatedOPValues:
                        combobox(
                            ["TM.Mañana","TT.Tarde","TN.Noche"],
                            itm=>{
                                const [val,text] = itm.split('.');
                                return `<option value="${val}">${text}</option>`
                            }
                        )
                },
                {
                    name:'codCarrera',
                    type:'select',
                    msg:'Carrera',
                    placeholder:"Indique la carera correspondiente",
                    templatedOPValues:
                        combobox(
                            carreras,
                            (c)=>optionGenerator(c.codigo, c.nombre)
                        )
                }
            ]
        )
    }

    async renderPutForm () {
        const   carreras = <RowDataPacket[]> await new Carrera().getAll(),
                {renderForm,combobox,optionGenerator} = HTMLBuilder();
        return renderForm(
            'put',
            'comisiones',
            'Modificar Comisión',
            [
                {name:'id_comision',type:'hidden'},
            {
                name:'anio',
                type:'select',
                msg:'Año',
                templatedOPValues:
                    HTMLBuilder().combobox(
                        [1,2,3],
                        itm=>`<option value="${itm}">${itm}</option>`
                    )
            },
            {
                name:'division',
                type:'select',
                msg:'División',
                templatedOPValues:
                    HTMLBuilder().combobox(
                        ["1ra","2da","3ra"],
                        itm=>`<option value="${itm[0]}">${itm}</option>`
                    )
            },
            {
                name:'turno',
                type:'select',
                msg:'Turno',
                templatedOPValues:
                    HTMLBuilder().combobox(
                        ["TM.Mañana","TT.Tarde","TN.Noche"],
                        itm=>{
                            const [val,text] = itm.split('.');
                            return `<option value="${val}">${text}</option>`
                        }
                    )
            },
            {
                name:'codCarrera',
                type:'select',
                msg:'Carrera',
                templatedOPValues:
                    HTMLBuilder().combobox(
                        carreras,
                        (c)=>HTMLBuilder().optionGenerator(c.codigo, c.nombre)
                    )
            }
            ]
        )
    }

    static async renderTable() {
        const   values = <RowDataPacket[]> await new Comision().getAll(),
                {BtnFormToInsert,renderSearchOptions,table,TableButtons} = HTMLBuilder(),
                hayError = (values[0])?.error_code != undefined;
    
        let html = (hayError)? `<div class="comisiones" >${BtnFormToInsert('comision')}<h1>No hay campos para cargar<h1></div>`:
        `<div class="comisiones" > ${
            BtnFormToInsert('comisión')
            +
            renderSearchOptions(['Carrera','Comisión','Turno'])
        }<table class="table">${
            await 
            table<{
                comision:string,
                turno:string,
                carrera:string
            }>(
                ["Carrera","Comisión","Turno"],
                values,
                entity => `<tr>
                    <input type="hidden" value=${entity.id} >
                    <td>${entity.data.carrera}</td> 
                    <td>${entity.data.comision}</td> 
                    <td>${entity.data.turno}</td> 
                    ${TableButtons}
                </td>`
            )
        }</tbody></table></div>`;

        return html;
    }

}