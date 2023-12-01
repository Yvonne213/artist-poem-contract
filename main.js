
/* CONNECT_AUTOMATICALLY
  true: automatically connect to Web3 Provider on page load.
  false: enable "click to connect" button
*/
const CONNECT_AUTOMATICALLY = true;

if (CONNECT_AUTOMATICALLY) {
  main();
} else {
  // connectButton.onclick = main;
}
async function main() {

  // INITIALIZAING STEPS (SKIP TO THE BOTTOM TO WRITE YOUR OWN CODE)
  // loadingIconConnect.style.display = "block";
  // Check website compatibility
  if (navigator.userAgent.indexOf("Safari") != -1
    && navigator.userAgent.indexOf("Chrome") == -1) {
    alert("Please switch to a browser that supports Web3 (Chrome, Firefox, Brave, Edge, or Opera)");
    // loadingIconConnect.style.display = "none";
    return;
  }
  console.log("Browser is Web3 compatible");

  // Check if MetaMask is installed
  if (!window.ethereum) {
    alert("No Web3 Provider detected, please install MetaMask (https://metamask.io)");
    // loadingIconConnect.style.display = "none";
    return;
  }
  console.log("MetaMask is installed");

  // (REQUIRED) Connect to a Web3 provider (MetaMask in most cases)
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  // If the network changes, refresh the page. (e.g. the user switches from mainnet to goerli)
  provider.on("network", (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      window.location.reload();
    }
  });

  try {
    // (REQUIRED) Request to connect current wallet to the dApp
    await provider.send("eth_requestAccounts", []);
  } catch (error) {
    const errorMessage = "Cannot connect to wallet. There might be an issue with another browser extenstion. Try disabling some browser extensions (other than MetaMask), then attempt to reconnect."
    console.error(errorMessage, error);
    alert(errorMessage);
    // loadingIconConnect.style.display = "none";
    return;
  }
  console.log("Wallet connected");


  // Check if user is signed in to correct network
  const chainId = await provider.getNetwork();
  if (chainId.chainId != 80001) {
    alert("Please switch to the Mumbai in MetaMask. The page will refresh automatically after switching.");
    // loadingIconConnect.style.display = "none";
    return;
  }
  console.log("Connected to Mumbai");

  // AT THIS POINT, THE USER SHOULD BE SUCCESSFULLY CONNECTED TO THE DAPP

  // Update the page to show the user is connected
  // connectionStatus.textContent = "🟢 Connected";

  // connectButton.setAttribute("disabled", "true");
  //...............up is connection issues......................................//

  // MetaMask is our 'provider' in this case
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  // You (whoever is signed into MetaMask) is the 'signer'
  const signer = provider.getSigner();

  // the 'contract' object allows us to call functions from our smart contract
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  // the 'contractWithSigner' object allows us to call smart contract functions that
  // require us to send a transaction (like changing a number on the blockchain)
  const contractWithSigner = contract.connect(signer);

  //......................................connection issues.....................
  // Display the address of the signed-in wallet
  const connectedWalletAddress = await signer.getAddress();
  //connectedWallet.textContent = connectedWalletAddress;
  console.log(`Connected Wallet: ${connectedWalletAddress}`);


  // ADD CODE TO INTERACT WITH THE CONTRACT

}


//-----------------------------------------------------
let generatedWindow; // Variable to store the reference to the opened window
var ws = new WebSocket("ws://192.168.194.100:8765");

ws.onmessage = function (event) {
  // trigger the message update
  console.log("sentence received! do something here!");
  console.log(event.data);
  generatedSentence = event.data;

  // Add the generated sentence to the history
  sentenceHistory.push(generatedSentence);

  // Check if the current page is the third HTML page
  const isThirdHTML = window.location.href.includes("list.html");

  // Update the terminal with the latest sentence (on other pages)
  if (!isThirdHTML) {
    const terminal = document.getElementById("terminal");
    terminal.textContent = generatedSentence;
    terminal.style.color = "red"
  }

  // Update the sentence history list
  const historyList = document.getElementById("history");
  if (historyList) {
    historyList.innerHTML = '';
  }
  sentenceHistory.forEach((sentence, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = sentence;

    historyList.appendChild(listItem);
  });

  historyList.scrollTop = historyList.scrollHeight;
  console.log(historyList.scrollHeight);
};


// ---------------------------------------------------------------------
function sendMessage(content_content) {
  console.log("send out ws message");
  ws.send(content_content);
}

