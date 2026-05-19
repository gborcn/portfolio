let count = 0;

function increment() {
    count++;
    document.getElementById("count").innerText = count;
}

function save() {
    let savedText = document.getElementById("saved");

    // Save record
    savedText.innerText += count + " | ";

    // Reset counter
    count = 0;
    document.getElementById("count").innerText = count;
}