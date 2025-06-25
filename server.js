const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Mock database for shipment tracking data. In a real application, this would
// come from a database like MongoDB, PostgreSQL, etc.
const mockTrackingData = {
  '12345ABC': {
    id: '12345ABC',
    status: 'In Transit',
    lastUpdate: '2023-10-27T10:00:00Z',
    estimatedDelivery: '2023-10-29',
    history: [
      'October 27, 2023, 10:00 AM: Departed from facility in New York, NY',
      'October 26, 2023, 08:00 PM: Arrived at facility in New York, NY',
      'October 26, 2023, 02:00 PM: Picked up by carrier',
      'October 25, 2023, 09:00 AM: Shipment information received'
    ]
  },
  '67890XYZ': {
    id: '67890XYZ',
    status: 'Delivered',
    lastUpdate: '2023-10-25T02:30:00Z',
    estimatedDelivery: '2023-10-25',
    history: [
      'October 25, 2023, 02:30 PM: Delivered to front door.',
      'October 25, 2023, 08:00 AM: Out for delivery',
      'October 24, 2023, 06:00 PM: Arrived at local delivery station',
      'October 23, 2023, 11:00 AM: Departed from hub in Chicago, IL'
    ]
  }
};

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend requests

// API Route: GET /api/track/:trackingNumber
app.get('/api/track/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const data = mockTrackingData[trackingNumber];

  if (data) {
    return res.json(data);
  }
  return res.status(404).json({ message: `Tracking number ${trackingNumber} not found.` });
});

app.listen(port, () => {
  console.log(`Tracking server listening at http://localhost:${port}`);
});