(function () {
  'use strict';
  const messageName = "miteras-kintai-helper-message";
  function isNumeric(c: string): boolean {
    return c >= '0' && c <= '9';
  }
  function parse_hhmm(s: string): number {
    if (s.length != 5 || s[2] != ':') {
      return 0;
    }
    if (!isNumeric(s[0]) || !isNumeric(s[1]) || !isNumeric(s[3]) || !isNumeric(s[4])) {
      return 0;
    }
    const hour = parseInt(s[0]) * 10 + parseInt(s[1]);
    const min = parseInt(s[3]) * 10 + parseInt(s[4]);
    return hour * 60 + min;
  }
  function hhmm(minute: number): string {
    let sign = '';
    if (minute < 0) {
      minute = -minute;
      sign = '-';
    }
    const m = minute % 60;
    const h = (minute - m) / 60;
    return `${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
  function enterTextToInput(input: HTMLInputElement | null, text: string): void {
    if (input == null) {
      return;
    }
    input.focus();
    input.value = text;
    // console.log(`enterTextToInput: ${text}`);
  }

  function messageHandler(options: { breaktime1: number, breaktime2: number, breaktime3: number, loginButtonAnimation: number }): void {
    // console.log("messageHandler: ", options);
    const inputSelector: { [name: string]: string } = {
      workTimeIn: "#work-time-in",
      workTimeOut: "#work-time-out",
      breakTime1In: "#breaktime1 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-in",
      breakTime1Out: "#breaktime1 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-out",
      breakTime2In: "#breaktime2 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-in",
      breakTime2Out: "#breaktime2 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-out",
      breakTime3In: "#breaktime3 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-in",
      breakTime3Out: "#breaktime3 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-out",
    };
    let input: { [name: string]: HTMLInputElement | null } = {};
    Object.entries(inputSelector).forEach(([key, value]) => {
      input[key] = document.querySelector<HTMLInputElement>(value);
    });

    const workTimeIn = input["workTimeIn"]?.value;
    const workTimeOut = input["workTimeOut"]?.value;
    if (workTimeIn == null || workTimeOut == null) {
      return;
    }
    // console.log(`勤務時間: ${workTimeIn} - ${workTimeOut}`)
    if (!isNumeric(workTimeIn[0])
      || !isNumeric(workTimeIn[1])
      || !isNumeric(workTimeIn[3])
      || !isNumeric(workTimeIn[4])
      || !isNumeric(workTimeOut[0])
      || !isNumeric(workTimeOut[1])
      || !isNumeric(workTimeOut[3])
      || !isNumeric(workTimeOut[4])) {
      //
      // 勤務時間が不正な値の場合、１回目と２回目の休憩時間を設定する
      //
      if (true) {
        const breakTimeInMinute = options.breaktime1;
        const breakTimeOutMinute = breakTimeInMinute + 45;
        enterTextToInput(input["breakTime1In"], hhmm(breakTimeInMinute));
        enterTextToInput(input["breakTime1Out"], hhmm(breakTimeOutMinute));
      }
      if (options.breaktime2 >= 0) {
        const breakTimeInMinute = options.breaktime2;
        const breakTimeOutMinute = breakTimeInMinute + 15;
        enterTextToInput(input["breakTime2In"], hhmm(breakTimeInMinute));
        enterTextToInput(input["breakTime2Out"], hhmm(breakTimeOutMinute));
      }
      else {
        enterTextToInput(input["breakTime2In"], "");
        enterTextToInput(input["breakTime2Out"], "");
      }

      input["breakTime1In"]?.focus();
      return;
    }

    let hour = Number(workTimeIn.substring(0, 2));
    let minute = Number(workTimeIn.substring(3, 5));
    const workTimeInMinute = hour * 60 + minute;
    hour = Number(workTimeOut.substring(0, 2));
    minute = Number(workTimeOut.substring(3, 5));
    const workTimeOutMinute = hour * 60 + minute;
    const workTimeMinutes = workTimeOutMinute - workTimeInMinute;
    // console.log(`勤務時間: ${workTimeMinutes}分`);

    //
    // Break time 1
    //
    let elaspedTime = 6 * 60;
    let breakTimeMinutes = workTimeMinutes - elaspedTime;
    breakTimeMinutes = Math.max(breakTimeMinutes, 0);
    breakTimeMinutes = Math.min(breakTimeMinutes, 45);
    if (breakTimeMinutes > 0) {
      // console.log("options.breaktime1", options.breaktime1);
      const breakTimeInMinute = Math.max(options.breaktime1, workTimeInMinute + 1);
      const breakTimeOutMinute = breakTimeInMinute + breakTimeMinutes;
      enterTextToInput(input["breakTime1In"], hhmm(breakTimeInMinute));
      enterTextToInput(input["breakTime1Out"], hhmm(breakTimeOutMinute));
    }

    //
    // Break time 2
    //
    elaspedTime = 8 * 60 + 45;
    breakTimeMinutes = workTimeMinutes - elaspedTime;
    breakTimeMinutes = Math.max(breakTimeMinutes, 0);
    breakTimeMinutes = Math.min(breakTimeMinutes, 15);
    if (breakTimeMinutes > 0) {
      let breakTimeInMinute = workTimeInMinute + elaspedTime;
      if (options.breaktime2 >= 0) {
        breakTimeInMinute = options.breaktime2;
      }
      let breakTimeOutMinute = breakTimeInMinute + breakTimeMinutes;
      if (workTimeOutMinute <= breakTimeOutMinute) {
        const delta = breakTimeOutMinute - workTimeOutMinute + 1;
        breakTimeInMinute -= delta;
        breakTimeOutMinute -= delta;
      }
      enterTextToInput(input["breakTime2In"], hhmm(breakTimeInMinute));
      enterTextToInput(input["breakTime2Out"], hhmm(breakTimeOutMinute));
    }
    else {
      enterTextToInput(input["breakTime2In"], "");
      enterTextToInput(input["breakTime2Out"], "");
    }

    //
    // Break time 3
    //
    if (options.breaktime3 === 1) {
      elaspedTime = 8 * 60 + 45 + 15 + 3 * 60;
      breakTimeMinutes = workTimeMinutes - elaspedTime;
      breakTimeMinutes = Math.max(breakTimeMinutes, 0);
      breakTimeMinutes = Math.min(breakTimeMinutes, 15);
      if (breakTimeMinutes > 0) {
        let breakTimeInMinute = workTimeInMinute + elaspedTime;
        let breakTimeOutMinute = breakTimeInMinute + breakTimeMinutes;
        if (workTimeOutMinute == breakTimeOutMinute) {
          breakTimeInMinute -= 1;
          breakTimeOutMinute -= 1;
        }
        enterTextToInput(input["breakTime3In"], hhmm(breakTimeInMinute));
        enterTextToInput(input["breakTime3Out"], hhmm(breakTimeOutMinute));
      }
    }
    else {
      enterTextToInput(input["breakTime3In"], "");
      enterTextToInput(input["breakTime3Out"], "");
    }

    input["breakTime1In"]?.focus();
  }
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === messageName) {
      // console.log("request.message:", request.message);
      chrome.storage.sync.get(
        {
          breaktime1: '705',
          breaktime2: '-1',
          breaktime3: '0',
          loginButtonAnimation: '0',
        }
      ).then(function (items) {
        const options = {
          breaktime1: Number(items.breaktime1),
          breaktime2: Number(items.breaktime2),
          breaktime3: Number(items.breaktime3),
          loginButtonAnimation: Number(items.loginButtonAnimation),
        };
        messageHandler(options);
        sendResponse({ message: "success" });
      }).catch(function (error) {
        // console.log(error);
        sendResponse({ message: "error" });
      });
      return true;
    }
  });

  // Show cumulative overtime hours
  function showCumulativeOvertimeHours() {
    if (!location.href.endsWith("/work-condition")) {
      return;
    }
    //
    // Add the header of the table
    //
    const head_tr = document.querySelector("#monthly-view-attendance-content > table > tbody > tr");
    if (head_tr == null) {
      return;
    }
    const head_th = head_tr.querySelector("th:nth-child(13)");
    if (head_th == null) {
      return;
    }
    const overtime = head_th.querySelector("div > span");
    if (overtime == null) {
      return;
    }
    console.log("overtime:", overtime);
    if (overtime.textContent != "残業") {
      console.log("Unknown overtime format.")
      return;
    }
    let new_th = head_th.cloneNode(true) as Element;
    head_tr.appendChild(new_th);
    const new_overtime = new_th.querySelector("div > span");
    if (new_overtime == null) {
      return;
    }
    new_overtime.textContent = "累計残業";

    //
    // Add the body of the table
    //
    const tbody = document.querySelector("#attendance-table-body > table > tbody");
    if (tbody == null) {
      return;
    }
    const trs = tbody.querySelectorAll("tr");
    if (trs == null) {
      return;
    }
    let cum_min = 0;
    trs.forEach(tr => {
      // 種別
      let text = tr.querySelector("td.table01__cell--cate > div")?.textContent;
      if (text == null) {
        return;
      }
      const worktype = text.trim();

      // 勤務合計
      text = tr.querySelector("td:nth-child(16)")?.textContent;
      if (text == null) {
        return;
      }
      const worktime_min = parse_hhmm(text);
      if (worktime_min === 0) {
        if (worktype === "全休(代休)") {
          cum_min -= 8 * 60;
        }
      } else {
        if (worktype === "所定休日出勤") {
          cum_min += worktime_min;
        } else {
          cum_min += worktime_min - 8 * 60;
        }
      }
      const cum_str = hhmm(cum_min);
      const new_td = document.createElement("td");
      new_td.className = "table01__cell--time";
      new_td.innerText = cum_str;
      tr.appendChild(new_td);
    });
  }
  showCumulativeOvertimeHours();


})();
