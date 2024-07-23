import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FeatureCard = ({ icon, title, description }) => (
  <div className="d-flex flex-column align-items-center p-3" style={{ backgroundColor: '#8B2F2F', borderRadius: '10px', flex: 1, margin: '0 10px' }}>
    <div className="mb-2" style={{ fontSize: '24px' }}>{icon}</div>
    <div className="text-center" style={{ color: 'white' }}>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  </div>
);

const BookingBanner = () => {
  return (
    <div className="d-flex justify-content-between align-items-center p-4" style={{ backgroundColor: '#D54444', borderRadius: '20px' }}>
      <div className="d-flex flex-column justify-content-center align-items-start" style={{ flex: 1, color: 'white' }}>
        <h3>Find and book your perfect stay</h3>
      </div>
      <div className="d-flex" style={{ flex: 2 }}>
        <FeatureCard
          icon="🌙"
          title="Earn rewards on every night you stay"
          description=""
        />
        <FeatureCard
          icon="🏷️"
          title="Save more with Member Prices"
          description=""
        />
        <FeatureCard
          icon="📅"
          title="Free cancellation options if plans change"
          description=""
        />
      </div>
    </div>
  );
};

export default BookingBanner;
