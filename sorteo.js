// Tu Public Key de EmailJS
const emailjsPublicKey = "AMjwvpq1VTFwL9L2K";
emailjs.init(emailjsPublicKey);

let participantes = [];

// Obtener referencias del DOM
let contenedor = document.getElementById("contenedor");
let contenedorInput = document.getElementById("contenedorInput");
let introducir = document.getElementById("introducir");

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

    // Crear botón para realizar el sorteo
    let sortear = document.createElement("button");
    sortear.id = "sortear";
    sortear.textContent = "Realizar sorteo";
    sortear.style.padding = "3px";
    contenedorInput.appendChild(sortear);

    // Ocultar botón "Introducir"
    introducir.style.display = "none";

    // Agregar evento al botón de sorteo
    sortear.addEventListener("click", function () {
        guardarParticipantes(); // Guardar los participantes antes del sorteo
        realizarSorteo(); // Realizar el sorteo y enviar los correos
    });
});

// Guardar los participantes
function guardarParticipantes() {
    participantes = []; // Limpiar el array antes de guardar

    let inputsNombre = document.querySelectorAll("input[type='text']");
    let inputsEmail = document.querySelectorAll("input[type='email']");

    for (let i = 0; i < inputsNombre.length; i++) {
        let nombre = inputsNombre[i].value.trim();
        let email = inputsEmail[i].value.trim();

        if (nombre === "" || email === "") {
            alert("Por favor, completa todos los campos.");
            return;
        }

        participantes.push({ nombre, email });
    }

    console.log(participantes);
    alert("Datos guardados correctamente.");
}

// Realizar el sorteo y enviar los correos
function realizarSorteo() {
    if (participantes.length < 2) {
        alert("Debe haber al menos 2 participantes para el sorteo.");
        return;
    }

    // Mezclar los participantes
    let shuffled = [...participantes];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Enviar correos
    participantes.forEach((participante, i) => {
        const amigoInvisible = shuffled[(i + 1) % shuffled.length]; // Siguiente en la lista
        enviarCorreo(participante.email, participante.nombre, amigoInvisible.nombre);
    });

    alert("Los correos han sido enviados.");
}

// Enviar correo con EmailJS
function enviarCorreo(email, nombre, amigoInvisible) {
    emailjs
        .send("service_lhn3yof", "template_g90zaqy", {
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
