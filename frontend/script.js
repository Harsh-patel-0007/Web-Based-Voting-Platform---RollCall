const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("connected socket id:", socket.id);
})


socket.on("connect_error", (error) => {
    console.error("disconnected :", error);
})


const createElectionBtn = document.getElementById("createElectionBtn");

if (createElectionBtn) {
    createElectionBtn.addEventListener("click", async () => {
        try {
            console.log("i am working")

            const res = await fetch('http://127.0.0.1:5000/api/auth/check', {
                method: "GET",
                credentials: "include"
            })

            console.log(res.status);

            if (res.ok) {
                window.location.href = "election.html";

            } else if (res.status === 401) {
                window.location.href = "auth.html";

            } else {
                alert("Authentication Check Failed");

            }
        } catch (error) {
            console.log(error)
            alert("cannot connect to the server");
        }

    })
}

//function for signing in
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", signin)
}
async function signin(event) {
    event.preventDefault()
    const email = document.getElementById('loginEmail').value.trim()
    const password = document.getElementById('loginPass').value.trim()

    if (!email || !password) {
        alert("Please fill all required field")
        return
    }
    try {
        const res = await fetch('http://127.0.0.1:5000/api/auth/loginUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (res.status == 201) {
            alert("Login successful!")
            window.location.href = "http://127.0.0.1:5500/frontend/dashboard.html"

        } else if (res.status === 401) {
            alert("Wrong email or password")

        } else if (res.status === 404) {
            alert("No account found with this email")

        } else {
            alert(data.message || "Something went wrong")
        }
    } catch (error) {
        console.error(err)
        alert("Cannot connect to server. Is it running?")
    }
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", register);
}

//function for register
async function register(event) {
    event.preventDefault()
    const email = document.getElementById('regEmail').value.trim()
    const username = document.getElementById('regName').value.trim()
    const password = document.getElementById('regPass').value.trim()
    const confirmpassword = document.getElementById('regPass2').value.trim()

    if (!username || !email || !password) {
        alert("please fill required fields")
        return
    }

    if (password != confirmpassword) {
        alert("Please confirm the password")
        return
    }

    try {
        const res = await fetch('http://127.0.0.1:5000/api/auth/registerUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ username, email, password })
        })

        const data = await res.json()

        if (res.status === 201) {
            alert("account created successfully")
            window.location.href = "http://127.0.0.1:5500/frontend/dashboard.html"

        }
        else if (res.status === 409) {
            alert("user already exist")
        }

        else {
            alert(data.message)
        }

    } catch (error) {
        console.error(error)
        alert("Cannot connect to server. Is it running?")
    }
}

//post election to the database;
const postElection = document.getElementById('electionForm');
if (postElection) {
    postElection.addEventListener("submit", post_election)
}


//create election div
function createElectionDiv(electionId, Title, Description, Open_time, Close_time) {


    const newItem = document.createElement('div');

    newItem.className = 'elections';

    newItem.innerHTML = `
          <div style="background:#ffffff;border:1px solid #d9dfe9;border-left:6px solid #2b44c9;border-radius:14px;padding:20px;max-width:380px;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:#14213d;box-sizing:border-box;">
        

          <!-- electionId -->
          <div style="font-size:13px;color:#5b6678;margin-bottom:10px;">
            Election ID: ${electionId}
          </div>
        

          <!-- Title -->
          <h3 style="margin:0 0 8px 0;font-size:21px;line-height:1.25;font-weight:700;color:#14213d;">
            ${(Title).toUpperCase()}
          </h3>
        

          <!-- Description -->
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.55;color:#5b6678;">
            ${(Description).toUpperCase()}
          </p>
        

          <!-- Open_time / Close_time -->
          <div style="display:flex;border:1px solid #d9dfe9;border-radius:10px;overflow:hidden;">
            <div style="flex:1;padding:10px 12px;">
              <div style="font-size:12px;color:#5b6678;margin-bottom:2px;">Opens</div>
              <div style="font-size:14px;font-weight:600;">${formatDate(Open_time)}</div>
            </div>
            <div style="flex:1;padding:10px 12px;border-left:1px solid #d9dfe9;">
              <div style="font-size:12px;color:#5b6678;margin-bottom:2px;">Closes</div>
              <div style="font-size:14px;font-weight:600;">${formatDate(Close_time)}</div>
            </div>
          </div>
        </div>

            `;


    const grid = document.getElementById("electionGrid");

    grid.appendChild(newItem);



}

