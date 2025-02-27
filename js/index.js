import Maze from './Maze.class.js';
import Directions from './Directions.class.js';
import Explorer from './Explorer.class.js';

(
    ()=>
    {
        let $mazeCanvas, ctx, maze, cellWidth, cellHeight, mazeWidth, mazeHeight;
        let explorer;
        let colors = {
            'deadEnd':'#3333ff',
            'explored':'#6666ff',
            'visiting':'#ff3333'
        };
        let steps = 1;
        let speed = 10;
        let intervalLength = 1000;
        let mazeConfig = {cells:{rows:10,columns:15}};

        function $(elementId)
        {
            return document.getElementById(elementId);
        }

        function drawMaze()
        {
            let current = maze.topLeftCell;
            let firstRowCell = current;
            let x = 0, y = 0;
            ctx.clearRect(0, 0, mazeWidth, mazeHeight);
            while(current !== null)
            {
                if(current.isVisiting)
                {
                    ctx.beginPath();
                    ctx.fillStyle = ctx.strokeStyle = colors.visiting;
                    ctx.rect(x, y, cellWidth, cellHeight);
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                    ctx.stroke();
                }
                else if(current.deadEnd)
                {
                    ctx.beginPath();
                    ctx.strokeStyle = ctx.fillStyle = colors.deadEnd;
                    ctx.rect(x, y, cellWidth, cellHeight);
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                    ctx.stroke();
                }
                else if(current.explored)
                {
                    ctx.beginPath();
                    ctx.strokeStyle = ctx.fillStyle = colors.explored;
                    ctx.rect(x, y, cellWidth, cellHeight);
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                    ctx.stroke();
                }
                else
                {
                    ctx.beginPath();
                    ctx.strokeStyle = ctx.fillStyle = "black";
                    ctx.rect(x, y, cellWidth, cellHeight);
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.strokeStyle = "black";

                if(current.hasWall(Directions.North))
                {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x+cellWidth, y);
                }
                if(current.hasWall(Directions.West))
                {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + cellHeight);
                }
                if(current.hasWall(Directions.South))
                {
                    ctx.moveTo(x + cellWidth, y + cellHeight);
                    ctx.lineTo(x, y + cellHeight);
                }
                if(current.hasWall(Directions.East))
                {
                    ctx.moveTo(x + cellWidth, y + cellHeight);
                    ctx.lineTo(x + cellWidth, y);
                }
                ctx.stroke();
                if (current.hasNeighbour(Directions.East)) {
                    current = current.getNeighbour(Directions.East);
                    x += cellWidth;
                } else {
                    x = 0;
                    y += cellHeight;
                    current = firstRowCell.getNeighbour(Directions.South);
                    firstRowCell = current;
                }
            }
        }

        async function hoistMaze()
        {
            maze = new Maze(mazeConfig);
            cellWidth = mazeWidth / maze.columns;
            cellHeight = mazeHeight / maze.rows;
            return maze;
        }

        function setSpeed(speed)
        {
            let targetSpeed = 1000 / speed;
            intervalLength = Math.max(Math.floor(targetSpeed), 1);
            if(targetSpeed < 1)
            {
                steps = Math.ceil(1/targetSpeed);
            }
            else
            {
                steps  = 1;
            }
        }

        function exploreMaze()
        {
            let i = 0;
            let result = false;
            while(result === false && i < steps)
            {
                result = explorer.exploreStep();
                console.log(explorer.getSkillByName("Speed").getLevel(), Math.sqrt(explorer.getSkillByName("Speed").getLevel()));

                intervalLength /= Math.max(1, Math.sqrt(explorer.getSkillByName("Speed").getLevel()));
                console.log(intervalLength);
                i++;
            }

            drawMaze();

            if(result)
            {
                // hoistMaze().then((maze)=>{
                //     explorer = new ExplorerParty(maze);
                //     window.setTimeout(
                //         ()=>{
                //             requestAnimationFrame(exploreMaze);
                //         },
                //         intervalLength
                //     );
                // });
            }
            else
            {
                window.setTimeout(
                    ()=>{
                        requestAnimationFrame(exploreMaze);
                    },
                    intervalLength
                );
            }

        }

        window.addEventListener("load", function(){
            $mazeCanvas = $('mazeCanvas');


            // $('speed').addEventListener('change', (evt)=>{
            //     setSpeed(evt.target.value);
            // });
            let computedStyle = window.getComputedStyle($mazeCanvas);
            mazeWidth = parseInt(computedStyle.width);
            mazeHeight = parseInt(computedStyle.height);
            ctx = $mazeCanvas.getContext('2d');
            hoistMaze()
                .then(drawMaze)
                .then(()=>{
                    explorer = new Explorer(maze);
                    exploreMaze();
                });
        });
    }
)();