function getTimeDiff(d) {
    if (d == 0)
        return "-";

    var diff = new Date() - d.getTime();
    var diffInSec = Math.floor(diff / 1000);

    if (diffInSec == 0) {
        return "Now";
    }
    else if (diffInSec < 60) {
        return Math.floor(diffInSec) + ' second(s) ago';
    }
    else if (diffInSec < 60 * 60) {
        return Math.floor(diffInSec / 60) + ' minute(s) ago';
    }
    else if (diffInSec < 60 * 60 * 24) {
        return Math.floor(diffInSec / (60 * 60)) + ' hour(s) ago';
    }
    else if (diffInSec < 60 * 60 * 24 * 30) {
        return Math.floor(diffInSec / (60 * 60 * 24)) + ' day(s) ago';
    }
    else if (diffInSec < 60 * 60 * 24 * 30 * 12) {
        return Math.floor(diffInSec / (60 * 60 * 24 * 30)) + ' month(s) ago';
    }
    else {
        return Math.floor(diffInSec / (60 * 60 * 24 * 30 * 12)) + ' year(s) ago';
    }
}