import { RowDataPacket } from "mysql2";
import { DBMessage, HTMLBuilder, Statements, Util } from "../util/utl";


export interface IPerfil {
    id_perfil?:number,
    nombre:string,
    codigo:string
}

export class Perfil implements  Statements<IPerfil> {
    model: IPerfil= {nombre:'',codigo:''};

    constructor(m?:IPerfil) {
        if(m) this.model = m 
    }

    async insert() : Promise<DBMessage>{
        return  <DBMessage> 
        (   await 
            Util.ExecSQL<RowDataPacket>(
                "CALL SP_INSERT_PERFIL(?,?)",[
                    this.model.nombre,
                    this.model.codigo
                ]
            )
        ) [0][0];
    }
    
    async getAll () { 
        return <DBMessage | IPerfil[]>
        (   await 
            Util.ExecSQL<RowDataPacket[]>(
                'call sp_get_perfil(-1)',
                []
            )
        ) [0];
    }
    
    async getByID (id: number) {
        return <IPerfil | DBMessage> (
            await   
            Util.ExecSQL<RowDataPacket[]>(
                "CALL SP_GET_PERFIL(?)",
                [id]
            )
        )[0][0]
    }

    async update (id: number) {
        return  <DBMessage> (
            await
            Util.ExecSQL<RowDataPacket>(
                "CALL SP_UPDATE_PERFIL(?,?,?)",[
                    id,
                    this.model.nombre,
                    this.model.codigo
                ]
            )
        )[0][0];
    }

    async delete (id: number) {
        return <DBMessage>(
            await
            Util.ExecSQL<RowDataPacket>(
                "CALL SP_DELETE_PERFIL(?)",
                [id]
            )
        )[0][0];
    }

    static async renderTable () {
        const values = <RowDataPacket[]> await new Perfil().getAll();      

        let html = `
		<div class="perfiles">${HTMLBuilder().BtnFormToInsert('perfil')}
		${HTMLBuilder().renderSearchOptions(["Nombre","Codigo"])}
		<table class="table">${
			await HTMLBuilder().table<IPerfil>(
				["Nombre","Codigo","",""],
				values,
				entity=> `
				<tr>
					<input type="hidden" value=${entity.id} >
					<td>${entity.data.nombre}</td> 
					<td>${entity.data.codigo}</td> 
					${HTMLBuilder().TableButtons}
					</tr>`)
		}</tbody></table></div>`;

        return html;
    }
    async renderPostForm () {
        return HTMLBuilder().renderForm('post','perfiles','Crear Nuevo Perfil',[
            {name:'nombre', type:'text', msg:"Nombre del perfil",placeholder:""},
            {name:'codigo', type:'text',msg:'Defina un código único',placeholder:""}
        ])
    }

    async renderPutForm () {
        return HTMLBuilder().renderForm('put','perfiles','Modificar Perfil',[
            {name:'id_perfil',type:'hidden'},
            {name:'nombre',type:'text',msg:'Nombre del perfil'},
            {name:'codigo',type:'text',msg:'Defina un codigo'}
        ])
    }

    static async render(codigo:string)  {
        let html:string= '';
        const {NavBar,ButtonAGroup} = HTMLBuilder()

        const result = (await Util.ExecSQL<RowDataPacket>(
                "select concat('html=', html) html from perfiles where codigo = ? and eliminado = 0",['MASTER']
        ))[0]

        eval( result.html);        
        
        return html;
    }
}