let verbs = ["creates", "steals", "plants", "circles", "plays", "draws", "chases", "watched", "holds", "micmics"];
let nouns = ["circles", "triangles", "brushes", "plants", "human", "animals", "a bird", "soul", "the world", "an apple"];
let times = [
  "every moment",
  "while walking",
  "while eating",
  "while thinking",
  "everyday",
  "every morning",
  "every week",
  "every month",
  "every weekend",
  "every night",
  "every afternoon",
  "in a corner",
  "under the tree",
  "while sitting in the grass"
];

const sentenceHistory = [];
// Function to generate a sentence based on user input
function generateUserSentence() {
  const verbInput = document.getElementById("verbInput").value;
  const nounInput = document.getElementById("nounInput").value;
  const timeInput = document.getElementById("timeInput").value;

  if (verbInput || nounInput || timeInput) {
    const randomVerb = verbInput ? verbInput.split(",")[Math.floor(Math.random() * verbInput.split(",").length)].trim() : verbs[Math.floor(Math.random() * verbs.length)];
    const randomNoun = nounInput ? nounInput.split(",")[Math.floor(Math.random() * nounInput.split(",").length)].trim() : nouns[Math.floor(Math.random() * nouns.length)];
    const randomTime = timeInput ? timeInput.split(",")[Math.floor(Math.random() * timeInput.split(",").length)].trim() : times[Math.floor(Math.random() * times.length)];

    const line1 = `The person who`;
    const line2 = `${randomVerb} ${randomNoun}`;
    const line3 = `${randomTime}`;
    const line4 = `is an artist`;

    const generatedSentence = `${line1}\n${line2}\n${line3}\n${line4}`;

    // Display the generated sentence
    const terminal = document.getElementById("terminal");
    terminal.textContent = generatedSentence;

    // Add the generated sentence to the history
    sentenceHistory.push(generatedSentence);

    // Update the sentence history list
    const historyList = document.getElementById("history");
    historyList.innerHTML = '';
    sentenceHistory.forEach((sentence, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = sentence;

      historyList.appendChild(listItem);

      historyList.scrollTop = historyList.scrollHeight;
      console.log(historyList.scrollHeight);
    });

    // Clear the input fields
    document.getElementById("verbInput").value = '';
    document.getElementById("nounInput").value = '';
    document.getElementById("timeInput").value = '';

  }
  // Generate the sentence
  const generatedSentence = `${line1}\n${line2}\n${line3}\n${line4}`;


  // Open the new window and set its location to new.html with the generated content as a query parameter
  //const newWindow = window.open(`new.html?content=${encodeURIComponent(generatedSentence)}`, '_blank');
  sendMessage(generatedSentence);

}



// Function to generate a random sentence
function generateRandomSentence() {

  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomTime = times[Math.floor(Math.random() * times.length)];

  const line1 = `The person who`;
  const line2 = `${randomVerb} ${randomNoun}`;
  const line3 = `${randomTime}`;
  const line4 = `is an artist`;

  const generatedSentence = `${line1}\n${line2}\n${line3}\n${line4}`;
  // If the window is already opened, refresh its content; otherwise, open a new window

  sendMessage(generatedSentence);

}

const displayButton = document.getElementById("display-button");
// Add click event listener to the "Display Sentence" button
if (displayButton) {
  displayButton.addEventListener("click", generateUserSentence);
  // Add click event listener to the "Generate Sentence" button
  document.getElementById("generate-button").addEventListener("click", generateRandomSentence);
}


//----------typing effect----------------------

const paragraph = document.getElementById('typing-text');
const text = `"Artist Poem" is an Ethereum contract that enables individuals to define the term "Artist". Participants can contribute words they believe are associated with artists, and the contract will securely store their definitions on the Blockchain permanently. 
  In theory, as a sufficient number of definitions are input by the audience, the repetition in the database will lead the artist manifesto to gradually converge toward a midpoint. However, before reaching that point, let's play and create first.`;
let index = 0;

function typeNextCharacter() {
  if (!paragraph) return;
  if (index < text.length) {
    paragraph.appendChild(document.createTextNode(text.charAt(index)));
    index++;
    setTimeout(typeNextCharacter, 50); // Adjust the typing speed (in milliseconds)
  } else {
    // Display the entire text for 5 seconds
    setTimeout(() => {
      // Reset the index and clear the paragraph
      index = 0;
      paragraph.textContent = '';
      // Restart typing
      setTimeout(typeNextCharacter, 1000); // Optional delay before restarting (in milliseconds)
    }, 5000); // 5000 milliseconds (5 seconds)
  }
}

// Initial start
setTimeout(typeNextCharacter, 1000);