import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
// 导入 Firebase 实例
import { auth, db } from './firebase'; 
import { 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  increment,
  setDoc,
  getDoc,
  getDocs
} from "firebase/firestore";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { 
  Home, Gamepad2, Mail, User, Lock, LogOut, 
  Trash2, Play, Pause, Send, Github, Twitter, Instagram, 
  Plus, X, Clock, Image as ImageIcon,
  Disc, BookOpen, ChevronLeft, ThumbsUp,
  Link as LinkIcon, Edit3, Save, Youtube, MessageSquare
} from 'lucide-react';

const APP_ID = 'je1ght-space-v3'; 

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Quicksand:wght@500;700&display=swap');
    
    :root {
      --primary: #ff6b9e;
      --primary-hover: #ff4785;
      --bg-gradient: linear-gradient(135deg, #fff0f5 0%, #e6e9f0 100%);
      --glass-bg: rgba(255, 255, 255, 0.75);
      --glass-border: rgba(255, 255, 255, 0.5);
      --text-main: #2d3748;
      --text-sub: #718096;
      --sidebar-width: 240px;
      --bottom-nav-height: 70px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Quicksand', 'Noto Sans SC', sans-serif;
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      overflow-x: hidden;
      padding-bottom: var(--bottom-nav-height);
    }

    /* 桌面端布局适配 */
    @media (min-width: 769px) {
      body {
        padding-left: var(--sidebar-width); 
        padding-bottom: 0;
      }
      .desktop-only-container { display: flex !important; }
      .mobile-only-container { display: none !important; }
    }
    
    @media (max-width: 768px) {
      .desktop-only-container { display: none !important; }
      .mobile-only-container { display: flex !important; }
    }

    /* 通用工具类 */
    .glass {
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
    }
    
    .btn-primary {
      background: linear-gradient(to right, var(--primary), var(--primary-hover));
      color: white;
      box-shadow: 0 4px 10px rgba(255, 107, 158, 0.3);
    }
    
    .btn-ghost { background: transparent; color: var(--text-sub); }
    .btn-ghost:hover { background: rgba(255, 107, 158, 0.1); color: var(--primary); }

    .form-input {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: rgba(255,255,255,0.9);
      transition: all 0.2s;
      font-family: inherit;
    }
    .form-input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(255, 107, 158, 0.1); }

    /* 动画 */
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spin { animation: spin 8s linear infinite; }
    .fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* === Markdown & 表格样式增强 === */
    .markdown-content { line-height: 1.8; color: #2d3748; }
    .markdown-content h1, .markdown-content h2, .markdown-content h3 { margin-top: 1.5em; margin-bottom: 0.5em; color: #1a202c; }
    .markdown-content p { margin-bottom: 1em; }
    .markdown-content img { max-width: 100%; border-radius: 8px; margin: 10px 0; }
    .markdown-content blockquote { border-left: 4px solid var(--primary); padding-left: 15px; color: #718096; background: rgba(255,255,255,0.5); padding: 10px; margin: 10px 0; border-radius: 0 8px 8px 0; }
    .markdown-content a { color: var(--primary); text-decoration: none; }
    .markdown-content a:hover { text-decoration: underline; }
    .markdown-content ul, .markdown-content ol { padding-left: 20px; margin-bottom: 1em; }
    .markdown-content code { background: rgba(255, 107, 158, 0.1); color: #d53f8c; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
    .markdown-content pre { background: #2d3748; color: #fff; padding: 15px; border-radius: 8px; overflow-x: auto; margin: 10px 0; }
    .markdown-content pre code { background: transparent; color: inherit; padding: 0; }
    
    /* 表格样式 */
    .markdown-content table { width: 100%; border-collapse: collapse; margin: 15px 0; background: rgba(255,255,255,0.5); border-radius: 8px; overflow: hidden; }
    .markdown-content th, .markdown-content td { padding: 12px; border: 1px solid rgba(0,0,0,0.1); text-align: left; }
    .markdown-content th { background: rgba(255, 107, 158, 0.1); font-weight: 600; color: #4a5568; }
    .markdown-content tr:nth-child(even) { background: rgba(255,255,255,0.3); }

    /* 评论区样式 */
    .comment-bubble {
      background: white;
      padding: 15px;
      border-radius: 12px;
      margin-bottom: 15px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
  `}</style>
);

// === 3. 辅助组件 ===

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

const VideoPlayer = ({ url }) => {
  if (!url) return null;
  let embedUrl = null;
  const bMatch = url.match(/bilibili\.com\/video\/(BV\w+)/);
  if (bMatch) embedUrl = `//player.bilibili.com/player.html?bvid=${bMatch[1]}&page=1&high_quality=1&danmaku=0`;
  const yMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)(\w+)/);
  if (yMatch) embedUrl = `https://www.youtube.com/embed/${yMatch[1]}`;

  if (embedUrl) return <iframe src={embedUrl} scrolling="no" border="0" frameBorder="no" allowFullScreen={true} style={{width:'100%', height:'100%', borderRadius:'12px'}} />;
  return <video src={url} controls style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
};

const RuntimeCounter = () => {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  
  useEffect(() => {
    const startDate = new Date('2025-06-25T00:00:00'); 
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now - startDate;
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setTime({ d, h, m, s });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{fontFamily:'monospace', fontSize:'1.4rem', fontWeight:'bold', color:'#2d3748', display:'flex', gap:'10px', justifyContent:'center'}}>
      <span>{time.d}天</span>
      <span>{time.h}时</span>
      <span>{time.m}分</span>
      <span>{time.s}秒</span>
    </div>
  );
};

// === 4. 功能组件 ===

const Sidebar = ({ tab, setTab, user, onLogin, onLogout }) => {
  const navItems = [
    { id: 'home', icon: Home, label: '主页' },
    { id: 'works', icon: Gamepad2, label: '作品' },
    { id: 'blog', icon: BookOpen, label: '博客' },
    { id: 'photos', icon: ImageIcon, label: '相册' },
    { id: 'contact', icon: Mail, label: '留言' },
  ];

  return (
    <div className="glass desktop-only-container" style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 'var(--sidebar-width)',
      padding: '30px 20px', flexDirection: 'column', zIndex: 100,
      borderRight: '1px solid rgba(255,255,255,0.5)', borderRadius: 0
    }}>
      <div style={{textAlign:'center', marginBottom:'40px'}}>
        <div style={{position:'relative', display:'inline-block'}}>
           <img src="/images/profile.jpg" onError={(e)=>e.target.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Kyoka'} 
             style={{width:'80px', height:'80px', borderRadius:'50%', border:'3px solid white', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'}} />
           <div style={{position:'absolute', bottom:0, right:0, width:'15px', height:'15px', background:'#48bb78', borderRadius:'50%', border:'2px solid white'}}></div>
        </div>
        <h2 style={{fontSize:'1.2rem', color:'#2d3748', marginTop:'10px'}}>橘京花</h2>
        <p style={{fontSize:'0.8rem', color:'#718096'}}>Je1ghtxyuN</p>
      </div>

      <nav style={{display:'flex', flexDirection:'column', gap:'10px', flex:1}}>
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`nav-item ${tab === item.id ? 'active' : ''}`}
            style={{
              display:'flex', alignItems:'center', gap:'12px', padding:'12px 15px',
              background: tab === item.id ? 'var(--primary)' : 'transparent',
              color: tab === item.id ? 'white' : '#718096',
              border:'none', borderRadius:'12px', cursor:'pointer', fontSize:'0.95rem',
              transition:'all 0.2s', fontWeight:'600', width:'100%',
              boxShadow: tab === item.id ? '0 4px 12px rgba(255, 107, 158, 0.3)' : 'none'
            }}
          >
            <item.icon size={20} /> {item.label}
          </button>
        ))}
      </nav>

      <button onClick={user && !user.isAnonymous ? onLogout : onLogin} style={{
        marginTop:'auto', display:'flex', alignItems:'center', gap:'10px', padding:'12px',
        background:'rgba(255,255,255,0.5)', borderRadius:'12px', border:'none', color:'#4a5568', cursor:'pointer', transition:'all 0.2s'
      }} onMouseOver={e=>e.currentTarget.style.background='white'}>
        {user && !user.isAnonymous ? <LogOut size={18} color="#e53e3e" /> : <Lock size={18} />}
        <span style={{fontSize:'0.9rem'}}>{user && !user.isAnonymous ? '退出登录' : '管理员登录'}</span>
      </button>
    </div>
  );
};

const BottomNav = ({ tab, setTab, user, onLogin, onLogout }) => {
  const navItems = [
    { id: 'home', icon: Home, label: '主页' },
    { id: 'works', icon: Gamepad2, label: '作品' },
    { id: 'blog', icon: BookOpen, label: '博客' },
    { id: 'photos', icon: ImageIcon, label: '相册' },
    { id: 'contact', icon: Mail, label: '留言' },
  ];

  return (
    <div className="glass mobile-only-container" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 'var(--bottom-nav-height)',
      justifyContent: 'space-around', alignItems: 'center', zIndex: 2000, 
      background: 'rgba(255,255,255,0.95)', borderTop: '1px solid rgba(0,0,0,0.05)', borderRadius: '20px 20px 0 0'
    }}>
      {navItems.map(item => (
        <button 
          key={item.id}
          onClick={() => setTab(item.id)}
          style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
            background:'none', border:'none', 
            color: tab === item.id ? 'var(--primary)' : '#cbd5e0',
            cursor:'pointer', padding:'5px'
          }}
        >
          <item.icon size={22} strokeWidth={tab === item.id ? 2.5 : 2} />
          <span style={{fontSize:'10px'}}>{item.label}</span>
        </button>
      ))}
      <button onClick={user && !user.isAnonymous ? onLogout : onLogin} style={{background:'none', border:'none', color:'#cbd5e0', padding:'5px'}}>
        {user && !user.isAnonymous ? <User size={20} color="var(--primary)"/> : <Lock size={20} />}
      </button>
    </div>
  );
};

