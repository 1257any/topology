import { Node } from '../../models/node';

// getWords: Get the word array from text. A single Chinese character is a word.
function getWords(txt: string) {
  const words = [];
  let word = '';
  for (let i = 0; i < txt.length; ++i) {
    const ch = txt.charCodeAt(i);
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
  if (!node.text) {
    return;
  }

  ctx.save();
  ctx.beginPath();
  ctx.font = `${node.font.fontSize}px/${node.font.lineHeight} ${node.font.fontFamily}`;
  if (node.font.color) {
    ctx.fillStyle = node.font.color;
  } else {
    ctx.fillStyle = ctx.strokeStyle;
  }
  if (node.font.textAlign) {
    ctx.textAlign = node.font.textAlign;
  }
  if (node.font.textBaseline) {
    ctx.textBaseline = node.font.textBaseline;
  }

  const textRect = node.getTextRect();

  const lines = getLines(ctx, getWords(node.text), textRect.width);
  const lineHeight = node.font.fontSize * node.font.lineHeight;
  let maxLineLen = node.textMaxLine;
  const rectLines = (textRect.height / lineHeight) << 0;
  if (!maxLineLen) {
    maxLineLen = lines.length > rectLines ? rectLines : lines.length;
  }

  // By default, the text is center aligned.
  let x = (textRect.x + textRect.width / 2) << 0;
  let y = (textRect.y + (textRect.height - lineHeight * maxLineLen) / 2 + (lineHeight * 4) / 7) << 0;
  switch (ctx.textAlign) {
    case 'left':
      x = textRect.x;
      break;
    case 'right':
      x = textRect.x + textRect.width;
      break;
  }
  switch (ctx.textBaseline) {
    case 'top':
      y = (textRect.y + (lineHeight - node.font.fontSize) / 2) << 0;
      break;
    case 'bottom':
      y = textRect.ey - lineHeight * lines.length + lineHeight;
      break;
  }
  fillText(ctx, lines, x, y, textRect.width, textRect.height, lineHeight, maxLineLen);
  ctx.restore();
}

export function iconfont(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (node.iconSize > 0) {
    ctx.font = `${node.iconSize}px ${node.iconFamily}`;
  } else if (node.iconRect.width > node.iconRect.height) {
    ctx.font = `${node.iconRect.height}px ${node.iconFamily}`;
  } else {
    ctx.font = `${node.iconRect.width}px ${node.iconFamily}`;
  }
  if (!node.iconColor) {
    node.iconColor = '#2f54eb';
  }
  ctx.fillStyle = node.iconColor;
  ctx.beginPath();
  ctx.fillText(
    node.icon,
    (node.iconRect.x + node.iconRect.width / 2) << 0,
    (node.iconRect.y + node.iconRect.height / 2) << 0
  );
  ctx.restore();
}
