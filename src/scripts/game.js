import GameLoop from "./gameLoop.js";
import Input from "./input.js";
import LevelManager from "./levelManager.js";
import SaveManager from "./saveManager.js";

export let GameScreens = {MENU: 0, PLAY: 1, PAUSE: 2, WIN: 3, GAMEOVER: 4};

export default class Game
{
    constructor()
    {
        this.config;
        this.uiFields;
        this.levelManager;
        
        this.input = new Input();
        this.input.changeScreenEvent = this.changeScreen.bind(this);

        // Если теряем фокус окна то ставим паузу
        window.onblur = () => {
            if (this.uiFields.currentScreen === GameScreens.PLAY)
            {
                this.changeScreen(2);
            }
        }
    }
    init(config, uiFields)
    {
        this.config = config;
        this.uiFields = uiFields;
        this.saveManager = new SaveManager(); 
        new GameLoop(this.update.bind(this), this.render.bind(this));
        this.levelManager = new LevelManager(this.input, this.config, uiFields);
        this.levelManager.gameOverEvent = this.changeScreen.bind(this, GameScreens.GAMEOVER);
        this.levelManager.winEvent = this.changeScreen.bind(this, GameScreens.WIN);
        this.levelManager.saveManager = this.saveManager;

        //this.changeScreen(3); // Тут можно проверять интерфейс

        this.config.ctxMain.imageSmoothingEnabled = false; // Отключить размытие
        this.config.ctxMain.mozImageSmoothingEnabled = false;
        this.config.ctxMain.webkitImageSmoothingEnabled = false;
        this.config.ctxMain.msImageSmoothingEnabled = false;

        this.config.ctxBackground.imageSmoothingEnabled = false; // Отключить размытие
        this.config.ctxBackground.mozImageSmoothingEnabled = false;
        this.config.ctxBackground.webkitImageSmoothingEnabled = false;
        this.config.ctxBackground.msImageSmoothingEnabled = false;
    }

    // изменить экран игры на указанный + дополнительный параметр для уточнения поведения
    changeScreen(screen, parameter = 0, secondParam = 0)
    {
        // Если нажата НЕ кнопка назад
        switch (screen) {
            case GameScreens.MENU:
                this.levelManager.reset();
                this.uiFields.currentScreen = GameScreens.MENU;
            break;
            case GameScreens.PLAY:
                if (parameter == 1) this.levelManager.start(secondParam);
                else if (parameter == 2) this.levelManager.setResume();
                this.uiFields.currentScreen = GameScreens.PLAY;
            break;
            case GameScreens.PAUSE:
                if (this.uiFields.currentScreen === GameScreens.PAUSE) {
                    this.changeScreen(GameScreens.PLAY, 2);
                    return;
                }
                this.levelManager.setPause();

                this.uiFields.currentScreen = GameScreens.PAUSE;
            break;
            case GameScreens.GAMEOVER:  

                this.uiFields.currentScreen = GameScreens.GAMEOVER;
            break;
            case GameScreens.WIN:
                this.uiFields.currentScreen = GameScreens.WIN;
            break;
            case -1: // Если нажата кнопка назад
                if (this.uiFields.currentScreen == GameScreens.PAUSE) this.changeScreen(GameScreens.MENU);
                if (this.uiFields.currentScreen == GameScreens.GAMEOVER) this.changeScreen(GameScreens.MENU);
            break;
        }
    }

    nextLevel()
    {
        this.levelManager.nextLevel();
        this.changeScreen(1, 1, this.levelManager.uiFields.playersMode);
    }

    update(lag)
    {   
        if (this.uiFields.currentScreen != GameScreens.PLAY) return;
        this.levelManager.update(lag);
    }   

    render()
    {
        this.config.ctxMain.clearRect(0, 0, this.config.canvasMain.width, this.config.canvasMain.height);
        if (this.uiFields.currentScreen == GameScreens.MENU){
            return;
        }
        this.levelManager.render();
    }
}

