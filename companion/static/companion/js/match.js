console.log("Crick AI match.js loaded");

// ================================================================
// 0. GLOBAL VARIABLES
// ================================================================

let youtubePlayer = null;
let timeTrackingInterval = null;
let playerInitialized = false;
let lastActiveIndex = -1;

const VIDEO_ID = "9VV-JbsIknQ";


// ================================================================
// 1. MATCH TIMELINE
// All times are seconds into the YouTube highlights video.
// ================================================================

const matchTimeline = [

    // ---------------- MI INNINGS ----------------

    {
        startTime: 0,
        isBatting: "MI",
        miScore: "0/0",
        miOvers: "(0.0 Ov)",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "1st",
        overRuns: "-",
        batter1Name: "Lendl Simmons",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Parthiv Patel",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Jaydev Unadkat",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>MI innings:</strong> Mumbai Indians begin their innings.",
        insight2: "<strong>Match context:</strong> IPL 2017 Final at Wankhede Stadium.",
        keyMoments: []
    },

    {
        startTime: 57,
        isBatting: "MI",
        miScore: "8/1",
        miOvers: "-",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "Early overs",
        overRuns: "-",
        batter1Name: "Lendl Simmons",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Parthiv Patel",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Jaydev Unadkat",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Early breakthrough:</strong> MI are 8/1.",
        insight2: "<strong>Match situation:</strong> Pune have made an early impact.",
        keyMoments: []
    },

    {
        startTime: 62,
        isBatting: "MI",
        miScore: "16/2",
        miOvers: "-",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "Early overs",
        overRuns: "-",
        batter1Name: "Ambati Rayudu",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Rohit Sharma",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Jaydev Unadkat",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Pressure:</strong> MI are 16/2.",
        insight2: "<strong>Situation:</strong> Rohit Sharma comes to the crease.",
        keyMoments: []
    },

    {
        startTime: 110,
        isBatting: "MI",
        miScore: "41/3",
        miOvers: "(7.2 Ov)",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "8th",
        overRuns: "-",
        batter1Name: "Rohit Sharma",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Krunal Pandya",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "RPS bowling attack",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Wicket:</strong> Ambati Rayudu is run out at 7.2 overs.",
        insight2: "<strong>Situation:</strong> MI are 41/3.",
        keyMoments: [
            {
                timeLabel: "7.2 Ov",
                title: "Ambati Rayudu run out",
                desc: "Rayudu departs after scoring 12.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 148,
        isBatting: "MI",
        miScore: "56/4",
        miOvers: "(10.1 Ov)",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "11th",
        overRuns: "-",
        batter1Name: "Krunal Pandya",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Kieron Pollard",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Adam Zampa",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Wicket:</strong> Rohit Sharma is dismissed for 24.",
        insight2: "<strong>Recovery needed:</strong> Krunal Pandya and Pollard must rebuild.",
        keyMoments: [
            {
                timeLabel: "10.1 Ov",
                title: "Rohit Sharma dismissed",
                desc: "Rohit is caught by Shardul Thakur off Adam Zampa.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 176,
        isBatting: "MI",
        miScore: "65/5",
        miOvers: "(11.0 Ov)",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "11th",
        overRuns: "-",
        batter1Name: "Krunal Pandya",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Hardik Pandya",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Adam Zampa",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Wicket:</strong> Kieron Pollard is dismissed for 7.",
        insight2: "<strong>Situation:</strong> MI are 65/5.",
        keyMoments: [
            {
                timeLabel: "11.0 Ov",
                title: "Pollard dismissed",
                desc: "Pollard falls for 7.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 196,
        isBatting: "MI",
        miScore: "78/6",
        miOvers: "(13.2 Ov)",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "14th",
        overRuns: "-",
        batter1Name: "Krunal Pandya",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Karn Sharma",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "RPS bowling attack",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Wicket:</strong> Hardik Pandya is dismissed for 10.",
        insight2: "<strong>Situation:</strong> MI are 78/6.",
        keyMoments: [
            {
                timeLabel: "13.2 Ov",
                title: "Hardik Pandya dismissed",
                desc: "Hardik departs after scoring 10.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 216,
        isBatting: "MI",
        miScore: "79/7",
        miOvers: "(14.1 Ov)",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "15th",
        overRuns: "-",
        batter1Name: "Krunal Pandya",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Mitchell Johnson",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "RPS bowling attack",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Wicket:</strong> Karn Sharma is run out.",
        insight2: "<strong>Situation:</strong> MI are 79/7. Krunal continues the recovery.",
        keyMoments: [
            {
                timeLabel: "14.1 Ov",
                title: "Karn Sharma run out",
                desc: "Karn Sharma departs for 1.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 276,
        isBatting: "MI",
        miScore: "129/8",
        miOvers: "(20.0 Ov)",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "20th",
        overRuns: "-",
        batter1Name: "Mitchell Johnson",
        batter1Stats: "13 (14)",
        batter1SR: "SR: 92.86",
        batter2Name: "Lasith Malinga",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Dan Christian",
        bowlerStats: "4.0 - 0 - 34 - 2",
        bowlerEcon: "ECO: 8.50",
        insight1: "<strong>Innings complete:</strong> MI finish at 129/8.",
        insight2: "<strong>Key contribution:</strong> Krunal Pandya scores 47 off 38 balls.",
        keyMoments: [
            {
                timeLabel: "19.6 Ov",
                title: "MI innings ends",
                desc: "Mumbai Indians finish on 129/8 in 20 overs.",
                tag: "Innings End",
                tagClass: "six"
            }
        ]
    },


    // ---------------- RPS INNINGS ----------------

    {
        startTime: 316,
        isBatting: "RPS",
        miScore: "129/8",
        miOvers: "(20.0 Ov)",
        rpsScore: "0/0",
        rpsOvers: "(0.0 Ov)",
        currentOverNum: "1st",
        overRuns: "-",
        batter1Name: "Ajinkya Rahane",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Rahul Tripathi",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Mitchell Johnson",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Chase begins:</strong> RPS need 130 runs to win.",
        insight2: "<strong>Target:</strong> Mumbai Indians have set 130.",
        keyMoments: []
    },

    {
        startTime: 338,
        isBatting: "RPS",
        miScore: "129/8",
        miOvers: "(20.0 Ov)",
        rpsScore: "17/1",
        rpsOvers: "(2.2 Ov)",
        currentOverNum: "3rd",
        overRuns: "-",
        batter1Name: "Ajinkya Rahane",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Steven Smith",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Jasprit Bumrah",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Wicket:</strong> Rahul Tripathi is dismissed LBW by Bumrah.",
        insight2: "<strong>Situation:</strong> RPS are 17/1 after 2.2 overs.",
        keyMoments: [
            {
                timeLabel: "2.2 Ov",
                title: "Rahul Tripathi dismissed",
                desc: "Bumrah strikes early in the chase.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 409,
        isBatting: "RPS",
        miScore: "129/8",
        miOvers: "(20.0 Ov)",
        rpsScore: "71/2",
        rpsOvers: "(11.5 Ov)",
        currentOverNum: "12th",
        overRuns: "-",
        batter1Name: "Steven Smith",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "MS Dhoni",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Mitchell Johnson",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Wicket:</strong> Ajinkya Rahane is dismissed for 44.",
        insight2: "<strong>Situation:</strong> RPS are 71/2 after 11.5 overs.",
        keyMoments: [
            {
                timeLabel: "11.5 Ov",
                title: "Ajinkya Rahane dismissed",
                desc: "Rahane is caught by Pollard off Mitchell Johnson.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 432,
        isBatting: "RPS",
        miScore: "129/8",
        miOvers: "(20.0 Ov)",
        rpsScore: "98/3",
        rpsOvers: "(16.2 Ov)",
        currentOverNum: "17th",
        overRuns: "-",
        batter1Name: "Steven Smith",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Manoj Tiwary",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Jasprit Bumrah",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Wicket:</strong> MS Dhoni is dismissed for 10.",
        insight2: "<strong>Situation:</strong> RPS are 98/3 after 16.2 overs.",
        keyMoments: [
            {
                timeLabel: "16.2 Ov",
                title: "MS Dhoni dismissed",
                desc: "Dhoni is caught by Parthiv Patel off Bumrah.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 490,
        isBatting: "RPS",
        miScore: "129/8",
        miOvers: "(20.0 Ov)",
        rpsScore: "119/3",
        rpsOvers: "-",
        currentOverNum: "Late overs",
        overRuns: "-",
        batter1Name: "Steven Smith",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Manoj Tiwary",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "MI bowling attack",
        bowlerStats: "-",
        bowlerEcon: "-",
        insight1: "<strong>Chase:</strong> RPS are 119/3 at this video checkpoint.",
        insight2: "<strong>Target:</strong> RPS need 11 runs to win.",
        keyMoments: []
    },

    {
        startTime: 534,
        isBatting: "RPS",
        miScore: "129/8",
        miOvers: "(20.0 Ov)",
        rpsScore: "123/5",
        rpsOvers: "(19.3 Ov)",
        currentOverNum: "20th",
        overRuns: "-",
        batter1Name: "Daniel Christian",
        batter1Stats: "-",
        batter1SR: "-",
        batter2Name: "Washington Sundar",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Mitchell Johnson",
        bowlerStats: "3.3 - 0 - 25 - 3",
        bowlerEcon: "ECO: 7.14",
        insight1: "<strong>Final-over drama:</strong> Manoj Tiwary and Steven Smith fall in consecutive balls.",
        insight2: "<strong>Situation:</strong> RPS are 123/5 and need 7 runs from 3 balls.",
        keyMoments: [
            {
                timeLabel: "19.2 Ov",
                title: "Manoj Tiwary dismissed",
                desc: "Tiwary is caught by Pollard off Johnson.",
                tag: "Wicket",
                tagClass: "wicket"
            },
            {
                timeLabel: "19.3 Ov",
                title: "Steven Smith dismissed",
                desc: "Smith is caught by Rayudu off Johnson for 51.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 568,
        isBatting: "RPS",
        miScore: "129/8",
        miOvers: "(20.0 Ov)",
        rpsScore: "128/6",
        rpsOvers: "(20.0 Ov)",
        currentOverNum: "20th",
        overRuns: "-",
        batter1Name: "Washington Sundar",
        batter1Stats: "0 (1)",
        batter1SR: "SR: 0.00",
        batter2Name: "Not out",
        batter2Stats: "-",
        batter2SR: "-",
        bowlerName: "Mitchell Johnson",
        bowlerStats: "4.0 - 0 - 26 - 3",
        bowlerEcon: "ECO: 6.50",
        insight1: "<strong>Innings complete:</strong> RPS finish on 128/6.",
        insight2: "<strong>Result pending:</strong> MI are ahead by one run.",
        keyMoments: [
            {
                timeLabel: "20.0 Ov",
                title: "Daniel Christian run out",
                desc: "RPS finish their innings at 128/6.",
                tag: "Wicket",
                tagClass: "wicket"
            }
        ]
    },

    {
        startTime: 583,
        isBatting: "RPS",
        miScore: "129/8",
        miOvers: "(20.0 Ov)",
        rpsScore: "128/6",
        rpsOvers: "(20.0 Ov)",
        currentOverNum: "Match complete",
        overRuns: "-",
        batter1Name: "Mumbai Indians",
        batter1Stats: "Champions",
        batter1SR: "",
        batter2Name: "Rising Pune Supergiant",
        batter2Stats: "128/6",
        batter2SR: "",
        bowlerName: "Final result",
        bowlerStats: "MI won by 1 run",
        bowlerEcon: "",
        insight1: "<strong>Champions:</strong> Mumbai Indians win the 2017 IPL Final by 1 run.",
        insight2: "<strong>Player of the Match:</strong> Krunal Pandya — 47 off 38 balls.",
        keyMoments: [
            {
                timeLabel: "9:43",
                title: "Mumbai Indians win by 1 run!",
                desc: "RPS finish on 128/6 while MI defend 129.",
                tag: "Match End",
                tagClass: "six"
            }
        ]
    }
];


// ================================================================
// 2. YOUTUBE PLAYER INITIALIZATION
// ================================================================

function initializeYouTubePlayer() {

    // Prevent multiple player instances.
    if (playerInitialized) {
        return;
    }

    // Wait until the YouTube API is available.
    if (!window.YT || !window.YT.Player) {
        return;
    }

    // Wait until the video container exists.
    const playerContainer = document.getElementById("matchVideo");

    if (!playerContainer) {
        console.warn("Waiting for matchVideo container...");
        return;
    }

    // Mark initialized only when the player can be created.
    playerInitialized = true;

    youtubePlayer = new YT.Player("matchVideo", {
        width: "100%",
        height: "100%",
        videoId: VIDEO_ID,

        playerVars: {
            autoplay: 0,
            mute: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: window.location.origin
        },

        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
        }
    });
}


// YouTube calls this when its iframe API has loaded.
window.onYouTubeIframeAPIReady = function () {
    initializeYouTubePlayer();
};


// Initialize when the page DOM is ready.
function setupYouTubePlayer() {

    if (window.YT && window.YT.Player) {
        initializeYouTubePlayer();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupYouTubePlayer);
} else {
    setupYouTubePlayer();
}


// ================================================================
// 3. PLAYER EVENT HANDLERS
// ================================================================

function onPlayerReady(event) {

    youtubePlayer = event.target;

    console.log("YouTube player ready!");

    console.log(
        "Actual video duration:",
        youtubePlayer.getDuration(),
        "seconds"
    );

    // Display the correct initial state.
    lastActiveIndex = -1;
    updateMatchData();

    // Handle sync toggle.
    const syncToggle = document.getElementById("syncToggle");

    if (syncToggle) {

        syncToggle.addEventListener("change", function () {

            if (this.checked) {

                // Force dashboard refresh when sync is enabled.
                lastActiveIndex = -1;
                updateMatchData();

            }
        });
    }

    // Start tracking even if the video is paused.
    // This allows manual seeking while paused.
    startMatchTracking();
}


function onPlayerStateChange(event) {

    console.log("Player state changed:", event.data);

    // Immediately update after play, pause, seek or end.
    updateMatchData();

    // Keep tracking active even when paused.
    // This is necessary to detect manual seeking.
    startMatchTracking();
}


function onPlayerError(event) {
    console.error("YouTube player error:", event.data);
}


// ================================================================
// 4. VIDEO TIME TRACKING
// ================================================================

function startMatchTracking() {

    if (!timeTrackingInterval) {

        // Check video position every 250 milliseconds.
        timeTrackingInterval = setInterval(function () {
            updateMatchData();
        }, 250);

    }
}


function stopMatchTracking() {

    if (timeTrackingInterval) {

        clearInterval(timeTrackingInterval);
        timeTrackingInterval = null;

    }
}


// ================================================================
// 5. VIDEO-TO-MATCH SYNCHRONIZATION
// ================================================================

function updateMatchData() {

    if (
        !youtubePlayer ||
        typeof youtubePlayer.getCurrentTime !== "function"
    ) {
        return;
    }

    const syncToggle = document.getElementById("syncToggle");

    // Do not update the dashboard when sync is disabled.
    if (syncToggle && !syncToggle.checked) {
        return;
    }

    const currentTime = youtubePlayer.getCurrentTime();

    if (!Number.isFinite(currentTime)) {
        return;
    }

    let currentIndex = 0;

    // Find the latest timeline checkpoint reached by the video.
    for (let i = 0; i < matchTimeline.length; i++) {

        if (currentTime >= matchTimeline[i].startTime) {
            currentIndex = i;
        } else {
            break;
        }

    }

    // Update only when the checkpoint changes.
    // This also works when the user seeks backwards.
    if (currentIndex !== lastActiveIndex) {

        lastActiveIndex = currentIndex;

        console.log(
            "Video time:",
            currentTime.toFixed(1),
            "seconds | Timeline checkpoint:",
            matchTimeline[currentIndex].startTime,
            "seconds"
        );

        updateUI(matchTimeline[currentIndex]);

    }
}


// ================================================================
// 6. SAFE DOM UPDATE HELPERS
// ================================================================

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent =
            value === undefined || value === null || value === ""
                ? "-"
                : value;

    }
}


function setHTML(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.innerHTML = value || "";
    }

}


// ================================================================
// 7. UPDATE DASHBOARD
// ================================================================

function updateUI(data) {

    if (!data) return;


    // ------------------------------------------------------------
    // SCOREBOARD
    // ------------------------------------------------------------

    setText("indScore", data.miScore);
    setText("indOvers", data.miOvers);

    setText("rpsScore", data.rpsScore);
    setText("rpsOvers", data.rpsOvers);


    // ------------------------------------------------------------
    // ACTIVE TEAM HIGHLIGHT
    // ------------------------------------------------------------

    const miEl = document.getElementById("indScore");
    const rpsEl = document.getElementById("rpsScore");

    if (miEl && rpsEl) {

        miEl.style.color =
            data.isBatting === "MI"
                ? "#60a5fa"
                : "var(--text-secondary)";

        rpsEl.style.color =
            data.isBatting === "RPS"
                ? "#c084fc"
                : "var(--text-secondary)";

    }


    // ------------------------------------------------------------
    // CURRENT OVER
    // ------------------------------------------------------------

    setText("currentOverNum", data.currentOverNum);
    setText("overRuns", data.overRuns);


    // ------------------------------------------------------------
    // BATTERS
    // ------------------------------------------------------------

    setText("batter1Name", data.batter1Name);
    setText("batter1Stats", data.batter1Stats);
    setText("batter1SR", data.batter1SR);

    setText("batter2Name", data.batter2Name);
    setText("batter2Stats", data.batter2Stats);
    setText("batter2SR", data.batter2SR);


    // ------------------------------------------------------------
    // BOWLER
    // ------------------------------------------------------------

    setText("bowlerName", data.bowlerName);
    setText("bowlerStats", data.bowlerStats);
    setText("bowlerEcon", data.bowlerEcon);


    // ------------------------------------------------------------
    // INSIGHTS
    // ------------------------------------------------------------

    setHTML("insightText1", data.insight1);
    setHTML("insightText2", data.insight2);


    // ------------------------------------------------------------
    // KEY MOMENTS
    // ------------------------------------------------------------

    const timeline = document.getElementById("momentsTimeline");

    if (timeline) {

        timeline.innerHTML = "";

        if (!data.keyMoments || data.keyMoments.length === 0) {

            const emptyMessage = document.createElement("p");

            emptyMessage.style.color = "var(--text-secondary)";
            emptyMessage.style.fontSize = "0.85rem";
            emptyMessage.style.textAlign = "center";
            emptyMessage.style.padding = "1rem";

            emptyMessage.textContent =
                "No major events at this checkpoint.";

            timeline.appendChild(emptyMessage);

        } else {

            data.keyMoments.forEach(function (moment) {

                const item = document.createElement("div");
                item.className = "moment-item";


                // Moment time
                const time = document.createElement("span");
                time.className = "m-time";
                time.textContent = moment.timeLabel;


                // Moment content
                const content = document.createElement("div");
                content.className = "m-content";


                // Moment title
                const title = document.createElement("h5");
                title.textContent = moment.title;


                // Moment description
                const description = document.createElement("p");
                description.textContent = moment.desc;


                content.appendChild(title);
                content.appendChild(description);


                // Moment tag
                const tag = document.createElement("span");

                tag.className = `m-tag ${moment.tagClass || ""}`;
                tag.textContent = moment.tag || "";


                // Add everything to the moment item
                item.appendChild(time);
                item.appendChild(content);
                item.appendChild(tag);


                // Add moment to timeline
                timeline.appendChild(item);

            });

        }

    }

}


// ================================================================
// 8. INITIAL DASHBOARD STATE
// ================================================================

function initializeDashboard() {

    if (matchTimeline.length > 0) {

        lastActiveIndex = 0;

        updateUI(matchTimeline[0]);

        console.log("Dashboard initialized.");

    }

}


// Initialize dashboard when DOM is ready.
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeDashboard
    );

} else {

    initializeDashboard();

}