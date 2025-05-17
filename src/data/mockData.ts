import { PortfolioItem } from '../types';

// Mock data for development
export const mockPortfolioData: PortfolioItem[] = [
  {
    cedmil: '1234567890',
    nomcli: 'Juan Pérez',
    fechanacimiento: '1980-05-15',
    sexo: 'M',
    edad: 43,
    ciucli: 'Bogotá',
    codemp: 'EMP001',
    numlib: 'CR001',
    valcuo: 1500000,
    valtot: 36000000,
    fecini: '2022-01-15',
    fecfin: '2025-01-15',
    saldocapital: 27000000,
    ncuotas: 36,
    npagos: 12,
    diasmora: 0,
    calidad: 'Buena',
    riesgo: 'A',
  },
  {
    cedmil: '0987654321',
    nomcli: 'María Rodríguez',
    fechanacimiento: '1975-08-22',
    sexo: 'F',
    edad: 48,
    ciucli: 'Medellín',
    codemp: 'EMP002',
    numlib: 'CR002',
    valcuo: 2200000,
    valtot: 52800000,
    fecini: '2021-10-10',
    fecfin: '2024-10-10',
    saldocapital: 28600000,
    ncuotas: 36,
    npagos: 20,
    diasmora: 15,
    calidad: 'Regular',
    riesgo: 'B',
  },
  {
    cedmil: '5678901234',
    nomcli: 'Carlos Gómez',
    fechanacimiento: '1990-03-10',
    sexo: 'M',
    edad: 33,
    ciucli: 'Cali',
    codemp: 'EMP003',
    numlib: 'CR003',
    valcuo: 900000,
    valtot: 21600000,
    fecini: '2023-02-05',
    fecfin: '2025-02-05',
    saldocapital: 18900000,
    ncuotas: 24,
    npagos: 5,
    diasmora: 45,
    calidad: 'Mala',
    riesgo: 'C',
  },
  {
    cedmil: '1357924680',
    nomcli: 'Ana Martínez',
    fechanacimiento: '1985-11-30',
    sexo: 'F',
    edad: 38,
    ciucli: 'Bogotá',
    codemp: 'EMP001',
    numlib: 'CR004',
    valcuo: 1800000,
    valtot: 43200000,
    fecini: '2022-06-20',
    fecfin: '2025-06-20',
    saldocapital: 32400000,
    ncuotas: 36,
    npagos: 10,
    diasmora: 0,
    calidad: 'Buena',
    riesgo: 'A',
  },
  {
    cedmil: '2468013579',
    nomcli: 'Roberto Sánchez',
    fechanacimiento: '1972-07-05',
    sexo: 'M',
    edad: 51,
    ciucli: 'Barranquilla',
    codemp: 'EMP004',
    numlib: 'CR005',
    valcuo: 3000000,
    valtot: 108000000,
    fecini: '2021-05-15',
    fecfin: '2025-05-15',
    saldocapital: 72000000,
    ncuotas: 48,
    npagos: 22,
    diasmora: 90,
    calidad: 'Crítica',
    riesgo: 'D',
  },
  {
    cedmil: '8642097531',
    nomcli: 'Patricia López',
    fechanacimiento: '1988-12-12',
    sexo: 'F',
    edad: 35,
    ciucli: 'Cartagena',
    codemp: 'EMP005',
    numlib: 'CR006',
    valcuo: 1100000,
    valtot: 26400000,
    fecini: '2023-01-10',
    fecfin: '2025-01-10',
    saldocapital: 22000000,
    ncuotas: 24,
    npagos: 6,
    diasmora: 120,
    calidad: 'Muy mala',
    riesgo: 'E',
  },
];

// Helper function to generate more realistic data
export const generateExtendedMockData = (baseCount: number = 50): PortfolioItem[] => {
  const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Santa Marta'];
  const employers = ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005', 'EMP006', 'EMP007', 'EMP008'];
  const riskLevels = ['A', 'B', 'C', 'D', 'E'];
  const qualities = ['Excelente', 'Buena', 'Regular', 'Mala', 'Crítica', 'Muy mala'];
  
  const extended: PortfolioItem[] = [...mockPortfolioData];
  
  for (let i = 0; i < baseCount; i++) {
    const age = Math.floor(Math.random() * 50) + 20; // Ages between 20-70
    const gender = Math.random() > 0.5 ? 'M' : 'F';
    const city = cities[Math.floor(Math.random() * cities.length)];
    const employer = employers[Math.floor(Math.random() * employers.length)];
    
    const totalCredit = Math.floor(Math.random() * 100000000) + 5000000; // Between 5M and 105M
    const installments = [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)];
    const paymentsMade = Math.floor(Math.random() * installments);
    const delinquencyDays = Math.random() > 0.7 ? Math.floor(Math.random() * 180) : 0;
    
    // Determine risk based on delinquency days
    let risk: string;
    let quality: string;
    
    if (delinquencyDays === 0) {
      risk = 'A';
      quality = qualities[0];
    } else if (delinquencyDays <= 30) {
      risk = 'B';
      quality = qualities[1];
    } else if (delinquencyDays <= 60) {
      risk = 'C';
      quality = qualities[2];
    } else if (delinquencyDays <= 90) {
      risk = 'D';
      quality = qualities[3];
    } else {
      risk = 'E';
      quality = qualities[Math.floor(Math.random() * 2) + 4];
    }
    
    // Calculate remaining balance based on payments made
    const remainingBalance = totalCredit * (1 - (paymentsMade / installments) * 0.9); // Not exactly linear due to interest
    
    const birthYear = new Date().getFullYear() - age;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1; // Avoiding invalid dates
    
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - (paymentsMade / 12));
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + installments);
    
    extended.push({
      cedmil: `${Math.floor(Math.random() * 10000000000)}`,
      nomcli: `Cliente ${extended.length + 1}`,
      fechanacimiento: `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`,
      sexo: gender,
      edad: age,
      ciucli: city,
      codemp: employer,
      numlib: `CR${(extended.length + 1).toString().padStart(3, '0')}`,
      valcuo: Math.round(totalCredit / installments),
      valtot: totalCredit,
      fecini: startDate.toISOString().split('T')[0],
      fecfin: endDate.toISOString().split('T')[0],
      saldocapital: Math.round(remainingBalance),
      ncuotas: installments,
      npagos: paymentsMade,
      diasmora: delinquencyDays,
      calidad: quality,
      riesgo: risk,
    });
  }
  
  return extended;
};

// Export the extended dataset
export const portfolioData = generateExtendedMockData();