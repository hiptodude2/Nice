const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 1500;
const starColors = ["#FFFFFF", "#FDEE87", "#AEC6CF", "#FFDAB9", "#B0E0E6"];

// Using Perlin noise for more organic movement
const noise = new SimplexNoise();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createStar() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.03,
        color: starColors[Math.floor(Math.random() * starColors.length)]
    };
}

for (let i = 0; i < numStars; i++) {
    stars[i] = createStar();
}

let time = 0;

// Create multiple layers for the nebula
function createNebulaLayer(color, blendMode, speed) {
    return {
        color: color,
        blendMode: blendMode,
        speed: speed,
        noiseSeed: Math.random() * 1000
    };
}

const nebulaLayers = [
    createNebulaLayer('rgba(100, 0, 150, 0.1)', 'lighter', 0.00005),
    createNebulaLayer('rgba(0, 50, 150, 0.15)', 'screen', 0.00008),
    createNebulaLayer('rgba(20, 20, 80, 0.1)', 'overlay', 0.0001)
];


function draw() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Nebula
    nebulaLayers.forEach(layer => {
        ctx.globalCompositeOperation = layer.blendMode;
        for (let i = 0; i < 30; i++) {
            const x = noise.noise3D(i * 10.1, time * layer.speed, layer.noiseSeed) * canvas.width * 1.2;
            const y = noise.noise3D(i * 10.1, time * layer.speed + 100, layer.noiseSeed) * canvas.height * 1.2;
            const sizeNoise = (noise.noise3D(i * 10.1, time * layer.speed + 200, layer.noiseSeed) + 1) / 2;
            const size = sizeNoise * 300 + 200;
            
            const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
            grad.addColorStop(0, layer.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = grad;
            ctx.fillRect(x - size, y - size, size * 2, size * 2);
        }
    });

    ctx.globalCompositeOperation = 'source-over';

    // Draw Stars
    stars.forEach(star => {
        let perspective = canvas.width / (canvas.width + star.z);
        let x = canvas.width / 2 + (star.x - canvas.width / 2) * perspective;
        let y = canvas.height / 2 + (star.y - canvas.height / 2) * perspective;
        
        star.z -= 0.1;
        if (star.z < 0) {
            star.z = canvas.width;
        }

        // Twinkling effect
        let twinkle = Math.abs(Math.sin(time * star.twinkleSpeed));
        
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(x, y, star.size * perspective, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.globalAlpha = 1;
    time++;
    requestAnimationFrame(draw);
}

draw(); 