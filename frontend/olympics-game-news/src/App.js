import Mongo from "./components/Mongo";
import Navbar from "./components/NavBar";
import ReporteMongo from "./components/ReporteMongo";
import Mysql from "./components/Mysql";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/Mongo" exact component={Mongo} />
        <Route path="/MYSQL" exact component={Mysql} />
        <Route path="/ReporteMongo" exact component={ReporteMongo} />
      </Switch>
    </Router>
  );
}

export default App;
