import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Step4Interests({ prevStep, data, updateForm }) {
  const navigate = useNavigate();

  const [local, setLocal] = useState({
    interests: data.interests || [],
    device: data.device || '',
  });

  const interestsList = [
    'Gaming',
    'Shopping',
    'Travel',
    'Finance',
    'Fitness',
    'Entertainment',
    'Technology',
    'Crypto',
    'Education',
  ];

  const toggleInterest = (interest) => {
    setLocal((prev) => {
      const updated = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const handleChange = (e) => {
    setLocal({ ...local, [e.target.name]: e.target.value });
  };

  const handleFinish = () => {
    updateForm(local);

    // TODO: Save formData to backend here
    console.log('Final Onboarding Data:', { ...data, ...local });

    navigate('/dashboard');
  };

  // ✅ FINAL SUBMIT BUTTON HANDLER
const handleSubmit = () => {
  // Save to backend or localStorage if needed
  localStorage.setItem('onboardingComplete', 'true');
  navigate('/dashboard');
};


  return (
    <div className="space-y-4">
      <label className="block text-sm text-gray-600">What are your interests?</label>
      <div className="grid grid-cols-2 gap-2">
        {interestsList.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => toggleInterest(item)}
            className={`border rounded px-3 py-1 text-sm ${
              local.interests.includes(item)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <label className="block text-sm text-gray-600 pt-4">Device you use most</label>
      <select
        name="device"
        value={local.device}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
        required
      >
        <option value="">Select device</option>
        <option>Android</option>
        <option>iPhone</option>
        <option>Windows PC</option>
        <option>Mac</option>
        <option>Tablet</option>
      </select>

      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          onClick={handleFinish}
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
