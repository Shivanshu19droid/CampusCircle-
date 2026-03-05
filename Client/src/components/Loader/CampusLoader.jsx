function CampusLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-indigo-900 z-50">

      {/* Brand */}
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
        CampusCircle
      </h1>

      <p className="text-indigo-200 mt-2 text-sm md:text-base">
        Your campus at your fingertips
      </p>

      {/* Loader Animation */}
      <div className="flex gap-2 mt-8">

        <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:150ms]"></span>
        <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:300ms]"></span>

      </div>

    </div>
  );
}

export default CampusLoader;