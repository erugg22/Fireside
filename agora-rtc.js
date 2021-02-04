let handlefail = function (err) {
    console.log(err);
  };
  
  let remoteContainer1 = document.getElementById("remoteStream1");
  let remoteContainer2 = document.getElementById("remoteStream2");
  let remoteContainer3 = document.getElementById("remoteStream3");
  let remoteContainer4 = document.getElementById("remoteStream4");
  let usersContainer1 = document.getElementById("users1");
  let usersContainer2 = document.getElementById("users2");

  let userCount = 1;
  let appId = "2b855115869e43a19e120d2e08eb9734";
  let globalStream;
  let audioMuted = false;
  let videoMuted = false;

  let globalUsername;

  let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264",
  });

  client.init(
    appId,
    () => console.log("AgoraRTC Client initialized"),
    handlefail
  );

  function removeMyVideoStream(){
    globalStream.stop();
  }

  function removeVideoStream(evt){
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
  }

  function addVideoStream(streamId) {
    let streamdiv = document.createElement("div");
    streamdiv.id = streamId;
    streamdiv.style.transform = "rotateY(180deg)";
    streamdiv.style.width = "260px";
    streamdiv.style.height = "200px";
    streamdiv.style.borderRadius = "5px";
    streamdiv.style.border = "2px solid rgb(153, 31, 0)";
    streamdiv.style.display = "inline-block";

    userCount++;
    if(userCount < 4) {
        streamdiv.style.marginLeft = "80px";
        remoteContainer1.appendChild(streamdiv);
    }
    else if(userCount == 4) {
        remoteContainer2.appendChild(streamdiv);
    }
    else if(userCount == 5) {
        remoteContainer3.appendChild(streamdiv);
    }
    else if(userCount >= 6) {
        if(userCount == 6){
            streamdiv.style.marginLeft = "80px";
        }
        else if(userCount == 7 || userCount == 8){
            streamdiv.style.marginLeft = "80px";
        }
        remoteContainer4.appendChild(streamdiv);
    }
  }
  
  function addParticipant(participant) {
    let newParticipant = document.createElement("div");
    newParticipant.id = participant;
    newParticipant.innerHTML = participant;
    newParticipant.style.display = "block";
    newParticipant.style.marginLeft = "1vw";
    if(userCount < 4){
      usersContainer1.appendChild(newParticipant);
    }
    else if(userCount >= 4){
      usersContainer2.appendChild(newParticipant);
    }
  }

  function removeParticipant(participant) {
    let pDiv = document.getElementById(participant);
    usersContainer.removeChild(pDiv);
  }

  document.getElementById("leaveButton").onclick = function() {
    client.leave(function() {
      console.log("left")},
      handlefail)
    removeMyVideoStream();
    removeParticipant(globalUsername);
  }
  
  document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let userName = document.getElementById("username").value;

    client.join(
      null,
      channelName,
      userName,
      () => {
        var localStream = AgoraRTC.createStream({
          video: true,
          audio: true,
        });
        localStream.init(function () {
          localStream.play("SelfStream");
          client.publish(localStream);
        });
        console.log(`App id: ${appId}\nChannel id: ${channelName}`);
        addParticipant(userName);
        globalStream = localStream;
        globalUsername=userName;
      },
      handlefail
    );
  
    client.on("stream-added", function (evt) {
      client.subscribe(evt.stream, handlefail);
    });
  
    client.on("stream-subscribed", function (evt) {
      console.log("I was called");
      let stream = evt.stream;
      addVideoStream(stream.getId());
      stream.play(stream.getId());
      addParticipant(stream.getId());
    });

    client.on("peer-leave", function (evt) {
      console.log("Peer has left");
      removeVideoStream(evt);
      removeParticipant(evt.stream.getId());
    })
  };

document.getElementById("micButton").onclick = function () {
  let imageName = document.getElementById("micButton").src;

  if(audioMuted){
    globalStream.unmuteAudio();
    audioMuted = false;
    document.getElementById("micButton").src="assets/micOn.png";
  }
  else{
    globalStream.muteAudio();
    audioMuted = true;
    document.getElementById("micButton").src="assets/micOff.png";
  }
};

document.getElementById("videoButton").onclick = function(){
  if(!videoMuted){
      globalStream.muteVideo();
      videoMuted = true;
      document.getElementById("videoButton").src = "assets/videoOff.png";
  }else if(videoMuted){
      globalStream.unmuteVideo();
      videoMuted = false;
      document.getElementById("videoButton").src = "assets/videoOn.png";
  }
}

