import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { API_BASE } from '../../config.js';

interface Task {
  id: number;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  due_date: string;
  priority: string;
  assigned_to: string;
  description: string;
  assigned_date: string;
  project_name: string;
}

interface Finance {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  project_name: string;
  due_date: string;
  contact_person: string;
  contact_person_contact_no: string;
}

interface DatabaseViewProps {
  initialTab?: 'tasks' | 'finances';
  title?: string;
  showOnly?: 'tasks' | 'finances';
}

// Use Render backend URL directly to ensure it works
const RENDER_API_BASE = 'https://superbot-animated-ui.onrender.com/api';

export const DatabaseView: React.FC<DatabaseViewProps> = ({ 
  initialTab = 'tasks', 
  title = 'Database Management',
  showOnly
}) => {
  const [activeTab, setActiveTab] = useState(showOnly || initialTab);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState({ tasks: false, finances: false });
  
  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  
  // Form states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingFinance, setEditingFinance] = useState<Finance | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'not_started' as const,
    due_date: '',
    priority: 'medium',
    assigned_to: '',
    description: '',
    assigned_date: new Date().toISOString().split('T')[0],
    project_name: ''
  });
  const [newFinance, setNewFinance] = useState({
    description: '',
    amount: 0,
    type: 'expense' as const,
    date: '',
    project_name: '',
    due_date: '',
    contact_person: '',
    contact_person_contact_no: ''
  });

  // Fetch data
  const fetchTasks = async () => {
    // Skip if already loaded
    if (dataLoaded.tasks && tasks.length > 0) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('🔗 Fetching tasks from:', `${RENDER_API_BASE}/tasks`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${RENDER_API_BASE}/tasks`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setTasks(data);
      setDataLoaded(prev => ({ ...prev, tasks: true }));
      console.log('✅ Tasks loaded:', data.length);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Failed to load tasks. Please check your connection.');
        console.error('❌ Error fetching tasks:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFinances = async () => {
    // Skip if already loaded
    if (dataLoaded.finances && finances.length > 0) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('🔗 Fetching finances from:', `${RENDER_API_BASE}/finances`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${RENDER_API_BASE}/finances`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setFinances(data);
      setDataLoaded(prev => ({ ...prev, finances: true }));
      console.log('✅ Finances loaded:', data.length);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Failed to load finances. Please check your connection.');
        console.error('❌ Error fetching finances:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showOnly) {
      // If showOnly is specified, only fetch the relevant data
      if (showOnly === 'tasks') {
        fetchTasks();
      } else if (showOnly === 'finances') {
        fetchFinances();
      }
    } else {
      // If no showOnly, fetch based on active tab
      if (activeTab === 'tasks') {
        fetchTasks();
      } else {
        fetchFinances();
      }
    }
  }, [activeTab, showOnly]);

  // Task operations
  const createTask = async () => {
    try {
      const response = await fetch(`${RENDER_API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (!response.ok) throw new Error('Failed to create task');
      
      // Optimistically update the UI instead of refetching
      const createdTask = await response.json();
      setTasks(prev => [...prev, createdTask]);
      setShowTaskModal(false);
      setNewTask({ 
        title: '', 
        status: 'not_started', 
        due_date: '', 
        priority: 'medium', 
        assigned_to: '', 
        description: '', 
        assigned_date: new Date().toISOString().split('T')[0], 
        project_name: '' 
      });
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;
    try {
      const response = await fetch(`${RENDER_API_BASE}/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask)
      });
      if (!response.ok) throw new Error('Failed to update task');
      
      // Optimistically update the UI instead of refetching
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? editingTask : task
      ));
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`${RENDER_API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      
      // Optimistically update the UI instead of refetching
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  // Finance operations
  const createFinance = async () => {
    try {
      const response = await fetch(`${RENDER_API_BASE}/finances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFinance)
      });
      if (!response.ok) throw new Error('Failed to create finance record');
      
      // Optimistically update the UI instead of refetching
      const createdFinance = await response.json();
      setFinances(prev => [...prev, createdFinance]);
      setShowFinanceModal(false);
      setNewFinance({ 
        description: '', 
        amount: 0, 
        type: 'expense', 
        date: '', 
        project_name: '', 
        due_date: '', 
        contact_person: '', 
        contact_person_contact_no: '' 
      });
    } catch (err) {
      console.error('Error creating finance record:', err);
      setError('Failed to create finance record. Please try again.');
    }
  };

  const updateFinance = async () => {
    if (!editingFinance) return;
    try {
      const response = await fetch(`${RENDER_API_BASE}/finances/${editingFinance.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFinance)
      });
      if (!response.ok) throw new Error('Failed to update finance record');
      
      // Optimistically update the UI instead of refetching
      setFinances(prev => prev.map(finance => 
        finance.id === editingFinance.id ? editingFinance : finance
      ));
      setEditingFinance(null);
    } catch (err) {
      console.error('Error updating finance record:', err);
      setError('Failed to update finance record. Please try again.');
    }
  };

  const deleteFinance = async (id: number) => {
    if (!confirm('Are you sure you want to delete this finance record?')) return;
    try {
      const response = await fetch(`${RENDER_API_BASE}/finances/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete finance record');
      
      // Optimistically update the UI instead of refetching
      setFinances(prev => prev.filter(finance => finance.id !== id));
    } catch (err) {
      console.error('Error deleting finance record:', err);
      setError('Failed to delete finance record. Please try again.');
    }
  };

  // Calculate financial summary
  const totalIncome = finances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + Number(f.amount), 0);
  
  const totalExpenses = finances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + Number(f.amount), 0);
  
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-2">
          {(!showOnly || showOnly === 'tasks') && (
            <Button onClick={() => setShowTaskModal(true)} className="flex items-center gap-2">
              <Plus size={16} />
              Add Task
            </Button>
          )}
          {(!showOnly || showOnly === 'finances') && (
            <Button onClick={() => setShowFinanceModal(true)} className="flex items-center gap-2">
              <Plus size={16} />
              Add Finance
            </Button>
          )}
        </div>
      </div>

      {!showOnly ? (
        // Show both sections with tabs when showOnly is not specified
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'tasks' | 'finances')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="finances">Finances ({finances.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      {editingTask?.id === task.id ? (
                        <Input
                          value={editingTask.title}
                          onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                        />
                      ) : (
                        task.title
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask?.id === task.id ? (
                        <Input
                          value={editingTask.description}
                          onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        />
                      ) : (
                        task.description || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask?.id === task.id ? (
                        <Select value={editingTask.status} onValueChange={(value) => setEditingTask({...editingTask, status: value as any})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_started">Not Started</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs whitespace-nowrap min-w-[100px] inline-block ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask?.id === task.id ? (
                        <Input
                          type="date"
                          value={editingTask.due_date}
                          onChange={(e) => setEditingTask({...editingTask, due_date: e.target.value})}
                        />
                      ) : (
                        task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask?.id === task.id ? (
                        <Select value={editingTask.priority} onValueChange={(value) => setEditingTask({...editingTask, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask?.id === task.id ? (
                        <Input
                          value={editingTask.assigned_to}
                          onChange={(e) => setEditingTask({...editingTask, assigned_to: e.target.value})}
                        />
                      ) : (
                        task.assigned_to || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask?.id === task.id ? (
                        <Input
                          value={editingTask.project_name}
                          onChange={(e) => setEditingTask({...editingTask, project_name: e.target.value})}
                        />
                      ) : (
                        task.project_name || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask?.id === task.id ? (
                        <Input
                          type="date"
                          value={editingTask.assigned_date}
                          onChange={(e) => setEditingTask({...editingTask, assigned_date: e.target.value})}
                        />
                      ) : (
                        task.assigned_date ? new Date(task.assigned_date).toLocaleDateString() : '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTask?.id === task.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={updateTask}>
                            <Save size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                            <X size={14} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingTask(task)}>
                            <Edit size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteTask(task.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="finances" className="space-y-4">
            {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>}
            
            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Income</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Expenses</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{balance.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Balance</div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finances.map((finance) => (
                  <TableRow key={finance.id}>
                    <TableCell>
                      {editingFinance?.id === finance.id ? (
                        <Input
                          value={editingFinance.description}
                          onChange={(e) => setEditingFinance({...editingFinance, description: e.target.value})}
                        />
                      ) : (
                        finance.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFinance?.id === finance.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editingFinance.amount}
                          onChange={(e) => setEditingFinance({...editingFinance, amount: parseFloat(e.target.value)})}
                        />
                      ) : (
                        <span className={finance.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          ₹{Number(finance.amount).toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFinance?.id === finance.id ? (
                        <Select value={editingFinance.type} onValueChange={(value) => setEditingFinance({...editingFinance, type: value as any})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs ${
                          finance.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {finance.type}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFinance?.id === finance.id ? (
                        <Input
                          type="date"
                          value={editingFinance.date}
                          onChange={(e) => setEditingFinance({...editingFinance, date: e.target.value})}
                        />
                      ) : (
                        finance.date ? new Date(finance.date).toLocaleDateString() : '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFinance?.id === finance.id ? (
                        <Input
                          value={editingFinance.project_name}
                          onChange={(e) => setEditingFinance({...editingFinance, project_name: e.target.value})}
                        />
                      ) : (
                        finance.project_name || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFinance?.id === finance.id ? (
                        <Input
                          type="date"
                          value={editingFinance.due_date}
                          onChange={(e) => setEditingFinance({...editingFinance, due_date: e.target.value})}
                        />
                      ) : (
                        finance.due_date ? new Date(finance.due_date).toLocaleDateString() : '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFinance?.id === finance.id ? (
                        <Input
                          value={editingFinance.contact_person}
                          onChange={(e) => setEditingFinance({...editingFinance, contact_person: e.target.value})}
                        />
                      ) : (
                        finance.contact_person || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFinance?.id === finance.id ? (
                        <Input
                          value={editingFinance.contact_person_contact_no}
                          onChange={(e) => setEditingFinance({...editingFinance, contact_person_contact_no: e.target.value})}
                        />
                      ) : (
                        finance.contact_person_contact_no || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFinance?.id === finance.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={updateFinance}>
                            <Save size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingFinance(null)}>
                            <X size={14} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingFinance(finance)}>
                            <Edit size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteFinance(finance.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      ) : (
        // Show only specific section when showOnly is specified
        <>
          {showOnly === 'tasks' && (
            <div className="space-y-4">
              {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            value={editingTask.title}
                            onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                          />
                        ) : (
                          task.title
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            value={editingTask.description}
                            onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                          />
                        ) : (
                          task.description || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Select value={editingTask.status} onValueChange={(value) => setEditingTask({...editingTask, status: value as any})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not_started">Not Started</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs whitespace-nowrap min-w-[100px] inline-block ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            type="date"
                            value={editingTask.due_date}
                            onChange={(e) => setEditingTask({...editingTask, due_date: e.target.value})}
                          />
                        ) : (
                          task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Select value={editingTask.priority} onValueChange={(value) => setEditingTask({...editingTask, priority: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs ${
                            task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            value={editingTask.assigned_to}
                            onChange={(e) => setEditingTask({...editingTask, assigned_to: e.target.value})}
                          />
                        ) : (
                          task.assigned_to || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            value={editingTask.project_name}
                            onChange={(e) => setEditingTask({...editingTask, project_name: e.target.value})}
                          />
                        ) : (
                          task.project_name || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            type="date"
                            value={editingTask.assigned_date}
                            onChange={(e) => setEditingTask({...editingTask, assigned_date: e.target.value})}
                          />
                        ) : (
                          task.assigned_date ? new Date(task.assigned_date).toLocaleDateString() : '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={updateTask}>
                              <Save size={14} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                              <X size={14} />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingTask(task)}>
                              <Edit size={14} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteTask(task.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {showOnly === 'finances' && (
            <div className="space-y-4">
              {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>}
              
              {/* Financial Summary */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Income</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{balance.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Balance</div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finances.map((finance) => (
                    <TableRow key={finance.id}>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Input
                            value={editingFinance.description}
                            onChange={(e) => setEditingFinance({...editingFinance, description: e.target.value})}
                          />
                        ) : (
                          finance.description
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editingFinance.amount}
                            onChange={(e) => setEditingFinance({...editingFinance, amount: parseFloat(e.target.value)})}
                          />
                        ) : (
                          <span className={finance.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                            ₹{Number(finance.amount).toFixed(2)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Select value={editingFinance.type} onValueChange={(value) => setEditingFinance({...editingFinance, type: value as any})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs ${
                            finance.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {finance.type}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Input
                            type="date"
                            value={editingFinance.date}
                            onChange={(e) => setEditingFinance({...editingFinance, date: e.target.value})}
                          />
                        ) : (
                          finance.date ? new Date(finance.date).toLocaleDateString() : '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Input
                            value={editingFinance.project_name}
                            onChange={(e) => setEditingFinance({...editingFinance, project_name: e.target.value})}
                          />
                        ) : (
                          finance.project_name || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Input
                            type="date"
                            value={editingFinance.due_date}
                            onChange={(e) => setEditingFinance({...editingFinance, due_date: e.target.value})}
                          />
                        ) : (
                          finance.due_date ? new Date(finance.due_date).toLocaleDateString() : '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Input
                            value={editingFinance.contact_person}
                            onChange={(e) => setEditingFinance({...editingFinance, contact_person: e.target.value})}
                          />
                        ) : (
                          finance.contact_person || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Input
                            value={editingFinance.contact_person_contact_no}
                            onChange={(e) => setEditingFinance({...editingFinance, contact_person_contact_no: e.target.value})}
                          />
                        ) : (
                          finance.contact_person_contact_no || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={updateFinance}>
                              <Save size={14} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingFinance(null)}>
                              <X size={14} />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingFinance(finance)}>
                              <Edit size={14} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteFinance(finance.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Add New Task"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Enter task title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Enter task description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={newTask.status} onValueChange={(value) => setNewTask({...newTask, status: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <Input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assigned To</label>
            <Input
              value={newTask.assigned_to}
              onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
              placeholder="Enter assignee name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <Input
              value={newTask.project_name}
              onChange={(e) => setNewTask({...newTask, project_name: e.target.value})}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assigned Date</label>
            <Input
              type="date"
              value={newTask.assigned_date}
              onChange={(e) => setNewTask({...newTask, assigned_date: e.target.value})}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={createTask} className="flex-1">Create Task</Button>
            <Button variant="outline" onClick={() => setShowTaskModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Finance Modal */}
      <Modal
        isOpen={showFinanceModal}
        onClose={() => setShowFinanceModal(false)}
        title="Add New Finance Record"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={newFinance.description}
              onChange={(e) => setNewFinance({...newFinance, description: e.target.value})}
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <Input
              type="number"
              step="0.01"
              value={newFinance.amount}
              onChange={(e) => setNewFinance({...newFinance, amount: parseFloat(e.target.value)})}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select value={newFinance.type} onValueChange={(value) => setNewFinance({...newFinance, type: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input
              type="date"
              value={newFinance.date}
              onChange={(e) => setNewFinance({...newFinance, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <Input
              value={newFinance.project_name}
              onChange={(e) => setNewFinance({...newFinance, project_name: e.target.value})}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <Input
              type="date"
              value={newFinance.due_date}
              onChange={(e) => setNewFinance({...newFinance, due_date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Person</label>
            <Input
              value={newFinance.contact_person}
              onChange={(e) => setNewFinance({...newFinance, contact_person: e.target.value})}
              placeholder="Enter contact person name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <Input
              value={newFinance.contact_person_contact_no}
              onChange={(e) => setNewFinance({...newFinance, contact_person_contact_no: e.target.value})}
              placeholder="Enter contact number"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={createFinance} className="flex-1">Create Record</Button>
            <Button variant="outline" onClick={() => setShowFinanceModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
