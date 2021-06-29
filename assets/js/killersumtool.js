function showResult() {
    updateDisplay();

    var sumStr = document.getElementById("sum").value;

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

    // If there is literally no restriction, we just return
    if (sum == ""
            && length == ""
            && lenMinStr == ""
            && lenMaxStr == ""
            && restriction == "nnnnnnnnn"
            && pattern == "") {
        document.getElementById("result").innerHTML = "";
        return;
    }

    var result = "";
    var solutionCount = 0;
    var digitCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Parsing `sum` and `length`
    var sumList = [];
    try {
        sumList = parseSum(sumStr);
    } catch (e) {
        document.getElementById("error-msg").innerHTML = e;
        document.getElementById("sum-error").style.display = "block";
        return;
    }
    document.getElementById("sum-error").style.display = "none";
    var lengthMin = 0; var lengthMax = 0;

    if (length == "") {
        lengthMin = lenMinStr == "" ? 1 : parseInt(lenMinStr);
        lengthMax = lenMaxStr == "" ? 9 : parseInt(lenMaxStr);
    } else {
        lengthMin = parseInt(length);
        lengthMax = parseInt(length);
    }

    // - Check for candidates
    // - Count digits in candidates
    for (i in sumList) {
        var s = sumList[i];
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

// Outputs array from `start` (inclusive) to `end` (exclusive)
function range(start, end) {
  return new Array(end - start).fill().map((d, i) => i + start);
}

function isNum(c) {
    return !isNaN(parseInt(c, 10))
}

function parseSum(input) {
    // return all numbers from 1 to 45 if no number given
    if (input === "") {
        return range(1, 46);
    }

    var intervals = input.split(",");
    var output = [];
    for (i in intervals) {
        var interval = intervals[i];
        if (interval === "") continue;

        var intervalSplit = interval.split("-");
        if (intervalSplit.length > 2) {
            throw interval + ": At most one dash (-) allowed.";
        }

        const rangeErr = " is out of valid range (1 to 45).";
        const invalidInterval = " is not a valid interval.";

        // Case: single number
        if (intervalSplit.length == 1) {
            var newSum = parseInt(interval);
            if (newSum < 1 || newSum > 45)
                throw "Number " + newSum + rangeErr;
            output.push(newSum);
            continue;
        }

        // Case: interval
        if (intervalSplit[0] === "" || intervalSplit[1] === "")
            throw interval + invalidInterval;
        var newMin = parseInt(intervalSplit[0]);
        if (newMin < 1 || newMin > 45)
            throw "Interval " + interval + rangeErr;
        var newMax = parseInt(intervalSplit[1]);
        if (newMax < 1 || newMax > 45)
            throw "Interval " + interval + rangeErr;

        if (newMin >= newMax)
            throw interval + invalidInterval;

        output = output.concat(range(newMin, newMax + 1));
    }

    return [... new Set(output)].sort(function(a, b) {
        return parseInt(a) - parseInt(b);
    }); // Return only unique numbers
}

function updateDisplay() {
    const disabledBackgroundColor = "#eeeeee";

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

function toggleHelp() {
    helpDiv = document.getElementById("help-text");
    if (helpDiv.style.display === "none") {
        helpDiv.style.display = "block";
    } else {
        helpDiv.style.display = "none";
    }
}
