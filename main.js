let wins, losses, swins, slosses, rate, srate;
let conclusion = "";
wins = losses = swins = slosses = rate = srate = 0;
let door_b_s, door_a_s, reveal; // Door before and after switching
let action = true;
let can_switch = false;
let auto = false;
let winning_door = generateRandomInt(3);
let switchable_door;

const img_door = "url('media/door.png')";
const img_door_dark = "url('media/door_dark.png')";
const img_win = "url('media/win.png')";
const img_goat = "url('media/loss.png')";

function generateRandomInt(m) {
    return Math.floor(Math.random() * m) + 1;
}

function autoRun() {
    const ar_input = document.getElementById("auto_run");
    console.log(ar_input.checked);

    // if checked
    if (!ar_input.checked) {
        auto = false;
    } else {
        auto = true;
        clickDoor(document.getElementById("door" + generateRandomInt(3)));
    }
}

function autoRunSwitch() {
    if(generateRandomInt(2) > 1) {
        // switch
        let doors = [1, 2, 3];
        doors = doors.filter(e => e != door_b_s);
        doors = doors.filter(e => e != reveal);
        clickDoor(document.getElementById("door" + doors[0]));
    } else {
        // dont switch
        clickDoor(document.getElementById("door" + door_b_s));
    }
}

function clickDoorWrapper(o) {
    if(!auto)
        clickDoor(o);
}

function clickDoor(o) {
    // switch door functionallity
    if(!action && can_switch) {
        let this_door = String(o.id).slice(-1);
        if (this_door != reveal) {
            if (this_door == door_b_s) {
                switchDoor(0);
            } else {
                switchDoor(1);
            }
            return;
        }
        return;
    }
    
    // check if player is allowed to play
    if (!action)
        return;
    resetEvents();

    door_b_s = String(o.id).slice(-1);
    const door = document.getElementById(o.id);
    // check if door can be clicked
    if (!available(door))
        return;
    action = false;
    // modify door
    chooseDoor(door);
    // Add Event
    addGameStep("Du hast dich für Tor Nummer <b>" + door_b_s + "</b> entschieden!")
    // reveal one door
    revealFirst()
}
function getAvailableDoors() {
    let doors = [1, 2, 3];
    // filter out chosen door
    doors = doors.filter(e => e != door_b_s);
    // filter out winning door
    doors = doors.filter(e => e != winning_door);
    return doors;
}
function setSwitchableDoor(d) {
    let doors = [1, 2, 3];
    // filter out chosen door
    doors = doors.filter(e => e != door_b_s);
    doors = doors.filter(e => e != d);
    switchable_door = doors[0];
}
function revealFirst() {
    setTimeout(() => {
        let doors = getAvailableDoors();
        reveal = doors[generateRandomInt(doors.length) - 1];
        setSwitchableDoor(reveal);
        // Add Event
        addGameStep("Der Moderator hat Tor nummer <b>" + reveal + "</b> aufgedeckt.");
        // modify door
        revealDoor(document.getElementById("door" + reveal));
        // prompt
        addGameStep("Möchtest du deine Wahl ändern? Wähle erneut ein Tor aus.");
        // enable switching
        can_switch = true;

        if(auto) {
            setTimeout(() => {
                autoRunSwitch();
            }, 400);
        }
    }, 700);
}
function addGameStep(t) {
    const elem = document.getElementById("game_wrapper");
    const step = elem.childElementCount + 1;
    elem.insertAdjacentHTML( 'beforeend', '<p>(' + step + ') ' + t + '</p>');
}
function available(d) {
    return d.classList.contains("available");
}
function resetDoors() {
    const doors = [
        document.getElementById("door1"),
        document.getElementById("door2"),
        document.getElementById("door3")
    ]
    // reset color
    // doors.forEach(d => d.style.color = "yellow");
    // reset class
    doors.forEach((d) => {
        if(!d.classList.contains("available")) {
            d.classList.add("available");
        }
    });
    winning_door = generateRandomInt(3);
}
function resetEvents() {
    document.getElementById("game_wrapper").innerHTML = "";
}
function chooseDoor(d) {
    d.style.color = "blue";
}
function revealDoor(d) {
    d.classList.remove("available");
    changeDoor(d, "reveal")
}
function switchDoor(sw) {
    if (!can_switch)
        return;
    can_switch = false;

    door_a_s = door_b_s;
    if (sw > 0) {
        document.getElementById("door" + switchable_door).style.color = "blue";
        document.getElementById("door" + door_a_s).style.color = "yellow";
        door_a_s = switchable_door;
    }
    win();
    openDoors();
    addGameStep("Neues Tor auswählen um Neue Runde zu starten.")
    setTimeout(() => {
        resetDoors();
        action = true;
        closeDoors();

        if (auto) {autoRun();}
    }, 2000)
}
function win() {
    if (door_a_s == winning_door) {
        if (door_a_s == door_b_s) {
            wins++;
        } else {
            swins++;
        }
        addGameStep("Herzlichen Glückwunsch, du hast gewonnen!")
    } else {
        if (door_a_s == door_b_s) {
            losses++;
        } else {
            slosses++;
        }
        addGameStep("Dieses Mal gewinnt der Moderator...")
    }
    
    srate = 100 / ((swins + slosses) / swins);
    rate = 100 / ((wins + losses) / wins);
    if (swins <= 0)
        srate = 0;
    if (wins <= 0)
        rate = 0;
    if ((swins - slosses) < (wins - losses)) {
        conclusion = "nicht ";
    } else {
        conclusion = "";
    }
    setStats();
}
function setStats() {
    document.getElementById("swins").innerHTML = swins + " mal gewonnen";
    document.getElementById("wins").innerHTML = wins + " mal gewonnen";
    document.getElementById("slosses").innerHTML = slosses + " mal verloren";
    document.getElementById("losses").innerHTML = losses + " mal verloren";
    document.getElementById("srate").innerHTML = String(srate).split(".")[0] + "% Erfolgsquote";
    document.getElementById("rate").innerHTML = String(rate).split(".")[0] + "% Erfolgsquote";
    document.getElementById("conclusion").innerHTML = "Die bevorzugte Vorgehensweise ist bisher, das Tor <b>" + conclusion + "zu wechseln</b>.";
}
function openDoors() {    
    if (winning_door == door_a_s) {
        changeDoor(door_a_s, "win");
    } else {
        changeDoor(door_a_s, "goat");
    }

    let doors = [1, 2, 3];
    doors = doors.filter(d => d != door_a_s);
    doors.forEach((d) => {changeDoor(d, "reveal");});
}
function closeDoors() {
    const doors = [1, 2, 3];
    doors.forEach((d) => { changeDoor(d); });
}
function changeDoor(d, state = "") {
    let door = d;
    if (!isNaN(d)) {
        door = document.getElementById("door" + d);
    }
    switch(state) {
        case "win":
            door.style.backgroundImage = img_win;
            break;
        case "goat":
            door.style.backgroundImage = img_goat;
            break;
        case "reveal":
            door.style.backgroundImage = img_door_dark;
            door.style.color = "black";
            break;
        default:
            door.style.backgroundImage = img_door;
            door.style.color = "yellow";
    }
}