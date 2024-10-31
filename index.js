let hrs = document.getElementById('hrs');
let mins = document.getElementById('mins');
let secs = document.getElementById('secs');
let totalHrs = document.getElementById('total-hrs');
let totalMins = document.getElementById('total-mins');
let totalSecs = document.getElementById('total-secs');
let amount = document.getElementById('amount');
let stopwatchIcon = document.getElementById('stopwatch-icon');
let stopwatchContainer = document.getElementById('stopwatch-container');
let stopwatchHrs = 0;
let stopwatchMins = 0;
let stopwatchSecs = 0;
let stopwatchMilliSecs = 0;
let isStopwatch = false;
let stopwatchInterval;
let changeFactorHrs = 1;
let changeFactorMins = 10;
let changeFactorSecs = 10;
let incrMode = 0;
let changeFactor = changeFactorMins;
let select = [hrs,mins,secs];
let activeField = mins.id;
let selectIndex = 1;
let currAmount = changeFactorMins;
let progress = document.getElementById('progress');
let progressContainer = document.getElementsByClassName('progress-container')[0];
let date = new Date();
let today = generateDate(date);
let showProgress = false;

initTiles();
console.log(localStorage);
let totalDuration = (localStorage.getItem("current"))?(localStorage.getItem("current").split(',')):(localStorage.setItem("current","0,0,0"),['0','0','0']);
[totalHrs.innerHTML,totalMins.innerHTML,totalSecs.innerHTML] = [...totalDuration];
if(localStorage.getItem('current_date') === null)
    localStorage.setItem("current_date",`${today}`);
if(today != localStorage.getItem("current_date")){
    console.log("new entry");
    localStorage.setItem(`${localStorage.getItem("current_date")}`,`${localStorage.getItem("current")}`);
    initTiles();
    localStorage.setItem("current","0,0,0");
    localStorage.setItem("current_date",`${today}`);
    [totalHrs.innerHTML,totalMins.innerHTML,totalSecs.innerHTML] = ['0','0','0'];
}

