import React from "react";

interface ExploreIconProps {
  className?: string;
  size?: number;
}

const ExploreIcon: React.FC<ExploreIconProps> = ({ className = "", size = 22 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 25 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M23.5994 23.0002L18.2949 17.6958" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M11.3774 20.5556C16.7775 20.5556 21.1552 16.1779 21.1552 10.7778C21.1552 5.37766 16.7775 1 11.3774 1C5.97727 1 1.59961 5.37766 1.59961 10.7778C1.59961 16.1779 5.97727 20.5556 11.3774 20.5556Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ExploreIcon;
