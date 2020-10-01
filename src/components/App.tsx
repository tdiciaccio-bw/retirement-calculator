import React, { FunctionComponent, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Inputs from './Inputs';
import { FormData } from '../common/types';

type GraphColumn = {
  name: number,
  employee: number,
  match: number,
  total: number
}

const App: FunctionComponent = () => {

  let [data, setData] = useState<Array<GraphColumn>>();
  let [showGraph, setShowGraph] = useState(false);
  let [finalBalance, setFinalBalance] = useState<number>(0);
  let [error, setError] = useState('');

  const updateState = (newValue: FormData) => {
    const { age, retirementAge } = newValue;
    if (age >= retirementAge) {
      setError('Your retirement age must be greater than your current age');
    } else {
      const graphData = generateGraphData(newValue);
      const [finalTotal] = graphData.slice(-1);
      setData(graphData);
      setShowGraph(true);
      setFinalBalance(finalTotal.total);
      setError('');
    }
  };
  
  const calculateOneYear = (salary: number, contribution: number, match: number, years: number,
    roi: number, balance: number): number => {
    const contributionAmount = salary * (contribution / 100);
    const matchAmount = salary * (match / 100);
    const MONTHS = 12;
    const rate = roi / 100 / 12;

    const accountValue = (balance * (1 + Math.pow(rate, years * 12))) 
     + ((contributionAmount + matchAmount) / MONTHS) * (Math.pow((1 + rate), (years * 12)) - 1) 
     / (rate * (1 + rate));

    return accountValue;
  };
  
  const generateGraphData = (inputs: FormData): Array<GraphColumn> => {
    let graphData: Array<GraphColumn> = [];

    let accountValue = inputs.balance;
    const years = inputs.retirementAge - inputs.age;

    for (let year = 1; year <= years; year++) {
      let employeeBalance = calculateOneYear(inputs.salary,
        inputs.contribution,
        0,
        year,
        inputs.roi,
        accountValue);

      let matchBalance = calculateOneYear(inputs.salary,
        0,
        inputs.match,
        year,
        inputs.roi,
        accountValue);

      graphData.push({ 
        name: new Date().getFullYear() + year,
        employee: Math.floor(employeeBalance), 
        match: Math.floor(matchBalance),
        total: Math.floor(employeeBalance + matchBalance)
      });
    }
    
    return graphData;
  }
  
  const renderBarChart = (
    <div>
      <ResponsiveContainer width="99%" height={600}>
      <BarChart
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
        barGap={1}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="employee" stackId="a" fill="#82ca9d" />
        <Bar dataKey="match" stackId="a" fill="#ffc658" />
        <Bar dataKey="total" stackId="b" fill="#8884d8"/>
      </BarChart>
      </ResponsiveContainer>
        <h3 className="ui center aligned header">Total Retirement Value: { 
          new Intl.NumberFormat('en-US').format(finalBalance) }</h3>
    </div>
  )
  
  return (
    <div className="ui container" style={{padding: 10}}>
      <h1>401k Calculator</h1>
      <div className="ui grid">
        <div className="four wide column">
          <Inputs onFormSubmit={ (newValue: FormData) => updateState(newValue) }/>
        </div>
        <div className="twelve wide column">
        { error !== ''
          ? <div className="ui raised segment">{ error }</div>
          : null
        }
        { showGraph && error === ''
          ? renderBarChart
          : null
        }
        </div>
      </div>
    </div>
  );
}

export default App;