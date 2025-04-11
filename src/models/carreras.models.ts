import { RowDataPacket } from "mysql2";
import { DBMessage, HTMLBuilder, Statements, Util } from "../util/utl";



export interface ICarrera {
    id_carrera?:number,
    nombre:string,
    codigo:string,
    fecha_vigente:number,
    duracion?:number,
    lapso?:number,
    vigente?:boolean
}


export class Carrera implements Statements<ICarrera>{
    model: ICarrera = {nombre:'',codigo:'',fecha_vigente:0};

    constructor(m?:ICarrera){
        if(m) this.model = m;
    }
    async insert (): Promise<DBMessage> {
        console.log('fecha : ',this.model.fecha_vigente);


        return <DBMessage>
        (
                await
                Util.ExecSQL<RowDataPacket>(
                        'CALL SP_INSERT_CARRERA(?,?,?,?,?)',[
                            this.model.nombre,
                            this.model.codigo,
                            this.model.fecha_vigente,
                            this.model.duracion,
                            this.model.lapso
                        ]
                )
        )[0][0];
    }

    async getAll (){
        return <ICarrera[]|DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket>
            (
            "CALL SP_GET_CARRERA(-1)",[]
            )
        )[0];
    }

    async getByID(id: number){
        return <ICarrera | DBMessage>
        (
            await
            Util.ExecSQL<RowDataPacket[]>
            (
            "CALL SP_GET_CARRERA(?)",
            [id]
            )
        )[0][0];
    }

    async update(id: number) {
        console.log('fecha : ',this.model.fecha_vigente);

        return <DBMessage> 
        (
        await
        Util.ExecSQL<RowDataPacket>
            (
            "CALL SP_UPDATE_CARRERA(?,?,?,?,?,?,?)",
            [
                id,
                this.model.nombre ,
                this.model.codigo ,
                this.model.fecha_vigente ,
                this.model.duracion ,
                this.model.lapso,
                this.model.vigente 
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
                    "CALL SP_DELETE_CARRERA(?)",
                    [id]
                    )
            );
    }
    
    async renderPostForm () {
        
        return HTMLBuilder()
        .renderForm 
                (
                    'post',
                    'carreras',
                    'Registar carrera',
                    [
                        {
                            name:'nombre',
                            type:'text',
                            msg:'Nombre',
                            placeholder:'Nombre de la carrera'
                        },
                        {
                            name:'codigo',
                            constraintField:' min="3" max="8" ',
                            placeholder:'Defina un codigo único',
                            msg:"Código",
                            type:"text"
                        },
                        {
                            name:'fecha_vigente',
                            type:"date",
                            msg:"Fecha de aprobación"
                        },
                        {
                            name:'duracion',
                            type:'number',
                            constraintField:' min="1" max="12" ',
                            msg:'Duración:',
                            placeholder:'Duracion'
                        },
                        {
                            name:'lapso',
                            type: 'select',
                            msg:'Lapsos:',
                            placeholder:'Seleccione el tipo de lapso',
                            templatedOPValues:
                                HTMLBuilder()
                                .combobox(
                                    ["MESES.meses","AÑOS.años"],
                                    itm => {
                                        const [val,text] = itm.split('.');
                                        return `<option value="${val}">${text}</option>`
                                })
                        }
                    ]
                );
    }

    async renderPutForm() {
        return HTMLBuilder()
        .renderForm
            (
                'put',
                'carreras',
                'Modificar Carrera',
                [
                    {name:'id_carrera',type:'hidden'},
                    {name:'nombre',type:'text',msg:'Nombre',placeholder:'Nombre de la carrera'},
                    {name:'codigo', constraintField:' min="3" max="8" ',placeholder:'Defina un codigo único',msg:"Código",type:"text"},
                    {name:'fecha_vigente',type:"date",msg:"Fecha de aprobación"},
                    {
                        name:'duracion',
                        type:'number',
                        constraintField:' min="1" max="12" ',
                        msg:'Duración:',
                        placeholder:'Duracion'
                    },
                    {
                        name:'lapso',
                        type: 'select',
                        msg:'Lapsos:',
                        placeholder:'Seleccione el tipo de lapso',
                        templatedOPValues:
                            HTMLBuilder()
                            .combobox(
                                ["MESES.meses","AÑOS.años"],
                                itm => {
                                    const [val,text] = itm.split('.');
                                    return `<option value="${val}">${text}</option>`
                            })
                    },
                    {
                        name:'vigente',
                        type:'select',
                        msg:"¿Sigue vigente esta carrera?",
                        placeholder:"Por favor, elija una opción",
                        templatedOPValues:HTMLBuilder().combobox(["1.SI","0.NO"],itm=>{const [val,text]=itm.split('.'); return `<option value="${val}">${text}</option>`})
                    }
                ]
            )

    }

    static async renderTable() {
            const values = <RowDataPacket[]> await new Carrera().getAll(),
                {BtnFormToInsert,renderSearchOptions,table,TableButtons} = HTMLBuilder(),
                hasError = (values[0])?.error_code != undefined;

            console.log('hay error', hasError);
            

            let html = (hasError)? `<div class="carreras">${BtnFormToInsert('carrera')}<h1>No hay campos para cargar<h1></div>`
            :
            `<div class="carreras">
            ${
                BtnFormToInsert('carrera')+
                renderSearchOptions([ "Nombre","Codigo","Fecha","Duración"])
            }<table class="table">${
                await table<ICarrera>
                (
                    ["Nombre","Codigo","Fecha","Duración","",""],
                    values,
                    entity=> `
                            <tr>
                                <input type="hidden" value=${entity.id} >
                                    <td>${entity.data.nombre}</td>
                                    <td>${entity.data.codigo}</td>
                                    <td>${(
                                    ()=>{
                                        const d = new Date(entity.data.fecha_vigente); 
                                        return d.getDate()+ '/'+d.getUTCMonth()+'/'+d.getUTCFullYear();
                                    })()
                                    }</td>
                                    <td>${entity.data.duracion} ${entity.data.lapso}</td>
                                ${TableButtons}
                            </tr>`
                )
            }</tbody></table></div>`;


            return html;
    }
}