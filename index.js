const gameScreen = document.getElementById('gameScreen');

//document.documentElement.style.setProperty('--end-width', '-40px');

// getComputedStyle(document.documentElement).getPropertyValue('--my-variable-name');

var dino = document.getElementById("dino");
var block = document.getElementById("block");
var field = document.getElementById("field");

function jump(){
    dino.classList.add("animate");
    if(dino.classList != "animate"){
        dino.classList.add("animate");
    }
    setTimeout(function(){dino.classList.remove("animate");}, 500);
}
function getPosition(elem){

    var dims = {offsetLeft:0, offsetTop:0};

    do {
        dims.offsetLeft += elem.offsetLeft;
        dims.offsetTop += elem.offsetTop;
    }

    while (elem = elem.offsetParent);

    return dims;
}

var checkLose = setInterval(function(){
    var dino_top = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
    var block_left = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if(block_left < 20 && block_left > 0 && dino_top >= 130){
            block.style.animation = "none";
            block.style.display = "none";
            alert("HAI PERSO !");
    }
})
document.documentElement.style.setProperty('--block-start', field_width);
var fieldPositionInfo = field.getBoundingClientRect();
var field_height = fieldPositionInfo.height;
var field_width = fieldPositionInfo.width;
block.style.setProperty('--block-start', field_width + "px");
block.style.setProperty('top', field_height-20 + "px");
//setInterval(function(){console.log(getPosition(block));}, 50);
//setInterval(function(){console.log(getPosition(dino));}, 50);

document.addEventListener('long-press', function(e) {
    e.target.setAttribute('data-editing', 'true');
    console.log("Sono stato pressato !");
  });