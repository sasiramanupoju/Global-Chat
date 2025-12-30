const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const user = localStorage.getItem("chatUser");
if (!user) location.href = "index.html";

/* Presence */
const userRef = db.ref("onlineUsers/" + user);
userRef.set(true);
userRef.onDisconnect().remove();

db.ref("onlineUsers").on("value", snap => {
  document.getElementById("onlineCount").innerText =
    "Online: " + snap.numChildren();
});

/* Messages */
const msgBox = document.getElementById("messages");

db.ref("messages").on("child_added", snap => {
  const m = snap.val();
  const div = document.createElement("div");
  div.className = "msg";
  div.innerHTML = `<b>${m.user}:</b> ${m.text}`;
  msgBox.appendChild(div);
  msgBox.scrollTop = msgBox.scrollHeight;
});

function sendMsg() {
  const text = document.getElementById("msg").value;
  if (!text) return;
  db.ref("messages").push({
    user,
    text,
    time: Date.now()
  });
  document.getElementById("msg").value = "";
}

function clearChat() {
  const code = prompt("Enter passcode");
  if (code === "191199") {
    db.ref("messages").remove();
    msgBox.innerHTML = "";
  } else {
    alert("Wrong passcode");
  }
}
