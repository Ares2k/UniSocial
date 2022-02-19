import React, { Component } from 'react';
import Button from '../Components/Button';

export default class UserProfile extends Component {
  render() {

    const handleSubmit = (e) => {
      e.preventDefault();
    }

    const updateProfile = async () => {
      console.log('s');
    }

    return (
      <form onSubmit={handleSubmit}>
        <input id='firstname' placeholder='First Name'    type='text'  autoComplete='off' />
        <input id='surname'   placeholder='Surname'       type='text'  autoComplete='off' />
        <input id='email'     placeholder='Email Address' type='email' autoComplete='off' />
        <input id='course'    placeholder='Course'        type='text'  autoComplete='off' />
        <input id='year'      placeholder='Year'          type='text'  autoComplete='off' />
        <textarea id='bio'    placeholder='Bio'           type='text'  autoComplete='off' />
        <Button label='Save Changes' onClick={updateProfile}/>
      </form>
    ); 
  }
}