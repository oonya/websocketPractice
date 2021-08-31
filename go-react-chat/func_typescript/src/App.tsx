import React from 'react';
import { Chat } from './pages/Chat';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

export const App: React.VFC = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route path='/:id' component={Chat} /> */}
        <Route
          path={"/:id"}
          render={({ match }) => (
            <Chat id={match.params.id} />
          )}
        />
      </Switch>
    </BrowserRouter>
  )
};