module.exports = class SuperPagination {
    constructor(settings) {
        this._settings = Object.assign(SuperPagination.getDefaultSettings(), settings);
        this.init
    }

    get init() {
        this.pluginClass = document.getElementById('SuperPagination');
        this.active = this.pluginClass.querySelector('.active') || 1 ;
        this.lastPage = this._settings.lastpage;
        this.buttons = (this._settings.buttonsInBar % 2 === 0) ? this._settings.buttonsInBar : this._settings.buttonsInBar + 1;
        this.halfelementsleftside = ~~(this.buttons / 2);
        this.templateControllButtons;
        this.renderTemplate;
        this._setEvents;
    }

    get _setEvents() {
        this.pluginClass.addEventListener('click', e => this.selectPage(e), false)
    }

    selectPage(e) {
        switch (true) {
            case e.target.classList.contains('first'):
                this.active = 1;
                break;
            case e.target.classList.contains('last'):
                this.active = this.lastPage;
                break;
            case e.target.classList.contains('pages'):
                this.active = e.target.dataset.page * 1;
                break;
            case e.target.classList.contains('tsl'):
                this.active -= 2;
                break;
            case e.target.classList.contains('osl'):
                this.active -= 1;
                break;
            case e.target.classList.contains('osr'):
                this.active += 1;
                break;
            case e.target.classList.contains('tsr'):
                this.active += 2;
                break;
        }
        this.renderTemplate
        return this
    }

    get renderTemplate() {
        this.pagesBuilder;
        this.pageButtons;
        this.rulesOfButtons;
        this.active;
        return this
    }

    get pagesBuilder() {
        this.pages = [];

        let leftside = this.active - this.halfelementsleftside;

        let firststep = leftside > 1 ? leftside : 1;

        let laststep = firststep + this.buttons;
        laststep = laststep >= this.lastPage ? this.lastPage : laststep;

        for (let p = firststep; p <= laststep; p++) {
            this.pages.push(p)
        }

        return this.pages
    }


    get twoStepRight() {
        return (this.lastPage - this.active <= 2)
    }

    get twoStepLeft() {
        return (this.active <= 2)
    }

    get oneStepRight() {
        return (this.lastPage - this.active <= 1)
    }

    get oneStepLeft() {
        return (this.active <= 1)
    }


    showButtons(selectClass = [], display = 'none') {
        selectClass.forEach(i => {
            this.pluginClass.querySelector(i).style.display = display
        })
    }

    get rulesOfButtons() {

        this.twoStepLeft ? this.showButtons(['.tsl', '.leftdots', '.first']) : this.showButtons(['.tsl', '.leftdots', '.first'], 'block');
        this.oneStepLeft ? this.showButtons(['.osl', '.leftdots', '.first']) : this.showButtons(['.osl'], 'block');


        this.twoStepRight ? this.showButtons(['.tsr', '.rigthdots', '.last']) : this.showButtons(['.tsr', '.rigthdots', '.last'], 'block');
        this.oneStepRight ? this.showButtons(['.osr', '.rigthdots', '.last']) : this.showButtons(['.osr'], 'block');

    }

    get makeButtons() {
        let allPages = '';
        this.pages.forEach(i => {
            allPages += this.active === i ? `<div class="active pages" data-page="${i}"> ${i} </div>` : `<div class="pages" data-page="${i}"> ${i} </div>`
        });
        return allPages;
    }

    get templateControllButtons() {
        const template = `
        <div class="SuperPaginationContainer">
            <div class="tsl"> &lt;&lt; </div>
            <div class="osl"> &lt; </div>
            <div class="first" data-page="1"> 1 </div>
            <div class="leftdots"> ... </div>

            <main class="pageContainer"></main>

            <div class="rigthdots"> ... </div>
            <div class="last" data-page="${this.lastPage}"> ${this.lastPage} </div>
            <div class="osr"> &gt; </div>
            <div class="tsr"> &gt;&gt; </div>
        </div>
        `;

        this.pluginClass.innerHTML = '';
        this.pluginClass.insertAdjacentHTML('afterbegin', template);
    }

    get pageButtons() {
        const pages = this.pluginClass.querySelector('.pageContainer');
        pages.innerHTML = '';
        pages.insertAdjacentHTML('afterbegin', this.makeButtons);
    }

    static getDefaultSettings() {
        return {
            constroll: ['tsr', 'osr', 'tsl', 'osl'],
            activeColor: '#41ff35',
            buttonsInBar: 5,
            lastpage: 100
        }
    }
}
