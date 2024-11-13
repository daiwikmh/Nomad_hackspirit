import React, { useState } from 'react';
import { PlusCircle, Users, Wallet, Calendar } from 'lucide-react';

const TravelExpensePool = () => {
  const [groups, setGroups] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    date: '',
    targetAmount: ''
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: ''
  });

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const group = {
      ...newGroup,
      id: Date.now(),
      members: [],
      pooledAmount: 0,
      expenses: [],
      pendingApprovals: []
    };
    setGroups([...groups, group]);
    setNewGroup({ name: '', description: '', date: '', targetAmount: '' });
    setShowCreateForm(false);
  };

  const handleAddExpense = (groupId) => {
    if (!newExpense.description || !newExpense.amount) return;
    
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          pendingApprovals: [...group.pendingApprovals, {
            ...newExpense,
            id: Date.now(),
            approvals: []
          }]
        };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    setNewExpense({ description: '', amount: '' });
    setShowExpenseForm(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Travel Expense Pool</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowCreateForm(true)}
        >
          <PlusCircle className="w-5 h-5" />
          Create New Group
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Create New Travel Group</h2>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Group Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Travel Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={newGroup.date}
                      onChange={(e) => setNewGroup({...newGroup, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Target Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={newGroup.targetAmount}
                      onChange={(e) => setNewGroup({...newGroup, targetAmount: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(group => (
          <div key={group.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{group.name}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(group.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span>{group.members.length} members</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Wallet className="w-5 h-5" />
                <span>Pooled: ${group.pooledAmount} / ${group.targetAmount}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>{group.date}</span>
              </div>
              
              {group.pendingApprovals.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-700">
                    {group.pendingApprovals.length} expense{group.pendingApprovals.length !== 1 ? 's' : ''} pending approval
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => {
                    setSelectedGroup(group);
                    setShowExpenseForm(true);
                  }}
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showExpenseForm && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
              <form className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Amount</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowExpenseForm(false);
                      setNewExpense({ description: '', amount: '' });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => handleAddExpense(selectedGroup.id)}
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelExpensePool;