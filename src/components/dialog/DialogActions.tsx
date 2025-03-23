
interface DialogActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitDisabled: boolean;
}

const DialogActions = ({ 
  onCancel, 
  onSubmit, 
  submitLabel, 
  isSubmitDisabled 
}: DialogActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitDisabled}
        onClick={onSubmit}
        className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
          !isSubmitDisabled
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default DialogActions;
