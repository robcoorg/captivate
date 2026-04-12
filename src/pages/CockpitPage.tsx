import { useEffect, useState, useRef } from 'react';

const API = import.meta.env.DEV ? 'http://localhost:3000' : '';

interface Project { id: string; name: string; status: string; repo_url?: string; client_name?: string; }
interface Task { id: string; title: string; task_class: string; risk_level: string; status: string; description?: string; }
interface Run { id: string; task_title: string; output_summary: string; cost_usd: number; latency_ms: number; status: string; }

const TASK_CLASSES = [
  'site_brief',
  'copywriting',
  'seo_audit',
  'page_structure',
  'cta_optimization',
  'content_review',
  'deploy_review',
  'client_approval',
];

const RISK_LEVELS = ['low', 'medium', 'high'];

const TASK_CLASS_LABELS: Record<string, string> = {
  site_brief: '📋 Site Brief',
  copywriting: '✍️ Copywriting',
  seo_audit: '🔍 SEO Audit',
  page_structure: '🏗️ Page Structure',
  cta_optimization: '🎯 CTA Optimization',
  content_review: '👁️ Content Review',
  deploy_review: '🚀 Deploy Review',
  client_approval: '✅ Client Approval',
};

export default function CockpitPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [pendingRuns, setPendingRuns] = useState<Run[]>([]);
  const [streamOutput, setStreamOutput] = useState('');
  const [runMeta, setRunMeta] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', client_name: '', repo_url: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', task_class: 'site_brief', risk_level: 'low' });
  const outputRef = useRef<HTMLDivElement>(null);

  const fetchProjects = () => fetch(`${API}/api/projects`).then(r => r.json()).then(setProjects).catch(() => {});
  const fetchTasks = (pid: string) => fetch(`${API}/api/tasks?projectId=${pid}`).then(r => r.json()).then(setTasks).catch(() => {});
  const fetchPendingRuns = () => fetch(`${API}/api/runs?status=completed`).then(r => r.json()).then(setPendingRuns).catch(() => {});

  useEffect(() => { fetchProjects(); fetchPendingRuns(); }, []);
  useEffect(() => { if (selectedProject) fetchTasks(selectedProject.id); }, [selectedProject]);
  useEffect(() => { if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }, [streamOutput]);

  const createProject = async () => {
    await fetch(`${API}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    });
    setShowProjectForm(false);
    setNewProject({ name: '', client_name: '', repo_url: '' });
    fetchProjects();
  };

  const createTask = async () => {
    if (!selectedProject) return;
    await fetch(`${API}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, project_id: selectedProject.id }),
    });
    setShowTaskForm(false);
    setNewTask({ title: '', description: '', task_class: 'site_brief', risk_level: 'low' });
    fetchTasks(selectedProject.id);
  };

  const runClaude = async () => {
    if (!selectedTask) return;
    setIsRunning(true);
    setStreamOutput('');
    setRunMeta(null);
    const response = await fetch(`${API}/api/runs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: selectedTask.id,
        goal: selectedTask.description || selectedTask.title,
        projectContext: selectedProject ? `${selectedProject.name}${selectedProject.client_name ? ` (Client: ${selectedProject.client_name})` : ''}` : '',
      }),
    });
    if (!response.body) { setIsRunning(false); return; }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      for (const line of text.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'chunk') setStreamOutput(p => p + data.content);
          if (data.type === 'done') { setRunMeta(data); fetchPendingRuns(); }
        } catch {
          /* ignore malformed SSE fragments */
        }
      }
    }
    setIsRunning(false);
  };

  const decide = async (runId: string, decision: 'approved' | 'rejected') => {
    await fetch(`${API}/api/approvals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_run_id: runId, decision }),
    });
    fetchPendingRuns();
  };

  const riskColor = (r: string) =>
    r === 'high' ? 'bg-red-900/50 text-red-300 border border-red-800' :
    r === 'medium' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-800' :
    'bg-[#1A1A1A] text-gray-400 border border-[#2A2A2A]';

  const badge = (text: string, cls: string) => (
    <span className={`px-2 py-0.5 rounded text-xs font-mono ${cls}`}>{text}</span>
  );

  return (
    <div className="p-4 h-full bg-[#0A0A0A] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-black">⚡ Cockpit</h1>
        <span className="text-xs text-gray-600 font-mono">NanoStudio AI Command Center</span>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">

        {/* Panel 1 — Projects */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Projects</h2>
            <button
              onClick={() => setShowProjectForm(p => !p)}
              className="text-xs bg-[#D4A017] hover:bg-[#F0C040] text-black font-bold px-3 py-1 rounded transition"
            >
              + New
            </button>
          </div>

          {showProjectForm && (
            <div className="mb-3 space-y-2">
              <input
                className="w-full bg-[#0A0A0A] text-white text-sm p-2 rounded border border-[#2A2A2A] focus:border-[#D4A017]/50 outline-none"
                placeholder="Project / client name"
                value={newProject.name}
                onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
              />
              <input
                className="w-full bg-[#0A0A0A] text-white text-sm p-2 rounded border border-[#2A2A2A] focus:border-[#D4A017]/50 outline-none"
                placeholder="Client (e.g. Acme Plumbing)"
                value={newProject.client_name}
                onChange={e => setNewProject(p => ({ ...p, client_name: e.target.value }))}
              />
              <div className="flex gap-2">
                <button onClick={createProject} className="flex-1 bg-[#D4A017] hover:bg-[#F0C040] text-black text-xs font-bold py-1.5 rounded transition">Create</button>
                <button onClick={() => setShowProjectForm(false)} className="flex-1 bg-[#1A1A1A] text-gray-400 text-xs py-1.5 rounded transition">Cancel</button>
              </div>
            </div>
          )}

          <div className="overflow-y-auto flex-1 space-y-1">
            {projects.length === 0 && <p className="text-gray-600 text-xs">No projects yet — create one above</p>}
            {projects.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={`p-3 rounded-lg cursor-pointer text-sm flex items-center justify-between transition ${
                  selectedProject?.id === p.id
                    ? 'bg-[#D4A017]/10 border border-[#D4A017]/30 text-white'
                    : 'bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#D4A017]/20 text-gray-300'
                }`}
              >
                <div>
                  <p className="font-medium truncate">{p.name}</p>
                  {p.client_name && <p className="text-xs text-gray-600 truncate">{p.client_name}</p>}
                </div>
                {badge(p.status, 'bg-green-900/50 text-green-400 border border-green-800')}
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2 — Task Queue */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Task Queue {selectedProject && <span className="text-gray-600 normal-case font-normal">— {selectedProject.name}</span>}
            </h2>
            {selectedProject && (
              <button
                onClick={() => setShowTaskForm(p => !p)}
                className="text-xs bg-[#D4A017] hover:bg-[#F0C040] text-black font-bold px-3 py-1 rounded transition"
              >
                + New
              </button>
            )}
          </div>

          {showTaskForm && (
            <div className="mb-3 space-y-2">
              <input
                className="w-full bg-[#0A0A0A] text-white text-sm p-2 rounded border border-[#2A2A2A] focus:border-[#D4A017]/50 outline-none"
                placeholder="Task title (e.g. Homepage copywriting)"
                value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
              />
              <textarea
                className="w-full bg-[#0A0A0A] text-white text-sm p-2 rounded border border-[#2A2A2A] h-16 resize-none focus:border-[#D4A017]/50 outline-none"
                placeholder="Describe the goal or brief details..."
                value={newTask.description}
                onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
              />
              <div className="flex gap-2">
                <select
                  className="flex-1 bg-[#0A0A0A] text-white text-xs p-2 rounded border border-[#2A2A2A] focus:border-[#D4A017]/50 outline-none"
                  value={newTask.task_class}
                  onChange={e => setNewTask(p => ({ ...p, task_class: e.target.value }))}
                >
                  {TASK_CLASSES.map(c => (
                    <option key={c} value={c}>{TASK_CLASS_LABELS[c] || c}</option>
                  ))}
                </select>
                <select
                  className="w-24 bg-[#0A0A0A] text-white text-xs p-2 rounded border border-[#2A2A2A] focus:border-[#D4A017]/50 outline-none"
                  value={newTask.risk_level}
                  onChange={e => setNewTask(p => ({ ...p, risk_level: e.target.value }))}
                >
                  {RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={createTask} className="flex-1 bg-[#D4A017] hover:bg-[#F0C040] text-black text-xs font-bold py-1.5 rounded transition">Create</button>
                <button onClick={() => setShowTaskForm(false)} className="flex-1 bg-[#1A1A1A] text-gray-400 text-xs py-1.5 rounded transition">Cancel</button>
              </div>
            </div>
          )}

          {!selectedProject && <p className="text-gray-600 text-xs">Select a project first</p>}

          <div className="overflow-y-auto flex-1 space-y-1">
            {tasks.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className={`p-3 rounded-lg cursor-pointer text-sm transition ${
                  selectedTask?.id === t.id
                    ? 'bg-[#D4A017]/10 border border-[#D4A017]/30'
                    : 'bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#D4A017]/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium truncate text-xs">{t.title}</span>
                  {badge(t.risk_level, riskColor(t.risk_level))}
                </div>
                <div>{badge(TASK_CLASS_LABELS[t.task_class] || t.task_class, 'bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/20')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3 — Run Console */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Run Console</h2>
            <button
              onClick={runClaude}
              disabled={!selectedTask || isRunning}
              className={`text-xs px-4 py-1.5 rounded font-bold transition ${
                !selectedTask || isRunning
                  ? 'bg-[#1A1A1A] text-gray-600 cursor-not-allowed'
                  : 'bg-[#D4A017] hover:bg-[#F0C040] text-black'
              }`}
            >
              {isRunning ? '⏳ Running...' : '▶ Run with Claude'}
            </button>
          </div>

          {selectedTask && (
            <p className="text-xs text-gray-600 mb-2 truncate">
              {TASK_CLASS_LABELS[selectedTask.task_class]} — {selectedTask.title}
            </p>
          )}

          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto bg-black rounded-lg p-3 font-mono text-xs text-[#D4A017] whitespace-pre-wrap leading-relaxed"
          >
            {streamOutput || <span className="text-gray-700">Claude output will appear here...</span>}
          </div>

          {runMeta && (
            <div className="mt-2 flex gap-4 text-xs text-gray-600 font-mono">
              <span>⏱ {runMeta.latency_ms}ms</span>
              <span>📥 {runMeta.token_input} tok</span>
              <span>📤 {runMeta.token_output} tok</span>
              <span className="text-[#D4A017]">💰 ${runMeta.cost_usd?.toFixed(4)}</span>
            </div>
          )}
        </div>

        {/* Panel 4 — Approval Gate */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Approval Gate</h2>
            <button onClick={fetchPendingRuns} className="text-xs text-gray-600 hover:text-[#D4A017] transition">↻ Refresh</button>
          </div>

          <div className="overflow-y-auto flex-1 space-y-2">
            {pendingRuns.length === 0 && (
              <p className="text-gray-600 text-xs">No runs awaiting approval</p>
            )}
            {pendingRuns.map(r => (
              <div key={r.id} className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 space-y-2">
                <p className="text-white text-xs font-semibold truncate">{r.task_title}</p>
                <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">{r.output_summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-mono">
                    ⏱ {r.latency_ms}ms · 💰 ${Number(r.cost_usd).toFixed(4)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => decide(r.id, 'approved')}
                      className="text-xs bg-green-900/50 hover:bg-green-800/50 text-green-400 border border-green-800 px-3 py-1 rounded transition"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => decide(r.id, 'rejected')}
                      className="text-xs bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-800 px-3 py-1 rounded transition"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
