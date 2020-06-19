import * as React from 'react';

export const Footer = () => {
  return (
    <footer className='app-footer'>
      <p>
        <span role='img' aria-label='rocket emoji'>
          🚀
        </span>
        {'Made by '}
        <a href='https://www.jsaari.com/' rel='noreferrer noopener'>
          Jim Saari
        </a>
      </p>
    </footer>
  );
};
