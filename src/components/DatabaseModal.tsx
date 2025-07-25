import { X, Database, User, Calendar, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

const DatabaseModal = ({ isOpen, onClose, category }: DatabaseModalProps) => {
  const mockData = category === 'Finance' ? [
    { id: 1, type: 'Income', amount: '$2,500', date: '2024-01-15', category: 'Salary' },
    { id: 2, type: 'Expense', amount: '$180', date: '2024-01-14', category: 'Groceries' },
    { id: 3, type: 'Expense', amount: '$50', date: '2024-01-13', category: 'Gas' },
    { id: 4, type: 'Income', amount: '$300', date: '2024-01-12', category: 'Freelance' },
  ] : [
    { id: 1, task: 'Complete project proposal', status: 'Done', priority: 'High', due: '2024-01-15' },
    { id: 2, task: 'Review team feedback', status: 'In Progress', priority: 'Medium', due: '2024-01-16' },
    { id: 3, task: 'Schedule client meeting', status: 'Pending', priority: 'High', due: '2024-01-17' },
    { id: 4, task: 'Update documentation', status: 'Done', priority: 'Low', due: '2024-01-14' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-glass-border max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="border-b border-glass-border pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Database className="w-6 h-6 text-primary" />
            {category} Database
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto p-6">
          <div className="grid gap-4">
            {category === 'Finance' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-glass-border">
                      <th className="text-left py-3 px-4 text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.map((item: any) => (
                      <tr key={item.id} className="border-b border-glass-border/50 hover:bg-glass-bg/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.type === 'Income' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">{item.amount}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.date}</td>
                        <td className="py-3 px-4">{item.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-3">
                {mockData.map((item: any) => (
                  <div key={item.id} className="glass-card p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{item.task}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'Done' 
                          ? 'bg-green-500/20 text-green-400'
                          : item.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.due}
                      </span>
                      <span className={`flex items-center gap-1 ${
                        item.priority === 'High' ? 'text-red-400' :
                        item.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        Priority: {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseModal;