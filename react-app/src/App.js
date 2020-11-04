import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ManuBar from './pages/MenuBar';
import { Container } from 'semantic-ui-react'
import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';
import SinglePost from './components/post/SinglePost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <ManuBar />
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
          <Route exact path='/posts/:postId' component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
