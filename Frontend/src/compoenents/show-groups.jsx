import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const ShowGroups = () => {
    const [groups, setGroups] = useState([]);
    const { isSignedIn, user, isLoaded } = useUser();
    const navigate = useNavigate();

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

    const handleGroupClick = (groupId) => {
        navigate(`/groups/${groupId}`);
    };

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-4 text-white text-center">Your Groups</h1>

            {groups.length === 0 ? (
                <p className="text-gray-600">You are not a member of any groups.</p>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {groups.map(group => (
                        <div key={group._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                            onClick={() => handleGroupClick(group._id)}

                        >
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
