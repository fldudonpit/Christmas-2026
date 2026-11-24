import { Competition } from '../types/competition';

export const EVENT_DATE_ISO = '2026-12-18T08:30:00+07:00';

export const COMPETITIONS: Competition[] = [
  {
    index: 1,
    code: '01',
    id: 'singing-contest',
    title: 'Singing Contest',
    thaiSubtitle: 'การประกวดร้องเพลงภาษาอังกฤษ',
    categoryLabel: 'Individual Competition · Online Video Submission',
    divisionMode: 'split',
    divisionLabel: 'แยก ม.ต้น (M.1–M.3) / ม.ปลาย (M.4–M.6)',
    channel: 'online_email',
    venueOrType: 'ส่งคลิปวิดีโอทางอีเมลตามระดับชั้น',
    dateLabel: 'ภายใน 8 ธ.ค. 2569',
    submissionDeadline: 'December 8, 2026 (8 ธันวาคม 2569)',
    themeTopic: 'English Singing Performance (English Songs Only)',
    teamFormat: 'ประเภทเดี่ยว (Individual Competition)',
    summary:
      'ประกวดขับร้องเพลงภาษาอังกฤษประเภทเดี่ยว บันทึกคลิปวิดีโอและส่งไปยังอีเมลประจำระดับชั้น ภายในวันที่ 8 ธันวาคม 2569',
    rules: [
      'เข้าแข่งขันแบบเดี่ยวเท่านั้น (Individual Competition)',
      'ขับร้องเพลงภาษาอังกฤษเท่านั้น (English Songs Only)',
      'บันทึกคลิปวิดีโอการร้องเพลงให้เห็นผู้เข้าแข่งขันและได้ยินเสียงชัดเจน',
      'ส่งคลิปวิดีโอไปยังอีเมลประจำระดับชั้นของผู้เข้าแข่งขัน (ม.ต้น: Thanarak@udonpit.ac.th · ม.ปลาย: panan.pro@cru.ac.th)',
      'แสดงทักษะคุณภาพเสียง การออกเสียง จังหวะ บุคลิกภาพบนเวที และความแม่นยำของเนื้อเพลง',
    ],
    judgingCriteria: [
      {
        label: 'Voice Quality and Tone',
        description: 'คุณภาพเสียง โทนเสียง และความสามารถในการร้องเพลงโดยรวม',
      },
      {
        label: 'Pronunciation',
        description: 'ความชัดเจนและความถูกต้องของการออกเสียงภาษาอังกฤษ',
      },
      {
        label: 'Timing',
        description: 'จังหวะที่เหมาะสมและความสอดคล้องกับดนตรี',
      },
      {
        label: 'Stage Presence',
        description: 'ความมั่นใจ เสน่ห์ในการแสดง และการแต่งกายที่เหมาะสม',
      },
      {
        label: 'Mastery of Lyrics',
        description: 'การจดจำเนื้อเพลงอย่างแม่นยำ ร้องได้อย่างต่อเนื่องไม่ติดขัด',
      },
    ],
    contacts: [
      {
        level: 'ม.ต้น (Lower Secondary · M.1–M.3)',
        email: 'Thanarak@udonpit.ac.th',
        lineOpenChat:
          'https://line.me/ti/g2/v0dovbqdcXrGMHimoqHbmUR-VbI5y8ZJeeAgpA?utm_source=invitation&utm_medium=QR_code&utm_campaign=default',
      },
      {
        level: 'ม.ปลาย (Upper Secondary · M.4–M.6)',
        email: 'panan.pro@cru.ac.th',
        lineOpenChat:
          'https://line.me/ti/g2/qRQJ9oG6yQkZrOwAjtKzSgGJdlxNToaJTexCaw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default',
      },
    ],
    dateGroup: 'dec8_submit',
  },
  {
    index: 2,
    code: '02',
    id: 'christmas-card',
    title: 'Christmas Card Contest',
    thaiSubtitle: 'การประกวดออกแบบการ์ดคริสต์มาส',
    categoryLabel: 'Individual Competition · Artwork Submission',
    divisionMode: 'split',
    divisionLabel: 'แยก ม.ต้น (M.1–M.3) / ม.ปลาย (M.4–M.6)',
    channel: 'onsite_artwork',
    venueOrType: 'ส่งผลงานที่ห้อง 412 (ม.ต้น Teacher Chalita / ม.ปลาย Teacher Araya)',
    dateLabel: 'ภายใน 8 ธ.ค. 2569',
    submissionDeadline: 'December 8, 2026 (8 ธันวาคม 2569)',
    themeTopic: 'Christmas',
    teamFormat: 'ประเภทเดี่ยว (Individual Competition)',
    summary:
      'สร้างสรรค์การ์ดอวยพรวันคริสต์มาสขนาด A5 พร้อมข้อความอวยพรภาษาอังกฤษที่สื่อความหมาย ส่งผลงานตัวจริงตามห้องและครูผู้รับผิดชอบระดับชั้น',
    rules: [
      'ขนาดการ์ดคริสต์มาสต้องเท่ากับครึ่งหนึ่งของกระดาษ A4 (ขนาด A5)',
      'สามารถใช้วัสดุตกแต่งได้อิสระ เช่น กระดาษ ผ้า สี และของตกแต่งต่างๆ',
      'ต้องเป็นผลงานที่สร้างสรรค์ขึ้นเองทั้งหมด ห้ามลอกเลียนแบบหรือคัดลอกผลงานผู้อื่น (หากตรวจพบจะถูกตัดสิทธิ์)',
      'ต้องมีข้อความอวยพรวันคริสต์มาส (Christmas Message) ที่สอดคล้องกับธีมภายในตัวการ์ด',
      'ส่งผลงานตัวจริงภายในกำหนดวันที่ 8 ธันวาคม 2569',
      'การตัดสินของคณะกรรมการถือเป็นที่สิ้นสุด',
    ],
    judgingCriteria: [
      { label: 'Creativity', description: 'ความคิดสร้างสรรค์และความแปลกใหม่เป็นเอกลักษณ์' },
      { label: 'Design and Composition', description: 'ความสวยงาม การจัดวางองค์ประกอบ และศิลปะ' },
      { label: 'Relevance to the Theme', description: 'ความสอดคล้องของงานออกแบบกับธีมคริสต์มาส' },
      { label: 'Message Content', description: 'ความหมาย ความชัดเจน และความเหมาะสมของข้อความอวยพร' },
    ],
    contacts: [
      {
        level: 'ม.ต้น (Lower Secondary · M.1–M.3)',
        room: 'Room 412 (ห้อง 412)',
        teacher: 'Teacher Chalita',
        lineOpenChat:
          'https://line.me/ti/g2/9v4L346mnBt-2tlYEVMnPW49wpgOsbsd0gyr5w?utm_source=invitation&utm_medium=link_copy&utm_campaign=default',
      },
      {
        level: 'ม.ปลาย (Upper Secondary · M.4–M.6)',
        room: 'Room 412 (ห้อง 412)',
        teacher: 'Teacher Araya',
        lineOpenChat:
          'https://line.me/ti/g2/eq8TqOYNkwafElLI_6uLzbUqT5OtpteYOlcvMg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default',
      },
    ],
    dateGroup: 'dec8_submit',
  },
  {
    index: 3,
    code: '03',
    id: 'speech',
    title: 'Speech Contest',
    thaiSubtitle: 'การแข่งขันกล่าวสุนทรพจน์ภาษาอังกฤษ',
    categoryLabel: 'Individual Competition · On-site Competition',
    divisionMode: 'split',
    divisionLabel: 'แยก ม.ต้น (M.1–M.3) / ม.ปลาย (M.4–M.6)',
    channel: 'onsite_live',
    venueOrType: 'ห้อง 425 (ม.ต้น) / ห้อง 426 (ม.ปลาย) · เตรียมตัวห้อง 427',
    dateLabel: '8 ธ.ค. 2569',
    submissionDeadline: 'December 8, 2026 (8 ธันวาคม 2569)',
    themeTopic: {
      junior: 'Christmas: A Season of Love and Joy',
      senior: 'Christmas Beyond Borders: Celebrating Unity in Diversity',
    },
    teamFormat: 'ประเภทเดี่ยว (Individual Competition)',
    summary:
      'แข่งขันกล่าวสุนทรพจน์ภาษาอังกฤษแบบสดบนเวที ความยาว 3:00–3:30 นาที ในวันที่ 8 ธันวาคม 2569 ณ ห้อง 425 และ 426',
    rules: [
      'กล่าวสุนทรพจน์ตามหัวข้อที่กำหนดในระดับชั้นของตนเอง (ม.ต้น: "Christmas: A Season of Love and Joy" / ม.ปลาย: "Christmas Beyond Borders: Celebrating Unity in Diversity")',
      'กำหนดเวลาในการพูด 3:00–3:30 นาที ทั้งสองระดับชั้น (ต้องไม่น้อยกว่า 3 นาที และไม่เกิน 3 นาที 30 วินาที)',
      'แสดงการใช้ภาษาอย่างเหมาะสม มีความมั่นใจ และมีทักษะการพูดต่อหน้าสาธารณชน',
      'รายงานตัว ณ ห้องเตรียมตัว (Room 427) ก่อนเข้าแข่งขันในห้องประจำระดับชั้น',
    ],
    judgingCriteria: [
      {
        label: '1. Introduction & Ending',
        points: 15,
        description: 'การแนะนำตัว การเปิดเรื่อง การเชื่อมโยงที่ราบรื่น และการสรุปจบที่เหมาะสม',
      },
      {
        label: '2. Content',
        points: 25,
        description: 'ความตรงประเด็น การใช้ภาษา ความชัดเจน การเรียงลำดับความคิด และการสรุปสาระสำคัญ',
      },
      {
        label: '3. Voice Usage',
        points: 25,
        description: 'การออกเสียง สำเนียง ควบกล้ำ และเสียงท้ายคำ (Final Sounds)',
      },
      {
        label: '4. Fluency & Coherence',
        points: 10,
        description: 'ความคล่องแคล่ว ความต่อเนื่องของแนวคิด และความเป็นเอกภาพของเนื้อหา',
      },
      {
        label: '5. Appearance',
        points: 20,
        description: 'ภาษากาย การสบตา ความมั่นใจ และบุคลิกภาพในการนำเสนอ',
      },
      {
        label: '6. Time Management',
        points: 5,
        description: 'การบริหารเวลาให้อยู่ในช่วง 3:00–3:30 นาที',
      },
    ],
    totalPoints: 100,
    contacts: [
      {
        level: 'ม.ต้น (Lower Secondary · M.1–M.3)',
        room: 'Room 425 (ห้อง 425)',
        note: 'ห้องเตรียมตัว (Preparation Room): Room 427',
      },
      {
        level: 'ม.ปลาย (Upper Secondary · M.4–M.6)',
        room: 'Room 426 (ห้อง 426)',
        note: 'ห้องเตรียมตัว (Preparation Room): Room 427',
      },
    ],
    dateGroup: 'dec8_live',
  },
  {
    index: 4,
    code: '04',
    id: 'drawing-painting',
    title: 'Drawing & Painting Contest',
    thaiSubtitle: 'การประกวดวาดภาพและระบายสี',
    categoryLabel: 'Individual Competition · Artwork Submission',
    divisionMode: 'open',
    divisionLabel: 'รวมทุกระดับชั้น (Combined Levels · ไม่แยก ม.ต้น/ม.ปลาย)',
    channel: 'onsite_artwork',
    venueOrType: 'ส่งผลงานที่ห้อง 421 (ครูชวนันท์)',
    dateLabel: 'ภายใน 8 ธ.ค. 2569',
    submissionDeadline: 'December 8, 2026 (8 ธันวาคม 2569)',
    themeTopic: 'A Gift from the Heart on Christmas Night (ของขวัญจากหัวใจในค่ำคืนวันคริสต์มาส)',
    teamFormat: 'ประเภทเดี่ยว · รวมทุกระดับชั้น (Combined Levels)',
    summary:
      'ประกวดวาดภาพระบายสีในหัวข้อ "ของขวัญจากหัวใจในค่ำคืนวันคริสต์มาส" แข่งขันรวมทุกระดับชั้นไม่แยก ม.ต้น-ม.ปลาย ส่งผลงานที่ห้อง 421 (ครูชวนันท์)',
    rules: [
      'เข้าแข่งขันแบบเดี่ยว (Individual) และแข่งขันรวมทุกระดับชั้น ไม่แยก ม.ต้น / ม.ปลาย',
      'สร้างสรรค์ผลงานภายใต้หัวข้อ "A Gift from the Heart on Christmas Night (ของขวัญจากหัวใจในค่ำคืนวันคริสต์มาส)"',
      'แสดงความคิดสร้างสรรค์ จินตนาการ ทักษะทางศิลปะ และการสื่อความหมาย',
      'เขียนข้อมูลด้านหลังภาพวาดให้ชัดเจนครบทั้ง 5 รายการ: ชื่อ-สกุลภาษาไทย, ชื่อ-สกุลภาษาอังกฤษ, ระดับชั้น, ห้องเรียน และเบอร์โทรศัพท์ติดต่อ',
      'ส่งผลงานที่ห้อง 421 (ครูชวนันท์) ภายในวันที่ 8 ธันวาคม 2569',
    ],
    judgingCriteria: [
      {
        label: '1. Creativity and Imagination',
        points: 25,
        description: 'ความคิดสร้างสรรค์และจินตนาการ',
      },
      {
        label: '2. Relevance to the Competition Theme',
        points: 25,
        description: 'ความสอดคล้องกับหัวข้อการแข่งขัน',
      },
      {
        label: '3. Artistic Beauty and Composition',
        points: 20,
        description: 'ความสวยงามและองค์ประกอบศิลป์',
      },
      {
        label: '4. Use of Color and Artistic Techniques',
        points: 15,
        description: 'การใช้สีและเทคนิคในการวาดภาพ',
      },
      {
        label: '5. Expression of Meaning and Emotion',
        points: 15,
        description: 'การสื่อความหมายและถ่ายทอดอารมณ์',
      },
    ],
    totalPoints: 100,
    contacts: [
      {
        level: 'รวมทุกระดับชั้น (Combined Levels · M.1–M.6)',
        room: 'Room 421 (ห้อง 421)',
        teacher: 'ครูชวนันท์',
        lineOpenChat:
          'https://line.me/ti/g2/VDT7tYu9XeFIVmUdzqFKgZJxJeQRDg8IAp0pNA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default',
      },
    ],
    dateGroup: 'dec8_submit',
  },
  {
    index: 5,
    code: '05',
    id: 'english-quiz',
    title: 'English Quiz Contest',
    thaiSubtitle: 'การแข่งขันตอบปัญหาภาษาอังกฤษและความรู้ทั่วไป',
    categoryLabel: 'Individual Competition · On-site Competition',
    divisionMode: 'split',
    divisionLabel: 'แยก ม.ต้น (M.1–M.3) / ม.ปลาย (M.4–M.6)',
    channel: 'onsite_live',
    venueOrType: 'ห้อง 425 (ม.ต้น) / ห้อง 426 (ม.ปลาย)',
    dateLabel: '15 ธ.ค. 2569',
    submissionDeadline: 'December 15, 2026 (15 ธันวาคม 2569)',
    themeTopic: 'General Knowledge & Christmas Knowledge',
    teamFormat: 'ประเภทเดี่ยว (Individual · นักเรียนปีการศึกษา 2569)',
    summary:
      'แข่งขันตอบปัญหาภาษาอังกฤษประเภทเดี่ยว แบ่งเป็น 2 รอบ (Preliminary Round 30 ข้อ และ Final Round 5 คนสุดท้าย) วันที่ 15 ธันวาคม 2569 ณ ห้อง 425 (ม.ต้น) และห้อง 426 (ม.ปลาย)',
    rules: [
      'เปิดรับนักเรียนโรงเรียนอุดรพิทยานุกูลที่กำลังศึกษาในปีการศึกษา 2569 แยกประเภท ม.ต้น และ ม.ปลาย',
      'เข้าแข่งขันแบบเดี่ยวเท่านั้น (Individual Competition)',
      'การแข่งขันแบ่งออกเป็น 2 รอบ ได้แก่ รอบคัดเลือก (Preliminary Round) และรอบชิงชนะเลิศ (Final Round)',
      'ปฏิบัติตามคำชี้แจงและเวลาที่กำหนดในแต่ละรอบอย่างเคร่งครัด',
    ],
    rounds: [
      {
        title: 'Round 1: Preliminary Round (รอบคัดเลือก)',
        details: [
          'ทำแบบทดสอบปรนัย 4 ตัวเลือก จำนวน 30 ข้อ (30 คะแนน)',
          'เนื้อหาครอบคลุมความรู้ทั่วไป (General Knowledge) และความรู้เกี่ยวกับเทศกาลคริสต์มาส (Christmas Knowledge)',
          'ผู้ที่ได้คะแนนสูงสุด 5 อันดับแรกของแต่ละระดับชั้นจะผ่านเข้าสู่รอบชิงชนะเลิศ',
        ],
      },
      {
        title: 'Round 2: Final Round (รอบชิงชนะเลิศ)',
        details: [
          'ผู้เข้ารอบ 5 คนสุดท้ายตอบคำถามด้วยการเขียนลงในกระดาษคำตอบที่จัดเตรียมไว้ให้',
          'ต้องตอบคำถามแต่ละข้อภายในเวลาที่กำหนด',
          'ผู้ที่ได้คะแนนสูงสุด 3 อันดับแรกจะได้รับรางวัลชนะเลิศ รองชนะเลิศอันดับ 1 และรองชนะเลิศอันดับ 2',
        ],
      },
    ],
    judgingCriteria: [
      { label: 'Accuracy', description: 'ความถูกต้องของคำตอบ' },
      { label: 'Knowledge', description: 'ความรอบรู้ด้านความรู้ทั่วไปและเรื่องราววันคริสต์มาส' },
      { label: 'Ranking', description: 'การจัดอันดับตามคะแนนสะสมในแต่ละรอบ' },
    ],
    contacts: [
      {
        level: 'ม.ต้น (Lower Secondary · M.1–M.3)',
        room: 'Room 425 (ห้อง 425)',
      },
      {
        level: 'ม.ปลาย (Upper Secondary · M.4–M.6)',
        room: 'Room 426 (ห้อง 426)',
      },
    ],
    dateGroup: 'dec15_live',
  },
  {
    index: 6,
    code: '06',
    id: 'cover-dance',
    title: 'Cover Dance Contest',
    thaiSubtitle: 'การประกวดเต้นคัฟเวอร์ (รุ่นรวมไม่แยกระดับ)',
    categoryLabel: 'Group Competition · Online Audition & Live Stage',
    divisionMode: 'open',
    divisionLabel: 'รวมทุกระดับชั้น (Combined Levels · ไม่แยก ม.ต้น/ม.ปลาย)',
    channel: 'hybrid_stage',
    venueOrType: 'ส่งลิงก์คลิป 8 ธ.ค. · จับฉลาก 14 ธ.ค. · แข่งจริง 18 ธ.ค. ณ โดมอเนกประสงค์',
    dateLabel: 'ส่งคลิป 8 ธ.ค. · จับฉลาก 14 ธ.ค. · รอบชิง 18 ธ.ค. 2569',
    submissionDeadline: 'ส่งคลิป 8 ธ.ค. 2569 (23:59 น.) · จับฉลาก 14 ธ.ค. 2569 · แข่งจริง 18 ธ.ค. 2569',
    themeTopic: 'Christmas Cover Dance',
    teamFormat: 'ประเภททีม ไม่เกิน 10 คน (คละระดับชั้นได้ · เฉพาะนักเรียนอุดรพิทย์)',
    summary:
      'การประกวดเต้นทีมรวมทุกระดับชั้น ส่งคลิป One-Take รอบคัดเลือกผ่าน YouTube หรือ Google Drive ภายใน 8 ธ.ค. เวลา 23:59 น. จับฉลากลำดับการแสดง 14 ธ.ค. (จะแจ้งเวลา/สถานที่ใน OpenChat) และขึ้นแสดงรอบชิง 18 ธ.ค. ณ โดมอเนกประสงค์ ชิงเกียรติบัตร และของรางวัลสุดพิเศษ',
    rules: [
      'เปิดรับเฉพาะนักเรียนโรงเรียนอุดรพิทยานุกูลเท่านั้น รวมทุกระดับชั้น (ไม่แยก ม.ต้น/ม.ปลาย)',
      'สมาชิกในทีมไม่เกิน 10 คน และสมาชิกในคลิปรอบคัดเลือกต้องเป็นชุดเดียวกับผู้ขึ้นแสดงวันแข่งจริงทั้งหมด',
      'การแสดงต้องมีเพลงที่เกี่ยวข้องกับคริสต์มาสอย่างน้อย 30 วินาที และความยาวรวมทั้งหมดไม่เกิน 5 นาที',
      'คลิปออดิชันต้องถ่ายแบบต่อเนื่องรวดเดียวจบ (One-Take) ห้ามตัดต่อ และห้ามขยับ/เคลื่อนกล้อง',
      'ในคลิปออดิชันสามารถสวมชุดพละของโรงเรียนหรือชุดแสดงก็ได้ (เครื่องแต่งกายไม่มีผลต่อคะแนนรอบคัดเลือก)',
      'อัปโหลดคลิปขึ้น YouTube หรือ Google Drive และส่งเฉพาะลิงก์วิดีโอภายในวันที่ 8 ธันวาคม 2569 เวลา 23:59 น. (ทีมที่ไม่ส่งคลิปจะไม่มีสิทธิ์แข่งรอบสด)',
      'ลำดับการแสดงวันจริงกำหนดโดยการจับฉลากในวันที่ 14 ธันวาคม 2569 (จะแจ้งเวลาและสถานที่ใน LINE OpenChat) และผลการตัดสินของกรรมการถือเป็นที่สิ้นสุด',
    ],
    judgingCriteria: [],
    contacts: [
      {
        level: 'รวมทุกระดับชั้น (Combined Levels · M.1–M.6)',
        room: 'โดมอเนกประสงค์ (วันแข่งจริง 18 ธ.ค. 2569)',
        lineOpenChat:
          'https://line.me/ti/g2/AiPVsbdPVF-Z6YsazCbb2j52WTsKvxzwZcsKrQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default',
        note: 'ส่งเฉพาะลิงก์ YouTube หรือ Google Drive · จับฉลากวันที่ 14 ธันวาคม 2569 (จะแจ้งเวลาและสถานที่ใน LINE OpenChat)',
      },
    ],
    dateGroup: 'dec18_live',
  },
];

