function Notification() {
}


Notification.toAndroid = function (funcName,message) {
    if(typeof TrPayNow !== "undefined" && TrPayNow !== null) {
        TrPayNow[funcName](message);
    }
};

Notification.toIOS = function (funcName,message) {
    try {
        webkit.messageHandlers[funcName].postMessage(message);
    } catch (err) {
        console.log('The native context does not exist yet');
    }
};

// Notification.callFunction_IOS = function(funcName, param_string){
//
// };
//
// Notification.callFunction_Android = function(funcName, param_string){
//     if(window[funcName]){
//         var returnval = window[funcName](param_string);
//         return (typeof returnval == "string") ? returnval : JSON.parse(returnval);
//     }else{
//         throw funcName+ "Not found please check the function name";
//     }
// };

//-----------------------------------------------------

Notification.toDevices = function (funcName,message) {
    Notification.toAndroid(funcName,message);
    Notification.toIOS(funcName,message);
};

// Notification.fromDevices = function (funcName, param_string) {
//     /* do we need to detect the OS and then call ?  isn't there any other way ? */
//     return Notification.callFunction_Android(funcName,param_string);
//     //Notification.callFunction_IOS(funcName,param_string);
// };
