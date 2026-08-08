import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  updateProfileApi, createProjectApi, updateProjectApi, deleteProjectApi,
  createExperienceApi, updateExperienceApi, deleteExperienceApi,
  createSkillApi, updateSkillApi, deleteSkillApi, updateContactApi, uploadMediaApi 
} from '../services/api';
import { 
  User, LayoutGrid, Briefcase, Cpu, PhoneCall, Upload, Plus, Trash2, Edit3, 
  Save, LogOut, CheckCircle, ExternalLink, Globe, Figma, Github, Shield
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, refreshData } = usePortfolio();
  const [activeTab, setActiveTab] = useState('profile');
  const [statusMsg, setStatusMsg] = useState('');

  // Form states
  const [profileForm, setProfileForm] = useState(data.profile || {});
  const [contactForm, setContactForm] = useState(data.contact || {});
  
  // Project editing
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: ''
  });

  // Experience editing
  const [editingExp, setEditingExp] = useState(null);
  const [expForm, setExpForm] = useState({ company: '', role: '', duration: '', desc: '' });

  // Skill editing
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', category: '', icon: 'Code2', bg: 'bg-foreground/10', color: 'text-foreground' });

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

  const showNotification = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Image File Upload to MinIO
  const handleFileUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showNotification('Uploading asset to MinIO storage...');
      const res = await uploadMediaApi(file);
      if (res && res.url) {
        callback(res.url);
        showNotification('File uploaded successfully to MinIO!');
      }
    } catch (err) {
      showNotification('MinIO upload error: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfileApi(profileForm);
      await refreshData();
      showNotification('Profile & Hero details saved!');
    } catch (err) {
      showNotification('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Contact
  const handleSaveContact = async (e) => {
    e.preventDefault();
    try {
      await updateContactApi(contactForm);
      await refreshData();
      showNotification('Contact information updated!');
    } catch (err) {
      showNotification('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Project (Create / Update)
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
        showNotification('Project updated!');
      } else {
        await createProjectApi(payload);
        showNotification('New project added!');
      }
      setEditingProject(null);
      setProjectForm({ title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: '' });
      await refreshData();
    } catch (err) {
      showNotification('Project save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete Project
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
      setEditingSkill(null);
      setSkillForm({ name: '', category: '', icon: 'Code2', bg: 'bg-foreground/10', color: 'text-foreground' });
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
              <Shield size={20} className="text-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight text-foreground">CMS Dashboard</h2>
              <span className="text-[11px] text-muted-foreground">Admin Workspace</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'profile', label: 'Profile & Hero', icon: User },
              { id: 'projects', label: 'Projects', icon: LayoutGrid },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'skills', label: 'Skills', icon: Cpu },
              { id: 'contact', label: 'Contact Details', icon: PhoneCall }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-foreground text-background shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-border space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            <ExternalLink size={14} />
            <span>View Live Site</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-6xl">
        
        {statusMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* TAB 1: Profile & Hero */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Profile & Hero Banner</h1>
              <p className="text-xs text-muted-foreground">Manage display name, titles, location, and intro statement.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-card border border-border p-6 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={profileForm.name || ''}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-2">Job Title / Subtitle</label>
                  <input
                    type="text"
                    value={profileForm.title || ''}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-2">Resume / CV Download Link</label>
                  <input
                    type="text"
                    value={profileForm.resumeUrl || ''}
                    onChange={e => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/80 mb-2">Hero Intro Statement</label>
                <textarea
                  rows={4}
                  value={profileForm.statement || ''}
                  onChange={e => setProfileForm({ ...profileForm, statement: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.availableForWork ?? true}
                    onChange={e => setProfileForm({ ...profileForm, availableForWork: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-xs font-semibold">Available for Work Badge</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Projects Gallery</h1>
                <p className="text-xs text-muted-foreground">Add, edit, or delete portfolio projects and uploaded images.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm({ title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: '' });
                }}
                className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus size={14} />
                <span>Add Project</span>
              </button>
            </div>

            {/* Project Edit/Add Form */}
            <form onSubmit={handleSaveProject} className="bg-card border border-border p-6 rounded-2xl space-y-6">
              <h3 className="text-sm font-bold text-foreground">
                {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Project'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold mb-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">Category Type</label>
                  <select
                    value={projectForm.type}
                    onChange={e => setProjectForm({ ...projectForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  >
                    <option value="website">Web (Website)</option>
                    <option value="ui/ux">Design (UI/UX)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">Image URL / MinIO Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={projectForm.image}
                      onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                      placeholder="/assets/snippit.png or MinIO URL"
                    />
                    <label className="px-3 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-xl cursor-pointer flex items-center justify-center shrink-0">
                      <Upload size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileUpload(e, url => setProjectForm({ ...projectForm, image: url }))}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(projectForm.technologies) ? projectForm.technologies.join(', ') : projectForm.technologies}
                    onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                    placeholder="React, Tailwind, Figma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">Live Demo URL</label>
                  <input
                    type="text"
                    value={projectForm.live || ''}
                    onChange={e => setProjectForm({ ...projectForm, live: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={projectForm.github || ''}
                    onChange={e => setProjectForm({ ...projectForm, github: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-2">Figma Design URL</label>
                  <input
                    type="text"
                    value={projectForm.figma || ''}
                    onChange={e => setProjectForm({ ...projectForm, figma: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                    placeholder="https://figma.com/..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={projectForm.description}
                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                {editingProject && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({ title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: '' });
                    }}
                    className="px-4 py-2 bg-muted text-muted-foreground text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 shadow-md"
                >
                  {editingProject ? 'Update Project' : 'Save Project'}
                </button>
              </div>
            </form>

            {/* Projects List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(data.projects || []).map(p => (
                <div key={p.id} className="bg-card border border-border p-4 rounded-xl flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img src={p.image} alt={p.title} className="w-16 h-12 object-cover rounded-lg bg-muted shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{p.title}</h4>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground px-2 py-0.5 bg-muted rounded-md inline-block my-1">
                        {p.type}
                      </span>
                      <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingProject(p);
                        setProjectForm(p);
                      }}
                      className="p-2 hover:bg-muted rounded-lg text-foreground"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Work Experience</h1>
                <p className="text-xs text-muted-foreground">Manage work history and roles.</p>
              </div>
              <button
                onClick={() => {
                  setEditingExp(null);
                  setExpForm({ company: '', role: '', duration: '', desc: '' });
                }}
                className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus size={14} />
                <span>Add Entry</span>
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="bg-card border border-border p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-foreground">
                {editingExp ? `Edit: ${editingExp.company}` : 'Add Experience Entry'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  required
                  value={expForm.company}
                  onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                  className="px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                />
                <input
                  type="text"
                  placeholder="Role Title"
                  required
                  value={expForm.role}
                  onChange={e => setExpForm({ ...expForm, role: e.target.value })}
                  className="px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 2026 - current)"
                  required
                  value={expForm.duration}
                  onChange={e => setExpForm({ ...expForm, duration: e.target.value })}
                  className="px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                />
                <div className="md:col-span-3">
                  <textarea
                    rows={3}
                    placeholder="Description of achievements and responsibilities..."
                    value={expForm.desc}
                    onChange={e => setExpForm({ ...expForm, desc: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="submit" className="px-6 py-2 bg-foreground text-background font-bold text-xs rounded-xl">
                  {editingExp ? 'Update' : 'Save'}
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {(data.experiences || []).map(e => (
                <div key={e.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{e.company} <span className="font-normal text-muted-foreground">({e.role})</span></h4>
                    <span className="text-xs font-semibold text-muted-foreground">{e.duration}</span>
                    <p className="text-xs text-foreground/80 mt-1">{e.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => { setEditingExp(e); setExpForm(e); }} className="p-2 hover:bg-muted rounded-lg text-foreground"><Edit3 size={15} /></button>
                    <button onClick={() => handleDeleteExperience(e.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Skills Matrix</h1>
              <p className="text-xs text-muted-foreground">Manage technical competencies and categories.</p>
            </div>

            <form onSubmit={handleSaveSkill} className="bg-card border border-border p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-foreground">{editingSkill ? `Edit Skill: ${editingSkill.name}` : 'Add Skill'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Skill Name (e.g. React)"
                  required
                  value={skillForm.name}
                  onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Frontend Framework)"
                  required
                  value={skillForm.category}
                  onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-foreground text-background font-bold text-xs rounded-xl">
                  {editingSkill ? 'Update' : 'Save'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(data.skills || []).map(s => (
                <div key={s.id || s.name} className="bg-card border border-border p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-foreground">{s.name}</h5>
                    <span className="text-[10px] text-muted-foreground">{s.category}</span>
                  </div>
                  <button onClick={() => handleDeleteSkill(s.id)} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Contact */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Contact & Social Links</h1>
              <p className="text-xs text-muted-foreground">Manage location, email, and social profiles.</p>
            </div>

            <form onSubmit={handleSaveContact} className="bg-card border border-border p-6 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold mb-2">Location Header</label>
                  <input
                    type="text"
                    value={contactForm.location || ''}
                    onChange={e => setContactForm({ ...contactForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={contactForm.email || ''}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">LinkedIn URL</label>
                  <input
                    type="text"
                    value={contactForm.linkedin || ''}
                    onChange={e => setContactForm({ ...contactForm, linkedin: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.github || ''}
                    onChange={e => setContactForm({ ...contactForm, github: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">Figma Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.figma || ''}
                    onChange={e => setContactForm({ ...contactForm, figma: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">Twitter Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.twitter || ''}
                    onChange={e => setContactForm({ ...contactForm, twitter: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save size={14} />
                  <span>Save Contact Details</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};
