import numeral from 'numeral';
import React from 'react';
import './Table.css';

function Table({countries}) {
    return (
        <div className="table">
            {countries.map(({country, cases})=>(
                <tr>
                    <td><strong>{country}</strong></td>
                    <td>
                        <strong>
                            {numeral(cases).format(0,0)}
                        </strong>
                        
                    </td>
                </tr>
        
            ))}
        </div>
    )
}

export default Table;
