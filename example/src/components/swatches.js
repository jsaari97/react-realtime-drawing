import * as React from 'react';

const colors = ['#134e6f', '#ff6150', '#1ac0c6'];

export const Swatches = ({ current, onChange }) => {
  return (
    <figure className='control'>
      <figcaption>Colors</figcaption>
      <ul>
        {colors.map((color) => (
          <li key={color}>
            <Swatch
              color={color}
              onClick={onChange}
              active={current === color}
            />
          </li>
        ))}
      </ul>
    </figure>
  );
};

const Swatch = ({ color, onClick, active }) => {
  const handleClick = React.useCallback(() => {
    onClick(color);
  }, [onClick, color]);

  return (
    <button
      className={`swatch-button${active ? ' active' : ''}`}
      style={{ backgroundColor: color }}
      onClick={handleClick}
      aria-label={`Select ${color} color`}
      title={`Select ${color} color`}
    />
  );
};
