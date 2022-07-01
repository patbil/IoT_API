const { Gpio } = require('onoff');
const GPIO = require('onoff').Gpio;
const PIR = new Gpio(4, 'out');
const BUZZER = new GPIO(5, 'out', 'both')

// PIR.watch((err, val) => {
//     if(val == 1){
//         console.log("")
//         BUZZER.writeSync(0);
//     } else {
//         BUZZER.writeSync(1);
//     }
// });
let flag = false;
function doStuff (){
    if (flag){
        BUZZER.writeSync(0)
        // PWM.setPulseLength(0, 2000);
    } else {
        BUZZER.writeSync(1)
        // PWM.setPulseLength(0,400);
    }
    flag = !flag;
  }

  setInterval(doStuff, 3000);

// // PIR.watch(function(err, value){
// //     if(value == 1){
// //         console.log("pir")
// //         BUZZER.writeSync(0);
// //     }  else {
// //         console.log("nopir")
// //         BUZZER.writeSync(1);
// //     }
// // });


