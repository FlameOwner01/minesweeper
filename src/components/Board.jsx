import { useState } from "react";
import Cell from "./Cell.jsx";
import lost from "../images/lost.png";
import start from "../images/start game.png";
import winGame from "../images/win.jpg";

const Board = ({ width, height, mines}) => {

    const getRandomNumber = (dimension) =>{
        return Math.floor((Math.random() * 1000) +1) % dimension;
    }


    const createEmptyArray = () =>{
        let data = [];
        for(let i = 0; i< height; i++){
            data.push([]);
            for (let j = 0; j< width; j++){
                data[i][j]= {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false
                };
            } 
        }
        return data;
    }

    const plantMines = ( data )=>{
        let randomx, randomy, minesPlanted=0;
        while(minesPlanted<mines){
            randomx = getRandomNumber(width);
            randomy = getRandomNumber(height);
            
            if(!(data[randomx][randomy].isMine)){
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }
        return (data);
    }
    
    const traverseBoard = (x, y, data) =>{
        const el = [];
        //up
        if(x>0){
            el.push(data[x-1][y]);
        }
        //down
        if(x < height-1){
            el.push(data[x+1][y]);
        }
        //left 
        if(y > 0){
            el.push(data[x][y-1]);
        }
        //right
        if(y < width -1){
            el.push(data[x][y+1]);
        }
        //top left
        if(x > 0 && y > 0){
            el.push(data[x-1][y-1]);
        }
        //top right
        if(x >0 && y < width-1){
            el.push(data[x-1][y+1]);
        }
        //bottom right
        if(x < height-1 && y < width -1){
            el.push(data[x+1][y+1]);
        }
        //bottom left
        if(x< height-1 && y > 0){
            el.push(data[x+1][y-1]);
        }

        return el;
    }


    const getNeighbours = (data) =>{
        let updatedData = data;

        for(let i = 0; i < height; i++){
            for(let j = 0; j < width; j++){
                if(data[i][j].isMine !== true){
                    let mine = 0;
                    const area = traverseBoard(data[i][j].x , data[i][j].y, data);
                    area.map(value =>{
                        if(value.isMine) mine++;
                        return null;
                    });
                    if(mine === 0){
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mine;
                }
            }
        }
        return (updatedData);
    }


    const initBoard = () =>{
        let data = createEmptyArray();
        data = plantMines(data);
        data = getNeighbours(data);

        return data;
    }
    const [ board, setBoard] = useState({
        boardData: initBoard(),
        mineCount: mines,
        gameStatus: ""
    });


    const getFlages = (data) =>{
        let mineArray = [];

        data.map((datarow) => {
            datarow.map((dataitem) =>{
                if(dataitem.isFlagged){
                    mineArray.push(dataitem);
                }
                return null;
            });
            return null; 
        });
        return mineArray;
    }
    const getHidden = (data) => {
        let mineArray = [];

        data.map(datarow =>{
            datarow.map((dataitem)=>{
                if(!dataitem.isRevealed){
                    mineArray.push(dataitem);
                    
                }
                return null;
            });
            return null;
        });

        return mineArray;
    }

   

    
    const revealEmpty = (x,y,data) =>{
        let area = traverseBoard(x,y,data);
        area.map((value) => {
            if(!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)){
                data[value.x][value.y].isRevealed = true;
                if(value.isEmpty){
                    revealEmpty(value.x, value.y, data);
                }
            } 
            return null;
        });
        return data;
    }

    const revealBoard = () =>{
        let updatedData = board.boardData;
        updatedData.map((datarow) =>{
            datarow.map(dataitem => {
                dataitem.isRevealed = true;
                return null;
            })
            return null;
        })
        
    }

    const handleClick = (x,y) =>{
        let status = "";
        if(board.boardData[x][y].isRevealed || board.boardData[x][y].isFlagged) return null;
        
        if(board.boardData[x][y].isMine){
            revealBoard();
            alert("game over");
            status = "lost";
        }

        let updatedData = board.boardData;
        updatedData[x][y].isFlagged=false;
        updatedData[x][y].isRevealed=true;

        if(updatedData[x][y].isEmpty){
            updatedData = revealEmpty(x,y,updatedData);
        }
        
        
        if(getHidden(updatedData).length === 10){
            revealBoard();
            alert("You Win");
            status="won";
        }

        setBoard({
            boardData: updatedData,
            mineCount: mines - (getFlages(updatedData)).length,
            gameStatus: status
        });
    }

    const handleContextMenu = (event, x, y) =>{
        event.preventDefault();
        let updatedData = board.boardData;
        let mines1 = board.mineCount;
        let status = "";

        if(updatedData[x][y].isRevealed) return;
        if(updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            mines1++;
        }else{
            updatedData[x][y].isFlagged = true;
            mines1--;
        }
        

        setBoard({
            boardData: updatedData,
            mineCount: mines1,
            gameStatus: status
        })
    }

    const newGame = () =>{
        setBoard({
            boardData: initBoard(),
            mineCount: mines,
            gameStatus: ""
        })
    }

    const renderBoard = (data) =>{
        return data.map((datarow) =>{
            return datarow.map((dataitem) =>{
                return(
                    <div style={{width:"35px"}} key = {(Math.random() * 1000) +1}>
                        <Cell 
                        onClick={() => handleClick(dataitem.x, dataitem.y)}
                        cMenu = {(e)=>handleContextMenu(e, dataitem.x, dataitem.y)}
                        value={dataitem}
                        />
                    </div>
                );
            })
        });
    } 


    return(
        <div className="game">
         <div className="game-info">
            <span className="info">
                Mines: {board.mineCount}
            </span>
            <span>
                {board.gameStatus === "lost" ? <img alt="" style={{marginLeft:"45%", width:"40px", height:"40px"}} src = {lost} onClick={()=>{newGame()}}/>: null}
                {board.gameStatus==="won" ? <img alt=""  style={{marginLeft:"45%", width:"40px", height:"40px"}} src={winGame} onClick={()=>{newGame()}}/>:null}
                {board.gameStatus === "" ?  <img alt=""  style={{marginLeft:"45%", width:"40px", height:"40px"}} src={start} onClick={()=>{newGame()}}/>: null}
            </span>
         </div>
         <div className="grid" style={{border:"2px solid blue", width:"244px",height:"243px", marginLeft:"60px"}} >
          {renderBoard(board.boardData)}  
         </div>
                   
        </div>
    )
}

export default Board;