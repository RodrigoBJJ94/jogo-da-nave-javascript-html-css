let directionPlayerY, directionPlayerX, positionPlayerY, positionPlayerX;
let game, frames, player, velocity, velocityShot, velocityBomb;
let screenWidth, screenHeigth, screenMessage;
let countBombs, panelCountBombs, totalBombs, timeCreateBombs;
let lifePlanet, barPlanet, indexExplosion, indexSound;

function keyDown() {
    let key = event.keyCode;
    if (key === 37) {
        directionPlayerX = -1;
    } else if (key === 38) {
        directionPlayerY = -1;
    } else if (key === 39) {
        directionPlayerX = 1;
    } else if (key === 40) {
        directionPlayerY = 1;
    } else if (key === 32) {
        shots(positionPlayerX + 17, positionPlayerY);
    }
}

function keyUp() {
    let key = event.keyCode;
    if ((key === 37) || (key === 39)) {
        directionPlayerX = 0;
    } else if ((key === 38) || (key === 40)) {
        directionPlayerY = 0;
    }
}

function createBombs() {
    if (game) {
        let y = 0;
        let x = Math.random() * screenWidth;
        let bomb = document.createElement('div');
        let attributeBombOne = document.createAttribute('class');
        let attributeBombTwo = document.createAttribute('style');
        attributeBombOne.value = 'bomb';
        attributeBombTwo.value = 'top: ' + y + 'px; left: ' + x + 'px;';
        bomb.setAttributeNode(attributeBombOne);
        bomb.setAttributeNode(attributeBombTwo);
        document.body.appendChild(bomb);
        countBombs--;
    }
}

function controlBombs() {
    totalBombs = document.querySelectorAll('.bomb');
    let size = totalBombs.length;
    for (let i = 0; i < size; i++) {
        if (totalBombs[i]) {
            let positionIndex = totalBombs[i].offsetTop;
            positionIndex += velocityBomb;
            totalBombs[i].style.top = positionIndex + 'px';
            if (positionIndex > screenHeigth) {
                lifePlanet -= 10;
                createExplosion(2, totalBombs[i].offsetLeft, null);
                totalBombs[i].remove();
            }
        }
    }
}

function shots(x, y) {
    let shot = document.createElement('div');
    let attributeOne = document.createAttribute('class');
    let attributeTwo = document.createAttribute('style');
    attributeOne.value = 'shot-player';
    attributeTwo.value = 'top:' + y + 'px; left: ' + x + 'px';
    shot.setAttributeNode(attributeOne);
    shot.setAttributeNode(attributeTwo);
    document.body.appendChild(shot);
}

function controlShots() {
    let shots = document.querySelectorAll('.shot-player');
    let size = shots.length;
    for (i = 0; i < size; i++) {
        if (shots[i]) {
            let positionShot = shots[i].offsetTop;
            positionShot -= velocityShot;
            shots[i].style.top = positionShot + 'px';
            collisionShotAndBomb(shots[i]);
            if (positionShot < 0) {
                shots[i].remove();
            }
        }
    }
}

function collisionShotAndBomb(shots) {
    let size = totalBombs.length;
    for (let i = 0; i < size; i++) {
        if (totalBombs[i]) {
            if (
                ((shots.offsetTop <= (totalBombs[i].offsetTop + 40)) &&
                    (shots.offsetTop + 6) >= (totalBombs[i].offsetTop)
                ) &&
                ((shots.offsetLeft <= (totalBombs[i].offsetLeft + 24)) &&
                    ((shots.offsetLeft + 6) >= totalBombs[i].offsetLeft)
                )) {
                createExplosion(1, totalBombs[i].offsetLeft - 25, totalBombs[i].offsetTop);
                totalBombs[i].remove();
                shots.remove();
            }
        }
    }
}

