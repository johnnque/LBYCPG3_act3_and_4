document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.getElementById("startQuizBtn");
    const quizArea = document.getElementById("quizArea");
    const scoreDisplay = document.getElementById("score");

    if (startBtn) {
        startBtn.addEventListener("click", function () {
            quizArea.style.display = "block";
            startBtn.style.display = "none";
        });
    }

    document.querySelectorAll(".drag-layer, .drag-def").forEach(item => {
        item.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("text/plain", this.id);
        });
    });

    document.querySelectorAll(".drop-layer, .drop-def").forEach(zone => {
        zone.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        zone.addEventListener("drop", function (e) {
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain");
            const draggedElement = document.getElementById(id);
            if (!draggedElement) return;
            if (this.children.length === 0) {
                this.appendChild(draggedElement);
            }
        });
    });

    const checkAnswers = document.getElementById("checkAnswers");
    if (checkAnswers) {
        checkAnswers.addEventListener("click", function () {
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

            score = score + checkIdentification();
            scoreDisplay.innerText = "Your Score: " + score + " / 10";
        });
    }

    if (document.getElementById("visualizationSection")) {
        resetVisualization();
    }

});

/* 
home.html interactive packet visualization part 
*/

function tag(cls, text) { return `<span class="header-tag ${cls}">${text}</span>`; }

const MODELS = {
    osi: {
        layers: [
            { name: "Application",  packet: tag("tag-data", "DATA") },
            { name: "Presentation", packet: tag("tag-data", "DATA") },
            { name: "Session",      packet: tag("tag-data", "DATA") },
            { name: "Transport",    packet: tag("tag-tcp",  "TCP HDR") + tag("tag-data", "DATA") },
            { name: "Network",      packet: tag("tag-ip",   "IP HDR")  + tag("tag-tcp", "TCP HDR") + tag("tag-data", "DATA") },
            { name: "Data Link",    packet: tag("tag-mac",  "MAC HDR") + tag("tag-ip", "IP HDR") + tag("tag-tcp", "TCP HDR") + tag("tag-data", "DATA") + tag("tag-fcs", "FCS") },
            { name: "Physical",     packet: tag("tag-bin",  "01001000 01001110 ...") }
        ],
        explanations: [
            "Host A - Layer 7 - Application: The user's data (e.g., HTTP request, file transfer) originates here. Protocols like HTTP, FTP, and DNS operate in this layer.",
            "Host A - Layer 6 - Presentation: Where data is formatted, encrypted, or compressed. It ensures that data from the application layer is in a usable format for the session layer.",
            "Host A - Layer 5 - Session: A session is established, maintained, and terminated here. It manages communication sessions between the two hosts.",
            "Host A - Layer 4 - Transport: A TCP/UDP Header is added (ports, sequence numbers, checksums) on top of the data. It's now called a segment. TCP and UDP operate at this layer to provide reliable or connectionless communication.",
            "Host A - Layer 3 - Network: An IP Header is added (source/destination IP address) on top of the segment. It's now called a packet. Routers operate at this layer to forward packets across networks.",
            "Host A - Layer 2 - Data Link: A MAC Header and FCS are added on top of the packet. It's now called a frame. Switches operate at this layer to forward frames within a local network.",
            "Host A - Layer 1 - Physical: The frame is converted to raw binary data (bits) and transmitted over the physical medium (e.g., Ethernet cable, Wi-Fi).",
            "Medium - The binary signal travels across the physical medium (e.g., copper wire, fiber optic, wireless) from Host A to Host B.",
            "Host B - Layer 1 - Physical: The binary signal is received and converted back into a frame to be read by the data link layer.",
            "Host B - Layer 2 - Data Link: The FCS is checked for errors, and the MAC Header is processed. If the frame is valid and addressed to Host B, it's passed up to the network layer.",
            "Host B - Layer 3 - Network: The destination IP address is checked. If it matches Host B, the IP Header is processed and removed, and the packet is passed up to the transport layer.",
            "Host B - Layer 4 - Transport: The TCP/UDP header is processed (ports, sequence numbers, checksums). If the segment is valid and addressed to Host B, the TCP/UDP header is removed and the data is passed up to the session layer.",
            "Host B - Layer 5 - Session: The session is maintained and if it is valid, the data is passed up to the presentation layer.",
            "Host B - Layer 6 - Presentation: The data is decrypted, decompressed, or reformatted as needed. It's then passed up to the application layer.",
            "Host B - Layer 7 - Application: The application layer receives the data and delivered to the receiving application."
        ]
    },
    tcpip: {
        layers: [
            { name: "Application",    packet: tag("tag-data", "DATA") },
            { name: "Transport",      packet: tag("tag-tcp",  "TCP HDR") + tag("tag-data", "DATA") },
            { name: "Internet",       packet: tag("tag-ip",   "IP HDR")  + tag("tag-tcp", "TCP HDR") + tag("tag-data", "DATA") },
            { name: "Network Access", packet: tag("tag-mac",  "MAC HDR") + tag("tag-ip", "IP HDR") + tag("tag-tcp", "TCP HDR") + tag("tag-data", "DATA") + tag("tag-fcs", "FCS") },
        ],
        explanations: [
            "Host A - Layer 4 - Application: The user's data (e.g., HTTP request, file transfer) originates here. Protocols like HTTP, FTP, and DNS operate in this layer.",
            "Host A - Layer 3 - Transport: A TCP Header is added (ports, sequence numbers, checksums) on top of the data. It's now called a segment. TCP and UDP operate at this layer to provide reliable or connectionless communication.",
            "Host A - Layer 2 - Internet: An IP Header is added (source/destination IP address) on top of the segment. It's now called a packet. Routers operate at this layer to forward packets across networks.",
            "Host A - Layer 1 - Network Access: A MAC Header and FCS are added on top of the packet. It's now called a frame. Switches operate at this layer to forward frames within a local network.",
            "Medium - The binary signal travels across the physical medium (e.g., copper wire, fiber optic, wireless) from Host A to Host B.",
            "Host B - Layer 1 - Network Access: The frame is received here. FCS is checked for errors, and the MAC Header is processed. If the frame is valid and addressed to Host B, it's passed up to the network layer.",
            "Host B - Layer 2 - Internet: The destination IP address is checked. If it matches Host B, the IP Header is processed and removed, and the packet is passed up to the transport layer.",
            "Host B - Layer 3 - Transport: The TCP/UDP header is processed (ports, sequence numbers, checksums). If the segment is valid and addressed to Host B, the TCP/UDP header is removed and the data is passed up to the session layer.",
            "Host B - Layer 4 - Application: The application layer receives the data and delivered to the receiving application."
        ]
    }
};

