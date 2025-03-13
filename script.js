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

  // Audio player setup
  const audioPlayer = document.getElementById('beats-audio');
  const audioSource = document.getElementById('beats-source');
  const playButtonAudio = document.getElementById('play-beat');
  const prevButton = document.getElementById('prev-beat');
  const nextButton = document.getElementById('next-beat');
  const beatsList = document.getElementById('beats-list');
  let currentBeatIndex = 0;
  const beatSources = [
    'beats/WORKIN-ALL-DAY.wav',
    'beats/hard-to-breathe.wav',
    'beats/orange-fanta.wav'
  ];

  function loadBeat(index) {
    if (index >= 0 && index < beatSources.length) {
      audioSource.setAttribute('src', beatSources[index]);
      audioPlayer.load();
      beatsList.querySelectorAll('li').forEach((li, i) => {
        li.classList.toggle('active', i === index);
      });
    }
  }

  playButtonAudio.addEventListener('click', () => {
    if (audioPlayer.paused) {
      // Pause video if playing to avoid interference
      if (videoPlayer && !videoPlayer.paused) {
        videoPlayer.pause();
      }
      audioPlayer.play().catch(error => console.error('Audio play failed:', error));
      playButtonAudio.textContent = 'Pause';
    } else {
      audioPlayer.pause();
      playButtonAudio.textContent = 'Play';
    }
  });

  prevButton.addEventListener('click', () => {
    currentBeatIndex = (currentBeatIndex - 1 + beatSources.length) % beatSources.length;
    loadBeat(currentBeatIndex);
    if (!audioPlayer.paused) {
      audioPlayer.play().catch(error => console.error('Audio play failed:', error));
    }
  });

  nextButton.addEventListener('click', () => {
    currentBeatIndex = (currentBeatIndex + 1) % beatSources.length;
    loadBeat(currentBeatIndex);
    if (!audioPlayer.paused) {
      audioPlayer.play().catch(error => console.error('Audio play failed:', error));
    }
  });

  beatsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      currentBeatIndex = Array.from(beatsList.children).indexOf(e.target);
      loadBeat(currentBeatIndex);
      if (videoPlayer && !videoPlayer.paused) {
        videoPlayer.pause();
      }
      audioPlayer.play().catch(error => console.error('Audio play failed:', error));
    }
  });

  // Initial load
  loadBeat(currentBeatIndex);

  // Dynamically load photoshoot galleries
  const photoshoot1Gallery = document.getElementById('photoshoot1-gallery');
  const photoshoot2Gallery = document.getElementById('photoshoot2-gallery');

  // Photoshoot 1 images (1.JPG to 6.JPG) - using folder structure
  const photoshoot1Images = [
    'Photoshoot1/1.JPG',
    'Photoshoot1/2.JPG',
    'Photoshoot1/3.JPG',
    'Photoshoot1/4.JPG',
    'Photoshoot1/5.JPG',
    'Photoshoot1/6.JPG'
  ];

  // Photoshoot 2 images (1.JPG to 12.JPG) - using folder structure
  const photoshoot2Images = [
    'Photoshoot2/1.JPG',
    'Photoshoot2/2.JPG',
    'Photoshoot2/3.JPG',
    'Photoshoot2/4.JPG',
    'Photoshoot2/5.JPG',
    'Photoshoot2/6.JPG',
    'Photoshoot2/7.JPG',
    'Photoshoot2/8.JPG',
    'Photoshoot2/9.JPG',
    'Photoshoot2/10.JPG',
    'Photoshoot2/11.JPG',
    'Photoshoot2/12.JPG'
  ];

  photoshoot1Images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Photoshoot 1 Image ${index + 1}`;
    img.classList.add('visual-item');
    img.addEventListener('click', () => {
      img.classList.toggle('enlarged');
    });
    img.onerror = () => {
      console.error(`Failed to load image: ${src}. Verify the file exists in the ${src.split('/')[0]} folder or correct the path.`);
      img.alt = `Failed to load Photoshoot 1 Image ${index + 1}`;
    };
    photoshoot1Gallery.appendChild(img);
  });

  photoshoot2Images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Photoshoot 2 Image ${index + 1}`;
    img.classList.add('visual-item');
    img.addEventListener('click', () => {
      img.classList.toggle('enlarged');
    });
    img.onerror = () => {
      console.error(`Failed to load image: ${src}. Verify the file exists in the ${src.split('/')[0]} folder or correct the path.`);
      img.alt = `Failed to load Photoshoot 2 Image ${index + 1}`;
    };
    photoshoot2Gallery.appendChild(img);
  });
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
