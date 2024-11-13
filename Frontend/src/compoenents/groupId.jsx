import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const GroupDetails = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [amount, setAmount] = useState(0);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [transaction, setTransaction] = useState(null);
    const [approvedTransactions, setApprovedTransactions] = useState([]); // Store list of approved transactions
    const [error, setError] = useState("");
    const { isSignedIn, user, isLoaded } = useUser();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/groups/${groupId}`);
                setGroup(response.data);
            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        const fetchPendingTransaction = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/pending-transactions/${groupId}`);
                if (response.data.length > 0) {
                    setTransaction(response.data[0]); // Assume only one pending transaction per group
                }
            } catch (error) {
                console.error('Error fetching pending transaction:', error);
            }
        };

        const fetchApprovedTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/approved-transactions/${groupId}`);
                setApprovedTransactions(response.data);
            } catch (error) {
                console.error('Error fetching approved transactions:', error);
            }
        };

        fetchGroupDetails();
        fetchPendingTransaction();
        fetchApprovedTransactions();
    }, [groupId]);

    const handleAddToPool = async () => {
        try {
            if (isLoaded && user) {
                const userEmail = user.primaryEmailAddress.emailAddress;
                const response = await axios.post(`http://localhost:3001/api/add-to-pool/${groupId}`, {
                    userEmail,
                    amount: parseFloat(amount)
                });
                setGroup(response.data);
                setAmount(0);
                setError("");
            }
        } catch (error) {
            console.error('Error adding to pool:', error);
            setError("Failed to add money to pool.");
        }
    };

    const handleRequestPayment = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/api/request-payment/${groupId}`, {
                amount: parseFloat(paymentAmount),
            });
            setTransaction(response.data);
            setPaymentAmount(0);
            setError("");
        } catch (error) {
            console.error('Error requesting payment:', error);
            setError("Failed to create payment request. Ensure pool funds are sufficient.");
        }
    };

    const handleApprovePayment = async () => {
        try {
            if (isLoaded && user) {
                const email = user.primaryEmailAddress.emailAddress;
                const response = await axios.post(`http://localhost:3001/api/approve-payment/${transaction._id}`, {
                    email
                });
                setTransaction(response.data);
                if (response.data.status === "approved") {
                    // Transaction approved, refresh group data and approved transactions
                    const updatedGroup = await axios.get(`http://localhost:3001/api/groups/${groupId}`);
                    const updatedApprovedTransactions = await axios.get(`http://localhost:3001/api/approved-transactions/${groupId}`);
                    setGroup(updatedGroup.data);
                    setApprovedTransactions(updatedApprovedTransactions.data);
                    setTransaction(null); // Clear transaction after full approval
                }
                setError("");
            }
        } catch (error) {
            console.error('Error approving payment:', error);
            setError("Failed to approve payment.");
        }
    };

    const handleDenyPayment = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/deny-payment/${transaction._id}`);
            setTransaction(null);
            setError("");
        } catch (error) {
            console.error('Error denying payment:', error);
            setError("Failed to deny payment.");
        }
    };

    if (!group) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md my-[100px]">
            <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="mb-4">
                <h4 className="text-lg font-semibold">Members:</h4>
                <ul className="mt-2">
                    {group.members.map(member => (
                        <li key={member._id} className="text-gray-700">
                            {member.email} - Pooled Amount: ${member.pooledAmount}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <span className="text-lg font-bold">Total Pooled Amount: ${group.totalPool}</span>
            </div>

            {/* Add Money to Pool Section */}
            <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Add Money to Pool</h3>
                <input
                    type="number"
                    className="p-2 border rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter amount to add"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <button
                    onClick={handleAddToPool}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add to Pool
                </button>
            </div>

            {/* Request Payment Section */}
            <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Request Payment</h3>
                <input
                    type="number"
                    className="p-2 border rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter amount to request"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                />
                <button
                    onClick={handleRequestPayment}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    Request Payment
                </button>
            </div>

            {/* Approve or Deny Payment Section */}
            {transaction && transaction.status === "pending" && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2">Pending Payment Approval</h3>
                    <p className="text-gray-700">Amount Requested: ${transaction.amount}</p>
                    <h4 className="text-lg font-semibold mt-2">Approval Status:</h4>
                    <ul className="mt-2">
                        {transaction.approvals.map(approval => (
                            <li key={approval.email} className="text-gray-700">
                                {approval.email} - {approval.status === "approved" ? "Approved" : "Pending"}
                            </li>
                        ))}
                    </ul>
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    <button
                        onClick={handleApprovePayment}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors mr-2"
                    >
                        Approve Payment
                    </button>
                    <button
                        onClick={handleDenyPayment}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Deny Payment
                    </button>
                </div>
            )}

            {/* Approved Transactions Section */}
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-2">Approved Transactions</h3>
                <ul className="mt-2">
                    {approvedTransactions.map(transaction => (
                        <li key={transaction._id} className="text-gray-700">
                            Amount: ${transaction.amount} - Approved By: {transaction.approvals.length} members
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GroupDetails;
