export default class UIFields
{
    constructor()
    {
        this.playersHealth = [0,0];
        this.countReserveNpcTanks = 0;  // Количество вражеских танков в резерве
        this.currentLevel = 0;
        this.playersMode = 0;           // 0 - 1 игрок // 1 - 2 игрока
    }
}