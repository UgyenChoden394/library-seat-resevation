'use client';

import { useEffect, useState } from 'react';
import AddSeatModal from './add-seat/addSeatModal';
import { addSeat, deleteSeat, getSeatsData, updateSeat } from './actions/seatActions';
import toast from 'react-hot-toast';
import Loader from '@/components/loader';
import ConfirmationDialog from '@/components/confirmationDialog';

export default function Dashboard() {
  const [seatLists, setSeats] = useState<any[]>([]);
  const [showPopup, setShowSeatDialog] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<any | null>(null);
  const [loadingState, setLoadingState] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [seatToDelete, setSeatToDelete] = useState<any | null>(null);

  useEffect(() => {
    const loadSeats = async () => {
      try {
        const data = await getSeatsData();
        setSeats(data);
      } catch (error) {
        console.error('Error fetching seats: ', error);
      } finally {
        setLoadingState(false);
      }
    };
    loadSeats();
  }, []);

  const handleAddSeat = () => {
    setSelectedSeat(null); // For adding a new seat
    setShowSeatDialog(true);
  }

  const handleEditSeat = (seat: any) => {
    setSelectedSeat(seat); // For editing existing seat
    setShowSeatDialog(true);
  };

  const saveSeat = async (seatData:any) => {
    try{
      setLoadingState(true);
      if(selectedSeat) {
        // Update seat action
        await updateSeat(selectedSeat.id, seatData);
        setSeats(
          seatLists.map((seat) =>
            seat.id === selectedSeat.id ? { ...seat, ...seatData } : seat
          )
        );
      } else {
        const docRef = await addSeat(seatData);
        setSeats([...seatLists, { id: docRef.id, ...seatData }]);
        toast.success('Seat Added Succesfully!')
      }
    } catch (err) {
      console.error('Error saving seat:', err);
    } finally {
      setShowSeatDialog(false);
      setLoadingState(false);
    }
  }

  const handleDeleteSeat = async (seatData: any) => {
    setShowConfirmDelete(true);
    setSeatToDelete(seatData)
  };

  const confirmDeleteSeat = async () => {
    if (seatToDelete) {
      setLoadingState(true);
      try {
        await deleteSeat(seatToDelete.id);
        setSeats(seatLists.filter((seat) => seat.id !== seatToDelete.id));
      } catch (error) {
        console.error('Error deleting seat:', error);
      } finally {
        setShowConfirmDelete(false);
        setSeatToDelete(null);
        setLoadingState(false);
      }
    }
  }

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setSeatToDelete(null);
  };

  return (
      <div className='p-8 bg-white rounded-lg flex-1'>
        {loadingState && <Loader />}
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-semibold mb-4'>Seats Management </h1>
          <button className='bg-blue-500 text-white px-4 py-2 rounded font-bold' onClick={handleAddSeat}> 
            Add Seat 
          </button>
        </div>

        <div className='overflow-y-scroll h-[80dvh]'>
          <div className='flex w-full gap-8 flex-wrap mt-2'>
            {
              seatLists.map((seat) => (
                <div key={seat.id} className='border p-4 rounded-xl w-[calc(100%/4-24px)] shadow-sm bg-gray-100'>
                  <img src={seat.imageUrl || '/room-image.jpeg'} className='w-full h-[230px] object-cover rounded' />
                  <div className='flex flex-col justify-center items-center'>
                    <p className={`p-2 my-4 font-bold text-center rounded-full w-1/2 
                    ${seat.status === 'available' ? 'text-green-600 bg-green-200' : 'text-blue-900 bg-blue-100'}`}>
                      {seat.status.charAt(0).toUpperCase() + seat.status.slice(1)}
                    </p>
                    <h2 className='text-lg font-bold bg-white w-full py-2 text-center rounded-lg'>{`Seat - ${seat.seatNumber}` }</h2>
                    <h2 className='text-lg font-semibold mt-2 text-gray-500'>{`${seat.floorNo} - ${seat.tableNo}`}</h2>
                  </div>
                  <div className='flex justify-between mt-4'>
                    <button onClick={() => handleEditSeat(seat)} className='bg-blue-500 text-white py-2 px-8 rounded-2xl font-bold'>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteSeat(seat)} className='text-red-500 py-2 px-8 rounded-2xl font-bold border border-red-500'>
                      Delete
                    </button>
                  </div>
              </div>
              ))
            }
          </div>
        </div>

        <AddSeatModal 
          isOpen={showPopup}
          onClose={() => setShowSeatDialog(false)}
          onSave={saveSeat}
          seat={selectedSeat}
        />
        
        <ConfirmationDialog 
                isOpen={showConfirmDelete}
                onConfirm={confirmDeleteSeat}
                onCancel={cancelDelete}
                imageUrl={seatToDelete?.imageUrl}
                message={`Are you sure you want to delete this Seat: ( ${seatToDelete?.seatNumber} - ${seatToDelete?.tableNo} - ${seatToDelete?.floorNo}) ?`}
              />
      </div>
    );
  }
