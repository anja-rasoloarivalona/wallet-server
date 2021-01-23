import email from '@sendgrid/mail'
email.setApiKey(process.env.SEND_GRID_API_KEY)

const sendActivationLink = async (user, activationLink) => {
    const data = {
        "personalizations": [
          {
            "to": [
              {
                "email": user.email,
                "name": "John Doe"
              }
            ],
            "dynamic_template_data": {
                "subject": "Activate your account",
                username: user.username,
                activationLink
              },
          }
        ],
        "from": {
          "email": "rasoloanja@gmail.com",
          "name": "Monetor"
        },
        "reply_to": {
          "email": "rasoloanja@gmail.com",
          "name": "Monetor"
        },
        "template_id": process.env.TEMPLATE_ID_ACTIVATION_LINK
    }

    try {
        const response = await email.send(data)
        if(response[0].statusCode === 202){
            return true
        } else {
            return false
        }
    } catch (err){
      console.log('Failed to send email', err)
      return false
    }
}

const sendResetPasswordLink = async (user, resetPasswordLink) => {
    const data = {
      "dynamic_template_data": {
        "subject": "Reset your password",
        username: user.username,
        resetPasswordLink
      },
      "to": {
        "email": user.email,
        "name": "John Doe"
      },
      "from": {
        "email": "rasoloanja@gmail.com",
        "name": "Monetor"
      },
      "reply_to": {
        "email": "rasoloanja@gmail.com",
        "name": "Monetor"
      },
      "template_id": process.env.TEMPLATE_ID_RESET_PASSWORD
  }

  try {
      const response = await email.send(data)
      if(response[0].statusCode === 202){
          return true
      } else {
          return false
      }
  } catch (err){
    console.log('Failed to send email', err)
    return false
  }
}

export {
    sendActivationLink,
    sendResetPasswordLink
}