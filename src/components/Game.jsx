import Board from "./Board";


const Game = () =>{

    const game = {
        height: 8,
        width: 8,
        mines: 10
    };

    return(
        <div>
            <Board height = {game.height} width = {game.width} mines={game.mines}/>
        </div>
    )
}


export default Game;