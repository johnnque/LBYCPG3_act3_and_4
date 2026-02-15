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