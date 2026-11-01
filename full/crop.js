// 시트를 화면별 PNG로 자름
const ff = require('ffmpeg-static'), { execFileSync } = require('child_process');
const M = ['M_welcome','M_home','M_preselect','M_bulgogi','M_dessert','M_plan','M_drink','M_champ','M_ent','M_her','M_sleeprem','M_sleep','M_mealrem','M_next','M_call','M_symptom','M_items','M_medconf','M_pc','M_fresh','M_pcconf','M_comfort','M_approach','M_cconf','M_inprog','M_done','M_landing'];
const C = ['C_seat12a','C_update','C_water','C_wash','C_assist','C_dash','C_queue','C_map','C_detail','C_log'];
const cut = (sheet, names, w, h, cols) => names.forEach((n, i) => execFileSync(ff, ['-y', '-loglevel', 'error', '-i', sheet, '-vf', `crop=${w}:${h}:${(i % cols) * w}:${Math.floor(i / cols) * h}`, `full/s/${n}.png`]));
cut('full/sheetM.png', M, 2030, 1144, 6);
cut('full/sheetC.png', C, 1920, 1536, 5);
console.log('ok');