amount.innerHTML = changeFactorMins;

    document.getElementsByClassName('select')[1].style.backgroundColor="orange";


    function generateDate(date){
        let year = date.getFullYear();
        let month = (date.getMonth()+1).toString().padStart(2,'0');
        let day = (date.getDate()).toString().padStart(2,'0');
        let dayName = date.toLocaleDateString('en-US',{weekday:'short'});
        return `_${day}-${month}-${year}-${dayName}`;
    }

    function clearSelection(){
        document.querySelectorAll('.select').forEach((field)=>{
            field.style.backgroundColor="";
        });
    }

    function selectField(i){
        playKeyPress(switchKeySound);
        clearSelection();
        
        activeField = document.getElementsByClassName('select')[i].children[0].id;
        document.getElementsByClassName('select')[i].style.backgroundColor="orange";
        if(activeField == "hrs"){
            changeFactor = changeFactorHrs;
        }
        if(activeField == "mins"){
            changeFactor = changeFactorMins;
        }
        if(activeField == "secs"){
            changeFactor = changeFactorSecs;
        }
        setAmount();
    }

    function toggle(){
        playKeyPress(toggleKeySound);
        incrMode = !incrMode;
        setAmount();
    }

    function reset(){
        playKeyPress(resetKeySound);
        document.getElementById(activeField).innerHTML = `${0}&nbsp;`;
    }

    function setAmount(){
        if(incrMode){
            amount.innerHTML = "1";
            return;
        }
        if(activeField == "hrs"){
            amount.innerHTML = changeFactorHrs;
        }
        if(activeField == "mins"){
            amount.innerHTML = changeFactorMins;
        }
        if(activeField == "secs"){
            amount.innerHTML = changeFactorSecs;
        }
    }

    function plus(){
        playKeyPress(changeKeySound);
        let val = parseInt(document.getElementById(activeField).innerHTML);
        document.getElementById(activeField).innerHTML = `${(val + (incrMode?1:changeFactor))%60}&nbsp;`;
    }

    function minus(){
        playKeyPress(changeKeySound);
        let val = parseInt(document.getElementById(activeField).innerHTML);
        if((val - (incrMode?1:changeFactor)) >= 0)
        document.getElementById(activeField).innerHTML = `${val - (incrMode?1:changeFactor)}&nbsp;`;
    }

    function updateTimer(hrs,mins,secs){
        let _secs = (parseInt(totalSecs.innerHTML))+secs;
        let _mins = (parseInt(totalMins.innerHTML))+mins;
        let _hrs = (parseInt(totalHrs.innerHTML))+hrs;
        totalHrs.innerHTML = _hrs + parseInt(_mins/60);
        totalMins.innerHTML =  _mins%60+ parseInt(_secs/60);
        totalSecs.innerHTML = _secs%60;
        localStorage.setItem("current",`${totalHrs.innerHTML},${totalMins.innerHTML},${totalSecs.innerHTML}`);
    }

    function playKeyPress(keySound){
        let keyPress = document.getElementById(`key-press-${keySound}`);
        keyPress.currentTime = 0;
        keyPress.play();
    }

    function sendUpdate(){
        playKeyPress(enterKeySound);
        let _hrs = parseInt(hrs.innerHTML);
        let _mins = parseInt(mins.innerHTML);
        let _secs = parseInt(secs.innerHTML);
        updateTimer(_hrs,_mins,_secs);
    }

    function resetValues(){
        playKeyPress(resetKeySound);
        for(let i=0;i<3;i++)
            document.getElementsByClassName('select')[i].children[0].innerHTML = `${0}&nbsp;`;
        incrMode = 0;
        setAmount();
    }

    function initTiles(){
        progress.innerHTML = "";
        let keys = Object.keys(localStorage);
        keys.sort((a,b)=> -1*sortTiles(a,b));
        for(let i=0;i<keys.length;i++){
            let key = keys[i];
            if(key[0] == "_"){
                generateTile(key);
            }
        }
    }

    function sortTiles(a,b){
        if(a[0]!='_'){
            return 1;
        } else if(b[0]!='_'){
            return -1;
        } else {

            let dateArr1,dateArr2;
            dateArr1 = a.substr(1,10).split('-').map((date)=>parseInt(date));
            dateArr2 = b.substr(1,10).split('-').map((date)=>parseInt(date));
            if(dateArr1[2] === dateArr2[2]){
                if(dateArr1[1] === dateArr2[1]){
                    return dateArr1[0] - dateArr2[0];
                } else {
                    return dateArr1[1] - dateArr2[1];
                }
            } else {
                return dateArr1[2] - dateArr2[2];
            }
        }
    }
    
    function generateTile(date){
        let current = localStorage.getItem(`${date}`).split(',');
        date = date.substr(1).split('-');
        let month = new Date(parseInt(date[2]),parseInt(date[1])-1);
        month = month.toLocaleDateString('en-US',{month:'short'});
        progress.insertAdjacentHTML('beforeend',`
            <div class="tile">
            <h4 class="day">${date[3]}, ${date[0]} ${month} ${date[2]} </h4>
            <h4 class="duration">${current[0]}Hrs ${current[1]}Mins ${current[2]}Secs</h4>
            </div>
            `);        
    }


document.getElementById('plus').addEventListener('click',plus);
document.getElementById('minus').addEventListener('click',minus);
document.getElementById('toggle-button').addEventListener('click',toggle);
document.getElementById('toggle').addEventListener('click',toggle);
document.getElementById('reset').addEventListener('click',reset);
document.getElementById('calendar-icon').addEventListener('click',()=>{
    playKeyPress(switchKeySound);
    progressContainer.style.display="flex";
    document.getElementById('calendar-icon').style.display="none";
});

stopwatchIcon.addEventListener('click',()=>{
    playKeyPress(switchKeySound);
    if(stopwatchIcon.classList.contains('selected')){
        stopwatchIcon.classList.remove('selected');
        stopwatchContainer.classList.add('hide');
        document.getElementById('container').classList.remove('hide');
        
    } else {
        stopwatchIcon.classList.add('selected');
        stopwatchContainer.classList.remove('hide');
        document.getElementById('container').classList.add('hide');
    }
});


document.getElementById('play-stopwatch-icon').addEventListener('click',()=>{
    if(!isStopwatch){
        //play Stopwatch
        playStopwatch();
    } else {
        //pause Stopwatch
        pauseStopwatch();
    }
    // isStopwatch = !isStopwatch;
});

document.getElementById('reset-stopwatch-icon').addEventListener('click',()=>{
    resetStopwatch();
});

function resetStopwatch(){
    document.getElementById('play-stopwatch-fa-icon').classList = "fa-solid fa-play";
    document.getElementById('stopwatch-hrs').innerHTML = "00";
    document.getElementById('stopwatch-mins').innerHTML = "00";
    document.getElementById('stopwatch-secs').innerHTML = "00";
    document.getElementById('milli-secs').innerHTML = ".00";
    stopwatchHrs = 0;
    stopwatchMins = 0;
    stopwatchSecs = 0;
    stopwatchMilliSecs = 0;
    clearInterval(stopwatchInterval);
    isStopwatch = false;
}

