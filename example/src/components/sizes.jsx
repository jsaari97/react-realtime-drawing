const sizes = [8, 16, 32];

export const Sizes = ({ current, onChange }) => {
  return (
    <figure className='control'>
      <figcaption>Sizes</figcaption>
      <ul>
        {sizes.map((size) => (
          <li key={size}>
            <Size size={size} onClick={onChange} active={current === size} />
          </li>
        ))}
      </ul>
    </figure>
  );
};

const Size = ({ size, onClick, active }) => {
  return (
    <button
      className={`size-button${active ? ' active' : ''}`}
      onClick={() => onClick(size)}
      aria-label={`Select  ${size}`}
      title={`Select size ${size}`}
    >
      <div style={{ height: size, width: size }} />
    </button>
  );
};