export const JUNIOR_GRADES = ['ม.1', 'ม.2', 'ม.3'];
export const SENIOR_GRADES = ['ม.4', 'ม.5', 'ม.6'];
export const ALL_GRADES = [...JUNIOR_GRADES, ...SENIOR_GRADES];

export interface AwardOptionMeta {
  value: 'winner_1' | 'runner_up_1' | 'runner_up_2' | 'participant' | 'absent';
  label: string;
  rank: number;
  shortRank: string;
}

export const AWARD_OPTIONS: readonly AwardOptionMeta[] = [
  {
    value: 'winner_1',
    label: 'ชนะเลิศอันดับ 1',
    rank: 1,
    shortRank: '01',
  },
  {
    value: 'runner_up_1',
    label: 'รองชนะเลิศอันดับ 1',
    rank: 2,
    shortRank: '02',
  },
  {
    value: 'runner_up_2',
    label: 'รองชนะเลิศอันดับ 2',
    rank: 3,
    shortRank: '03',
  },
  {
    value: 'participant',
    label: 'เข้าร่วมการแข่งขัน',
    rank: 4,
    shortRank: '04',
  },
  {
    value: 'absent',
    label: 'ไม่เข้าร่วมการแข่งขัน',
    rank: 5,
    shortRank: '05',
  },
] as const;

export function getAwardOption(status?: string): AwardOptionMeta | undefined {
  return AWARD_OPTIONS.find((opt) => opt.value === status);
}

export function getAwardRank(status?: string): number {
  return getAwardOption(status)?.rank ?? 99;
}
