export default function ConfirmationDialog({isOpen, onConfirm, onCancel, message, imageUrl, confirmMsg, customClass}: 
    { isOpen: boolean; onConfirm: () => void; onCancel: () => void ; message: string, imageUrl?: string; confirmMsg?: string, customClass?:string})
{
    if(!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{message}</h2>
          <div className='flex justify-center items-center my-4'>
           {imageUrl && <img src={imageUrl} alt='Image To Delete' className='w-[250px] h-[270px] rounded-2xl object-cover' />}
          </div>
          <div className="flex justify-between mt-8">
            <button className={` px-4 py-2 rounded-lg ${customClass ? customClass : 'bg-red-500 text-white'}`} 
              onClick={onConfirm}>
              {confirmMsg ? confirmMsg  : 'Confirm Delete'}
            </button>
            <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

}
