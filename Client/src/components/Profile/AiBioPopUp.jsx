import { useState } from "react";
import { useDispatch } from "react-redux";
import { generateBioWithAI } from "../../../Redux/Slices/ProfileSlice";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

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

  return createPortal(
  <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">

      <div className="w-full max-w-lg bg-gradient-to-b from-indigo-900 to-[#2E2A8C] rounded-2xl shadow-[0_25px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden relative text-white">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/20">
          <h2 className="text-lg font-semibold">
            Generate Bio
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">

          {/* INPUTS */}
          <div className="space-y-4 mb-6">

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-white/90">
                Role
              </label>

              <input
                type="text"
                name="role"
                value={bioInput.role}
                onChange={handleBioInputChange}
                placeholder="Role (e.g. Frontend Developer)"
                className="w-full px-4 py-2.5 border border-white/20 bg-white rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-white transition"
              />
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-white/90">
                Experience
              </label>

              <input
                type="text"
                name="experience"
                value={bioInput.experience}
                onChange={handleBioInputChange}
                placeholder="Experience (e.g. 1 year, beginner)"
                className="w-full px-4 py-2.5 border border-white/20 bg-white rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-white transition"
              />
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-white/90">
                Key Skills
              </label>

              <input
                type="text"
                name="skills"
                value={bioInput.skills}
                onChange={handleBioInputChange}
                placeholder="Key Skills (comma separated)"
                className="w-full px-4 py-2.5 border border-white/20 bg-white rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-white transition"
              />
            </div>

            {/* Highlights */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-white/90">
                Key Highlights
              </label>

              <input
                type="text"
                name="highlights"
                value={bioInput.highlights}
                onChange={handleBioInputChange}
                placeholder="Highlights / Achievements"
                className="w-full px-4 py-2.5 border border-white/20 bg-white rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-white transition"
              />
            </div>

          </div>

          {/* Generate button */}
          {!generatedBio && (
            <button
              type="button"
              onClick={handleGenerateButton}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-white text-indigo-900 font-semibold hover:bg-slate-100 transition mb-6 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate with AI"}
            </button>
          )}

          {/* Generated Bio */}
          {generatedBio && (
            <>
              <div className="border-t border-white/20 pt-5 mb-5">
                <h3 className="text-sm font-semibold mb-2">
                  Generated Bio
                </h3>

                <div className="bg-white/95 border border-white/20 rounded-lg p-4 text-sm text-slate-800 whitespace-pre-line">
                  {generatedBio}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={handleGenerateButton}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg border border-white/30 text-white hover:bg-white/10 transition disabled:opacity-60"
                >
                  {loading ? "Regenerating..." : "Regenerate"}
                </button>

                <button
                  type="button"
                  onClick={() => onDone(generatedBio)}
                  className="flex-1 py-2.5 rounded-lg bg-white text-indigo-900 font-semibold hover:bg-slate-100 transition"
                >
                  Use Bio
                </button>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  </>,
  document.body
);
}

export default AiBioPopup;

