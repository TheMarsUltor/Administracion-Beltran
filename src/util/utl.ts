import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { Usuario } from '../models/usuarios.models';
import { Perfil } from '../models/perfiles.models';
import { Profesor } from '../models/profesores.models';

export async function Connection () {
    const connection = await mysql.createPool({
        host:       process.env.DB_HOST,
        user:       process.env.DB_USER,
        password:   process.env.DB_PASS,
        database:   process.env.DB_DATABASE,
        connectionLimit:5
    });
    return connection;
};

export function SQLformat(sql:string,values:any[]) : string {
    return mysql.format(sql,values)
}

export function SQLsanitize(input:any) {
    return mysql.escape(input);
}

export type DBMessage = {
    mensaje:string,
    error_code:number
};

export const CurrentTimestamp = () => mysql.raw("CURRENT_TIMESTAMP()")


export interface Statements<T> {
    model:T,
    insert:()=>Promise<DBMessage>,
    getAll:()=>Promise<T[]|DBMessage>,
    getByID:(id:number)=>Promise<T|DBMessage>,
    update:(id:number)=>Promise<DBMessage>,
    delete:(id:number)=>Promise<DBMessage>,
    
    renderPostForm: ()=> Promise<string>,
    renderPutForm: ()=> Promise<string>
};

export type Field = {
    name:string,
    type:string,
    msg?:string,
    placeholder?:string,
    templatedOPValues?:string,
    constraintField?:string
};


export const HTMLBuilder = () => {
    const   ServerMessage = () => `<div class="msg_server"></div>` ,
            NavBar = (l:string,t:string,hasSession?:boolean) => `<header class="navbar"><div class="logo nv-item"><img src=${'./img/'+l}></div><div class="title nv-item"><h1>${t}</h1></div>${(!hasSession)?'':'<div class="nv-item"><button id="logout" >Cerrar Sesión</button></div>'}</header>`,
            NavBarITB = NavBar('logo.png','Instituto Tecnologico Beltrán'),
            Title = (text:string) => `<h1 class="title-form">${text}</h1>` ,
            ButtonGroup = (valName:string,) => `
                    <div class="form-input btns">
                        <input type="button" id="back" value="Volver Atrás" />
                        <input type="submit" value=\"${valName}\" />
                    </div>`,
            optionGenerator = (val:string,text:string) => `<option value=${val}>${text}</option>`,
            combobox = <T>(data:T[], cb:(item:T)=>string) => {
                let output= '';
                data.forEach(elm => output+=cb(elm));
                return output;
            },
            table = async <T>(
                tablHeaders:string[],
                rawdata:RowDataPacket[],
                row:(entidad:{id:number,data:T})=>string ) 
            : Promise<string> => {
            
        

                let htmlTable = `<thead class="row-column-names"><tr>`;
                tablHeaders.forEach(
                    elm => htmlTable += `<th>${(elm.length!=0?elm:'')}</th>`       
                );
                
                htmlTable +=`<tr></thead><tbody class="row">`
            
                rawdata.forEach(itm => {
                    const entity:T = <T>itm;
                    htmlTable += row({id:itm.id,data:entity});
                })
                
                htmlTable += `</tbody></table></div>`
            
                return htmlTable
            },
            TableButtons = `<td><button class="mod">Editar</button></td> <td><button class="del">Borrar</button></td>`,
            renderSearchOptions = (options:string[]) =>{
                let html = `<div class="filtar-tabla"><select id="criterio"><option value="" disabled selected hidden>Buscar por...</option>`;
                options.forEach((opcion,index) => html+=`<option value=\"${index}\">${opcion}</option>`);
                html += `</select><input type="search" id="buscador" placeholder="Buscar" /> </div>`;
                return html;
            },
            renderForm = (
                method:string,
                entityName:string,
                title:string,
                fields:Field[]
            ) : string =>{
                
                let html : string = `<div class="${entityName}" >${Title(title)}<form method="${method}" >`;
            
                const processField = (f:Field) => {
                    return ( f.type.toLowerCase() === 'select' ) ? 
                    `<select id="${f.name}" ><option value="-1" disabled selected hidden >${f.placeholder}...</option>${f.templatedOPValues}</select>`
                        : 
                    `<input type="${f.type}" id="${f.name}" ${(method==='post')?` placeholder="${f.placeholder}" ${f.constraintField} `:""} required/>`
                    ;
                } 
            
                fields.forEach(
                    (campo) => 
                        html+=`
                    <div class="form-input">
                        <label>${!campo.msg ?'':`${campo.msg}`}</label>${
                            processField(campo)
                        }</div>` 
                );
                html+= `${ButtonGroup(`${(method === 'put')?"Actualizar":"Añadir"} ${title.split(' ',)[1]}`)}`                                
                return html;
            },
            LoginForm = ()=>{
                return `${NavBarITB}<main><div class="login"><div class="space"> <img src="img/principal.jpg" > </img> </div>${ServerMessage()}<form><div class="form-input"><h4>Iniciar sesi&oacute;n</h4></div><div class="form-input"><input type="text" id="alias" placeholder="Nombre de Usuario" minlength="6" maxlength="16" required></div><div class="form-input"><input type="password" id="clave" placeholder="Contraseña" minlength=6 maxlength=16 required></div><div class="form-input"><input type="submit" value="Ingresar"></div></form></div></main>`;
            },
            BtnFormToInsert = (entityName:string) => {
                return`
                <h2>${entityName.toUpperCase()}</h2>
                <div class="btn-group">
                    <button id="btn_agregar">Crear ${entityName}</button>
                    <button id="btn_agregar_m">Carga Masiva ${entityName}</button>
                </div>
                `.replace(/([\n])+/,'')
            },
            ButtonAGroup =(options:string[]) =>{
                const option = (idName:string, text:string) => {
                    return `<button id=\"${idName}\" >${text}</button>`
                }, start = '<div class="menu-adm"><div class="menu-botonera">';
            
                let ret =''.concat(start);
                options.forEach(e => {
                    ret += option(e.toLowerCase(),e)
                });
            
                ret += '</div><div class="output"></div></div>';
                return ret;
            },
            renderEntityMessage = (entity:string)=>{
                const html = `<h5></h5><p></p>`;

                

                return html;
            };
            

    return {
        ServerMessage,
        NavBar,
        NavBarITB,
        Title,
        ButtonGroup,
        optionGenerator,
        combobox,
        table,
        TableButtons,
        renderSearchOptions,
        renderForm,
        LoginForm,
        BtnFormToInsert,
        ButtonAGroup
    };
} 

