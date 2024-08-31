
// Scripts de Firebase -->
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

    // Función para agregar una tarea a la lista
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
            addTaskToList(selectedDay, selectedPerson, selectedTask);
            addTaskToDatabase(selectedDay, selectedPerson, selectedTask);
            taskSelect.value = ''; // Restablecer el menú desplegable de tareas
            personSelect.value = ''; // Restablecer el menú desplegable de personas
            daySelect.value = ''; // Restablecer el menú desplegable de días
        } else {
            alert('Por favor, selecciona una tarea, una persona y un día.');
        }
    });

//<!-- Script para recuperar y mostrar las tareas desde Firebase -->
    // Función para recuperar y mostrar las tareas desde Firebase
    function loadTasksFromDatabase() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const people = ['jonathan', 'santiago'];

        days.forEach(day => {
            people.forEach(person => {
                const taskList = document.getElementById(`${day}-tasks-${person}`);
                if (taskList) {
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
    // Función para eliminar tareas de un día específico en Firebase
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


    // Cargar las tareas al iniciar
    loadTasksFromDatabase();
