import React, { useEffect, useState } from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';

 /* In chart.js docs */
const options={
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        },
    },
    maintainAspectRatio : true,
    tooltips:{
        mode: "index",
        callbacks:{
            label : function (tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes:[{
            type: "time",
            time:{
                format: "MM/DD/YY",
                tooltipFormat: "ll",
            },
        },
        ],
        yAxes:[
            {
                gridlines:{
                    display: false,
                },
                ticks: {
                    //incldue a dollar sign in the ticks
                    callback: function (value, index, values){
                        return numeral(value).format("0a");
                    },
                }
            },
        ],
    },
}


  // https://disease.sh/v3/covid-19/historical/all?lastdays=120

  const buildChartData= (data, casesType="recovered")=>{
    const chartData =[];
    let lastDataPoint;
    for(let date in data.recovered) {
        if(lastDataPoint){
            const newDataPoint={
                x: date,
                y: data[casesType][date]-lastDataPoint
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};


function LineGraph({casesType}) {
    const [data,setData] = useState({});


    useEffect(()=>{
        const fetchData = async()=>{
         await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response)=> response.json())
        .then((data)=>{
            //console.log(data);
            let chartData = buildChartData(data,casesType);
            setData(chartData);
        });
        }
        fetchData();
    },[casesType]);

    return (
        <div>
            {/*optional chaining for handling crashes by returning default*/}
            {data?.length>0 && ( 
                <Line options={options}
                data={{
                   datasets: [{
                       backgroundColor : "rgba(0,255,0,0.5)",
                       borderColor : "#008000", 
                       data : data,
                   }]
               }}  />
            )}
          
        </div>
    )
}


export default LineGraph;


