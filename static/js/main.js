"use strict";
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

document.addEventListener('alpine:init', () => {
    Alpine.store('stateSessionChoice',{
        reset: function(){
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let sp = Alpine.store('statePracticeDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            let sk = Alpine.store('stateKeypad');
            let sc = Alpine.store('stateCalculations');

            sd.reset();
            sp.reset();
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
        progressBarCorrect:'0%',
        progressBarWrong:'0%',
        progressBarSkip:'0%',
        reset: function(){
            let sc = Alpine.store('stateCalculationDisplay');
            sc.first = 0; sc.displayFirst = true; sc.operation = 'x'; sc.displayOperation = true; sc.second =0;
            sc.displaySecond = true; sc.result = ''; sc.isResultCorrect = false; sc.displayMessage = false; sc.disabled = true;
            sc.progressBarCorrect = '0%'; sc.progressBarWrong = '0%'; sc.progressBarSkip = '0%';
        },
        checkResult : function(){
            let sc = Alpine.store('stateCalculations');
            sc.checkResult();      
        },
        skip: function(){
            let sc = Alpine.store('stateCalculations');
            sc.skip();
        },
        updateResultText: function(key){
            let keyNumber=0;
            let keyString = '';
            let scd = Alpine.store('stateCalculationDisplay');
            //Process key
            if( typeof(key) === 'number'){
                keyNumber = key;
                keyString = key.toString();
            }
            else if (typeof(key) === 'string'){
                keyString = key;
                keyNumber = parseInt(key);
            }

            //Special case . & DEL
            if(key === 'DEL'){
                if(scd.result.length > 1){
                    scd.result = scd.result.slice(0,-1);
                }
                else if (scd.result.length === 1){
                    scd.result = '';
                }               
                return;
            }
            if(key === '-'){
                if(scd.result[0] ==='-'){
                    scd.result = scd.result.slice(1);
                    return;
                }else{
                    scd.result = '-' + scd.result;
                    return;
                }
            }
            scd.result += keyString;
            let sc = Alpine.store('stateCalculations');
            sc.checkResult();
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
        getOpChoice: function(){
            let sd = Alpine.store('stateDrillDetailsDisplay');
            return sd.drill;
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
            sc.generate('drill');
            sc.getNext('drill');
        },
        setState: function(first, isFirstReadonly, operation, second_start, second_end, random, displayFirstCalc, displaySecondCalc, displayPrecision){
            let sd = Alpine.store('stateDrillDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            sd.first = first; sd.isFirstReadonly = isFirstReadonly;  sd.second_start = second_start; sd.second_end = second_end; sd.random = random;
            scd.operation=operation; scd.displayFirst = displayFirstCalc; scd.displaySecond = displaySecondCalc; sd.displayPrecision = displayPrecision;
        }, 

    });
    Alpine.store('statePracticeDetailsDisplay', {
        disabled: true,
        first:2,
        isFirstReadonly:false,
        isFirstValid:true,
        practice:'',
        operation:'', 
        second:2,
        isSecondStartValid:true,
        precision:3,
        displayPrecision:false,
        isPrecisionValid:true,
        reset: function(){
            let sp = Alpine.store('statePracticeDetailsDisplay');
            sp.disabled = true; sp.first = 2; sp.isFirstReadonly = false; sp.isFirstValid = true; sp.practice=''; sp.second=2; sp.operation ='';
            sp.isSecondValid = true; sp.precision = 3; sp.displayPrecision = false; sp.isPrecisionValid = true;
        },
        getOpChoice: function(){
            let sp = Alpine.store('statePracticeDetailsDisplay');
            return sp.practice;
        },

        processChange: function(source){
            let sp = Alpine.store('statePracticeDetailsDisplay');
            if(sp.validate(source)){
                sp.start();      
            }
        },
        validate: function(source){
            let sp = Alpine.store('statePracticeDetailsDisplay');
            let validated = true;
            if(isNumeric(sp.first) && sp.first > 0 && sp.first < 10){
                sp.isFirstValid = true;
            }
            else{
                validated = false;
                sp.isFirstValid = false;
            }
            if(isNumeric(sp.second) && sp.second > 0 && sp.second < 10 ){
                sp.isSecondValid = true;
            }
            else{
                validated = false;
                sp.isSecondValid = false;
            }
            if(isNumeric(sp.precision) && sp.precision > 0 && sp.precision < 7 ){
                sp.isPrecisionValid = true;
            }
            else{
                validated = false;
                sp.isPrecisionValid = false;
            }
            return validated;
        },
        updatePractice: function(){
            let sp = Alpine.store('statePracticeDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            let sk = Alpine.store('stateKeypad');

            sp.disabled = false;
            scd.disabled = false;
            sk.disabled = false;

            if(sp.practice === 'Multiplication'){
                sp.setState(2, 'x', 2,  true, true, true,false);
            }
            else if(sp.practice === 'Division'){
                sp.setState(2, '÷', 2,  true, true, true, true );
            }
            else if(sp.practice === 'Addition'){
                sp.setState(2, '+', 2,  true, true, true, false);
            }
            else if(sp.practice === 'Subtraction'){
                sp.setState(2, '-', 2, true, true, true, false);
            }
            sp.start();
        },
        start: function(){
            let sc = Alpine.store('stateCalculations');
            sc.generate('practice');
            sc.getNext('practice');
        },
        //Update setState Function
        setState: function(first, operation, second, random, displayFirstCalc, displaySecondCalc, displayPrecision){
            let sp = Alpine.store('statePracticeDetailsDisplay');
            let scd = Alpine.store('stateCalculationDisplay');
            sp.first = first;  sp.second = second; sp.random = random; sp.operation = operation;
            scd.operation=operation; scd.displayFirst = displayFirstCalc; scd.displaySecond = displaySecondCalc; sp.displayPrecision = displayPrecision;
        }, 

    });
    Alpine.store('stateCalculations', {
        calculationList:[],
        currentCounter:-1,
        maxCalculations:0,
        sessionChoice:'',
        correctProgress:0,
        wrongProgress:0,
        skipProgress:0,
        displayMap: new Map([
            ['Tables', (a,b) => [b,a]],
            ['Squares', (a,b) => [b,a]],
            ['Cubes', (a,b) => [b,a]],
            ['Fractions', (a,b) => [a,b]],
            ['Sq. Roots', (a,b) => [a,b]],
            ['Multiplication', (a,b) => [a,b]],
            ['Division', (a,b) => [a,b]],
            ['Addition', (a,b) => [a,b]],
            ['Subtraction', (a,b) => [a,b]],


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
            ['Multiplication', (a,b) => a*b],
            ['Addition', (a,b) => a+b],
            ['Subtraction', (a,b) => a-b],
            ['Division', (a,b) => {
                let sc = Alpine.store('stateCalculations');
                return sc.roundToPrecision(a/b);
            }],
            


        ]),
        reset: function(){
            let sc = Alpine.store('stateCalculations');
            sc.calculationList = [];
            sc.currentCounter = -1;
            sc.maxCalculations = 0;
            sc.sessionChoice = '';
            sc.correctProgress = 0,
            sc.wrongProgress = 0,
            sc.skipProgress = 0;
    
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
        generate: function(sessionChoice){
            let sc = Alpine.store('stateCalculations');
            sc.sessionChoice = sessionChoice;
            let cList = [];
            sc.currentCounter=-1;
            sc.correctProgress = 0;
            sc.wrongProgress = 0;
            sc.skipProgress = 0;

            if(sc.sessionChoice === 'drill'){
                let sd = Alpine.store('stateDrillDetailsDisplay');
                let max_calcs = sd.second_end - sd.second_start+1;
                sc.maxCalculations = max_calcs;
                for (let i=0; i < (max_calcs); i++){
                    cList[i] = [parseInt(sd.first),parseInt(sd.second_start+i)];
                }
                if(sd.random){
                    sc.calculationList = sc.shuffle(cList);
                }else{
                    sc.calculationList = cList;
                }    
            }
            else if(sessionChoice === 'practice'){
                let sp = Alpine.store('statePracticeDetailsDisplay');
                let max_calcs = 10; //TODO Parameterize and expose
                sc.maxCalculations = max_calcs;
                for (let i=0; i < (max_calcs); i++){
                    cList[i] = [sc.getRandomInteger(sp.first),sc.getRandomInteger(sp.second)];
                    if (sp.practice === 'Subtraction'){

                    }
                }
                sc.calculationList = cList;
            }
        },
        getRandomInteger:function(maxDigits){
            return Math.floor(Math.random() * Math.pow(10,maxDigits));
        },
        getNext: function(){
            let sc = Alpine.store('stateCalculations');
            let sdp = sc.getSdp();
            let scd = Alpine.store('stateCalculationDisplay');
            sc.currentCounter++;
            if (sc.currentCounter < sc.maxCalculations){
                let toMap = sc.displayMap.get(sdp.getOpChoice());
                let toMapAr = toMap(sc.calculationList[sc.currentCounter][0],sc.calculationList[sc.currentCounter][1]);
                scd.first = toMapAr[0];
                scd.second = toMapAr[1];
                scd.result = '';
                scd.isResultCorrect = false;
                scd.progressBarCorrect = Math.floor(sc.correctProgress / (sc.maxCalculations) *100) +'%';
                scd.progressBarSkip = Math.floor(sc.skipProgress / (sc.maxCalculations) *100) +'%';
            }else
            {
                //Display confirmation
                scd.displayMessage = true;
                setTimeout(()=>scd.displayMessage=false,2000);
                //Restart drill
                sdp.start();
            }

        },
        checkResult: function(){
            let sc = Alpine.store('stateCalculations');
            let sdp = sc.getSdp();
            let scd = Alpine.store('stateCalculationDisplay');
            let resultOp = sc.operationsMap.get(sdp.getOpChoice());
            let result = resultOp(sc.calculationList[sc.currentCounter][0],sc.calculationList[sc.currentCounter][1]);
            if (parseFloat(scd.result) === result){
                scd.isResultCorrect = true;
                sc.correctProgress +=1;
                setTimeout(sc.getNext, 1000); 
            }
        },
        skip: function(){
            let sc = Alpine.store('stateCalculations');
            let sdp = sc.getSdp();
            let scd = Alpine.store('stateCalculationDisplay');
            // display the correct result if possible
            if (sc.currentCounter < sc.maxCalculations){
                let resultOp = sc.operationsMap.get(sdp.getOpChoice());
                let result = resultOp(sc.calculationList[sc.currentCounter][0],sc.calculationList[sc.currentCounter][1]);
                scd.result = result;
                sc.skipProgress +=1;
                setTimeout(sc.getNext, 1000); 
            }
        },
        getSdp: function(){
            let sc = Alpine.store('stateCalculations');
            if(sc.sessionChoice === 'drill'){
                return Alpine.store('stateDrillDetailsDisplay');
            } else if (sc.sessionChoice === 'practice'){
                return Alpine.store('statePracticeDetailsDisplay');
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
            scd.updateResultText(key);
            return;
        },
    });
     
});
