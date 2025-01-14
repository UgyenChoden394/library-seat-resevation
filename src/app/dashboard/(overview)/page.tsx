'use client';
import { useEffect, useState } from 'react';
import { getSeatsData } from '../seat/actions/seatActions';
import { fetchUsers } from '../users/actions/fetchUser';
import Loader from '@/components/loader';
import { fetchCurrentUserData } from '@/app/firebase/authConfig';

export default function Dashboard() {
  const [totalSeats, setTotalSeats] = useState(0);
  const [reservedSeats, setReservedSeats] = useState(0);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true); 
  const [userNmae, setUserName]= useState({name: ''});

  useEffect(() => {
    const loadData = async () => {
      try {
        const seats = await getSeatsData();
        const users = await fetchUsers();
        const currentUser = await fetchCurrentUserData();

        setUserName(currentUser.name);
        setTotalSeats(seats?.length);
        setReservedSeats(seats?.filter((seat: any) => seat.status === 'reserved')?.length);
        setAvailableSeats(seats?.filter((seat: any) => seat.status === 'available')?.length);

        const nonAdminUsers = users.filter((user: any) => user.role !== 'admin');
        setTotalUsers(nonAdminUsers.length);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  return (
      <div className="p-8 bg-white rounded-lg flex-1">
        {loading && <Loader />}
      <h1 className="text-2xl font-semibold mb-6">{`Welcome back! ${userNmae || 'Admin'}`}</h1>
      <div className="w-full flex justify-evenly">
        {/* Total Seats Card */}
        <div className="w-[30%] bg-yellow-100 p-4 rounded-3xl shadow-md flex flex-col">
          <div className='flex justify-end items-end mb-8'>
            <div className="bg-yellow-200 rounded-full w-12 h-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
          </div>
          <div className='mt-12'>
            <h2 className="text-3xl font-bold">{totalSeats}</h2>
            <p className="text-gray-600 text-xl">Total Seats</p>
          </div>
        </div>

        {/* Reserved Seats Card */}
        <div className="w-[30%] bg-blue-100 p-4 rounded-3xl shadow-md flex flex-col">
          <div className='flex justify-end items-end mb-8'>
            <div className="bg-blue-200 rounded-full w-12 h-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>
          <div className='mt-12'>
            <h2 className="text-3xl font-bold">{reservedSeats}</h2>
            <p className="text-gray-600 text-xl">Seat Reserved</p>
          </div>
        </div>

        {/* Available Seats Card */}
        <div className="w-[30%] bg-green-100 p-4 rounded-3xl shadow-md flex flex-col">
          <div className='flex justify-end items-end mb-8'>
            <div className="bg-green-200 rounded-full w-12 h-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
          </div>
          <div className='mt-12'>
            <h2 className="text-3xl font-bold">{availableSeats}</h2>
            <p className="text-gray-600 text-xl">Seat Available</p>
          </div>
        </div>
      </div>
         {/* Total Users Card */}
        <div className="w-1/2 bg-red-100 p-4 rounded-3xl shadow-md flex flex-col ml-[40px] mt-8">
          <div className='flex justify-end items-end mb-8'>
            <div className="bg-red-200 rounded-full w-12 h-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-800">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{totalUsers}</h2>
            <p className="text-gray-600 text-xl">Total Users</p>
          </div>         
        </div>
    </div>
    );
  }
