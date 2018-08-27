import React from 'react';

import './LoadAnimation.css';

class LoadAnimation extends React.PureComponent{

    render(){
        return(
            <div className='LoadAnimation'>
                <div className='AnimationContainer'>
                    <div className="ball"></div>
                    <div className="ball1"></div>
                </div>
            </div>
        );
    }
}

export default LoadAnimation;