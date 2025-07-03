// Basic mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('.nav-links').style.display = 
            document.querySelector('.nav-links').style.display === 'flex' ? 'none' : 'flex';
    });

    const createAuroraEffect = () => {
        const aurora = document.createElement('div');
        aurora.classList.add('aurora-effect');
        aurora.style.position = 'absolute';
        aurora.style.borderRadius = '50%';
        aurora.style.filter = 'blur(60px)';
        aurora.style.opacity = '0';
        
        const size = Math.random() * 100 + 50;
        aurora.style.width = `${size}px`;
        aurora.style.height = `${size}px`;
        
        const colors = ['#8A2BE2', '#FF1493', '#00BFFF', '#FF69B4'];
        aurora.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        aurora.style.left = `${Math.random() * 100}%`;
        aurora.style.top = `${Math.random() * 100}%`;
        
        document.querySelector('.hero').appendChild(aurora);
        
        let opacity = 0;
        const fadeIn = setInterval(() => {
            if (opacity >= 0.3) {
                clearInterval(fadeIn);
                setTimeout(() => {
                    const fadeOut = setInterval(() => {
                        if (opacity <= 0) {
                            clearInterval(fadeOut);
                            aurora.remove();
                        }
                        opacity -= 0.01;
                        aurora.style.opacity = opacity;
                    }, 50);
                }, Math.random() * 3000 + 2000);
            }
            opacity += 0.01;
            aurora.style.opacity = opacity;
        }, 50);
    };
    
    setInterval(createAuroraEffect, 1000);
}); 