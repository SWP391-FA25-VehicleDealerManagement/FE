
export const API_BASE_URL = 'http://localhost:8080';

export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  return `${API_BASE_URL}${imagePath}`;
};