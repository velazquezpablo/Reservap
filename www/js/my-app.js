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
var colUsuarios = db.collection("Usuarios");


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
    $$("#diaCenaReservada").text(dias)
    $$("#cantPersonascena").text(cantidad);

})

$$(document).on('page:init', '.page[data-name="reservar"]', function (e) {
    cargarDatosUsuarioLogueado();
})

$$(document).on('page:init', '.page[data-name="cena"]', function (e) {
    $$("#btncena").on("click", diaReservado);
    $$("#btncena").on("click", cantidadPersonas);
    diaReservado();
    cantidadPersonas();
})

$$(document).on('page:init', '.page[data-name="verReservas"]', function (e) {
    // diaReservado();
})

$$(document).on('page:init', '.page[data-name="boliche"]', function (e) {
    // diaReservado();
})

$$(document).on('page:init', '.page[data-name="cenaReservada"]', function (e) {
    $$("#confNombre").text(nombre)
    $$("#confEmail").text(email)
    $$("#diaCenaReservada").text(dias)
    $$("#cantPersonascena").text(cantidad);
   
})

$$(document).on('page:init', '.page[data-name="bolicheReservado"]', function (e) {
    diaReservado()
    cargarDatosUsuarioLogueado()
    $$("#diaCenaReservada").text(dias)
    $$("#cantPersonascena").text(cantidad);
})
$$(document).on('page:init', '.page[data-name="viernes"]', function (e) {
   
})
$$(document).on('page:init', '.page[data-name="sabado"]', function (e) {
   
})
$$(document).on('page:init', '.page[data-name="info"]', function (e) {
    
})

/* SEMBRADO */  
// function sembrarDatos() {

//     var dato = { apellido: "Montenegro", nombre: "Jorge", rol: "Administrador" }
//     var miId = "admin@admin.com";
//     colUsuarios.doc(miId).set(dato)
//     .then( function(docRef) {
//         console.log("Doc creado con el id: " + docRef.id);
//     })
//     .catch(function(error) {
//         console.log("Error: " + error);
//     })
// }


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
            console.log("Bienvenid@!!! " + email);
            colUsuarios.doc(email).get()
            // colUsuarios.get()
            .then(function (result) {
                console.log(result.id);
                    
                    data = result.data();
                    console.log("data", data.rol);
                    console.log("data", data.nombre);


            if (data.rol == "Administrador") {
                mainView.router.navigate('/verReservas/')
            }
                else if (data.rol == "Usuario") {
                mainView.router.navigate('/reservar/')
                }
                
            })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
        
                    console.error(errorCode);
                        console.error(errorMessage);
                  });

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
              });
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
    console.log("entraste a la funcion");
    dias = document.querySelector("input[name=diaReserva]:checked").value
    console.log(dias);
  
}

function cantidadPersonas() {
    cantidad =document.querySelector("input[id=cantPersonas]").value
    console.log(cantidad);
}
