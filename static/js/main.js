//Initialize state

//Calculations Display
var stateCalculationDisplay = {};
stateCalculationDisplay.first = document.body.querySelector(".display_first");
stateCalculationDisplay.operation = document.body.querySelector(".display_operation");
stateCalculationDisplay.second = document.body.querySelector(".display_second");
stateCalculationDisplay.result = document.body.querySelector(".display_result");
stateCalculationDisplay.updateFirst = function(first){stateCalculationDisplay.first.innerHTML = first;};
stateCalculationDisplay.updateSecond = function(second){stateCalculationDisplay.second.innerHTML = second;};
stateCalculationDisplay.updateOperation = function(operation){stateCalculationDisplay.operation.innerHTML = operation;};
stateCalculationDisplay.updateResult = function(result){stateCalculationDisplay.result.innerHTML = result;};
stateCalculationDisplay.update = function(first=0, second=0, operation='x', result='?'){

    stateCalculationDisplay.updateFirst(first);
    stateCalculationDisplay.updateSecond(second);
    stateCalculationDisplay.updateOperation(operation);
    stateCalculationDisplay.updateResult(result);
};
stateCalculationDisplay.keyboardListener = function(keyEvent){
    //Is a valid drill on
    if(stateCalculationDisplay.first.innerHTML == 0 && stateCalculationDisplay.second.innerHTML == 0){
        return;
    }
    //check key
    if(keyEvent.key === '1' || keyEvent.key === '2' || keyEvent.key === '3' || keyEvent.key === '4' || keyEvent.key === '5'
     || keyEvent.key === '6' || keyEvent.key === '7' || keyEvent.key === '8' || keyEvent.key === '9' || keyEvent.key === '0' || keyEvent.key === '.'){
        if(stateCalculationDisplay.result.innerHTML === '?'){
            result = keyEvent.key;
        }else {
            result = stateCalculationDisplay.result.innerHTML + keyEvent.key;
        }
        stateCalculationDisplay.updateResult(result);
        stateCalculations.checkResult();
        return;
    }
    if(keyEvent.key === 'Backspace'|| keyEvent.key === 'Delete'){
        if(keyEvent.key === 'Backspace'){keyEvent.preventDefault()}
        if(stateCalculationDisplay.result.innerHTML === '?'){return;}
        if(stateCalculationDisplay.result.innerHTML.length == 0){return;}
        if(stateCalculationDisplay.result.innerHTML.length == 1){
            stateCalculationDisplay.result.innerHTML = '?'
            return;
        }
        stateCalculationDisplay.result.innerHTML = stateCalculationDisplay.result.innerHTML.slice(0,stateCalculationDisplay.result.innerHTML.length -1)
    }
    if(keyEvent.code == 'Space'){
        stateDrillDetailsDisplay.next();
        return;
    }

};