//this api runs automatically after a
//get election from the db
async function get_elections() {
    try {
        console.log("hello")
        const res = await fetch('http://127.0.0.1:5000/api/get_election', {
            method: 'GET',
            credentials: "include"
        })
        console.log("hii")
        const data = await res.json();
        console.log("data:", data);

        if (!res.ok) {
            console.error('Failed to load elections:', data.message);

            throw new Error(`HTTP error:${res.status}`)

            return;
        }
        const elections = data.findelections;
        console.log("election-length:", elections.length)

        if (!Array.isArray(elections)) {
            console.log("expected an array:", data);
            return;
        }

        elections.forEach(election => {
            createElectionDiv(election.electionId, election.Title, election.Description, election.Open_time, election.Close_time)
        });

    } catch (error) {
        // console.log("get election me dikkat hai")
        // alert("Cannot connect to server. Is it running?")
    }
}


//function to add or  remove candidate from the list 
function addField() {
    const div = document.createElement('div');

    div.className = 'candidate-add';

    div.innerHTML = `
            <input type="text" class="Candidate-name" placeholder="Candidate name">
            <button type="button" onclick="removeField(this)">Remove</button>`

    document.getElementById('candidateList').appendChild(div);
}

function removeField(button) {
    button.parentElement.remove();
}

async function post_election(event) {
    event.preventDefault();
    try {
        const elTitle = document.getElementById('elTitle');
        const elDesc = document.getElementById('elDesc');
        const elStart = document.getElementById('elStart');
        const elEnd = document.getElementById('elEnd');
        const rollFile = document.getElementById('rollFile');

        const candidates = [...document.querySelectorAll('.Candidate-name')]
            .map(el => el.value.trim())
            .filter(name => name !== '');

        if (candidates.length < 2) {
            alert("Add at least two candidates.");
            return;
        }

        const title = elTitle.value.trim();

        const formdata = new FormData();
        formdata.append('Title', title);
        if (rollFile.files[0]) formdata.append('file', rollFile.files[0]);
        formdata.append('Description', elDesc.value.trim());
        formdata.append('Open_time', elStart.value);
        formdata.append('Close_time', elEnd.value);
        formdata.append('Candidates', JSON.stringify(candidates));

        const res = await fetch('http://127.0.0.1:5000/api/save_election', {
            method: 'POST',
            body: formdata,
            credentials: "include"
        });

        const data = await res.json();
        console.log("data:", data)

        if (res.ok) {

            alert(`Election "${title}" created successfully!`);
            document.getElementById('electionForm').reset();
        } else {
            console.error('Upload failed:', data);
            alert(`Upload failed: ${data.message || 'Unknown error from server'}`);
        }
    } catch (error) {
        console.error(error);
        alert("Cannot connect to server. Is it running?");
    }
}

socket.on("elections-changed", () => {
    console.log("Elections data changed!");

    get_elections();
})


document.addEventListener("DOMContentLoaded", () => {
    get_elections();
})

//function for logout 
const log_out = document.getElementById('logout');
if (log_out) {
    log_out.addEventListener("click", logout);
}

//LOGOUT FUNCTION 
async function logout(event) {
    event.preventDefault();
    try {
        const res = await fetch('http://127.0.0.1:5000/api/auth/logout', {
            method: "POST",
            credentials: "include"
        })

        if (res.ok) {
            console.log("log out successfully")
            alert("You are logged out successfully");
            window.location.href = 'http://127.0.0.1:5500/frontend/index.html'
            return;
        }
        else {
            alert(res.status);
        }

    } catch (error) {
        console.error(error)
        alert("Cannot connect to the server . is it running ?");
    }
}

const logbtn = document.getElementById("navAuthBtn");
async function log_btn() {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/auth/check', {
            method: "GET",
            credentials: "include"
        })

        if (res.ok) {
            logbtn.style.display = "none";;
        }
    } catch (error) {
        alert("cannot get to the server")
    }
}

const dashboard = document.getElementById('dashboard');
if (dashboard) {
    dashboard.addEventListener("click", async () => {
        try {
            console.log("i am dashboard things");
            const res = await fetch('http://127.0.0.1:5000/api/auth/check', {
                method: "GET",
                credentials: "include"
            })

            if (res.ok) {
                window.location.href = "dashboard.html"
            }
            else if (res.status == 401) {
                window.location.href = "auth.html";
            } else {
                alert("Authentiction check failed")
            }
        } catch (error) {
            alert("cannot get to the server")
        }
    })
}

