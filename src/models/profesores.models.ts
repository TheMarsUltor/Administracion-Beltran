import { RowDataPacket } from "mysql2";
import { DBMessage,HTMLBuilder,Statements,Util } from "../util/utl";
import { Asignatura } from "./asignaturas.models";

export interface IProfesor{
        id_profesor?:number,
        nombre:string,
        apellido:string,
        email:string,
        codAsignatura:string,
        estado:string
};

export class Profesor implements Statements<IProfesor> {
        model: IProfesor = {nombre:'',apellido:'',email:'',codAsignatura:'',estado:''};

        constructor(m?:IProfesor){
                if(m) this.model = m;
        }

        async insert (): Promise<DBMessage> {
                return <DBMessage>
                (
                        await
                        Util.ExecSQL<RowDataPacket>(
                                "CALL SP_INSERT_PROFESOR(?,?,?,?,?)",[
                                        this.model.nombre,
                                        this.model.apellido,
                                        this.model.email,
                                        this.model.estado,
                                        this.model.codAsignatura
                                ]
                        )
                )[0];
        }


        
        async getAll (){
                return <IProfesor[]|DBMessage>
                (
                        await
                        Util.ExecSQL<RowDataPacket>(
                                "CALL SP_GET_PROFESOR(-1)",[],true
                        )
                );
        }

        async getByID(id: number){
                return <IProfesor | DBMessage>
                (
                        await
                        Util.ExecSQL<RowDataPacket>(
                                "CALL SP_GET_PROFESOR(?)",
                                [id],true
                        )
                );
        }

        async update(id: number) {
                return <DBMessage> 
                (
                        await
                        Util.ExecSQL<RowDataPacket>(
                                "CALL SP_UPDATE_PROFESOR(?,?,?,?,?)",[
                                        id,
                                        this.model.nombre,
                                        this.model.apellido,
                                        this.model.email,
                                        this.model.estado
                                ]
                        )
                );
        }

        async delete(id: number){
                return <DBMessage>
                (
                        await
                        Util.ExecSQL<RowDataPacket>(
                                "CALL SP_DELETE_PROFESOR(?)",
                                [id]
                        )
                );
        }

        async renderPostForm () {
                const asignaturas = <RowDataPacket[]> await new Asignatura().getAll(); 
                
                return HTMLBuilder()
                .renderForm(
                        'post',
                        'profesores',
                        'Registrar Profesor',
                        [
                                {name:'nombre',type:'text',msg:'Nombre: ',placeholder:'Ingrese el nombre'},
                                {name:'apellido',type:'text',msg:'Apellido: ',placeholder:'Ingrese el apellido'},
                                {name:'email',type:'email',msg:'Email: ',placeholder:'Ingrese el email'},
                                {
                                        name:'estado',
                                        type:'select',
                                        placeholder:'Seleccionar',
                                        msg:'Estado: ',
                                        templatedOPValues:HTMLBuilder().combobox(['Activo','Licencia'],itm=>`<option value="${itm.toUpperCase()}" >${itm}</option>`)
                                },
                                {
                                        name:'codAsignatura',
                                        type:'select',
                                        msg:"Indicar Asignatura",
                                        placeholder:"Seleccionar",
                                        templatedOPValues: HTMLBuilder().combobox(asignaturas, field => HTMLBuilder().optionGenerator(field.codigo, field.nombre))
                                }

                        ]
                )
        }

        async renderPutForm() {
                return HTMLBuilder().renderForm('put','profesores','Modificar Profesor',[
			{name:'id_profesor',type:'hidden'},
			{name:'nombre',type:'text',msg:'Nombre: ',placeholder:'Ingrese el nombre'},
			{name:'apellido',type:'text',msg:'Apellido: ',placeholder:'Ingrese el apellido'},
			{name:'email',type:'email',msg:'Email: ',placeholder:'Ingrese el email'},
			{name:'estado',type:'select',msg:'Estado: ',templatedOPValues:HTMLBuilder().combobox(['Activo','Licencia'],itm=>`<option value="${itm.toUpperCase()}" >${itm}</option>`)}
		])

        }
        
        static async renderTable() {
                const   values = <RowDataPacket[]> await new Profesor().getAll(),
                        hasError = (values[0][0])?.error_code != undefined ;

                console.log("hay error? :", hasError);
                
                let html = (hasError)?`<div class="profesores">
                ${
                        HTMLBuilder().BtnFormToInsert('profesor')
                }<h1>No hay campos para cargar<h1></div>`:`
                <div class="profesores">
                ${
                        HTMLBuilder().BtnFormToInsert('profesor')+
                        HTMLBuilder().renderSearchOptions(["Nombre","Apellido","Email","Estado"])
                }       
		<table class="table">${
			await HTMLBuilder().table<IProfesor>(
				["Nombre","Apellido","Email","Estado","",""],
				<RowDataPacket[]>values[0],
				entity=> `
				<tr>
					<input type="hidden" value=${entity.id} >
					<td>${entity.data.nombre}</td> 
					<td>${entity.data.apellido}</td> 
					<td>${entity.data.email}</td> 
					<td>${entity.data.estado}</td> 
					${HTMLBuilder().TableButtons}
                                </tr>`
                        )
		}</tbody></table></div>
                `;

                return html;
        }
}