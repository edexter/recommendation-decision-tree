import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import DecisionTree from './components/DecisionTree';
import Summary from './components/Summary';
import { useDecisionFlow } from './hooks/useDecisionFlow';

function App() {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const flowState = useDecisionFlow(treeData);

  useEffect(() => {
    // Fetch decision tree data from backend
    // In production (Docker), use relative URL since frontend and backend are on same server
    // In development, use localhost:8000
    const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');

    fetch(`${API_URL}/api/tree`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tree data');
        return res.json();
      })
      .then(data => {
        setTreeData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading tree data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChoice = (nodeId, choice) => {
    flowState.makeChoice(nodeId, choice);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-blue-200">Loading decision tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Data</h2>
          <p className="text-blue-200 mb-4">{error}</p>
          <p className="text-sm text-gray-400">Make sure the backend server is running on port 8000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Hero title={treeData.title} subtitle={treeData.subtitle} />

      {!flowState.isComplete ? (
        <DecisionTree
          treeData={treeData}
          flowState={flowState}
          onChoice={handleChoice}
        />
      ) : (
        <Summary
          choices={flowState.choices}
          treeData={treeData}
          onReset={flowState.reset}
        />
      )}
    </div>
  );
}

export default App;
