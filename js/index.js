import Maze from './Maze.class.js';
import Directions from './Directions.class.js';
import {Explorer, ExplorerEvents} from './Explorer.class.js';

const baseInterval = 100;

(
    ()=>
    {
        let $mazeCanvas, ctx, maze, cellWidth, cellHeight, mazeWidth, mazeHeight;
        let $skillsDiv;
        let explorer;
        let colors = {
            'deadEnd':'#3333ff',
            'explored':'#6666ff',
            'visiting':'#ff3333'
        };
        let steps = 1;
        let speed = 10;
        let intervalLength = baseInterval;
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

        function updateSkillLevels()
        {
            for(let skillName in explorer.skills)
            {
                let $skill = $(`skill_${skillName}`);
                let skill = explorer.getSkillByName(skillName);
                $skill.querySelector('.skillLevel').innerText = skill.getLevel();
                $skill.querySelector('.skillXPEarned').innerText = skill.xp;
                $skill.querySelector('.skillXPToLevel').innerText = skill.getXPToLevel();
                $skill.querySelector('.currentProgress').style.width = `${skill.xp/skill.getXPToLevel() * 100}%`;
            }
        }

        function exploreMaze()
        {
            let i = 0;
            let result = false;
            while(result === false && i < steps)
            {
                result = explorer.exploreStep();
                intervalLength = baseInterval / Math.max(1, Math.pow(explorer.getSkillByName("Speed").getLevel(), 0.025));
                i++;
            }

            drawMaze();
            updateSkillLevels();

            if(!result)
            {
                window.setTimeout(
                    ()=>{
                        requestAnimationFrame(exploreMaze);
                    },
                    intervalLength
                );
            }
        }

        function mazeExplored(explorer)
        {
            hoistMaze()
                .then(drawMaze)
                .then(()=>{
                    explorer.setMaze(maze);
                    exploreMaze();
                });
        }

        function updateSkills(explorer, skill)
        {
            let $template = $('skillTemplate');
            let $clone = $template.content.cloneNode(true);
            $clone.firstChild.id = `skill_${skill.name}`;
            $clone.querySelector('.skillName').innerHTML = skill.name;
            $clone.querySelector('.skillLevel').innerHTML = skill.level;
            $clone.querySelector('.skillXPEarned').innerHTML = skill.xp;
            $clone.querySelector('.skillXPToLevel').innerHTML = skill.getXPToLevel();
            $skillsDiv.appendChild($clone);
        }


        window.addEventListener("load", function(){
            $mazeCanvas = $('mazeCanvas');
            $skillsDiv = $('skillsDiv');

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
                    explorer.on(ExplorerEvents.mazeExplored, mazeExplored);
                    explorer.on(ExplorerEvents.explorerSkillIncreased, updateSkills);
                    exploreMaze();
                });
        });
    }
)();