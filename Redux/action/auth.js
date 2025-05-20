//token check action
export const tokencheck = () => ({
  type: 'TOKEN_CHECK',
 });

 


//verifyemail

export const verifyemailrequest = (email) => ({
  type: 'VERIFY_EMAIL_REQUEST',
  email,
  //  phone ,
  
});


export const verifyemailsuccessful = (data, messege) => ({
  type: 'VERIFY_EMAIL_SUCCESSFUL',
  payload: { data, messege },
});

export const verifyemailfail = error => ({
  type: 'VERIFY_EMAIL_FAIL',
  payload: error,
});



//validations


//matchusename

export const matchusenamerequest = (username) => ({
  type: 'MATCH_USERNAME_REQUEST',
 username,
  //  phone ,
  
});


export const matchusenamesuccessful = (data, messege) => ({
  type: 'MATCH_USERNAME_SUCCESSFUL',
  payload: { data, messege },
});

export const matchusenamefail = error => ({
  type: 'MATCH_USERNAME_FAIL',
  payload: error,
});




//matchotp




export const matchotprequest = (otp,email) => ({
  type: 'MATCH_OTP_REQUEST',
  otp,
  email,
  //  phone ,
  
});


export const matchotpsuccessful = (data, messege) => ({
  type: 'MATCH_OTP_SUCCESSFUL',
  payload: { data, messege },
});

export const matchotpfail = error => ({
  type: 'MATCH_OTP_FAIL',
  payload: error,
});




//SignUp
export const signuprequest = (username, password, email, avatar,otp,phone ,whatsapp,facebook,instagram) => ({
  type: 'SIGNUP_REQUEST',
  username,
  password, 
  email,
   avatar,
   otp,
  //  phone ,
  storelink,
   whatsapp,
   facebook,
   instagram
});


export const signupsuccessful = (data, messege) => ({
  type: 'SIGNUP_SUCCESSFUL',
  payload: { data, messege },
});

export const signupfail = error => ({
  type: 'SIGNUP_FAIL',
  payload: error,
});





//LOGIN
// export const loginrequest = (username, password) => ({
  
//   type: 'LOGIN_REQUEST',
//   username,
//   password,
// });

export const loginrequest = (username, password) => {
  console.log("username is", username, "password is :", password);
  return {
    type: 'LOGIN_REQUEST',
    username,
    password,
  };
};

export const loginsuccessful = (data, messege) => ({
  type: 'LOGIN_SUCCESSFUL',
  payload: { data, messege },
});

export const loginfail = error => ({
  type: 'LOGIN_FAIL',
  payload: error,
});



//LOGOUT


export const logoutrequest = ()=> {
  
   console.log("Inside logout request")
  return{
  type: 'LOG_OUT_REQUEST',
  
}

}


export const logoutsuccessful = messege => {
  
  console.log(payload.messege)
  return{

  type: 'LOG_OUT_SUCCESSFUL',

  payload: {
    messege,
  },
}};

export const logoutfails = error => {
  
  console.log("Inside logout fails")
  console.log(error)
  return{
  type: 'LOG_OUT_FAIL',
  payload: error,
}};





//CHANGE PIN
export const changepinrequest = (name, oldpassword, newpassword) => ({
  type: 'CHANGE_PIN_REQUEST',
  name,
  newpassword,
  oldpassword,
});

export const changepinsuccessful = (data, messege) => ({
  type: 'CHANGE_PIN_SUCCESSFUL',
  payload: {
    data,
    messege,
  },
});

export const changepinfails = error => ({
  type: 'CHANGE_PIN_FAIL',
  payload: error,
});

//LOGOUT


// export const logoutrequest = username => ({
//   type: 'LOG_OUT_REQUEST',
//   username,
// });


// export const logoutsuccessful = messege => ({
//   type: 'LOG_OUT_SUCCESSFUL',

//   payload: {
//     messege,
//   },
// });

// export const logoutfails = error => ({
//   type: 'LOG_OUT_FAIL',
//   payload: error,
// });

// CLEAN
export const clearerror = () => ({
  type: 'CLEAR_ERROR',
});

export const clearmessege = () => ({
  type: 'CLEAR_MESSEGE',
});

//LOADER
export const setloading = loading => ({
  type: 'LOADING',
  payload: loading,
});

// export const setCleanUsernameAction = (cleanusername) => ({
//   type: 'SET_CLEAN_USERNAME',
//   payload: cleanusername,
// });

export const setCleanUsernameAction = cleanUsername => {
  console.log('Action - setCleanUsernameAction called with:', cleanUsername);
  return {
    type: 'SET_CLEAN_USERNAME',
    payload: cleanUsername,
  };
};

export const azureloginrequest = azurename => {
  console.log('Action - azurelogin requestAction called with:', azurename);
  return {
    type: 'AZURE_LOGIN_REQUEST',
    azurename,
  };
};

export const azureloginsuccessful = (data, messege) => {
  // console.log('Action - azureloginsuccessfulAction called with:', username);
  return {
    type: 'AZURE_LOGIN_SUCCESSFUL',
    payload: { data, messege },
  };
};

export const azureloginfail = error => ({
  type: 'AZURE_LOGIN_FAIL',
  payload: error,
});


export const isinactivestate = () => ({

  type: 'IS_INACTIVE_STATE'
})

// export const haveaccesstoken = () => ({

//   type: 'HAVE_ACCESS_TOKEN'
// }) 