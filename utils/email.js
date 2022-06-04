import { createTransport } from 'nodemailer';

const sendEmail = async (options) => {
    // CREATE A TRANSPORTER
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'licenta.telecom2022@gmail.com' ,
            pass: 'nlfwedzhcpfequox'
        }
    });
    // DEFINE THE EMAIL OPTIONS
    const mailOptions = {
        from: '<licenta2021.tuiasi.ro@outlook.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    // SEND EMAIL WITH NODEMAILER
    // await transporter.sendMail(mailOptions);
    // send mail with defined transport object
    await transporter.sendMail(mailOptions);
}

export default sendEmail;