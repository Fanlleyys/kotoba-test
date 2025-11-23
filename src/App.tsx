import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppRouter } from './router';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <AppRouter />
      </Layout>
    </Router>
  );
};

export default App;