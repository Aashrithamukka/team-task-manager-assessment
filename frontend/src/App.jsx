import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FolderPlus, LogOut, Plus, RefreshCw, UserPlus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '');
const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];

function readStoredAuth() {
  if (typeof localStorage === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('auth') || 'null');
  } catch {
    localStorage.removeItem('auth');
    return null;
  }
}

function writeStoredAuth(data) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('auth', JSON.stringify(data));
  }
}

function clearStoredAuth() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('auth');
  }
}

function request(path, options = {}, token) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  }).then(async (response) => {
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.message || 'Request failed');
    return data;
  });
}

export default function App() {
  const [auth, setAuth] = useState(readStoredAuth);
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const token = auth?.token;

  const isAdmin = auth?.role === 'ADMIN';

  async function loadData() {
    if (!token) return;
    const [dashboardData, projectData, taskData] = await Promise.all([
      request('/api/dashboard', {}, token),
      request('/api/projects', {}, token),
      request('/api/tasks', {}, token)
    ]);
    setStats(dashboardData);
    setProjects(projectData);
    setTasks(taskData);
    if (isAdmin) {
      setUsers(await request('/api/users', {}, token));
    }
  }

  useEffect(() => {
    loadData().catch((error) => setMessage(error.message));
  }, [token]);

  function saveAuth(data) {
    writeStoredAuth(data);
    setAuth(data);
    setMessage('');
  }

  function logout() {
    clearStoredAuth();
    setAuth(null);
    setStats(null);
    setProjects([]);
    setTasks([]);
    setUsers([]);
  }

  return (
    <main className="app-shell">
      {!auth ? (
        <AuthPanel mode={mode} setMode={setMode} saveAuth={saveAuth} setMessage={setMessage} message={message} />
      ) : (
        <>
          <header className="topbar">
            <div>
              <p className="eyebrow">Team Task Manager</p>
              <h1>Welcome, {auth.name}</h1>
            </div>
            <div className="topbar-actions">
              <span className="role-pill">{auth.role}</span>
              <button className="icon-button" onClick={() => loadData()} title="Refresh">
                <RefreshCw size={18} />
              </button>
              <button className="icon-button" onClick={logout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </header>

          {message && <p className="alert">{message}</p>}

          <StatsGrid stats={stats} />

          <section className="workspace-grid">
            {isAdmin && (
              <AdminPanel
                token={token}
                users={users}
                projects={projects}
                onDone={loadData}
                setMessage={setMessage}
              />
            )}
            <ProjectList projects={projects} users={users} />
            <TaskList tasks={tasks} projects={projects} users={users} token={token} onDone={loadData} setMessage={setMessage} />
          </section>
        </>
      )}
    </main>
  );
}

function AuthPanel({ mode, setMode, saveAuth, setMessage, message }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const isSignup = mode === 'signup';

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = isSignup ? form : { email: form.email, password: form.password };
      const data = await request(`/api/auth/${isSignup ? 'signup' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      saveAuth(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <p className="eyebrow">Full-stack assessment</p>
        <h1>Team Task Manager</h1>
        <p>Manage projects, assign work, and track progress with Admin and Member access.</p>
      </div>
      <form className="panel auth-card" onSubmit={submit}>
        <div className="segmented">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Login
          </button>
          <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
            Signup
          </button>
        </div>
        {isSignup && (
          <label>
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        {isSignup && (
          <label>
            Role
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
        )}
        {message && <p className="alert">{message}</p>}
        <button className="primary-button" type="submit">
          {isSignup ? <UserPlus size={18} /> : <CheckCircle2 size={18} />}
          {isSignup ? 'Create Account' : 'Login'}
        </button>
      </form>
    </section>
  );
}

function StatsGrid({ stats }) {
  const items = [
    ['Total', stats?.totalTasks ?? 0],
    ['Todo', stats?.todoTasks ?? 0],
    ['In progress', stats?.inProgressTasks ?? 0],
    ['Done', stats?.completedTasks ?? 0],
    ['Overdue', stats?.overdueTasks ?? 0]
  ];
  return (
    <section className="stats-grid">
      {items.map(([label, value]) => (
        <div className="metric" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}

function AdminPanel({ token, users, projects, onDone, setMessage }) {
  const memberOptions = users.filter((user) => user.role === 'MEMBER');
  const [project, setProject] = useState({ name: '', description: '', memberIds: [] });
  const [task, setTask] = useState({ title: '', description: '', projectId: '', assignedToId: '', dueDate: '', status: 'TODO' });

  const selectedProject = projects.find((item) => item.id === task.projectId);
  const assignableUsers = selectedProject
    ? memberOptions.filter((user) => selectedProject.memberIds.includes(user.id))
    : memberOptions;

  async function createProject(event) {
    event.preventDefault();
    try {
      await request('/api/projects', { method: 'POST', body: JSON.stringify(project) }, token);
      setProject({ name: '', description: '', memberIds: [] });
      await onDone();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createTask(event) {
    event.preventDefault();
    try {
      await request('/api/tasks', { method: 'POST', body: JSON.stringify(task) }, token);
      setTask({ title: '', description: '', projectId: '', assignedToId: '', dueDate: '', status: 'TODO' });
      await onDone();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="panel admin-panel">
      <h2>Admin actions</h2>
      <form onSubmit={createProject}>
        <h3>Create project</h3>
        <input placeholder="Project name" value={project.name} onChange={(event) => setProject({ ...project, name: event.target.value })} required />
        <textarea placeholder="Description" value={project.description} onChange={(event) => setProject({ ...project, description: event.target.value })} />
        <select
          multiple
          value={project.memberIds}
          onChange={(event) => setProject({ ...project, memberIds: Array.from(event.target.selectedOptions, (option) => option.value) })}
        >
          {memberOptions.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <button className="primary-button" type="submit"><FolderPlus size={18} />Create Project</button>
      </form>
      <form onSubmit={createTask}>
        <h3>Create task</h3>
        <input placeholder="Task title" value={task.title} onChange={(event) => setTask({ ...task, title: event.target.value })} required />
        <textarea placeholder="Description" value={task.description} onChange={(event) => setTask({ ...task, description: event.target.value })} />
        <select value={task.projectId} onChange={(event) => setTask({ ...task, projectId: event.target.value, assignedToId: '' })} required>
          <option value="">Select project</option>
          {projects.map((projectItem) => <option key={projectItem.id} value={projectItem.id}>{projectItem.name}</option>)}
        </select>
        <select value={task.assignedToId} onChange={(event) => setTask({ ...task, assignedToId: event.target.value })} required>
          <option value="">Assign member</option>
          {assignableUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
        <input type="date" value={task.dueDate} onChange={(event) => setTask({ ...task, dueDate: event.target.value })} />
        <button className="primary-button" type="submit"><Plus size={18} />Create Task</button>
      </form>
    </section>
  );
}

function ProjectList({ projects, users }) {
  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  return (
    <section className="panel">
      <h2>Projects</h2>
      <div className="list">
        {projects.map((project) => (
          <article className="list-item" key={project.id}>
            <strong>{project.name}</strong>
            <p>{project.description || 'No description added'}</p>
            <small>{project.memberIds?.map((id) => usersById.get(id)?.name).filter(Boolean).join(', ') || 'Members assigned'}</small>
          </article>
        ))}
        {projects.length === 0 && <p className="empty">No projects yet.</p>}
      </div>
    </section>
  );
}

function TaskList({ tasks, projects, users, token, onDone, setMessage }) {
  const projectsById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);

  async function updateStatus(taskId, status) {
    try {
      await request(`/api/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token);
      await onDone();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="panel task-panel">
      <h2>Tasks</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <article className="task-card" key={task.id}>
            <div>
              <strong>{task.title}</strong>
              <p>{task.description || 'No description added'}</p>
              <small>{projectsById.get(task.projectId)?.name || 'Project'} · {usersById.get(task.assignedToId)?.name || 'Assigned member'} · Due {task.dueDate || 'not set'}</small>
            </div>
            <select value={task.status} onChange={(event) => updateStatus(task.id, event.target.value)}>
              {statuses.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
            </select>
          </article>
        ))}
        {tasks.length === 0 && <p className="empty">No tasks yet.</p>}
      </div>
    </section>
  );
}
