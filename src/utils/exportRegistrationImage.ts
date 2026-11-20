import { Competition, CompetitionContact, DivisionType, RegistrationEntry } from '../types/competition';

interface InfoRow {
  label: string;
  value: string;
  accent?: 'white' | 'gold' | 'emerald' | 'mono';
}

export interface ScheduleChannelSummary {
  dateLabel: string;
  dateText: string;
  channelLabel: string;
  channelText: string;
}

export function getScheduleAndChannelInfo(
  competition?: Competition,
  contact?: CompetitionContact | null
): ScheduleChannelSummary {
  if (!competition) {
    return {
      dateLabel: 'วันแข่งขัน / กำหนดส่ง',
      dateText: '-',
      channelLabel: 'สถานที่ / ช่องทางส่ง',
      channelText: '-',
    };
  }

  let dateLabel = 'วันแข่งขัน / กำหนดส่ง';
  let dateText = competition.submissionDeadline;

  if (competition.id === 'speech' || competition.id === 'english-quiz') {
    dateLabel = 'วันแข่งขัน';
    dateText =
      competition.id === 'speech' ? '8 ธันวาคม 2569' : '15 ธันวาคม 2569';
  } else if (
    competition.id === 'singing-contest' ||
    competition.id === 'christmas-card' ||
    competition.id === 'drawing-painting'
  ) {
    dateLabel = 'กำหนดส่งผลงาน';
    dateText = 'ภายใน 8 ธันวาคม 2569';
  } else if (competition.id === 'cover-dance') {
    dateLabel = 'กำหนดการแข่งขัน';
    dateText = 'ส่งคลิปภายใน 8 ธ.ค. 2569 (23:59 น.) · จับฉลาก 14 ธ.ค. 2569 · แข่งจริง 18 ธ.ค. 2569';
  }

  let channelLabel = 'ห้องแข่งขัน / ช่องทางส่ง';
  let channelText = competition.venueOrType;

  if (contact?.email) {
    channelLabel = 'ช่องทางส่งผลงาน';
    channelText = `ส่งคลิปวิดีโอทางอีเมล ${contact.email}`;
  } else if (competition.id === 'cover-dance') {
    channelLabel = 'สถานที่ / ช่องทางส่ง';
    channelText = `ส่งลิงก์คลิป YouTube / Google Drive · แข่งจริง ณ ${contact?.room ?? 'โดมอเนกประสงค์'}`;
  } else if (competition.channel === 'onsite_artwork') {
    channelLabel = 'สถานที่ส่งผลงาน';
    channelText = `${contact?.room ?? competition.venueOrType}${
      contact?.teacher ? ` (${contact.teacher})` : ''
    }`;
  } else if (competition.channel === 'onsite_live') {
    channelLabel = 'ห้องแข่งขัน';
    channelText = `${contact?.room ?? competition.venueOrType}${
      contact?.note ? ` · ${contact.note}` : ''
    }`;
  }

  return {
    dateLabel,
    dateText,
    channelLabel,
    channelText,
  };
}

function segmentText(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (!para) {
      lines.push('');
      continue;
    }

    const tokens = segmentText(para);
    let currentLine = '';

    for (const token of tokens) {
      const candidate = currentLine + token;
      if (ctx.measureText(candidate).width <= maxWidth) {
        currentLine = candidate;
      } else {
        if (currentLine.trim().length > 0) {
          lines.push(currentLine.trimEnd());
          currentLine = token.trimStart();
        } else {
          let chunk = '';
          for (const ch of Array.from(token)) {
            if (ctx.measureText(chunk + ch).width <= maxWidth) {
              chunk += ch;
            } else {
              if (chunk) lines.push(chunk);
              chunk = ch;
            }
          }
          currentLine = chunk;
        }
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine.trimEnd());
    }
  }

  return lines.length > 0 ? lines : [''];
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function getDivisionLabel(div: DivisionType): string {
  if (div === 'junior') return 'มัธยมศึกษาตอนต้น (Lower Secondary · M.1–M.3)';
  if (div === 'senior') return 'มัธยมศึกษาตอนปลาย (Upper Secondary · M.4–M.6)';
  return 'รวมทุกระดับชั้น (Combined Levels · ไม่แยก ม.ต้น/ม.ปลาย)';
}

