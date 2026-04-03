module.exports = [
  {
    name: 'Airso Airway',
    img: 'ariso.jpg',
    dep: 'HAN',
    arr: 'SGN',
    terminalDep: 'T1',
    terminalArr: 'T2',
    depTime: '08:30',
    arrTime: '10:45',
    duration: '2h 15m',
    depDate: '2026-04-04',
    arrDate: '2026-04-05',
    stops: 'Direct',
    price: 120,
    baggageRules: [
        { id: 1, text: '7kg Hành lý xách tay' },
        { id: 2, text: 'Suất ăn nhẹ & nước uống' }
    ],
    isCheapest: true,
    seats: {
      business: { total: 10, booked: 2, priceAddOn: 150, baggage: "45kg Checked + 15kg Cabin" },
      economyStandard: { total: 30, booked: 5, priceAddOn: 25, baggage: "23kg Checked + 7kg Cabin" },
      economyLite: { total: 100, booked: 40, priceAddOn: 0, baggage: "10kg Checked + 7kg Cabin" }
    }
  },
  {
    name: 'Camp Airway',
    img: 'fly.jpg',
    dep: 'HAN',
    arr: 'SGN',
    terminalDep: 'T1',
    terminalArr: 'T2',
    depTime: '14:00',
    arrTime: '17:30',
    duration: '3h 30m',
    depDate: '2026-04-04',
    arrDate: '2026-04-05',
    stops: '1 Stop',
    price: 145,
    baggageRules: [
        { id: 1, text: '10kg Hành lý xách tay' },
        { id: 2, text: 'Suất ăn nhẹ & nước uống' }
    ],
    isCheapest: false,
    seats: {
      business: { total: 0, booked: 0, priceAddOn: 0, baggage: "40kg Checked + 14kg Cabin" },
      economyStandard: { total: 40, booked: 10, priceAddOn: 20, baggage: "20kg Checked + 7kg Cabin" },
      economyLite: { total: 120, booked: 60, priceAddOn: 0, baggage: "10kg Checked + 7kg Cabin" }
    }
  },
  {
    name: 'Airso Airway',
    img: 'ariso.jpg',
    dep: 'SGN',
    arr: 'HAN',
    terminalDep: 'T1',
    terminalArr: 'T2',
    depTime: '08:30',
    arrTime: '10:45',
    duration: '2h 15m',
    depDate: '2026-04-06',
    arrDate: '2026-04-07',
    stops: 'Direct',
    price: 120,
    baggageRules: [
        { id: 1, text: '7kg Hành lý xách tay' },
        { id: 2, text: 'Suất ăn nhẹ & nước uống' }
    ],
    isCheapest: true,
    seats: {
      business: { total: 10, booked: 2, priceAddOn: 150, baggage: "45kg Checked + 15kg Cabin" },
      economyStandard: { total: 30, booked: 5, priceAddOn: 25, baggage: "23kg Checked + 7kg Cabin" },
      economyLite: { total: 100, booked: 40, priceAddOn: 0, baggage: "10kg Checked + 7kg Cabin" }
    }
  },
];