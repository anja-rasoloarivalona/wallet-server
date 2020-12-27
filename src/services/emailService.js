import email from '@sendgrid/mail'
email.setApiKey(process.env.SEND_GRID_API_KEY)

const sendActivationLink = async (user, activationLink) => {
    const data = {
        "personalizations": [
          {
            "to": [
              {
                "email": "anja@bizbizshare.com",
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
        "to": {
            "email": "anja@bizbizshare.com",
            "name": "John Doe"
        },
        "from": {
          "email": "rasoloanja@gmail.com",
          "name": "Monefy"
        },
        "reply_to": {
          "email": "rasoloanja@gmail.com",
          "name": "Monefy"
        },
        "template_id": "d-568c9f653ac04a47b0a0d0e37d2774fe"
    }
    email
        .send(data)
        .then(() => {
            console.log('Email sent')
        })
        .catch(error => {
            console.log('Failed to send email', error)
        })
}

export {
    sendActivationLink
}