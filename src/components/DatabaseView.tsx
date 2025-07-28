import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  priority: number;
}

interface Finance {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

// API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const DatabaseView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState({ tasks: false, finances: false });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Form states
  const [taskForm, setTaskForm] = useState<Omit<Task, 'id'>>({ 
    title: '', 
    status: 'pending', 
    due_date: format(new Date(), 'yyyy-MM-dd'),
    priority: 1 
  });
  
  const [financeForm, setFinanceForm] = useState<Omit<Finance, 'id'>>({ 
    description: '', 
    amount: 0, 
    type: 'expense',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  // Fetch data
  const fetchTasks = async () => {
    setLoading(prev => ({ ...prev, tasks: true }));
    setConnectionError(null);
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setConnectionError(`Failed to load tasks: ${error.message}. Please make sure the backend server is running at ${API_URL}`);
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  const [error, setError] = useState<{message: string; details?: any} | null>(null);

  const fetchFinances = async () => {
    setLoading(prev => ({ ...prev, finances: true }));
    setError(null);
    try {
      const response = await fetch(`${API_URL}/finances`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch finance records');
      }
      
      setFinances(data);
    } catch (error) {
      console.error('Error fetching finances:', error);
      setError({
        message: 'Failed to load finance records',
        details: error.response?.data || error.message
      });
    } finally {
      setLoading(prev => ({ ...prev, finances: false }));
    }
  };

  useEffect(() => {
    if (activeTab === 'tasks') {
      fetchTasks();
    } else {
      fetchFinances();
    }
  }, [activeTab]);

  // CRUD Operations for Tasks
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${API_URL}/tasks/${editingId}` 
        : `${API_URL}/tasks`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm)
      });
      
      const data = await response.json();
      
      if (editingId) {
        setTasks(tasks.map(t => t.id === editingId ? { ...data, id: editingId } : t));
      } else {
        setTasks([...tasks, data]);
      }
      
      resetForms();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleTaskDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // CRUD Operations for Finances
  const handleFinanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${API_URL}/finances/${editingId}` 
        : `${API_URL}/finances`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...financeForm,
          amount: parseFloat(financeForm.amount as any)
        })
      });
      
      const data = await response.json();
      
      if (editingId) {
        setFinances(finances.map(f => f.id === editingId ? { ...data, id: editingId } : f));
      } else {
        setFinances([...finances, data]);
      }
      
      resetForms();
    } catch (error) {
      console.error('Error saving finance record:', error);
    }
  };

  const handleFinanceDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await fetch(`${API_URL}/finances/${id}`, { method: 'DELETE' });
      setFinances(finances.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting finance record:', error);
    }
  };

  // Form handling
  const resetForms = () => {
    setTaskForm({ 
      title: '', 
      status: 'pending', 
      due_date: format(new Date(), 'yyyy-MM-dd'),
      priority: 1 
    });
    setFinanceForm({ 
      description: '', 
      amount: 0, 
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd')
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const startEditing = (item: Task | Finance, type: 'task' | 'finance') => {
    if (type === 'task') {
      setTaskForm({
        title: (item as Task).title,
        status: (item as Task).status,
        due_date: (item as Task).due_date.split('T')[0],
        priority: (item as Task).priority
      });
    } else {
      setFinanceForm({
        description: (item as Finance).description,
        amount: (item as Finance).amount,
        type: (item as Finance).type,
        date: (item as Finance).date.split('T')[0]
      });
    }
    setEditingId(item.id);
  };

  if (connectionError) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Connection Error!</strong>
          <span className="block sm:inline"> {connectionError}</span>
          <div className="mt-2">
            <p>Please ensure:</p>
            <ol className="list-decimal pl-5 mt-1">
              <li>The backend server is running at {API_URL}</li>
              <li>There are no CORS issues (check browser console)</li>
              <li>The database connection is properly configured</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Tabs defaultValue="tasks" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Task Management</h3>
            <Button 
              size="sm" 
              onClick={() => {
                resetForms();
                setIsAdding(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Button>
          </div>
          
          {/* Add/Edit Task Form */}
          {(isAdding || editingId !== null) && (
            <form onSubmit={handleTaskSubmit} className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select
                    value={taskForm.status}
                    onValueChange={(value: 'pending' | 'in_progress' | 'completed') => 
                      setTaskForm({...taskForm, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Due Date</label>
                  <Input
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForms}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" /> {editingId ? 'Update' : 'Add'} Task
                </Button>
              </div>
            </form>
          )}
          
          {/* Tasks Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading.tasks ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading tasks...
                    </TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No tasks found. Add your first task!
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'completed' 
                            ? 'bg-green-500/20 text-green-500' 
                            : task.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(task.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => startEditing(task, 'task')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => handleTaskDelete(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Finances Tab */}
        <TabsContent value="finances">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Finance Management</h3>
            <Button 
              size="sm" 
              onClick={() => {
                resetForms();
                setIsAdding(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Record
            </Button>
          </div>
          
          {/* Add/Edit Finance Form */}
          {(isAdding || editingId !== null) && (
            <form onSubmit={handleFinanceSubmit} className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Input
                    value={financeForm.description}
                    onChange={(e) => setFinanceForm({...financeForm, description: e.target.value})}
                    placeholder="Description"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={financeForm.amount || ''}
                    onChange={(e) => setFinanceForm({...financeForm, amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <Select
                    value={financeForm.type}
                    onValueChange={(value: 'income' | 'expense') => 
                      setFinanceForm({...financeForm, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={financeForm.date}
                    onChange={(e) => setFinanceForm({...financeForm, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForms}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" /> {editingId ? 'Update' : 'Add'} Record
                </Button>
              </div>
            </form>
          )}
          
          {/* Finances Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-red-500">
                      <div className="mb-2">Error: {error.message}</div>
                      {error.details && (
                        <div className="text-xs text-red-400 mt-2 p-2 bg-red-900/20 rounded">
                          {JSON.stringify(error.details, null, 2)}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : loading.finances ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading finance records...
                    </TableCell>
                  </TableRow>
                ) : finances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No finance records found. Add your first record!
                    </TableCell>
                  </TableRow>
                ) : (
                  finances.map((finance) => (
                    <TableRow key={finance.id}>
                      <TableCell className="font-medium">{finance.description}</TableCell>
                      <TableCell className={finance.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                        {finance.type === 'income' ? '+' : '-'}${Math.abs(finance.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          finance.type === 'income' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {finance.type.charAt(0).toUpperCase() + finance.type.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(finance.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => startEditing(finance, 'finance')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => handleFinanceDelete(finance.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Summary */}
          {finances.length > 0 && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium mb-2">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${finances
                      .filter(f => f.type === 'income')
                      .reduce((sum, f) => sum + f.amount, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-500">
                    ${finances
                      .filter(f => f.type === 'expense')
                      .reduce((sum, f) => sum + f.amount, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  finances.reduce((sum, f) => 
                    f.type === 'income' ? sum + f.amount : sum - f.amount, 0
                  ) >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className={`text-2xl font-bold ${
                    finances.reduce((sum, f) => 
                      f.type === 'income' ? sum + f.amount : sum - f.amount, 0
                    ) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ${Math.abs(
                      finances.reduce((sum, f) => 
                        f.type === 'income' ? sum + f.amount : sum - f.amount, 0
                      )
                    ).toFixed(2)}
                    {finances.reduce((sum, f) => 
                      f.type === 'income' ? sum + f.amount : sum - f.amount, 0
                    ) < 0 ? ' (Deficit)' : ' (Surplus)'}
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
