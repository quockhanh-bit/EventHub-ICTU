import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning old database records...");
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.ticketTier.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding Users with hashed passwords...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const organizerPassword = await bcrypt.hash("organizer123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@eventhub.vn",
      password: adminPassword,
      name: "Lô Quốc Khánh (Admin)",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      phone: "0901234567",
      organization: "Ban Quản Trị Hệ Thống EventHub - Đại học CNTT & TT Thái Nguyên",
      status: "ACTIVE",
    },
  });

  const organizer1 = await prisma.user.create({
    data: {
      email: "organizer@eventhub.vn",
      password: organizerPassword,
      name: "Đoàn Thanh Niên & Hội Sinh Viên ICTU",
      role: "ORGANIZER",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      phone: "02083846254",
      organization: "Trường Đại học Công nghệ Thông tin & Truyền thông - ĐH Thái Nguyên (ICTU)",
      status: "ACTIVE",
    },
  });

  const organizer2 = await prisma.user.create({
    data: {
      email: "tedx@eventhub.vn",
      password: organizerPassword,
      name: "CLB Lập Trình & Sáng Tạo Trẻ ICTU DevClub",
      role: "ORGANIZER",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      phone: "0987654321",
      organization: "Khoa Công Nghệ Thông Tin - Đại học CNTT & TT Thái Nguyên",
      status: "ACTIVE",
    },
  });

  const attendeeUser1 = await prisma.user.create({
    data: {
      email: "attendee@eventhub.vn",
      password: userPassword,
      name: "Nguyễn Văn An",
      role: "ATTENDEE",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      phone: "0912345678",
      organization: "Sinh viên K20 Khoa CNTT - ĐH CNTT & Truyền Thông Thái Nguyên",
      status: "ACTIVE",
    },
  });

  const attendeeUser2 = await prisma.user.create({
    data: {
      email: "linh@eventhub.vn",
      password: userPassword,
      name: "Trần Thị Mai Linh",
      role: "ATTENDEE",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      phone: "0934567890",
      organization: "Sinh viên K21 Truyền Thông Đa Phương Tiện - ICTU",
      status: "ACTIVE",
    },
  });

  console.log("Seeding Categories...");
  const categoriesData = [
    {
      name: "Công nghệ & AI",
      slug: "cong-nghe-ai",
      description: "Hội thảo kỹ thuật, lập trình, trí tuệ nhân tạo, an toàn thông tin tại ICTU",
      icon: "Cpu",
      color: "#2563EB",
    },
    {
      name: "Âm nhạc & Nghệ thuật",
      slug: "am-nhac-nghe-thuat",
      description: "Đêm hội sinh viên, liveshow acoustic, liên hoan văn nghệ thanh niên ICTU",
      icon: "Music",
      color: "#EC4899",
    },
    {
      name: "Học thuật & Hướng nghiệp",
      slug: "hoc-thuat-huong-nghiep",
      description: "Ngày hội việc làm ICTU Job Fair, hội thảo NCKH, kỹ năng phỏng vấn doanh nghiệp",
      icon: "GraduationCap",
      color: "#10B981",
    },
    {
      name: "Thể thao & E-Sports",
      slug: "the-thao-suc-khoe",
      description: "Giải đấu E-Sports sinh viên ICTU, giải chạy marathon, bóng đá sinh viên",
      icon: "Trophy",
      color: "#8B5CF6",
    },
    {
      name: "Workshop & Khởi nghiệp",
      slug: "workshop-ky-nang",
      description: "Thực chiến lập trình Web/Mobile, khởi nghiệp đổi mới sáng tạo ICTU",
      icon: "Sparkles",
      color: "#06B6D4",
    },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({ data: cat });
    categories.push(createdCat);
  }

  console.log("Seeding authentic ICTU Events and Ticket Tiers...");

  // Event 1: ICTU TechFest & IT Job Fair 2026
  const ev1 = await prisma.event.create({
    data: {
      title: "ICTU TechFest & Ngày Hội Việc Làm Công Nghệ 2026",
      slug: "ictu-techfest-ngay-hoi-viec-lam-2026",
      shortDesc: "Sự kiện công nghệ và tuyển dụng lớn nhất trong năm tại Trường Đại học Công nghệ Thông tin & Truyền thông Thái Nguyên với hơn 35 doanh nghiệp IT.",
      description: `
### Giới thiệu sự kiện
**ICTU TechFest 2026** là ngày hội công nghệ và tuyển dụng thường niên lớn nhất của Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên (ICTU).

Sự kiện quy tụ hơn 35 doanh nghiệp hàng đầu trong lĩnh vực phần mềm, viễn thông và giải pháp số (FPT Software, Viettel, VNPT, Samsung R&D, CMC, RikkeiSoft,...) mang tới hơn 1,000 cơ hội việc làm và thực tập cho sinh viên các khoa:
- Khoa Công nghệ Thông tin
- Khoa Kỹ thuật Máy tính & Điện tử
- Khoa Hệ thống Thông tin Kinh tế
- Khoa Truyền thông Đa phương tiện

#### Lịch trình chương trình:
- **08:00 - 09:00:** Lễ khai mạc, ký kết thỏa thuận hợp tác doanh nghiệp tại Hội trường C1.
- **09:00 - 11:30:** Tọa đàm *"Xu hướng Trí tuệ Nhân tạo & Cơ hội nghề nghiệp thời đại GenAI 2026"*.
- **09:00 - 16:30:** Gian hàng triển lãm sản phẩm công nghệ sinh viên và phỏng vấn trực tiếp nhận offer tuyển dụng.
- **14:00 - 16:00:** Cuộc thi *"ICTU Coding Challenge & Rung Chuông Vàng Công Nghệ"*.

#### Quyền lợi sinh viên tham dự:
- Sửa CV 1-1 miễn phí cùng chuyên gia HR.
- Cơ hội phỏng vấn tuyển dụng trực tiếp ngay tại sân trường.
- Bốc thăm may mắn nhận Laptop, Màn hình thông minh và tai nghe không dây.
      `,
      bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      startDate: new Date("2026-11-18T08:00:00Z"),
      endDate: new Date("2026-11-18T17:00:00Z"),
      location: "Hội trường Lớn C1 & Sân Trung Tâm - Trường ĐH CNTT & Truyền Thông Thái Nguyên (Đường Z115, Xã Quyết Thắng, TP. Thái Nguyên)",
      locationType: "HYBRID",
      onlineLink: "https://meet.google.com/ictu-techfest-2026",
      status: "PUBLISHED",
      isFeatured: true,
      organizerId: organizer1.id,
      categoryId: categories[2].id, // Học thuật & Hướng nghiệp
      ticketTiers: {
        create: [
          {
            name: "Vé Sinh Viên ICTU (Miễn phí)",
            price: 0,
            quantity: 1500,
            sold: 420,
            description: "Dành riêng cho sinh viên và cựu sinh viên ICTU mang thẻ SV",
            benefits: "Tham gia ứng tuyển 35+ gian hàng, sửa CV 1-1, nhận vé bốc thăm may mắn",
          },
          {
            name: "Vé VIP Doanh Nghiệp & Khách Mời",
            price: 200000,
            quantity: 80,
            sold: 50,
            description: "Dành cho đại diện doanh nghiệp, đối tác và giảng viên",
            benefits: "Khu vực ghế danh dự, teabreak tiệc trà, bàn tuyển dụng riêng biệt",
          },
        ],
      },
    },
    include: { ticketTiers: true },
  });

  // Event 2: Đêm Đại Nhạc Hội Chào Tân Sinh Viên ICTU
  const ev2 = await prisma.event.create({
    data: {
      title: "Đêm Đại Nhạc Hội Chào Tân Sinh Viên ICTU: Sắc Màu Tuổi Trẻ 2026",
      slug: "dem-dai-nhac-hoi-chao-tan-sinh-vien-ictu-2026",
      shortDesc: "Đại nhạc hội hoành tráng chào đón các tân sinh viên khóa mới của Trường ĐH CNTT & Truyền Thông Thái Nguyên với sự tham gia của các nghệ sĩ nổi tiếng.",
      description: `
Đêm hội thường niên bùng nổ năng lượng nhất năm học của sinh viên Đại học CNTT & Truyền Thông Thái Nguyên!
- Thời gian: 19:00 - 22:30, Tối Thứ 7.
- Địa điểm: Sân Vận Động & Quảng trường Trung tâm ICTU.
- Với dàn âm thanh, ánh sáng hiện đại và sự góp mặt của các ca sĩ khách mời trẻ đình đám, cùng các tiết mục nghệ thuật đặc sắc từ Đội Văn Nghệ Xung Kích và các CLB Nghệ thuật sinh viên ICTU.
      `,
      bannerImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      startDate: new Date("2026-11-22T19:00:00Z"),
      endDate: new Date("2026-11-22T22:30:00Z"),
      location: "Sân Vận Động Trường ĐH CNTT & Truyền Thông Thái Nguyên (ICTU)",
      locationType: "OFFLINE",
      status: "PUBLISHED",
      isFeatured: true,
      organizerId: organizer1.id,
      categoryId: categories[1].id, // Âm nhạc & Nghệ thuật
      ticketTiers: {
        create: [
          {
            name: "Vé Vào Cổng Sinh Viên (Miễn phí)",
            price: 0,
            quantity: 3000,
            sold: 1250,
            description: "Vé vào cổng tự do dành cho toàn thể sinh viên Đại học Thái Nguyên",
            benefits: "Vào cổng thưởng thức trọn vẹn đêm nhạc, vòng tay phát sáng cổ vũ",
          },
          {
            name: "Vé Fanzone Gần Sân Khấu",
            price: 50000,
            quantity: 200,
            sold: 140,
            description: "Khu vực Fanzone sát sân khấu, tiếp cận gần nghệ sĩ khách mời",
            benefits: "Vị trí đẹp nhất quẩy cùng thần tượng, tặng nước khoáng và gậy phát sáng",
          },
        ],
      },
    },
    include: { ticketTiers: true },
  });

  // Event 3: Hội Thảo Nghiên Cứu Khoa Học Sinh Viên ICTU
  const ev3 = await prisma.event.create({
    data: {
      title: "Hội Thảo NCKH Sinh Viên ICTU 2026: Trí Tuệ Nhân Tạo & Chuyển Đổi Số",
      slug: "hoi-thao-nckh-sinh-vien-ictu-2026",
      shortDesc: "Diễn đàn công bố các công trình nghiên cứu khoa học xuất sắc của sinh viên và giảng viên trẻ Trường ĐH CNTT & Truyền Thông Thái Nguyên.",
      description: `
Hội thảo Khoa học Sinh viên thường niên do Khoa Công Nghệ Thông Tin - ICTU chủ trì.
Các chủ đề báo cáo tiêu biểu:
- Ứng dụng Học sâu (Deep Learning) và Thị giác máy tính trong y tế thông minh.
- Xây dựng hệ thống Agentic Coding hỗ trợ đào tạo lập trình cho sinh viên.
- Bảo mật Web và An toàn an ninh mạng trên nền tảng đám mây.
- Ứng dụng IoT trong nông nghiệp công nghệ cao tại các tỉnh miền núi phía Bắc.
      `,
      bannerImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
      startDate: new Date("2026-11-28T08:30:00Z"),
      endDate: new Date("2026-11-28T16:30:00Z"),
      location: "Phòng Hội Thảo Tầng 3 - Tòa Nhà Hiệu Bộ ICTU, TP. Thái Nguyên",
      locationType: "HYBRID",
      onlineLink: "https://meet.google.com/ictu-nckh-2026",
      status: "PUBLISHED",
      isFeatured: true,
      organizerId: organizer2.id,
      categoryId: categories[0].id, // Công nghệ & AI
      ticketTiers: {
        create: [
          {
            name: "Vé Đại Biểu & Báo Cáo Viên",
            price: 0,
            quantity: 150,
            sold: 85,
            description: "Dành cho sinh viên có đề tài báo cáo và sinh viên tham dự",
            benefits: "Bộ tài liệu Kỷ yếu hội thảo in màu, Chứng nhận tham gia NCKH, Teabreak bánh trà",
          },
        ],
      },
    },
    include: { ticketTiers: true },
  });

  // Event 4: ICTU E-Sports Championship
  const ev4 = await prisma.event.create({
    data: {
      title: "Giải Đấu Thể Thao Điện Tử ICTU E-Sports Championship 2026",
      slug: "ictu-esports-championship-2026",
      shortDesc: "Đấu trường thể thao điện tử nảy lửa giữa các đội tuyển sinh viên các khoa thuộc Trường ĐH CNTT & TT Thái Nguyên.",
      description: `
Được tổ chức bởi CLB Thể Thao Điện Tử Sinh Viên ICTU.
- Bộ môn thi đấu: **Liên Quân Mobile** (5v5) và **Valorant**.
- Tổng giải thưởng lên đến 20.000.000 VNĐ cùng Cúp vô địch và Huy chương vàng ICTU.
- Trận Chung kết được bình luận trực tiếp bởi Caster chuyên nghiệp và phát sóng trên Fanpage Đoàn Trường.
      `,
      bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      startDate: new Date("2026-12-06T13:30:00Z"),
      endDate: new Date("2026-12-06T21:00:00Z"),
      location: "Nhà Thi Đấu Thể Thao Đa Năng ICTU - Trường ĐH CNTT & Truyền Thông Thái Nguyên",
      locationType: "OFFLINE",
      status: "PUBLISHED",
      isFeatured: false,
      organizerId: organizer1.id,
      categoryId: categories[3].id, // Thể thao & E-Sports
      ticketTiers: {
        create: [
          {
            name: "Vé Khán Giả Cổ Vũ (Miễn phí)",
            price: 0,
            quantity: 600,
            sold: 380,
            description: "Ghế khán đài tự do cổ vũ các đội tuyển",
            benefits: "Vào cửa xem trực tiếp, tham gia mini game bốc thăm quà tặng gaming gear",
          },
          {
            name: "Vé Ghế VIP Hàng Đầu Cạnh Tuyển Thủ",
            price: 30000,
            quantity: 80,
            sold: 65,
            description: "Ghế ngồi sát khu vực thi đấu của các game thủ",
            benefits: "Ghế đệm VIP, nước tăng lực miễn phí, giao lưu tuyển thủ",
          },
        ],
      },
    },
    include: { ticketTiers: true },
  });

  // Event 5: Workshop Lập Trình Web & Mobile
  const ev5 = await prisma.event.create({
    data: {
      title: "Workshop Thực Chiến: Làm Chủ Next.js, AI & Tailwind CSS Hiện Đại",
      slug: "workshop-thuc-chien-nextjs-ai-tailwind-ictu",
      shortDesc: "Buổi chia sẻ thực tế dành riêng cho sinh viên Khoa CNTT - ICTU chuẩn bị làm đồ án tốt nghiệp và kiến tập doanh nghiệp.",
      description: `
Diễn giả: Kỹ sư cựu sinh viên ICTU hiện là Tech Lead tại tập đoàn công nghệ lớn.
Nội dung thực hành:
- Thiết kế hệ thống Web App chuẩn Production với Next.js App Router và Prisma.
- Triển khai xác thực JWT, bảo mật phân quyền RBAC và tích hợp tạo mã QR Code động.
- Phương pháp sử dụng AI coding agent hiệu quả để gia tăng năng suất gấp 5 lần.
      `,
      bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      startDate: new Date("2026-12-12T14:00:00Z"),
      endDate: new Date("2026-12-12T17:30:00Z"),
      location: "Phòng Thực Hành Máy Tính Lab 402 - Nhà C2, Trường ĐH CNTT & Truyền Thông Thái Nguyên",
      locationType: "HYBRID",
      onlineLink: "https://meet.google.com/ictu-dev-workshop",
      status: "PUBLISHED",
      isFeatured: false,
      organizerId: organizer2.id,
      categoryId: categories[4].id, // Workshop
      ticketTiers: {
        create: [
          {
            name: "Vé Tham Dự Thực Hành Lab Máy Tính",
            price: 0,
            quantity: 60,
            sold: 48,
            description: "Số lượng chỗ ngồi có hạn theo phòng máy Lab",
            benefits: "Sử dụng máy tính Lab, nhận tài liệu source code mẫu, cấp chứng nhận tham gia",
          },
          {
            name: "Vé Xem Trực Tuyến Qua Google Meet",
            price: 0,
            quantity: 300,
            sold: 110,
            description: "Dành cho sinh viên học online tại nhà",
            benefits: "Link xem livestream HD, hỏi đáp trực tiếp cùng diễn giả",
          },
        ],
      },
    },
    include: { ticketTiers: true },
  });

  // Event 6: Giải Chạy Tiếp Sức ICTU Green Marathon
  const ev6 = await prisma.event.create({
    data: {
      title: "Giải Chạy Sinh Viên ICTU Green Marathon 2026: Vì Môi Trường Xanh",
      slug: "giai-chay-sinh-vien-ictu-green-marathon-2026",
      shortDesc: "Hoạt động rèn luyện thể chất lan tỏa lối sống năng động và bảo vệ khuôn viên xanh Đại học Thái Nguyên.",
      description: `
Được tổ chức bởi Hội Sinh Viên Trường Đại học CNTT & Truyền Thông Thái Nguyên.
- Cung đường chạy: 3KM & 5KM quanh khuôn viên rợp bóng cây xanh của ICTU và khu đô thị đại học.
- Đóng góp vào quỹ cây xanh thanh niên ICTU.
      `,
      bannerImage: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
      startDate: new Date("2026-12-20T06:00:00Z"),
      endDate: new Date("2026-12-20T10:00:00Z"),
      location: "Cổng Chính & Khuôn Viên Trường ĐH CNTT & Truyền Thông Thái Nguyên",
      locationType: "OFFLINE",
      status: "PUBLISHED",
      isFeatured: false,
      organizerId: organizer1.id,
      categoryId: categories[3].id,
      ticketTiers: {
        create: [
          {
            name: "Bib Chạy 3KM - Khỏe Để Lập Trình",
            price: 30000,
            quantity: 400,
            sold: 210,
            description: "Phù hợp cho tất cả sinh viên và giảng viên",
            benefits: "Áo chạy thể thao ICTU, Nước khoáng trạm tiếp sức, Huy chương hoàn thành",
          },
          {
            name: "Bib Chạy 5KM - Bứt Phá Giới Hạn",
            price: 50000,
            quantity: 200,
            sold: 130,
            description: "Có chíp bấm giờ điện tử",
            benefits: "Áo thi đấu cao cấp, Huy chương đúc kim loại, Quà tài trợ từ doanh nghiệp",
          },
        ],
      },
    },
    include: { ticketTiers: true },
  });

  // Event 7: Pending event for Admin Approval demonstration
  await prisma.event.create({
    data: {
      title: "Hội Thảo An Toàn Thông Tin & Phòng Chống Tấn Công Mạng ICTU 2026",
      slug: "hoi-thao-an-toan-thong-tin-ictu-2026",
      shortDesc: "Sự kiện khoa học an ninh mạng đang chờ Quản trị viên (Admin Lô Quốc Khánh) kiểm duyệt trước khi xuất bản lên cổng thông tin trường.",
      description: "Thực hành phát hiện lỗ hổng phần mềm, kiểm thử thâm nhập hệ thống Web và các giải pháp phòng thủ an ninh mạng cho cơ sở dữ liệu giáo dục.",
      bannerImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      startDate: new Date("2026-12-26T09:00:00Z"),
      endDate: new Date("2026-12-26T16:00:00Z"),
      location: "Hội trường Tầng 2 - Trung Tâm Thông Tin Thư Viện ICTU, TP. Thái Nguyên",
      locationType: "OFFLINE",
      status: "PENDING_APPROVAL", // Chờ Admin duyệt
      isFeatured: false,
      organizerId: organizer2.id,
      categoryId: categories[0].id,
      ticketTiers: {
        create: [
          {
            name: "Vé Tham Dự Miễn Phí",
            price: 0,
            quantity: 120,
            sold: 0,
            description: "Dành cho sinh viên chuyên ngành An toàn thông tin ICTU",
          },
        ],
      },
    },
  });

  console.log("Seeding Bookings and Tickets with unique QR data for ICTU events...");
  // Attendee 1 booked tickets for ICTU TechFest
  await prisma.booking.create({
    data: {
      bookingCode: "ICTU-2026-8812",
      userId: attendeeUser1.id,
      eventId: ev1.id,
      totalAmount: 0,
      status: "PAID",
      paymentMethod: "FREE",
      customerName: "Nguyễn Văn An",
      customerEmail: "attendee@eventhub.vn",
      customerPhone: "0912345678",
      tickets: {
        create: [
          {
            ticketCode: "TCK-ICTU-TECHFEST-001",
            qrCodeData: JSON.stringify({
              code: "TCK-ICTU-TECHFEST-001",
              event: "ICTU TechFest & Ngày Hội Việc Làm Công Nghệ 2026",
              holder: "Nguyễn Văn An",
              tier: "Vé Sinh Viên ICTU (Miễn phí)",
            }),
            ticketTierId: ev1.ticketTiers[0].id,
            attendeeName: "Nguyễn Văn An",
            attendeeEmail: "attendee@eventhub.vn",
            isCheckedIn: true, // Demo 1 ticket already checked in
            checkedInAt: new Date(),
            checkedInBy: "Đoàn Thanh Niên & Hội Sinh Viên ICTU",
          },
        ],
      },
    },
  });

  // Attendee 1 booked tickets for Đêm Nhạc Hội Chào Tân Sinh Viên ICTU
  await prisma.booking.create({
    data: {
      bookingCode: "ICTU-2026-9421",
      userId: attendeeUser1.id,
      eventId: ev2.id,
      totalAmount: 50000,
      status: "PAID",
      paymentMethod: "MOMO",
      customerName: "Nguyễn Văn An",
      customerEmail: "attendee@eventhub.vn",
      customerPhone: "0912345678",
      tickets: {
        create: [
          {
            ticketCode: "TCK-ICTU-MUSIC-088",
            qrCodeData: JSON.stringify({
              code: "TCK-ICTU-MUSIC-088",
              event: "Đêm Đại Nhạc Hội Chào Tân Sinh Viên ICTU: Sắc Màu Tuổi Trẻ 2026",
              holder: "Nguyễn Văn An",
              tier: "Vé Fanzone Gần Sân Khấu",
            }),
            ticketTierId: ev2.ticketTiers[1].id,
            attendeeName: "Nguyễn Văn An",
            attendeeEmail: "attendee@eventhub.vn",
            isCheckedIn: false, // Ready for QR Check-in scanning demo!
          },
          {
            ticketCode: "TCK-ICTU-MUSIC-089",
            qrCodeData: JSON.stringify({
              code: "TCK-ICTU-MUSIC-089",
              event: "Đêm Đại Nhạc Hội Chào Tân Sinh Viên ICTU: Sắc Màu Tuổi Trẻ 2026",
              holder: "Bạn Cùng Lớp (Nguyễn Văn An)",
              tier: "Vé Fanzone Gần Sân Khấu",
            }),
            ticketTierId: ev2.ticketTiers[1].id,
            attendeeName: "Bạn Cùng Lớp (Nguyễn Văn An)",
            attendeeEmail: "attendee@eventhub.vn",
            isCheckedIn: false, // Ready for QR Check-in scanning demo!
          },
        ],
      },
    },
  });

  // Attendee 2 booked ticket for ICTU E-Sports
  await prisma.booking.create({
    data: {
      bookingCode: "ICTU-2026-1502",
      userId: attendeeUser2.id,
      eventId: ev4.id,
      totalAmount: 30000,
      status: "PAID",
      paymentMethod: "BANK_TRANSFER",
      customerName: "Trần Thị Mai Linh",
      customerEmail: "linh@eventhub.vn",
      customerPhone: "0934567890",
      tickets: {
        create: [
          {
            ticketCode: "TCK-ICTU-ESPORTS-012",
            qrCodeData: JSON.stringify({
              code: "TCK-ICTU-ESPORTS-012",
              event: "Giải Đấu Thể Thao Điện Tử ICTU E-Sports Championship 2026",
              holder: "Trần Thị Mai Linh",
              tier: "Vé Ghế VIP Hàng Đầu Cạnh Tuyển Thủ",
            }),
            ticketTierId: ev4.ticketTiers[1].id,
            attendeeName: "Trần Thị Mai Linh",
            attendeeEmail: "linh@eventhub.vn",
            isCheckedIn: false,
          },
        ],
      },
    },
  });

  console.log("Seeding Reviews from ICTU Students...");
  await prisma.review.create({
    data: {
      eventId: ev1.id,
      userId: attendeeUser1.id,
      rating: 5,
      comment: "Ngày hội việc làm ICTU TechFest năm nay cực kỳ chất lượng! Em đã được phỏng vấn trực tiếp với FPT Software và nhận được lời mời thực tập hè.",
    },
  });

  await prisma.review.create({
    data: {
      eventId: ev1.id,
      userId: attendeeUser2.id,
      rating: 5,
      comment: "Khâu check-in quét mã QR tại cổng Hội trường C1 siêu nhanh, sinh viên không phải chen lấn xếp hàng ký giấy như các năm trước.",
    },
  });

  await prisma.review.create({
    data: {
      eventId: ev2.id,
      userId: attendeeUser2.id,
      rating: 5,
      comment: "Đêm nhạc hội quá cháy! Hệ thống âm thanh ánh sáng sân vận động ICTU đỉnh chóp. Cảm ơn Đoàn Trường và Ban Tổ Chức rất nhiều!",
    },
  });

  console.log("Seeding Notifications...");
  await prisma.notification.create({
    data: {
      userId: attendeeUser1.id,
      title: "Đăng ký vé ICTU TechFest thành công!",
      message: "Bạn đã nhận vé thành công cho sự kiện ICTU TechFest & Ngày Hội Việc Làm 2026. Mã vé: TCK-ICTU-TECHFEST-001.",
      link: "/my-tickets",
    },
  });

  await prisma.notification.create({
    data: {
      userId: organizer1.id,
      title: "Đơn đặt vé mới",
      message: "Sinh viên Nguyễn Văn An vừa đăng ký tham dự Đêm Đại Nhạc Hội ICTU 2026. Mã đơn: ICTU-2026-9421.",
      link: "/organizer/events",
    },
  });

  console.log("ICTU Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
