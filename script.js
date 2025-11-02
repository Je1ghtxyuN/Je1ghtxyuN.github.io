// 通用功能模块
document.addEventListener('DOMContentLoaded', function () {
    // ==================== 通用功能初始化 ====================
    initNavigation();
    initRuntimeCounter();
    initMouseEffects();
    initMusicPlayer();
    initPhotoWall();
    initCarousels();
    initSoundtracks();

    // ==================== 表单提交处理 ====================
    const form = document.getElementById('questionForm');
    if (form) {
        initFormSubmission(form);
    }
});

// 导航栏高亮
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 网站运行时间计算
function initRuntimeCounter() {
    function updateRuntime() {
        const startDate = new Date('2025-06-25T00:00:00');
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const runtimeText = `${days}D${hours}H${minutes}M${seconds}S`;
        const runtimeElement = document.getElementById('runtime');

        if (runtimeElement) {
            runtimeElement.textContent = runtimeText;
        }
    }

    updateRuntime();
    setInterval(updateRuntime, 1000);
}

// 鼠标特效
function initMouseEffects() {
    let lastX = 0, lastY = 0;

    // 心形特效
    document.addEventListener('mousemove', function (e) {
        if (Math.sqrt(Math.pow(e.pageX - lastX, 2) + Math.pow(e.pageY - lastY, 2)) < 30) return;

        lastX = e.pageX;
        lastY = e.pageY;

        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = Math.random() * 10 + 10 + 'px';
        heart.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
        heart.style.opacity = '0.7';
        heart.style.transition = 'opacity 1s ease';

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.style.opacity = '0';
        }, 300);

        setTimeout(() => {
            heart.remove();
        }, 1300);
    });

    // 爪印特效
    const pawprints = ['🐾🐾', 'ฅฅ^•ﻌﻌ•^ฅฅ', '=^･ω･^=', '≽≽^•⩊⩊⩊•^≼≼'];
    document.addEventListener('click', function (e) {
        const paw = document.createElement('div');
        paw.textContent = pawprints[Math.floor(Math.random() * pawprints.length)];
        paw.style.position = 'fixed';
        paw.style.left = (e.clientX - 15) + 'px';
        paw.style.top = (e.clientY - 15) + 'px';
        paw.style.fontSize = '20px';
        paw.style.pointerEvents = 'none';
        paw.style.zIndex = '9999';
        paw.style.opacity = '1';
        paw.style.transition = 'opacity 1s ease';

        document.body.appendChild(paw);

        setTimeout(() => {
            paw.style.opacity = '0';
        }, 300);

        setTimeout(() => {
            paw.remove();
        }, 1300);
    });
}

// 音乐播放器
function initMusicPlayer() {
    const players = document.querySelectorAll('.floating-music-player');
    if (players.length === 0) return;

    players.forEach(floatingPlayer => {
        const minimizedBtn = floatingPlayer.querySelector('.player-minimized');
        const minimizeBtn = floatingPlayer.querySelector('.minimize-btn');
        const audio = floatingPlayer.querySelector('audio');
        const songInfo = floatingPlayer.querySelector('.song-info');

        if (!minimizedBtn || !minimizeBtn) return;

        minimizedBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            floatingPlayer.classList.add('expanded');
            floatingPlayer.style.zIndex = '10000';
        });

        minimizeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            floatingPlayer.classList.remove('expanded');
            floatingPlayer.style.zIndex = '1000';
        });

        if (audio && songInfo) {
            audio.addEventListener('play', function () {
                songInfo.textContent = "正在播放: あたらよ - 夏霞";
            });

            audio.addEventListener('pause', function () {
                songInfo.textContent = "已暂停: あたらよ - 夏霞";
            });
        }
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.floating-music-player') &&
            !e.target.classList.contains('player-minimized')) {
            document.querySelectorAll('.floating-music-player').forEach(player => {
                player.classList.remove('expanded');
                player.style.zIndex = '1000';
            });
        }
    });
}

// 照片墙功能
function initPhotoWall() {
    const photoItems = document.querySelectorAll('.photo-item');
    if (photoItems.length === 0) return;

    document.addEventListener('click', function (e) {
        const photoItem = e.target.closest('.photo-item');
        if (photoItem) {
            e.preventDefault();
            const img = photoItem.querySelector('img');
            if (img) {
                openPhotoModal(img.src);
            }
        }

        if (e.target.classList.contains('close-btn')) {
            closePhotoModal();
        }
    });

    function openPhotoModal(imgSrc) {
        closePhotoModal();

        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';

        const modal = document.createElement('div');
        modal.className = 'photo-modal';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = '放大图片';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';

        modal.appendChild(img);
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        void overlay.offsetWidth;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePhotoModal() {
        const overlay = document.querySelector('.photo-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 500);
        }
    }
}

// 轮播功能
function initCarousels() {
    const carousels = document.querySelectorAll('.media-carousel');
    if (carousels.length === 0) return;

    carousels.forEach(carousel => {
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.parentElement.querySelector('.carousel-prev');
        const nextBtn = carousel.parentElement.querySelector('.carousel-next');
        const indicators = carousel.parentElement.querySelectorAll('.indicator');
        let currentIndex = 0;

        function showItem(index) {
            items.forEach(item => {
                const iframe = item.querySelector('iframe');
                if (iframe) {
                    const src = iframe.src;
                    iframe.src = '';
                    iframe.src = src;
                }

                const video = item.querySelector('video');
                if (video) {
                    video.pause();
                }
            });

            items.forEach(item => item.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));

            items[index].classList.add('active');
            indicators[index].classList.add('active');
            currentIndex = index;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % items.length;
                showItem(nextIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                showItem(prevIndex);
            });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showItem(index);
            });
        });

        if (items.length > 0) {
            showItem(0);
        }
    });
}

// 原声带功能
function initSoundtracks() {
    const soundtracks = document.querySelectorAll('.soundtrack-title');
    if (soundtracks.length === 0) return;

    soundtracks.forEach(title => {
        title.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    });

    document.querySelectorAll('.soundtrack-select').forEach(select => {
        const player = select.nextElementSibling;
        if (player) {
            select.addEventListener('change', function () {
                if (this.value) {
                    player.src = this.value;
                    player.load();
                    player.play().catch(e => console.log("自动播放被阻止:", e));
                } else {
                    player.src = '';
                    player.load();
                }
            });
        }
    });
}

// 表单提交处理
function initFormSubmission(form) {
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '发送中...';
            submitBtn.style.background = 'linear-gradient(to right, #4facfe, #00f2fe)';

            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                submitBtn.textContent = '✓ 已发送';
                submitBtn.style.background = 'linear-gradient(to right, #4cd964, #5ac8fa)';
                form.reset();

                setTimeout(() => {
                    submitBtn.textContent = '提交留言';
                    submitBtn.style.background = 'linear-gradient(to right, #ff6b9e, #ff3d7f)';
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                throw new Error('提交失败');
            }
        } catch (error) {
            submitBtn.textContent = '✗✗ 发送失败';
            submitBtn.style.background = 'linear-gradient(to right, #ff5e57, #ff2d55)';

            setTimeout(() => {
                submitBtn.textContent = '提交留言';
                submitBtn.style.background = 'linear-gradient(to right, #ff6b9e, #ff3d7f)';
                submitBtn.disabled = false;
            }, 2000);
        }
    });
}