// Sets base state of the visualizer
let model       = "osi";
let mode        = "manual";
let paused      = false;
let autoTimer   = null;
let stepIndex   = 0;
let steps       = [];
let speed     = 1600;  

function buildSteps(modelKey) {
    const model = MODELS[modelKey];
    const count = model.layers.length;
    const expls = model.explanations;
    const result = [];

    // Sends data from top layer down to bottom
    for (let i = 0; i < count; i++) {
        result.push({ host: "sender", layerIndex: i, explanation: expls[i] });
    }
    // Data travels through the medium
    result.push({ host: "medium", layerIndex: null, explanation: expls[count] });
    // Receive data from bottom layer up to top
    for (let i = count - 1; i >= 0; i--) {
        result.push({ host: "receiver", layerIndex: i, explanation: expls[count + 1 + (count - 1 - i)] });
    }
    return result;
}

function renderHosts(step) {
    const currentModel = MODELS[model];
    const layers = currentModel.layers;

    let senderHTML = `<div class="host-label">Host A (Sender)</div>`;
    let receiverHTML = `<div class="host-label">Host B (Receiver)</div>`;

    layers.forEach((layer, i) => {
        let sendCls = "", recvCls = "", sendPkt = "", recvPkt = "";
        if (step.host === "sender") {
            if (i === step.layerIndex) {
                sendCls = "active-layer";
                sendPkt = layer.packet;
            }
            else if (i < step.layerIndex) {
                sendCls = "passed-layer";
                sendPkt = layer.packet;
            }
        } else {
            sendCls = "passed-layer";
            sendPkt = layer.packet;
        }

        if (step.host === "receiver") {
            if (i === step.layerIndex) {
                recvCls = "active-layer";
                recvPkt = layer.packet;
            } else if (i > step.layerIndex) {
                recvCls = "passed-layer";
                recvPkt = layer.packet;
            }
        }
        senderHTML   += `<div class="layer-row ${sendCls}"><span class="layer-name">${layer.name}</span><span class="packet-cell">${sendPkt}</span></div>`;
        receiverHTML += `<div class="layer-row ${recvCls}"><span class="layer-name">${layer.name}</span><span class="packet-cell">${recvPkt}</span></div>`;
    });

    document.getElementById("sender").innerHTML = senderHTML;
    document.getElementById("receiver").innerHTML = receiverHTML;

    const wire = document.getElementById("packet");
    if (step.host === "medium") {
        wire.style.display = "block";
        wire.style.top = "0px";
        setTimeout(() => {
            wire.style.top = document.getElementById("wire").offsetHeight + "px";
        }, 50);
    } else {
        wire.style.display = "none";
        wire.style.top = "-16px";
    }
}

function applyStep(idx) {
    const step = steps[idx];
    renderHosts(step);

    const isManual = mode === "manual";
    document.getElementById("explanation").classList.toggle("hidden", !isManual);
    if (isManual) document.getElementById("explanationText").textContent = step.explanation;
}

