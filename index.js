let hrs = document.getElementById('hrs');
let mins = document.getElementById('mins');
let secs = document.getElementById('secs');
let totalHrs = document.getElementById('total-hrs');
let totalMins = document.getElementById('total-mins');
let totalSecs = document.getElementById('total-secs');
let amount = document.getElementById('amount');
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
        keys.sort();
        for(let i=0;i<keys.length;i++){
            let key = keys[i];
            if(key[0] == "_"){
                generateTile(key);
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