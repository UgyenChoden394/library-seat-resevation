export default function ConfirmationDialog({isOpen, onConfirm, onCancel, message}: 
    { isOpen: boolean; onConfirm: () => void; onCancel: () => void;message: string;})
{
    if(!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{message}</h2>
          <div className="flex justify-between">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={onConfirm}>
              Confirm Delete
            </button>
            <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

}