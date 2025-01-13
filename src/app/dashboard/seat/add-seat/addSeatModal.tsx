import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';

export default function AddSeatModal({isOpen, onClose, onSave, seat}: any) {
    const [seatData, setSeatData] = useState(
        seat || { seatNumber: '', floorNo: '', tableNo: '', status: '', imageUrl: '' }
      );
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
      if (seat) { 
        setSeatData(seat);
        setPreviewImage(seat.imageUrl || null); // Use existing image URL for preview
      } else {
        setSeatData({
          seatNumber: '',
          floorNo: '',
          tableNo: '',
          status: '',
          imageUrl: '',
        });
        setPreviewImage(null);
        setImageFile(null);
      }
    }, [seat]);

    useEffect(() => {
    const isValid =
        seatData?.seatNumber?.trim() !== '' &&
        seatData?.floorNo?.trim() !== '' &&
        seatData?.tableNo?.trim() !== '' &&
        seatData?.status?.trim() !== '' && 
        imageFile !== null;
    setIsFormValid(isValid);
    }, [seatData]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSeatData({ ...seatData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file)); // Preview the selected image
      }
    };

    const handleImageUpload = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file); // Convert image to base64 string
      });
    };

    const handleSubmit = async () => { debugger
      if (!imageFile && !seat.imageUrl) {
        console.log('Please select an image file');
        return;
      }

      try {

        const uploadedImageUrl = imageFile !== null ? await handleImageUpload(imageFile) : seat?.imageUrl || '';
        // const uploadedImageUrl = await handleImageUpload(imageFile || seat.imageUrl); // Upload the image to Firebase
        const updatedSeatData = { ...seatData, imageUrl: uploadedImageUrl }; // Add image URL to seat data
    
        onSave(updatedSeatData); // Save the updated seat data
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
      }
    };

    return isOpen ? (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded shadow-lg w-1/3'>
            <h2 className='text-xl font-bold mb-4'>{seat ? 'Edit Seat' : 'Add Seat'}</h2>
            <input
              type='text'
              name='seatNumber'
              value={seatData.seatNumber}
              onChange={handleChange}
              placeholder='Seat Number'
              className='w-full mb-4 p-2 border rounded'
            />
            <input
              type='text'
              name='floorNo'
              value={seatData.floorNo}
              onChange={handleChange}
              placeholder='Floor'
              className='w-full mb-4 p-2 border rounded'
            />
            <input
              type='text'
              name='tableNo'
              value={seatData.tableNo}
              onChange={handleChange}
              placeholder='Table'
              className='w-full mb-4 p-2 border rounded'
            />
            <select
              name='status'
              value={seatData.status}
              onChange={handleChange}
              className='w-full mb-4 p-2 border rounded'
            >
               <option value='' disabled>
                   -- Select Status --
              </option>
              <option value='available'>Available</option>
              <option value='reserved'>Reserved</option>
            </select>
            {/* Image Upload Section */}
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>Room Image</label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  className='w-full p-2 border rounded'
                />
                {previewImage && (
                  <div className='mt-4'>
                    <p className='text-sm text-gray-600 mb-2'>Preview:</p>
                    <img src={previewImage} alt='Preview' className='w-[200px] rounded' />
                  </div>
                )}
              </div>
            <div className='flex justify-end'>
              <button className='text-blue-500 px-4 py-2 rounded-xl border border-blue-500 mr-2' onClick={onClose}>
                Cancel
              </button>
              <button disabled={!seat ? !isFormValid : false}
                className={`px-4 py-2 rounded-xl ${
                  !seat ? !isFormValid : true ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null;
}