const ballot_btn = document.getElementById('ballot_btn');

if (ballot_btn) {
    ballot_btn.addEventListener("click", post_ballot_details)
}


//POST BALLOT THAT CHECK WHETHER A VOTER IS AUTHORISED OR NOT AND OPEN THE PAGE BALLOT
async function post_ballot_details(event) {
    event.preventDefault();
    console.log("post_ballot_working")
    const electionid = document.getElementById('eid').value.trim();
    const email = document.getElementById('Voter_email').value.trim();

    console.log(email, electionid)

    try {
        const res = await fetch('http://127.0.0.1:5000/api/verify-voter', {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email, electionid
            })
        })

        const data = await res.json();

        if (res.status == 200) {
            alert("you are authorised to vote");

            sessionStorage.setItem("ballot_details", JSON.stringify(data));

            window.location.href = "http://127.0.0.1:5500/frontend/ballot.html"
        }
        else if (res.status === 401) {
            alert("You are unauthorised...kindly login");
        } else {
            alert("something is happend that is not usual");
        }

    } catch (error) {
        console.error(error)
        alert("Cannot connect to server. Is it running?");
    }
}

//RENDER BALLOT TAKES OUT DATA FROM THE DB AND SHOW OMN THE PAGE LIKE A BALLOT WHERE VOTER CASTS THEIR VOTES AND SHOWS STATUS OF THE ELECTIONS
async function renderBallot(data) {

    console.log(data);
    console.log(data.election);
    console.log(data.election?.open_time);
    console.log(data.election?.close_time);
    const container = document.getElementById("ballot-container");
    const candidateContainer = document.getElementById("candidates");
    const actioncontainer = document.getElementById('actions');

    if (!container || !candidateContainer) {
        console.error("Ballot containers not found");
        return;
    }

    const electionid = data.election.electionid;
    const election = data.election;
    const candidates = data.candidates || [];

    console.log(data.election.open_time, data.election.close_time)

    console.log("title:",data.election.Title)

    const now = new Date();
    const open_date = new Date(data.election.open_time)
    const close_date = new Date(data.election.close_time);

    const voterid = data.voter.voterid
    console.log("voterid:",voterid)

    const res = await fetch('http://127.0.0.1:5000/api/verify-votes', {
        method: "POST",
        headers: {
            "Content-Type":
                "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            voterid , electionid
        })
    })

    const result = await res.json();

    console.log(result);

    console.log("result.votes",result.votes[0].voted_at)

    if (res.status == 200) {
        const candidates = document.getElementById("candidates");
        const newItem = document.createElement('div');

        newItem.className = 'status_of_voting';

    newItem.innerHTML = `
    <div style="
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        background: #f0fdf4;
        border: 1px solid #86efac;
        border-radius: 12px;
        text-align: center;
        font-family: Arial, sans-serif;
    ">
        <div style="font-size: 45px; margin-bottom: 15px;">✅</div>

        <h2 style="color: #166534; margin-bottom: 15px;">
            Vote Successfully Submitted!
        </h2>

        <p style="color: #374151; font-size: 15px;">
            You have already cast your vote for this election.
        </p>

        <div style="
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: left;
        ">
            <p><strong>Election ID:</strong> ${data.election.electionid}</p>
            <p><strong>Election Title:</strong> ${(data.election.Title).toUpperCase() }</p>
            <p><strong>Voted At:</strong> 
                <span font-weight: bold;">
                   ${formatDate(result.votes[0].voted_at)}
                </span>
            </p>
            <p><strong>Status:</strong> 
                <span style="color: #16a34a; font-weight: bold;">
                    Vote Recorded
                </span>
            </p>
        </div>

        <p style="color: #4b5563; line-height: 1.6;">
            Thank you for participating in this election.
            Your vote has been successfully recorded.
        </p>

        <div style="
            margin-top: 20px;
            padding: 12px;
            background: #fefce8;
            border-radius: 8px;
            color: #854d0e;
        ">
            ⏳ <strong>Please wait!</strong><br>
            Election results will be published after the election officially closes.
        </div>
    </div>
`;
        candidates.appendChild(newItem);

        document.getElementById("ballot-container").style.display= "none";
        document.getElementById("confirm-box").style.display= "none";
        document.getElementById("poll-vote-btn").style.display= "none";
        document.getElementById("headingballot").style.display= "none";

    } else {

        if (now >= close_date || now <= open_date) {
            container.innerHTML = ` <div class="no-live-election"> <h2>No Live Election</h2> <p>There are currently no elections open for voting.</p> <p>Please check again when an election opens.</p>
            <p>Election timing is between  ${formatDate(election.open_time ?? election.Open_time)} and ${formatDate(election.close_time ?? election.Close_time)}. </p> </div> `; candidates.innerHTML = "";

            document.getElementById('poll-vote-btn').style.display = "none";

            document.getElementById('confirm-box').style.display = "none";


            if (now <= close_date) {
                document.getElementById('ResultBtn').style.display = "none";
            }

            //saving election id into the results btn for the results section
            const ResultBtn = document.getElementById("ResultBtn");
            if (ResultBtn && data.election) {
                ResultBtn.dataset.electionId = data.election.electionid;
            }
            return;
        }
        else {
            if (now >= open_date && now <= close_date) {
                document.getElementById('ResultBtn').style.display = "none";
            }

            container.innerHTML = `
            <div class="election-details">
            <div class="detail-label">Election ID</div>
            <div class="detail-value">
            ${escapeHTML(election.electionId ?? election.electionid ?? "Not available")}
            </div>
            
            <input 
            type="hidden"
            id="electionid"
            value="${escapeHTML(String(election.electionId ?? election.electionid ?? ""))}">
            
            <div class="detail-label">Election Name</div>
            <div class="detail-value election-title">
            ${escapeHTML(election.title ?? election.Title ?? "Untitled Election").toUpperCase()}
            </div>
            
            <div class="detail-label">Description</div>
            <div class="detail-value">
            ${escapeHTML(election.description ?? election.Description ?? "No description").toUpperCase()}
            </div>
            
            <div class="detail-label">Opens At</div>
            <div class="detail-value">
            ${formatDate(election.open_time ?? election.Open_time)}
            </div>
            
            <div class="detail-label">Closes At</div>
            <div class="detail-value">
            ${formatDate(election.close_time ?? election.Close_time)}
            </div>
            </div>
            `;
        }

        candidateContainer.innerHTML = "";

        candidates.forEach(candidate => {
            const id = candidate.candidateId
                ?? candidate.candidateid
                ?? candidate.candidateID;

            const name = candidate.candidateName
                ?? candidate.candidatename
                ?? candidate.Candidatename;

            if (id == null || !name) {
                console.warn("Candidate has missing ID or name:", candidate);
                return;
            }

            const label = document.createElement("label");
            label.className = "candidate-option";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "candidateId";
            radio.value = id;
            radio.required = true;

            const nameSpan = document.createElement("span");
            nameSpan.className = "candidate-name";
            nameSpan.textContent = name;

            label.append(radio, nameSpan);
            candidateContainer.appendChild(label);
        });
    }
}

