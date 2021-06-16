import React from 'react';
import { Typography } from '@material-ui/core';

export const Prizes = () => {
    return (
        <div className="prize-footer">
            <Typography className="prize-item">Third Prize: 6 participants will win a <span className="blue">$25 Amazon gift card</span></Typography>
            <Typography className="prize-item">Second Prize: 3 participants will win a <span className="blue">$50 Amazon gift card</span></Typography>
            <Typography className="prize-item">Grand Prize: 10 participants will win the opportunity to be a <span className="blue">FABRIC beta tester!</span></Typography>
        </div>
    )
}