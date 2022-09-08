class ValidateForm {

    constructor() {
        this.name = document.querySelector('#name-container')
        this.name.minChar = 2
        this.name.maxChar = 20

        this.surname = document.querySelector('#surname-container')
        this.surname.minChar = 1
        this.surname.maxChar = 30

        this.cpf = document.querySelector('#cpf-container')
        this.cpf.minChar = 11
        this.cpf.maxChar = 11
        this.cpf.cpf = true

        this.user = document.querySelector('#user-container')
        this.user.minChar = 3
        this.user.maxChar = 12
        this.user.hasOnlyNumLetter = true

        this.password = document.querySelector('#password-container')
        this.password.minChar = 6
        this.password.maxChar = 12
        this.password.passwords = true

        this.passwordConfirmation = document.querySelector('#passwordConfirmation-container')
        this.passwordConfirmation.minChar = 6
        this.passwordConfirmation.maxChar = 12
        this.passwordConfirmation.passwords = true
    }

    #checkCharLimit(label, min, max, labelText, inputText) {
        if (inputText.length < min || inputText.length > max) {
            const div = this.#errorMsgCreate(this.#errorMsgCharLimit(labelText, min, max))
            label.appendChild(div)
            label.insertAdjacentElement('afterend', div)
            label.classList.add('error')
        }
    }

    #checkCpf(cpf, label) {
        const cpfCleaned = cpf.replace(/\D+/g, '')

        const cpfArray = Array.from(cpfCleaned)
        const cpfWithoutDigit = cpfArray.splice(0, 9)
        const cpfFirstDigit = calcDigit(cpfWithoutDigit, 10)
        const cpfWithOneDigit = [...cpfWithoutDigit, cpfFirstDigit]
        const cpfSecondDigit = calcDigit(cpfWithOneDigit, 11)
        const cpfValidated = [...cpfWithOneDigit, cpfSecondDigit].join('')

        if (cpfValidated !== cpfCleaned) {
            const div = this.#errorMsgCreate('O cpf informado não existe')
            label.appendChild(div)
            label.classList.add('error')
        }

        function calcDigit(cpfPiece, numMultiplier) {
            const cpfOperation = cpfPiece
                .map((value, index) => Number(value) * (numMultiplier - index))
                .reduce((accumulator, value) => accumulator + value, 0)

            const digit = 11 - (cpfOperation % 11)
            return digit < 10 ? digit : 0
        }
    }

    #checkEmptyInput(input, label, text) {
        if (input.value === '') {
            const div = this.#errorMsgCreate(this.#errorMsgEmptyField(text))
            label.appendChild(div)
            label.classList.add('error')
        }
    }

    #checkOnlyNumLetter(inputValue, label, labelText) {

        if ((/^[A-Za-z0-9]*$/).test(inputValue) === false) {
            const div = this.#errorMsgCreate(this.#errorMsgHasNoNumLetter(labelText))
            label.appendChild(div)
            label.classList.add('error')
        }
    }

    #checkPasswords(label) {
        const password1 = document.querySelector('#password-input').value
        const password2 = document.querySelector('#password-confirmation-input').value
        if (password1 !== password2) {
            const div = this.#errorMsgCreate('as senhas não estão iguais')
            label.appendChild(div)
            label.classList.add('error')
        }
    }

    #clearFormError() {
        const divError = document.querySelectorAll('div.error')
        divError.forEach(element => {
            element.remove()
        })

        const error = document.querySelectorAll('label.error')
        error.forEach(element => {
            element.classList.remove('error')
        })
    }

    #errorMsgCreate(text) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerText = text
        return div
    }

    #errorMsgCharLimit(text, min, max) {
        return `O campo ${text} deve ter entre ${min} e ${max} caracteres`
    }

    #errorMsgEmptyField(text) {
        return `o campo ${text} não pode estar vazio`
    }

    #errorMsgHasNoNumLetter(text) {
        return `o campo ${text} somente pode conter letras e números`
    }

    validate() {

        this.#clearFormError()

        Object.keys(this).forEach(attribute => {

            if (typeof attribute === 'function') return

            const container = document.querySelector(`#${attribute}-container`)
            const input = container.querySelector('input')
            const label = container.querySelector('label')
            const inputText = input.value
            const labelText = label.innerText.replace(':', '')

            this.#checkEmptyInput(input, label, labelText)

            if (label.classList.contains('error')) return

            if (eval(`this.${attribute}.hasOnlyNumLetter`)) {
                this.#checkOnlyNumLetter(inputText, label)
            }

            if (label.classList.contains('error')) return

            if (eval(`this.${attribute}.cpf`)) {
                this.#checkCpf(inputText, label)
            }

            if (label.classList.contains('error')) return

            this.#checkCharLimit(
                label,
                eval(`this.${attribute}.minChar`),
                eval(`this.${attribute}.maxChar`),
                labelText,
                inputText
            )

            if (label.classList.contains('error')) return

            if (eval(`this.${attribute}.passwords`)) {
                this.#checkPasswords(label)
            }
    
        })
        
        const formError = document.querySelectorAll('.error')
        if (formError.length === 0) {
            console.log('formulário preenchido com sucesso')
        }
    }
}

const button = document.querySelector('button')
button.addEventListener('click', event => {
    event.preventDefault()
    const form = new ValidateForm()
    form.validate()
})