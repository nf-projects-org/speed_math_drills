function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

document.addEventListener('alpine:init', () => {
    Alpine.store('stateCalculationDisplay',{
        first:0,
        displayFirst:true,
        operation:'x',
        displayOperation:true,
        second:0,
        displaySecond:true,
        result:'',
        isResultCorrect:false,
        checkResult : function(){
            let sc = Alpine.store('stateCalculations');
            sc.checkResult();      
        },

    });
    Alpine.store('stateDrillDetailsDisplay', {
        first:2,
        isFirstReadonly:false,
        isFirstValid:true,
        drill:'', 
        second_start:1,
        isSecondStartValid:true,
        second_end:15,
        isSecondEndValid:true,
        random:true,
        processChange: function(source){
            let stateDrillDetailsDisplay = Alpine.store('stateDrillDetailsDisplay');
            if(stateDrillDetailsDisplay.validate(source)){
                stateDrillDetailsDisplay.start();      
            }
        },
        validate: function(source){
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let validated = true;
            if(isNumeric(sd.first) && sd.first > 0 && sd.first < 9999){
                sd.isFirstValid = true;
            }
            else{
                validated = false;
                sd.isFirstValid = false;
            }
            if(isNumeric(sd.second_start) && sd.second_start > 0 && sd.second_start < 9999 && sd.second_start < sd.second_end){
                sd.isSecondStartValid = true;
            }
            else{
                validated = false;
                sd.isSecondStartValid = false;
            }
            if(isNumeric(sd.second_end) && sd.second_end > 0 && sd.second_end < 9999 && sd.second_end > sd.second_start){
                sd.isSecondEndValid = true;
            }
            else{
                validated = false;
                sd.isSecondEndValid = false;
            }
            return validated;
        },
        updateDrills: function(){
            let sd = Alpine.store('stateDrillDetailsDisplay');
            if(sd.drill === 'Tables'){
                sd.setState(2,false, 'x', 1, 30, true, true, true);
            }
            else if(sd.drill === 'Squares'){
                sd.setState(2,true, '²', 1, 20, true, true, false );
            }
            else if(sd.drill === 'Cubes'){
                sd.setState(3,true, '³', 1, 20, true, true, false);
            }
            else if(sd.drill === 'Fractions'){
                sd.setState(1,true, '÷', 1, 30, true, true, true);
            }
            else if(sd.drill === 'Sq. Roots'){
                sd.setState(2,true, '√', 1, 15, true, false, true);
            }
            sd.start();
        },
        start: function(){
            let sc = Alpine.store('stateCalculations');
            sc.generate();
            sc.getNext();
        },
        setState: function(first, isFirstReadonly, operation, second_start, second_end, random, displayFirstCalc, displaySecondCalc){
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            sd.first = first; sd.isFirstReadonly = isFirstReadonly;  sd.second_start = second_start; sd.second_end = second_end; sd.random = random;
            scd.operation=operation; scd.displayFirst = displayFirstCalc; scd.displaySecond = displaySecondCalc;
        }, 

    });
    Alpine.store('stateCalculations', {
        calculationList:[],
        currentCounter:-1,
        maxCalculations:0,
        displayMap: new Map([
            ['Tables', (a,b) => [b,a]],
            ['Squares', (a,b) => [b,a]],
            ['Cubes', (a,b) => [b,a]],
            ['Fractions', (a,b) => [a,b]],
            ['Sq. Roots', (a,b) => [a,b]],
        ]),
        operationsMap : new Map([
            ['Tables', (a,b) => a*b],
            ['Squares', (a,b) => Math.pow(a,2)],
            ['Cubes', (a,b) => Math.pow(a,3)],
            ['Fractions', (a,b) => 1/b],
            ['Sq. Roots', (a,b) => Math.pow(a,1/2)],
        ]),
        shuffle: function(array){
            var shuffled = [...array];
            for (let i = shuffled.length -1; i > 0; i--){
                let j = Math.floor(Math.random() * (i+1));
                let temp = shuffled[i];
                shuffled[i]= shuffled[j];
                shuffled[j] = temp;
            }
            return shuffled;
        },
        generate: function(){
            let cList = [];
            let sc = Alpine.store('stateCalculations');
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let max_calcs = sd.second_end - sd.second_start+1;
            sc.currentCounter=-1;
            sc.maxCalculations = max_calcs;
            for (let i=0; i < (max_calcs); i++){
                cList[i] = [parseInt(sd.first),parseInt(sd.second_start+i)];
            }
            if(sd.random){
                sc.calculationList = sc.shuffle(cList);
            }else{
                sc.calculationList = cList;
            }
        },
        getNext: function(){
            let sc = Alpine.store('stateCalculations');
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            sc.currentCounter++;
            if (sc.currentCounter < sc.maxCalculations){
                let toMap = sc.displayMap.get(sd.drill);
                let toMapAr = toMap(sc.calculationList[sc.currentCounter][0],sc.calculationList[sc.currentCounter][1]);
                scd.first = toMapAr[0];
                scd.second = toMapAr[1];
                scd.result = '';
                scd.isResultCorrect = false;
            }else
            {
                scd.result = 'Drill Complete';
            }
        },
        checkResult: function(){
            let sc = Alpine.store('stateCalculations');
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');

            let resultOp = sc.operationsMap.get(sd.drill);
            let result = resultOp(sc.calculationList[sc.currentCounter][0],sc.calculationList[sc.currentCounter][1]);
            if (scd.result === result){
                scd.isResultCorrect = true;
                setTimeout(sc.getNext, 800); 
            }
        },
        
    });
     
});


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






stateCalculations.nextCalculation = function(){
    this.current_counter++;
    if(this.current_counter >= this.maxCalculation){return false;}
    return true;
}
stateCalculations.getCurrentCalculation = function(){
    return {first:this.first[this.current_counter], second:this.second[this.current_counter]};
}


stateCalculations.isDrillOver = function() {
    return !(this.current_counter < this.maxCalculation);
};

stateCalculations.getCurrentResult = function(){
    let retResultFunction = this.operationsMap.get(stateDrillDetailsDisplay.operation.innerHTML);
    let retResult = retResultFunction(this.first[this.current_counter], this.second[this.current_counter]);
    return retResult;
};
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


 
 