const MusicPlayer = () => {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = (e) => {
    e.stopPropagation();
    if(playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      className="glass"
      style={{
        position: 'fixed', 
        bottom: expanded ? '100px' : '90px', 
        right: '20px', 
        width: expanded ? '280px' : '50px', 
        height: expanded ? '140px' : '50px',
        borderRadius: expanded ? '20px' : '50%',
        zIndex: 3000, 
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}
    >
      <div style={{
        opacity: expanded ? 0 : 1, position: 'absolute', 
        display: 'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%'
      }}>
        <Disc size={24} className={playing ? 'spin' : ''} color="#ff6b9e" />
      </div>

      <div style={{
        opacity: expanded ? 1 : 0, width: '100%', height: '100%', padding: '15px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        transition: 'opacity 0.3s delay 0.1s',
        visibility: expanded ? 'visible' : 'hidden'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
           <div style={{width:'50px', height:'50px', borderRadius:'8px', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
             <Disc size={30} color="#ff6b9e" className={playing ? 'spin' : ''} />
           </div>
           <div>
             <div style={{fontWeight:'bold', fontSize:'0.9rem', color:'#333'}}>夏霞</div>
             <div style={{fontSize:'0.75rem', color:'#718096'}}>あたらよ</div>
           </div>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'20px', marginTop:'auto'}}>
          <button className="btn-ghost" onClick={(e)=>e.stopPropagation()}><ChevronLeft size={20}/></button>
          <button 
            onClick={togglePlay} 
            style={{width:'40px', height:'40px', borderRadius:'50%', background:'var(--primary)', border:'none', color:'white', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(255,107,158,0.4)'}}
          >
            {playing ? <Pause size={18} fill="white"/> : <Play size={18} fill="white" style={{marginLeft:'2px'}}/>}
          </button>
          <button className="btn-ghost" onClick={(e)=>e.stopPropagation()}><ChevronLeft size={20} style={{transform:'rotate(180deg)'}}/></button>
        </div>
      </div>
      
      <audio ref={audioRef} src="/music/あたらよ - 夏霞.mp3" loop onEnded={()=>setPlaying(false)} />
    </div>
  );
};

// === 5. 主要页面组件 ===

const Footer = () => (
  <footer style={{
    marginTop: '60px', padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.5)',
    textAlign: 'center', color: '#718096', fontSize: '0.9rem'
  }}>
    <div style={{display:'flex', justifyContent:'center', gap:'25px', marginBottom:'20px'}}>
      <a href="https://github.com/Je1ghtxyuN" target="_blank" style={{color:'#4a5568', transition:'color 0.2s'}}><Github size={20}/></a>
      <a href="https://x.com" target="_blank" style={{color:'#4a5568', transition:'color 0.2s'}}><Twitter size={20}/></a>
      <a href="https://instagram.com" target="_blank" style={{color:'#4a5568', transition:'color 0.2s'}}><Instagram size={20}/></a>
      <a href="https://youtube.com" target="_blank" style={{color:'#4a5568', transition:'color 0.2s'}}><Youtube size={20}/></a>
    </div>
    <p>© 2025 橘京花 (Je1ghtxyuN). All Rights Reserved.</p>
    <p style={{fontSize:'0.8rem', marginTop:'5px', opacity:0.7}}>Powered by React & Firebase</p>
  </footer>
);

const HomeSection = ({ user }) => {
  const [profile, setProfile] = useState({
    name: 'Je1ghtxyuN',
    subtitle: 'Code, Anime, Games, and Coffee.',
    avatar: '/images/profile.jpg',
    aboutTitle: '关于我',
    aboutContent: '东南大学CS在读  \n 虚拟现实与人机交互方向，游戏开发  \n 同时也是镇守府的提督和十年葱葱人 ~ \n CS/OW/鸣潮 欢迎一起玩 ~'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'artifacts', APP_ID, 'public', 'profile');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setProfile(snap.data());
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'profile'), profile);
      setIsEditing(false);
      alert('保存成功！');
    } catch (e) {
      alert('保存失败: ' + e.message);
    }
  };

  if (loading) return <div className="container" style={{paddingTop:'100px', textAlign:'center'}}>加载中...</div>;

  const isAdmin = user && !user.isAnonymous;

  return (
    <div className="container fade-in" style={{textAlign:'center', paddingTop:'60px'}}>
      <div style={{position:'relative', display:'inline-block'}}>
        <div style={{width:'150px', height:'150px', borderRadius:'50%', margin:'0 auto 30px', padding:'5px', background:'white', boxShadow:'0 10px 25px rgba(0,0,0,0.1)'}}>
          <img src={profile.avatar} alt="Avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} onError={(e)=>e.target.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Kyoka'} />
        </div>
        {isEditing && (
          <div style={{position:'absolute', bottom:'20px', right:'0', background:'white', padding:'5px', borderRadius:'50%', boxShadow:'0 2px 10px rgba(0,0,0,0.1)'}}>
             <input className="form-input" style={{fontSize:'0.8rem', width:'200px', position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)', zIndex:10}} 
               value={profile.avatar} onChange={e=>setProfile({...profile, avatar:e.target.value})} placeholder="输入头像链接" />
             <Edit3 size={16} color="var(--primary)"/>
          </div>
        )}
      </div>

      {isEditing ? (
        <div style={{maxWidth:'400px', margin:'0 auto 20px'}}>
          <input className="form-input" value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} style={{fontSize:'1.5rem', marginBottom:'10px', textAlign:'center'}} />
          <input className="form-input" value={profile.subtitle} onChange={e=>setProfile({...profile, subtitle:e.target.value})} style={{textAlign:'center'}} />
        </div>
      ) : (
        <>
          <h1 style={{fontSize:'2.5rem', marginBottom:'10px', background: 'linear-gradient(to right, #ff6b9e, #ff3d7f)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
            {profile.name}
          </h1>
          <p style={{color:'#718096', marginBottom:'40px'}}>{profile.subtitle}</p>
        </>
      )}

      {isAdmin && (
        <div style={{marginBottom:'30px'}}>
           {isEditing ? (
             <button onClick={handleSave} className="btn btn-primary"><Save size={16}/> 保存修改</button>
           ) : (
             <button onClick={()=>setIsEditing(true)} className="btn btn-ghost" style={{border:'1px solid #cbd5e0'}}><Edit3 size={16}/> 编辑主页信息</button>
           )}
        </div>
      )}
      
      <div style={{display:'grid', gap:'20px', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', textAlign:'left'}}>
        <div className="glass" style={{padding:'25px', borderRadius:'20px', position:'relative'}}>
          <h3 style={{color:'var(--primary)', marginBottom:'15px', display:'flex', alignItems:'center', gap:'8px'}}>
            <User size={18}/> 
            {isEditing ? <input value={profile.aboutTitle} onChange={e=>setProfile({...profile, aboutTitle:e.target.value})} className="form-input" style={{width:'auto'}}/> : profile.aboutTitle}
          </h3>
          {isEditing ? (
            <textarea className="form-input" rows="5" value={profile.aboutContent} onChange={e=>setProfile({...profile, aboutContent:e.target.value})} />
          ) : (
            <div style={{lineHeight:1.8, fontSize:'0.95rem', color:'#4a5568'}}>
              <ReactMarkdown>{profile.aboutContent}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="glass" style={{padding:'25px', borderRadius:'20px'}}>
          <h3 style={{color:'var(--primary)', marginBottom:'15px', display:'flex', alignItems:'center', gap:'8px'}}>
            <Clock size={18}/> 网站运行
          </h3>
          <RuntimeCounter />
          <p style={{fontSize:'0.8rem', color:'#718096', textAlign:'center', marginTop:'10px'}}>感谢你的每一次访问 (｡•̀ᴗ-)✧</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const WorksSection = ({ user }) => {
  const [works, setWorks] = useState([]);
  const [editingWork, setEditingWork] = useState(null); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'works'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setWorks(snap.docs.map(d => ({id:d.id, ...d.data()}))));
  }, []);

  const handleDelete = async (id) => { if(confirm('确定删除？')) await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'works', id)); };
  
  // 打开添加弹窗
  const openAdd = () => {
    setEditingWork(null);
    setShowModal(true);
  };

  // 打开编辑弹窗
  const openEdit = (work) => {
    setEditingWork(work);
    setShowModal(true);
  };

  return (
    <div className="container fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'40px 0 20px'}}>
        <h2 style={{fontSize:'2rem'}}>我的作品</h2>
        {user && !user.isAnonymous && (
           <button onClick={openAdd} className="btn btn-primary" style={{padding:'8px 16px'}}><Plus size={18}/> 添加作品</button>
        )}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'25px'}}>
        {works.map(work => (
          <div key={work.id} className="glass" style={{borderRadius:'20px', overflow:'hidden', background:'white'}}>
            <div style={{height:'180px', overflow:'hidden', background:'#000'}}>
              {work.videoUrl ? <VideoPlayer url={work.videoUrl} /> : <img src={work.imageUrl || 'https://placehold.co/600x400'} style={{width:'100%', height:'100%', objectFit:'cover'}} />}
            </div>
            <div style={{padding:'20px'}}>
              <h3 style={{fontWeight:'bold', fontSize:'1.1rem', marginBottom:'5px'}}>{work.title}</h3>
              <p style={{fontSize:'0.9rem', color:'#4a5568', marginBottom:'15px', lineHeight:1.5}}>{work.description}</p>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                {work.link && <a href={work.link} target="_blank" className="btn-ghost" style={{padding:'5px 10px', fontSize:'0.8rem'}}><LinkIcon size={14}/> 访问</a>}
                {user && !user.isAnonymous && (
                  <div style={{display:'flex', gap:'5px'}}>
                     <button onClick={()=>openEdit(work)} style={{color:'#4a5568', border:'none', background:'none', cursor:'pointer'}}><Edit3 size={16}/></button>
                     <button onClick={()=>handleDelete(work.id)} style={{color:'#e53e3e', border:'none', background:'none', cursor:'pointer'}}><Trash2 size={16}/></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <WorkModal workToEdit={editingWork} onClose={()=>setShowModal(false)} />}
    </div>
  );
};

const PhotoWall = ({ user }) => {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  useEffect(() => {
    const q = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'photos'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setPhotos(snap.docs.map(d => ({id:d.id, ...d.data()}))));
  }, []);
  const handleDelete = async (id) => { if(confirm('删除照片？')) await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'photos', id)); };
  
  return (
    <div className="container fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'40px 0 20px'}}>
        <h2 style={{fontSize:'2rem'}}>My Photos</h2>
        {user && !user.isAnonymous && (
           <button onClick={()=>setShowAdd(true)} className="btn btn-primary" style={{padding:'8px 16px'}}><Plus size={18}/> 上传照片</button>
        )}
      </div>

      <div style={{columnCount: 2, columnGap: '20px'}}>
         <style>{`@media (min-width: 768px) { div[style*="columnCount"] { column-count: 3 !important; } }`}</style>
         {photos.map(photo => (
           <div key={photo.id} style={{breakInside:'avoid', marginBottom:'20px', position:'relative'}} className="glass">
             <img src={photo.url} alt={photo.desc} onClick={()=>setSelected(photo.url)} style={{width:'100%', borderRadius:'12px', cursor:'zoom-in', display:'block'}} />
             {photo.desc && <div style={{padding:'10px', fontSize:'0.9rem', color:'#555'}}>{photo.desc}</div>}
             {user && !user.isAnonymous && <button onClick={()=>handleDelete(photo.id)} style={{position:'absolute', top:'10px', right:'10px', background:'rgba(255,255,255,0.8)', borderRadius:'50%', padding:'5px', border:'none', cursor:'pointer'}}><Trash2 size={14} color="red"/></button>}
           </div>
         ))}
      </div>
      {selected && createPortal(
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}} onClick={()=>setSelected(null)}>
          <img src={selected} style={{maxWidth:'90vw', maxHeight:'90vh', borderRadius:'8px'}} />
        </div>, document.body
      )}
      {showAdd && <AddPhotoModal onClose={()=>setShowAdd(false)} />}
    </div>
  );
};

// === 新增：评论区组件 ===
const CommentSection = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, 'artifacts', APP_ID, 'public', 'data', 'posts', postId, 'comments'), 
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, snap => setComments(snap.docs.map(d => ({id:d.id, ...d.data()}))));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !nickname.trim()) return;
    
    await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'posts', postId, 'comments'), {
      nickname,
      content: newComment,
      createdAt: serverTimestamp(),
      uid: user?.uid || 'anonymous'
    });
    setNewComment('');
  };

  return (
    <div style={{marginTop:'40px', paddingTop:'20px', borderTop:'1px solid rgba(0,0,0,0.05)'}}>
      <h3 style={{marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}>
        <MessageSquare size={20}/> 评论 ({comments.length})
      </h3>
      
      {/* 评论列表 */}
      <div style={{marginBottom:'30px'}}>
        {comments.length === 0 ? <p style={{color:'#aaa', textAlign:'center'}}>还没有评论，快来抢沙发~</p> : (
          comments.map(c => (
            <div key={c.id} className="comment-bubble">
              <div style={{fontWeight:'bold', color:'var(--primary)', marginBottom:'5px', display:'flex', justifyContent:'space-between'}}>
                 <span>{c.nickname}</span>
                 <span style={{fontSize:'0.7rem', color:'#cbd5e0'}}>{c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleString() : '刚刚'}</span>
              </div>
              <div style={{color:'#4a5568', lineHeight:1.5}}>{c.content}</div>
            </div>
          ))
        )}
      </div>

      {/* 发表评论 */}
      <form onSubmit={handleSubmit} className="glass" style={{padding:'20px', borderRadius:'12px', background:'rgba(255,255,255,0.8)'}}>
         <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
           <input className="form-input" placeholder="昵称" value={nickname} onChange={e=>setNickname(e.target.value)} required style={{flex:1}} />
         </div>
         <textarea className="form-input" placeholder="说点什么吧..." rows="3" value={newComment} onChange={e=>setNewComment(e.target.value)} required />
         <div style={{textAlign:'right', marginTop:'10px'}}>
            <button className="btn btn-primary">发送评论 <Send size={14}/></button>
         </div>
      </form>
    </div>
  );
};

