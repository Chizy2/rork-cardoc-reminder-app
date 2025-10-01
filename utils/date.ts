export const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getDocumentStatus = (expiryDate: string): 'valid' | 'expiring' | 'expired' => {
  const daysUntil = getDaysUntilExpiry(expiryDate);
  if (daysUntil < 0) return 'expired';
  if (daysUntil <= 60) return 'expiring'; // Changed from 30 to 60 days (2 months)
  return 'valid';
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status: 'valid' | 'expiring' | 'expired'): string => {
  switch (status) {
    case 'expired':
      return '#EF4444';
    case 'expiring':
      return '#F59E0B';
    case 'valid':
      return '#10B981';
    default:
      return '#6B7280';
  }
};

export const getStatusText = (daysUntil: number): string => {
  if (daysUntil < 0) {
    return `Expired ${Math.abs(daysUntil)} days ago`;
  } else if (daysUntil === 0) {
    return 'Expires today';
  } else if (daysUntil === 1) {
    return 'Expires tomorrow';
  } else if (daysUntil <= 7) {
    return `Expires in ${daysUntil} days`;
  } else if (daysUntil <= 30) {
    return `Expires in ${daysUntil} days`;
  } else if (daysUntil <= 60) {
    return `Expires in ${daysUntil} days`;
  } else {
    return `Valid for ${daysUntil} days`;
  }
};