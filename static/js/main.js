//Initialize state

//Calculations Display
var stateCalculationDisplay = {};
stateCalculationDisplay.first = document.body.querySelector(".display_first");
stateCalculationDisplay.second = document.body.querySelector(".display_second");
stateCalculationDisplay.result = document.body.querySelector(".display_result");
stateCalculationDisplay.update = function(first=0, second=0, result=0){
    stateCalculationDisplay.first.innerHTML = first;
    stateCalculationDisplay.second.innerHTML = second;
    stateCalculationDisplay.result.innerHTML = result;
}


//Calculations Processing
var stateCalculations = {};
stateCalculations.first=[];
stateCalculations.second=[];
stateCalculations.current_counter=0;
stateCalculations.generate = function(){
    state_calculations_first =[];
    state_calculations_second=[];
    state_calculations_current_counter=0;
    let counter = 0;
    for(let i = parseInt( stateDrillDetailsDisplay.first_param_start.innerHTML); i<= parseInt(stateDrillDetailsDisplay.first_param_end.innerHTML); i++){
        for (let j= parseInt(stateDrillDetailsDisplay.second_param_start.innerHTML); j<= parseInt(stateDrillDetailsDisplay.second_param_end.innerHTML); j++){
            state_calculations_first[counter] = i;
            state_calculations_second[counter] = j;
            counter++;
        }
    }
};


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
    //Read the Drill
    if (stateDrillDetailsDisplay.element.getAttribute('data-uuid') === "dummy"){
        return;
    }
    stateDrillDetailsDisplay.update();    

    //Read the Shuffle buttons

    //Generate the sequence of calculations
    stateCalculations.generate();
    //Update the display with the first calculation
    stateCalculationDisplay.update(state_calculations_first[0],state_calculations_second[0])
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
}    
  

//Add event listener for HTMX swap
document.body.addEventListener('htmx:afterSwap', function (evt){
    if (evt.target.matches(".drill-select")){
        document.getElementById('drill-selector').addEventListener("change", stateDrillSelector.action);
        document.body.querySelector(".drill_play_button").addEventListener('click',stateDrillDetailsDisplay.play);
    }
});

