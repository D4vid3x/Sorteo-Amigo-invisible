// Tu Public Key de EmailJS
const emailjsPublicKey = "E-KPQKvsslVLSUnZ2";
emailjs.init(emailjsPublicKey);

let participantes = [];

// Obtener referencias del DOM
let contenedor = document.getElementById("contenedor");
let contenedorInput = document.getElementById("contenedorInput");
let introducir = document.getElementById("introducir");
let sortear = document.getElementById("sortear");

introducir.addEventListener("click", function () {
    let numParticipantes = parseInt(
        document.getElementById("numParticipantes").value
    );
    if (isNaN(numParticipantes) || numParticipantes <= 0) {
        alert("Por favor, introduce un número válido de participantes.");
        return;
    }

    // Crear inputs para los datos de los participantes
    contenedorInput.innerHTML = ""; // Limpiar contenedor antes de agregar nuevos elementos
    let texto = document.createElement("h1");
    texto.textContent = "Datos de los participantes";
    contenedorInput.appendChild(texto);

    for (let i = 0; i < numParticipantes; i++) {
        let nuevoParticipanteNom = document.createElement("input");
        nuevoParticipanteNom.type = "text";
        nuevoParticipanteNom.placeholder = `Nombre del participante ${i + 1}`;
        nuevoParticipanteNom.id = `nombre-${i + 1}`;
        nuevoParticipanteNom.style.padding = "2px";

        let nuevoParticipanteEmail = document.createElement("input");
        nuevoParticipanteEmail.type = "email";
        nuevoParticipanteEmail.placeholder = `Email del participante ${i + 1}`;
        nuevoParticipanteEmail.id = `email-${i + 1}`;
        nuevoParticipanteEmail.style.padding = "2px";

        let saltoDeLinea = document.createElement("br");

        contenedorInput.appendChild(nuevoParticipanteNom);
        contenedorInput.appendChild(nuevoParticipanteEmail);
        contenedorInput.appendChild(saltoDeLinea);
    }

    // Mostrar botón para realizar el sorteo
    sortear.style.display = "block"; // Mostrar el botón
    sortear.style.padding = "3px";

    console.log("Botón de sorteo mostrado:", sortear.style.display); // Confirmar

    // Ocultar botón "Introducir"
    introducir.style.display = "none";
});

// Guardar los participantes
function guardarParticipantes() {
    participantes = []; // Limpiar el array antes de guardar

    // Limitar la búsqueda a los inputs dentro de contenedorInput
    let inputsNombre = contenedorInput.querySelectorAll("input[type='text']");
    let inputsEmail = contenedorInput.querySelectorAll("input[type='email']");

    console.log("Inputs de nombres:", inputsNombre.length);
    console.log("Inputs de emails:", inputsEmail.length);

    if (inputsNombre.length !== inputsEmail.length) {
        alert("El número de campos de nombre y email no coincide.");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (let i = 0; i < inputsNombre.length; i++) {
        let nombre = inputsNombre[i].value.trim();
        let email = inputsEmail[i].value.trim();

        if (nombre === "" || email === "") {
            alert("Por favor, completa todos los campos.");
            return false;
        }

        if (!emailRegex.test(email)) {
            alert("Por favor, introduce un email válido.");
            return false;
        }

        participantes.push({ nombre, email });
    }

    console.log(participantes);
    return true;
}

// Función para barajar los participantes y asegurarse de que no se asignen a sí mismos
function mezclarYAsignar(participantes) {
    let shuffled = [...participantes];
    let n = shuffled.length;

    // Realizamos el barajado con Fisher-Yates
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Intercambiar
    }

    // Comprobar si algún participante está asignado a sí mismo y hacer ajustes
    let asignacionesCorrectas = false;

    while (!asignacionesCorrectas) {
        asignacionesCorrectas = true; // Suponemos que las asignaciones están bien

        for (let i = 0; i < n; i++) {
            if (shuffled[i] === participantes[i]) {
                // Si alguien está asignado a sí mismo, hacemos un intercambio
                asignacionesCorrectas = false; // Necesitamos ajustar
                const tempIndex = (i + 1) % n; // Tomamos el siguiente participante
                [shuffled[i], shuffled[tempIndex]] = [shuffled[tempIndex], shuffled[i]]; // Intercambiamos
            }
        }
    }

    return shuffled;
}

// Realizar el sorteo y enviar los correos
sortear.addEventListener("click", function () {
    if (!guardarParticipantes()) return; // Guardar los participantes antes del sorteo
    if (participantes.length < 2) {
        alert("Debe haber al menos 2 participantes para el sorteo.");
        return;
    }

    // Mezclar los participantes y asignar amigos invisibles
    let shuffled = mezclarYAsignar(participantes);

    // Enviar correos
    participantes.forEach((participante, i) => {
        const amigoInvisible = shuffled[i]; // Aseguramos que no sea el mismo
        enviarCorreo(participante.email, participante.nombre, amigoInvisible.nombre);
    });

    alert("Los correos han sido enviados.");
});

// Enviar correo con EmailJS
function enviarCorreo(email, nombre, amigoInvisible) {
    emailjs
        .send("service_ync5bvi", "template_dbn1pki", {
            to_email: email,
            to_name: nombre,
            amigo_invisible: amigoInvisible,
        })
        .then(
            function (response) {
                console.log("Correo enviado a:", nombre, response.status, response.text);
            },
            function (error) {
                console.error("Error al enviar el correo a:", nombre, error);
            }
        );
}
