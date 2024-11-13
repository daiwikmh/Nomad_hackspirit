import React, { useEffect, useState } from 'react';
import { PlusCircle, Users, Wallet, Calendar } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';  // Clerk hook for user info
import axios from 'axios';  // Make sure axios is imported for the API request

const TravelExpensePool = () => {
  const [groups, setGroups] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();  // Use Clerk's useUser hook
  console.log(JSON.stringify(user));
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    date: '',
    targetAmount: '',
    members: []
  });

  const [newMemberEmail, setNewMemberEmail] = useState("");
  useEffect(() => {
    if (isLoaded && user) {
      setNewGroup(prevGroup => ({
        ...prevGroup,
        members: [user.primaryEmailAddress.emailAddress]
      }));
    }
  }, [isLoaded, user]);

  // Handle form submission to create a group
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    try {
      console.log(newGroup);
      const response = await axios.post('http://localhost:3001/api/create-group', {
        name: newGroup.name,
        description: newGroup.description,
        members: newGroup.members
      });

      // Add the created group to the list
      setGroups([...groups, response.data]);

      // Reset the form after successful submission
      setNewGroup({ name: '', description: '', date: '', targetAmount: '', members: [] });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleAddMember = () => {
    if (!newMemberEmail) return;
    setNewGroup(prevGroup => ({
      ...prevGroup,
      members: [...prevGroup.members, newMemberEmail]
    }));
    setNewMemberEmail("");
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
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4">
                  <label className="block mb-1 font-medium">Add Members by Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter member's email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={handleAddMember}
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2">
                    {newGroup.members.map((email, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-gray-200 text-gray-800 rounded-lg text-sm mr-2 mb-2"
                      >
                        {email}
                      </span>
                    ))}
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
    </div>
  );
};

export default TravelExpensePool;
