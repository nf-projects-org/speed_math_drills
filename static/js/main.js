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
     || keyEvent.key === '6' || keyEvent.key === '7' || keyEvent.key === '8' || keyEvent.key === '9' || keyEvent.key === '0'){
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
        if(stateCalculationDisplay.result.innerHTML === '?'){return;}
        if(stateCalculationDisplay.result.innerHTML.length == 0){return;}
        if(stateCalculationDisplay.result.innerHTML.length == 1){
            stateCalculationDisplay.result.innerHTML = '?'
            return;
        }
        stateCalculationDisplay.result.innerHTML = stateCalculationDisplay.result.innerHTML.slice(0,stateCalculationDisplay.result.innerHTML.length -1)
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
stateCalculations.generate = function(){
    this.first =[];
    this.second=[];
    this.current_counter=0;
    
    let counter = 0;
    for(let i = parseInt( stateDrillDetailsDisplay.first_param_start.innerHTML); i<= parseInt(stateDrillDetailsDisplay.first_param_end.innerHTML); i++){
        for (let j= parseInt(stateDrillDetailsDisplay.second_param_start.innerHTML); j<= parseInt(stateDrillDetailsDisplay.second_param_end.innerHTML); j++){
            this.first[counter] = i;
            this.second[counter] = j;
            counter++;
            this.maxCalculation = counter;
        }
    }
};
stateCalculations.getCurrentResult = function(){
    if (this.current_counter === this.maxCalculation){return;}
    let retResultFunction = this.operationsMap.get(stateDrillDetailsDisplay.operation.innerHTML);
    let retResult = retResultFunction(this.first[this.current_counter], this.second[this.current_counter]);
    return retResult;
};
stateCalculations.nextCalculation = function(){
    this.current_counter++;
    return this.getCurrentCalculation();
}
stateCalculations.getCurrentCalculation = function(){
    return {first:this.first[this.current_counter], second:this.second[this.current_counter]};
}
stateCalculations.checkResult = function(){
    if (parseInt(stateCalculationDisplay.result.innerHTML) === parseInt(this.getCurrentResult())){
        //flash it in green
        stateCalculationDisplay.result.classList.add("text-success");
        setTimeout(function(){
            stateCalculations.nextCalculation();
            let currentCalc = stateCalculations.getCurrentCalculation();    
            stateCalculationDisplay.updateFirst(currentCalc.first);
            stateCalculationDisplay.updateSecond(currentCalc.second);
            stateCalculationDisplay.updateResult('?');
            stateCalculationDisplay.result.classList.remove("text-success");
        }, 1000);

    }
}


//Drill Details
var stateDrillDetailsDisplay = {};
stateDrillDetailsDisplay.update = function(){
    stateDrillDetailsDisplay.element = document.querySelector(".drill-details-display")
    stateDrillDetailsDisplay.first_param_start = stateDrillDetailsDisplay.element.querySelector(".drill_first_param_start");
    stateDrillDetailsDisplay.first_param_end = stateDrillDetailsDisplay.element.querySelector(".drill_first_param_end");
    stateDrillDetailsDisplay.operation = stateDrillDetailsDisplay.element.querySelector(".drill_operation") ;
    stateDrillDetailsDisplay.second_param_start = stateDrillDetailsDisplay.element.querySelector(".drill_second_param_start");
    stateDrillDetailsDisplay.second_param_end = stateDrillDetailsDisplay.element.querySelector(".drill_second_param_end");
 };
stateDrillDetailsDisplay.play =  function(){
    //Is a proper drill loaded else return
    if (stateDrillDetailsDisplay.element.getAttribute('data-uuid') === "dummy"){
        return;
    }
//    Is the line below really required    
//    stateDrillDetailsDisplay.update();    

    //Read the Shuffle buttons

    //Generate the sequence of calculations
    stateCalculations.generate();
    //Update the display with the first calculation
    stateCalculationDisplay.update(stateCalculations.first[0],stateCalculations.second[0], stateDrillDetailsDisplay.operation.innerHTML,'?');
};
stateDrillDetailsDisplay.next = function() {
    //Is a proper drill loaded else return
    if (stateDrillDetailsDisplay.element.getAttribute('data-uuid') === "dummy"){
        return;
    }
    let current_result = stateCalculations.getCurrentResult();
    let current_display_result =  parseInt(stateCalculationDisplay.result.innerHTML);
    if( current_display_result === current_result){
        stateCalculations.nextCalculation();
        let currentCalc = stateCalculations.getCurrentCalculation();    
        stateCalculationDisplay.updateFirst(currentCalc.first);
        stateCalculationDisplay.updateSecond(currentCalc.second);
        stateCalculationDisplay.updateResult('?');
    } else{
        stateCalculationDisplay.updateResult(current_result);
    }

  
  
}


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
}    
  

//Add event listeners after HTMX swap
document.body.addEventListener('htmx:afterSwap', function (evt){
    if (evt.target.matches(".drill-select")){
        document.getElementById('drill-selector').addEventListener("change", stateDrillSelector.action);
        document.body.querySelector(".drill_play_button").addEventListener('click',stateDrillDetailsDisplay.play);
        document.body.querySelector(".drill_next_button").addEventListener('click', stateDrillDetailsDisplay.next);
        document.addEventListener('keydown', stateCalculationDisplay.keyboardListener); 
    }
});

