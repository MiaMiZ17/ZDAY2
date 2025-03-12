// Debug: Confirm script is loading
console.log("script.js loaded");

// Function to detect if the user is on a mobile device
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function to test if a video URL is accessible
async function testVideoUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Failed to access video at ${url}:`, error);
    return false;
  }
}

// Detect mobile and adjust layout
document.addEventListener('DOMContentLoaded', async () => {
  if (window.innerWidth <= 768) {
    document.body.setAttribute('data-mobile', 'true');
  } else {
    document.body.setAttribute('data-mobile', 'false');
  }

  const albumCover = document.querySelector('.album-cover');
  const videoPlayer = document.getElementById('main-video');
  const videoSource = document.getElementById('video-source');
  const videoError = document.getElementById('video-error');
  const playButton = document.getElementById('play-button');

  // Video sequence logic
  if (albumCover && videoPlayer) {
    setTimeout(async () => {
      albumCover.classList.add('fade-out');
      setTimeout(async () => {
        videoPlayer.classList.add('active');
        if (isMobile()) {
          const mobileVideoUrl = 'videos/Mobile-Vid-Promo.mp4';
          const isAccessible = await testVideoUrl(mobileVideoUrl);
          if (isAccessible) {
            videoSource.setAttribute('src', mobileVideoUrl);
            videoPlayer.load();
            playButton.style.display = 'block'; // Show play button on mobile
            playButton.addEventListener('click', () => {
              videoPlayer.play().then(() => {
                console.log("Mobile video playing");
                playButton.style.display = 'none'; // Hide button after play
              }).catch(error => {
                console.error("Mobile video playback failed:", error);
                videoError.textContent = `Mobile video failed: ${error.message}.`;
                videoError.style.display = 'block';
              });
            });
            // Attempt autoplay
            videoPlayer.play().catch(error => {
              console.error("Mobile video autoplay failed:", error);
              // Play button is already shown, so no further action needed
            });
          } else {
            videoError.textContent = `Mobile video not found at ${mobileVideoUrl}. Please check the file path.`;
            videoError.style.display = 'block';
          }
        } else {
          // Load desktop video sequence
          const firstVideoUrl = 'videos/dust.mp4';
          const secondVideoUrl = 'videos/roseburn.mp4';
          const firstAccessible = await testVideoUrl(firstVideoUrl);
          const secondAccessible = await testVideoUrl(secondVideoUrl);

          if (!firstAccessible || !secondAccessible) {
            videoError.textContent = `Desktop videos not found. Check paths: ${firstVideoUrl}, ${secondVideoUrl}.`;
            videoError.style.display = 'block';
            return;
          }

          videoSource.setAttribute('src', firstVideoUrl);
          videoPlayer.load();
          playButton.style.display = 'block'; // Show play button on desktop too
          playButton.addEventListener('click', () => {
            videoPlayer.play().then(() => {
              console.log("dust.mp4 playing");
              playButton.style.display = 'none'; // Hide button after play
              videoPlayer.addEventListener('ended', () => {
                console.log("dust.mp4 ended, switching to roseburn.mp4");
                videoSource.setAttribute('src', secondVideoUrl);
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
          });
          // Attempt autoplay
          videoPlayer.play().catch(error => {
            console.error("Desktop video autoplay failed:", error);
            // Play button is already shown, so no further action needed
          });
        }
      }, 4000);
    }, 0);
  } else {
    videoError.style.display = 'block';
  }
});

// Function to start the video sequence
function startSequence() {
  const albumCover = document.querySelector('.album-cover');
  const videoPlayer = document.getElementById('main-video');
  const videoSource = document.getElementById('video-source');
  const videoError = document.getElementById('video-error');
  const playButton = document.getElementById('play-button');

  if (albumCover && videoPlayer) {
    albumCover.classList.add('fade-out');
    setTimeout(async () => {
      videoPlayer.classList.add('active');
      if (isMobile()) {
        const mobileVideoUrl = 'videos/Mobile-Vid-Promo.mp4';
        const isAccessible = await testVideoUrl(mobileVideoUrl);
        if (isAccessible) {
          videoSource.setAttribute('src', mobileVideoUrl);
          videoPlayer.load();
          playButton.style.display = 'block'; // Show play button on mobile
          playButton.addEventListener('click', () => {
            videoPlayer.play().then(() => {
              console.log("Mobile video playing");
              playButton.style.display = 'none'; // Hide button after play
            }).catch(error => {
              console.error("Mobile video playback failed:", error);
              videoError.textContent = `Mobile video failed: ${error.message}.`;
              videoError.style.display = 'block';
            });
          });
          // Attempt autoplay
          videoPlayer.play().catch(error => {
            console.error("Mobile video autoplay failed:", error);
            // Play button is already shown, so no further action needed
          });
        } else {
          videoError.textContent = `Mobile video not found at ${mobileVideoUrl}. Please check the file path.`;
          videoError.style.display = 'block';
        }
      } else {
        const firstVideoUrl = 'videos/dust.mp4';
        const secondVideoUrl = 'videos/roseburn.mp4';
        const firstAccessible = await testVideoUrl(firstVideoUrl);
        const secondAccessible = await testVideoUrl(secondVideoUrl);

        if (!firstAccessible || !secondAccessible) {
          videoError.textContent = `Desktop videos not found. Check paths: ${firstVideoUrl}, ${secondVideoUrl}.`;
          videoError.style.display = 'block';
          return;
        }

        videoSource.setAttribute('src', firstVideoUrl);
        videoPlayer.load();
        playButton.style.display = 'block'; // Show play button on desktop
        playButton.addEventListener('click', () => {
          videoPlayer.play().then(() => {
            console.log("dust.mp4 playing");
            playButton.style.display = 'none'; // Hide button after play
            videoPlayer.addEventListener('ended', () => {
              console.log("dust.mp4 ended, switching to roseburn.mp4");
              videoSource.setAttribute('src', secondVideoUrl);
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
        });
        // Attempt autoplay
        videoPlayer.play().catch(error => {
          console.error("Desktop video autoplay failed:", error);
          // Play button is already shown, so no further action needed
        });
      }
    }, 4000);
  } else {
    videoError.style.display = 'block';
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
