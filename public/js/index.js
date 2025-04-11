(w=>{

    


    const 
        //      funciones basicas! 
        $   = (s ='') =>  w.document.querySelector(s),
        $$  = selectors => w.document.querySelectorAll(selectors),
        $exists=(selector) => w.document.querySelector(selector) != null,
        $form = () => $('form'),
        $Request = fetch,
        // funciones de gestion de componentes estaticos
        BuscarEnTabla = (evt) => {
            const 	
                criterio = $('#criterio'), 
                filtrar = (evt.target.value).toLowerCase(),
                rows = $('table').getElementsByTagName("tr");
    
            if(criterio.selectedOptions[0].value != '' ) {
                for( let i = 0; i < rows.length ; i++ ) {
                    let td = rows[i].getElementsByTagName("td")[parseInt(criterio.selectedOptions[0].value)];
                    if(td) rows[i].style.display = ( (td.textContent||td.innerText).toLowerCase().indexOf(filtrar) > -1) ? '': 'none'; 
                }
            }
        },
        
        LS = {
            take:(k)=>{
                const val = w.localStorage.getItem(k);
                return (val)?val : '' ;
            },
            create: (k,v) => w.localStorage.setItem(k,v),
            remove:(k) => w.localStorage.removeItem(k),
            exists: (k) => LS.take(k)!==''
        },
        authHeader = ()=> {
                const token = LS.take('token'); 
                return (token === '' || token=="undefined") ? {}: {"Authorization":token}
        },
        VolverAtras= async (evt) =>{
                if(confirm("¿Desea volver atras?\nLa operación actual se anulará.")){
                        const entity = $('.output').children[0].classList[0];
                        $('.menu-botonera').style.display='';
                        await loadTable(entity)
                }
        },
        //      Definición de rutas      
        routeParent = 'http://localhost:9098/' ,
        routes = {
            login		:routeParent+'login',
            user		:routeParent+'api/user',
            token:      {url:routeParent+'token',method:'POST',body: JSON.stringify({refreshToken:LS.take('refreshToken')}) },
            list		:(entity)=>routeParent+'table/'+entity,
            change	:(entity,id)=>`${routeParent}${entity}/${id}`,
            create	:(entity)=>`${routeParent}${entity}`,
            masivo  :(entity)=>`${routeParent}carga-masiva/${entity}`,
        },
        //      
        cerrarSession = (evt)=>{
            if(confirm("¿Está seguro que desea salir?")){
                $Request(routes.user,{
                    method:'delete',    
                    headers:authHeader()
                })    
                .then( r => r.json())
                .then(async d=>{
                    LS.remove('token');
                    await loadLogin($('#app'));
                });    
            }   
        },    
        BorrarItem= (evt) =>{
            const id = parseInt(evt.target.parentElement.parentElement.children[0].value),
            entity = evt.target.parentElement.parentElement.parentElement.parentElement.parentElement.classList[0];        
            if( confirm("¿Desea eliminar este item?") ) {
                $Request(routeParent+entity+'/'+id,{
                    method:'delete',
                    headers:authHeader()
                })
                .then(res => res.json())
                .then(async data => {
                    alert(data.mensaje); await loadTable(entity);
                })
            }
        },
        cargarDatosUpdateForm = (entity) => {
            const keys = Object.keys(entity);
            keys.forEach( idName => {
                
                if( idName!= 'eliminado' ||idName!= 'habilitado' || !$exists('#'+idName) ) {
                    
                    if( $("#".concat(idName)).type === 'date' ) 
                        $("#".concat(idName)).valueAsDate = new Date(entity[idName])
                    else
                        $('#'.concat(idName)).value = entity[idName];
                }
            });
        },       
        eventoCargarFormUpdateHTML = async (entity,id)=> {
            const res = await $Request(routes.change(entity,id),{
                method:'GET',
                headers:authHeader()
            });
            
            
            return await res.json();
        },
        eventoSaveModificarEntidad = ()=> {
            
            const entity = $form().parentElement.classList[0];

            $form().addEventListener('submit', (evt)=>{
                evt.preventDefault();
                let inputs= Array.from($form().elements).filter(c => c.type != 'submit' && c.type != 'button');
                let objReq = {};
                const f = (id, objBody) => {
                    $Request(routeParent+entity+'/'+id,{
                        method:'PUT',
                        headers:{
                            "Authorization":LS.take('token'),
                            "Content-Type":"application/json" 
                        },
                        body:JSON.stringify(objBody)
                    })
                    .then( res => res.json())
                    .then( async data => {
                        if(!data.error) {
                            alert(data.mensaje);
                            await loadTable(entity);
                            $('.menu-botonera').style.display='';
                        } else {
                            alert(data.mensaje);
                        }					
                    })
                };

                inputs.forEach( control => {
                    if(control.type != 'hidden')
                        objReq[control.id] =    (
                                                        control.tagName == 'INPUT' ? 
                                                        (
                                                        control.type == 'date' ? 
                                                        control.valueAsDate.getTime() :
                                                        control.value
                                                        )
                                                        : 
                                                        (
                                                        control.selectedOptions[0]!=undefined 
                                                        && 
                                                        control.selectedOptions[0].value != 0 
                                                        ) ? 
                                                        control.selectedOptions[0].value : 
                                                        undefined 
                                                );
                });
    
                f((inputs.filter(ctrl => ctrl.type=='hidden')[0]).value,objReq);
            });

            	
        },/* no implementado */
        eventoCargaMasiva = async (evt) => {
            
            const entity = (evt.target.parentElement.parentElement.classList[0]);
            
            // cargar html
            await $Request(routes.masivo(entity),{
                headers:authHeader()
            })
            .then(res => res.json()) 
            .then(data => {
                $('.output').innerHTML = data.html;
                $('.menu-botonera').style.display = 'none';
                $('#back').addEventListener('click',VolverAtras);
            })
            .catch(err => alert(err));
            
            //  cargar 	evento
            $('form').addEventListener('submit',async (evt) => {
                evt.preventDefault();
                const arch = $('form').elements[0].files[0];
                const reader = new FileReader();
                
                reader.onload = (evt) => {
                    LS.create('archivo', evt.target.result);
                }
                reader.readAsText(arch);
                const path = routes.masivo(entity);
                const obj = {fileContent:LS.take('archivo')};

                $Request(path,{
                    method:'POST',
                    headers:{
                        "Authorization":LS.take('token'),
                        "Content-Type":"application/json" 
                    },
                    body : JSON.stringify(obj)			
                })
                .then(res => res.json())
                .then(async data => {
                    alert(data.mensaje)
                    LS.remove('archivo');
                    const entity = $('.output').children[0].classList[0];
                    $('.menu-botonera').style.display='';
                    await loadTable(entity);
                })
                .catch(err =>{
                    LS.remove('archivo');
                    alert(err.mensaje);
                    });
            });
        },
        eventoAgregarNuevo = async (evt)=> {
            const entity = (evt.target.parentElement.parentElement.classList[0]);
            
            $('.output')
            .innerHTML = await $Request( 
                routes.create(entity),{
                    method:'GET',
                    headers:authHeader()
                })
                .then(res=>res.json())
                .then(data=>{
                    let out = '';
                    if(data.error) {
                        alert(data.error.mensaje);
                        out = JSON.stringify(data.error);
                    } else {
                        $('.menu-botonera').style.display='none';
                        out = data.html
                    };
                    return out;
                });
            
            $('#back').addEventListener('click',VolverAtras);
    
            $('form').addEventListener('submit',
            (evTarget)=> {
                evTarget.preventDefault();
                const inputs = Array.from($('form').elements).filter((e)=>e.type!='submit'&&e.type!='button');
                let obj={};
    
                inputs.forEach(item => {
                    if(item.tagName==='SELECT') {
                        if(item.selectedIndex < 1 ){
                            alert('Debe selecciónar una opcion valida');	
                            return;
                        }
                        obj[item.id]= item.selectedOptions[0].value;
                    }
    
                    if(item.tagName === 'INPUT') obj[item.id] = item.value;
                });
    
                $Request(routeParent+entity,{
                    method:'POST',
                    headers:{
                        'Authorization':LS.take('token'),
                        'Content-Type':'application/json'
                    },body:JSON.stringify(obj)
                })
                .then(res => res.json()) 
                .then(data => {
                    alert(data.mensaje);
                    loadTable(entity);
                })
                .catch(err => {
                    alert(err);
                    console.error(err);	
                });
            });
        },
        loadTableLogic = (eentity) => {
            
            const btns_mod = $$('table button.mod');
            const btns_del = $$('table button.del');
            const output = $('.output');
            $('#btn_agregar').addEventListener('click',eventoAgregarNuevo);
            /**
             * 	evento boton carga masiva
             * 
             * 	(sin implementar)
             * 
             */
            $('#btn_agregar_m').addEventListener('click',eventoCargaMasiva);
    
            //   define el evento al editar item
            btns_mod.forEach(  btn => {
                btn.addEventListener('click',async (evt)=> {
                    
                    const id = (evt.target.parentElement.parentElement.children[0].value);
                    const entity = evt.target.parentElement
                            .parentElement.parentElement.parentElement
                            .parentElement.classList[0];
                    
                    const data = await eventoCargarFormUpdateHTML(entity,id);                   
                    output.innerHTML = data.html;
                    $('#back').addEventListener('click',VolverAtras);
                    $('.menu-botonera').style.display='none';
                    cargarDatosUpdateForm(data.entity);
                    eventoSaveModificarEntidad();
                });
            });
    
            btns_del.forEach(btn => {
                btn.addEventListener('click',BorrarItem)
            });
    
            $('#buscador').addEventListener('keyup',BuscarEnTabla) ;
        },
        loadTable = async (entity) => {
            $('.menu-botonera').style.display='';
            const res = await $Request(routes.list(entity),{
                method:'GET',
                headers:authHeader()
            }) ;
            const json = await res.json();
            $('.output').innerHTML = json.html;
            loadTableLogic(entity);   
        },
        eventoCargarBotonera = ()=> {
            const btns = Array.from($$('button')).filter(e => e.id!='logout');
            btns.forEach(  btn => {
                const entity = btn.id;
                btn.addEventListener('click', async (evt) => {
                    evt.preventDefault();
                    await loadTable(entity);
                })
            })
        },
        cargarPorPerfil = (n) => {
            switch(n) {
                case 'MASTER': eventoCargarBotonera();
                    break;
                case 'DTOA':  eventoCargarBotonera();
                    break;			
                case 'COMUN': 
                    $('#buscador').addEventListener('keyup',BuscarEnTabla)  ;
                    break;
            }
            $('#logout').addEventListener('click',cerrarSession);
        },
        loadUserPage = async (mainElement) => {

            $Request(routes.user,{method:'GET',headers:authHeader()})
            .then(res=>{
                if(res.status == 500 ){
                    throw new Error(res.statusText)
                } else 
                return res.json();
            })
            .then(data =>{
                mainElement.innerHTML=data.html;
                cargarPorPerfil(data.codigo);
            })
            .catch(async err=>{ 

                console.error(err);
                LS.remove('token');
                await loadLogin(mainElement)
            });
        },
        loadLogin= async (mainElement) =>{
            const res = await $Request(routes.login);
            const htmlResponse =await res.json();

            if(htmlResponse.error_code != 0) {
                alert("No se pudo cargar la pagina.\nError %d\nMensaje",htmlResponse.error_code,htmlResponse.mensaje);
            }
            // ya cargado en el main
            mainElement.innerHTML =htmlResponse.html;
            // programar el evento
            const form = $('.login> form')
            form.method = 'POST';
            form.addEventListener('submit',(evt)=>{
                evt.preventDefault();
                const   usr = $('#alias'),
                        pwd = $('#clave');
                
                $Request(routes.login,{
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body:JSON.stringify({
                        alias:usr.value.trim(),
                        clave:pwd.value.trim()
                    })
                })
                .then( async  res => res.json())
                .then(async data => {
                    if(!data.token){
                        alert("Error al iniciar la sesión token\n",data.mensaje);                        
                        await loadLogin(mainElement);
                    } else {
                        
                        alert(data.mensaje);
                        LS.create('token',data.token);
                        LS.create('refreshToken',data.refreshToken);

                        await loadUserPage($('#app'));
                    }
                })
                .catch(err =>{
                    console.error(err);
                    alert(err)
                });
            })
        }/*,
        RefreshToken = async () => {
            
            const   token = LS.take('token'),
                    rtoken = LS.take('refreshToken')
            $Request(routes.user,{
                method:'POST',
                headers:authHeader(),
                body:{
                    token,
                    refreshToken:rtoken
                }
            })
            .then(response => response.json())
            .then(data =>{
                localStorage.token = data.token
            })
            .catch(err => {
                alert(err)
            })
        }*/;
    
        



    w.onload = async (evt) => {
        const user_uuid = LS.take('token'); 
        const app = $('#app');
    
        if(user_uuid==='' || user_uuid==='undefined') {
            await loadLogin(app);
        } else {
            await loadUserPage(app);
            $("#logout").addEventListener('click',cerrarSession);
        }
    };
    
    /* / refrescar la pantalla    
    setInterval( async ()=>{
       await RefreshToken();
    },(1000*60*10));
*/
    
})(window);
    
    