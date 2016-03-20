function hanoiSolve(n, start, stop, end) {
	if (n == 1) {
		console.log("Move " + start + " to " + end + ";");
	} else {
		hanoiSolve(n-1, start, end, stop);
		console.log("Move " + start + " to " + end + ";");
		hanoiSolve(n-1, stop, start, end);
	}
}

var n = 3,
	start = "A",
	stop = "B",
	end = "C";

hanoiSolve(n, start, stop, end);