const BlogSection = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [activePostId, setActivePostId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = window.innerWidth < 768; 

  useEffect(() => {
    const q = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setPosts(snap.docs.map(d => ({id:d.id, ...d.data()}))));
  }, []);

  const activePost = posts.find(p => p.id === activePostId);

  // 修改：点赞逻辑（每个账号限一次）
  const handleLike = async (post) => {
    if (!user) { alert('请先登录（点击左下角锁图标）'); return; }
    
    // 检查是否已经点赞
    const likeRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'posts', post.id, 'likes', user.uid);
    const likeSnap = await getDoc(likeRef);
    
    if (likeSnap.exists()) {
      alert('这篇你已经赞过了哦 ~');
      return;
    }

    // 执行点赞
    await setDoc(likeRef, { uid: user.uid, createdAt: serverTimestamp() });
    const postRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'posts', post.id);
    await updateDoc(postRef, { likes: increment(1) });
  };

  // 新增：删除博客
  const handleDeletePost = async (e, id) => {
    e.stopPropagation();
    if (!confirm('确定要删除这篇博客吗？操作无法撤销。')) return;
    
    // 1. 删除文章本体
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'posts', id));
    if (activePostId === id) setActivePostId(null);
  };

  return (
    <div style={{display:'flex', height:'100vh', overflow:'hidden'}}>
      <div className={`glass ${(isMobile && activePostId) ? 'mobile-hidden' : ''}`} style={{
        width: isMobile ? '100%' : '300px', height: '100%', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.5)', padding: '20px',
        display: (isMobile && activePostId) ? 'none' : 'block'
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <h2 style={{fontSize:'1.5rem'}}>文章</h2>
          {user && !user.isAnonymous && <button onClick={()=>setIsEditing(true)} className="btn btn-primary" style={{padding:'5px 10px', fontSize:'0.8rem'}}><Plus size={14}/></button>}
        </div>
        {posts.map(post => (
          <div key={post.id} onClick={()=>setActivePostId(post.id)} style={{
              padding:'15px', marginBottom:'10px', borderRadius:'12px', cursor:'pointer', position:'relative',
              background: activePostId === post.id ? 'white' : 'rgba(255,255,255,0.3)',
              border: activePostId === post.id ? '1px solid var(--primary)' : '1px solid transparent',
              transition: 'all 0.2s'
            }}>
            <h4 style={{fontWeight:'bold', color:'#2d3748', paddingRight:'20px'}}>{post.title}</h4>
            <div style={{fontSize:'0.8rem', color:'#718096', display:'flex', justifyContent:'space-between', marginTop:'5px'}}>
              <span>{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</span>
              <span style={{display:'flex', alignItems:'center', gap:'4px'}}><ThumbsUp size={12}/> {post.likes || 0}</span>
            </div>
            
            {/* 只有管理员可见的删除按钮 */}
            {user && !user.isAnonymous && (
              <button 
                onClick={(e)=>handleDeletePost(e, post.id)} 
                style={{position:'absolute', top:'10px', right:'10px', border:'none', background:'none', color:'#e53e3e', cursor:'pointer'}}
              >
                <Trash2 size={14}/>
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{flex: 1, height: '100%', overflowY: 'auto', padding: '40px', background: 'rgba(255,255,255,0.4)', display: (isMobile && !activePostId) ? 'none' : 'block'}}>
        {activePost ? (
          <div className="fade-in">
            {isMobile && <button onClick={()=>setActivePostId(null)} className="btn-ghost" style={{marginBottom:'10px', paddingLeft:0}}><ChevronLeft size={18}/> 返回</button>}
            <h1 style={{fontSize:'2.5rem', marginBottom:'10px'}}>{activePost.title}</h1>
            <div style={{display:'flex', gap:'20px', color:'#718096', marginBottom:'30px', fontSize:'0.9rem'}}>
              <span>{new Date(activePost.createdAt?.seconds * 1000).toLocaleString()}</span>
              <button onClick={()=>handleLike(activePost)} style={{background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', color:'var(--primary)'}}><ThumbsUp size={16}/> ({activePost.likes || 0})</button>
            </div>
            <div className="glass" style={{padding:'30px', borderRadius:'20px', background:'white', minHeight:'60vh'}}>
              <MarkdownRenderer content={activePost.content} />
            </div>
            
            {/* 评论区 */}
            <CommentSection postId={activePost.id} user={user} />
          </div>
        ) : <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'#a0aec0'}}><BookOpen size={64} style={{marginBottom:'20px', opacity:0.5}}/></div>}
      </div>
      {isEditing && <BlogEditor onClose={()=>setIsEditing(false)} />}
    </div>
  );
};

const BlogEditor = ({ onClose }) => {
  const [title, setTitle] = useState(''); const [content, setContent] = useState('');
  const handleDrop = (e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if(file && file.name.endsWith('.md')) { const r = new FileReader(); r.onload=ev=>setContent(ev.target.result); r.readAsText(file); } };
  const handlePublish = async () => { if(!title||!content)return; await addDoc(collection(db,'artifacts',APP_ID,'public','data','posts'),{title,content,likes:0,createdAt:serverTimestamp()}); onClose(); };
  return (
    <div style={{position:'fixed', inset:0, background:'white', zIndex:2000, display:'flex', flexDirection:'column'}}>
      <div style={{padding:'15px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}><h3>写文章</h3><div><button onClick={onClose} className="btn btn-ghost">取消</button><button onClick={handlePublish} className="btn btn-primary">发布</button></div></div>
      <div style={{flex:1, padding:'20px', display:'flex', flexDirection:'column', gap:'20px'}}>
        <input className="form-input" placeholder="标题" value={title} onChange={e=>setTitle(e.target.value)} style={{fontSize:'1.5rem', border:'none', background:'transparent'}}/>
        <div style={{flex:1, border:'2px dashed #eee', borderRadius:'12px', padding:'10px'}} onDragOver={e=>e.preventDefault()} onDrop={handleDrop}>
          <textarea placeholder="Markdown 内容..." value={content} onChange={e=>setContent(e.target.value)} style={{width:'100%', height:'100%', border:'none', resize:'none', outline:'none', background:'transparent'}}/>
        </div>
      </div>
    </div>
  );
};

// 修改：支持添加和编辑的通用弹窗
const WorkModal = ({ onClose, workToEdit }) => {
  // 如果有 workToEdit，则初始化为该作品数据，否则为空
  const [data, setData] = useState(workToEdit || { title:'', description:'', date:'', imageUrl:'', videoUrl:'', link:'' });
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (workToEdit) {
      // 编辑模式：更新文档
      const docRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'works', workToEdit.id);
      await updateDoc(docRef, { ...data }); // 不更新 createdAt 以保持排序
    } else {
      // 添加模式：新建文档
      await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'works'), { ...data, createdAt: serverTimestamp() }); 
    }
    onClose(); 
  };

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="glass" style={{padding:'30px', borderRadius:'20px', width:'90%', maxWidth:'500px', background:'white'}}>
        <h3>{workToEdit ? '编辑作品' : '添加作品'}</h3>
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'12px', marginTop:'15px'}}>
          <input className="form-input" placeholder="标题" value={data.title} onChange={e=>setData({...data, title:e.target.value})} required />
          <input className="form-input" type="date" value={data.date} onChange={e=>setData({...data, date:e.target.value})} required />
          <input className="form-input" placeholder="图片链接" value={data.imageUrl} onChange={e=>setData({...data, imageUrl:e.target.value})} />
          <input className="form-input" placeholder="视频链接 (B站/YouTube)" value={data.videoUrl} onChange={e=>setData({...data, videoUrl:e.target.value})} />
          <input className="form-input" placeholder="项目链接" value={data.link} onChange={e=>setData({...data, link:e.target.value})} />
          <textarea className="form-input" placeholder="描述" value={data.description} onChange={e=>setData({...data, description:e.target.value})} required />
          <button className="btn btn-primary">{workToEdit ? '保存修改' : '提交'}</button> <button type="button" onClick={onClose} className="btn btn-ghost">取消</button>
        </form>
      </div>
    </div>
  );
};

