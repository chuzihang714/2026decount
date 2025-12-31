/* ==================== 
   Part 1: 翻页倒计时逻辑
   ==================== */
// 设置目标时间：2026年1月1日 00:00:00
const countToDate = new Date("Jan 1, 2026 00:00:00").getTime();
let previousTimeBetweenDates;

function flipAllCards(time) {
  const seconds = Math.floor((time % (1000 * 60)) / 1000);
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const days = Math.floor(time / (1000 * 60 * 60 * 24));

  flip(document.querySelector("[data-days]"), days);
  flip(document.querySelector("[data-hours]"), hours);
  flip(document.querySelector("[data-minutes]"), minutes);
  flip(document.querySelector("[data-seconds]"), seconds);
}

function flip(flipCard, newNumber) {
  // 1. 强制转换为字符串并补零
  const val = String(newNumber).padStart(2, "0");
  
  const topHalf = flipCard.querySelector(".top");
  const bottomHalf = flipCard.querySelector(".bottom");
  const topBack = flipCard.querySelector(".top-back");
  const bottomBack = flipCard.querySelector(".bottom-back");
  
  const startNumber = topHalf.textContent.trim();

  // 3. 数字没变则直接返回
  if (val === startNumber) return;

  // 4. 准备动画
  topHalf.textContent = startNumber; 
  bottomHalf.textContent = startNumber;
  topBack.textContent = startNumber;
  bottomBack.textContent = val;

  // 5. 触发动画
  flipCard.classList.remove("flip"); 
  void flipCard.offsetWidth; 
  flipCard.classList.add("flip");

  flipCard.addEventListener("animationend", () => {
    topHalf.textContent = val;
    bottomHalf.textContent = val;
    topBack.textContent = val;
    bottomBack.textContent = val;
    flipCard.classList.remove("flip");
  }, { once: true });
}

// === 核心修改：增加跳转逻辑 ===
const timer = setInterval(() => {
  const currentDate = new Date().getTime();
  const timeBetweenDates = Math.ceil((countToDate - currentDate));
  
  if(timeBetweenDates > 0) {
      // 倒计时进行中
      flipAllCards(timeBetweenDates);
  } else {
      // 倒计时结束！
      flipAllCards(0);
      
      // 1. 清除定时器
      clearInterval(timer);
      
      // 2. 跳转到庆祝页面 (celebrate.html)
      // 使用 replace 可以防止用户按“后退”键回到倒计时页面
      window.location.replace("celebrate.html");
  }
  
  previousTimeBetweenDates = timeBetweenDates;
}, 1000);

/* ==================== 
   Part 2: 粒子烟花逻辑 (保持不变)
   ==================== */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Particle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 4 + 1; 
    this.vx = Math.cos(angle) * velocity;
    this.vy = Math.sin(angle) * velocity;
    this.life = 120; this.alpha = 1; this.gravity = 0.04;
  }
  draw() {
    ctx.save(); ctx.globalAlpha = this.alpha; ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += this.gravity; this.life -= 1; this.alpha -= 0.01;
  }
}
let particles = [];
function randomColor() {
  const colors = ['#FFD700', '#FF4500', '#00BFFF', '#32CD32', '#FF69B4', '#FFFFFF'];
  return colors[Math.floor(Math.random() * colors.length)];
}
function launchFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.6); 
    const color = randomColor();
    for (let i = 0; i < 40; i++) particles.push(new Particle(x, y, color));
}
function animate() {
  ctx.fillStyle = "rgba(5, 5, 5, 0.15)"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle, index) => {
    if (particle.life > 0 && particle.alpha > 0) { particle.update(); particle.draw(); }
    else { particles.splice(index, 1); }
  });
  if (Math.random() < 0.04) launchFirework();
  requestAnimationFrame(animate);
}
animate();