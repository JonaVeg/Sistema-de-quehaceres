document.getElementById('assign-task').addEventListener('click', () => {
    const task = document.getElementById('task-select').value;
    const person = document.getElementById('person-select').value;
    const day = document.getElementById('day-select').value;

    // Mandamos el mensaje a la persona correspondiente
    if (person === 'jonathan') {
        mandarMensaje('522218951103', task, day);  // Número de Jonathan
    } else if (person === 'santiago') {
        mandarMensaje('522212002440', task, day);  // Número de Santiago
    }
});

function mandarMensaje(numeroTelefono, task, day) {
    console.log('La función mandarMensaje() se está ejecutando correctamente.');

    var url = encodeURIComponent('https://21automatizacion.netlify.app/');
    var mensaje = encodeURIComponent(`Hola, se te ha asignado la siguiente tarea: ${task} para el día ${day}. Visita el link para ver tus tareas del día: ${url}`);
    var urlWhatsApp = 'https://wa.me/' + numeroTelefono + '?text=' + mensaje;

    setTimeout(function() {
        window.location.href = urlWhatsApp;
    }, 500); // Espera de 500ms antes de redirigir
}






// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDOhPxir8yd3Dto8bmxTRLILzfdWdnjqig",
    authDomain: "basededatos-92907.firebaseapp.com",
    databaseURL: "https://basededatos-92907-default-rtdb.firebaseio.com",
    projectId: "basededatos-92907",
    storageBucket: "basededatos-92907.appspot.com",
    messagingSenderId: "66836963789",
    appId: "1:66836963789:web:714d0a03c8309c6248a484"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener referencia a la base de datos
const database = firebase.database();

// Función para agregar una tarea a la base de datos
function addTaskToDatabase(day, person, taskName) {
    const taskRef = database.ref(`${day}/${person}`);
    taskRef.push(taskName)
        .then(() => console.log('Tarea añadida a Firebase'))
        .catch(error => console.error('Error al añadir la tarea a Firebase:', error));
}

// Función para agregar una tarea a la lista en la interfaz
function addTaskToList(day, person, taskName) {
    const taskList = document.getElementById(`${day}-tasks-${person}`);
    if (taskList) { // Verificar que el elemento exista
        const listItem = document.createElement('li');
        listItem.textContent = taskName;
        listItem.className = 'list-group-item';
        taskList.appendChild(listItem);
    } else {
        console.error('No se encontró la lista de tareas para el día y persona seleccionados.');
    }
}

// Manejar la asignación de tareas
document.getElementById('assign-task').addEventListener('click', function() {
    const taskSelect = document.getElementById('task-select');
    const personSelect = document.getElementById('person-select');
    const daySelect = document.getElementById('day-select');

    const selectedTask = taskSelect.value;
    const selectedPerson = personSelect.value;
    const selectedDay = daySelect.value;

    if (selectedTask && selectedPerson && selectedDay) {
        // Agregar tarea a la lista y a Firebase
        addTaskToList(selectedDay, selectedPerson, selectedTask);
        addTaskToDatabase(selectedDay, selectedPerson, selectedTask);

        // Restablecer los selectores
        taskSelect.value = '';
        personSelect.value = '';
        daySelect.value = '';
    } else {
        alert('Por favor, selecciona una tarea, una persona y un día.');
    }
});

// Función para recuperar y mostrar las tareas desde Firebase en tiempo real
function loadTasksFromDatabase() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const people = ['jonathan', 'santiago'];

    days.forEach(day => {
        people.forEach(person => {
            const taskList = document.getElementById(`${day}-tasks-${person}`);
            if (taskList) {
                // Escucha los cambios en Firebase en tiempo real
                database.ref(`${day}/${person}`).on('value', snapshot => {
                    taskList.innerHTML = ''; // Limpiar la lista antes de agregar nuevas tareas
                    snapshot.forEach(childSnapshot => {
                        const task = childSnapshot.val();
                        const listItem = document.createElement('li');
                        listItem.textContent = task;
                        listItem.className = 'list-group-item';
                        taskList.appendChild(listItem);
                    });
                });
            }
        });
    });
}



// Función para eliminar todas las tareas de un día específico en Firebase
function deleteTasks(day) {
    const confirmation = confirm(`¿Estás seguro de que deseas eliminar todas las tareas de ${day}?`);
    if (confirmation) {
        // Elimina todas las tareas del día en Firebase
        const taskRef = database.ref(day);
        taskRef.remove()
            .then(() => {
                console.log(`Tareas de ${day} eliminadas de Firebase`);
                // Limpia las listas en la interfaz
                document.getElementById(`${day}-tasks-jonathan`).innerHTML = '';
                document.getElementById(`${day}-tasks-santiago`).innerHTML = '';
            })
            .catch(error => console.error(`Error al eliminar las tareas de ${day} en Firebase:`, error));
    }
}






if ('serviceWorker.js' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
        console.log('Service Worker registrado correctamente:', registration);
    })
    .catch((error) => {
        console.error('Error al registrar el Service Worker:', error);
    });
}

// Cargar las tareas al iniciar la página
loadTasksFromDatabase();