//Calculations Processing
var stateCalculations = {};
stateCalculations.first=[];
stateCalculations.second=[];
stateCalculations.current_counter=0;
stateCalculations.operationsMap = new Map();
stateCalculations.operationsMap.set('+', (a,b) => a+b);
stateCalculations.operationsMap.set('-', (a,b) => a-b);
stateCalculations.operationsMap.set('x', (a,b) => a*b);
stateCalculations.operationsMap.set('÷', (a,b) => a/b);
stateCalculations.operationsMap.set('^', (a,b) => Math.pow(a,b));
stateCalculations.operationsMap.set('√a', (a,b) => Math.pow(a,1/b));
stateCalculations.shuffle = function(array){
    var shuffled = [...array];
    for (let i = shuffled.length -1; i > 0; i--){
        let j = Math.floor(Math.random() * (i+1));
        let temp = shuffled[i];
        shuffled[i]= shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
};
stateCalculations.generate = function(firstRandom=false){
    let firstStart = parseInt( stateDrillDetailsDisplay.first_param_start.innerHTML);
    let firstEnd = parseInt(stateDrillDetailsDisplay.first_param_end.innerHTML);
    let secondStart = parseInt(stateDrillDetailsDisplay.second_param_start.innerHTML);
    let secondEnd = parseInt(stateDrillDetailsDisplay.second_param_end.innerHTML);
    let firstSequence =[];
    let secondSequence = [];
    this.first =[];
    this.second=[];
    let counter = 0;
    for(let i = firstStart; i<= firstEnd; i++){
        firstSequence[counter]=i;
        counter++;
    }
    counter = 0;
    for(let i = secondStart; i<= secondEnd; i++){
        secondSequence[counter]=i;
        counter++;
    }

    counter = 0;
    for (let j=0; j < (secondEnd-secondStart+1);j++){
        let firstTempSequence = firstSequence;
        if(firstRandom){
            firstTempSequence = this.shuffle(firstTempSequence);
        }
        for (i = 0; i < firstTempSequence.length;i++){
            this.first[counter] = firstTempSequence[i];
            this.second[counter] = secondSequence[j];
            counter++;
        }    
    }

    this.current_counter=0;
    this.maxCalculation = (firstEnd - firstStart +1) * (secondEnd - secondStart+1);
    console.log(this.first);
    console.log(this.second);
    console.log(this);
};

stateCalculations.isDrillOver = function() {
    return !(this.current_counter < this.maxCalculation);
};

stateCalculations.getCurrentResult = function(){
    let retResultFunction = this.operationsMap.get(stateDrillDetailsDisplay.operation.innerHTML);
    let retResult = retResultFunction(this.first[this.current_counter], this.second[this.current_counter]);
    return retResult;
};
stateCalculations.nextCalculation = function(){
    this.current_counter++;
    if(this.current_counter >= this.maxCalculation){return false;}
    return true;
}
stateCalculations.getCurrentCalculation = function(){
    return {first:this.first[this.current_counter], second:this.second[this.current_counter]};
}
stateCalculations.checkResult = function(){
    if (parseInt(stateCalculationDisplay.result.innerHTML) === parseInt(this.getCurrentResult())){
        //flash it in green
        stateCalculationDisplay.result.classList.add("text-success");
        setTimeout(function(){
            if(!stateCalculations.nextCalculation()){
                return;
            }
            let currentCalc = stateCalculations.getCurrentCalculation();    
            stateCalculationDisplay.updateFirst(currentCalc.first);
            stateCalculationDisplay.updateSecond(currentCalc.second);
            stateCalculationDisplay.updateResult('?');
            stateCalculationDisplay.result.classList.remove("text-success");
        }, 750);

    }
}


//Drill Details
var stateDrillDetailsDisplay = {};
stateDrillDetailsDisplay.update = function(){
    this.element = document.querySelector(".drill-details-display")
    this.first_param_start = this.element.querySelector(".drill_first_param_start");
    this.first_param_end = this.element.querySelector(".drill_first_param_end");
    this.operation = this.element.querySelector(".drill_operation") ;
    this.second_param_start = this.element.querySelector(".drill_second_param_start");
    this.second_param_end = this.element.querySelector(".drill_second_param_end");
    this.first_random = this.element.querySelector(".drill_first_param_random");
 };
stateDrillDetailsDisplay.play =  function(){
    stateDrillDetailsDisplay.update();    
    //Is a proper drill loaded else return
    if (!stateDrillDetailsDisplay.isProperDrill()){
        return;
    }
    //Generate the sequence of calculations
    stateCalculations.generate(stateDrillDetailsDisplay.first_random.checked);
    //Update the display with the first calculation
    stateCalculationDisplay.update(stateCalculations.first[0],stateCalculations.second[0], stateDrillDetailsDisplay.operation.innerHTML,'?');
    stateCalculationDisplay.result.focus();
};
stateDrillDetailsDisplay.next = function() {
    //Is a proper drill loaded else return
    if (stateDrillDetailsDisplay.element.getAttribute('data-uuid') === "dummy"){
        return;
    }
    if (stateCalculations.isDrillOver()){return;}

    let current_result = stateCalculations.getCurrentResult();
    let current_display_result =  parseInt(stateCalculationDisplay.result.innerHTML);
    if( current_display_result === current_result){
        if(!stateCalculations.nextCalculation()){
            return;
        }
        let currentCalc = stateCalculations.getCurrentCalculation();    
        stateCalculationDisplay.updateFirst(currentCalc.first);
        stateCalculationDisplay.updateSecond(currentCalc.second);
        stateCalculationDisplay.updateResult('?');
    } else{
        stateCalculationDisplay.updateResult(current_result);
    }  
};
stateDrillDetailsDisplay.random = function(evt) {
    stateDrillDetailsDisplay.update();
       //Is a proper drill loaded else return
   if (!stateDrillDetailsDisplay.isProperDrill()){
        return;
    }
    stateDrillDetailsDisplay.play();   
};
stateDrillDetailsDisplay.isProperDrill = function(){
    //Is a proper drill loaded else return
    if (stateDrillDetailsDisplay.element.getAttribute('data-uuid') === "dummy"){
        return false;
    }
    return true;
};


//Drill Selector
var stateDrillSelector = {};
stateDrillSelector.action = function(){
    // Has to be initialised after HTMX swap
    stateDrillSelector.element = document.getElementById('drill-selector');
    stateDrillSelector.selectedDrill = stateDrillSelector.element.value;
    stateDrillSelector.selectedDrillUuid = null;
    stateDrillDetailsDisplay.update();

    for (let element of stateDrillSelector.element.children){
        if (element.value === stateDrillSelector.selectedDrill){
            stateDrillSelector.selectedDrillUuid = element.getAttribute("data-uuid");
            stateDrillDetailsDisplay.element.setAttribute("data-uuid", stateDrillSelector.selectedDrillUuid);  
            //Actual drill selected so lets remove the Drills dummy holder
            for(let i=0; i < stateDrillSelector.element.length;i++){
                if(stateDrillSelector.element.options[i].value==='Drills'){
                    stateDrillSelector.element.remove(i);
                    break;
                }
            }
            break;
        }
    }
    for (let element of document.querySelectorAll(".drill-details")){    
        if (element.getAttribute("data-uuid") === stateDrillSelector.selectedDrillUuid){
            stateDrillDetailsDisplay.first_param_start.innerHTML = element.dataset.drill_first_param_start;
            stateDrillDetailsDisplay.first_param_end.innerHTML = element.dataset.drill_first_param_end;
            stateDrillDetailsDisplay.operation.innerHTML = element.dataset.drill_operation;
            stateDrillDetailsDisplay.second_param_start.innerHTML = element.dataset.drill_second_param_start;
            stateDrillDetailsDisplay.second_param_end.innerHTML = element.dataset.drill_second_param_end;
            break;
        }
    }
    stateCalculationDisplay.update(0,0, stateDrillDetailsDisplay.operation.innerHTML, '?')
    stateDrillDetailsDisplay.play();
}    
  

//Add event listeners after HTMX swap
document.body.addEventListener('htmx:afterSwap', function (evt){
    if (evt.target.matches(".drill-select")){
        document.getElementById('drill-selector').addEventListener("change", stateDrillSelector.action);
        document.body.querySelector(".drill_next_button").addEventListener('click', stateDrillDetailsDisplay.next);
        document.body.querySelector(".drill_first_param_random").addEventListener('change', stateDrillDetailsDisplay.random);
        document.addEventListener('keydown', stateCalculationDisplay.keyboardListener); 
    }
});

