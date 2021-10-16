import Express from "express";
import { getBD } from "../../db/db.js"; // importo la funcion para la conexion a la base de datos mongoDB
import { ObjectId } from "mongodb"; // importamos el gestor de mongoDB para conectarnos a la base de datos como 
// tambien la funcion de ObjectId para obtener el id de un registro y poder hacer el metodo PATCH 

const rutasVenta= Express.Router();// metodo Router me permite definir rutas, funcion de Expresss, me permite generar rutas
// sin tener que depender de esta forma const app = Express() y app.get('/ventas', (req, res) => {} .. lo asignamos a una 
// variable y esta la exportamos 



// ruta para la peticion GET

rutasVenta.route('/ventas').get((req, res) => {// el primer argumento es la ruta y el segundo argumento es una funcion que se ejecutq
    // cuando entran en esta ruta (colvar), es decir cuando hacen una peticion de tipo get a esta ruta la funcion 
    // se ejecuta.0 absolutamente todas las navegaciones que se hacen en una URL son de tipo get siempre se pide traer 
    // informacion .. la funcion anonima tambien tiene paramentros y dos muy importantes son el 
    // req: es el request quien hace la solicitud o peticion estos nombres son por convencion 
    // res: es la respuesta del servidor a esta peticion, es la respuesta
    // para el cliente, el navegador el frontend estos nombres son por convencion 
    console.log("alguien hizo get en la ruta /ventas");   //se imprime en la terminal cuando alguien visita la ruta
    // http://localhost:5000/ventas

    getBD().collection('venta').find({}).limit(50).toArray((errorDelMetodoFind, resultadoDelMetodoFind) => { //funcion de la libreria mongodb del driver para la getBD() (mongoclient) para encontrar
        // un registro o hacer cualquier operacion de busqueda en la base de datos siempre y cuando se lo programemos en sus parametros 
        // dentro de los parentesis de la funcion find() puedo colocar los parametros de busqueda si no necesito hacer busqueda especifica desde la base 
        // de datos si no solo traer todos los registros le paso un objeto vacio {} , luego coloco el metodo si quiero de limit() que me 
        // limita la cantidad de query .. de registros que devuelve  .. luego convierto toda la informacion en un arreglo de formato json para
        // poder enviarlo al frontend y luego tiene como parametro una funcion que se ejecuta cuando termina la opercion del metodo find y me entrega 
        // dos parametros un error de este proceso si existe o el resultado del proceso find 
        // dentro del metodo find puedo colocar todos los filtros que quiera para tal consulta GET
        //limit esta funcion es opcional y me permite segun el numero dentro del parentesis, el parametro .. me trae los primeros 50 registros 
        // si hay mas de 50 en la base de datos para cada peticion get
        if (errorDelMetodoFind) {

            res.status(400).send("Error consultando las ventas");//envia un mensaje como resultado (res = respuesta del servidor al ejecutar
            // el metodo get) si existe un errorDelMetodoFind envia el status (400) de http y un mensaje Error consultando las venta al backend
        } else {

            res.json(resultadoDelMetodoFind); // res es la respuesta al ejecutar el metodo get entonces si el metodo find funciono y encontro los
            // registros entonces devuelva como respuesta=res al front en formato json el resultadoDelMetodoFind que son los registros de la 
            // base de datos
        }
        console.log(resultadoDelMetodoFind);
    });
    // const ventas = [  // simulacion de datos de la base de datos de mongoDB solo para pruebas
    //     // despues esto se cambia por una instruccion de consulta a la base de datos 
    //     {
    //         codigoVenta: '123',
    //         fecha: '14/10/2021',
    //         codigoProducto: '254',
    //         cantidadProducto: '2',
    //         nombreVendedor: 'Jhon ',
    //         nombreCliente: 'Stefania',
    //         precioUnitario: '10000',
    //         valorTotal: '20000'
    //     },
    //     {
    //         codigoVenta: '254',
    //         fecha: '14/10/2021',
    //         codigoProducto: '254',
    //         cantidadProducto: '2',
    //         nombreVendedor: 'Jhon ',
    //         nombreCliente: 'Stefania',
    //         precioUnitario: '10000',
    //         valorTotal: '20000'
    //     },
    //     {
    //         codigoVenta: '123',
    //         fecha: '14/10/2021',
    //         codigoProducto: '254',
    //         cantidadProducto: '2',
    //         nombreVendedor: 'Jhon ',
    //         nombreCliente: 'Stefania',
    //         precioUnitario: '10000',
    //         valorTotal: '20000'
    //     }
    // ]

    // res.send(ventas); // con el nombre del parametro de respuesta y el metodn 
    // send le envio lo que quiera y necesite el navegador cliente el front dentro de los parentesis esta 
    // la respuesta se puede devolver html tambien dentro de la respuesta 

});


