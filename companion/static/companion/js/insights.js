// Inside match.js -> updateUI(data) function:

    // Sync AI Insights (if you have IDs on your HTML elements)
    if (document.getElementById('insightText1')) {
        // You can add an 'insight1' field to your matchTimeline array
        document.getElementById('insightText1').innerText = data.insight1 || "Analyzing match momentum...";
    }