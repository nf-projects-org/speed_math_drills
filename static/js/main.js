"use strict";
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

document.addEventListener('alpine:init', () => {
    Alpine.store('stateSessionChoice',{
        reset: function(){
            console.log("stateSessionChoice:Reset");
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            let sk = Alpine.store('stateKeypad');
            let sc = Alpine.store('stateCalculations');

            sd.reset();
            scd.reset();
            sk.reset();
            sc.reset();
            
        },
    });

    Alpine.store('stateCalculationDisplay',{
        first:0,
        displayFirst:true,
        operation:'x',
        displayOperation:true,
        second:0,
        displaySecond:true,
        result:'',
        isResultCorrect:false,
        displayMessage:false,
        disabled:true,
        reset: function(){
            let sc = Alpine.store('stateCalculationDisplay');
            sc.first = 0; sc.displayFirst = true; sc.operation = 'x'; sc.displayOperation = true; sc.second =0;
            sc.displaySecond = true; sc.result = ''; sc.isResultCorrect = false; sc.displayMessage = false; sc.disabled = true;
        },
        checkResult : function(){
            let sc = Alpine.store('stateCalculations');
            sc.checkResult();      
        },
        skip: function(){
            let sc = Alpine.store('stateCalculations');
            sc.skip();
        },


    });
    Alpine.store('stateDrillDetailsDisplay', {
        disabled: true,
        first:2,
        isFirstReadonly:false,
        isFirstValid:true,
        drill:'', 
        second_start:1,
        isSecondStartValid:true,
        second_end:15,
        isSecondEndValid:true,
        random:true,
        precision:3,
        displayPrecision:false,
        isPrecisionValid:true,
        reset: function(){
            let sd = Alpine.store('stateDrillDetailsDisplay');
            sd.disabled = true; sd.first = 2; sd.isFirstReadonly = false; sd.isFirstValid = true; sd.drill=''; sd.second_start=1; sd.second_end=15;
            sd.isSecondStartValid = true; sd.isSecondEndValid = true; sd.random = true; sd.precision = 3; sd.displayPrecision = false; sd.isPrecisionValid = true;
        },
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
            if(isNumeric(sd.precision) && sd.precision > 0 && sd.precision < 7 ){
                sd.isPrecisionValid = true;
            }
            else{
                validated = false;
                sd.isPrecisionValid = false;
            }
            return validated;
        },
        updateDrills: function(){
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            let sk = Alpine.store('stateKeypad');

            sd.disabled = false;
            scd.disabled = false;
            sk.disabled = false;

            if(sd.drill === 'Tables'){
                sd.setState(2,false, 'x', 1, 30, true, true, true,false);
            }
            else if(sd.drill === 'Squares'){
                sd.setState(2,true, '²', 1, 20, true, true, false, false );
            }
            else if(sd.drill === 'Cubes'){
                sd.setState(3,true, '³', 1, 20, true, true, false, false);
            }
            else if(sd.drill === 'Fractions'){
                sd.setState(1,true, '÷', 1, 30, true, true, true, true);
            }
            else if(sd.drill === 'Sq. Roots'){
                sd.setState(2,true, '√', 1, 15, true, false, true, true);
            }
            sd.start();
        },
        start: function(){
            let sc = Alpine.store('stateCalculations');
            sc.generate();
            sc.getNext();
        },
        setState: function(first, isFirstReadonly, operation, second_start, second_end, random, displayFirstCalc, displaySecondCalc, displayPrecision){
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            sd.first = first; sd.isFirstReadonly = isFirstReadonly;  sd.second_start = second_start; sd.second_end = second_end; sd.random = random;
            scd.operation=operation; scd.displayFirst = displayFirstCalc; scd.displaySecond = displaySecondCalc; sd.displayPrecision = displayPrecision;
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
            ['Squares', (a,b) => Math.pow(b,2)],
            ['Cubes', (a,b) => Math.pow(b,3)],
            ['Fractions', (a,b) => { 
                let sc = Alpine.store('stateCalculations');
                return sc.roundToPrecision(1/b);
            }],
            ['Sq. Roots', (a,b) => {
                let sc = Alpine.store('stateCalculations');
                return sc.roundToPrecision(Math.pow(b,1/2));
            }],
        ]),
        reset: function(){
            let sc = Alpine.store('stateCalculations');
            sc.calculationList = [];
            sc.currentCounter = -1;
            sc.maxCalculations = 0;
        },
        roundToPrecision: function(arg){
            let precision = Alpine.store('stateDrillDetailsDisplay').precision;
            let multiple = Math.pow(10,precision);
            return Math.round((multiple) * arg)/multiple; 
        },
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
                //Display confirmation
                scd.displayMessage = true;
                setTimeout(()=>scd.displayMessage=false,2000);
                //Restart drill
                sd.start();
            }
        },
        checkResult: function(){
            let sc = Alpine.store('stateCalculations');
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            console.log("#checkResult")
            console.log(scd.result);
            console.log(typeof(scd.result))
            console.log("checkResult#")
            let resultOp = sc.operationsMap.get(sd.drill);
            let result = resultOp(sc.calculationList[sc.currentCounter][0],sc.calculationList[sc.currentCounter][1]);
            if (scd.result === result){
                scd.isResultCorrect = true;
                setTimeout(sc.getNext, 1000); 
            }
        },
        skip: function(){
            let sc = Alpine.store('stateCalculations');
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            // display the correct result if possible
            if (sc.currentCounter < sc.maxCalculations){
                let resultOp = sc.operationsMap.get(sd.drill);
                let result = resultOp(sc.calculationList[sc.currentCounter][0],sc.calculationList[sc.currentCounter][1]);
                scd.result = result;
                setTimeout(sc.getNext, 1000); 
            }
        },
        
    });
    Alpine.store('stateKeypad',{
        displayKeypad:true,
        disabled:true,
        reset: function(){
            let sk = Alpine.store('stateKeypad');
            sk.displayKeypad = true;
            sk.disabled = true;
        },
        keypadListener: function(key){
            let scd = Alpine.store('stateCalculationDisplay');
            let keyNumber=0;
            let keyString = '';
            let resultString = scd.result.toString();
            let isBlank = false;
            if(scd.result === 0 || scd.result === ''){
                isBlank = true;
            }

            //Special case . & DEL
            if(key === '.'){
                console.log(".");
                return;
            }
            if(key === 'DEL'){
                
                return;
            }
            //Process key
            if( typeof(key) === 'number'){
                keyNumber = key;
                keyString = key.toString();
            }
            else if (typeof(key) === 'string'){
                keyString = key;
                keyNumber = parseInt(key);
            }

            if(typeof(scd.result === 'number')){
                resultString = resultString + keyString;
                scd.result = resultString;
            }
            else if (typeof(scd.result === 'string')){
                scd.result = scd.result + keyString;
            }
        },
    });
     
});
