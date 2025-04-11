import {Router, Request, Response} from 'express';
import * as PerfilController from       '../controllers/perfil.controller';
import * as UsuarioController from      '../controllers/usuarios.controller';
import * as ProfesorController from     '../controllers/profesor.controller'
import * as Middleware from             '../util/middlewares';
import * as CarreraController from      '../controllers/carrera.controller';
import * as AsignaturaController from   '../controllers/asignatura.controller'
import * as AulaController from         '../controllers/aula.controller' 
import * as ComisionController from     '../controllers/comision.controller'
import * as ActividadController from    '../controllers/actividad.controller'
import { EntityTable,CargaMasivaForm, CargaMasivaProcesamiento } from './entity';

const router =  Router({
    caseSensitive:true,
    strict:true
});
///
router.route('/perfiles')
    .all(Middleware.Auth)
    .get(PerfilController.loadPostForm)
    .post(PerfilController.Insert);
router.route('/perfiles/:id')   
    .all(Middleware.Auth)
    .get(PerfilController.loadPutForm)
    .put(PerfilController.Update)
    .delete(PerfilController.Delete);
//
router.route('/usuarios')
    .all(Middleware.Auth)
    .get(UsuarioController.loadPostForm)
    .post(UsuarioController.Insert);  
router.route('/usuarios/:id')
    .all(Middleware.Auth)
    .get(UsuarioController.loadPutForm)
    .put(UsuarioController.Update)
    .delete(UsuarioController.Delete)
//
router.route('/profesores')
    .all(Middleware.Auth)
    .get(ProfesorController.loadPostForm)
    .post(ProfesorController.Insert);
router.route('/profesores/:id')
    .all(Middleware.Auth)
    .get(ProfesorController.loadPutForm)
    .put(ProfesorController.Update)
    .delete(ProfesorController.Delete);
//
router.route('/carreras')
    .all(Middleware.Auth)
    .get(CarreraController.loadPostForm)
    .post(CarreraController.Insert);
router.route('/carreras/:id')
    .all(Middleware.Auth)
    .get(CarreraController.loadPutForm)
    .put(CarreraController.Update)
    .delete(CarreraController.Delete);
//
router.route('/asignaturas')
    .all(Middleware.Auth)
    .get(AsignaturaController.loadPostForm)
    .post(AsignaturaController.Insert);
router.route('/asignaturas/:id')
    .all(Middleware.Auth)
    .get(AsignaturaController.loadPutForm)
    .put(AsignaturaController.Update)
    .delete(AsignaturaController.Delete);
//
router.route('/aulas')
    .all(Middleware.Auth)
    .get(AulaController.loadPostForm)
    .post(AulaController.Insert);    
router.route('/aulas/:id')
    .all(Middleware.Auth)
    .get(AulaController.loadPutForm)
    .put(AulaController.Update)
    .delete(AulaController.Delete);
//
router.route('/comisiones')
    .all(Middleware.Auth)
    .get(ComisionController.loadPostForm)
    .post(ComisionController.Insert)

router.route('/comisiones/:id')
    .all(Middleware.Auth)
    .get(ComisionController.loadPutForm)
    .put(ComisionController.Update)
    .delete(ComisionController.Delete);
//
router.route('/actividades')
    .all(Middleware.Auth)
    .get(ActividadController.loadPostForm)
    .post(ActividadController.Insert);
router.route('/actividades/:id')
    .all(Middleware.Auth)
    .get(ActividadController.loadPutForm)
    .put(ActividadController.Update)
    .delete(ActividadController.Delete);
    
router.route('/login')
    .get(UsuarioController.LoginForm)
    .post(UsuarioController.Login);

router.route('/api/user')
    .all(Middleware.Auth)
    .get(Middleware.ViewHandler)
    .delete(UsuarioController.Logout);
    
router.route('/token')
    .post(Middleware.RefreshToken)
;

router.route('/table/:entity')
    .all(Middleware.Auth,Middleware.CheckEntity)
    .get(EntityTable);
    
router.route('/carga-masiva/:entity')
    .all(Middleware.Auth,Middleware.CheckEntity)
    .get(CargaMasivaForm)
    .post(CargaMasivaProcesamiento)

export default router;
