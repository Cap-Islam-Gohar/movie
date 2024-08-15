import $, { error } from 'jquery';
// contact Form
export default () => {

    const form = {
        values:{},
        errors: {},
        validations: {
            name: [
                { condition: (val) => val.startsWith(" ") || !val, message: 'Name is required.' },
                { condition: (val) => !/^[a-zA-Z ]*$/.test(val), message: 'Invalid Name. Only Charcters Allowed' },
                { condition: (val) => val.length > 36 , message: 'Name must be less than 36 Charcter'}
            ],
            email: [
                { condition: (val) => val.startsWith(" ") || !val, message: 'Email is required.'},
                { condition: (val) => !/^[a-zA-Z0-9]+@[a-z0-9]+\.[a-z]{3}$/.test(val), message: 'Invalid Email , try example@domain.com.' }
            ],
            phone: [
                { condition: (val) => val.startsWith(" ") || !val, message: 'Phone Number is required.'},
                { condition: (val) => !/^(02)?(01)[0125][0-9]{8}$/.test(val), message: 'Invalid Phone Number.' }
            ],
            age: [
                { condition: (val) => val.startsWith(" ") || !val, message: 'Age is required.'},
                { condition: (val) => !/^(1[6-9]|[2-9][0-9]|100)$/.test(val), message: 'Your Age must be over 16+ .' }
            ],
            password: [
                { condition: (val) => val.startsWith(" ") || !val , message: 'Password is required.'},
                { condition: (val) => !/^\S(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val) , message: 'Password must contain numbers & letters at least 8 character .' }
            ],               
            passwordConfirmation: [
                { condition: (val) => form.values?.password || form.values?.password === undefined, message: 'Please Enter Password First .' },
                { condition: (val) => form.values.password === val, message: 'Password not match .' },
            ],
        }
    };

    const formEl = $('#contact input');
    formEl.each((index, input) => {

        input = $(input);
        let errorEl = input.next();

        input.on('input change', (e) => { 

            validation(e.target)
                .validate(form.validations[input.attr('id')])
                .onSucces((value) => {
                    hideError(input, errorEl);
                })
                .onError((error) => {   
                    errorEl.html(error);
                    showError(input, errorEl)                      
                });

        });
    });

    
    const formSubmitBtn = $('#contact button')
    formSubmitBtn.on('click Keydown', (e) => {
        e.preventDefault();
        let target = $(e.target);

        if(Object.keys(form.errors).length > 0){
            target.css("marginLeft") == "250px" ? target.css({ "marginLeft": "0px" }) : target.css({ "marginLeft": "250px" });
        }

        if(e.type === 'click'){
            // form ready yet 
            if(Object.keys(form.errors).length === 0 && Object.keys(form.errors).length === 5){
                console.log(form.values)
                return;            
            }
        }        
    });

    const validation = (input) => {
        return {
            error: null,
            input: input,
            validate(validations = []){

                let { value, id} = this.input;
                let name = id[0].toUpperCase() + id.slice(1);

                validations.forEach(validation => {
                    if(validation.condition(value)){
                        this.error = validation.message;
                        form.errors[id] = this.error;
                        return this;
                    }
                });
                return this;
        
            },
            onSucces(callback){
                if(!this.error){
                    delete form.errors[this.input.id]
                    form.values[this.input.id] = this.input.value;
                    callback(this.input); 
                } 
                return this;              
            },
            onError(callback){
                if(this.error){
                    callback(this.error)
                }                
            }
        }       
    }

    const hideError = (input, errorEl) => {
        input.css("border-bottom-color", "#CED4DA");
        errorEl.html(null);
        errorEl.removeClass('animate__animated animate__flipInX');
        errorEl.addClass('animate__animated animate__fadeOutUp');
        
        formSubmitBtn.removeClass('animate__shakeX bg-danger buttonFormActive');
        formSubmitBtn.css({ "marginLeft": "0px" });
        formSubmitBtn.removeClass('animate__shakeX bg-danger buttonFormActive');
        formSubmitBtn.css('cursor', 'pointer');
    }

    const showError = (input, errorEl) => {
        input.css("border-bottom-color", "rgb(214, 46, 51)");
        errorEl.removeClass('animate__animated animate__fadeOutUp');
        errorEl.addClass('animate__animated animate__flipInX');

        formSubmitBtn.addClass('animate__shakeX bg-danger buttonFormActive');
        formSubmitBtn.addClass('animate__shakeX bg-danger buttonFormActive');
        formSubmitBtn.css({ 'cursor': 'default', 'userSelect': 'none' });        
    }
}