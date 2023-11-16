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
      { path: '/totalcenas/',       url: 'totalcenas.html',   },
      { path: '/totalboliche/',     url: 'totalboliche.html',   },
      { path: '/info/',             url: 'info.html',   },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
var db = firebase.firestore();
var colUsuarios = db.collection("Usuarios");
// var colReservaCena = db.collection("reservascena");
var colReservaCenas = db.collection("reservascenas");
var colReservaBoliches = db.collection("reservasboliches");


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
  //  sembrarDatos();
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
    $$("#diaReservaCenav").text(dia)
    $$("#cantPersonascena").text(cantidad);

})

$$(document).on('page:init', '.page[data-name="reservar"]', function (e) {
    cargarDatosUsuarioLogueado();
})

$$(document).on('page:init', '.page[data-name="cena"]', function (e) {
    $$("#btncena").on("click", diaReservadoCena);
    $$("#btncena").on("click", cantidadPersonas);
    $$("#btncena").on("click", tipoReservaCena);
    $$("#btncena").on("click", obtenerdatosCena);
    $$("#btncena").on("click", guardarReservaCena); //
    diaReservadoCena();
    cantidadPersonas();
    obtenerdatosCena();
    guardarReservaCena();
    tipoReservaCena();
    cargarDatosUsuarioLogueado();
})

$$(document).on('page:init', '.page[data-name="boliche"]', function (e) {
    $$("#btnboliche").on("click", diaReservadoBoliche);
    $$("#btnboliche").on("click", cantidadPersonasBoliche);
    $$("#btnboliche").on("click", tipoReservaBoliche);
    $$("#btnboliche").on("click", obtenerdatosBoliche);
    $$("#btnboliche").on("click", guardarReservaBoliche);
    diaReservadoBoliche();
    cantidadPersonasBoliche();
    obtenerdatosBoliche();
    guardarReservaBoliche();
    tipoReservaBoliche();
    cargarDatosUsuarioLogueado();
})

$$(document).on('page:init', '.page[data-name="cenaReservada"]', function (e) {
    $$("#confNombre").text(nombre)
    $$("#confEmail").text(email)
    $$("#diaReservaCena").text(dia)
    $$("#cantPersonascena").text(cantidad)
    diaReservadoCena()
    cargarDatosUsuarioLogueado()
})

$$(document).on('page:init', '.page[data-name="bolicheReservado"]', function (e) {
    $$("#confNombre").text(nombre)
    $$("#confEmail").text(email)  
    $$("#diaReservaBoliche").text(diaB)
    $$("#cantPersonasBoliche").text(cantidadB)
    diaReservadoBoliche()
    cargarDatosUsuarioLogueado()
  })

$$(document).on('page:init', '.page[data-name="verReservas"]', function (e) {
    // diaReservado();
    // $$("#totalc").on("click", sumarcenas);
})

$$(document).on('page:init', '.page[data-name="totalcenas"]', function (e) {
  $$("#confNombre").text(nombre)
  $$("#confEmail").text(email)
  $$("#diaReservaCena").text(dia)
  $$("#cantPersonascena").text(cantidad)
  // diaReservadoCena()
  // cargarDatosUsuarioLogueado()
})
$$(document).on('page:init', '.page[data-name="totalboliche"]', function (e) {
  $$("#confNombre").text(nombre)
  $$("#confEmail").text(email)  
  $$("#diaReservaBoliche").text(diaB)
  $$("#cantPersonasBoliche").text(cantidadB)
})
$$(document).on('page:init', '.page[data-name="info"]', function (e) {
    
})

/* MIS FUNCIONES */
var email, clave, nombre, apellido, dia, cantidad, tipo, diaB, cantidadB, tipoB, totalc;

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

function diaReservadoCena() {
    console.log("entraste a la funcion");
    dia = document.querySelector("input[name=diaReservaCena]:checked").value
    console.log(dia);
}

function diaReservadoBoliche() {
  console.log("entraste a la funcion");
  diaB = document.querySelector("input[name=diaReservaBoliche]:checked").value
  console.log(diaB);
}

function cantidadPersonas() {
  // cantidad = 0  
  cantidad = document.querySelector("input[id=cantPersonas]").value
    console.log(cantidad);
}

function cantidadPersonasBoliche() {
  // cantidad = 0  
  cantidadB = document.querySelector("input[id=cantPersonasBoliche]").value
    console.log(cantidadB);
}

function tipoReservaCena() {
  tipo = "cena"
}

function tipoReservaBoliche() {
  tipoB = "Boliche"
}

// Manejar el clic en el botón de guardar reserva
function obtenerdatosCena() {
  // Obtener el día seleccionado
  dia = document.querySelector("input[name=diaReservaCena]:checked").value
  console.log(dia)
// Obtener la cantidad de personas
  var cantidad = parseInt($$('input[name="cantidad"]').val());
  console.log(cantidad)
  var tipo = "cena";
  // var tipo = $$(this).data('tipo');
  console.log(tipo);
}