// ruta para la peticion POST
rutasVenta.route('/ventas/nueva').post((req, res) => {

    // console.log(req); // req trae toda la trama de la data de la comuniciacion entre el front y el back con req.body 
    //estraemos la informacion de los datos como tal enviados 

    const datosVentas = req.body;

    // console.log('llaves de los datos: ', Object.keys(datosVentas));// con la funcion Object.keys(datosVentas) estrae de los datos 
    // del json enviado por el front las llaves de estos datos 
    // express esta diseñado para trabajar con formato json pero se debe usar primero 
    // los metodos y utilidades .use para recibir json

    try {

        if (Object.keys(datosVentas).includes('codigoVenta') &&
            Object.keys(datosVentas).includes('fecha') &&
            Object.keys(datosVentas).includes('codigoProducto') &&
            Object.keys(datosVentas).includes('cantidadProducto') &&
            Object.keys(datosVentas).includes('nombreVendedor') &&
            Object.keys(datosVentas).includes('nombreCliente') &&
            Object.keys(datosVentas).includes('precioUnitario') &&
            Object.keys(datosVentas).includes('valorTotal')

        ) {

            // aqui implementaremos el codigo para crear venta en la base de datos de mongoDB
            getBD().collection('venta').insertOne(datosVentas, (errorCrearRegistro, resultadoCrearRegistro) => { // usamos funciones de mongo para escribir y guardar en una
                // colecion documento creado con getBD().collection("venta"), venta es mi colecion y en ella guardo los datos traidos del front, el 
                // registro de una venta con el metodo inserOne, el segundo parametro de es una funcion que se ejecuta cuando la insercion es decir
                // el proceso de guardar el registro en la base de datos termine esta funcion tiene dos parametros uno es un error y esto es para mostrar
                // un mensaje de error si la operacion inserOne no fue satisfactoria y resul me trae el resultado creo 
                if (errorCrearRegistro) {

                    console.error(errorCrearRegistro);
                    res.sendStatus(500);

                } else {
                    console.log(res);
                    console.log(resultadoCrearRegistro);
                    res.sendStatus(200); // estado de peticion http de todo bien todo bien  (estados de las peticiones HTTP sirven
                    // para tener un buen control de manejo de error )
                }

            });// este es mi documento en la base de datos dentro de mi collecion
            //  (documentosenBaseDatos)--> getBD() = db.db('documentosenBaseDatos') donde guardare mis datos de las
            // ventas es decir representa el modelo o entidad ventas, y le insertare los datos a ese documento con 
            // el metodo insertOne, el primer parametro es mi registro de una venta y el  segundo parametro es una funcion que tiene 
            // dos parametros err= error si sucede un error , y result = aun nose que es pero es el resultado de esta operacion insert 

            // res.sendStatus(200);//esta linea me presenta error si la meto (Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client)  
            // estado de peticion http de todo bien todo bien  (estados de las peticiones HTTP sirven
            // para tener un buen control de manejo de error )

        } else {

            res.sendStatus(500);
        }
    }
    catch {

        res.sendStatus(500);// estado de peticion http de falla
    }
    // console.log("venta a crear", req.body);// con req.body accedo a la informacion enviada por el front ya convertida
    // res.send("ok venta creada con exito");
    // en un objeto con la funcion Express.json().. body es el cuerpo toda la informacion enviada desde el front 
    // body es una palabra reservada.. req.body es mi la informacion enviada desde el frontend
    // el parametro req es la peticion del cliente el frontend es el request==req

    // console.log("esto es una peticion a de tipo POST a la ruta ") // no saldra nada por que siempre las peticiones de navegcaion 
    // a las url son de tipo GET, las solicitudes que se hacen atraves de un navegador son siempre de tipo GET para 
    // probar las peticiones de los otros tipos diferentes a las get se necesita de las herramientas tecnologicas como 
    // postman e  insomnia me ayudaran a probar estas peticiones que no son get

});

