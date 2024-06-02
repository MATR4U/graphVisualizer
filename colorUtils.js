// Generate a base color for a group
const getBaseColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Generate shades of a base color, with the main node being the darkest
const getColorShades = (baseColor, numShades) => {
    const colors = [];
    for (let i = 0; i < numShades; i++) {
        const shade = tinycolor(baseColor).lighten(i * (50 / (numShades - 1))).toString();
        colors.push(shade);
    }
    return colors;
};