function obtenerdatosBoliche() {
  // Obtener el día seleccionado
  diaB = document.querySelector("input[name=diaReservaBoliche]:checked").value
  console.log(dia)
// Obtener la cantidad de personas
  var cantidadB = parseInt($$('input[name="cantidadB"]').val());
  console.log(cantidadB)
  var tipoB = "Boliche";
  // var tipo = $$(this).data('tipo');
  console.log(tipoB);
}

// Validar que se haya seleccionado un día y se haya ingresado la cantidad de personas
  // if (!diaReservaCena || !cantPersonas) {
  //   app.dialog.alert("Por favor, complete todos los campos.");
  //   return;
  // }

// Función para guardar la reserva en la base de datos
function guardarReservaCena() {
      if (dia!="" && cantidad!="") {
        datos = { dia: dia, cantidad: cantidad, tipo: "cena", email: email}
        
        colReservaCenas.doc().set(datos)
        .then( function(docRef) {
          $$("#infoDatos").html("<hr>" + dia + " / " + cantidad + " / " + tipo);
        })
        .catch(function(error) {
            console.log("Error: " + error);
        })
    }
  }

  function guardarReservaBoliche() {
    if (diaB!="" && cantidadB!="") {
      datos = { dia: diaB, cantidad: cantidadB, tipo: "boliche", email: email}
      
      colReservaBoliches.doc().set(datos)
      .then( function(docRef) {
        $$("#infoDatos").html("<hr>" + dia + " / " + cantidad + " / " + tipo);
      })
      .catch(function(error) {
          console.log("Error: " + error);
      })
  }
}
   

// SUMAR LA CANTIDAD DE VIERNES Y SABADO
// function sumarcenas(cantidadc){
  // colReservaCenas.get()
  //   .then( function(qs) {
  //       qs.forEach( function(elDoc) {
  //           cantidad = elDoc.data().cantidad;
//   var cantidadc = firebase.firestore().collection("reservascenas");
//   // Obtener los documentos y sumar las cantidades
//   cantidadc.get().then((querySnapshot) => {
//       var totalCantidad = 0;
//       querySnapshot.forEach((doc) => {
//           // Obtener el valor del campo 'cantidad' de cada documento
//           var cantidad = doc.data().cantidad;
//           // Sumar la cantidad al total
//           totalCantidad += cantidad;
//       });
//       // Imprimir el total en la consola o actualizar tu interfaz de usuario
//       console.log("Total de cantidades:", totalCantidad);
//   });
// }

// // Obtener los elementos donde se mostrarán las cantidades para viernes y sábado
// var viernesCantidadElement = document.getElementById('viernesCantidad');
// var sabadoCantidadElement = document.getElementById('sabadoCantidad');

// // Consulta para viernes
// var viernesQuery = reservascenasRef.where("dia", "==", "viernes");

// // Consulta para sábado
// var sabadoQuery = reservascenasRef.where("dia", "==", "sabado");

// // Actualizar las cantidades para viernes y sábado
// function actualizarCantidades(query, element) {
//     query.onSnapshot((snapshot) => {
//         var totalCantidad = 0;
//         snapshot.forEach((doc) => {
//             totalCantidad += doc.data().cantidad;
//         });
//         element.textContent = totalCantidad;
//     });
// }

// // Actualizar las cantidades para viernes
// actualizarCantidades(viernesQuery, viernesCantidadElement);

// // Actualizar las cantidades para sábado
// actualizarCantidades(sabadoQuery, sabadoCantidadElement);

// }

/* SEMBRADO */

// function sembrarDatos() {

//   var dato = { dia: "viernes", cantidad: "7", tipo: "cena" }
//   var miId = "email";
//   colReservaCena.doc(miId).set(dato)
//   .then( function(docRef) {
//       console.log("Doc creado con el id: " + docRef.id);
//   })
//   .catch(function(error) {
//       console.log("Error: " + error);
//   })
// }

//   var dato = { dia: "viernes", cantidad: "4"}
//   var miId = "cena";
//   reservasCollection.doc(miId).set(dato)
//   .then( function(docRef) {
//       console.log("Doc creado con el id: " + docRef.id);
//   })
//   .catch(function(error) {
//       console.log("Error: " + error);
//   })

  // var dato = { dia: "sabado", cantidad: "3"}
  // var miId = "boliche";
  // reservasCollection.doc(miId).set(dato)
  // .then( function(docRef) {
  //     console.log("Doc creado con el id: " + docRef.id);
  // })
  // .catch(function(error) {
  //     console.log("Error: " + error);
  // })

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