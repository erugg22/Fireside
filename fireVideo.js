const fireVids = [
    "https://www.youtube.com/embed/ZY3J3Y_OU0w?controls=0",
    "https://www.youtube.com/embed/N75dB8DCdQs?controls=0",
    "https://www.youtube.com/embed/rVC5tAi8Dgg?controls=0"
];

let index = 0;
document.getElementById("backButton").onclick = function () {
    index--;
    if (index < 0) {
        document.getElementById("backButton").disabled = true;
        index = 0;
    }
    else {
        document.getElementById("fireplace").src = fireVids[index];
    }
    document.getElementById("forwardButton").disabled = false;
}
document.getElementById("forwardButton").onclick = function () {
    index++;
    if (index >= fireVids.length) {
        document.getElementById("forwardButton").disabled = true;
        index = fireVids.length - 1;
    }
    else {
        document.getElementById("fireplace").src = fireVids[index];
    }
    document.getElementById("backButton").disabled = false;
}