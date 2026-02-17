document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.getElementById("startQuizBtn");
    const quizArea = document.getElementById("quizArea");
    const scoreDisplay = document.getElementById("score");

    startBtn.addEventListener("click", function () {
        quizArea.style.display = "block";
        startBtn.style.display = "none";
    });

    document.querySelectorAll(".drag-layer, .drag-def").forEach(item => {

        item.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("text/plain", this.id);
        });

    });

    document.querySelectorAll(".drop-layer, .drop-def").forEach(zone => {

        zone.addEventListener("dragover", function (e) {
            e.preventDefault(); // REQUIRED
        });

        zone.addEventListener("drop", function (e) {
            e.preventDefault();

            const id = e.dataTransfer.getData("text/plain");
            const draggedElement = document.getElementById(id);

            if (!draggedElement) return;

            // Only allow one item per drop zone
            if (this.children.length === 0) {
                this.appendChild(draggedElement);
            }
        });

    });

    document.getElementById("checkAnswers").addEventListener("click", function () {

        let score = 0;

        document.querySelectorAll(".match-row").forEach(row => {

            const correctId = row.getAttribute("data-id");

            const layerZone = row.querySelector(".drop-layer");
            const defZone = row.querySelector(".drop-def");

            const layer = layerZone.firstElementChild;
            const def = defZone.firstElementChild;

            if (layer && def) {
                if (
                    layer.getAttribute("data-id") === correctId &&
                    def.getAttribute("data-id") === correctId
                ) {
                    score++;
                    row.style.backgroundColor = "#d4edda";
                } else {
                    row.style.backgroundColor = "#f8d7da";
                }
            }
        });

        scoreDisplay.innerText = "Your Score: " + score + " / 7";
    });

});

/* 
home.html interactive packet visualization part 
(We could probably add colors so it counts as style changing. 
Like make the other packets greyed out or something.)
*/

let currentLayer = 7;

function packetUp(){
    if(currentLayer < 7){
        currentLayer ++;
        clearPackets();
        
        switch(currentLayer){
            case 1:
                document.getElementById("physicalPacket").innerHTML = "[Binary Data]";
                break;
            case 2:
                document.getElementById("dataLinkPacket").innerHTML = "[MAC Header][IP Header][TCP Header][Data][FCS]";
                break;
            case 3:
                document.getElementById("networkPacket").innerHTML = "[IP Header][TCP Header][Data]";
                break;
            case 4:
                document.getElementById("transportPacket").innerHTML = "[TCP Header][Data]";
                break;
            case 5:
                document.getElementById("sessionPacket").innerHTML = "[Data]";
                break;
            case 6:
                document.getElementById("presentationPacket").innerHTML = "[Data]";
                break;
            case 7:
                document.getElementById("applicationPacket").innerHTML = "[Data]";
                break;
        }
    }
}


function packetDown(){
    if(currentLayer > 1){
        currentLayer --;
        clearPackets();
        
        switch(currentLayer){
            case 1:
                document.getElementById("physicalPacket").innerHTML = "[Binary Data]";
                break;
            case 2:
                document.getElementById("dataLinkPacket").innerHTML = "[MAC Header][IP Header][TCP Header][Data][FCS]";
                break;
            case 3:
                document.getElementById("networkPacket").innerHTML = "[IP Header][TCP Header][Data]";
                break;
            case 4:
                document.getElementById("transportPacket").innerHTML = "[TCP Header][Data]";
                break;
            case 5:
                document.getElementById("sessionPacket").innerHTML = "[Data]";
                break;
            case 6:
                document.getElementById("presentationPacket").innerHTML = "[Data]";
                break;
            case 7:
                document.getElementById("applicationPacket").innerHTML = "[Data]";
                break;
        }
    }
}

function clearPackets(){
    document.getElementById("physicalPacket").innerHTML = "";
    document.getElementById("dataLinkPacket").innerHTML = "";
    document.getElementById("networkPacket").innerHTML = "";
    document.getElementById("transportPacket").innerHTML = "";
    document.getElementById("sessionPacket").innerHTML = "";
    document.getElementById("presentationPacket").innerHTML = "";
    document.getElementById("applicationPacket").innerHTML = "";
}