function createExplosion(type, x, y) { // 
    if (document.querySelector('#explosion' + (indexExplosion - 4))) {
        document.querySelector('#explosion' + (indexExplosion - 4)).remove();
    }

    let explosion = document.createElement('div');
    let image = document.createElement('img');
    let sound = document.createElement('audio');
    let attributeExplosionOne = document.createAttribute('class');
    let attributeExplosionTwo = document.createAttribute('style');
    let attributeExplosionThree = document.createAttribute('id');
    let attributeImage = document.createAttribute('src');
    let attributeSoundOne = document.createAttribute('src');
    let attributeSoundTwo = document.createAttribute('id');

    attributeExplosionThree.value = 'explosion' + indexExplosion;

    if (type === 1) {
        attributeExplosionOne.value = 'explosion-air';
        attributeExplosionTwo.value = 'top: ' + y + 'px; left: ' + x + 'px;';
        attributeImage.value = '/assets/img/explosion-air.gif?' + new Date();
    } else {
        attributeExplosionOne.value = 'explosion-floor';
        attributeExplosionTwo.value = 'top: ' + (screenHeigth - 57) + 'px; left: ' + (x - 17) + 'px;';
        attributeImage.value = '/assets/img/explosion-floor.gif?' + new Date();
    }

    attributeSoundOne.value = '/assets/sound/explosion-sound.mp3?' + new Date();
    attributeSoundTwo.value = 'sound' + indexSound;
    explosion.setAttributeNode(attributeExplosionOne);
    explosion.setAttributeNode(attributeExplosionTwo);
    explosion.setAttributeNode(attributeExplosionThree);
    image.setAttributeNode(attributeImage);
    sound.setAttributeNode(attributeSoundOne);
    sound.setAttributeNode(attributeSoundTwo);
    explosion.appendChild(image);
    explosion.appendChild(sound);
    document.body.appendChild(explosion);
    document.querySelector('#sound' + indexSound).play();
    indexExplosion++;
    indexSound++;
}

function controlPlayer() {
    positionPlayerY += directionPlayerY * velocity;
    positionPlayerX += directionPlayerX * velocity;
    player.style.top = positionPlayerY + 'px';
    player.style.left = positionPlayerX + 'px';
}

function managementGame() {
    barPlanet.style.width = lifePlanet + 'px';
    if (countBombs <= 0) {
        game = false;
        clearInterval(timeCreateBombs);
        screenMessage.style.backgroundImage = 'url(/assets/img/you-win.jpg)';
        screenMessage.style.display = 'block';
    }
    if (lifePlanet <= 0) {
        game = false;
        clearInterval(timeCreateBombs);
        screenMessage.style.backgroundImage = 'url(/assets/img/game-over.jpg)';
        screenMessage.style.display = 'block';
    }
}

function gameLoop() {
    if (game) {
        controlPlayer();
        controlShots();
        controlBombs();
        managementGame();
    }
    frames = requestAnimationFrame(gameLoop);
}

function restart() {
    totalBombs = document.querySelectorAll('.bomb');
    let size = totalBombs.length;
    for (let i = 0; i < size; i++) {
        if (totalBombs[i]) {
            totalBombs[i].remove();
        }
    }
    screenMessage.style.display = 'none';
    clearInterval(timeCreateBombs);
    cancelAnimationFrame(frames);
    lifePlanet = 1;
    positionPlayerX = screenWidth / 2;
    positionPlayerY = screenHeigth / 2;
    player.style.top = positionPlayerY + 'px';
    player.style.left = positionPlayerX + 'px';
    countBombs = 10;
    game = true;
    timeCreateBombs = setInterval(createBombs, 1700);
    gameLoop();
}

function start() {
    game = false;
    screenWidth = window.innerWidth;
    screenHeigth = window.innerHeight;
    directionPlayerX = directionPlayerY = 0;
    positionPlayerX = screenWidth / 2;
    positionPlayerY = screenHeigth / 2;
    velocity = 10;
    velocityShot = 5;
    velocityBomb = 5;
    lifePlanet = 300;
    barPlanet = document.querySelector('.planet-bar');
    barPlanet.style.width = lifePlanet + 'px';
    indexExplosion = indexSound = 0;
    player = document.querySelector('#ship-game');
    player.style.top = positionPlayerY + 'px';
    player.style.left = positionPlayerX + 'px';
    countBombs = 150;
    screenMessage = document.querySelector('#screen-message');
    screenMessage.style.display = 'block';
    document.querySelector('#button-play').addEventListener('click', restart);
}

window.addEventListener('load', start);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);