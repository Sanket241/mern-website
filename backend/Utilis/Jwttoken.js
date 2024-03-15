const sendToken = (user, statusCode, resp) => {
    const token = user.getJwtToken(); // Generate JWT token for the user
  
    // Options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Set expiration date for the cookie
        httpOnly: true, // Ensure the cookie is only accessible via HTTP(S)
    };
  
    // Set the cookie with the generated token
    resp.status(statusCode) // Set the HTTP status code
       .cookie("token", token, options) // Set the cookie named "token" with the generated token and options
       .json({ // Send JSON response
          success: true, // Indicate success
          user, // Include user data in the response
          token, // Include the token in the response
       });
};
  
module.exports = sendToken; // Export the function for use in other parts of the application
