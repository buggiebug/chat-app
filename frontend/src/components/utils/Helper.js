//  //! This class contains all the validation related to data...

export default class Helper{

    //  //! REGEX...
    regexEmail  = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    // regexPass   = /^[a-zA-Z0-9]+(?:[!@#$%^&*()_+,\-.;?])*$/;
    regexAlpha = /^[A-Za-z]+$/;

    //  Verify email address...
    verifyEmail(str){
        if(this.regexEmail.test(str))
            return true;
        else
            return false;
    }

    //  Verify password...
    verifyPassword(str){
        if(String(str).length >= 8)
            return true;
        else
            return false;
    }

    //  Verify name...

    verifyString(str)
    {
        if(this.regexAlpha.test(String(str)) && String(str).length >= 3)
            return true;
        else
            return false;
    }
}
