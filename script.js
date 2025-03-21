// Debug: Confirm script is loading
console.log("script.js loaded");

// Function to detect if the user is on a mobile device
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function to test if a media URL (video or audio) is accessible
async function testMediaUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      console.log(`Media accessible at ${url}`);
      return true;
    } else {
      console.error(`Media not accessible at ${url}, status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`Failed to access media at ${url}:`, error);
    return false;
  }
}

// Detect mobile and adjust layout
document.addEventListener('DOMContentLoaded', async () => {
  // Set mobile attribute
  if (window.innerWidth <= 768) {
    document.body.setAttribute('data-mobile', 'true');
  } else {
    document.body.setAttribute('data-mobile', 'false');
  }

  // Video setup
  const albumCover = document.querySelector('.album-cover');
  const videoPlayer = document.getElementById('main-video');
  const videoSource = document.getElementById('video-source');
  const videoError = document.getElementById('video-error');
  const playButton = document.getElementById('play-button');

  // Use a single video for both mobile and desktop
  const videoUrl = 'videos/Mobile-Vid-Promo.mp4';
  const isVideoAccessible = await testMediaUrl(videoUrl);
  if (isVideoAccessible) {
    videoSource.setAttribute('src', videoUrl);
    videoPlayer.load();
  } else {
    videoError.textContent = `Video not found at ${videoUrl}. Please check the file path.`;
    videoError.style.display = 'block';
  }

  // Video sequence logic
  if (albumCover && videoPlayer && playButton) {
    setTimeout(() => {
      albumCover.classList.add('fade-out');
      setTimeout(() => {
        videoPlayer.classList.add('active');
        playButton.style.display = 'block';
      }, 2000);
    }, 0);

    playButton.addEventListener('click', () => {
      videoPlayer.play().then(() => {
        console.log("Video playing");
        playButton.style.display = 'none';
      }).catch(error => {
        console.error("Video playback failed:", error);
        videoError.textContent = `Video failed: ${error.message}.`;
        videoError.style.display = 'block';
      });
    });

    // Attempt autoplay with fallback to play button
    videoPlayer.play().catch(error => {
      console.error("Video autoplay failed:", error);
    });
  } else {
    if (!videoPlayer || !playButton) {
      videoError.textContent = "Video or play button element not found.";
      videoError.style.display = 'block';
    }
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

  // Test accessibility of audio files
  for (const beat of beatSources) {
    const isAccessible = await testMediaUrl(beat);
    if (!isAccessible) {
      console.error(`Audio file ${beat} is not accessible. Please check the file path or redeploy the site.`);
    }
  }

  function loadBeat(index) {
    if (index >= 0 && index < beatSources.length) {
      console.log("Attempting to load beat:", beatSources[index]);
      audioSource.setAttribute('src', beatSources[index]);
      audioPlayer.load();
      beatsList.querySelectorAll('li').forEach((li, i) => {
        li.classList.toggle('active', i === index);
      });
      audioPlayer.addEventListener('loadeddata', () => {
        console.log("Audio data loaded successfully for:", beatSources[index]);
      }, { once: true });
      audioPlayer.addEventListener('error', (e) => {
        console.error("Error loading audio:", beatSources[index], e);
      }, { once: true });
    } else {
      console.error("Invalid beat index:", index);
    }
  }

  // Initial load and play
  loadBeat(currentBeatIndex);

  playButtonAudio.addEventListener('click', () => {
    if (audioPlayer.paused) {
      if (videoPlayer && !videoPlayer.paused) {
        videoPlayer.pause();
      }
      audioPlayer.play().then(() => {
        console.log("Audio playing:", beatSources[currentBeatIndex]);
        playButtonAudio.textContent = 'Pause';
      }).catch(error => {
        console.error('Audio play failed:', error);
        if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
          alert('Audio playback requires user interaction or is not supported in this browser. Please click "Play" again or try a different browser.');
        }
      });
    } else {
      audioPlayer.pause();
      playButtonAudio.textContent = 'Play';
      console.log("Audio paused");
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

  // Form submission feedback
  const bookingForm = document.getElementById('booking-form');
  const bookingConfirmation = document.getElementById('booking-confirmation');

  bookingForm.addEventListener('submit', (e) => {
    console.log("Form submitted with data:", new FormData(bookingForm));
    bookingConfirmation.style.display = 'block';
    setTimeout(() => {
      bookingForm.reset();
      bookingConfirmation.style.display = 'none';
    }, 3000);
  });

  // Countdown timer set to end on March 14, 2025, at 1:00 AM EST (6:00 AM UTC)
  const countDownDate = new Date(Date.UTC(2025, 2, 14, 6, 0, 0)).getTime();
  const countdownElement = document.getElementById("countdown");

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      countdownElement.innerHTML = "ZDAY 2 has arrived!";
      clearInterval(countdownInterval);
    }
  };

  // Update countdown every second
  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown(); // Initial call to avoid delay
});
