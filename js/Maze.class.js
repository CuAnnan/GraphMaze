import Cell from './Cell.class.js';
import Directions from './Directions.class.js';

class Maze
{
    rows;
    columns;
    topLeftCell;
    bottomRightCell;

    constructor(config={cells:{rows:15,columns:20}})
    {
        this.rows = 15;
        this.columns = 20;
        this.rows = config.cells?.rows;
        this.columns = config.cells?.columns;

        this.topLeftCell = new Cell(0, 0);
        this.topLeftCell.tlc = true;
        let current = this.topLeftCell;
        let previousRowCurrent = null;

        for(let i = 0; i < this.rows; i++)
        {
            let firstInRow = current;
            if(i > 0)
            {
                firstInRow.setNeighbour(Directions.North, previousRowCurrent);
            }
            for (let j = 0; j < this.columns - 1; j++)
            {
                let next = new Cell(i, j + 1);
                if(previousRowCurrent !== null)
                {
                    previousRowCurrent = previousRowCurrent.getNeighbour(Directions.East);
                    next.setNeighbour(Directions.North, previousRowCurrent);
                }
                current.setNeighbour(Directions.East, next);
                current = next;
            }
            previousRowCurrent = firstInRow;

            if(i === this.rows - 1)
            {
                current.brc = true;
                this.bottomRightCell = current;
            }
            current = new Cell(i + 1, 0);
        }
        this.topLeftCell.walk();
    }

    getStartCell()
    {
        return this.topLeftCell;
    }

    getEndCell()
    {
        return this.bottomRightCell;
    }

}

export default Maze;