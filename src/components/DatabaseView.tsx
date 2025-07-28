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
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  priority: number;
  assigned_to: string;
}

interface Finance {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface DatabaseViewProps {
  initialTab?: 'tasks' | 'finances';
  title?: string;
}

// Use Render backend URL directly to ensure it works
const RENDER_API_BASE = 'https://superbot-animated-ui.onrender.com/api';

export const DatabaseView: React.FC<DatabaseViewProps> = ({ 
  initialTab = 'tasks', 
  title = 'Database Management' 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  
  // Form states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingFinance, setEditingFinance] = useState<Finance | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'pending' as const,
    due_date: '',
    priority: 1,
    assigned_to: ''
  });
  const [newFinance, setNewFinance] = useState({
    description: '',
    amount: 0,
    type: 'expense' as const,
    date: ''
  });

  // Fetch data
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔗 Fetching tasks from:', `${RENDER_API_BASE}/tasks`);
      const response = await fetch(`${RENDER_API_BASE}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      console.log('✅ Tasks loaded:', data.length);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('❌ Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinances = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔗 Fetching finances from:', `${RENDER_API_BASE}/finances`);
      const response = await fetch(`${RENDER_API_BASE}/finances`);
      if (!response.ok) throw new Error('Failed to fetch finances');
      const data = await response.json();
      setFinances(data);
      console.log('✅ Finances loaded:', data.length);
    } catch (err) {
      setError('Failed to load finances');
      console.error('❌ Error fetching finances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tasks') {
      fetchTasks();
    } else {
      fetchFinances();
    }
  }, [activeTab]);

  // Task operations
  const createTask = async () => {
    try {
      const response = await fetch(`${RENDER_API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (!response.ok) throw new Error('Failed to create task');
      await fetchTasks();
      setShowTaskModal(false);
      setNewTask({ title: '', status: 'pending', due_date: '', priority: 1, assigned_to: '' });
    } catch (err) {
      console.error('Error creating task:', err);
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
      await fetchTasks();
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`${RENDER_API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      await fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
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
      await fetchFinances();
      setShowFinanceModal(false);
      setNewFinance({ description: '', amount: 0, type: 'expense', date: '' });
    } catch (err) {
      console.error('Error creating finance record:', err);
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
      await fetchFinances();
      setEditingFinance(null);
    } catch (err) {
      console.error('Error updating finance record:', err);
    }
  };

  const deleteFinance = async (id: number) => {
    if (!confirm('Are you sure you want to delete this finance record?')) return;
    try {
      const response = await fetch(`${RENDER_API_BASE}/finances/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete finance record');
      await fetchFinances();
    } catch (err) {
      console.error('Error deleting finance record:', err);
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
          <Button onClick={() => setShowTaskModal(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Task
          </Button>
          <Button onClick={() => setShowFinanceModal(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Finance
          </Button>
        </div>
      </div>

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
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
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
                      <Select value={editingTask.status} onValueChange={(value) => setEditingTask({...editingTask, status: value as any})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs ${
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
                      <Input
                        type="number"
                        value={editingTask.priority}
                        onChange={(e) => setEditingTask({...editingTask, priority: parseInt(e.target.value)})}
                      />
                    ) : (
                      task.priority
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
              <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Income</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Expenses</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
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
                        ${Number(finance.amount).toFixed(2)}
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
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={newTask.status} onValueChange={(value) => setNewTask({...newTask, status: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
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
            <Input
              type="number"
              min="1"
              max="5"
              value={newTask.priority}
              onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assigned To</label>
            <Input
              value={newTask.assigned_to}
              onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
              placeholder="Enter assignee name"
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
          <div className="flex gap-2 pt-4">
            <Button onClick={createFinance} className="flex-1">Create Record</Button>
            <Button variant="outline" onClick={() => setShowFinanceModal(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
