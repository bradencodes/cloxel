export const stylingColors = {
  white: '#fafafa'
};

export const activityColors = [
  { hex: '#EF9A9A', name: 'Light Red' },
  { hex: '#F48FB1', name: 'Light Pink' },
  { hex: '#B39DDB', name: 'Light Purple' },
  { hex: '#90CAF9', name: 'Light Blue' },
  { hex: '#80DEEA', name: 'Light Cyan' },
  { hex: '#80CBC4', name: 'Light Teal' },
  { hex: '#A5D6A7', name: 'Light Green' },
  { hex: '#E6EE9C', name: 'Light Lime' },
  { hex: '#FFCC80', name: 'Light Orange' },
  { hex: '#BCAAA4', name: 'Light Brown' },
  { hex: '#B0BEC5', name: 'Light Gray' },

  { hex: '#F44336', name: 'Red' },
  { hex: '#E91E63', name: 'Pink' },
  { hex: '#673AB7', name: 'Purple' },
  { hex: '#2196F3', name: 'Blue' },
  { hex: '#00BCD4', name: 'Cyan' },
  { hex: '#009688', name: 'Teal' },
  { hex: '#4CAF50', name: 'Green' },
  { hex: '#CDDC39', name: 'Lime' },
  { hex: '#FF9800', name: 'Orange' },
  { hex: '#795548', name: 'Brown' },
  { hex: '#607D8B', name: 'Gray' },

  { hex: '#B71C1C', name: 'Dark Red' },
  { hex: '#880E4F', name: 'Dark Pink' },
  { hex: '#311B92', name: 'Dark Purple' },
  { hex: '#0D47A1', name: 'Dark Blue' },
  { hex: '#006064', name: 'Dark Cyan' },
  { hex: '#004D40', name: 'Dark Teal' },
  { hex: '#1B5E20', name: 'Dark Green' },
  { hex: '#827717', name: 'Dark Lime' },
  { hex: '#E65100', name: 'Dark Orange' },
  { hex: '#3E2723', name: 'Dark Brown' },
  { hex: '#263238', name: 'Dark Gray' }
];

export const getUnusedColors = activities => {
  let usedColors = activities.map(activity => activity.color);
  return activityColors.filter(color => !usedColors.includes(color.hex));
};
