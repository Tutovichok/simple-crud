// создаем переменную важности с помощью массва 
const priorities = [
    {id: '', title: ''},
    {id: 'important', title: 'Important'},
    {id: 'does-not-matter', title: 'Does not matter'},
    {id: 'very-important', title: 'Very important'}
]

// добавляем массив задач по умолчанию или загружаем их из localStorage для того, чтобы на странице изменения не сбрасывались 
let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    {id: 1, name: 'Drink 11 litters Pepsi', deadline: '2025-09-08', priority: 'Does not matter'},
    {id: 2, name: 'Become a programmer', deadline: '2027-09-08', priority: 'Very important'},
    {id: 3, name: 'Marry', deadline: '2031-09-08', priority: 'Important'},
    {id: 4, name: 'Become a rapper', deadline: '2029-09-08', priority: 'Important'},
    {id: 5, name: 'Buy a car for my sister', deadline: '2035-09-08', priority: 'Important'},
    {id: 6, name: 'Multiply', deadline: '2032-09-08', priority: 'Important'},
    {id: 7, name: 'Travel', deadline: '2033-09-08', priority: 'Does not matter'}
]

// функция для сохранения задач в localStorage
function saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

// DOM элементы
const taskForm = document.getElementById('task-form')
const taskList = document.getElementById('task-list')
const select = document.getElementById('importantce')
const selectNew = document.getElementById('importantceNew')

const modal = document.getElementById('editModal')
const closeBtn = document.querySelector('.close')
const editForm = document.getElementById('edit-form')
const cancelEdit = document.getElementById('cancel-edit')


// обоваляем option для выбора ВлАЖНОСТИ в основной форме и в модальной форме
function addOptionsToSelect() {
    select.innerHTML = ''
    selectNew.innerHTML = ''
    
    priorities.forEach(priority => {
        const option = document.createElement('option')
        option.value = priority.title
        option.textContent = priority.title
        
        select.appendChild(option)
        
        const optionNew = document.createElement('option')
        optionNew.value = priority.title
        optionNew.textContent = priority.title
    
        selectNew.appendChild(optionNew)
    })
}

// Отображение задач
function renderTasks(tasksToRender = null, markSearch = "") {
    const tasksToShow = tasksToRender || tasks
    const searchLowerCase = markSearch.toLowerCase().trim()

    taskList.innerHTML = ''
    
    const highlightText = (text) => {
        if(!searchLowerCase || !text.toLowerCase().includes(searchLowerCase)){
            return text
        }
        const regex = new RegExp(`(${searchLowerCase})`, "gi")
        return text.replace(regex, "<mark>$1</mark>")
    }

    tasksToShow.forEach(task => {
        const li = document.createElement('li')
        li.className = 'task-item'
        li.dataset.id = task.id
        
        li.innerHTML = `
            <div>
                ${highlightText(task.name)} until ${task.deadline} // ${task.priority}
            </div>
            <div class="task-actions">
                <button class="open-modal-btn" data-id="${task.id}">Edit task</button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
        `
    
        taskList.appendChild(li)
    })
    
    // Добавляем обработчики для кнопок
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = parseInt(e.target.dataset.id)
            openEditModal(taskId)
        })
    })
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = parseInt(e.target.dataset.id)
            deleteTask(taskId)
        })
    })
    saveTasks()
}


// Добавление новой задачи
taskForm.addEventListener('submit', function(event) {
    event.preventDefault()

    const name = document.getElementById('name').value
    const deadline = document.getElementById('deadline').value
    const priority = document.getElementById('importantce').value
    
    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        name,
        deadline,
        priority
    }
    
    tasks.push(newTask)
    renderTasks()
    taskForm.reset()
})

let currentEditId = null
// Открытие модального окна для редактирования
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId)
    
    if (task) {
        document.getElementById('nameNew').value = task.name
        document.getElementById('deadlineNew').value = task.deadline
        document.getElementById('importantceNew').value = task.priority
        
        currentEditId = taskId
        modal.style.display = 'block'
    }
}

// Сохранение изменений
editForm.addEventListener('submit', function(event) {
    event.preventDefault()
    
    if (currentEditId !== null) {
        const name = document.getElementById('nameNew').value
        const deadline = document.getElementById('deadlineNew').value
        const priority = document.getElementById('importantceNew').value
        
        tasks = tasks.map(task => {
            if (task.id === currentEditId) {
                return {
                    ...task,
                    name,
                    deadline,
                    priority
                }
            }
            return task
        })
        
        renderTasks()
        closeModal()
    }
});

// Удаление задачи
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks()
}

// Закрытие модального окна
function closeModal() {
    modal.style.display = 'none'
    currentEditId = null
    editForm.reset()
}

// Обработчики событий для модального окна
closeBtn.addEventListener('click', closeModal)
cancelEdit.addEventListener('click', closeModal)

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal()
    }
})

document.addEventListener('keydown', (event) => {
    if (event.key === "Escape" && modal.style.display === 'block') {
        closeModal()
    }
})


addOptionsToSelect()
renderTasks()



// Поиск задач: 1 - создать инпут, сделать обработчик событий, по id отфильтровать массив 
const searchInput = document.getElementById("taskSearchInput")

searchInput.addEventListener("input", function(event){
    const markSearch = event.target.value.trim()

    if (markSearch === ""){ //?
        renderTasks()
        return
    }
    const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(markSearch.toLowerCase())
    )
    renderTasks(filteredTasks, markSearch)

})


// добавить селект и кнопку, в селекте должно быть следующее: options по умолчанию, текст, дата, важность. По клику на кнопку список сортируется согласно выбранному options
const sortForm = document.getElementById("sortForm")
const sortBut = document.getElementById("sort-task")

// создаем селект для сортировки
function arrSelect(){
    const optionInputs = [
        {value: "default", text: "By default"},
        {value: "text", text: "According to the text (A-Z)"},
        {value: "text-invert", text: "According to the text (Z-A)"},
        {value: "date", text: "By date (newest first)"},
        {value: "date-old", text: "By date (oldest first)"},
        {value: "priority", text: "By importance"}
    ]
    sortForm.innerHTML = ''
    
    optionInputs.forEach(data =>{
        const optionsChoose = document.createElement("option")
        optionsChoose.textContent = data.text
        optionsChoose.value = data.value

        sortForm.appendChild(optionsChoose)
    })
}

// создаем функцию сортировки 
function sortTasks(){
    const selectValue = sortForm.value

    const sortObj = {
        "text": (a,b) => a.name.localeCompare(b.name),
        "text-invert": (a,b) => b.name.localeCompare(a.name),
        "date": (a,b) => new Date(a.deadline) - new Date(b.deadline),
        "date-old": (a,b) => new Date(b.deadline) - new Date(a.deadline),
        "priority": (a,b) => {
            const prioritiesOrder = {
                "Very important": 1, "Important": 2, "Does not matter": 3
            }
            return prioritiesOrder[a.priority] - prioritiesOrder[b.priority]
        },
        "default": (a,b) => a.id - b.id
    }
    const sortFunction = sortObj[selectValue] || sortObj.default
    tasks.sort(sortFunction)

    renderTasks()
}

// создаем обработчик кнопки сортировки 
sortBut.addEventListener('click', event=>{
    event.preventDefault()
    sortTasks()
})
arrSelect()

