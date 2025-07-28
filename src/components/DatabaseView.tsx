import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

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

const API_BASE = 'http://localhost:5001/api';

export const DatabaseView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
      const response = await fetch(`${API_BASE}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/finances`);
      if (!response.ok) throw new Error('Failed to fetch finances');
      const data = await response.json();
      setFinances(data);
    } catch (err) {
      setError('Failed to load finances');
      console.error(err);
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
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (!response.ok) throw new Error('Failed to create task');
      await fetchTasks();
      setNewTask({ title: '', status: 'pending', due_date: '', priority: 1, assigned_to: '' });
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;
    try {
      const response = await fetch(`${API_BASE}/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask)
      });
      if (!response.ok) throw new Error('Failed to update task');
      await fetchTasks();
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  // Finance operations
  const createFinance = async () => {
    try {
      const response = await fetch(`${API_BASE}/finances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFinance)
      });
      if (!response.ok) throw new Error('Failed to create finance record');
      await fetchFinances();
      setNewFinance({ description: '', amount: 0, type: 'expense', date: '' });
    } catch (err) {
      setError('Failed to create finance record');
      console.error(err);
    }
  };

  const updateFinance = async () => {
    if (!editingFinance) return;
    try {
      const response = await fetch(`${API_BASE}/finances/${editingFinance.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFinance)
      });
      if (!response.ok) throw new Error('Failed to update finance record');
      await fetchFinances();
      setEditingFinance(null);
    } catch (err) {
      setError('Failed to update finance record');
      console.error(err);
    }
  };

  const deleteFinance = async (id: number) => {
    if (!confirm('Are you sure you want to delete this finance record?')) return;
    try {
      const response = await fetch(`${API_BASE}/finances/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete finance record');
      await fetchFinances();
    } catch (err) {
      setError('Failed to delete finance record');
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <Button 
            onClick={() => setError(null)} 
            className="ml-4"
            variant="outline"
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Task Management</h2>
          </div>

          {/* Add new task form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Add New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <Select value={newTask.status} onValueChange={(value: any) => setNewTask({ ...newTask, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                type="number"
                placeholder="Priority (1-5)"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) || 1 })}
              />
              <Input
                placeholder="Assigned to"
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
              />
            </div>
            <Button onClick={createTask} className="mt-4" disabled={!newTask.title}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Tasks table */}
          <div className="border rounded-lg">
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">No tasks found</TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            value={editingTask.title}
                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                          />
                        ) : (
                          task.title
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Select value={editingTask.status} onValueChange={(value: any) => setEditingTask({ ...editingTask, status: value })}>
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
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
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
                            onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
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
                            onChange={(e) => setEditingTask({ ...editingTask, priority: parseInt(e.target.value) || 1 })}
                          />
                        ) : (
                          task.priority
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <Input
                            value={editingTask.assigned_to}
                            onChange={(e) => setEditingTask({ ...editingTask, assigned_to: e.target.value })}
                          />
                        ) : (
                          task.assigned_to || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask?.id === task.id ? (
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={updateTask}>
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingTask(task)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteTask(task.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Finance Management</h2>
          </div>

          {/* Add new finance form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Add New Finance Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Description"
                value={newFinance.description}
                onChange={(e) => setNewFinance({ ...newFinance, description: e.target.value })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={newFinance.amount}
                onChange={(e) => setNewFinance({ ...newFinance, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select value={newFinance.type} onValueChange={(value: any) => setNewFinance({ ...newFinance, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newFinance.date}
                onChange={(e) => setNewFinance({ ...newFinance, date: e.target.value })}
              />
            </div>
            <Button onClick={createFinance} className="mt-4" disabled={!newFinance.description}>
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </div>

          {/* Finances table */}
          <div className="border rounded-lg">
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : finances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">No finance records found</TableCell>
                  </TableRow>
                ) : (
                  finances.map((finance) => (
                    <TableRow key={finance.id}>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Input
                            value={editingFinance.description}
                            onChange={(e) => setEditingFinance({ ...editingFinance, description: e.target.value })}
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
                            onChange={(e) => setEditingFinance({ ...editingFinance, amount: parseFloat(e.target.value) || 0 })}
                          />
                        ) : (
                                                     <span className={finance.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                             {finance.type === 'income' ? '+' : '-'}${Math.abs(Number(finance.amount)).toFixed(2)}
                           </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <Select value={editingFinance.type} onValueChange={(value: any) => setEditingFinance({ ...editingFinance, type: value })}>
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
                            onChange={(e) => setEditingFinance({ ...editingFinance, date: e.target.value })}
                          />
                        ) : (
                          finance.date ? new Date(finance.date).toLocaleDateString() : '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFinance?.id === finance.id ? (
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={updateFinance}>
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingFinance(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingFinance(finance)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteFinance(finance.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          {finances.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${finances.filter(f => f.type === 'income').reduce((sum, f) => sum + Number(f.amount), 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + Number(f.amount), 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className={`text-2xl font-bold ${
                    finances.reduce((sum, f) => f.type === 'income' ? sum + Number(f.amount) : sum - Number(f.amount), 0) >= 0 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(finances.reduce((sum, f) => f.type === 'income' ? sum + Number(f.amount) : sum - Number(f.amount), 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
