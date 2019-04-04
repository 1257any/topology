import { Node } from '../models/node';

// getWords: 拆分一段文本为单词数组。一个汉字算1个单词。
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

// getLines：计算绘制文字需要的行数
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
  console.log(lines);
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

  // tslint:disable-next-line:no-bitwise
  y = (y + (height - lineHeight * maxLineLen) / 2 - lineHeight / 2) << 0;
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
  ctx.beginPath();
  ctx.textAlign = 'center';
  fillText(
    ctx,
    getLines(ctx, getWords(node.text), node.width),
    // textAlign = 'center'，是基于x
    // tslint:disable-next-line:no-bitwise
    (node.textRect.x + node.textRect.width / 2) << 0,
    node.textRect.y,
    node.textRect.width,
    node.textRect.height,
    // tslint:disable-next-line:no-bitwise
    ((node.style.fontSize || 12) * 1.5) << 0
  );
}
