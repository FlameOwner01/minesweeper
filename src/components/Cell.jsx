import cell from '../images/cell.png';
import flag from '../images/flag.png';
import one from '../images/1.png';
import two from '../images/2.png';
import three from '../images/3.png';
import four from '../images/4.png';
import five from '../images/5.png';
import six from '../images/6.png';
import seven from '../images/7.png';
import eight from '../images/8.png';
import bomb from '../images/bomb.png';
import empty from  '../images/empty.png';

const CELL_STYLE={
    width:"30px",
    height:"30px",
}

 const Cell = ({ onClick, value, cMenu}) =>{

    const getValue = () => {
        if(!value.isRevealed){
            return value.isFlagged ? flag : cell;
        }

        if(value.isMine){
            return bomb;
        }

        if(value.neighbour === 0){
            return empty;
        }

        if(value.neighbour===1){
            return one;
        }
        
        if(value.neighbour === 2){
            return two;
        }
        if(value.neighbour === 3){
            return three;
        }

        if(value.neighbour === 4){
            return four;
        }    
        
        if(value.neighbour === 5){
            return five;
        }    
        
        if(value.neighbour === 6){
            return six;
        }        
        
        if(value.neighbour === 7){
            return seven;
        }

        if(value.neighbour === 8){
            return eight;
        }                  

    }
    

    return(
        
            <img  onContextMenu={cMenu} onClick = {onClick}  alt='' src={getValue()} style={CELL_STYLE}/>
       
    )
}



export default Cell;