export async function downloadRegistrationAsImage(
  entry: RegistrationEntry,
  competition?: Competition,
  contact?: CompetitionContact | null
): Promise<void> {
  if (typeof document === 'undefined') return;

  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed with fallback system fonts if font loading check fails
    }
  }

  const width = 1080;
  const outerPad = 48;
  const cardX = outerPad;
  const cardW = width - outerPad * 2;
  const innerPad = 52;
  const contentX = cardX + innerPad;
  const contentW = cardW - innerPad * 2;
  const labelW = 270;
  const valueX = contentX + labelW + 24;
  const valueW = contentW - labelW - 24;

  const thaiFont = '"IBM Plex Sans Thai", "Sarabun", sans-serif';
  const monoFont = '"IBM Plex Mono", monospace';
  const displayFont = '"Barlow Condensed", "IBM Plex Sans Thai", sans-serif';

  const measureCanvas = document.createElement('canvas');
  const mCtx = measureCanvas.getContext('2d');
  if (!mCtx) {
    throw new Error('Canvas 2D context is not available');
  }

  const scheduleInfo = getScheduleAndChannelInfo(competition, contact);

  const rows: InfoRow[] = [
    {
      label: 'รายการแข่งขัน',
      value: competition ? `${competition.title} (${competition.thaiSubtitle})` : entry.competitionId,
      accent: 'white',
    },
    {
      label: 'รุ่นการแข่งขัน',
      value: getDivisionLabel(entry.division),
      accent: entry.division === 'open' ? 'gold' : 'emerald',
    },
    {
      label: scheduleInfo.dateLabel,
      value: scheduleInfo.dateText,
      accent: 'gold',
    },
    {
      label: scheduleInfo.channelLabel,
      value: scheduleInfo.channelText,
      accent: 'gold',
    },
    {
      label: 'ชื่อ-นามสกุล (ไทย)',
      value: entry.studentName,
      accent: 'white',
    },
  ];

  if (entry.englishFullName) {
    rows.push({
      label: 'ชื่อ-นามสกุล (อังกฤษ)',
      value: entry.englishFullName,
      accent: 'white',
    });
  }

  rows.push(
    {
      label: 'ชั้น / ห้อง · เลขประจำตัว',
      value: `${entry.gradeLevel}/${entry.classroom} · ${entry.studentId}`,
      accent: 'mono',
    },
    {
      label: 'เบอร์โทรศัพท์ติดต่อ',
      value: entry.contactInfo,
      accent: 'mono',
    }
  );

  if (entry.teamName) {
    rows.push({
      label: 'ชื่อทีม',
      value: entry.teamName,
      accent: 'gold',
    });
  }

  if (entry.submissionTitle) {
    rows.push({
      label: 'ชื่อเพลง / ผลงาน',
      value: entry.submissionTitle,
      accent: 'white',
    });
  }

  if (entry.submissionUrl) {
    rows.push({
      label: 'ลิงก์คลิปที่ส่ง',
      value: entry.submissionUrl,
      accent: 'mono',
    });
  }

  // Measure row heights
  const rowFont = `600 26px ${thaiFont}`;
  const monoRowFont = `500 24px ${monoFont}`;
  const rowLineHeight = 36;
  const rowPadY = 20;

  const measuredRows = rows.map((row) => {
    mCtx.font = row.accent === 'mono' ? monoRowFont : rowFont;
    const lines = wrapText(mCtx, row.value, valueW);
    const height = Math.max(rowLineHeight, lines.length * rowLineHeight) + rowPadY * 2;
    return { ...row, lines, height };
  });

  // Measure team members if present
  const memberFont = `400 24px ${thaiFont}`;
  const memberLineHeight = 34;
  mCtx.font = memberFont;
  const measuredMembers: string[] = [];
  if (entry.teamMembersList && entry.teamMembersList.length > 0) {
    entry.teamMembersList.forEach((member, idx) => {
      const lineText = `${idx + 1}. ${member.name}${member.gradeClass ? ` (${member.gradeClass})` : ''}`;
      measuredMembers.push(...wrapText(mCtx, lineText, contentW - 32));
    });
  }

  // Measure next steps lines
  const nextStepLines: { text: string; color: string }[] = [];
  if (contact) {
    if (contact.email) {
      nextStepLines.push({
        text: `ส่งคลิปวิดีโอมาที่อีเมล: ${contact.email} (ภายใน 8 ธ.ค. 2569)`,
        color: '#FDE68A',
      });
    } else if (competition?.channel === 'onsite_artwork') {
      nextStepLines.push({
        text: `ส่งผลงานตัวจริงที่ ${contact.room ?? ''}${contact.teacher ? ` (${contact.teacher})` : ''} ภายใน 8 ธ.ค. 2569`,
        color: '#FDE68A',
      });
    } else if (competition?.channel === 'onsite_live') {
      nextStepLines.push({
        text: `เข้าแข่งขันวันที่ ${
          competition.id === 'speech' ? '8 ธันวาคม 2569' : '15 ธันวาคม 2569'
        } ณ ${contact.room ?? ''}${contact.note ? ` (${contact.note})` : ''}`,
        color: '#FDE68A',
      });
    }
    if (contact.note && competition?.channel !== 'onsite_live') {
      nextStepLines.push({
        text: contact.note,
        color: '#D4D4D4',
      });
    }
    if (contact.lineOpenChat) {
      nextStepLines.push({
        text: 'กรุณาเข้าร่วมกลุ่ม LINE OpenChat ตามลิงก์ในหน้าเว็บไซต์เพื่อติดตามประกาศเพิ่มเติม',
        color: '#34D399',
      });
    }
  }

  const nextStepFont = `400 23px ${thaiFont}`;
  const nextStepLineHeight = 33;
  mCtx.font = nextStepFont;
  const wrappedNextSteps = nextStepLines.flatMap((item) =>
    wrapText(mCtx, item.text, contentW - 48).map((line) => ({
      text: line,
      color: item.color,
    }))
  );

  // Compute total height
  const headerHeight = 200;
  const rowsHeight = measuredRows.reduce((sum, r) => sum + r.height, 0);
  const membersSectionHeight =
    measuredMembers.length > 0 ? 64 + measuredMembers.length * memberLineHeight + 24 : 0;
  const nextStepsHeight =
    wrappedNextSteps.length > 0 ? 78 + wrappedNextSteps.length * nextStepLineHeight + 24 : 0;
  const footerHeight = 90;

  const cardH =
    headerHeight + rowsHeight + membersSectionHeight + nextStepsHeight + footerHeight;
  const totalHeight = outerPad * 2 + cardH;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to initialize canvas');
  }

  // Outer canvas background
  ctx.fillStyle = '#0B0D0F';
  ctx.fillRect(0, 0, width, totalHeight);

  // Card background & border
  const cardY = outerPad;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 20);
  ctx.fillStyle = '#12151A';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.stroke();

  // Top racing accent bar clipped inside rounded top
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 20);
  ctx.clip();
  const stripeW = cardW / 3;
  ctx.fillStyle = '#E10600';
  ctx.fillRect(cardX, cardY, stripeW, 10);
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(cardX + stripeW, cardY, stripeW, 10);
  ctx.fillStyle = '#15803D';
  ctx.fillRect(cardX + stripeW * 2, cardY, stripeW + 2, 10);
  ctx.restore();

  let cursorY = cardY + 52;

  // Kicker
  ctx.font = `600 18px ${monoFont}`;
  ctx.fillStyle = '#D4AF37';
  ctx.fillText('UDONPITTAYANUKOON SCHOOL · CHRISTMAS GRAND PRIX 2569', contentX, cursorY);
  cursorY += 38;

  // Status
  ctx.font = `600 22px ${thaiFont}`;
  ctx.fillStyle = '#34D399';
  ctx.fillText('บันทึกข้อมูลลงฐานข้อมูลสำเร็จ', contentX, cursorY);
  cursorY += 54;

  // Main Title
  ctx.font = `800 50px ${displayFont}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('ข้อมูลการสมัครแข่งขัน', contentX, cursorY);
  cursorY += 32;

  // Recorded timestamp
  const formattedDate = new Date(entry.createdAt).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  ctx.font = `400 20px ${thaiFont}`;
  ctx.fillStyle = '#A3A3A3';
  ctx.fillText(`บันทึกเมื่อ: ${formattedDate}`, contentX, cursorY);
  cursorY += 26;

  // Divider under header
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(contentX, cursorY);
  ctx.lineTo(contentX + contentW, cursorY);
  ctx.stroke();

  // Key-value rows
  for (let i = 0; i < measuredRows.length; i++) {
    const row = measuredRows[i];
    const rowTop = cursorY;

    ctx.font = `500 23px ${thaiFont}`;
    ctx.fillStyle = '#A3A3A3';
    ctx.fillText(row.label, contentX, rowTop + rowPadY + 24);

    ctx.font = row.accent === 'mono' ? monoRowFont : rowFont;
    ctx.fillStyle =
      row.accent === 'gold'
        ? '#FDE68A'
        : row.accent === 'emerald'
        ? '#34D399'
        : '#FFFFFF';

    row.lines.forEach((line, lineIdx) => {
      ctx.fillText(line, valueX, rowTop + rowPadY + 24 + lineIdx * rowLineHeight);
    });

    cursorY += row.height;

    if (i < measuredRows.length - 1 || measuredMembers.length > 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(contentX, cursorY);
      ctx.lineTo(contentX + contentW, cursorY);
      ctx.stroke();
    }
  }

  // Team members list
  if (measuredMembers.length > 0) {
    cursorY += 30;
    ctx.font = `600 24px ${thaiFont}`;
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(
      `สมาชิกในทีม (${entry.teamMembersList?.length ?? 0} คน)`,
      contentX,
      cursorY
    );
    cursorY += 34;

    ctx.font = memberFont;
    ctx.fillStyle = '#E5E5E5';
    for (const line of measuredMembers) {
      ctx.fillText(line, contentX + 12, cursorY);
      cursorY += memberLineHeight;
    }
    cursorY += 16;
  }

  // Next Steps Box
  if (wrappedNextSteps.length > 0) {
    cursorY += 14;
    const boxH = 60 + wrappedNextSteps.length * nextStepLineHeight + 16;
    drawRoundedRect(ctx, contentX, cursorY, contentW, boxH, 14);
    ctx.fillStyle = '#0B0D0F';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    let boxY = cursorY + 38;
    ctx.font = `700 24px ${thaiFont}`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('ขั้นตอนถัดไป', contentX + 24, boxY);
    boxY += 36;

    ctx.font = nextStepFont;
    for (const line of wrappedNextSteps) {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, contentX + 24, boxY);
      boxY += nextStepLineHeight;
    }
    cursorY += boxH + 10;
  }

  // Footer
  cursorY = cardY + cardH - 36;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(contentX, cursorY - 34);
  ctx.lineTo(contentX + contentW, cursorY - 34);
  ctx.stroke();

  ctx.font = `500 20px ${thaiFont}`;
  ctx.fillStyle = '#A3A3A3';
  ctx.fillText(
    'กลุ่มสาระการเรียนรู้ภาษาต่างประเทศและโปรแกรมภาษาอังกฤษ · โรงเรียนอุดรพิทยานุกูล',
    contentX,
    cursorY
  );

  // Trigger download
  const fileName = `udonpit-christmas-2569-${entry.competitionId}-${entry.studentId}.png`;
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((result) => resolve(result), 'image/png')
  );

  if (blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
