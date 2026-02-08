'use client';

export default function GetStartedButton() {
  const handleGetStarted = () => {
    console.log('Get Started clicked');
  };

  return (
    <button
      onClick={handleGetStarted}
      className="px-4 py-2 bg-black text-white rounded"
    >
      Get Started
    </button>
  );
}
