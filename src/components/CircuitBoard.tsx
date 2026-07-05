export default function CircuitBoard() {
  return (
    <svg className="circuit-bg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d="M100 800 L100 600 L300 600 L300 400 L500 400" stroke="url(#cg1)" strokeWidth="1" fill="none" />
      <path d="M800 100 L800 300 L600 300 L600 500 L400 500" stroke="url(#cg1)" strokeWidth="1" fill="none" />
      <path d="M1200 700 L1200 500 L1000 500 L1000 300 L800 300" stroke="url(#cg1)" strokeWidth="1" fill="none" />
      <path d="M200 200 L200 400 L400 400" stroke="url(#cg1)" strokeWidth="1" fill="none" />
      <path d="M1100 200 L1100 400 L1300 400 L1300 600" stroke="url(#cg1)" strokeWidth="1" fill="none" />
      <circle cx="500" cy="400" r="3" fill="#7c3aed" opacity="0.08" />
      <circle cx="400" cy="500" r="3" fill="#7c3aed" opacity="0.08" />
      <circle cx="800" cy="300" r="3" fill="#7c3aed" opacity="0.08" />
      <circle cx="600" cy="300" r="3" fill="#3b82f6" opacity="0.08" />
      <circle cx="1000" cy="500" r="3" fill="#3b82f6" opacity="0.08" />
      <circle cx="1300" cy="600" r="3" fill="#3b82f6" opacity="0.08" />
      <circle cx="400" cy="400" r="5" fill="#7c3aed" opacity="0.06" />
      <circle cx="800" cy="100" r="5" fill="#3b82f6" opacity="0.06" />
    </svg>
  )
}
