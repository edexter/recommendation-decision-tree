export default function BranchConnector({ parentColumn, isActive }) {
  // parentColumn: 0 = left, 1 = right
  const isLeft = parentColumn === 0;

  return (
    <div className="w-full relative h-12 mb-4">
      {/* Vertical line from parent */}
      <div
        className={`absolute top-0 h-6 w-0.5 ${isActive ? 'bg-blue-400' : 'bg-gray-500'}`}
        style={{
          left: isLeft ? '25%' : '75%',
        }}
      />

      {/* Horizontal branching line */}
      <div
        className={`absolute top-6 h-0.5 ${isActive ? 'bg-blue-400' : 'bg-gray-500'}`}
        style={{
          left: '25%',
          right: '25%',
        }}
      />

      {/* Vertical lines down to children */}
      <div
        className={`absolute top-6 h-6 w-0.5 ${isActive ? 'bg-blue-400' : 'bg-gray-500'}`}
        style={{ left: '25%' }}
      />
      <div
        className={`absolute top-6 h-6 w-0.5 ${isActive ? 'bg-blue-400' : 'bg-gray-500'}`}
        style={{ left: '75%' }}
      />
    </div>
  );
}