export let tokenList:any ={};

const   chek_email =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        chek_date = /\d{1,2}\/\d{1,2}\/\d{2,4}$/;

export const Util = {
    Token:{
        createNewToken: (data:any) => {
            return  Util.
                    Token.encode(
                                data,
                                process.env.JWT_SECRET_REFRESH||'testtoken',{
                                    expiresIn:'10m'
                                });
        },
        decode: (token:string,secret:string) => {
            return verify(token,secret);
        },
        encode: (data:any,secret:string,options:SignOptions) =>{
            return sign(data,secret,options);
        }
    },
    Hash:{
        Password:           async (input : string)              => await bcrypt.hash(Buffer.from(input),15),
        validatePwdHash:    async (input:string,stored:string)  => await bcrypt.compare(input,stored)
    },
    Constraint:{
        checkID: (id:string) : boolean => {
            try {
                if(
                    id.indexOf('.') != -1 ||
                    id.length != parseInt(id).toString().length ||
                    Number.isNaN(parseInt(id)) ||
                    parseInt(id) < 0
                ) throw Error;

                return true;
            }catch (err) {
                return false;
            }
        },
        checkDate: (str_date:string) => {
            if( !chek_date.test(str_date)) {
                console.error("fecha erronea: ",str_date);
                return -1                
            } else {
                const date = str_date.split('/');
                console.info(date);
                return 0
            }
        },
        checkString: (_str:string, min:number,max:number)=> {
            const cadena = _str.trim();
            return  (
                    cadena.length != 0 
                    && 
                    cadena.length >= min 
                    && 
                    cadena.length <= max 
                    && 
                    cadena != '' 
                    && 
                    cadena
                    ) ? true : false;                
        },
        checkEmail: (_email:string):boolean=> chek_email.test(_email)
    },
    CheckDB: async ()=> {
        try{
            // verificar conexion
            const resultado1 = (await Util.ExecSQL<RowDataPacket[]>(
                'select 1 resultado',[]))[0].resultado;
            
            if(resultado1 != 1)
                throw Error('Fallo en la conexion con la BBDD.');

            // verificar tablas
            const tablas = ((await Util.ExecSQL<RowDataPacket[][]>(`
                    select  count(*) tablas
                    from	information_schema.tables 
                    where	table_schema = ?
                    union
                    select  table_name 
                    from	information_schema.tables 
                    where	table_schema = ?`
            ,[process.env.DB_DATABASE,process.env.DB_DATABASE])))

            if ( tablas.length-1 != (<RowDataPacket>tablas)[0].tablas && (<RowDataPacket>tablas)[0].tablas != 0 )
                throw Error('El modelo de la base de datos no corresponde.');            

            return 0;
        }catch(error) {
            console.log(error);
            return -1;
        }

    },
    ExecSQL : async <T>(_s:string,_v:any[], verStats:boolean = true) => {
        const   conn = await Connection(),
                result = (await conn.query(SQLformat(_s,_v)))[0];
        
        await conn.end();
        if(verStats)
            console.log({"sql":SQLformat(_s,_v), timestamp:new Date(), result:(<RowDataPacket[]>result)[0]});

        return <T>(result);
    },SQLformat,
    TestArea: async () => {

 /*       const 
        crearUsuario = async () =>{

            const pwd = await Util.Hash.Password('pruebas'),
                email = 'soporteyprogramacion@protonmail.com';

            console.log(
                "TEST", 
                (await Util.ExecSQL<RowDataPacket>(
                    "CALL SP_INSERT_USUARIO (?,?,?,?,?)",[
                        'martin Palavecino',
                        'ItbSist',
                        email,
                        pwd,
                        'MASTER'
                    ]))[0]

            );
        
        },
        existeUsuario = async () => {
            return (
                    await Util.ExecSQL<RowDataPacket>
                        (
                            "select count(*) result from usuarios where alias = 'ItbSist' ",
                            []
                        )
            ) [0];
        };

        if((await existeUsuario()).result == 0){
            await crearUsuario();
            console.log('Usuario creado');
        } 

        if( (await existeUsuario()).result == 1){
            console.log("usuario existente!");
        }
  */
        return 0;
    }
}






