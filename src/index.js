const  SuperPagination = require("@models/SuperPagination");

require('@assets/css/body.scss');
require('@assets/css/superpagination.scss');


const body = document.querySelector('body')
const table = document.querySelector('table');
const search = document.querySelector('.search');
const paginator = document.getElementById('SuperPagination')

table.insertAdjacentHTML('afterbegin', '<thead></thead>')
table.insertAdjacentHTML('afterbegin', '<tbody></tbody>')

const thead = table.querySelector('thead')
const tbody = table.querySelector('tbody')
const preloader = `<div class="preloader" ></div>`

let ResponceStatus = null
let data = []
let begin = 0
const step = 20
let end = 1 * step
let activePage = 1

function renderData(data) {

    const template = `
        <tr>
            <td>${data.id}</td>
            <td>${data.title}</td>
            <td>${data.price}</td>
            <td>${data.color}</td>
            <td>${data.department}</td>
        </tr>`

    tbody.insertAdjacentHTML('beforeend', template);
}

function renderField() {
    let template = `<tr>
                        <th class="id">id</th>
                        <th class="title">title</th>
                        <th class="price">price</th>
                        <th class="color">color</th>
                        <th class="department">department</th>      
                    </tr>`
    thead.insertAdjacentHTML('afterbegin', template);
}

function cleanTableBody() {
    tbody.innerHTML = '';
}

function pageBuilder(data) {
    cleanTableBody()
    end = activePage <= 1 ? 1 * step : activePage * step
    begin = activePage <= 0 ? 0 : end - step
    data.slice(begin, end).forEach(i => renderData(i))
}

function sorteg(data, param = 'id', {asc = true} = {}) {
    let sortData = data.slice(begin, end).sort((a, b) => {
        if (asc) {
            return (isNaN(a[param] * 1 + b[param] * 1) ? a[param].toString().localeCompare(b[param]) : +a[param] - +b[param])
        } else {
            return (isNaN(a[param] * 1 + b[param] * 1) ? b[param].toString().localeCompare(a[param]) : +b[param] - +a[param])
        }
    });
    cleanTableBody()
    sortData.forEach(i => renderData(i))
}


fetch('json/db.json')
    .then(responce => {
          return responce.json()
    })
    .then(responce => {
        data = responce.slice()
        ResponceStatus = 200
        responce = []
    })
    .catch(err => console.error(err))


body.insertAdjacentHTML('afterbegin', preloader)
const getData = setInterval(() => {
    if (ResponceStatus === 200) {
        const page = new SuperPagination({
            lastpage: Math.ceil(data.length / step),
        })
        activePage = page.active
        renderField()
        pageBuilder(data)

        paginator.addEventListener('click', () => {
            activePage = page.active
            pageBuilder(data)
        }, false)

        thead.addEventListener('dblclick', e => {
            switch (true) {
                case e.target.classList.contains('id'):
                    sorteg(data, param = 'id')
                    break;
                case e.target.classList.contains('title'):
                    sorteg(data, param = 'title')
                    break;
                case e.target.classList.contains('price'):
                    sorteg(data, param = 'price')
                    break;
                case e.target.classList.contains('color'):
                    sorteg(data, param = 'color')
                    break;
                case e.target.classList.contains('department'):
                    sorteg(data, param = 'department')
                    break;
            }
        }, false)

        thead.addEventListener('click', e => {
            switch (true) {
                case e.target.classList.contains('id'):
                    sorteg(data, param = 'id', {asc: false})
                    break;
                case e.target.classList.contains('title'):
                    sorteg(data, param = 'title', {asc: false})
                    break;
                case e.target.classList.contains('price'):
                    sorteg(data, param = 'price', {asc: false})
                    break;
                case e.target.classList.contains('color'):
                    sorteg(data, param = 'color', {asc: false})
                    break;
                case e.target.classList.contains('department'):
                    sorteg(data, param = 'department', {asc: false})
                    break;
            }
        }, false)

        thead.addEventListener('click', e => {
            if (e.detail === 3) {
                activePage = page.active
                pageBuilder(data)
            }
        }, false)

        search.addEventListener('keyup', e => {
            let text = e.target.value.trim().toLowerCase()
            let findText = data.slice(begin, end).filter(s => s['title'].trim().toLowerCase().indexOf(text) === 0)
            let sortData = findText.sort((a, b) => {
                return (isNaN(a['title'] * 1 + b['title'] * 1) ? a['title'].toString().localeCompare(b['title']) : +a['title'] - +b['title'])
            });
            cleanTableBody()
            sortData.forEach(i => renderData(i))
        }, false)

        document.querySelector('.preloader').remove()
        clearInterval(getData)
    }
}, 20)




