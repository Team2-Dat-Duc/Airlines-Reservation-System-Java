const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const mailWrapper = (content) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
        <div style="background: #e11d48; padding: 20px; text-align: center; color: white;">
            <h2>✈️ ARISO AIRWAYS</h2>
        </div>
        <div style="padding: 20px; color: #333; line-height: 1.6;">
            ${content}
        </div>
        <div style="background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            © 2026 Ariso Airways. Mọi thắc mắc xin liên hệ 1900 1234.<br/>
            Vui lòng không trả lời email này.
        </div>
    </div>
`;

exports.sendBookingConfirmation = async (booking) => {
    const html = mailWrapper(`
        <h3 style="color: #10b981;">Xác nhận đặt vé thành công!</h3>
        <p>Chào <b>${booking.contact.firstName}</b>,</p>
        <p>Chúc mừng bạn đã thanh toán thành công. Dưới đây là mã đặt chỗ của bạn:</p>
        <div style="background: #ecfdf5; border: 1px dashed #10b981; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #065f46; margin: 20px 0;">
            ${booking.pnr}
        </div>
        <p><b>Chuyến bay:</b> ${booking.flightDetails.name} (${booking.flightDetails.aircraft})</p>
        <p><b>Hành trình:</b> ${booking.flightDetails.dep} ➔ ${booking.flightDetails.arr}</p>
        <p><b>Khởi hành:</b> ${booking.flightDetails.depTime} | ${booking.flightDetails.depDate}</p>
        <p>Hãy mang theo CCCD/Hộ chiếu và Mã đặt chỗ này đến quầy làm thủ tục. Chúc bạn một chuyến đi vui vẻ!</p>
    `);
    await transporter.sendMail({ from: '"Ariso Airways" <no-reply@ariso.com>', to: booking.contact.email, subject: `[Ariso] E-Ticket Confirmed - ${booking.pnr}`, html });
};

exports.sendPaymentReminder = async (booking) => {
    const html = mailWrapper(`
        <h3 style="color: #f59e0b;">Nhắc nhở thanh toán!</h3>
        <p>Chào <b>${booking.contact.firstName}</b>,</p>
        <p>Phiên giữ chỗ cho mã <b>${booking.pnr}</b> của bạn sắp hết hạn. Ghế của bạn sẽ bị hủy nếu không thanh toán trong vòng 5 phút tới.</p>
        <p>Vui lòng truy cập "My Trips" trên website để hoàn tất thanh toán số tiền <b>$${booking.totalPrice.toFixed(2)}</b>.</p>
    `);
    await transporter.sendMail({ from: '"Ariso Airways" <no-reply@ariso.com>', to: booking.contact.email, subject: `[Urgent] Thanh toán vé ${booking.pnr}`, html });
};

exports.sendBookingExpired = async (booking) => {
    const html = mailWrapper(`
        <h3 style="color: #e11d48;">Hủy giữ chỗ tự động</h3>
        <p>Chào <b>${booking.contact.firstName}</b>,</p>
        <p>Rất tiếc, thời gian giữ chỗ (15 phút) cho mã <b>${booking.pnr}</b> đã kết thúc mà chúng tôi chưa nhận được thanh toán.</p>
        <p>Hệ thống đã tự động hủy vé và giải phóng ghế của bạn. Vui lòng thực hiện đặt lại vé mới trên website.</p>
    `);
    await transporter.sendMail({ from: '"Ariso Airways" <no-reply@ariso.com>', to: booking.contact.email, subject: `[Ariso] Vé ${booking.pnr} đã bị hủy do quá hạn`, html });
};

exports.sendBookingCancelled = async (booking) => {
    const html = mailWrapper(`
        <h3 style="color: #64748b;">Xác nhận hủy vé</h3>
        <p>Chào <b>${booking.contact.firstName}</b>,</p>
        <p>Theo yêu cầu của bạn, vé máy bay có mã <b>${booking.pnr}</b> đã được hủy thành công.</p>
        <p>Nếu vé này đã được thanh toán, tiền hoàn lại (nếu có theo điều kiện vé) sẽ được xử lý trong vòng 7-14 ngày làm việc.</p>
    `);
    await transporter.sendMail({ from: '"Ariso Airways" <no-reply@ariso.com>', to: booking.contact.email, subject: `[Ariso] Xác nhận hủy vé ${booking.pnr}`, html });
};

exports.sendCheckInReminder = async (booking) => {
    const html = mailWrapper(`
        <h3 style="color: #0ea5e9;">Đã đến giờ Check-in Trực tuyến!</h3>
        <p>Chào <b>${booking.contact.firstName}</b>,</p>
        <p>Chuyến bay của bạn từ ${booking.flightDetails.dep} đi ${booking.flightDetails.arr} sẽ khởi hành sau chưa đầy 24 giờ nữa.</p>
        <p>Để tiết kiệm thời gian xếp hàng tại sân bay, hãy làm thủ tục Check-in trực tuyến ngay từ bây giờ với mã PNR: <b>${booking.pnr}</b>.</p>
    `);
    await transporter.sendMail({ from: '"Ariso Airways" <no-reply@ariso.com>', to: booking.contact.email, subject: `[Ariso] Check-in chuyến bay ${booking.pnr}`, html });
};

exports.sendFlightChanged = async (booking, oldTime, newTime) => {
    const html = mailWrapper(`
        <h3 style="color: #e11d48;">🚨 THÔNG BÁO THAY ĐỔI LỊCH BAY</h3>
        <p>Chào <b>${booking.contact.firstName}</b>,</p>
        <p>Do điều kiện khai thác, chuyến bay của mã đặt chỗ <b>${booking.pnr}</b> đã bị thay đổi giờ cất cánh:</p>
        <ul>
            <li>Giờ cũ: <b><strike>${oldTime}</strike></b></li>
            <li>Giờ mới: <b style="color:#e11d48;">${newTime}</b></li>
        </ul>
        <p>Mong bạn thông cảm cho sự bất tiện này và sắp xếp thời gian ra sân bay hợp lý.</p>
    `);
    await transporter.sendMail({ from: '"Ariso Airways" <no-reply@ariso.com>', to: booking.contact.email, subject: `[Khẩn cấp] Thay đổi giờ bay vé ${booking.pnr}`, html });
};