export const generateOTPEmail = (otp, userName, email) => {
  return `<html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Montserrat|Roboto+Mono"
                />
                <title>Document</title>
                <style type="text/css">
                    body {
                        align-items: center;
                        justify-content: center;
                        display: flex;
                        font-family: "Montserrat", sans-serif;
                    }
                    .wrapper {
                        padding: 2%;
                        margin: 1%;
                    }
                    .otp {
                        font-weight: 700;
                        font-family: "Roboto Mono", sans-serif;
                        font-size: 28px;
                    }
                    .otp-wrapper {
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                    }
                    span {
                        font-weight: 700;
                        font-family: "Roboto Mono", sans-serif;
                    }
                    p {
                        font-size:16px;
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <p>Hello ${userName},</p>
                    <p>Your One-Time(OTP) is</p>
                    <div class="otp-wrapper">
                        <p class="otp"><b>${otp}</b></p>
                    </div>
                    <p>This OTP will expire in 5 mins</p>
                    <p>
                        <span>NOTE:</span>
                         this message was intended for ${email}
                    </p>
                </div>
            </body>
        </html>`;
};
