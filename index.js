const gameScreen = document.getElementById('gameScreen');

document.documentElement.style.setProperty('--start-width', '200px');
document.documentElement.style.setProperty('--end-width', '100px');
document.getElementById('block').style.setProperty('top', '200px');
// getComputedStyle(document.documentElement).getPropertyValue('--my-variable-name');

var dino = document.getElementById("dino");
var block = document.getElementById("block");

function jump(){
    dino.classList.add("animate");
    if(dino.classList != "animate"){
        dino.classList.add("animate");
    }
    setTimeout(function(){
        dino.classList.remove("animate");
    }, 500);
}