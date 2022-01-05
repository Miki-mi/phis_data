var background = chrome.extension.getBackgroundPage();
var colors = {
    "-1":"#58bc8a",
    "0":"#ffeb3c",
    "1":"#ff8b66"
};
var featureList = document.getElementById("features");

var roundBtn = document.querySelector('.rounded-circle');
roundBtn.addEventListener('click', toggleSwitch);

var showResults = document.querySelector('#results');
showResults.addEventListener('click', toggleResults);

// RUN FIRST
chrome.storage.local.get('state', data => {
    if(!data.state)
        chrome.storage.local.set({state: 'on'});
    // alert('Extension is ' + data.state);
    changeUI();
    $("#features").hide();
});

function toggleResults(){
    chrome.storage.local.get('state', data => {
        if (data.state === 'on'){ //toggle results
            $("#features").toggle();
        }
    })
};

function toggleSwitch(){
    chrome.storage.local.get('state', data => {
        if (data.state == 'on'){ // turn off extension
            chrome.storage.local.set({state: 'off'});
            changeUI();
        }else if (data.state == 'off'){ // turn on extension
            chrome.storage.local.set({state: 'on'});
            changeUI();
            // $("#site_msg").text("Refresh the page for changes to take effect.");
        }
    })
};

function changeUI(){
    chrome.storage.local.get('state', data => {
        if (data.state == 'on'){
            chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
                var result = background.results[tabs[0].id];
                var isPhish = background.isPhish[tabs[0].id];
                var legitimatePercent = background.legitimatePercents[tabs[0].id];
            
                for(var key in result){
                    var newFeature = document.createElement("li");
                    //console.log(key);
                    newFeature.textContent = key;
                    //newFeature.className = "rounded";
                    newFeature.style.backgroundColor=colors[result[key]];
                    featureList.appendChild(newFeature);
                }
                
                // alert(String(typeof(legitimatePercent)));

                if(isPhish) {
                    $("#res-circle").css("background", "#ff8b66");
                    $("#site_msg").text("You're being phised!");
                    $("#site_score").text(parseInt(legitimatePercent)-20+"%");
                }
                else{
                    $("#res-circle").css("background", "#58bc8a");
                    $("#site_msg").text("The website is safe to use.");
                    if(String(typeof(legitimatePercent)) != "number"){
                        $("#site_score").text("WL");
                    }
                    $("#site_score").text(parseInt(legitimatePercent)+"%");
                }

                // $("#site_score").text("ON");
                // $("#site_msg").text("Extension is " + data.state);
                $("#results").show();
            });
        }else if (data.state == 'off'){
            $("#res-circle").css("background", "#BFBFBF");
            $("#site_score").text("OFF");
            $("#site_msg").text("You're at risk of being phised!");
            $("#features").hide();
            $("#results").hide();
            // alert('Extension is ' + data.state);
            // $("#site_msg").text("Extension is " + data.state);
        };
    });
}