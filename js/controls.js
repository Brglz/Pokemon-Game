class Player {
    constructor(name, hp, attack, defense, speed, img) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.img = img;
    }
}

let gameOver = false;
let player;
let enemy;

window.onload = function () {

    const elements = {
        playButton: document.querySelector('.play-button'),
        playerHTML: document.querySelector('.player'),
        enemyHTML: document.querySelector('.enemy'),
        battlefield: document.querySelector('.battlefield'),
        attackBtn: document.querySelector('.attack'),
        defendBtn: document.querySelector('.defend'),
        output: document.querySelector('.damage-output')

    }

    elements.playButton.addEventListener('click', playGame)
    function playGame() {
        try {

            let playerInfoInput = JSON.parse(sessionStorage.getItem('pokemon'));
            let enemyInfoInput = JSON.parse(sessionStorage.getItem('enemy'));

            let playerInfo = new Player(playerInfoInput.name, playerInfoInput.hp, playerInfoInput.attack, playerInfoInput.defense, playerInfoInput.speed, playerInfoInput.backImg);
            let enemyInfo = new Player(enemyInfoInput.name, enemyInfoInput.hp, enemyInfoInput.attack, enemyInfoInput.defense, enemyInfoInput.speed, enemyInfoInput.frontImg)

            elements.characters = document.querySelector('.characters');
            elements.character = document.querySelector('.character');

            let app = new PIXI.Application(
                {
                    width: 1025,
                    hight: 600,
                    transparent: true
                }
            );

            if (elements.playButton.textContent == 'Play again!') {
                elements.battlefield.removeChild(elements.battlefield.lastElementChild)
            }
            elements.battlefield.appendChild(app.view);

            loadHpAndName(playerInfo, enemyInfo);

            elements.playButton.style.display = 'none';


            if (gameOver) {
                elements.playButton.style.display = 'block';
                elements.playButton.textContent = 'Play again!';
                elements.attackBtn.style.display = 'none';
                elements.defendBtn.style.display = 'none';

            }


            app.loader
                .add(playerInfo.name, playerInfo.img)
                .add(enemyInfo.name, enemyInfo.img)
            app.loader.onProgress.add(showProgress);
            app.loader.onComplete.add(doneLoading);
            app.loader.onError.add(reportError);
            app.loader.load();

            function showProgress(e) {
                console.log(e.progress);
            }

            function reportError(e) {
                console.error('ERROR:' + e.message);
            }

            function doneLoading(e) {
                console.log('Done Loading!');

                enemy = PIXI.Sprite.from(app.loader.resources[enemyInfo.name].texture);
                enemy.x = 550;
                enemy.y = 300;
                enemy.anchor.set(0, 0);
                enemy.speed = 1;
                enemy.alpha = 1;

                let playerScale = 1.5;
                player = PIXI.Sprite.from(app.loader.resources[playerInfo.name].texture);
                player.x = 420;
                player.y = 400;
                player.scale.set(playerScale, playerScale)
                player.anchor.set(0, 0);
                player.speed = 1;
                player.alpha = 1;

                app.stage.addChild(player);
                app.stage.addChild(enemy);

                window.attack = () => {
                    let moved = false;
                    let moveUp = () => {
                        if (player.y == 329) {
                            app.ticker.remove(moveUp);
                            moved = true;
                            console.log(moved);
                        }

                        if (player.y >= enemy.y + 30) {
                            player.y--;
                            player.x++;
                            console.log('moving Up');
                            moved = false;
                        }
                    }
                    let countPlayer = 0;
                    let blink = () => {
                        if (countPlayer > 60) {
                            enemy.alpha += Math.sin(0.095);
                        }
                        countPlayer++
                        if (enemy.alpha > 1) {
                            enemy.alpha = 0;
                        }
                        if (countPlayer == 110) {
                            enemy.alpha = 1;
                            countPlayer = 0;
                            app.ticker.remove(blink)
                        }
                    }
                    let moveDown = () => {
                        if (player.y < app.view.height / 2) {
                            app.ticker.remove(moveDown);
                            moved = false;
                        }

                        if (moved) {
                            player.y++;
                            player.x--;

                            if (player.y == 400) {
                                app.ticker.remove(moveDown);
                                moved = false;
                            }
                        }
                    }

                    app.ticker.add(moveUp);
                    app.ticker.speed = 2;
                    app.ticker.add(blink)
                    app.ticker.add(moveDown);
                }

                window.defend = () => {
                    let movedEnemy = false;
                    let moveUpEnemy = () => {
                        if (enemy.y == 300) {
                            app.ticker.remove(moveUpEnemy);
                            movedEnemy = false;
                            enemy.scale.set(1, 1)
                        }

                        if (movedEnemy) {
                            enemy.y--;
                            enemy.x++;
                        }
                    }

                    let countEnemy = 0;
                    let blinkEnemy = () => {
                        if (countEnemy > 60) {
                            player.alpha += Math.sin(0.095);
                        }
                        countEnemy++
                        if (player.alpha > 1) {
                            player.alpha = 0;
                        }
                        if (countEnemy == 110) {
                            player.alpha = 1;
                            countEnemy = 0;
                            app.ticker.remove(blinkEnemy)
                            console.log('end blink');
                        }
                    }

                    let moveDownEnemy = () => {
                        if (enemy.y == 370) {
                            app.ticker.remove(moveDownEnemy);
                            movedEnemy = true;

                        }

                        if (enemy.y <= 370) {
                            enemy.y++;
                            enemy.x--;

                        }
                    }
                    app.ticker.add(moveDownEnemy);
                    app.ticker.add(blinkEnemy)
                    app.ticker.add(moveUpEnemy);
                }

                elements.attackBtn.addEventListener('click', attacking);

                elements.defendBtn.addEventListener('click', defending);

                function fight() {
                    if (playerInfo.speed >= enemyInfo.speed) {
                        elements.attackBtn.style.display = 'block';
                    } else {
                        elements.defendBtn.style.display = 'block';
                    }

                }

                function attacking() {
                    let randomNum = Math.floor(Math.random() * 20); // This should be * 200 but the game ends in 1 round
                    let damage = Math.round((playerInfo.attack / enemyInfo.defense) * randomNum);
                    if (damage > 0) {
                        window.attack();
                        elements.output.textContent = `Damage dealt: ${damage}`;
                        elements.output.style.opacity = 1
                        let removeOutput = setTimeout(() => { elements.output.style.opacity = 0 }, 2000);

                        elements.enemyHTML.lastElementChild.value -= damage;

                        if (elements.enemyHTML.lastElementChild.value <= elements.enemyHTML.lastElementChild.max * 0.5 &&
                            elements.enemyHTML.lastElementChild.value > elements.enemyHTML.lastElementChild.max * 0.1) {
                            elements.enemyHTML.lastElementChild.setAttribute('class', 'yellow');
                        } else if (elements.enemyHTML.lastElementChild.value <= elements.enemyHTML.lastElementChild.max * 0.1) {
                            elements.enemyHTML.lastElementChild.setAttribute('class', 'red');
                        }

                        if (elements.enemyHTML.lastElementChild.value <= 0) {
                            let showBtn = setTimeout(() => {
                                elements.playButton.style.display = 'block';
                            }, 2500);
                            elements.playButton.textContent = 'Play again!';
                            elements.attackBtn.style.display = 'none';
                            elements.defendBtn.style.display = 'none';
                            let showWinner = setTimeout(() => alert(`GAME OVER! YOU WON THE GAME!`), 2500);
                            elements.playerHTML.lastElementChild.setAttribute('class', 'green');
                            elements.enemyHTML.lastElementChild.setAttribute('class', 'green');
                            let removePlayers = setTimeout(() => {
                                app.stage.removeChild(player);
                                app.stage.removeChild(enemy);
                            }, 2500);
                        } else {
                            let showBtn = setTimeout(() => { elements.defendBtn.style.display = 'block' }, 2000);
                            elements.attackBtn.style.display = 'none';
                        }
                    }
                }

                function defending() {
                    let randomNum = Math.floor(Math.random() * 20); // This should be * 200 but the game ends in 1 round
                    let damage = Math.round((enemyInfo.attack / playerInfo.defense) * randomNum);
                    if (damage > 0) {
                        window.defend();

                        elements.output.textContent = `Damage dealt: ${damage}`;
                        elements.output.style.opacity = 1
                        let removeOutput = setTimeout(() => { elements.output.style.opacity = 0 }, 2000);

                        elements.playerHTML.lastElementChild.value -= damage;

                        if (elements.playerHTML.lastElementChild.value <= elements.playerHTML.lastElementChild.max * 0.5 &&
                            elements.playerHTML.lastElementChild.value > elements.playerHTML.lastElementChild.max * 0.1) {
                            elements.playerHTML.lastElementChild.setAttribute('class', 'yellow');
                        } else if (elements.playerHTML.lastElementChild.value <= elements.playerHTML.lastElementChild.max * 0.1) {
                            elements.playerHTML.lastElementChild.setAttribute('class', 'red');
                        }

                    }
                    if (elements.playerHTML.lastElementChild.value <= 0) {
                        let showBtn = setTimeout(() => {
                            elements.playButton.style.display = 'block';
                        }, 2500);
                        elements.playButton.textContent = 'Play again!';
                        elements.attackBtn.style.display = 'none';
                        elements.defendBtn.style.display = 'none';
                        let showWinner = setTimeout(() => alert(`GAME OVER! YOU LOST THE GAME!`), 2500);
                        elements.playerHTML.lastElementChild.setAttribute('class', 'green');
                        elements.enemyHTML.lastElementChild.setAttribute('class', 'green');
                        let removePlayers = setTimeout(() => {
                            app.stage.removeChild(player);
                            app.stage.removeChild(enemy);
                        }, 2500);


                    } else {
                        elements.defendBtn.style.display = 'none';
                        let showBtn = setTimeout(() => { elements.attackBtn.style.display = 'block' }, 2000);
                    }
                }

                fight();


            }
        } catch (e) {
            alert('Pick a pokemon!')
        }
    }

    function loadHpAndName(player, enemy) {
        elements.enemyHTML.style.display = 'block';
        elements.enemyHTML.firstElementChild.textContent = enemy.name;
        elements.enemyHTML.lastElementChild.value = enemy.hp;
        elements.enemyHTML.lastElementChild.max = enemy.hp;

        elements.playerHTML.style.display = 'block';
        elements.playerHTML.firstElementChild.textContent = player.name;
        elements.playerHTML.lastElementChild.value = player.hp;
        elements.playerHTML.lastElementChild.max = player.hp;

    }


}

