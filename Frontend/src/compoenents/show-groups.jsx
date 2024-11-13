import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const ShowGroups = () => {
    const [groups, setGroups] = useState([]);
    const { isSignedIn, user, isLoaded } = useUser(); 

    useEffect(() => {
        const fetchGroups = async () => {
            if (isLoaded && user) {
                try {
                    const response = await axios.get('http://localhost:3001/api/show-groups', {
                        params: { email: user.primaryEmailAddress.emailAddress },
                    });
                    setGroups(response.data);
                } catch (error) {
                    console.error('Error fetching groups:', error);
                }
            }
        };

        fetchGroups();
    }, [isLoaded, user]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Your Groups</h1>

            {groups.length === 0 ? (
                <p className="text-gray-600">You are not a member of any groups.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                    {groups.map(group => (
                        <div key={group._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold">{group.name}</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="text-gray-600">{group.description}</div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span>{group.members.length} members</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowGroups;
