$(document).ready(async function() {
    var currVal = 0;
    var symbol = "";

    // Listener for monitoring the changed currency  
    chrome.storage.onChanged.addListener(async function(changes, namespace) {
        var changedCurrency = changes["currency"].newValue;
        //get the new exchange rates 
        await getStoreandExchange();
     
    });
    // convert USD to preferred currency  [USD to preferred currency ]
    function getExcngeValue(contry) {
        return new Promise(function(res, rej) {
            $.getJSON("https://free.currencyconverterapi.com/api/v5/convert?q=USD_" + contry + "&compact=y", function(d) {
                $.each(d, function(i, field) {
                   
                    res(field.val);
                });
            });
        });
    }
    //get Stored currency 
    function getStoredCurr() {
        return new Promise(function(res, rej) {
            chrome.storage.sync.get(['currency'], function(data) {
               
                if (data.currency !== undefined) {
                    symbol = data.currency;
                    res(data.currency);
                } else {
                    res(0);
                }
            });
        });
    }
    //call stored and exchange functions 
    async function getStoreandExchange() {
        var numPlus1 = await getStoredCurr();
         
        if (numPlus1 != 0) {
            var numPlus2 = await getExcngeValue(numPlus1);
            currVal = numPlus2;
            return currVal;
        } else {
            
            return currVal;
        }
    }
    
    //calls at the every page load 
    await getStoreandExchange();

    //For every certain time, this setInterval function gets the updated set of currencies list
    // this function inshort monitors for the changes in the page 
    setInterval(function() {
        checkUSD();
    }, 750);

    function checkUSD() {
        ///check if user had any currency selected 
        // if selected then only call for a conversion
        // no need to convert if user selected USD 
        if ((symbol !== '') || (symbol !== "")) {
            //if(typeof symbol !=='undefined')              
            if ((symbol !== "USD")) covertionLogic(symbol, currVal);
        }
    }

    //conversion logic takes the symbol and exchange rate 
    // this function will gets the USD from the DOM page of stemit
    // and convert with respect to the echange rates it got from 'currency converter api'
    // the new values will replace the old USD values on steemit page 

    function covertionLogic(SYMBOL, CURRENTVAL) {
        var ParesCURRENTVAL = parseFloat(CURRENTVAL);
        prefix = document.getElementsByClassName("prefix");
        integer = document.getElementsByClassName("integer");
        _decimal = document.getElementsByClassName("decimal");
        for (var i = 0; i < prefix.length; i++) {
            if ((prefix[i].innerText.trim() === "$")) {
                var y = parseInt(integer[i].innerText);
                var a = parseFloat(_decimal[i].innerText);
                var k = ((y + a) * ParesCURRENTVAL).toFixed(2);
                g = k.toString().split(".");
                var decimal = '';
                var ints = g[0];
                if (g[1] === undefined) decimal = '0';
                else decimal = g[1];
                prefix[i].innerText = SYMBOL;
                integer[i].innerText = " " + ints;
                _decimal[i].innerText = "." + decimal;
            }
        }
    }
});