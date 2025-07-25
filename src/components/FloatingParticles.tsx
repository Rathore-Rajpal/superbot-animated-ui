const FloatingParticles = () => {
  const particles = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className={`absolute opacity-20 animate-float float-animation`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${6 + Math.random() * 4}s`
      }}
    >
      <div className={`w-3 h-3 rounded-full ${
        i % 3 === 0 ? 'bg-primary' : 
        i % 3 === 1 ? 'bg-accent' : 'bg-blue-400'
      }`} />
    </div>
  ));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles}
    </div>
  );
};

export default FloatingParticles;