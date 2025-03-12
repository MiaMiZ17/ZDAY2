// Debug: Confirm script is loading
console.log("script.js loaded");

// Define an array of GitHub raw URLs for the beats
const beatUrls = [
  "https://raw.githubusercontent.com/MiaMiZ17/ZDAY2/main/beats/hard-to-breathe.wav",
  "https://raw.githubusercontent.com/MiaMiZ17/ZDAY2/main/beats/orange-fanta.wav",
  "https://raw.githubusercontent.com/MiaMiZ17/ZDAY2/main/beats/WORKIN-ALL-DAY.wav"
];

// Beat names for display
const beatNames = [
  "Box Truck",
  "Orange Fanta (DQ Collab)",
  "Workin All Day"
];

let currentBeatIndex = 0;

// Detect if sidebar is rendered
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && window.getComputedStyle(sidebar).display === 'none') {
    document.body.classList.remove('with-sidebar');
  }

  const albumCover = document.querySelector('.album-cover');
  const videoPlayer = document.getElementById('main-video');
  const videoSource = document.getElementById('video-source');
  const videoError = document.getElementById('video-error');
  const beatsAudio = document.getElementById('beats-audio');
  const prevBeat = document.getElementById('prev-beat');
  const nextBeat = document.getElementById('next-beat');
  const beatsList = document.getElementById('beats-list');

  // Populate beats list
  beatUrls.forEach((url, index) => {
    const li = document.createElement('li');
    li.textContent = beatNames[index] || `Beat ${index + 1}`;
    li.addEventListener('click', () => playBeat(index));
    beatsList.appendChild(li);
  });

  // Initialize audio player
  if (beatsAudio && beatUrls.length > 0) {
    playBeat(0);
  }

  // Navigation controls
  prevBeat.addEventListener('click', () => {
    playBeat(currentBeatIndex - 1 < 0 ? beatUrls.length - 1 : currentBeatIndex - 1);
  });

  nextBeat.addEventListener('click', () => {
    playBeat(currentBeatIndex + 1 >= beatUrls.length ? 0 : currentBeatIndex + 1);
  });

  if (albumCover && videoPlayer) {
    setTimeout(() => {
      albumCover.classList.add('fade-out');
      setTimeout(() => {
        videoPlayer.classList.add('active');
        videoSource.setAttribute('src', 'dust.mp4');
        videoPlayer.load();
        videoPlayer.play().then(() => {
          console.log("dust.mp4 playing");
          videoPlayer.addEventListener('ended', () => {
            console.log("dust.mp4 ended, switching to roseburn.mp4");
            videoSource.setAttribute('src', 'roseburn.mp4');
            videoPlayer.load();
            videoPlayer.play().then(() => {
              console.log("roseburn.mp4 playing");
              videoPlayer.addEventListener('ended', () => {
                console.log("roseburn.mp4 ended, fading back to album cover");
                videoPlayer.classList.remove('active');
                albumCover.classList.remove('fade-out');
                albumCover.classList.add('fade-in');
                setTimeout(() => {
                  albumCover.classList.remove('fade-in');
                  setTimeout(() => startSequence(), 4000);
                }, 2000);
              }, { once: true });
            }).catch(error => {
              console.error("roseburn.mp4 playback failed:", error);
              videoError.textContent = `Second video failed: ${error.message}.`;
              videoError.style.display = 'block';
            });
          }, { once: true });
        }).catch(error => {
          console.error("dust.mp4 playback failed:", error);
          videoError.textContent = `First video failed: ${error.message}.`;
          videoError.style.display = 'block';
        });
      }, 4000);
    }, 0);
  } else {
    videoError.style.display = 'block';
  }
});

function startSequence() {
  const albumCover = document.querySelector('.album-cover');
  const videoPlayer = document.getElementById('main-video');
  const videoSource = document.getElementById('video-source');
  const videoError = document.getElementById('video-error');

  if (albumCover && videoPlayer) {
    albumCover.classList.add('fade-out');
    setTimeout(() => {
      videoPlayer.classList.add('active');
      videoSource.setAttribute('src', 'dust.mp4');
      videoPlayer.load();
      videoPlayer.play().then(() => {
        console.log("dust.mp4 playing");
        videoPlayer.addEventListener('ended', () => {
          console.log("dust.mp4 ended, switching to roseburn.mp4");
          videoSource.setAttribute('src', 'roseburn.mp4');
          videoPlayer.load();
          videoPlayer.play().then(() => {
            console.log("roseburn.mp4 playing");
            videoPlayer.addEventListener('ended', () => {
              console.log("roseburn.mp4 ended, fading back to album cover");
              videoPlayer.classList.remove('active');
              albumCover.classList.remove('fade-out');
              albumCover.classList.add('fade-in');
              setTimeout(() => {
                albumCover.classList.remove('fade-in');
                setTimeout(() => startSequence(), 4000);
              }, 2000);
            }, { once: true });
          }).catch(error => {
            console.error("roseburn.mp4 playback failed:", error);
            videoError.textContent = `Second video failed: ${error.message}.`;
            videoError.style.display = 'block';
          });
        }, { once: true });
      }).catch(error => {
        console.error("dust.mp4 playback failed:", error);
        videoError.textContent = `First video failed: ${error.message}.`;
        videoError.style.display = 'block';
      });
    }, 4000);
  } else {
    videoError.style.display = 'block';
  }
}

function playBeat(index) {
  const beatsAudio = document.getElementById('beats-audio');
  const beatsList = document.getElementById('beats-list').getElementsByTagName('li');
  if (beatsAudio && index >= 0 && index < beatUrls.length) {
    currentBeatIndex = index;
    beatsAudio.src = beatUrls[index];
    beatsAudio.load();
    beatsAudio.play().catch(error => {
      console.error(`Beat playback failed: ${error.message}`);
      alert("Error loading beat. Check file path or format.");
    });
    for (let li of beatsList) {
      li.classList.remove('active');
    }
    beatsList[index].classList.add('active');
  }
}

// Countdown timer set to end on March 14, 2025, at 12 AM UTC
const countDownDate = new Date(Date.UTC(2025, 2, 14, 0, 0, 0)).getTime();
const x = setInterval(function() {
  const now = new Date().toISOString();
  const nowUTC = new Date(now).getTime();
  const distance = countDownDate - nowUTC;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (distance > 0) {
    document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else {
    document.getElementById("countdown").innerHTML = "ZDAY 2 has arrived!";
    clearInterval(x);
  }
}, 1000);
