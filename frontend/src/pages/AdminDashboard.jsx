import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  updateProfileApi, createProjectApi, updateProjectApi, deleteProjectApi,
  createExperienceApi, updateExperienceApi, deleteExperienceApi,
  createSkillApi, updateSkillApi, deleteSkillApi, updateContactApi, 
  uploadMediaApi, fetchMediaApi, deleteMediaApi 
} from '../services/api';
import { 
  User, LayoutGrid, Briefcase, Cpu, PhoneCall, Upload, Plus, Trash2, Edit3, 
  Save, LogOut, CheckCircle, ExternalLink, Shield, Image, Copy, HardDrive, Check,
  Eye, Sliders, Search, X, Sparkles, Layers, ArrowUpRight, FolderGit2
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, refreshData } = usePortfolio();
  const [activeTab, setActiveTab] = useState('overview');
  const [statusMsg, setStatusMsg] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');

  // Media Library State
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState(data.profile || {});
  const [contactForm, setContactForm] = useState(data.contact || {});
  
  // Project editing modal & search
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilterType, setProjectFilterType] = useState('all');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: ''
  });

  // Experience modal
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [expForm, setExpForm] = useState({ company: '', role: '', duration: '', desc: '' });

  // Skill modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend Framework', icon: 'Code2', bg: 'bg-foreground/10', color: 'text-foreground' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (data.profile) setProfileForm(data.profile);
    if (data.contact) setContactForm(data.contact);
  }, [data]);

  const loadMediaLibrary = async () => {
    try {
      setMediaLoading(true);
      const files = await fetchMediaApi();
      setMediaFiles(files || []);
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'media') {
      loadMediaLibrary();
    }
  }, [activeTab]);

  const showNotification = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showNotification('Image URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(''), 2500);
  };

  // Image Upload Handler
  const handleFileUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showNotification('Uploading asset to MinIO storage...');
      const res = await uploadMediaApi(file);
      const uploadedUrl = res.url || res;
      if (uploadedUrl) {
        if (callback) callback(uploadedUrl);
        showNotification('File uploaded successfully to MinIO!');
        if (activeTab === 'media') loadMediaLibrary();
      }
    } catch (err) {
      showNotification('MinIO upload error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteMedia = async (key) => {
    if (!window.confirm('Permanently delete this file from MinIO storage?')) return;
    try {
      await deleteMediaApi(key);
      showNotification('File deleted from MinIO.');
      loadMediaLibrary();
    } catch (err) {
      showNotification('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Profile & Section Visibility
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfileApi(profileForm);
      await refreshData();
      showNotification('Profile & Section settings saved successfully!');
    } catch (err) {
      showNotification('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Contact Details
  const handleSaveContact = async (e) => {
    e.preventDefault();
    try {
      await updateContactApi(contactForm);
      await refreshData();
      showNotification('Contact information updated successfully!');
    } catch (err) {
      showNotification('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...projectForm,
        technologies: typeof projectForm.technologies === 'string' 
          ? projectForm.technologies.split(',').map(t => t.trim()) 
          : projectForm.technologies
      };
      if (editingProject) {
        await updateProjectApi(editingProject.id, payload);
        showNotification('Project updated successfully!');
      } else {
        await createProjectApi(payload);
        showNotification('New project added successfully!');
      }
      setIsProjectModalOpen(false);
      setEditingProject(null);
      setProjectForm({ title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: '' });
      await refreshData();
    } catch (err) {
      showNotification('Project save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProjectApi(id);
      await refreshData();
      showNotification('Project removed.');
    } catch (err) {
      showNotification('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const openProjectModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        title: proj.title || '',
        type: proj.type || 'website',
        image: proj.image || '',
        description: proj.description || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || '',
        github: proj.github || '',
        live: proj.live || '',
        figma: proj.figma || ''
      });
    } else {
      setEditingProject(null);
      setProjectForm({ title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: '' });
    }
    setIsProjectModalOpen(true);
  };

  // Save Experience
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await updateExperienceApi(editingExp.id, expForm);
        showNotification('Experience updated!');
      } else {
        await createExperienceApi(expForm);
        showNotification('New experience added!');
      }
      setIsExpModalOpen(false);
      setEditingExp(null);
      setExpForm({ company: '', role: '', duration: '', desc: '' });
      await refreshData();
    } catch (err) {
      showNotification('Experience save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await deleteExperienceApi(id);
      await refreshData();
      showNotification('Experience deleted.');
    } catch (err) {
      showNotification('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const openExpModal = (exp = null) => {
    if (exp) {
      setEditingExp(exp);
      setExpForm({ company: exp.company || '', role: exp.role || '', duration: exp.duration || '', desc: exp.desc || '' });
    } else {
      setEditingExp(null);
      setExpForm({ company: '', role: '', duration: '', desc: '' });
    }
    setIsExpModalOpen(true);
  };

  // Save Skill
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkillApi(editingSkill.id, skillForm);
        showNotification('Skill updated!');
      } else {
        await createSkillApi(skillForm);
        showNotification('New skill added!');
      }
      setIsSkillModalOpen(false);
      setEditingSkill(null);
      setSkillForm({ name: '', category: 'Frontend Framework', icon: 'Code2', bg: 'bg-foreground/10', color: 'text-foreground' });
      await refreshData();
    } catch (err) {
      showNotification('Skill save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await deleteSkillApi(id);
      await refreshData();
      showNotification('Skill removed.');
    } catch (err) {
      showNotification('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const openSkillModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({ name: skill.name || '', category: skill.category || '', icon: skill.icon || 'Code2', bg: skill.bg || 'bg-foreground/10', color: skill.color || 'text-foreground' });
    } else {
      setEditingSkill(null);
      setSkillForm({ name: '', category: 'Frontend Framework', icon: 'Code2', bg: 'bg-foreground/10', color: 'text-foreground' });
    }
    setIsSkillModalOpen(true);
  };

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview & Controls', icon: Sliders, badge: 'Main' },
    { id: 'profile', label: 'Profile & Hero', icon: User },
    { id: 'projects', label: 'Projects Portfolio', icon: LayoutGrid, count: data.projects?.length || 0 },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, count: data.experiences?.length || 0 },
    { id: 'skills', label: 'Skills & Stack', icon: Cpu, count: data.skills?.length || 0 },
    { id: 'contact', label: 'Contact & Socials', icon: PhoneCall },
    { id: 'media', label: 'Media Repository', icon: Image, badge: 'S3' },
  ];

  // Filtered projects
  const filteredProjects = (data.projects || []).filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(projectSearch.toLowerCase()) || 
                          p.description?.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesType = projectFilterType === 'all' || p.type === projectFilterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-72 bg-card border-r border-border p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-border">
            <div className="w-11 h-11 rounded-2xl bg-foreground text-background flex items-center justify-center font-extrabold text-lg shadow-md">
              H
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight text-foreground">CMS Studio</h2>
              <span className="text-xs text-muted-foreground">Humayra Arzooman Admin</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-foreground text-background font-bold shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-background/20 text-background' : 'bg-muted border border-border text-foreground/70'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && !item.badge && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-border space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-semibold text-foreground/80 hover:text-foreground bg-muted/50 hover:bg-muted p-3 rounded-xl border border-border transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={15} />
              <span>Live Website</span>
            </div>
            <ArrowUpRight size={14} className="text-muted-foreground" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl mx-auto">
        
        {/* Status Toast Alert */}
        {statusMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle size={17} />
              <span>{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg('')} className="text-emerald-600 dark:text-emerald-400 hover:opacity-75">
              <X size={15} />
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW & SECTION VISIBILITY CONTROLS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Dashboard Overview & Controls</h1>
              <p className="text-xs text-muted-foreground mt-1">Manage live portfolio status, section visibility toggles, and system metrics.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Projects</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">{data.projects?.length || 0}</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <LayoutGrid size={22} />
                </div>
              </div>

              <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Experience Items</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">{data.experiences?.length || 0}</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Briefcase size={22} />
                </div>
              </div>

              <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Skill Badges</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">{data.skills?.length || 0}</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Cpu size={22} />
                </div>
              </div>

              <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">MinIO Storage</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">Active</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <HardDrive size={22} />
                </div>
              </div>
            </div>

            {/* Section Visibility Controls Form */}
            <form onSubmit={handleSaveProfile} className="bg-card border border-border p-8 rounded-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Eye size={18} className="text-emerald-500" />
                    <span>Section Visibility Toggles</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Control which sections appear on the live website in real time.</p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Save size={14} />
                  <span>Save Visibility Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {[
                  { key: 'showHero', label: 'Hero / About Section', desc: 'Main banner, display name, and intro statement' },
                  { key: 'showProjects', label: 'Projects Gallery', desc: 'Showcase grid of websites and UI/UX work' },
                  { key: 'showExperience', label: 'Work Experience', desc: 'Career timeline & leadership history' },
                  { key: 'showSkills', label: 'Skills & Stack Matrix', desc: 'Categorized technical capabilities & tools' },
                  { key: 'showGithub', label: 'GitHub Activity', desc: 'Live contribution heatmap & commit counters' },
                  { key: 'showContact', label: 'Contact & Footer', desc: 'Office image, inquiry form & social links' },
                ].map((sec) => (
                  <label 
                    key={sec.key} 
                    className={`flex items-start gap-3.5 p-4 rounded-2xl cursor-pointer border transition-all ${
                      profileForm[sec.key] !== false 
                        ? 'bg-foreground/5 border-foreground/30 shadow-xs' 
                        : 'bg-muted/40 border-border opacity-75'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={profileForm[sec.key] !== false}
                      onChange={e => setProfileForm({ ...profileForm, [sec.key]: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-foreground block">{sec.label}</span>
                      <span className="text-[11px] text-muted-foreground block mt-0.5 leading-snug">{sec.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: PROFILE & HERO */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Profile & Personal Identity</h1>
              <p className="text-xs text-muted-foreground mt-1">Manage display name, professional titles, location, and intro statement.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-card border border-border p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={profileForm.name || ''}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Job Title / Subtitle</label>
                  <input
                    type="text"
                    value={profileForm.title || ''}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Resume / CV Download Link</label>
                  <input
                    type="text"
                    value={profileForm.resumeUrl || ''}
                    onChange={e => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/90 mb-2">Hero Intro Statement</label>
                <textarea
                  rows={4}
                  value={profileForm.statement || ''}
                  onChange={e => setProfileForm({ ...profileForm, statement: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm leading-relaxed font-medium focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.availableForWork ?? true}
                    onChange={e => setProfileForm({ ...profileForm, availableForWork: e.target.checked })}
                    className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                  />
                  <span className="text-xs font-bold">Show "Available for Work" Badge</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save size={15} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PROJECTS PORTFOLIO */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Projects Portfolio</h1>
                <p className="text-xs text-muted-foreground mt-1">Manage and organize your portfolio showcase items.</p>
              </div>
              <button
                onClick={() => openProjectModal()}
                className="px-5 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus size={16} />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={e => setProjectSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setProjectFilterType('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    projectFilterType === 'all' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  All ({data.projects?.length || 0})
                </button>
                <button
                  onClick={() => setProjectFilterType('website')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    projectFilterType === 'website' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  Websites
                </button>
                <button
                  onClick={() => setProjectFilterType('ui/ux')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    projectFilterType === 'ui/ux' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  UI/UX
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((proj) => (
                <div key={proj.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-foreground/40 transition-colors">
                  <div>
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-foreground">
                          {proj.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-foreground">{proj.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{proj.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(proj.technologies || []).map((tech, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-muted border border-border rounded-md text-[10px] font-semibold text-foreground/80">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                      {proj.live && <a href={proj.live} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Live demo ↗</a>}
                      {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub ↗</a>}
                      {proj.figma && <a href={proj.figma} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Figma ↗</a>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openProjectModal(proj)}
                        className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Modal / Drawer */}
            {isProjectModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingProject ? 'Edit Project Details' : 'Add New Project'}
                    </h3>
                    <button onClick={() => setIsProjectModalOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Project Category</label>
                        <select
                          value={projectForm.type}
                          onChange={e => setProjectForm({ ...projectForm, type: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                        >
                          <option value="website">Website / Full Stack</option>
                          <option value="ui/ux">UI/UX Design</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Cover Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={projectForm.image}
                          onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                          className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                          placeholder="MinIO image URL or /assets/..."
                        />
                        <label className="px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-bold hover:bg-muted/80 cursor-pointer flex items-center gap-1.5">
                          <Upload size={14} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileUpload(e, url => setProjectForm({ ...projectForm, image: url }))}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={projectForm.description}
                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={projectForm.technologies}
                        onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Live URL</label>
                        <input
                          type="text"
                          value={projectForm.live}
                          onChange={e => setProjectForm({ ...projectForm, live: e.target.value })}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">GitHub Repository</label>
                        <input
                          type="text"
                          value={projectForm.github}
                          onChange={e => setProjectForm({ ...projectForm, github: e.target.value })}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Figma File</label>
                        <input
                          type="text"
                          value={projectForm.figma}
                          onChange={e => setProjectForm({ ...projectForm, figma: e.target.value })}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setIsProjectModalOpen(false)}
                        className="px-5 py-2.5 bg-muted rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WORK EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Work Experience</h1>
                <p className="text-xs text-muted-foreground mt-1">Manage career timeline and leadership history.</p>
              </div>
              <button
                onClick={() => openExpModal()}
                className="px-5 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus size={16} />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="space-y-4">
              {(data.experiences || []).map((exp) => (
                <div key={exp.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-foreground">{exp.company}</h3>
                      <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-muted border border-border text-foreground/80">
                        {exp.duration}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-500 block">{exp.role}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1 max-w-2xl">{exp.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => openExpModal(exp)}
                      className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Modal */}
            {isExpModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-card border border-border w-full max-w-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingExp ? 'Edit Experience' : 'Add Experience Entry'}
                    </h3>
                    <button onClick={() => setIsExpModalOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveExperience} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Company Name</label>
                      <input
                        type="text"
                        required
                        value={expForm.company}
                        onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Role / Position Title</label>
                      <input
                        type="text"
                        required
                        value={expForm.role}
                        onChange={e => setExpForm({ ...expForm, role: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Duration</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2026 - current"
                        value={expForm.duration}
                        onChange={e => setExpForm({ ...expForm, duration: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Description & Key Achievements</label>
                      <textarea
                        rows={3}
                        required
                        value={expForm.desc}
                        onChange={e => setExpForm({ ...expForm, desc: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setIsExpModalOpen(false)}
                        className="px-5 py-2.5 bg-muted rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer"
                      >
                        Save Entry
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SKILLS MATRIX */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Skills Matrix & Stack</h1>
                <p className="text-xs text-muted-foreground mt-1">Manage technical stack tools and capabilities badges.</p>
              </div>
              <button
                onClick={() => openSkillModal()}
                className="px-5 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus size={16} />
                <span>Add Skill Badge</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(data.skills || []).map((skill) => (
                <div key={skill.id} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{skill.name}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">{skill.category}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openSkillModal(skill)}
                      className="p-1.5 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Skill Modal */}
            {isSkillModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingSkill ? 'Edit Skill Badge' : 'Add Skill Badge'}
                    </h3>
                    <button onClick={() => setIsSkillModalOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSkill} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Skill / Tool Name</label>
                      <input
                        type="text"
                        required
                        value={skillForm.name}
                        onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Category</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UI/UX Design or Frontend Framework"
                        value={skillForm.category}
                        onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setIsSkillModalOpen(false)}
                        className="px-5 py-2.5 bg-muted rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer"
                      >
                        Save Skill
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CONTACT & SOCIAL LINKS */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Contact & Social Links</h1>
              <p className="text-xs text-muted-foreground mt-1">Manage office imagery, email, location, and social profile links.</p>
            </div>

            <form onSubmit={handleSaveContact} className="bg-card border border-border p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Office Location</label>
                  <input
                    type="text"
                    value={contactForm.location || ''}
                    onChange={e => setContactForm({ ...contactForm, location: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={contactForm.email || ''}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.github || ''}
                    onChange={e => setContactForm({ ...contactForm, github: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.linkedin || ''}
                    onChange={e => setContactForm({ ...contactForm, linkedin: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Figma Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.figma || ''}
                    onChange={e => setContactForm({ ...contactForm, figma: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Twitter Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.twitter || ''}
                    onChange={e => setContactForm({ ...contactForm, twitter: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/90 mb-2">Office / Studio Image URL</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={contactForm.officeImageUrl || ''}
                    onChange={e => setContactForm({ ...contactForm, officeImageUrl: e.target.value })}
                    className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                  <label className="px-5 py-3 bg-muted border border-border rounded-xl text-xs font-bold hover:bg-muted/80 cursor-pointer flex items-center gap-2 shrink-0">
                    <Upload size={15} />
                    <span>Upload to MinIO</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, url => setContactForm({ ...contactForm, officeImageUrl: url }))}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-border">
                <button
                  type="submit"
                  className="px-6 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save size={15} />
                  <span>Save Contact Details</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 7: MEDIA REPOSITORY */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2.5">
                  <HardDrive size={24} className="text-emerald-500" />
                  <span>MinIO Media Repository</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Manage files, images, and static assets in S3 object storage.</p>
              </div>

              <a
                href="http://localhost:9001"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-muted border border-border hover:bg-muted/80 rounded-xl text-xs font-bold text-foreground flex items-center gap-2 transition-colors"
              >
                <ExternalLink size={14} />
                <span>MinIO Console</span>
              </a>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="bg-card border-2 border-dashed border-border rounded-3xl p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-foreground/10 flex items-center justify-center mx-auto text-foreground">
                <Upload size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Upload Files to MinIO Storage</h3>
                <p className="text-xs text-muted-foreground mt-1">Direct S3 bucket sync for portfolio assets.</p>
              </div>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer shadow-md">
                <span>Select File from Computer</span>
                <input
                  type="file"
                  onChange={e => handleFileUpload(e)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Media Gallery */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Uploaded Assets ({mediaFiles.length})</h3>
                <button
                  onClick={loadMediaLibrary}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                >
                  Refresh list
                </button>
              </div>

              {mediaLoading ? (
                <p className="text-xs text-muted-foreground py-8 text-center">Loading MinIO bucket objects...</p>
              ) : mediaFiles.length === 0 ? (
                <div className="bg-card border border-border p-8 rounded-2xl text-center text-xs text-muted-foreground">
                  No uploaded files found in MinIO bucket.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaFiles.map((file) => (
                    <div key={file.key} className="bg-card border border-border rounded-2xl overflow-hidden p-3 flex flex-col justify-between space-y-3 group hover:border-foreground/40 transition-colors">
                      <div className="aspect-square bg-muted rounded-xl overflow-hidden relative">
                        <img src={file.url} alt={file.key} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-foreground block truncate" title={file.key}>{file.key}</span>
                        <span className="text-[10px] text-muted-foreground block">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <button
                          onClick={() => handleCopyUrl(file.url)}
                          className="flex-1 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-[10px] font-bold text-foreground flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedUrl === file.url ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copiedUrl === file.url ? 'Copied!' : 'Copy URL'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(file.key)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete from MinIO"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
