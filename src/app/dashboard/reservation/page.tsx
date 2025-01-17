'use client';

import { useEffect, useState } from 'react';
import { getSeatsData, updateSeat } from '../seat/actions/seatActions';
import Loader from '@/components/loader';
import ConfirmationDialog from '@/components/confirmationDialog';
import { fetchCurrentUserData } from '@/app/firebase/authConfig';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Dashboard() {
  const [seatsList, setSeats] = useState<any[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [modalText, setModalText] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<any | null>(null);
  const [customClass, setCustomClass] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeatsData = async () => {
      try{
        const seatData = await getSeatsData();
        const currentUser = await fetchCurrentUserData();
        setSeats(seatData);
        setUser(currentUser);
      } catch(err) {
        console.log('Error fetching seats: ', err);
      }finally {
        setLoading(false);
      }
    };
    loadSeatsData();
  },[]);

  const cancelDailog = () => {
    setShowConfirmDialog(false);
    // setSeatToDelete(null);
  };

  const handleOnclickAction = (seat: any, text: string, classCustom: string) => {
    setModalText(text);
    setSelectedSeat(seat);
    setCustomClass(classCustom);
    setShowConfirmDialog(true);
  } 

  const confirmAction = async () => {
    try {
      setLoading(true);
      if(modalText === 'Reserve') {
        const updatedSeat = {
          ...selectedSeat,
          status: 'reserved',
          userName: user.name ? user.name : 'Admin',
          userId: user.id || '',
          startTime: new Date().toISOString(),
          endTime: null
        };
        await updateSeat(selectedSeat.id, updatedSeat); 
        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.id === selectedSeat.id ? updatedSeat : seat
          )
        );
        toast.success('Seat Booked Succesfully!');
      } else if (modalText === 'Release') {
        const updatedSeat = {
          ...selectedSeat,
          status: 'available',
          userName: null,
          userId: user.id || '',
          endTime: new Date().toISOString()
        };
        await updateSeat(selectedSeat.id, updatedSeat); // Update seat in Firestore
        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.id === selectedSeat.id ? updatedSeat : seat
          )
        );
        toast.success('Seat Released Succesfully!')
      }
    } catch (err) {
      console.log('Error While Booking Seat',err)
    } finally{
      setShowConfirmDialog(false);
      setLoading(false);
    }
  }
  return (
      <div className='p-8 bg-white rounded-lg '>
        {loading && <Loader />}
        <h1 className="text-2xl font-semibold mb-6">Seat Reservation</h1>
        <table className='min-w-full border-collapse border border-gray-400'>
          <thead>
            <tr className='bg-gray-100 text-gray-600'>
              <th className='py-2 px-4 text-left'>Seats</th>
              <th className='py-2 px-4 text-left'>User</th>
              <th className='py-2 px-4 text-left'>Start Date</th>
              <th className='py-2 px-4 text-left'>End Date</th>
              <th className='py-2 px-4 text-left'> Status</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              seatsList.map((seat) => (
              <tr key={seat.id} className='border-b'>
                <td className='py-2 px-4 text-left'>
                  <div className='flex'>
                    <div>
                      <img src={seat.imageUrl} className='w-[48px] h-[48px] rounded-lg' />
                    </div>
                    <div className='ml-4'>
                      <p className='font-bold'>{`Seat ${seat.seatNumber}`}</p>
                      <p>{`${seat.floorNo} - ${seat.tableNo}`}</p>
                    </div>
                  </div>
                </td>
                <td className='py-2 px-4 text-left'>{seat.userName || '-'}</td>
                <td className='py-2 px-4 text-left'>
                  {seat?.startTime && !isNaN(new Date(seat.startTime).getTime()) 
                    ? format(new Date(seat.startTime), "hh:mm:ss a, MMM dd, yyyy") 
                  : '-'}
                </td>
                <td className='py-2 px-4 text-left'> {seat?.endTime && !isNaN(new Date(seat.endTime).getTime()) 
                    ? format(new Date(seat.endTime), "hh:mm:ss a, MMM dd, yyyy") : '-'}
                </td>
                <td className='py-6'>
                  <p className={`p-1 font-bold text-center rounded-full w-[70%] 
                    ${seat.status === 'available' ? 'text-green-600 bg-green-200' : 'text-blue-900 bg-blue-100'}`}>
                      {seat.status.charAt(0).toUpperCase() + seat.status.slice(1)}
                  </p> 
                </td>
                <td className='py-2 px-4 text-left'>
                {seat.status === 'available' ? (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold" onClick={() => handleOnclickAction(seat, 'Reserve', 'bg-blue-500 text-white')}>
                    Book Seat
                  </button>
                  ) :  ( (seat.userId === user.id || user.role === 'admin') &&
                    <button className="border border-red-400 text-red-600 font-bold px-4 py-2 rounded-xl" 
                      onClick={() => handleOnclickAction(seat, 'Release', 'border border-red-400 text-red-600')}>
                      Release
                    </button>
                  )}
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
        <ConfirmationDialog 
          isOpen={showConfirmDialog}
          onConfirm={confirmAction}
          onCancel={cancelDailog}
          imageUrl={selectedSeat?.imageUrl}
          confirmMsg={`Confirm ${modalText}`}
          customClass={customClass}
          message={`Are you sure want to ${modalText} this Seat : (${selectedSeat?.seatNumber} - ${selectedSeat?.tableNo} - ${selectedSeat?.floorNo}) ?`}
        />
      </div>
    );
  }