const AddPhotoModal = ({ onClose }) => {
  const [url, setUrl] = useState(''); const [desc, setDesc] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'photos'), { url, desc, createdAt: serverTimestamp() }); onClose(); };
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="glass" style={{padding:'30px', borderRadius:'20px', width:'350px', background:'white'}}>
        <h3>添加照片</h3>
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'15px'}}>
          <input className="form-input" placeholder="URL" value={url} onChange={e=>setUrl(e.target.value)} required />
          <input className="form-input" placeholder="描述" value={desc} onChange={e=>setDesc(e.target.value)} />
          <button className="btn btn-primary">上传</button> <button type="button" onClick={onClose} className="btn btn-ghost">取消</button>
        </form>
      </div>
    </div>
  );
};

const LoginModal = ({ onClose }) => {
  const [email, setE] = useState(''); const [pass, setP] = useState('');
  const handleLogin = (e) => { e.preventDefault(); signInWithEmailAndPassword(auth, email, pass).then(onClose).catch(e=>alert(e.message)); };
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="glass" style={{padding:'30px', borderRadius:'20px', width:'300px', background:'white', position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute', top:'10px', right:'10px', border:'none', background:'none', cursor:'pointer'}}><X size={20}/></button>
        <h3 style={{marginBottom:'20px', textAlign:'center'}}>管理员登录</h3>
        <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
          <input className="form-input" type="email" placeholder="邮箱" value={email} onChange={e=>setE(e.target.value)} />
          <input className="form-input" type="password" placeholder="密码" value={pass} onChange={e=>setP(e.target.value)} />
          <button className="btn btn-primary" style={{justifyContent:'center'}}>登录</button>
        </form>
      </div>
    </div>
  );
};

const ContactSection = () => (
    <div className="contact-section fade-in container" style={{paddingTop:'50px'}}>
    <div className="contact-card glass" style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', borderRadius:'20px', overflow:'hidden',
        boxShadow:'0 10px 30px rgba(0,0,0,0.1)', maxWidth:'900px', margin:'0 auto', background:'white'
    }}>
      <style>{`@media(max-width:768px){.contact-card{grid-template-columns:1fr !important;}}`}</style>
      <div className="contact-info" style={{background:'linear-gradient(135deg, var(--primary), var(--primary-hover))', padding:'40px', color:'white'}}>
        <h2 style={{fontSize:'2rem', marginBottom:'20px'}}>留言板 ✨</h2>
        <p style={{opacity:0.9, lineHeight:1.6}}>欢迎来到窝的空间！<br/>留下泥的想对窝说的话吧～</p>
      </div>
      <div className="contact-form" style={{padding:'40px'}}>
        <form action="https://formspree.io/f/mkgbpnbb" method="POST" style={{display:'flex', flexDirection:'column', gap:'20px'}}>
          <input type="text" name="nickname" className="form-input" placeholder="昵称" required />
          <input type="text" name="contact" className="form-input" placeholder="联系方式" />
          <textarea name="message" className="form-input" rows="5" placeholder="留言内容..." required></textarea>
          <button type="submit" className="btn btn-primary" style={{justifyContent:'center'}}>发送 <Send size={18} /></button>
        </form>
      </div>
    </div>
  </div>
);

// === 6. App 入口 ===
export default function App() {
  const [tab, setTab] = useState('home');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) signInAnonymously(auth).catch(console.error);
    });
    return unsub;
  }, []);

  const handleLogout = () => signOut(auth);

  return (
    <>
      <GlobalStyles />
      <Sidebar tab={tab} setTab={setTab} user={user} onLogin={()=>setShowLogin(true)} onLogout={handleLogout} />
      <main style={{ minHeight: '100vh', position: 'relative' }}>
        {tab === 'home' && <HomeSection user={user} />}
        {tab === 'works' && <WorksSection user={user} />}
        {tab === 'photos' && <PhotoWall user={user} />}
        {tab === 'blog' && <BlogSection user={user} />}
        {tab === 'contact' && <ContactSection />}
      </main>
      <BottomNav tab={tab} setTab={setTab} user={user} onLogin={()=>setShowLogin(true)} onLogout={handleLogout} />
      <MusicPlayer />
      {showLogin && <LoginModal onClose={()=>setShowLogin(false)} />}
    </>
  );
}