function escapeHTML(value) {
    const element = document.createElement("span");
    element.textContent = String(value ?? "");
    return element.innerHTML;
}

function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "Not available"
        : date.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
}

// function that lets user to poll the vote
async function poll_vote() {
    // 1. Get the selected election ID
    const electionId = document.getElementById("electionid")?.value;

    // 2. Get the selected candidate
    const selectedCandidate = document.querySelector(
        'input[name="candidateId"]:checked'
    );

    console.log(selectedCandidate);

    if (!electionId) {
        alert("Election ID is missing.");
        return;
    }

    if (!selectedCandidate) {
        alert("Please select a candidate before voting.");
        return;
    }

    // Prevent multiple clicks while submitting
    const voteButton = document.getElementById("poll-vote-btn");

    if (voteButton) {
        voteButton.disabled = true;
    }

    try {
        // 3. Send vote to the backend
        const response = await fetch(
            "http://127.0.0.1:5000/api/submit-vote",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    electionid: electionId,
                    candidateid: selectedCandidate.value
                })
            }
        );

        const result = await response.json();

        // 4. Handle the response
        if (!response.ok || !result.success) {
            alert(result.message || "Unable to submit your vote.");
            return;
        }
        alert("Your vote was submitted successfully!");

        document.getElementById("candidates").style.display = "none";

        document.getElementById("confirm-box").style.display = "none";



        // Optional: prevent further voting from this page
        const ballotForm = document.getElementById("ballot-form");

        if (ballotForm) {
            ballotForm.querySelectorAll("input").forEach(input => {
                input.disabled = true;
            });
        }

        if (voteButton) {
            voteButton.textContent = "Vote Submitted";
        }

    } catch (error) {
        console.error("Vote submission error:", error);
        alert("Unable to connect to the server. Please check your connection.");

    } finally {
        if (voteButton && voteButton.textContent !== "Vote Submitted") {
            voteButton.disabled = false;
        }
    }
}

