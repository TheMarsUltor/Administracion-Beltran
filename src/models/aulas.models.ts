import { RowDataPacket } from "mysql2";
import { DBMessage,HTMLBuilder,Statements,Util } from "../util/utl";

export interface IAula {
    id_aula?:number,
    tipo_aula:string,
    piso:number,
    numero:number
};


export class Aula implements Statements<IAula>{
    model: IAula ={tipo_aula:'',piso:0,numero:0};

    constructor(m?:IAula) {
        if(m) this.model = m;
    }

    async insert () : Promise<DBMessage>{
        return <DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>(
                "CALL SP_INSERT_AULA(?,?,?)",[
                    this.model.tipo_aula,
                    this.model.numero,
                    this.model.piso
                ]   
            )
        )[0][0];
    }

    async getAll () {
        return <IAula[]|DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>
            (
                "CALL SP_GET_AULA(-1)",[]
            )
        )[0];
    }

    async getByID (id: number) {
        return  <IAula | DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>
            (
                "CALL SP_GET_AULA(?)",
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
                "CALL SP_UPDATE_AULA(?,?,?,?)",
                [
                    id,
                    this.model.tipo_aula,
                    this.model.piso,
                    this.model.numero
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
                "CALL SP_DELETE_AULA(?)",
                [id]
            )
        )[0][0];
    }

    async renderPostForm () {
        return HTMLBuilder()
        .renderForm('post','aulas','Registrar Aula',[
            {
                name:'tipo_aula',
                type:'select',
                msg:'Indique el Tipo de Aula',
                placeholder:"Seleccionar",
                templatedOPValues:
                HTMLBuilder().combobox(
                    ["AULA","LABORATORIO", "AUDITORIO","OFICINA"], 
                        itm=> `<option value="${itm}">${itm}</option>`
                )
            },
            {name:'piso',type:'number',placeholder:'indique el número de piso',msg:'Número de Piso'},
            {name:'numero',type:'number',placeholder:'Indique el número del Aula', msg:'Número de Aula'}
        ])    
    }

    async renderPutForm () {
        return HTMLBuilder()
        .renderForm('put','aulas','Actualizar Aula',[
            {name:'id_aula', type:'hidden'},
            {
                name:'tipo_aula',
                type:'select',
                msg:'Indique el Tipo de Aula',
                templatedOPValues:
                HTMLBuilder().combobox(
                    ["AULA","LABORATORIO", "AUDITORIO","OFICINA"], 
                        itm=> `<option value="${itm}">${itm}</option>`
                )
            },
            {name:'piso',type:'number',placeholder:'Piso'},
            {name:'numero',type:'number',placeholder:'Número de Aula'}

        ])
    }

    static async renderTable(){
        const 
            values = <RowDataPacket[]> await new Aula().getAll(),
            hasError = (values[0])?.error_code != undefined,
            {BtnFormToInsert,renderSearchOptions,table,TableButtons} = HTMLBuilder();
        
        let html=(hasError)?`<div class="aulas">${
            BtnFormToInsert('aula')
        }<h1>No Hay Datos para cargar</h1>`
        :
        `<div class="aulas">${
            BtnFormToInsert('aula')+
            renderSearchOptions(["Tipo Aula","Piso","Número"])
        }<table class="table">${
            await table<IAula>(
                ["Tipo Aula","Piso","Número","",""],
                values,
                entity => `<tr> <input type="hidden" value=${entity.id} >    <td>${entity.data.tipo_aula}</td>     <td>${entity.data.piso}</td>     <td>${entity.data.numero}</td> ${TableButtons}</tr>`
            )
        }</tbody> </table> </div>`;
        return html;
    }

}