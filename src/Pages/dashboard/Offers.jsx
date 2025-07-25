import { useEffect, useState } from 'react';

export default function Offers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Combined offers (apps + CPA tasks)
    setOffers([
      {
        id: 1,
        title: 'Sign Up on Finz Wallet',
        reward: 200,
        description: 'Register on Finz Wallet and complete your KYC.',
        link: 'https://example.com/finz',
        type: 'Signup',
      },
      {
        id: 2,
        title: 'Install the Vuga App',
        reward: 150,
        description: 'Download and open the Vuga app for 2 minutes.',
        link: 'https://example.com/vuga',
        type: 'App',
      },
      {
        id: 3,
        title: 'Join SendWave',
        reward: 250,
        description: 'Create an account and verify your phone number.',
        link: 'https://example.com/sendwave',
        type: 'Signup',
      },
      {
        id: 4,
        title: 'Download Budget Pal',
        reward: 220,
        description: 'Install Budget Pal and set up a budget plan.',
        link: 'https://example.com/budgetpal',
        type: 'App',
      },
      {
        id: 5,
        title: 'Scan with QuickScan Pro',
        reward: 150,
        description: 'Install QuickScan Pro and scan a document.',
        link: 'https://example.com/quickscan',
        type: 'App',
      },
    ]);
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white text-center">🎁 Earn From Offers & Apps</h1>

      {offers.length === 0 ? (
        <p className="text-center text-gray-500">No tasks available right now.</p>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white border border-green-100 rounded-lg p-4 shadow"
            >
              <h2 className="text-lg font-semibold text-green-700">{offer.title}</h2>
              <p className="text-sm text-gray-600 mb-1">{offer.description}</p>
              <p className="text-sm text-green-600 font-medium">Reward: ₦{offer.reward}</p>
              <a
                href={offer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block w-full bg-green-600 text-white py-2 rounded text-center hover:bg-green-700 transition"
              >
                {offer.type === 'App' ? 'Download App' : 'Claim Offer'}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
