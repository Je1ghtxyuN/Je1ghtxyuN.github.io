import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; 

import { db, auth } from './firebase.js'; 


import { signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

// 图标库
import { 
  Home, Gamepad2, Mail, User, Lock, LogOut, 
  Trash2, Play, Pause, Send, Github, Twitter, Instagram, Plus, X, Heart, Clock, Image as ImageIcon, ZoomIn
} from 'lucide-react';

const APP_ID = 'je1ght-space'; 



const useRuntime = () => {
  const [runtime, setRuntime] = useState('');
  useEffect(() => {
    const startDate = new Date('2025-06-25T00:00:00'); 
    const update = () => {
      const now = new Date();
      const diff = now - startDate;
      if (diff < 0) { setRuntime("即将开启..."); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setRuntime(`${days}天 ${hours}小时 ${minutes}分钟`);
    };
    const timer = setInterval(update, 1000);
    update(); 
    return () => clearInterval(timer);
  }, []);
  return runtime;
};

// === 3. 子组件定义 ===

const Navbar = ({ tab, setTab, user, onLoginClick }) => (
  <nav className="navbar glass fade-in-up">
    <div className="nav-brand" onClick={() => setTab('home')} style={{cursor: 'pointer'}}>
      Je1ghtxyuN
    </div>
    <div className="nav-links">
      <button className={`nav-item ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
        <Home size={18} /> <span>主页</span>
      </button>
      <button className={`nav-item ${tab === 'works' ? 'active' : ''}`} onClick={() => setTab('works')}>
        <Gamepad2 size={18} /> <span>作品</span>
      </button>
      <button className={`nav-item ${tab === 'contact' ? 'active' : ''}`} onClick={() => setTab('contact')}>
        <Mail size={18} /> <span>留言</span>
      </button>
    </div>
    <button onClick={onLoginClick} style={{background:'none', border:'none', cursor:'pointer', color:'#a0aec0', padding:'5px'}}>
      {user && !user.isAnonymous ? <User size={20} color="#ff6b9e" /> : <Lock size={18} />}
    </button>
  </nav>
);


const PhotoWall = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // 当打开大图时，禁止 body 滚动
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset'; 
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPhoto]);

  const photos = [
    { src: '/images/gallery/photo1.jpg', alt: '生活碎片 1' },
    { src: '/images/gallery/photo2.jpg', alt: '生活碎片 2' },
    { src: '/images/gallery/photo3.jpg', alt: '生活碎片 3' },
    { src: '/images/gallery/photo4.jpg', alt: '生活碎片 4' },
  ];

  return (
    <div className="container" style={{marginBottom: '4rem', marginTop: '2rem'}}>
      
      {/* 响应式样式：保留新网页的 Grid */}
      <style>{`
        .photo-grid-responsive {
          display: grid; gap: 20px; grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .photo-grid-responsive { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <h3 className="section-title" style={{fontSize: '1.5rem', marginBottom: '1.5rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
        <ImageIcon size={24} color="#ff6b9e"/> 
        我的照片墙
      </h3>
      
      <div className="photo-grid-responsive">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="work-card glass" 
            style={{
              borderRadius: '15px', overflow:'hidden', cursor:'zoom-in', 
              transition: 'transform 0.3s', position: 'relative', height: '300px'
            }}
            onClick={() => setSelectedPhoto(photo.src)}
          >
            <img 
              src={photo.src} alt={photo.alt} 
              style={{width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s'}}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
              onError={(e) => e.target.src=`https://placehold.co/600x400/ffe4e6/d23669?text=Photo+${index+1}`}
            />
            <div style={{position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '8px', color: 'white', display: 'flex', backdropFilter: 'blur(4px)'}}>
              <ZoomIn size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox: 这里使用了 createPortal 把弹窗直接传送到 body 上 */}
      {/* 这样即便父组件有 transform 动画，弹窗依然可以全屏居中 */}
      {selectedPhoto && createPortal(
        <div 
          className="portal-overlay"
          onClick={() => setSelectedPhoto(null)}
        >
          <button className="portal-close">
            <X size={24} />
          </button>
          <img 
            src={selectedPhoto} 
            alt="Enlarged"
            className="portal-img"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>,
        document.body // 挂载目标：body
      )}
    </div>
  );
};

// 主页
const HomeSection = () => (
  <section className="hero-section fade-in-up" style={{paddingBottom: '2rem'}}>
    <div className="avatar-container">
      <img src="/images/profile.jpg" alt="Profile" className="avatar" onError={(e) => e.target.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Kyoka'} />
    </div>
    <h1 className="hero-title">欢迎来到我的空间～☆</h1>
    <p className="hero-subtitle">
      橘京花の个人空间 desuwa～<br/>
      泥可以了解窝，也可以给窝留言呢 (◕‿◕✿)
    </p>
    
    <div className="glass" style={{maxWidth: '600px', padding: '30px', margin: '0 auto 3rem', borderRadius: '20px', textAlign: 'left'}}>
      <h3 style={{color: '#d23669', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
        <Heart size={18} fill="#ff6b9e" color="#ff6b9e"/> 关于窝 / プロフィール
      </h3>
      <p style={{lineHeight: '1.8', color: '#5a3d5a'}}>
        窝系一只敲可爱的CS专业小透明 (⁄ ⁄•⁄ω⁄•⁄ ⁄) <br/>
        东南大学在读~コードもアニメも大好き！(๑•̀ㅂ•́)و✧ <br/>
        本命是V家歌姬们！初音ミク世界一可爱い！♪(^∇^*) <br/>
        同时还是提督桑 ~ 镇守府の日常超治愈的说 (´▽`ʃ♡ƪ) <br/>
        最近在玩鸣潮/OW/CS ~ 一緒にプレイしない？(๑¯◡¯๑) <br/>
        <span style={{fontSize: '0.9em', color: '#888', marginTop: '10px', display: 'block'}}>
          今日のわくわく：Reactの魔法を勉強中です～✨
        </span>
      </p>
    </div>

    <PhotoWall />
  </section>
);

// 作品集
const WorksSection = ({ works, user, onDelete }) => (
  <div className="works-section container fade-in-up">
    <h2 className="section-title">我的作品</h2>
    {works.length === 0 ? (
      <div style={{textAlign:'center', color:'#718096', padding: '50px'}}>
        <div style={{fontSize: '40px', marginBottom: '20px'}}>📂</div>
        <p>空间主人暂时没有作品展示哦～</p>
      </div>
    ) : (
      <div className="works-grid">
        {works.map((work) => (
          <div key={work.id} className="work-card glass">
            <div className="work-media">
              {work.videoUrl ? (
                <video src={work.videoUrl} controls style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <img src={work.imageUrl || 'https://placehold.co/600x400/ffe4e6/d23669?text=Project'} alt={work.title} />
              )}
            </div>
            <div className="work-content">
              <h3 className="work-title">{work.title}</h3>
              <p className="work-desc">{work.description}</p>
              <div className="work-footer">
                <span>{work.date}</span>
                {user && !user.isAnonymous && (
                  <button onClick={() => onDelete(work.id)} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// 留言板
const ContactSection = () => (
  <div className="contact-section fade-in-up">
    <div className="contact-card glass">
      <div className="contact-info">
        <h2 style={{fontSize:'2rem', marginBottom:'20px'}}>留言板 ✨</h2>
        <p style={{opacity:0.9, lineHeight:1.6}}>
          想对京花ちゃん说的话都可以写在这里哦～(｡｡♥‿‿♥｡｡)<br/><br/>
          无论是技术交流、游戏组队，还是单纯的打招呼，我都非常欢迎！
        </p>
      </div>
      <div className="contact-form">
        <form action="https://formspree.io/f/mkgbpnbb" method="POST">
          <div className="form-group">
            <input type="text" name="nickname" className="form-input" placeholder="怎么称呼你呢？(必填)" required />
          </div>
          <div className="form-group">
            <input type="text" name="contact" className="form-input" placeholder="联系方式 (选填，方便回复)" />
          </div>
          <div className="form-group">
            <textarea name="message" className="form-input" rows="5" placeholder="写下你想说的话..." required></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}}>
            发送留言 <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  </div>
);

// 音乐胶囊
const MusicPill = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null); 
  
  const toggle = () => {
    if(playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  return (
    <div className="music-pill" style={{
      position: 'fixed', bottom: '100px', right: '20px', left: 'auto', transform: 'none', zIndex: 1000
    }}>
      <div className="music-info"><span style={{color:'#ff6b9e'}}>Now Playing</span> · あたらよ - 夏霞</div>
      <button onClick={toggle} className="play-btn">
        {playing ? <Pause size={14} /> : <Play size={14} style={{marginLeft:'2px'}} />}
      </button>
      <audio ref={audioRef} src="/music/あたらよ - 夏霞.mp3" loop onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} />
    </div>
  );
};

// 管理员弹窗
const AdminModal = ({ onClose, onLogin, user, onLogout }) => {
  const [email, setE] = useState('');
  const [pass, setP] = useState('');
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="glass" style={{padding:'30px', borderRadius:'20px', width:'300px', background:'white', position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute', top:'15px', right:'15px', border:'none', background:'none', cursor:'pointer'}}><X size={20}/></button>
        {user && !user.isAnonymous ? (
          <div style={{textAlign:'center'}}>
            <h3>已登录</h3>
            <p style={{margin:'10px 0', color:'#718096'}}>{user.email}</p>
            <button onClick={onLogout} className="btn btn-ghost" style={{width:'100%', justifyContent:'center', border:'1px solid #eee'}}><LogOut size={16}/> 退出</button>
          </div>
        ) : (
          <form onSubmit={e => {e.preventDefault(); onLogin(email, pass)}} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            <h3 style={{textAlign:'center'}}>管理员登录</h3>
            <input className="form-input" type="email" placeholder="邮箱" value={email} onChange={e=>setE(e.target.value)} />
            <input className="form-input" type="password" placeholder="密码" value={pass} onChange={e=>setP(e.target.value)} />
            <button className="btn btn-primary" style={{justifyContent:'center'}}>登录</button>
          </form>
        )}
      </div>
    </div>
  );
};

// 添加作品弹窗
const AddWorkModal = ({ onClose, onAdd }) => {
  const [data, setData] = useState({ title: '', description: '', date: '', imageUrl: '', videoUrl: '' });
  const handleSubmit = (e) => { e.preventDefault(); onAdd(data); onClose(); };
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="glass" style={{padding:'30px', borderRadius:'20px', width:'400px', background:'white', position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute', top:'15px', right:'15px', border:'none', background:'none', cursor:'pointer'}}><X size={20}/></button>
        <h3 style={{marginBottom:'20px'}}>发布新作品</h3>
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
          <input className="form-input" placeholder="标题" value={data.title} onChange={e=>setData({...data, title:e.target.value})} required />
          <input className="form-input" type="date" value={data.date} onChange={e=>setData({...data, date:e.target.value})} required />
          <input className="form-input" placeholder="图片链接" value={data.imageUrl} onChange={e=>setData({...data, imageUrl:e.target.value})} />
          <input className="form-input" placeholder="视频链接 (可选)" value={data.videoUrl} onChange={e=>setData({...data, videoUrl:e.target.value})} />
          <textarea className="form-input" placeholder="描述" value={data.description} onChange={e=>setData({...data, description:e.target.value})} required rows="3"></textarea>
          <button className="btn btn-primary" style={{justifyContent:'center'}}>发布</button>
        </form>
      </div>
    </div>
  );
};

// === 4. 主应用程序 ===

export default function App() {
  const [tab, setTab] = useState('home');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [works, setWorks] = useState([]);
  
  const runtime = useRuntime();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) signInAnonymously(auth).catch(console.error);
    });
    const q = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'works'), orderBy('date', 'desc'));
    const unsubData = onSnapshot(q, (snap) => {
      setWorks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubAuth(); unsubData(); };
  }, []);

  const handleLogin = (e, p) => signInWithEmailAndPassword(auth, e, p).then(() => setShowLogin(false)).catch(err => alert("登录失败: " + err.message));
  const handleLogout = () => signOut(auth).then(() => setShowLogin(false));
  const handleAddWork = async (data) => {
    await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'works'), { ...data, createdAt: serverTimestamp() });
  };
  const handleDeleteWork = async (id) => {
    if(confirm('确定删除吗？')) await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'works', id));
  };

  return (
    <>
      <Navbar tab={tab} setTab={setTab} user={user} onLoginClick={() => setShowLogin(true)} />
      
      <main style={{paddingBottom: '100px'}}>
        {tab === 'home' && <HomeSection />}
        {tab === 'works' && <WorksSection works={works} user={user} onDelete={handleDeleteWork} />}
        {tab === 'contact' && <ContactSection />}
      </main>

      <footer className="glass" style={{
        margin: '0 auto',
        marginTop: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.3)',
        padding: '30px 20px',
        width: '100%',
        textAlign: 'center',
        background: 'linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0.6))'
      }}>
        <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'}}>
          <div style={{display: 'flex', gap: '30px'}}>
            <a href="https://github.com/Je1ghtxyuN" target="_blank" rel="noopener noreferrer" style={{color: '#4a5568', transition: 'transform 0.2s', display: 'flex', alignItems: 'center'}} onMouseOver={e=>e.currentTarget.style.color='#000'} onMouseOut={e=>e.currentTarget.style.color='#4a5568'}>
              <Github size={24} />
            </a>
            <a href="https://x.com/Je1ghtxyuN" target="_blank" rel="noopener noreferrer" style={{color: '#4a5568', transition: 'transform 0.2s', display: 'flex', alignItems: 'center'}} onMouseOver={e=>e.currentTarget.style.color='#1DA1F2'} onMouseOut={e=>e.currentTarget.style.color='#4a5568'}>
              <Twitter size={24} />
            </a>
            <a href="https://instagram.com/Je1ghtxyuN" target="_blank" rel="noopener noreferrer" style={{color: '#4a5568', transition: 'transform 0.2s', display: 'flex', alignItems: 'center'}} onMouseOver={e=>e.currentTarget.style.color='#E1306C'} onMouseOut={e=>e.currentTarget.style.color='#4a5568'}>
              <Instagram size={24} />
            </a>
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', 
            fontSize: '0.85rem', color: '#718096', fontWeight: '500'
          }}>
            <span>© 2025 橘京花 (Je1ghtxyuN)</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
              <Clock size={14} /> 运行: {runtime}
            </span>
          </div>
        </div>
      </footer>

      <MusicPill />

      {showLogin && <AdminModal onClose={()=>setShowLogin(false)} onLogin={handleLogin} onLogout={handleLogout} user={user} />}
      {showAdd && <AddWorkModal onClose={()=>setShowAdd(false)} onAdd={handleAddWork} />}
      
      {user && !user.isAnonymous && tab === 'works' && (
        <button 
          onClick={() => setShowAdd(true)}
          style={{position:'fixed', bottom:'150px', right:'30px', width:'50px', height:'50px', borderRadius:'50%', background:'#2d3748', color:'white', border:'none', cursor:'pointer', boxShadow:'0 4px 10px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100}}
        >
          <Plus size={24} />
        </button>
      )}
    </>
  );
}