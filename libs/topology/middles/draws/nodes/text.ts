import { Node } from '../../../models/node';

// getWords: Get the word array from text. A single Chinese character is a word.
function getWords(txt) {
  const words = [];
  let word = '';
  for (let i = 0; i < txt.length; ++i) {
    const ch = txt[i].charCodeAt();
    if (ch < 33 || ch > 126) {
      if (word) {
        words.push(word);
        word = '';
      }
      words.push(txt[i]);
      continue;
    } else {
      word += txt[i];
    }
  }

  if (word) {
    words.push(word);
  }

  return words;
}

// getLines：Get lines of drawing text.
// words - the word array of text, to avoid spliting a word.
// maxWidth - the max width of the rect.
function getLines(ctx: CanvasRenderingContext2D, words: string[], maxWidth: number) {
  const lines = [];
  let currentLine = words[0];
  for (let i = 1; i < words.length; ++i) {
    const word = words[i];
    if (ctx.measureText(currentLine + word).width < maxWidth) {
      currentLine += word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export function fillText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  width: number,
  height: number,
  lineHeight: number,
  maxLineLen?: number
) {
  if (!maxLineLen || maxLineLen > lines.length) {
    maxLineLen = lines.length;
  }

  for (let i = 0; i < maxLineLen - 1; ++i) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }

  if (maxLineLen < lines.length) {
    let str = lines[maxLineLen - 1] + '...';
    if (ctx.measureText(str).width > width) {
      str = lines[maxLineLen - 1].substr(0, lines[maxLineLen - 1].length - 2) + '...';
    }
    ctx.fillText(str, x, y + (maxLineLen - 1) * lineHeight);
  } else {
    ctx.fillText(lines[maxLineLen - 1], x, y + (maxLineLen - 1) * lineHeight);
  }
}

export function text(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.save();
  ctx.beginPath();
  ctx.font = `${node.font.fontSize}px/${node.font.lineHeight} ${node.font.fontFamily}`;
  if (node.font.color) {
    ctx.fillStyle = node.font.color;
  }
  if (node.font.textAlign) {
    ctx.textAlign = node.font.textAlign;
  }
  if (node.font.textBaseline) {
    ctx.textBaseline = node.font.textBaseline;
  }

  const lines = getLines(ctx, getWords(node.text), node.textRect.width);
  const maxLineLen = node.textMaxLine || lines.length || 1;
  const lineHeight = (node.font.fontSize * node.font.lineHeight) << 0;

  // By default, the text is center aligned.
  let x = (node.textRect.x + node.textRect.width / 2) << 0;
  let y = (node.textRect.y + (node.textRect.height - lineHeight * maxLineLen) / 2 + (lineHeight * 4) / 7) << 0;
  switch (ctx.textAlign) {
    case 'left':
      x = node.textRect.x;
      break;
    case 'right':
      x = node.textRect.x + node.textRect.width;
      break;
  }
  switch (ctx.textBaseline) {
    case 'top':
      y = (node.textRect.y + (lineHeight - node.font.fontSize) / 2) << 0;
      break;
    case 'bottom':
      y = node.textRect.ey - lineHeight * lines.length + lineHeight;
      break;
  }
  fillText(ctx, lines, x, y, node.textRect.width, node.textRect.height, lineHeight, node.textMaxLine);
  ctx.restore();
}