//GETTING THE RESULT BTN AND PASSING ELECTION ID TO GET THE RESULTS 
const resultBtn = document.getElementById("ResultBtn");
if (resultBtn) {
    resultBtn.addEventListener("click", function () {
        const electionId = this.dataset.electionId;
        console.log("electionid:", electionId);
        if (!electionId) {
            alert("electionid is missing")
            return;
        }
        window.location.href = `results.html?electionId=${encodeURIComponent(electionId)}`
    });
}

//FUNCTION THAT LOAD ELECTION RESULTS WHENEVER THE ELECTION IS FINISHED
async function loadElectionResults() {

    const params = new URLSearchParams(window.location.search);
    const electionId = params.get("electionId");

    if (!electionId) {
        document.getElementById("election-title").textContent =
            "Election ID is missing";
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/get_result/${encodeURIComponent(electionId)}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load results");
        }

        function setText(id, value) {
            const element = document.getElementById(id);

            if (element) {
                element.textContent = value ?? "NA";
            } else {
                console.warn(`HTML element missing: ${id}`)
            }
        }

        const election = data.election;
        const stats = data.statistics;
        const results = data.results;

        document.getElementById("election-title").textContent =
            `${election.title}`;

        setText("close-time", formatDate(election.close_time))
        setText("open-time", formatDate(election.open_time))
        setText("election-description", election.description.toUpperCase())
        setText("election-title", election.title.toUpperCase())
        setText("election-id", election.electionid)
        setText("election-status", "FINISHED");
        setText("eligible-voters", stats.eligibleVoters.toLocaleString())
        setText("votes-cast", stats.votesCast.toLocaleString())
        setText("did-not-vote", stats.didNotVote.toLocaleString())
        setText("turnout", `${stats.turnout}%`);
        setText("total-candidates", results.length)

        // ==================================
        // DISPLAY WINNER AND CANDIDATE RESULTS
        // ==================================

        const winnerName = document.getElementById("winner-name");
        const winnerVotes = document.getElementById("winner-votes");
        const resultsContainer = document.getElementById("candidate-results");

        // Check whether HTML elements exist
        if (!winnerName || !winnerVotes || !resultsContainer) {
            console.error("Winner or candidate result HTML elements not found");
            return;
        }

        // Clear previous results
        resultsContainer.replaceChildren();

        // Sort candidates by votes (highest first)
        const sortedResults = [...results].sort(
            (a, b) => Number(b.total_votes) - Number(a.total_votes)
        );

        // Check election closing time
        const electionClosed =
            new Date() >= new Date(election.close_time);

        // Check if results exist
        if (sortedResults.length === 0) {
            winnerName.textContent = "No candidates found";
            winnerVotes.textContent = "No voting data available";
        } else {

            // Get highest-vote candidate
            const winner = sortedResults[0];

            // Check whether there is a tie
            const isTie =
                sortedResults.length > 1 &&
                Number(sortedResults[0].total_votes) ===
                Number(sortedResults[1].total_votes);

            // Display winner only after election closes
            if (!electionClosed) {
                winnerName.textContent = "Results Pending";
                winnerVotes.textContent =
                    "Winner will be announced after the election closes.";
            }
            else if (isTie) {
                winnerName.textContent = "Election Tied";
                winnerVotes.textContent =
                    "Multiple candidates received the highest votes.";
            }
            else {
                winnerName.textContent = winner.candidatename.toUpperCase();
                winnerVotes.textContent =
                    `${winner.total_votes} votes`;
            }

            // Display candidate-wise results
            sortedResults.forEach(candidate => {

                const row = document.createElement("div");
                row.className = "candidate-result-row";

                const name = document.createElement("span");
                name.className = "candidate-name";
                name.textContent = candidate.candidatename.toUpperCase();

                const votes = document.createElement("span");
                votes.className = "candidate-votes";
                votes.textContent =
                    `${Number(candidate.total_votes)} votes`;

                const percentage = stats.votesCast > 0
                    ? (Number(candidate.total_votes) /
                        Number(stats.votesCast)) * 100
                    : 0;

                const share = document.createElement("span");
                share.className = "candidate-percentage";
                share.textContent = `${percentage.toFixed(1)}%`;

                row.append(name, votes, share);

                resultsContainer.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error loading results:", error);

        document.getElementById("election-title").textContent =
            "Unable to load election results";
    }
}

loadElectionResults();