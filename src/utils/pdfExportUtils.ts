import { jsPDF } from 'jspdf';
import type { DecadeGroup, Week } from '@/utils/monthGroupingUtils';

function isWeekPassed(week: Week): boolean {
  return week.endDate.getTime() < Date.now();
}


function getSimpleColorForGroup(group: DecadeGroup['groups'][0]): [number, number, number] {
  const hasCurrent = group.weeks.some((w) => w.isCurrentWeek);
  const allPassed = group.weeks.every((w) => isWeekPassed(w));

  if (hasCurrent) {
    return [249, 115, 22];
  } else if (allPassed) {
    return [0, 0, 0];
  } else {
    return [160, 160, 160];
  }
}

export function generateMementoMoriPdf(groupedData: DecadeGroup[]) {
  const pdfWidth = 500;   // mm
  const pdfHeight = 700;  // mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight]
  });

  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 30;
  const marginBottom = 30;

  const contentWidth = pdfWidth - marginLeft - marginRight;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('MEMENTO MORI', pdfWidth / 2, marginTop, { align: 'center' });

  let currentY = marginTop + 20;

  const decadeFontSize = 12;
  const bubbleSize = 5;
  const bubbleGap = 2;

  const marginBelowLabel = 5;
  const marginAfterBubbles = 10;

  groupedData.forEach((decade) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(decadeFontSize);
    doc.text(decade.label, marginLeft, currentY);

    currentY += marginBelowLabel;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    let xPos = marginLeft;

    decade.groups.forEach((group) => {
      const [r, g, b] = getSimpleColorForGroup(group);
      doc.setFillColor(r, g, b);

      const radius = bubbleSize / 2;
      doc.circle(xPos + radius, currentY + radius, radius, 'F');

      xPos += bubbleSize + bubbleGap;

      if (xPos + bubbleSize > marginLeft + contentWidth) {
        xPos = marginLeft;
        currentY += (bubbleSize + bubbleGap);
      }
    });

    currentY += (bubbleSize + bubbleGap + marginAfterBubbles);
  });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  const quote = `"Not how long, but how well you have lived is the main thing"`;
  doc.text(quote, pdfWidth / 2, pdfHeight - marginBottom - 10, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SENECA', pdfWidth / 2, pdfHeight - marginBottom - 3, { align: 'center' });

  doc.save('memento_mori_internal.pdf');
}