// ruta para la peticion PATCH
rutasVenta.route("/ventas/editar").patch((req, res) => { // implementamos la ruta para la peticion de actualizar

    const edicion = req.body;// almaceno el cuerpo el objeto json, en formato json de mis datos 
    console.log(edicion);
    const filtroIdAActualizar = { _id: new ObjectId(edicion.id) } //hace el filtro sobre el id a buscar y asi encontrar el registro 
    // para aplicarle las modificaciones, este es el primer parametro que necesita el metodo .findOneAndUpdate( ) son tres 
    // los parametros que necesita para buscar el registro luego poder modificarlo 
    delete edicion.id; // debo eliminar el id del cuerpo de los datos del json porque si no me crea y duplica este
    // id en el registro que estoy modificando y me lo crea en la ultima linen del registro esto se hace cuando estoy 
    // editando por medio de obtener el id del regristro si fuera edicion por rutas URL no necesito esto 
    const operacionAtomica = { // instruccion atomic operators, me configura a la base de datos para editar 
        $set: edicion // le mando todo el cuerpo del registro a editar 
    };
    getBD()
        .collection("venta") // en que coleccion voy hacer la operacion de actualizar
        .findOneAndUpdate(filtroIdAActualizar, operacionAtomica, { upsert: true, returnOriginal: true },
            (errorOperacionPATCH, resultaOperacionPATCH) => {
                if (errorOperacionPATCH) {
                    console.error("Error actualizando la venta", errorOperacionPATCH);
                    res.sendStatus(500);
                } else {
                    console.log('Actualizado con exito');
                    res.sendStatus(200);
                }

            }) // .findOneAndUpdate --> esta funcion recibe tres parametros uno es 
    // el filtro para el saber cual es el registro a modificar el segundo parametro es que se va a modificar y en este cso 
    // queremos poder modifcar cualquier campo del registro por eso se pasa todo el cuerpo de la request que es todo 
    // el objeto en formato json de los datos del formulario con los cambios hechos, el tercer parametro son opciones 
    // como el upsert = me permite hacer algo cuando no encuentra el id y Crea un nuevo documento si ningún documento coincide con el filter. 
    // returnOriginal= me retorna el dato original para poder comparar y bueno hay mas opciones para configurar y depende 
    // del caso de uso
    // y por ultimo parametro el colbart la funcion que se ejecuta cuando la operacion PATCH fue realizada

});

// ruta para la peticion DELETE
rutasVenta.route("/ventas/eliminar").delete((req, res) => {
    const cuerpoRegistroAEliminar = req.body;//  guardo el cuerpo de la informacion es decir el json donde esta todos los datos 
    // de los campos del registro de la venta a eliminar 
    const filtroIdAEliminar = { _id: new ObjectId(cuerpoRegistroAEliminar.id) } //hace el filtro sobre el id a buscar y asi encontrar el registro 
    // para poder eliminarlo , este es el primer parametro que necesita el metodo .findOneAndUpdate( ) son tres 
    // los parametros que necesita para buscar el registro luego poder modificarlo 

    getBD().collection('venta').deleteOne(filtroIdAEliminar, (errMetodoEliminar, resultMetodoEliminar) => {

        console.log(resultMetodoEliminar);
        if (errMetodoEliminar) {

            console.error(errMetodoEliminar);
            res.sendStatus(500); // res es la respuesta del servidor enviada al cliente frontend cuando se ejecuta este metodo 
            // delete
        } else {

            res.sendStatus(200);
        }

    });
}); 

export default rutasVenta ;// lo exportamos para usarlo en mi server.js con los metodo app.use(rutasVenta)