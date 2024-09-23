import { useRoutes, BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";

const AppRoutes = () => {
  let routes = useRoutes([{ path: "/", element: <Dashboard /> }]);
  return routes;
};
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
