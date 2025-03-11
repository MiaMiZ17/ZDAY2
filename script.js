// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('main-video');
    const videoError = document.getElementById('video-error');
    const albumCover = document.querySelector('.album-cover');
    const countdown = document.getElementById('countdown');
    const sources = ['dust.mp4', 'roseburn.mp4'];
    let currentIndex = 0;

    // Handle video errors
    video.addEventListener('error', () => {
        videoError.style.display = 'block';
        videoError.textContent = "Video failed to load. Check file paths ('dust.mp4' or 'roseburn.mp4'), format (MP4 with H.264), or browser compatibility.";
        albumCover.style.display = 'block'; // Show album cover if video fails
        video.style.display = 'none';
    });

    // Switch to next video when one ends
    video.addEventListener('ended', () => {
        currentIndex = (currentIndex + 1) % sources.length;
        video.src = sources[currentIndex];
        video.play();
    });

    // Countdown logic (simplified placeholder - replace with your actual logic)
    function updateCountdown() {
        // Replace with your dynamic countdown logic (e.g., targeting a specific date)
        let timeLeft = "214d 0h 0m 0s"; // Placeholder
        countdown.textContent = timeLeft;
    }
    setInterval(updateCountdown, 1000);

    // Booking form submission using Formspree
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const data = {
                serviceType: formData.get('service-type'),
                name: formData.get('name'),
                email: formData.get('email'),
                date: formData.get('date'),
                message: formData.get('message')
            };

            // Replace 'YOUR_FORMSPREE_ID' with your Formspree endpoint (e.g., xexampleid)
            fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    alert('Booking submitted! We’ll contact you soon.');
                    bookingForm.reset();
                } else {
                    alert('Error submitting booking. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error submitting booking. Please try again.');
            });
        });
    }
});
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​