'use client';
import { useEffect, useState } from 'react';
import { fetchUsers } from './actions/fetchUser';
import Loader from '@/components/loader';
import ConfirmationDialog from '@/components/confirmationDialog';
import { deleteUserFromFirebase } from './actions/deleteUser';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() =>{ 
    const loadUsers = async () => {
      try {
        const getUsers = await fetchUsers();
        setUsers(getUsers);
      } catch (err) {
        console.log('Error Fetching Users: ', err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        // Delete user from Firebase Authentication and Firestore
        await deleteUserFromFirebase(userToDelete.id);
        // Refresh user list
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        toast.success('User deleted successfully!');
      } catch (err) {
        console.error('Error deleting user:', err);
      } finally {
        setShowConfirmDialog(false);
        setUserToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setUserToDelete(null);
  };

  return (
    <div className='p-8 bg-white rounded-lg flex-1'>
      {loading && <Loader />}
      <h1 className='text-2xl font-semiboldmb-4'>Users</h1>
      <table className='w-full border border-gray-300 rounded-lg shadow-sm mt-4'>
        <thead>
          <tr className='bg-gray-200 text-gray-600'>
            <th className="py-2 px-4 text-left">Student ID</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            user.role !== 'admin' && 
            <tr key={user.id} className='hover:bg-gray-100 mt-4 border-b'>
              <td className='py-4 px-4'> {user.student_id} </td>
              <td className='py-2 px-4'> {user.name} </td>
              <td className='py-2 px-4'> {user.email} </td>
              <td className='py-2 px-4'>
                <div className='cursor-pointer text-red-500' onClick={() => handleDeleteUser(user)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationDialog 
        isOpen={showConfirmDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message={`Are you sure you want to delete this "${userToDelete?.name}"?`}
      />
    </div>
  );
}
