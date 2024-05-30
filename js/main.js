const form = document.getElementById('contact-form');

const showSuccessMessage = () => {
    const successMessageElement = document.querySelector('.success-message');
    
    successMessageElement.removeAttribute('hidden');

    window.scroll({ top: 0, left: 0, behavior: 'auto' });
}

function getFormValues(formElement) {
    let formValues = {};

    formElement.querySelectorAll(' input, textarea').forEach((inputElement) => {
        const inputName = inputElement.name;
        const inputRequired = inputElement.dataset.required != undefined;
        const inputType = inputElement.type;
        let inputDefaultValue = inputElement.dataset.defaultvalue;
        let inputValue = '';

        switch (inputElement.type) {
            case 'checkbox': {
                inputValue = inputElement.checked;
                break
            }
                
            case 'radio': {
                form.querySelectorAll(` input[name='${inputElement.name}'][type='radio']`).forEach((radioElement) => {
                    if (radioElement.checked) {
                        inputValue = radioElement.id
                        return;
                    }
                })
                
                break
            }
                
            default: {
                inputValue = inputElement.value;
                break
            }
        }
       
        formValues[inputElement.name] = {
            name: `${inputName}`,
            value: `${inputValue}`,
            required: `${inputRequired}`,
            defaultValue: `${inputDefaultValue}`,
            type: `${inputType}`,
        }
    });
    
    return formValues;
};

function validateForm(formElement) {
    let formValid = true;
    
    for (const inputData of Object.values(getFormValues(formElement))) {
        const inputElement = form.querySelector(` input[name='${inputData.name}'], textarea[name='${inputData.name}']`);
        const fieldElement = inputElement.closest('.field');
        
        let fail = false;

        // check if required form inputs were left blank or untouched
        if (inputData.required && inputData.value === inputData.defaultValue) {
            formValid = false;
            fail = true;
            fieldElement.classList.add('error');
        }

        // now verify each input
        if (fail) {
            continue  
        }

        fieldElement.classList.remove('error');

        switch (inputData.type) {
            case 'radio': {
                if (inputData.value === '') {
                    formValid = false;
                    fieldElement.classList.add('error');
                }

                break
            }
               
            case 'checkbox': {
                if (inputData.value !== 'true' || (inputData.value !== 'true' && inputData.value !== 'false')) {
                    formValid = false;
                    fieldElement.classList.add('error');
                }

                break
            }
                
             
            case 'text': {
                const expression = new RegExp(`^(?=(?:[^a-zA-Z]*[a-zA-Z]){2})(?=.*')[a-zA-Z']{3,}$|^[a-zA-Z]{2,}$`);
                
                if (!expression.test(inputData.value)) {
                    formValid = false;
                    fieldElement.classList.add('error');
                }

                break
            }
                
            case 'email': {
                const expression = new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`);

                if (!expression.test(inputData.value)) {
                    formValid = false;
                    fieldElement.classList.add('error');
                }

                break
            }
                
            case 'textarea': {
                const expression = new RegExp(`\s`);

                if (!expression.test(inputData.value)) {
                    formValid = false;
                    fieldElement.classList.add('error');
                }

                break
            }
          
        } 
    }

    formValid ? showSuccessMessage() : null;

    return formValid;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    validateForm(event.target);
})