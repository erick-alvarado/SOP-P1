import Mongo from "./components/Mongo";
import Navbar from "./components/NavBar";
import ReporteMongo from "./components/ReporteMongo";
import ReporteMysql from "./components/ReporteMysql";
import Mysql from "./components/Mysql";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Notificacion from "./components/Notificacion";

function App() {
  return (
    <Router>
      <Navbar />
      <Notificacion />
      <Switch>
        <Route path="/Mongo" exact component={Mongo} />
        <Route path="/MYSQL" exact component={Mysql} />
        <Route path="/ReporteMongo" exact component={ReporteMongo} />
        <Route path="/ReporteMysql" exact component={ReporteMysql} />
      </Switch>
    </Router>
  );
}

export default App;
