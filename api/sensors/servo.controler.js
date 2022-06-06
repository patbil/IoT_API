const i2cBus = require("i2c-bus");
const Pca9685Driver = require("pca9685").Pca9685Driver;

// Initialize controller
const PWM = new Pca9685Driver({
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
}, (err) => {
    if(err){
        console.error("Error initializing controller PCA9865");
        process.exit(-1);
    }
    console.log("Initialization done");
});

let flag = false;
function doStuff (){
    if (flag){
        PWM.setPulseLength(0, 2000);
    } else {
        PWM.setPulseLength(0,400);
    }
    flag = !flag;
  }

  setInterval(doStuff, 3000);