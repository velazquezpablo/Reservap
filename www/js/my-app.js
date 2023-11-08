// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      { path: '/index/',            url: 'index.html',   },
      { path: '/registro/',         url: 'registro.html',   },
      { path: '/confirmacion/',     url: 'confirmacion.html',   },
      { path: '/reservar/',         url: 'reservar.html',   },
      { path: '/login/',            url: 'login.html',   },
      { path: '/verReservas/',      url: 'verReservas.html',   },
      { path: '/cena/',             url: 'cena.html',   },
      { path: '/boliche/',          url: 'boliche.html',   },
      { path: '/cenaReservada/',    url: 'cenaReservada.html',   },
      { path: '/bolicheReservado/', url: 'bolicheReservado.html',   },
      { path: '/viernes/',          url: 'viernes.html',   },
      { path: '/sabado/',           url: 'sabado.html',   },
      { path: '/info/',             url: 'info.html',   },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
var db = firebase.firestore();
// var colRoles = db.collection("Roles");
var colUsuarios = db.collection("Usuarios");
// var colAdministrador = db.collection("Administrador");
// var colMensaje = db.collection("MENSAJES");


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    $$("#btnRegistro").on("click", fnRegistro);
   //sembrarDatos();

    cargarUsuariosEjemplo();

})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    $$("#btnFinReg").on("click", fnFinRegistro);
})

$$(document).on('page:init', '.page[data-name="login"]', function (e) {
    $$("#btnInicioSesion").on("click", fnIniciarSesion);
})


$$(document).on('page:init', '.page[data-name="confirmacion"]', function (e) {
    $$("#confNombre").text(nombre)
    $$("#confEmail").text(email)

    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    // var fnLeeOKelGPS = function(position) {
    //     latitud = position.coords.latitude 
    //     longitud = position.coords.longitude

    //     $$("#confLatitud").text(latitud)
    //     $$("#confLongitud").text(longitud)

        /*
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
        */
        // cant de segundos que pasaron desde el 1/1/1970 
//     };

//     // onError Callback receives a PositionError object
//     //
//     function onErrorGPS(error) {
//         alert('code: '    + error.code    + '\n' +
//               'message: ' + error.message + '\n');
//     }

//     navigator.geolocation.getCurrentPosition(fnLeeOKelGPS, onErrorGPS);



})

$$(document).on('page:init', '.page[data-name="reservar"]', function (e) {
    cargarDatosUsuarioLogueado();
})

$$(document).on('page:init', '.page[data-name="cena"]', function (e) {
    diaReservado();
})



/* SEMBRADO */  
function sembrarDatos() {

    var dato = { apellido: "Montenegro", nombre: "Jorge", rol: "Administrador" }
    var miId = "admin@admin.com";
    colUsuarios.doc(miId).set(dato)
    .then( function(docRef) {
        console.log("Doc creado con el id: " + docRef.id);
    })
    .catch(function(error) {
        console.log("Error: " + error);
    })

}



/* MIS FUNCIONES */
var email, clave, nombre, apellido, dias, cantidad;

function fnIniciarSesion() {
    email = $$("#loginEmail").val();
    clave = $$("#loginClave").val();

    if (email!="" && clave!="") {


        firebase.auth().signInWithEmailAndPassword(email, clave)
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;

            console.log("Bienvenide! " + email);

            mainView.router.navigate('/reservar/');
            // ...
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.error(errorCode);
                console.error(errorMessage);
          });
    }
}


function fnRegistro() {
    email = $$("#indexEmail").val();
    clave = $$("#indexClave").val();

    if (email!="" && clave!="") {
        firebase.auth().createUserWithEmailAndPassword(email, clave)
              .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                console.log("Bienvenide! " + email);
                // ...
                mainView.router.navigate('/registro/');
              })
              .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorCode);
                console.error(errorMessage);
                if (errorCode == "auth/email-already-in-use") {
                    console.error("El mail ya esta en uso");
                }
                // ..
              });
        //mainView.router.navigate("/registro/")
    }
}

function fnFinRegistro() {
    nombre = $$("#regNombre").val();
    apellido = $$("#regApellido").val();

    if (nombre!="" && apellido!="") {

        datos = { nombre: nombre, apellido: apellido, rol: "Usuario" }
        elID = email;

        colUsuarios.doc(elID).set(datos)
        .then( function(docRef) {
           mainView.router.navigate("/confirmacion/") 
        })
        .catch(function(error) {
            console.log("Error: " + error);
        })
    }
}

function cargarUsuariosEjemplo() {
    colUsuarios.get()
    .then( function(qs) {
        qs.forEach( function(elDoc) {
            nombre = elDoc.data().nombre;
            apellido = elDoc.data().apellido;
            rol = elDoc.data().rol;
            email = elDoc.id;
            $$("#listaUsuarios").append("<hr>" + nombre + " / " + apellido + " / " + rol + " / " + email);
        } )
    })
    .catch(function(error) {
        console.log("Error: " + error);
    })

}

function cargarDatosUsuarioLogueado() {
    colUsuarios.doc(email).get()
    .then( function(unDoc) {
        //console.log(unDoc);
        nombre = unDoc.data().nombre;
        apellido = unDoc.data().apellido;
        rol = unDoc.data().rol;
        email = unDoc.id;
        $$("#infoDatos").html("<hr>" + nombre + " / " + apellido + " / " + rol + " / " + email);
    } )
    .catch(function(error) {
        console.log("Error: " + error);
    })}

function diaReservado() {
    dias = document.querySelector("input[name=diaReserva]:checked").value
}

function cantidadPersonas() {
    cantPersonas = $$("#cantPersonas").text(cantidad)
}