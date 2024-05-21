export default class Input
{
    constructor()
    {
        this.changeScreenEvent;
        this.startGameEvent;
        this.moveEvent;
    }

    backButton_click()
    {
        this.changeScreenEvent(-1);
    }

    pause_click()
    {
        this.changeScreenEvent(2);
    }

    restart_click()
    {
        this.changeScreenEvent(1, 1); // Параметр 1 - начать уровень заново
    }

    resume_click()
    {
        this.changeScreenEvent(1, 2); // Параметр 2 - продолжить игру на уровне с сохранением результата
    }

    setKeydown(e)
    {   
        console.log(e.code);
        if (e.code === "ArrowRight")
        {
            this.moveEvent(1,0);
        }
        if (e.code === "ArrowLeft")
        {
            this.moveEvent(-1,0);
        }
        if (e.code === "ArrowUp")
        {
            this.moveEvent(0,-1);
        }
        if (e.code === "ArrowDown")
        {
            this.moveEvent(0,1);
        }
    }

    setKeyup(e)
    {

    }
    
}