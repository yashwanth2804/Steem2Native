$(document).ready(function() {
    
    /// 'currency' is the place holder in local storage where preferred currency  will be stored

    //Get the past value and set to id #CurrHolder for display purpose
    chrome.storage.sync.get('currency', function(data) {
        //check if defined , if so set the select to that particular option 
        if (data.currency !== undefined) {
            $("#CurrHolder").text(data.currency);
        }
    });

    //calls this function when the select function changed 
    $('select').change(function() {
        var optionSelected = $(this).find("option:selected");
        var valueSelected = optionSelected.val();
        $("#CurrHolder").attr("text", "");
        $("#CurrHolder").text(valueSelected);

        //update the current stored value with the new one 
        chrome.storage.sync.set({
            'currency': valueSelected
        }, function() {
         
            chrome.tabs.getSelected(null, function(tab) {
                var code = 'window.location.reload();';
                chrome.tabs.executeScript(tab.id, {
                    code: code
                });
            });
        });
    });
});