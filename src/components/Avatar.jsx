const Avatar = ({ name, size = 64, className = '' }) => {
  // Create a seed from the name
  const seed = name.replace(/\s+/g, '-').toLowerCase();

  // Generate the avatar URL
  const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&size=${size}&backgroundColor=10b981&radius=50`;

  return (
    <div className={`inline-block rounded-full overflow-hidden ${className}`}>
      <img
        src={avatarUrl}
        alt={`${name}'s avatar`}
        width={size}
        height={size}
        className="bg-gray-100"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=${size}`;
        }}
      />
    </div>
  );
};

export default Avatar;