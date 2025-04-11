import { RowDataPacket } from "mysql2";
import { DBMessage, HTMLBuilder, Statements, Util } from "../util/utl";
import { Carrera } from "./carreras.models";


export interface IAsignatura {
    codigoCarrera:string,
    nombre:string,
    codigo:string
}


export class Asignatura implements Statements<IAsignatura>{
    model: IAsignatura = {nombre:'',codigo:'',codigoCarrera:''};

    constructor(m?:IAsignatura){
        if(m) this.model = m;
    }

    async insert (): Promise<DBMessage> {
        return <DBMessage>
        (
                await
                Util.ExecSQL<RowDataPacket>(
                        'CALL SP_INSERT_ASIGNATURA(?,?,?)',[
                            this.model.nombre,
                            this.model.codigo,
                            this.model.codigoCarrera
                        ]
                )
        )[0][0];
    }

    async getAll (){
        return <IAsignatura[]|DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>
            (
            "CALL SP_GET_ASIGNATURA(-1)",[]
            )
        )[0];
    }

    async getByID(id: number){
        const entity = <IAsignatura | DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket[]>
            (
            "CALL SP_GET_ASIGNATURA(?)",
            [id]
            )
        )[0][0];

        return entity;
    }

    async update(id: number) {
        return <DBMessage> 
        (
        await
        Util.ExecSQL<RowDataPacket>
            (
            "CALL SP_UPDATE_ASIGNATURA(?,?,?,?)",
            [
                id,
                this.model.nombre ,
                this.model.codigo ,
                this.model.codigoCarrera 
            ]
            )
        )[0][0];
    }
    
    async delete(id: number){
            return <DBMessage>
            (
                await
                Util.ExecSQL<RowDataPacket>
                    (
                    "CALL SP_DELETE_ASIGNATURA(?)",
                    [id]
                    )
            );
    }

    async renderPostForm () {
        const carreras = <RowDataPacket[]> await new Carrera().getAll();

        return HTMLBuilder()
        .renderForm 
                (
                    'post',
                    'asignaturas',
                    'Registar Asignatura',
                    [
                        {
                            name:'codigoCarrera',
                            type:'select',
                            msg:'Indique una Carrera',
                            placeholder:"Seleccionar",
                            templatedOPValues: HTMLBuilder().combobox(carreras, 
                                c => HTMLBuilder().optionGenerator(c.codigo,c.nombre))
                        },
                        {name:'nombre',msg:'Nombre de Asignatura',type:'text',placeholder:'Ingese el nombre de la asignatura'},
                        {name:'codigo', msg:'Código de Asignatura',type:'text',placeholder:'Ingrese una clave única'}
                    ]
                );
    }

    async renderPutForm() {
        const carreras = <RowDataPacket[]>  (await new Carrera().getAll());

        return HTMLBuilder().renderForm('put','asignaturas', 'Modificar Asignaturra',[
            {name:'id_asignatura', type:'hidden'},
            {
                name:'codigoCarrera',
                type:'select',
                msg:'Indique una Carrera',
                placeholder:"Seleccionar",
                templatedOPValues: HTMLBuilder().combobox(carreras, c => HTMLBuilder().optionGenerator(c.codigo,c.nombre))
            },
            {name:'nombre',msg:'Nombre de Asignatura',type:'text',placeholder:'Ingese el nombre de la asignatura'},
            {name:'codigo', msg:'Código de Asignatura',type:'text',placeholder:'Ingrese una clave única'}
        ])
    }

    static async renderTable() {
            const values = <RowDataPacket[]> await new Asignatura().getAll(),
                {BtnFormToInsert,renderSearchOptions,table,TableButtons} = HTMLBuilder(),
                hasError = (values[0])?.error_code != undefined;

            console.log("hay error? :", hasError);
        
            let html = (hasError)? `<div class="asignaturas">${BtnFormToInsert('asignatura')}<h1>No hay campos para cargar<h1></div>`
            :
            `<div class="asignaturas">
            ${
                BtnFormToInsert('asignatura')+
                renderSearchOptions([ "Carrera","Nombre","Codigo de asignatura"])
            }<table class="table">${
                await table<IAsignatura>
                (
                    ["Carrera","Nombre","Codigo","",""],
                    values,
                    entity=> `
                            <tr>
                                <input type="hidden" value=${entity.id} >
                                    <td>${entity.data.codigoCarrera}</td>
                                    <td>${entity.data.nombre}</td>
                                    <td>${entity.data.codigo}</td>
                                ${TableButtons}
                            </tr>`
                )
            }</tbody></table></div>`;


            return html;
    }
}