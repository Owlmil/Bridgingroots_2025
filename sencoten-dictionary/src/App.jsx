// src/App.jsx
import CommunityDictionary from "./components/CommunityDictionary";

function App() {
  // Mock user for demo purposes
  const demoUser = {
    user_id: 1,
    displayName: "Demo User",
    teacher: true, // Set to true to show admin controls
  };

  return (
    <div className="App">
      <CommunityDictionary user={demoUser} isAdmin={true} />
    </div>
  );
}

export default App;
