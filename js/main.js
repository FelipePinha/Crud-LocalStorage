// variáveis
const myForm = document.querySelector('form')


// create - read
const getLocalStorage = () => JSON.parse(localStorage.getItem('dbClient')) || []
const setLocalStorage = (client) => localStorage.setItem('dbClient', JSON.stringify(client))

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

// update - delete
const updateClient = (client, index) => {
    const dbClient = getLocalStorage()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const deleteClient = (index) => {
    const dbClient = getLocalStorage()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

// funções
const formatDate = (date) => {
    const formattedDate = new Date(date)
    return formattedDate.toLocaleDateString('pt-br', {timeZone: 'UTC'})
}

const createRow = (client, index) => {
    const table = document.querySelector('.records>tbody')
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${client.name}</td>
    <td>${formatDate(client.birthDate)}</td>
    <td>
        <button type="button" class="button green" data-id="edit-${index}">Editar</button>
        <button type="button" class="button red" data-id="delete-${index}">Deletar</button>
    </td>
    `
    table.appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('.records>tbody tr')
    rows.forEach(row => row.remove())
}
const clearFields = () => {
    const fields = document.querySelectorAll('.form-input')
    fields.forEach(field => field.value = '')
}

const updateTable = () => {
    const dbClient = getLocalStorage()
    clearTable()
    dbClient.forEach(createRow)
}

const isValidFields = () => {
    return myForm.reportValidity()
}

const saveClient = () => {
    if(isValidFields()) {
        const client = {
            name: document.querySelector('#name').value,
            birthDate: document.querySelector('#birth-date').value
        }
        
        const dataAction = myForm.dataset.action

        if(dataAction === 'new') {
            createClient(client)
            updateTable()
        } else {
            updateClient(client, dataAction)
            updateTable()
            myForm.dataset.action = 'new'
            document.querySelector('.head-title').textContent = 'Adicionar Cliente'
        }

        
    }
}

const fillFields = (client) => {
    document.querySelector('#name').value = client.name
    document.querySelector('#birth-date').value = client.birthDate
    myForm.dataset.action = client.index
    document.querySelector('.head-title').textContent = `Editar cliente ${client.name}`
}


const editRow = (index) => {
    const client = getLocalStorage()[index]
    client.index = index
    fillFields(client)
}


const editDelete = (e) => {
    if(e.target.type === 'button') {
        const [action, index] = e.target.dataset.id.split('-')
        
        if(action === 'edit') {
            editRow(index)
        } else {
            deleteClient(index)
            updateTable()
        }
    }
}


updateTable()


// eventos
myForm.addEventListener('submit', (e) => {
        e.preventDefault()
        saveClient()
        clearFields()
})

document.querySelector('.records>tbody').addEventListener('click', editDelete)

