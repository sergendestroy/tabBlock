//<a href="https://www.freepik.com/search?format=search&last_filter=query&last_value=tab+block&query=tab+block&type=icon">Icon by bqlqn</a>
//<a href="https://www.freepik.com/search?format=search&last_filter=query&last_value=tab+block&query=tab+block&type=icon">Icon by Freepik</a>
//<a href="https://www.freepik.com/search?format=search&last_filter=page&last_value=2&page=2&query=tab+block&type=icon#uuid=8eb37bbc-9f02-4732-a5c1-23e7efd1eab3">Icon by Freepik</a>


document.addEventListener("DOMContentLoaded",function (){

    const numTabs = document.getElementById("numTabs");
    const timeLimit = document.getElementById("timeLimit");
    const startButton = document.getElementById("start-button");
        
    const currentDate = new Date(); //can only do Date -> valueOf()
    const commitDeclaration = document.getElementById("commitment-declaration");
    const placeholder = document.getElementById("placeholder");
    //const test = document.getElementById("test");
    const readMeBtn = document.getElementById("readMe-button");
    const readMeTxt = document.getElementById("readMe-text");

    const valMsg = document.getElementById("val-msg");

    readMeBtn.addEventListener("click", ()=>{
    
        if (readMeTxt.style.display ==="none"){
            readMeTxt.style.display ="grid";
        }else{
            readMeTxt.style.display ="none";
        }
    })

    let isRunningState;
  
    startButton.addEventListener("click", ()=>{
        //disable
    
        chrome.storage.local.get(["isRunning"],(res)=>{
                startButton.textContent = !res.isRunning? "Stop":"Start"
                let newIsRunning = !res.isRunning
               
                //is the timer running? if yes, then the placeholder innertext will be the same as it is, if not, it will be the value of the commitdeclaration
               placeholder.innerText = res.isRunning?placeholder.innerText: commitDeclaration.value
              
                chrome.storage.local.set({
                    isRunning: !res.isRunning,
                    timeLimit:new Date(timeLimit.value).toISOString(),
                    numTabs:numTabs.value,
                    placeholder: commitDeclaration.value

                },()=>{
                        timeLimit.disabled = newIsRunning
                        numTabs.disabled = newIsRunning
                        startButton.disabled =newIsRunning
                        startButton.style.boxShadow ='none'
                        startButton.style.textShadow = 'none'
                        startButton.style.backgroundColor='#A4DDFA'

                        commitDeclaration.value = ""
                        chrome.runtime.sendMessage({
                            message:'message', 
                            isRunning: newIsRunning,
                            numTabs: numTabs.value, 
                            timeLimit: new Date(timeLimit.value).toISOString()})
    
                })
            }
        )
        
    })
  
    //helper functions


    function toISOLocal(adate) {
        var localdt = new Date(adate - adate.getTimezoneOffset()*60000);
        return localdt.toISOString().slice(0, -8); 
    }
    

    
    function enableStartBtn(isRunning, cDeclaration, dateTime, numTabs){
        let validDateTime = new Date()
        let timeLimitValue = new Date(dateTime)
        let isDeclarationValid = cDeclaration.trim().length>=150 //should we increase?
        let isDateTimeValid = timeLimitValue>new Date(validDateTime.setTime(validDateTime.getTime() + (4*60000))) //we want to add +5 to current date
        let isNumTabsValid = numTabs>=1 && numTabs<=7
        let isPlaceholderValid = cDeclaration.trim() === placeholder.innerText.trim()
    
        if (!isRunning && isDeclarationValid && isDateTimeValid && isNumTabsValid){
            startButton.disabled=false
            startButton.style.boxShadow ='-2px 2px 2px darkblue'
            startButton.style.textShadow = '-2px 2px 2px darkblue'
            startButton.style.backgroundColor='transparent'
            
        }else if(isRunning && isPlaceholderValid){
            startButton.disabled=false
            startButton.style.boxShadow ='-2px 2px 2px darkblue'
            startButton.style.textShadow = '-2px 2px 2px darkblue'
            startButton.style.backgroundColor='transparent'

        }else{
            startButton.disabled=true
            startButton.style.backgroundColor='#A4DDFA'
            startButton.style.boxShadow='none'
            startButton.style.textShadow='none'
        }
    
    }

    //validating inputs
    commitDeclaration.addEventListener("input", ()=>{
        
        enableStartBtn(isRunningState, commitDeclaration.value, timeLimit.value, numTabs.value);
        //placeholder.innerText= isRunningState? commitDeclaration.value:"";
    });
    numTabs.addEventListener("input", ()=>{enableStartBtn(isRunningState, commitDeclaration.value, timeLimit.value, numTabs.value)});
    timeLimit.addEventListener("input", ()=>{
        //let chem = timeLimit.value> currentDate
        //test.innerText = `${chem} + timeLimit Date: ${timeLimit.value} + ${currentDate}`
        enableStartBtn(isRunningState, commitDeclaration.value, timeLimit.value, numTabs.value)
        
        let validDT = new Date()
        let timeLimitValue = new Date(timeLimit.value)

        let dateTimeValid = timeLimitValue>new Date(validDT.setTime(validDT.getTime() + (4*60000))) //we want to add +5 to current date

        if(dateTimeValid){
            valMsg.style.display="none";
        }else{
            valMsg.style.display="block";
        }
    }
        
        );

    

    //initializing
    chrome.storage.local.get(["numTabs", "timeLimit","isRunning", "placeholder"], (res)=>{

        isRunningState = res.isRunning
        numTabs.value = res.numTabs? res.numTabs:7;

        let timeLimitDate = res.timeLimit ? new Date(res.timeLimit) : currentDate;
        let timeLimitValue = toISOLocal(timeLimitDate); //<-- we need to convert the res.timeLimit value to datetime input value 
      
        timeLimit.value = timeLimitValue;

        timeLimit.min = toISOLocal(currentDate);

        startButton.textContent= res.isRunning? "Stop":"Start";

        //on popup open: if it is running, then the placeholder will be whatever the res.placeholder value is. If it is not running, the value will be the default text
        //placeholder.innerText = res.placeholder? res.placeholder:placeholder.innerText;

        if(res.isRunning){
            timeLimit.disabled=true;
            numTabs.disabled=true;
            placeholder.innerText = res.placeholder
         
        }else{
            timeLimit.disabled=false;
            numTabs.disabled=false;
            placeholder.innerText=placeholder.innerText
        }
    })
});

/*
TODO: 
    (Done)Make textarea fixed width
    Make placeholder vanish
  */