//  ************************************* /////

/*

export const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT||'456'),
    secure:true,
    auth:{
        user: process.env.SMTP_USER ,
        pass: process.env.SMTP_PASS
    }    
});


transporter.verify().then(async () => {
    console.log('Ya se puede enviar emails!')
/*
    const info = await transporter.sendMail({
        from:'"Prueba de conexión" <test.api.nodemailer.service@gmail.com>',
        to:"clorudodepotasio@gmail.com",
        subject:"HOLA",
        text:"FUNCA!!!"
    });

    console.log(info)
* /
})
.catch( (err)=> {  
    console.log(err)
});
* /

    export  class Entity  {

        private tables:Map<string,Promise<string>>; 
        

        constructor() {
            this.tables = new Map();
            const routers = 
            [
            {key:'actividades',     table:async ()=>{return await new Actividad().renderTable() } },
            {key:'asignaturas',     table:async ()=>{return await new Asignatura().renderTable() } },
            {key:'aulas',           table:async ()=>{return await new Aula().renderTable() } },
            {key:'carreras',        table:async ()=>{return await new Carrera().renderTable() } },
            {key:'comisiones',      table:async ()=>{return await new Comision().renderTable() } },
            {key:'profesores',      table:async ()=>{return await new Profesor().renderTable() } },
            {key:'perfiles',        table:async ()=>{return await new Perfil().renderTable() } },
            {key:'usuarios',        table:async ()=>{return await new Usuario().renderTable() } }
            ];

            routers.forEach( 
                    async itm => this.tables.set(itm.key, itm.table() ))
            console.log(this.tables);
        }   

        async GetTable (entity:string)  {
            const func = await this.tables.get(entity);    
            if ( !func) 
                return {mensaje:'No se pudo cargar la tabla para la entidad.', error_code: -1};

            return {html: func}
        }
    }
    */