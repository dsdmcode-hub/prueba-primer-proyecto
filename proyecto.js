// Configuración global de la aplicación
const START_HOUR = 6; // Empieza a las 6:00 AM
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
let currentDay = 'Lunes';

// Elementos del DOM
const container = document.getElementById('time-slots-container');
const dayTitle = document.getElementById('current-day-title');
const saveBtn = document.getElementById('save-btn');
const dayButtons = document.querySelectorAll('.day-btn');

// Genera los 48 bloques de 30 minutos para el día activo
function generateTimeSlots() {
    container.innerHTML = ''; 
    
    // Carga los datos existentes de la memoria o inicia vacío
    const savedData = JSON.parse(localStorage.getItem(`schedule_${currentDay}`)) || {};

    let currentMinutes = START_HOUR * 60;
    const totalMinutesInDay = 24 * 60;

    for (let i = 0; i < 48; i++) {
        let startMin = currentMinutes % totalMinutesInDay;
        let startH = Math.floor(startMin / 60).toString().padStart(2, '0');
        let startM = (startMin % 60).toString().padStart(2, '0');

        let endMin = (currentMinutes + 30) % totalMinutesInDay;
        let endH = Math.floor(endMin / 60).toString().padStart(2, '0');
        let endM = (endMin % 60).toString().padStart(2, '0');

        const timeLabel = `${startH}:${startM} - ${endH}:${endM}`;
        const savedTask = savedData[timeLabel] || '';

        const slotDiv = document.createElement('div');
        slotDiv.className = 'time-slot';
        slotDiv.innerHTML = `
            <div class="time-label">${timeLabel}</div>
            <div class="task-input-container">
                <input type="text" data-time="${timeLabel}" placeholder="Escribe una tarea..." value="${savedTask}">
            </div>
        `;
        container.appendChild(slotDiv);

        currentMinutes += 30;
    }
}

// Guarda las tareas escritas en el almacenamiento local (LocalStorage)
function saveSchedule() {
    const inputs = container.querySelectorAll('input');
    const daySchedule = {};

    inputs.forEach(input => {
        const time = input.getAttribute('data-time');
        const task = input.value.trim();
        
        if (task) {
            daySchedule[time] = task;
        }
    });

    localStorage.setItem(`schedule_${currentDay}`, JSON.stringify(daySchedule));
    
    // Efecto visual de guardado exitoso
    saveBtn.textContent = '¡Guardado con éxito!';
    saveBtn.style.backgroundColor = '#2e7d32'; // Verde temporal
    
    setTimeout(() => {
        saveBtn.textContent = 'Guardar Horario';
        saveBtn.style.backgroundColor = ''; // Restaura el color rojo
    }, 2000);
}

// Cambiar de día con un clic
dayButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        saveSchedule(); // Auto-guarda el día actual antes de cambiar

        document.querySelector('.day-btn.active').classList.remove('active');
        button.classList.add('active');

        currentDay = DAYS[index];
        dayTitle.textContent = `Horario de ${currentDay}`;
        
        generateTimeSlots();
    });
});

// Inicialización de la aplicación
saveBtn.addEventListener('click', saveSchedule);
generateTimeSlots();
