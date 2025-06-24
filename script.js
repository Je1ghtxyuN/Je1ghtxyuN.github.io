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


    // 音乐播放器控制
    const audio = document.getElementById('myAudio');
    const songTitle = document.getElementById('songTitle');

    // 歌曲信息更新
    audio.addEventListener('play', function () {
        songTitle.textContent = "正在播放: あたらよ - 夏霞";
    });

    audio.addEventListener('pause', function () {
        songTitle.textContent = "已暂停";
    });
});