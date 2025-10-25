import { useState } from "react";
import { useDispatch } from "react-redux";
import { generateBioWithAI } from "../../../Redux/Slices/ProfileSlice";
import { useNavigate } from "react-router-dom";

function AiBioPopup({ onDone, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [bioInput, setBioInput] = useState({
    role: "",
    experience: "",
    skills: "",
    highlights: "",
  });

  const [generatedBio, setGeneratedBio] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleBioInputChange = (e) => {
    const { name, value } = e.target;
    setBioInput((prev) => ({ ...prev, [name]: value }));
  };

  // Generate bio using AI
  const handleGenerateButton = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await dispatch(generateBioWithAI(bioInput));
      if (response?.payload?.bio) {
        setGeneratedBio(response.payload.bio);
      } else {
        setGeneratedBio("Sorry, failed to generate bio. Try again!");
      }
    } catch (err) {
      console.error("Error generating bio:", err);
      setGeneratedBio("An error occurred while generating bio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          ✨ Generate Your Bio with AI
        </h2>

        {/* Input fields */}
        <div className="space-y-3 mb-4">
          <input
            type="text"
            name="role"
            value={bioInput.role}
            onChange={handleBioInputChange}
            placeholder="Role (e.g. Frontend Developer)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="experience"
            value={bioInput.experience}
            onChange={handleBioInputChange}
            placeholder="Experience (e.g. 1 year, beginner, etc.)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="skills"
            value={bioInput.skills}
            onChange={handleBioInputChange}
            placeholder="Key Skills (comma separated)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="highlights"
            value={bioInput.highlights}
            onChange={handleBioInputChange}
            placeholder="Highlights / Achievements"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Generated bio section */}
        {generatedBio && (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
            <p className="text-gray-700 whitespace-pre-line">{generatedBio}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {!generatedBio ? (
            <button
              type="button"
              onClick={handleGenerateButton}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleGenerateButton}
                disabled={loading}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-60"
              >
                {loading ? "Regenerating..." : "Regenerate"}
              </button>
              <button
                type="button"
                onClick={() => onDone(generatedBio)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AiBioPopup;

