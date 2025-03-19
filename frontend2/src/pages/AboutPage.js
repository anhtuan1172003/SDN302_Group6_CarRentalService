export default function AboutPage() {
    return (
        <div className="max-w-5xl mx-auto p-8 text-gray-800">
            <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
                Giới Thiệu Về Chúng Tôi
            </h1>
            
            <p className="text-lg text-center mb-10 leading-relaxed">
                Chào mừng bạn đến với <strong>CarRental</strong>, hệ thống cung cấp dịch vụ thuê xe chuyên nghiệp, uy tín và chất lượng cao. 
                Chúng tôi tự hào là đơn vị hàng đầu trong lĩnh vực cho thuê xe, mang đến những trải nghiệm di chuyển an toàn, tiện lợi và đáng nhớ cho khách hàng.
            </p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-3">Lịch Sử Hình Thành</h2>
                    <p className="leading-relaxed">
                        CarRental được thành lập với mong muốn mang đến giải pháp di chuyển tối ưu cho cá nhân và doanh nghiệp.
                        Từ những ngày đầu với một số lượng xe hạn chế, chúng tôi đã không ngừng phát triển để trở thành một trong những thương hiệu đáng tin cậy nhất trong ngành.
                        Hiện tại, CarRental sở hữu một hệ thống xe đa dạng, phục vụ hàng nghìn khách hàng mỗi tháng trên khắp cả nước.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-3">Dịch Vụ Của Chúng Tôi</h2>
                    <p className="leading-relaxed">
                        Chúng tôi cung cấp nhiều loại xe đáp ứng mọi nhu cầu của khách hàng, từ xe du lịch, xe gia đình, xe tự lái đến xe doanh nghiệp và xe cao cấp. 
                        Dù bạn cần một chiếc xe để di chuyển trong thành phố, du lịch xa hay phục vụ công tác, CarRental luôn sẵn sàng mang đến lựa chọn phù hợp nhất với mức giá hợp lý.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-3">Sứ Mệnh Và Giá Trị Cốt Lõi</h2>
                    <p className="leading-relaxed">
                        Chúng tôi tin rằng việc di chuyển không chỉ là một hành trình mà còn là trải nghiệm đáng nhớ.
                        Sứ mệnh của CarRental là mang đến những chuyến đi an toàn, thoải mái và thuận tiện cho tất cả khách hàng. 
                        Chúng tôi cam kết cung cấp những phương tiện hiện đại, luôn được bảo trì kỹ lưỡng, đi kèm với dịch vụ khách hàng tận tâm và chuyên nghiệp.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-3">Cam Kết Chất Lượng</h2>
                    <p className="leading-relaxed">
                        Chất lượng dịch vụ là yếu tố quan trọng nhất tại CarRental. 
                        Chúng tôi đảm bảo rằng tất cả các xe trong hệ thống đều được bảo dưỡng định kỳ để mang đến sự an toàn tối đa. 
                        Đội ngũ nhân viên của chúng tôi luôn sẵn sàng hỗ trợ khách hàng 24/7, giải quyết mọi thắc mắc và mang đến trải nghiệm dịch vụ tốt nhất.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-3">Liên Hệ</h2>
                    <p className="leading-relaxed">
                        Nếu bạn có bất kỳ câu hỏi nào hoặc muốn đặt xe, đừng ngần ngại liên hệ với chúng tôi. Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giúp đỡ bạn một cách nhanh chóng và hiệu quả.
                    </p>
                    <ul className="mt-4 space-y-2">
                        <li><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</li>
                        <li><strong>Email:</strong> support@carrental.com</li>
                        <li><strong>Hotline:</strong> 0901 234 567</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
