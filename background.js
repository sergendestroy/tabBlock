/*
the user inputs the amount of tabs they wanna work with, limiting to a max of 7 for user inpu
*/

let createdTabListener;

function stopBlocking(listener) {
    chrome.storage.local.set({"isRunning":false})
    chrome.tabs.onCreated.removeListener(listener);
}


chrome.runtime.onMessage.addListener(async (message)=>{
    if (message){
        const currentDate = new Date()
        const timestamp = currentDate.valueOf()
        
        let timeInput = new Date(message.timeLimit) //<-this is an ISO
        let timeStop =  timeInput.valueOf() - timestamp
        console.log(`message.timeLimit: ${message.timeLimit}`)


        //if the current tab number is too big kill the first until it reaches input number
        const allWindowTabs = await chrome.tabs.query({})
        
        if(message.isRunning===true){
            console.log(`timeLimit: ${message.timeLimit}`)
            console.log(`timeStop: ${timeStop}`)

            chrome.alarms.create('timeLimit',{delayInMinutes:(timeStop/60000), periodInMinutes:1})
            
            if(allWindowTabs.length>message.numTabs){
                
                let leftoverTabs = allWindowTabs.slice(message.numTabs,allWindowTabs.length)
                let leftoverIds = leftoverTabs.map((obj)=>obj["id"])
                chrome.tabs.remove(leftoverIds)

            } 

            createdTabListener = async () =>{
                const allWindowTabs = await chrome.tabs.query({})

                if (allWindowTabs.length>message.numTabs) {
                    chrome.tabs.remove(allWindowTabs.pop().id)

                    console.log(`allWindowTabs: ${allWindowTabs.length}`)
                    console.log(`allWindowTabs: ${allWindowTabs[1].id}`)
                }
            };

            chrome.tabs.onCreated.addListener(createdTabListener);

            //when the alarm reaches its designated time, it will trigger the stopBlocking fcn
            chrome.alarms.onAlarm.addListener(()=>{
                stopBlocking(createdTabListener);
                chrome.alarms.clearAll()
                chrome.storage.local.get(["isRunning"], (res)=>{
                    console.log(`res.isRunning: ${res.isRunning}`);
                })
            });
        

        }else{
            //if isRunning is false, we remove the alarm amd stop blocking
            if(createdTabListener){
                chrome.tabs.onCreated.removeListener(createdTabListener);
            }
            
            chrome.storage.local.set({"isRunning":false})
            chrome.alarms.clearAll()
            console.log(`isRunning state: ${message.isRunning}`);

    }
    }  
    }   
);


chrome.storage.local.get(["isRunning","numTabs","timeLimit"], (res)=>{
    chrome.storage.local.set({
        isRunning: "isRunning" in res? res.isRunning:false,
        numTabs: "numTabs" in res? res.numTabs: 4,
        timeLimit:"timeLimit" in res? res.timeLimit: currentDate.toISOString()

    })
    console.log(`res.timeLimit: ${res.timeLimit}`)
    console.log(`isRunning State: ${res.isRunning}`)
})

chrome.runtime.setUninstallURL("https://www.buymeacoffee.com/sergendestroy")
