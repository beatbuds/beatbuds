import React, { useState, useEffect, useRef } from 'react';
import '../styling/MusicPlayer.css'

const Animate = ({ currentSongName }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (container && text) {
      const hasOverflow = text.scrollWidth > container.offsetWidth;
      setIsOverflowing(hasOverflow);
    }
  }, [currentSongName]);

  return (
    <div className="scroll-container" ref={containerRef}>
      <div 
        ref={textRef} 
        className={`scroll-text ${isOverflowing ? 'Animate' : ''}`}
      >
        <span>{currentSongName}</span>
        {isOverflowing && <span className="spacer">&nbsp;&nbsp;&nbsp;&nbsp;</span>}
        {isOverflowing && <span>{currentSongName}</span>}
      </div>
    </div>
  );
};
export default Animate;