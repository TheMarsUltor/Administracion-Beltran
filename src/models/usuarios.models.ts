import { RowDataPacket } from "mysql2";
import { DBMessage, HTMLBuilder, Statements, tokenList, Util } from "../util/utl";
import { Perfil } from "./perfiles.models";
import { Request, Response } from "express";

export interface IUser {
    id_usuario?:number,
    nombre_completo:string,
    alias:string,
    clave:string,
    email:string,
    perfil:string,
    intento?:number,
    ult_login?:string
}

export type LoginSession = {
    alias:string,
    clave:string
}

export type Session={
    id:number,
    alias:string,
    perfil:string
}

export class Usuario implements Statements<IUser> {
        model: IUser= {nombre_completo:'',alias:'',clave:'',email:'', perfil:''};

        constructor(m?:IUser) {
            if(m) this.model = m 
        }
        // *
        async insert() : Promise<DBMessage>{
            this.model.clave = await Util.Hash.Password(this.model.clave);

            return  <DBMessage> 
            (   await 
                Util.ExecSQL<RowDataPacket>(
                    "CALL SP_INSERT_USUARIO (?,?,?,?,?)",[
                        this.model.nombre_completo,
                        this.model.alias,
                        this.model.email,
                        this.model.clave,
                        this.model.perfil
                    ]
                )
            ) [0][0];
        }
        // *
        async getAll () { 
            return <DBMessage | IUser[]>
            (   await 
                Util.ExecSQL<RowDataPacket[]>(
                    'CALL SP_GET_USUARIO(-1)',
                    []
                )
            ) [0];
        }
        // *
        async getByID (id: number) {
            return <IUser | DBMessage> (
                await   
                Util.ExecSQL<RowDataPacket[]>(
                    "CALL SP_GET_USUARIO(?)",
                    [id]
                )
            )[0][0]
        }
        // *
        async update (id: number) {
            return  <DBMessage> (
                await
                Util.ExecSQL<RowDataPacket>(
                    "CALL SP_UPDATE_USUARIO(?,?,?,?)",[
                        id,
                        this.model.nombre_completo,
                        this.model.alias,
                        this.model.perfil
                    ]
                )
            )[0][0];
        }
        // *
        async delete (id: number) {
            return <DBMessage>(
                await
                Util.ExecSQL<RowDataPacket>(
                    "CALL SP_DELETE_USUARIO(?)",
                    [id]
                )
            )[0][0];
        }
        // *
        static async renderTable () {
            const values = <RowDataPacket[]> await new Usuario().getAll();


                let html = `
<div class="usuarios">${HTMLBuilder().BtnFormToInsert('usuario')}${
HTMLBuilder()
.renderSearchOptions(
        [
                'Nombre completo',
                "Perfil", 
                'Alias de Usuario',
                'Estado', 
                '¿Requiere blanqueo?',
                'Fecha Alta Registro',
                'Ultima Modificación', 
                'Ultimo Inicio de Sesión'
        ])}
<table class="table">
${
        await 
        HTMLBuilder()
        .table<{
                nombre_completo:string, 
                perfil : string,
                alias  : string,
                estado : string,
                blanqueo : string,
                created_at : string,
                updated_at : string,
                ult_login: string
                }>(
                        [
                            'Nombre completo',
                            "Perfil", 
                            'Alias de Usuario',
                            '¿Blanqueo de Clave?',
                            'Fecha Alta Registro', 
                            'Ultima Modificación', 
                            'Ultimo Inicio de Sesión'
                            ,"",""
                        ],
                        values,
                        entity=> `
                        <tr>
                        <input type="hidden" value=${entity.id} >
                                <td>${entity.data.nombre_completo}</td> 
                                <td>${entity.data.perfil}</td> 
                                <td>${entity.data.alias}</td> 
                                <td>${entity.data.blanqueo}</td> 
                                <td>${entity.data.created_at}</td> 
                                <td>${entity.data.updated_at}</td> 
                                <td>${entity.data.ult_login}</td> 
                                ${HTMLBuilder().TableButtons}
                        </tr>`
                )
        }</tbody></table></div>`;
            return html;
        }
        // *
        async renderPostForm () {
                const perfiles = <RowDataPacket[]> await new Perfil().getAll();

                return HTMLBuilder().renderForm(
                    'post',
                    'usuarios',
                    'Agregar Nuevo Usuario',[
                        {name:'nombre_completo',type:'text',msg:'Nombre y Apellid',placeholder:'Ingrese su nombre y Apellido'},
                        {name:'alias',type:'text',msg:'Alias del usuario',placeholder:'Ingrese un alias'},
                        {name:'email', type:'email', msg:'Email de usuario', placeholder:'Ingrese un email'},
                        {name:'clave',type:'password', placeholder:'ingrese una clave...',msg:"Contraseña"},
                        {
                            name:'perfil',
                            type:'select',msg:'Perfil:',
                            placeholder:'Seleccione un perfil',
                            templatedOPValues:
                            HTMLBuilder().combobox(
                                perfiles,
                                e => HTMLBuilder().optionGenerator(e.codigo, e.nombre)
                            )
                        }
                    ]
                );
        }
        // *
        async renderPutForm () {
                const perfiles = <RowDataPacket[]> await new Perfil().getAll();

                return HTMLBuilder().renderForm(
                    'put',
                    'usuarios',
                    'Actualizar datos de usuario',[
                        {name:'id_usuario',type:'hidden'},
                        {name:'nombre_completo',type:'text',msg:'Nombre y apellido completo'},
                        {name:'alias',type:'text',msg:'Alias del usuario'},
                        {name:'email',type:'email',msg:'Email:',placeholder:'Email '},
                        {
                            name:'perfil',
                            type:'select',
                            placeholder:'Seleccione un perfil',
                            msg:'Perfil',
                            templatedOPValues:
                            HTMLBuilder().combobox(
                                perfiles,
                                e => HTMLBuilder().optionGenerator(e.codigo, e.nombre)
                            )
                        }
                    ]
                )
        }
        // *
        static async signIn(credenciales:LoginSession) {
                const res =     (await   
                                Util.ExecSQL<RowDataPacket>(
                                        "CALL SP_GET_USUARIO_BY_ALIAS(?)",
                                        [credenciales.alias]
                                ))[0];
                
                if(res[0].error_code != 0) 
                        return {
                                result:{
                                        error_code:parseInt(res[0].error_code), 
                                        mensaje: String(res[0].mensaje).toString()
                                }
                        };
                        
                const pass_ok = await Util.Hash.validatePwdHash(credenciales.clave,res[0].clave);

                if ( !pass_ok) {
                        console.log (
                                    await 
                                    Util.ExecSQL    
                                        (`
                                        update  usuarios 
                                        set     intento= ? 
                                        where   id_usuario = ? `,[
                                            res[0].intentos_fallidos+1,
                                            res[0].id
                                        ]
                                        )
                                );

                        return  {
                                result: {
                                        mensaje:"clave invalida",
                                        error_code:-3
                                }
                        };
                }
                
                const user = {
                    id: parseInt(res[0].id),
                    alias:res[0].alias,
                    perfil:res[0].perfil
                };
                
                const   token = Util.Token.encode
                                    (
                                        user,
                                        process.env.JWT_SECRET||'tokentest', 
                                        {
                                            algorithm:'HS384',
                                            expiresIn:'15m'
                                        }),
                        refreshToken = Util.Token.encode(user, process.env.JWT_SECRET_REFRESH||'refresh-test-token',{expiresIn:'1h'});
                

                
                

                console.log(
                    await Util.ExecSQL(
                        'CALL SP_LOGIN(?,?,?,?)',[
                            parseInt(res[0].id),
                            token,
                            refreshToken,
                            new Date().getTime() + ((1000 * 60* 15 ))
                        ]
                    )
                );
                

                tokenList[refreshToken] = {
                    id_usuario:parseInt(res[0].id),
                    status:'active',
                    token,
                    refreshToken
                };


                return  {
                        result:{
                                error_code:0,
                                mensaje:"Session iniciada Correctamente!",
                                token, 
                                refreshToken 
                        }
                };
        }
        // *
        static async logout(req:Request, res:Response){
            try{
                const token = <string> req.headers['authorization'];
                console.log(await Util.ExecSQL('CALL SP_LOGOUT(?)',[token]));
                res.json({mensaje:"sesión cerrada!"});
            }catch(err){
                console.error(err);
                res.status(400).json(err)
            }
        }
        
}