/* 共用的演示剧情与迷你引擎：四个界面样稿共用同一段内容，方便对比 */
window.STORY = {
  name: '塞德里克・阿斯蘭',
  chapter: '第一章・玻璃玫瑰溫室',
  bg: '../assets/bg_garden.jpg',
  faces: {
    default: '../assets/stand_ciel_default.png',
    shy: '../assets/stand_ciel_shy.png',
    hostile: '../assets/stand_ciel_hostile.png'
  },
  lines: [
    { who: '', text: '溫室的玻璃上落著細雨。我在這本書裡醒來的第三天，終於見到了他。', face: 'default' },
    { who: 'ciel', text: '「你就是新來的侍女？……手別碰那株玫瑰。」', face: 'hostile' },
    { who: '', text: '他的指尖停在花枝旁，像是怕驚動什麼。', face: 'default' },
    { choice: [
      { t: '「對不起，我只是覺得它快要凋謝了。」', aff: 2, face: 'shy',
        reply: [{ who: 'ciel', text: '「……你看得出來？連園丁都說它還能撐一個冬天。」' }] },
      { t: '「那你為什麼一個人待在這裡？」', aff: 1, face: 'hostile',
        reply: [{ who: 'ciel', text: '「與你無關。」', }, { who: '', text: '他別開了臉，耳尖卻有一點紅。' }] },
      { t: '默默把傘遞給他。', aff: 3, face: 'shy',
        reply: [{ who: '', text: '他愣了很久，才伸手接過去。' }, { who: 'ciel', text: '「……謝謝。」' }] }
    ]},
    { who: '', text: '雨還沒停。而這一章，才剛剛開始。', face: 'default' }
  ]
};

/* 迷你引擎 */
function createVN(h) {
  const S = window.STORY;
  let queue = S.lines.slice(), cur = null, aff = 0, waiting = false;
  function show(l) {
    cur = l;
    if (l.face) h.face(S.faces[l.face]);
    h.line({ speaker: l.who === 'ciel' ? S.name : '', text: l.text });
  }
  function next() {
    if (waiting) return;
    if (!queue.length) { queue = S.lines.slice(); aff = 0; h.aff(0, true); }
    const l = queue.shift();
    if (l.choice) { waiting = true; h.choices(l.choice); return; }
    show(l);
  }
  function choose(i, opts) {
    const c = opts[i];
    waiting = false;
    aff += c.aff; h.aff(aff);
    queue = c.reply.map(r => Object.assign({ face: c.face }, r)).concat(queue);
    h.choices(null);
    next();
  }
  return { next, choose, start: next };
}
