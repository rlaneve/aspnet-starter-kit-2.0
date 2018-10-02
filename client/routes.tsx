import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import Equipment from './components/Equipment';
import Ping from './components/Ping';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/equipment' component={ Equipment } />
    <Route path='/counter' component={ Counter } />
    <Route path='/ping' component={ Ping } />
    <Route path='/fetchdata/:startDateIndex?' component={ FetchData } />
</Layout>;
