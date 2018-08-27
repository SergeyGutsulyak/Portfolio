"use strict";

import React from 'react';
import renderer from 'react-test-renderer';

import GroupVK from '../components/UserVK';

test('работа TestComponent', () => {
  const userdata={}
  const component = renderer.create(
    <GroupVK userData={userdata}/>
  );

  //let componentTree=component.toJSON();
  //expect(componentTree).toMatchSnapshot();
    
});
