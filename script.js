document.addEventListener("DOMContentLoaded", () => {
    // Countdown logic
    const countdownElement = document.getElementById("countdown");
    const releaseDate = new Date("2025-03-31T00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = releaseDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = "ZDAY 2 is out now!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Video transition logic
    const albumCover = document.querySelector(".album-cover");
    const videoPlayer = document.querySelector(".video-player");
    const playButton = document.querySelector(".play-button");
    const errorMessage = document.querySelector(".error-message");

    try {
        if (!albumCover || !videoPlayer) {
            throw new Error("Media elements not found");
        }

        // Preload video
        videoPlayer.load();

        // Transition after 2 seconds
        setTimeout(() => {
            albumCover.style.opacity = "0";
            videoPlayer.style.opacity = "1";
            playButton.style.display = "block";
        }, 2000);

        playButton.addEventListener("click", () => {
            if (videoPlayer.paused) {
                videoPlayer.play();
                playButton.textContent = "Pause Video";
            } else {
                videoPlayer.pause();
                playButton.textContent = "Play Video";
            }
        });

        videoPlayer.addEventListener("ended", () => {
            playButton.textContent = "Play Video";
        });

        videoPlayer.addEventListener("error", () => {
            errorMessage.style.display = "block";
            videoPlayer.style.display = "none";
        });
    } catch (error) {
        console.error("Error setting up media:", error);
        errorMessage.style.display = "block";
    }

    // Beats player logic
    const beatsAudio = document.getElementById("beats-audio");
    const beatsControls = document.querySelectorAll(".beats-control");

    beatsControls.forEach((button) => {
        button.addEventListener("click", () => {
            const src = button.getAttribute("data-src");
            beatsAudio.src = src;
            beatsAudio.play();
        });
    });
});