function pauseStopwatch(){
    document.getElementById('play-stopwatch-fa-icon').classList = "fa-solid fa-play";
    clearInterval(stopwatchInterval);
    isStopwatch = false;
}

function playStopwatch(){
    document.getElementById('play-stopwatch-fa-icon').classList = "fa-solid fa-pause";
    isStopwatch = true;
    stopwatchInterval = setInterval(() => {
        
        stopwatchMilliSecs = (stopwatchMilliSecs+1);
        if(stopwatchMilliSecs == 100){
            stopwatchSecs = stopwatchSecs + 1;
            stopwatchMilliSecs = 0;

            if(stopwatchSecs == 60){

                stopwatchMins = stopwatchMins + 1;
                stopwatchSecs = 0;


                if(stopwatchMins == 60){

                    stopwatchHrs = stopwatchHrs + 1;
                    stopwatchMins = 0;
                }

            }
        }

        document.getElementById('stopwatch-hrs').innerHTML = `${stopwatchHrs}`.padStart(2,'0');
        document.getElementById('stopwatch-mins').innerHTML = `${stopwatchMins}`.padStart(2,'0');
        document.getElementById('stopwatch-secs').innerHTML = `${stopwatchSecs}`.padStart(2,'0');
        let millisecsOutput = `${stopwatchMilliSecs}`.padStart(2,'0');
        document.getElementById('milli-secs').innerHTML = `.${millisecsOutput}`;
    }, 10);
}

document.addEventListener('click',(e)=>{
    const calendar = document.getElementById('calendar-icon');
    if(!calendar.contains(e.target)){
        // playKeyPress(switchKeySound);
    progressContainer.style.display="none";
    document.getElementById('calendar-icon').style.display="flex";
    }
})

document.getElementById('minimize').addEventListener('click',()=>{
    playKeyPress(switchKeySound);
    progressContainer.style.display="none";
    document.getElementById('calendar-icon').style.display="flex";
})
    
document.getElementById('add').addEventListener('click',()=>{
    sendUpdate();
    resetValues();
});
document.querySelectorAll('.select').forEach((field)=>{
    
    field.addEventListener('click',()=>{
        clearSelection();
        selectField(field.getAttribute('index'));
    });
});
document.body.addEventListener('keydown',(e)=>{
    let key = e.key;
    // e.preventDefault();
    if(e.shiftKey && e.key === "S"){
        if(!document.getElementById('stopwatch-container').classList.contains('hide')){
            document.getElementById('container').classList.remove('hide');
            document.getElementById('stopwatch-icon').classList.remove('selected');
            stopwatchContainer.classList.add('hide');
        } else {
            document.getElementById('container').classList.add('hide');
            document.getElementById('stopwatch-icon').classList.add('selected');
            stopwatchContainer.classList.remove('hide');
        }
    }

    if(!document.getElementById('stopwatch-container').classList.contains('hide')){

        if(e.key === " "){
            if(!isStopwatch){
                //play Stopwatch
                playStopwatch();
            } else {
                //pause Stopwatch
                pauseStopwatch();
            }
        } else if(e.key === 'r'){
            resetStopwatch();
        }
    } else {
        
        if(e.ctrlKey && key == "r"){
            resetValues();
        }
    
        if(key == "r"){
            reset();
        }
    
        if(key == "e"){
            toggle();
             
        }
    
        if(key == "ArrowRight"){
            
            selectIndex = (selectIndex+1)%3;
            selectField(selectIndex);
        }
        if(key == "ArrowLeft"){
            
            selectIndex = (selectIndex-1 + 3)%3;
            selectField(selectIndex);
        }
        
        if(key == "d"){
            plus();
             
        }
        if(key == "s"){
            minus();
             
        }
    
        if(key == "Enter"){
            
            sendUpdate();
            resetValues();
        }
    }
    
});

window.addEventListener('load',()=>{
    if(window.innerWidth <= 700){
        document.getElementById('add').innerHTML = "+ Add Duration";
    } else {
        document.getElementById('add').innerHTML = "+";
    }
})

window.addEventListener('resize',()=>{
    if(window.innerWidth <= 700){
        document.getElementById('add').innerHTML = "+ Add Duration";
    } else {
        document.getElementById('add').innerHTML = "+";
    }
})

//Water alarm

let waterAlarm = document.getElementById('water-alarm');
let time = (1000) * 60 * 60;
// time = 10000;
setInterval(() => {
    waterAlarm.play();
}, time);


// Key press sounds 
let enterKeySound = 1;
let changeKeySound = 3;
let resetKeySound = 4;
let toggleKeySound = 6;
let switchKeySound = 7;