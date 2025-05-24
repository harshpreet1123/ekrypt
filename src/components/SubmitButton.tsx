interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
}

export function SubmitButton({ isLoading, text, loadingText }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full py-3 px-4 rounded-lg font-bold ${
        isLoading ? 'bg-blue-700' : 'bg-gradient-to-r from-blue-600 to-purple-600'
      } hover:opacity-90 transition-opacity flex items-center justify-center`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
}