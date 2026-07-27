const studentInfo = document.getElementById("student-info");

studentInfo.textContent = "Aaron Gregoire - 200605201";


class Pizza{
    //Variables
    customerName;
    size;
    crust;
    toppings;
    quantity;
    deliveryMethod;
    instructions;

    //constructor
    constructor(customerName, size, crust, toppings, quantity, deliveryMethod, instructions) {
        this.customerName = customerName;
        this.size = size;
        this.crust = crust;
        this.toppings = toppings;
        this.quantity = quantity;
        this.deliveryMethod = deliveryMethod;
        this.instructions = instructions;
    }

    getDescription() {
        let toppingsText;
        if (this.toppings.length > 0) {
            toppingsText = this.toppings.join(", ");
        } else {
            toppingsText = "no extra toppings";
        }
 
        let description = `${this.customerName}, your order of ${this.quantity} x `
            + `${this.size} pizza with ${this.crust} crust and ${toppingsText} `
            + `has been placed for ${this.deliveryMethod}.`;
 
        //add instructions if not blank
        if (this.instructions.trim() !== "") {
            description = description + ` note: ${this.instructions}`;
        }
 
        return description;
    }
}

const form = document.getElementById("order-form");
const orderResult = document.getElementById("order-result");
const orderDescription = document.getElementById("order-description");

// makes sure all fields pass validation 
//it starts true and if any checks fail it turns false and continues so it can show all errors at once
function handleOrderSubmit(e){
    e.preventDefault();

    let isValid = true;

    const nameInput = document.getElementById("customer-name");
    const nameError = document.getElementById("customer-name-error");

    //name
    if(nameInput.value.trim().length < 2){
        isValid = false;
        nameError.textContent = "please enter your name";
        nameInput.classList.add("invalid");
    }else{
        nameError.textContent = "";
        nameInput.classList.remove("invalid");
    }

    //size
    const sizeSelect = document.getElementById("pizza-size");
    const sizeError = document.getElementById("pizza-size-error");

    if(sizeSelect.value === "") {
        isValid = false;
        sizeError.textContent = "please choose a size";
        sizeSelect.classList.add("invalid");
    }else{
        sizeError.textContent = "";
        sizeSelect.classList.remove("invalid");
    }

    //crust
    const crustChecked = document.querySelector('input[name="crustType"]:checked');
    const crustError= document.getElementById("crust-error");

    if(!crustChecked) {
        isValid = false;
        crustError.textContent = "please choose a crust ";
    }else{
        crustError.textContent = "";
    }

    //quantity 
    const quantityInput = document.getElementById("quantity");
    const quantityError = document.getElementById("quantity-error");
 
    if(quantityInput.value < 1 || quantityInput.value > 10) {
        isValid = false;
        quantityError.textContent = "quantity must be between 1 and 10";
        quantityInput.classList.add("invalid");
    }else{
        quantityError.textContent = "";
        quantityInput.classList.remove("invalid");
    }

    //if everything passed build the order
    if (isValid){
        const toppingCheckboxes = document.querySelectorAll('input[name="toppings"]:checked');
        const toppings =[];
        for(let i = 0; i < toppingCheckboxes.length; i++){
            toppings.push(toppingCheckboxes[i].value);
        }

        const deliveryChecked = document.querySelector('input[name="deliveryMethod"]:checked');
        const instructionsInput = document.getElementById("instructions");

        const myPizza = new Pizza(
            nameInput.value,
            sizeSelect.value,
            crustChecked.value,
            toppings,
            quantityInput.value,
            deliveryChecked.value,
            instructionsInput.value
        );

        const description = myPizza.getDescription();
        orderDescription.textContent = description;
        orderResult.hidden = false;
    }
}

form.addEventListener("submit", handleOrderSubmit);


