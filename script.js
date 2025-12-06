// Floating Hearts Logic
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.style.position = 'fixed';
    heart.style.color = '#fff';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.bottom = '-10px';
    heart.style.opacity = Math.random();
    heart.style.zIndex = '-1';
    
    // Randomize animation duration
    const duration = Math.random() * 3 + 2; 
    heart.style.animation = `floatUp ${duration}s linear forwards`;

    document.body.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Generate a heart every 300ms
setInterval(createHeart, 300);


// Modal Logic
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
}

// Close modal if clicking outside the content box
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}


// Surprise Button Logic
document.getElementById('surpriseBtn').addEventListener('click', function() {
    const message = document.getElementById('hiddenMessage');
    const btn = document.getElementById('surpriseBtn');
    
    if (message.classList.contains('show')) {
        message.classList.remove('show');
        btn.innerText = "Click for a Surprise";
    } else {
        message.classList.add('show');
        btn.innerText = "Close Surprise";
        
        // Trigger a burst of extra hearts for effect
        for(let i=0; i<30; i++) {
            setTimeout(createHeart, i*50);
        }
    }
});