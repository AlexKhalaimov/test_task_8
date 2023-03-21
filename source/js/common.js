const swiper = new Swiper('.swiper', {
    spaceBetween: 40,

    breakpoints: {
        540: {
            slidesPerView: 2,
        },
        960: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 4,
            spaceBetween: 40,
        },
    },
});

// form validation 

const inputs = document.querySelectorAll('.js-input')
const erorrMsg = {
    empty: 'Please complete this field.',
    email: 'This email does not seem to look right.',
    general: 'Something went wrong try again later.'
}
const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const email = document.querySelector('input[type=email]')
const formSubmit = document.querySelector('.js-submit')



if (inputs) {
    inputs.forEach(input => {
        input.addEventListener('blur', function (e) {
            validateInput(e.target)
            if (isCorrectForm()) {
                formSubmit.removeAttribute('disabled')
                formSubmit.classList.remove('contact-form__submit--disabled')
            }
        })
    })
}
if (email) {
    email.addEventListener('blur', function (e) {
        validateEmail(email)
    })
}

function validateInput(elem) {
    let value = elem.value.trim()

    if (!value) {
        showError(elem, erorrMsg['empty'])
    } else {
        hideError(elem)
    }
}

function validateEmail(input) {
    if (!input.value.trim()) {
        return false
    }

    if (input.value.match(validRegex)) {

        hideError(input)
    } else {
        showError(input, erorrMsg['email'])
    }
}

function showError(elem, message) {
    let msgEl = elem.parentElement.querySelector('.js-error-msg')
    elem.classList.contains('is-error') ? '' : elem.classList.add('is-error')
    elem.classList.remove('success')
    if (msgEl.classList.contains('is-hidden')) {
        msgEl.classList.remove('is-hidden')
        msgEl.textContent = message
    }
}

function hideError(elem) {
    let msgEl = elem.parentElement.querySelector('.js-error-msg')
    elem.classList.contains('is-error') ? elem.classList.remove('is-error') : ''
    elem.classList.add('success')
    if (!msgEl.classList.contains('is-hidden')) {
        msgEl.classList.add('is-hidden')
        msgEl.textContent = ''
    }
}


function isCorrectForm() {
    let inputs = [...document.querySelectorAll('.js-input')]
    let inputsLength = inputs.length
    let res = inputs.filter(item => {
        return item.classList.contains('success')
    })
    return res.length === inputsLength
}