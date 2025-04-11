import {config} from 'dotenv'
import express,{Application} from 'express';
import morgan from 'morgan'
import router  from './util/router';
import cors from 'cors';
import { Util } from './util/utl';

config();

export class App {

    private app:Application;
    

    constructor(private port?:number|string ){
        if (!this.port) this.port = process.env.PORT; 
        this.app = express();
        this.serverSettings();
        this.serverMiddlewares();
        this.setAllRoutes();
        this.checkInstalation()
    }
    
    // configuraciones basicas.
    private serverSettings() {
        // indico la ruta de los archivos estaticos
        this.app.use(express.static('public'));  
        this.app.use(cors({
            origin:process.env.SERVER_NAME,
            methods:['GET', 'POST', 'PUT', 'DELETE'],
            preflightContinue:false,
            optionsSuccessStatus:204
        }))
    }
    
    private serverMiddlewares() {
        this.app.use(express.json()) 
        if(process.env.SV_MODE != 'PROD')
            this.app.use(morgan('dev'));
    }

    private setAllRoutes() {
        this.app.use(router);
    }
    
    private async checkInstalation () {
    //    console.log(await Util.CheckDB()  )
       console.log(await Util.TestArea())
    }

    async listen (){
        this.app.listen(this.port,() => {console.log("Servicio activo ", process.env.SERVER_NAME);});
    }
};

