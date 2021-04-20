function showResult() {
    updateDisplay();

    var sum = document.getElementById("sum").value;
    var sumMinStr = document.getElementById("sum-min").value;
    var sumMaxStr = document.getElementById("sum-max").value;

    var length = document.getElementById("length").value;
    var lenMinStr = document.getElementById("len-min").value;
    var lenMaxStr = document.getElementById("len-max").value;

    var pattern = document.getElementById("regex-field").value;

    var restriction = "";
    for (var i = 1; i <= 9; i++) {
        var radioButtons = document.getElementsByName("restriction" + i);
        for (b in radioButtons) {
            if (radioButtons[b].checked) {
                restriction += radioButtons[b].value;
                break;
            }
        }
    }

    var result = "";
    var solutionCount = 0;
    var digitCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    // If there is literally no restriction, we just return
    if (sum == ""
            && sumMinStr == ""
            && sumMaxStr == ""
            && length == ""
            && lenMinStr == ""
            && lenMaxStr == ""
            && restriction == "nnnnnnnnn"
            && pattern == "") {
        document.getElementById("result").innerHTML = "";
        return;
    }

    // Parsing `sum` and `length`
    var sumMin = 0; var sumMax = 0;
    var lengthMin = 0; var lengthMax = 0;

    if (sum == "") {
        sumMin = sumMinStr == "" ? 1 : parseInt(sumMinStr);
        sumMax = sumMaxStr == "" ? 45 : parseInt(sumMaxStr);
    } else {
        sumMin = parseInt(sum);
        sumMax = parseInt(sum);
    }

    if (length == "") {
        lengthMin = lenMinStr == "" ? 1 : parseInt(lenMinStr);
        lengthMax = lenMaxStr == "" ? 9 : parseInt(lenMaxStr);
    } else {
        lengthMin = parseInt(length);
        lengthMax = parseInt(length);
    }

    // - Check for candidates
    // - Count digits in candidates
    for (var s = sumMin; s <= sumMax; s++) {
        for (var l = lengthMin; l <= lengthMax; l++) {
            if (!(l in sums[s])) continue;

            var candidates = sums[s][l].split(" ");
            for (c in candidates) {
                if (followsRestrictions(candidates[c], restriction, pattern)) {
                    for (ch in candidates[c]) {
                        digitCount[parseInt(candidates[c][ch]) - 1]++;
                    }
                    solutionCount++;
                    result += generateString(candidates[c]);
                }
            }
        }
    }

    // Check for must have and cannot have
    var mustHave = "Must have "; var addMustHave = false;
    var cannotHave = "Cannot have "; var addCannotHave = false;

    for (var i = 0; i < 9; i++) {
        if (digitCount[i] == 0) {
            cannotHave += (i + 1);
            addCannotHave = true;
        } else if (digitCount[i] == solutionCount) {
            mustHave += (i + 1);
            addMustHave = true;
        }
    }

    // Put back into HTML page
    resultElement = document.getElementById("result");

    resultElement.innerHTML = "";
    resultElement.innerHTML += "SOLUTION COUNT: " + solutionCount;

    // the objectively best alignment method ever
    if (solutionCount < 100) resultElement.innerHTML += "&nbsp;";
    if (solutionCount < 10) resultElement.innerHTML += "&nbsp;";
    resultElement.innerHTML += "&nbsp;&nbsp;<br>";

    if (addMustHave)
        resultElement.innerHTML += mustHave + "<br>";
    if (addCannotHave)
        resultElement.innerHTML += cannotHave + "<br>";
    resultElement.innerHTML += result;
}

function followsRestrictions(candidate, restriction, pattern) {
    for (var i = 1; i <= 9; i++) {
        if (restriction[i - 1] == "n") continue;
        if (restriction[i - 1] == "i") {
            if (!candidate.includes(i.toString())) {
                return false;
            }
        }
        if (restriction[i - 1] == "e") {
            if (candidate.includes(i.toString())) {
                return false;
            }
        }
    }

    if (pattern == "") return true;

    var ptt = new RegExp(pattern);
    if (!ptt.test(candidate)) {
        return false;
    }

    return true;
}

function updateDisplay() {
    const disabledBackgroundColor = "#eeeeee";

    var sum = document.getElementById("sum").value;
    if (sum == "") {
        document.getElementById("sum-min").style.backgroundColor = "white";
        document.getElementById("sum-max").style.backgroundColor = "white";
    } else {
        document.getElementById("sum-min").style.backgroundColor = disabledBackgroundColor;
        document.getElementById("sum-max").style.backgroundColor = disabledBackgroundColor;
    }

    var length = document.getElementById("length").value;
    if (length == "") {
        document.getElementById("len-min").style.backgroundColor = "white";
        document.getElementById("len-max").style.backgroundColor = "white";
    } else {
        document.getElementById("len-min").style.backgroundColor = disabledBackgroundColor;
        document.getElementById("len-max").style.backgroundColor = disabledBackgroundColor;
    }
}

function generateString(src) {
    var result = "";
    var total = 0;
    for (c in src) {
        total += parseInt(src[c]);
    }
    result += total.toString();
    if (total < 10) {
        result += " ";
    }
    result += ": ";
    result += src;
    result += "<br>";
    return result;
}