function completeVisualization() {
    clearAutoTimer();
    document.getElementById("completeVisualization").style.display = "block";
    document.getElementById("playBtn").disabled = true;
    document.getElementById("nxtBtn").disabled = true;
}

function setModel(m) {
    model = m;
    document.getElementById("btn-osi").classList.toggle("btn-active", m === "osi");
    document.getElementById("btn-tcpip").classList.toggle("btn-active", m === "tcpip");
    resetVisualization();
}

function setMode(m) {
    mode = m;
    document.getElementById("btn-manual").classList.toggle("btn-active", m === "manual");
    document.getElementById("btn-auto").classList.toggle("btn-active", m === "auto");
    const isManual = m === "manual";
    document.getElementById("explanation").classList.toggle("hidden", !isManual);
    document.getElementById("nxtBtn").classList.toggle("hidden", !isManual);
}

function playVisualization() {
    if (mode === "manual") return;
    paused = false;
    document.getElementById("playBtn").disabled = true;
    document.getElementById("pauseBtn").disabled = false;
    runAutoStep();
}

function pauseVisualization() {
    paused = true;
    clearAutoTimer();
    document.getElementById("playBtn").disabled = false;
    document.getElementById("pauseBtn").disabled = true;
}

function resetVisualization() {
    paused = false;
    clearAutoTimer();
    stepIndex = 0;
    steps = buildSteps(model);

    document.getElementById("completeVisualization").style.display = "none";
    document.getElementById("playBtn").disabled = false;
    document.getElementById("pauseBtn").disabled = true;
    document.getElementById("nxtBtn").disabled = false;

    const isManual = mode === "manual";
    document.getElementById("explanation").classList.toggle("hidden", !isManual);
    document.getElementById("nxtBtn").classList.toggle("hidden", !isManual);

    applyStep(0);
}

function manualStep() {
    stepIndex++;
    if (stepIndex >= steps.length) {
        completeVisualization();
        return;
    }
    applyStep(stepIndex);
}

function runAutoStep() {
    if (paused) return;
    applyStep(stepIndex);
    if (stepIndex >= steps.length - 1) {
        completeVisualization();
        return;
    }
    stepIndex++;
    autoTimer = setTimeout(runAutoStep, speed);
}

function clearAutoTimer() {
    if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
    }
}

/* 
header requires this function and will be able to toggle display of paragrph text if toggleable class is given
*/
function toggleDisplay(event) {
    var clickedHeading = event.target;
    var paragraph = clickedHeading.nextElementSibling;
    if (paragraph.classList.contains("toggleable")) {
        if (paragraph.style.display === "none") {
            paragraph.style.display = "block";
            clickedHeading.textContent = clickedHeading.textContent.replace(/.$/,"▲")
        } else {
            paragraph.style.display = "none";
            clickedHeading.textContent = clickedHeading.textContent.replace(/.$/,"▼")
        }
    }
}

function switchcolors(){
    var body = document.body;
    body.classList.toggle("dark-mode");

    var header_one = document.getElementsByTagName("H1");
    let len = header_one.length;
    for(let i = 0; i < len; i++){
        header_one[i].classList.toggle("dark-mode-header1");
    }

    var header_three = document.getElementsByTagName("H3");
    let len2 = header_one.length;
    for(let i = 0; i < len2; i++){
        header_three[i].classList.toggle("dark-mode-header3");
    }

    var footer = document.getElementsByTagName("FOOTER");
    let len3 = footer.length;
    for(let i = 0; i < len3; i++){
        footer[i].classList.toggle("dark-mode-footer");
    }

    var signatures = document.getElementsByClassName("signature");
    let len4 = signatures.length;
    for(let i = 0; i < len4; i++){
        signatures[i].classList.toggle("dark-mode-footer");
    }

}



function checkIdentification(){
    let identificationScore = 0;
    answer1 = document.getElementById("Answer1").value.trim().toLowerCase();
    answer2 = document.getElementById("Answer2").value.trim().toLowerCase();
    answer3 = document.getElementById("Answer3").value.trim().toLowerCase();

    if(answer1 === "open systems interconnection"){
        identificationScore ++;
        document.getElementById("Answer1").style.backgroundColor = "lightgreen";
    } else {
        document.getElementById("Answer1").style.backgroundColor = "lightcoral";
    }

    if(answer2 === "defense advanced research projects agency"){
        identificationScore ++;
        document.getElementById("Answer2").style.backgroundColor = "lightgreen";
    } else {
        document.getElementById("Answer2").style.backgroundColor = "lightcoral";
    }

    if(answer3 === "international organization for standardization"){
        identificationScore++
        document.getElementById("Answer3").style.backgroundColor = "lightgreen";
    } else {
        document.getElementById("Answer3").style.backgroundColor = "lightcoral";
    }

    return identificationScore; 
}