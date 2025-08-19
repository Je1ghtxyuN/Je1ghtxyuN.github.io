document.addEventListener('DOMContentLoaded', function () {
    // 表单提交处理
    const form = document.getElementById('questionForm');
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // 更新按钮状态
            submitBtn.disabled = true;
            submitBtn.textContent = '发送中...';
            submitBtn.style.background = 'linear-gradient(to right, #4facfe, #00f2fe)';

            // 发送表单数据
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // 成功反馈
                submitBtn.textContent = '✓ 已发送';
                submitBtn.style.background = 'linear-gradient(to right, #4cd964, #5ac8fa)';
                form.reset();

                // 3秒后恢复按钮状态
                setTimeout(() => {
                    submitBtn.textContent = '匿名提问';
                    submitBtn.style.background = 'linear-gradient(to right, #6e8efb, #a777e3)';
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                throw new Error('提交失败');
            }
        } catch (error) {
            // 错误处理
            submitBtn.textContent = '✗ 发送失败';
            submitBtn.style.background = 'linear-gradient(to right, #ff5e57, #ff2d55)';

            setTimeout(() => {
                submitBtn.textContent = '匿名提问';
                submitBtn.style.background = 'linear-gradient(to right, #6e8efb, #a777e3)';
                submitBtn.disabled = false;
            }, 2000);
        }
    });

    // 滚动动画
    const sections = document.querySelectorAll('section');

    const checkScroll = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    // 初始化部分动画
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // 触发初始动画
    setTimeout(() => {
        sections[0].style.opacity = '1';
        sections[0].style.transform = 'translateY(0)';
    }, 300);

    // 添加滚动事件监听
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // 初始检查

    //鼠标特效逻辑
    let lastX = 0, lastY = 0;

    document.addEventListener('mousemove', function (e) {
        if (Math.sqrt(Math.pow(e.pageX - lastX, 2) + Math.pow(e.pageY - lastY, 2)) < 30) return;

        lastX = e.pageX;
        lastY = e.pageY;

        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        // 使用 clientX/clientY 代替 pageX/pageY 来修复滚动问题
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

        // 淡出效果
        setTimeout(() => {
            heart.style.opacity = '0';
        }, 300);

        // 移除元素
        setTimeout(() => {
            heart.remove();
        }, 1300);
    });

    const pawprints = ['🐾', 'ฅ^•ﻌ•^ฅ', '=^･ω･^=', '≽^•⩊•^≼'];

    document.addEventListener('click', function (e) {
        const paw = document.createElement('div');
        paw.textContent = pawprints[Math.floor(Math.random() * pawprints.length)];
        paw.style.position = 'fixed';
        // 使用 clientX/clientY 代替 pageX/pageY 来修复滚动问题
        paw.style.left = (e.clientX - 15) + 'px';
        paw.style.top = (e.clientY - 15) + 'px';
        paw.style.fontSize = '20px';
        paw.style.pointerEvents = 'none';
        paw.style.zIndex = '9999';
        paw.style.opacity = '1';
        paw.style.transition = 'opacity 1s ease';

        document.body.appendChild(paw);

        // 淡出效果
        setTimeout(() => {
            paw.style.opacity = '0';
        }, 300);

        // 移除元素
        setTimeout(() => {
            paw.remove();
        }, 1300);
    });

    // 悬浮音乐播放器控制
    const floatingPlayer = document.querySelector('.floating-music-player');
    const minimizedBtn = document.querySelector('.player-minimized');
    const minimizeBtn = document.querySelector('.minimize-btn');
    const audio = document.getElementById('myAudio');

    // 点击迷你播放器展开
    minimizedBtn.addEventListener('click', function () {
        floatingPlayer.classList.add('expanded');
    });

    // 点击关闭按钮收起
    minimizeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        floatingPlayer.classList.remove('expanded');
    });

    // 点击播放器外部区域收起
    document.addEventListener('click', function (e) {
        if (!floatingPlayer.contains(e.target) &&
            !e.target.classList.contains('player-minimized')) {
            floatingPlayer.classList.remove('expanded');
        }
    });

    // 歌曲信息更新
    audio.addEventListener('play', function () {
        document.querySelector('.song-info').textContent = "正在播放: あたらよ - 夏霞";
    });

    audio.addEventListener('pause', function () {
        document.querySelector('.song-info').textContent = "已暂停: あたらよ - 夏霞";
    });


    // 照片墙点击放大效果
    function setupPhotoWall() {
        // 使用事件委托处理动态加载的照片
        document.addEventListener('click', function (e) {
            // 检查点击的是否是照片或照片容器
            const photoItem = e.target.closest('.photo-item');
            if (photoItem) {
                e.preventDefault();
                const img = photoItem.querySelector('img');
                if (img) {
                    openPhotoModal(img.src);
                }
            }

            // 检查点击的是否是关闭按钮
            if (e.target.classList.contains('close-btn')) {
                closePhotoModal();
            }
        });

        // 打开模态框
        function openPhotoModal(imgSrc) {
            // 关闭已打开的模态框
            closePhotoModal();

            // 创建新模态框
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

            // 强制重绘
            void overlay.offsetWidth;

            // 激活动画
            overlay.classList.add('active');

            // 禁用滚动
            document.body.style.overflow = 'hidden';
        }

        // 关闭模态框
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

    // 初始化照片墙
    setupPhotoWall();

    // 轮播功能
    function setupCarousels() {
        document.querySelectorAll('.media-carousel').forEach(carousel => {
            const items = carousel.querySelectorAll('.carousel-item');
            const prevBtn = carousel.parentElement.querySelector('.carousel-prev');
            const nextBtn = carousel.parentElement.querySelector('.carousel-next');
            const indicators = carousel.parentElement.querySelectorAll('.indicator');
            let currentIndex = 0;

            function showItem(index) {
                // 隐藏所有项目
                items.forEach(item => item.classList.remove('active'));
                indicators.forEach(ind => ind.classList.remove('active'));

                // 显示指定项目
                items[index].classList.add('active');
                indicators[index].classList.add('active');
                currentIndex = index;
            }

            // 下一张
            nextBtn.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % items.length;
                showItem(nextIndex);
            });

            // 上一张
            prevBtn.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                showItem(prevIndex);
            });

            // 指示器点击
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    showItem(index);
                });
            });

            // 自动播放(可选)
            let autoplay = setInterval(() => {
                const nextIndex = (currentIndex + 1) % items.length;
                showItem(nextIndex);
            }, 5000);

            // 鼠标悬停暂停自动播放
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoplay);
            });

            carousel.addEventListener('mouseleave', () => {
                autoplay = setInterval(() => {
                    const nextIndex = (currentIndex + 1) % items.length;
                    showItem(nextIndex);
                }, 5000);
            });

            // 初始化显示第一个项目
            showItem(0);
        });
    }

    // 页面加载完成后初始化轮播
    document.addEventListener('DOMContentLoaded', setupCarousels);

    // 原声带功能
    function setupSoundtracks() {
        // 切换原声带显示/隐藏
        document.querySelectorAll('.soundtrack-title').forEach(title => {
            title.addEventListener('click', function () {
                this.classList.toggle('active');
            });
        });

        // 原声带选择播放
        document.querySelectorAll('.soundtrack-select').forEach(select => {
            const player = select.nextElementSibling;

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
        });
    }

    // 在DOM加载完成后初始化
    document.addEventListener('DOMContentLoaded', function () {
        setupSoundtracks();
        // 其他初始化代码...
    });
});


