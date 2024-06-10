// Import the tinycolor2 library


/**
 * Generate a random base color in hexadecimal format.
 * @returns {string} A random hexadecimal color string.
 */
export const getBaseColor = () => {
  const hexCharacters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += hexCharacters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Generate shades of a base color, with the main node being the darkest.
 * @param {string} baseColor - The base color in hexadecimal format.
 * @param {number} numShades - The number of shades to generate.
 * @returns {string[]} An array of color shades in hexadecimal format.
 */
export const getColorShades = (baseColor, numShades) => {
  if (!tinycolor(baseColor).isValid()) {
    throw new Error('Invalid base color provided');
  }
  if (numShades <= 0) {
    throw new Error('Number of shades must be greater than zero');
  }

  const shades = [];
  const lightenStep = 50 / (numShades - 1);

  for (let i = 0; i < numShades; i++) {
    const shade = tinycolor(baseColor).lighten(i * lightenStep).toString();
    shades.push(shade);
  }

  return shades;
};