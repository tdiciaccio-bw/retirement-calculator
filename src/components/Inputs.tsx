import React, { ChangeEvent, FunctionComponent, useState, MouseEvent } from 'react';
import { FormData } from '../common/types';

interface InputsProps {
  onFormSubmit: { (newValue: FormData): void }
};

const Inputs: FunctionComponent<InputsProps> = (props) => {
  const YEARLY_MAX = 19500;

  const [state, setState] = useState<FormData>({
    age: 30,
    balance: 1000,
    salary: 50000,
    contribution: 10,
    match: 3,
    roi: 7,
    retirementAge: 65
  })

  const updateField = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: parseFloat(e.target.value)
    })
  }
  
  const updateContribution = (e: ChangeEvent<HTMLInputElement>) => {
    const contributionValue = state.salary * (parseFloat(e.target.value) / 100);
    let adjustedContribution = parseFloat(e.target.value);
    if (contributionValue > YEARLY_MAX) {
      adjustedContribution = parseFloat((YEARLY_MAX / state.salary * 100).toFixed(1));
    }
    setState({
      ...state,
      contribution: adjustedContribution
    })
  }

  const onSubmitClick = (e: MouseEvent) => {
    e.preventDefault();

    const inputs: FormData = {
      age: state.age,
      balance: state.balance,
      salary: state.salary,
      contribution: state.contribution, 
      match: state.match,
      roi: state.roi,
      retirementAge: state.retirementAge 
    };
    
    props.onFormSubmit(inputs);
  }

  return (
    <div>
      <form className="ui form">
        <div className="field">
          <label>Age</label>
          <div className="ui input">
            <input 
              type="number"
              min="18"
              name="age" 
              value={ state.age }  
              onChange={ updateField }
            />
          </div>
        </div>
        <div className="field">
          <label>Current Balance</label>
          <div className="ui input">
            <input 
              type="number" 
              min="0"
              name="balance" 
              value={ state.balance } 
              onChange={ updateField }
            />
          </div>
        </div>
        <div className="field">
          <label>Salary</label>
          <div className="ui input">
            <input 
              type="number" 
              min="0"
              name="salary" 
              value={ state.salary }
              onChange={ updateField }  
            />
          </div>
        </div>
        <div className="field">
          <label>Contribution Percentage</label>
          <div className="ui right labeled input">
            <input 
              type="number" 
              min="0"
              step="any"
              name="contribution" 
              value={ state.contribution }
              onChange={ updateContribution }  
            />
            <div className="ui basic label">%</div>
          </div>
        </div>
        <div className="field">
          <label>Employer Match</label>
          <div className="ui right labeled input">
            <input 
              type="number" 
              min="0"
              step="any"
              name="match" 
              value={ state.match }
              onChange={ updateField }  
            />
            <div className="ui basic label">%</div>
          </div>
        </div>
        <div className="field">
          <label>Estimated Yearly Return on Investment</label>
          <div className="ui right labeled input">
            <input 
              type="number" 
              min="0"
              step="0.1"
              name="roi" 
              value={ state.roi }
              onChange={ updateField }
            />
            <div className="ui basic label">%</div>
          </div>
        </div>
        <div className="field">
          <label>Retirement Age</label>
          <div className="ui input">
            <input 
              type="number" 
              name="retirementAge" 
              value={ state.retirementAge }
              onChange={ updateField }  
            />
          </div>
        </div>
        <button className="ui button" type="submit" onClick={ (e) => onSubmitClick(e) }>Submit</button>
      </form>
    </div>
  );
}

export default Inputs;