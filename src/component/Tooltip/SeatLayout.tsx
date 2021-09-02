/*eslint-disable*/
import React from 'react';
import './busSeat.css';

let seatLayout = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20], 
    [21, 22, 23, 24],
    [25, 26, 27, 28],
    [29, 30, 31, 32],
    [33, 34, 35, 36],
    [37, 38, 39, 40],
    [41, 42, 43, 44],
]

const SeatLayout = ({num}) => {
    return (
        <div className = 'seat-layout'>
            Front
            {seatLayout.map((row, idx) =>
                <div className = 'row' key = {idx}>
                {row.map((number, idx) => {
                    // eslint-disable-next-line
                    var _classType = (typeof num !== 'object') ? 
                        num == number :
                        num.indexOf(number) !== -1 
                    return <div className={_classType ? 'node selected' : 'node'} key = {idx}></div>
                })}
                </div>
            )}
        </div>
    )
}
export default SeatLayout