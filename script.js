document.addEventListener('DOMContentLoaded', function() {
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
});