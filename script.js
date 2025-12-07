gsap.registerPlugin(ScrollTrigger);

// --- 1. HEART POP-UP LOGIC ---
const emojis = ['❤️', '💖', '💕', '🫶🏻', '✨'];

function spawnHeart(x, y, isBurst = false) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Random spread
    const spread = isBurst ? 50 : 20;
    const randomX = (Math.random() - 0.5) * spread;
    
    heart.style.left = (x + randomX) + 'px';
    heart.style.top = y + 'px';
    
    // Random size
    const size = Math.random() * 1.5 + 1; 
    heart.style.fontSize = size + 'rem';
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
}

// Global Click
document.addEventListener('click', (e) => {
    // Prevent double hearts on specific buttons
    if(e.target.closest('#play-pause-btn') || e.target.closest('.fingerprint-scanner') || e.target.id === 'enter-universe') return;
    spawnHeart(e.clientX, e.clientY);
});

// --- 2. CLOCK ---
function updateClock() {
    const now = new Date();
    document.getElementById('real-time').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// --- 3. CORE VARIABLES ---
const enterBtn = document.getElementById('enter-universe');
const introLayer = document.getElementById('intro-layer');
const universe = document.getElementById('universe');
const audio = document.getElementById('bg-music');
const spotifyPlayer = document.querySelector('.spotify-player');
const playBtn = document.getElementById('play-pause-btn');
const playIcon = playBtn.querySelector('i');
const progressBar = document.getElementById('progress-bar');
const playerContainer = document.querySelector('.spotify-player');
const likeBtn = document.getElementById('like-btn');

// --- 4. MUSIC CONTROL FUNCTION ---
function toggleAudio() {
    if (audio.paused) {
        audio.play().then(() => {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            playerContainer.classList.add('playing');
        }).catch(err => console.log("Audio play failed (browser policy):", err));
    } else {
        audio.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        playerContainer.classList.remove('playing');
    }
}

// --- 5. ENTRY SEQUENCE (Music Starts Here) ---
enterBtn.addEventListener('click', (e) => {
    // 1. Burst Hearts
    const rect = enterBtn.getBoundingClientRect();
    for(let i=0; i<10; i++) {
        setTimeout(() => spawnHeart(rect.left + 50, rect.top, true), i*50);
    }

    // 2. PLAY MUSIC IMMEDIATELY
    toggleAudio();

    // 3. Visual Transition
    introLayer.style.opacity = '0';
    setTimeout(() => {
        introLayer.style.display = 'none';
        universe.classList.remove('hidden');
        universe.style.opacity = '1';
        
        // Show Player
        spotifyPlayer.style.opacity = '1';
        
        initScrollAnimations();
    }, 1000);
});

// --- 6. PLAYER BUTTON LISTENERS ---
playBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stop global heart click
    
    // Heart burst on button
    const rect = playBtn.getBoundingClientRect();
    for(let i=0; i<5; i++) {
        setTimeout(() => spawnHeart(rect.left + 20, rect.top, true), i*50);
    }

    toggleAudio();
});

// Like Button Logic
likeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    likeBtn.classList.toggle('fa-regular');
    likeBtn.classList.toggle('fa-solid');
    likeBtn.classList.toggle('active');
    
    // Little heart burst
    const rect = likeBtn.getBoundingClientRect();
    spawnHeart(rect.left + 10, rect.top, true);
});

// Progress Bar
audio.addEventListener('timeupdate', () => {
    if(audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
    }
});

// --- 7. SCROLL ANIMATIONS ---
function initScrollAnimations() {
    gsap.from(".moon-frame", { duration: 1.5, scale: 0, ease: "elastic.out(1, 0.5)", delay: 0.5 });
    
    gsap.from(".glass-card", {
        scrollTrigger: { trigger: ".text-section", start: "top 70%" },
        y: 50, opacity: 0, duration: 1
    });

    gsap.utils.toArray('.future-card').forEach((card) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: "top 85%" },
            x: -50, opacity: 0, duration: 0.8
        });
    });

    gsap.from(".photo-item", {
        scrollTrigger: { trigger: ".gallery-section", start: "top 70%" },
        scale: 0.8, opacity: 0, stagger: 0.2, duration: 0.8
    });
}

// --- 8. SCANNER ---
const scannerBtn = document.getElementById('scanner-btn');
const lockInterface = document.getElementById('lock-interface');
const secretNote = document.getElementById('secret-note');
let isScanning = false;

scannerBtn.addEventListener('mousedown', startScan);
scannerBtn.addEventListener('touchstart', startScan);

function startScan(e) {
    if(e) e.stopPropagation();
    if(isScanning) return;
    isScanning = true;
    scannerBtn.classList.add('scanning');
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => {
        lockInterface.style.opacity = '0';
        setTimeout(() => {
            lockInterface.style.display = 'none';
            secretNote.style.display = 'block';
            document.getElementById('note-time-stamp').innerText = `Unlocked at: ${new Date().toLocaleTimeString()}`;

            setTimeout(() => {
                secretNote.style.opacity = '1';
                gsap.from(".paper", { y: 50, opacity: 0, duration: 1 });
            }, 100);
        }, 500);
    }, 2000);
}